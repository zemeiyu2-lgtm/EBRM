/* 冒烟测试：页面能否加载、经文能否渲染 */
const pw = require('../playwright-core');

(async () => {
  const b = await pw.chromium.launch({ channel: 'chrome', headless: true });
  const page = await b.newPage({ viewport: { width: 1400, height: 950 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('requestfailed', r => errors.push('reqfail: ' + r.url() + ' ' + (r.failure() || {}).errorText));

  await page.goto('http://127.0.0.1:8094/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const info = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    return {
      hasApp: !!window.EBRM && !!window.EBRM.App,
      view: (document.querySelector('.view.active') || {}).id,
      homeDone: (q('#homeDone') || {}).textContent,
      homeTotal: (q('#homeTotal') || {}).textContent,
      homeHint: (q('#homeNextHint') || {}).textContent,
      fatal: q('#fatalBox') ? q('#fatalBox').className : '',
      stepHtml: (q('#learnBody') || {}).innerHTML ? 'has' : 'empty'
    };
  });
  console.log('HOME:', JSON.stringify(info, null, 1));

  // 进入读经
  await page.click('[data-act=reader]');
  await page.waitForTimeout(1200);
  const reader = await page.evaluate(() => ({
    view: (document.querySelector('.view.active') || {}).id,
    verses: document.querySelectorAll('.verse').length,
    title: (document.querySelector('#chapterTitle') || {}).textContent,
    books: document.querySelectorAll('[data-act=book]').length,
    chapters: document.querySelectorAll('[data-act=chapter]').length,
    prevDisabled: document.querySelector('#prevBtn') ? document.querySelector('#prevBtn').disabled : null,
    status: (document.querySelector('#chapterStatus') || {}).textContent
  }));
  console.log('READER:', JSON.stringify(reader, null, 1));

  // 进入学习
  await page.click('[data-act=learn]');
  await page.waitForTimeout(1200);
  const learn = await page.evaluate(() => ({
    view: (document.querySelector('.view.active') || {}).id,
    label: (document.querySelector('#learnStepLabel') || {}).textContent,
    title: (document.querySelector('#learnTitle') || {}).textContent,
    units: document.querySelectorAll('[data-act=open-unit]').length,
    steps: document.querySelectorAll('[data-act=step]').length,
    banner: (document.querySelector('#stepBanner') || {}).textContent.slice(0, 90),
    bodyLen: (document.querySelector('#learnBody') || {}).innerHTML.length,
    opts: document.querySelectorAll('#learnBody .opt').length
  }));
  console.log('LEARN:', JSON.stringify(learn, null, 1));

  if (errors.length) console.log('ERRORS:\n' + errors.slice(0, 8).join('\n'));
  else console.log('ERRORS: none');

  await page.screenshot({ path: '.tmp/smoke-home.png' });
  await b.close();
})().catch(e => { console.error('FATAL', e.stack || e.message); process.exit(1); });
