/* 全量扫描：27 卷 260 章逐章在真实浏览器中打开，验证经文渲染与零 JS 错误 */
const pw = require('../playwright-core');
const BASE = 'http://127.0.0.1:8094';

(async () => {
  const b = await pw.chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('requestfailed', r => errors.push('reqfail: ' + r.url()));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const books = await page.evaluate(() => window.EBRM.App.meta.books.map(x => ({ id: x.id, name: x.name, chapters: x.chapters })));
  let totalChapters = 0, badChapters = 0, totalUnits = 0, totalVerses = 0;
  const badList = [];

  for (const bk of books) {
    for (let c = 1; c <= bk.chapters; c++) {
      totalChapters++;
      try {
        const r = await page.evaluate(([id, ch]) => window.EBRM.App.openChapter(id, ch).then(() => {
          const A = window.EBRM.App, m = A.activeModel();
          const u = m.units[0];
          return {
            ref: m.reference, verses: (m.verses || []).length, units: m.units.length,
            vocab: u.vocabulary.length, comp: u.comprehension.length,
            final: u.finalTest.filter(q => q.kind !== 'production').length,
            bad: m.units.some(x => x.comprehension.some(q => !(q.answer >= 0 && q.answer < q.options.length)))
          };
        }), [bk.id, c]);
        totalUnits += r.units;
        totalVerses += r.verses;
        if (!r.verses || !r.units || r.comp !== 6 || r.final < 3 || r.bad) {
          badChapters++; badList.push(bk.id + '.' + c + ' ' + JSON.stringify(r));
        }
      } catch (e) {
        badChapters++; badList.push(bk.id + '.' + c + ' EXC ' + e.message);
      }
    }
    process.stdout.write(`  ${bk.id} (${bk.chapters} 章) 完成\n`);
  }

  console.log('\n================ 全量扫描结果 ================');
  console.log('书卷数:', books.length, '（应为 27）');
  console.log('章节数:', totalChapters, '（应为 260）');
  console.log('单元总数:', totalUnits);
  console.log('经文节总数:', totalVerses);
  console.log('异常章节:', badChapters, badList.length ? '\n  ' + badList.slice(0, 10).join('\n  ') : '');
  console.log('JS 错误:', errors.length ? '\n  ' + errors.slice(0, 10).join('\n  ') : '无');

  /* 边界：最后一章的下一章按钮应禁用 */
  await page.evaluate(() => window.EBRM.App.openChapter('REV', 22));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.EBRM.App.go('reader'));
  await page.waitForTimeout(500);
  const edge = await page.evaluate(() => ({
    title: (document.querySelector('#chapterTitle') || {}).textContent,
    verses: document.querySelectorAll('#verseArea .verse').length,
    nextDisabled: document.querySelector('#nextBtn').disabled
  }));
  console.log('边界 REV 22（末章）:', JSON.stringify(edge));

  await b.close();
  const fail = badChapters || errors.length || books.length !== 27 || totalChapters !== 260;
  console.log(fail ? '\n结论：存在问题' : '\n结论：27 卷 / 260 章全部通过');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FATAL', e.stack || e.message); process.exit(1); });
