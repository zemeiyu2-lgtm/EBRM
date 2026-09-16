const pw = require('../playwright-core');
const BASE = 'http://127.0.0.1:8094';
const STUB = `Object.defineProperty(window,'speechSynthesis',{configurable:true,writable:true,value:(function(){window.__spokeLog=[];window.__cancelCount=0;var vs=[{name:'EnUS',lang:'en-US',voiceURI:'en-us'},{name:'EnGB',lang:'en-GB',voiceURI:'en-gb'},{name:'Zh',lang:'zh-CN',voiceURI:'zh'}];return{getVoices:function(){return vs;},speak:function(u){window.__spokeLog.push({t:u.text,r:u.rate,l:u.lang,v:u.voice?u.voice.name:null});if(u.onstart)setTimeout(u.onstart,1);setTimeout(function(){if(u.onend)u.onend();},8);},cancel:function(){window.__cancelCount++;},pause:function(){},resume:function(){},addEventListener:function(){},removeEventListener:function(){}};})()});`;

(async () => {
  const b = await pw.chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 1400, height: 950 } });
  await ctx.addInitScript(STUB);
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGEERR', e.message));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('STUB CHECK:', await page.evaluate(() => ({
    supported: window.EBRM.Engine.Voice.supported,
    voices: window.EBRM.Engine.Voice.voices.length,
    raw: typeof window.speechSynthesis,
    n: window.speechSynthesis.getVoices().length
  })));

  await page.goto(BASE + '/john1.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  console.log('JOHN1 BOOT:', await page.evaluate(() => {
    const A = window.EBRM.App;
    return { mode: A.mode, book: A.sess.book, ch: A.sess.chapter, ui: A.sess.unitIndex, step: A.sess.step, keys: Object.keys(A.state.units), model: !!A.sess.curated, verses: A.sess.model.verses.length };
  }));

  await page.click('[data-act=learn]');
  await page.waitForTimeout(800);
  // answer+advance quickly through baseline only, then inspect
  await page.evaluate(() => {
    const block = Array.from(document.querySelectorAll('#learnBody .q-block')).find(b => !b.querySelector('.q-hint'));
    if (block) block.querySelector('.opt').click();
  });
  await page.waitForTimeout(300);
  console.log('AFTER 1 ANSWER:', await page.evaluate(() => {
    const A = window.EBRM.App;
    return { unit: A.currentUnit().id, answers: Object.keys(A.sess.answers).length, keys: Object.keys(A.state.units) };
  }));

  await page.evaluate(() => window.EBRM.Engine.markStep(window.EBRM.App.state, window.EBRM.App.currentUnit().id, 'baseline'));
  console.log('AFTER markStep:', await page.evaluate(() => Object.keys(window.EBRM.App.state.units)));

  await b.close();
})().catch(e => { console.error('FATAL', e.stack || e.message); process.exit(1); });
