/* 桌面/移动端视觉验证：逐视图截图 */
const pw = require('../playwright-core');
const BASE = 'http://127.0.0.1:8094';
const STUB = require('fs').readFileSync(__dirname + '/stub.js', 'utf8');

(async () => {
  const b = await pw.chromium.launch({ channel: 'chrome', headless: true });
  for (const [name, vp] of [['desktop', { width: 1400, height: 950 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await b.newContext({ viewport: vp });
    await ctx.addInitScript(STUB);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);

    for (const v of ['home', 'reader', 'learn', 'review', 'plan', 'settings']) {
      await page.evaluate(vv => window.EBRM.App.go(vv), v);
      await page.waitForTimeout(700);
      const info = await page.evaluate(() => ({
        active: (document.querySelector('.view.active') || {}).id,
        navActive: (document.querySelector('.topnav .active') || {}).textContent,
        bodyLen: (document.querySelector('.view.active') || {}).innerHTML.length,
        text: (document.querySelector('.view.active') || {}).textContent.replace(/\s+/g, ' ').slice(0, 60)
      }));
      console.log(`[${name}] ${v}: active=${info.active} nav=${info.navActive} len=${info.bodyLen} | ${info.text}`);
      await page.screenshot({ path: `.tmp/vis-${name}-${v}.png` });
    }
    /* 学习页关键步骤 */
    await page.evaluate(() => window.EBRM.App.go('learn'));
    await page.waitForTimeout(600);
    for (const st of ['read', 'listen', 'structure', 'comprehension', 'speak', 'finalTest']) {
      await page.evaluate(s => {
        const A = window.EBRM.App; A.sess.step = s; A.renderLearn();
      }, st);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `.tmp/vis-${name}-step-${st}.png` });
    }
    await page.evaluate(() => { const A = window.EBRM.App; A.sess.step = 'result'; A.renderLearn(); });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `.tmp/vis-${name}-step-result.png` });
    console.log(`[${name}] JS错误:`, errs.length ? errs.join(' | ') : '无');
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error('FATAL', e.stack || e.message); process.exit(1); });
