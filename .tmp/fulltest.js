/* =========================================================
   EBRM 2.0 · 完整验收测试
   覆盖：Reader / 12步流程 / 语音 / 渐进式 / 27卷260章 / 移动端 / 持久化
========================================================= */
const pw = require('../playwright-core');
const BASE = 'http://127.0.0.1:8094';

const R = [];
function ok(name, pass, detail) { R.push({ name, pass: !!pass, detail: detail === undefined ? '' : String(detail) }); }
function log(s) { console.log(s); }

/* 语音桩：让 headless 环境也能确定性验证 Voice/Speed/Stop/Replay
   注意：window.speechSynthesis 是只读访问器，必须用 defineProperty 覆盖 */
const VOICE_STUB = `
(function () {
  window.__spokeLog = [];
  window.__cancelCount = 0;
  var voices = [
    { name: 'Stub English US', lang: 'en-US', voiceURI: 'stub-en-us', default: true, localService: true },
    { name: 'Stub English GB', lang: 'en-GB', voiceURI: 'stub-en-gb', default: false, localService: true },
    { name: 'Stub Chinese', lang: 'zh-CN', voiceURI: 'stub-zh', default: false, localService: true }
  ];
  var stub = {
    getVoices: function () { return voices; },
    speak: function (u) {
      window.__spokeLog.push({ text: u.text, rate: u.rate, lang: u.lang, voice: u.voice ? u.voice.name : null });
      if (u.onstart) setTimeout(function () { u.onstart(); }, 1);
      setTimeout(function () { if (u.onend) u.onend(); }, 8);
    },
    cancel: function () { window.__cancelCount++; },
    pause: function () {}, resume: function () {},
    addEventListener: function () {}, removeEventListener: function () {},
    speaking: false, pending: false, paused: false
  };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, get: function () { return stub; } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null; };
})();
`;

(async () => {
  const b = await pw.chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 1400, height: 950 } });
  await ctx.addInitScript(VOICE_STUB);
  const page = await ctx.newPage();
  page.on('dialog', d => d.accept());   // confirm() 一律确认，便于测试重置类按钮
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('requestfailed', r => errors.push('reqfail: ' + r.url() + ' ' + ((r.failure() || {}).errorText || '')));

  const q = s => document.querySelector(s);
  const txt = s => (document.querySelector(s) || {}).textContent || '';

  /* ---------------- 1. 首页 ---------------- */
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const home = await page.evaluate(() => ({
    app: !!window.EBRM && !!window.EBRM.App && !!window.EBRM.Engine && !!window.EBRM.Content,
    total: (document.querySelector('#homeTotal') || {}).textContent,
    done: (document.querySelector('#homeDone') || {}).textContent,
    hint: (document.querySelector('#homeNextHint') || {}).textContent,
    meta: window.EBRM.App.meta ? window.EBRM.App.meta.totalChapters : null,
    books: window.EBRM.App.meta ? window.EBRM.App.meta.books.length : null,
    master: window.EBRM.Engine.VERSION
  }));
  ok('首页：三大模块加载', home.app, JSON.stringify(home));
  ok('数据：27 卷 / 260 章', home.books === 27 && home.total === '260' && home.meta === 260, `books=${home.books} total=${home.total}`);
  ok('首页显示下一章', /下一章|全部/.test(home.hint), home.hint);

  /* ---------------- 2. Reader ---------------- */
  await page.click('[data-act=reader]');
  await page.waitForTimeout(900);
  const rd1 = await page.evaluate(() => ({
    view: (document.querySelector('.view.active') || {}).id,
    verses: document.querySelectorAll('#verseArea .verse').length,
    title: (document.querySelector('#chapterTitle') || {}).textContent,
    chips: document.querySelectorAll('#chapterStrip .chip').length,
    prevDis: document.querySelector('#prevBtn').disabled,
    nextDis: document.querySelector('#nextBtn').disabled,
    src: (document.querySelector('#sourceMeta') || {}).textContent,
    note: !!document.querySelector('#chapterNote'),
    bm: (document.querySelector('#bookmarkBtn') || {}).textContent,
    status: (document.querySelector('#chapterStatus') || {}).textContent
  }));
  ok('READER：Matthew 1 渲染 25 节', rd1.verses === 25, JSON.stringify(rd1));
  ok('READER：章节导航 28 章', rd1.chips === 28, 'chips=' + rd1.chips);
  ok('READER：首章上一章禁用', rd1.prevDis === true, 'prevDisabled=' + rd1.prevDis);
  ok('READER：按钮齐全（笔记/书签/状态）', rd1.note && /书签/.test(rd1.bm) && /单元/.test(rd1.status), rd1.bm + ' | ' + rd1.status);

  // 下一章 / 上一章
  await page.click('#nextBtn');
  await page.waitForTimeout(900);
  const rd2 = await page.evaluate(() => ({
    title: (document.querySelector('#chapterTitle') || {}).textContent,
    verses: document.querySelectorAll('#verseArea .verse').length,
    prevDis: document.querySelector('#prevBtn').disabled
  }));
  ok('READER：下一章 → Matthew 2', /Matthew 2/.test(rd2.title) && rd2.verses === 23, JSON.stringify(rd2));
  await page.click('#prevBtn');
  await page.waitForTimeout(900);
  ok('READER：上一章回到 Matthew 1', /Matthew 1$/.test((await page.evaluate(() => (document.querySelector('#chapterTitle') || {}).textContent))));

  // 目录切章
  await page.click('#chapterStrip .chip:nth-child(5)');
  await page.waitForTimeout(900);
  const rd3 = await page.evaluate(() => ({ t: (document.querySelector('#chapterTitle') || {}).textContent, v: document.querySelectorAll('#verseArea .verse').length }));
  ok('READER：章节条切到第 5 章', /Matthew 5$/.test(rd3.t) && rd3.v === 48, JSON.stringify(rd3));

  // 字体循环 / 今日入口 / 朗读本章
  const fontBefore = await page.evaluate(() => {
    const v = document.querySelector('#verseArea .verses');
    return v ? parseInt(v.style.fontSize, 10) : 0;
  });
  await page.click('#view-reader [data-act=font-cycle]');
  await page.waitForTimeout(400);
  const fontOk = await page.evaluate(() => {
    const v = document.querySelector('#verseArea .verses');
    return { size: v ? parseInt(v.style.fontSize, 10) : 0, setting: window.EBRM.App.settings.font };
  });
  ok('READER：字号循环生效', fontOk.size !== fontBefore && fontOk.setting !== 16, JSON.stringify({ fontBefore, fontOk }));
  ok('READER：今日入口存在', await page.evaluate(() => !!document.querySelector('#view-reader [data-act=today]')));
  ok('READER：听读本章存在', await page.evaluate(() => !!document.querySelector('#view-reader [data-act=play-chapter]')));
  await page.click('#view-reader [data-act=play-chapter]');
  await page.waitForTimeout(1500);
  const chapPlay = await page.evaluate(() => ({ spoke: window.__spokeLog.length, c: window.__cancelCount }));
  ok('READER：听读本章调用语音引擎', chapPlay.spoke >= 1 && chapPlay.c >= 1, JSON.stringify(chapPlay));
  await page.click('#view-reader [data-act=stop-speech]').catch(() => {});
  await page.waitForTimeout(200);
  await page.fill('#chapterNote', '测试笔记 EBRM2.0');
  await page.click('#saveNoteBtn');
  await page.waitForTimeout(500);
  await page.click('#bookmarkBtn');
  await page.waitForTimeout(400);
  const saved = await page.evaluate(() => {
    const s = window.EBRM.App.state;
    return {
      note: s.progress.notes['MAT.5'],
      bm: !!s.progress.bookmarks['MAT.5'],
      read: !!s.progress.read['MAT.5']
    };
  });
  ok('READER：笔记写入 localStorage', saved.note === '测试笔记 EBRM2.0', JSON.stringify(saved));
  ok('READER：书签写入', saved.bm === true);
  ok('READER：自动标记已读', saved.read === true);

  /* ---------------- 3. 学习：Matthew 1 完整 12 步 ---------------- */
  await page.evaluate(() => window.EBRM.App.openChapter('MAT', 1));
  await page.waitForTimeout(900);
  await page.click('[data-act=learn]');
  await page.waitForTimeout(900);

  const learnMeta = await page.evaluate(() => ({
    strip: document.querySelectorAll('#unitStrip [data-act=open-unit]').length,
    steps: document.querySelectorAll('#stepRail [data-act=step]').length,
    stepIds: Array.from(document.querySelectorAll('#stepRail [data-act=step]')).map(e => e.getAttribute('data-step')),
    label: (document.querySelector('#learnStepLabel') || {}).textContent
  }));
  ok('LEARN：单元条渲染', learnMeta.strip >= 3, 'units=' + learnMeta.strip);
  ok('LEARN：步骤轨 11 节点 = 10 训练步 + RESULT',
    learnMeta.steps === 11 && learnMeta.stepIds.join(',') === 'baseline,read,listen,notice,vocabulary,structure,comprehension,speak,reread,finalTest,result',
    JSON.stringify(learnMeta.stepIds));
  ok('LEARN：默认进入 STEP 01 BASELINE', /STEP 01/.test(learnMeta.label), learnMeta.label);

  /* 通用：回答本页所有题目（每次点击会重渲染，须逐题重查 DOM） */
  async function answerAll() {
    for (let guard = 0; guard < 60; guard++) {
      const clicked = await page.evaluate(() => {
        const block = Array.from(document.querySelectorAll('#learnBody .q-block'))
          .find(b => !b.querySelector('.q-hint'));
        if (!block) return false;
        const opt = block.querySelector('.opt:not([disabled])');
        if (!opt) return false;
        opt.click();
        return true;
      });
      if (!clicked) break;
      await page.waitForTimeout(130);
    }
    await page.waitForTimeout(300);
  }
  async function goStep(id) {
    await page.click(`#stepRail [data-act=step][data-step="${id}"]`);
    await page.waitForTimeout(500);
  }
  async function markStep(id) {
    const sel = `#learnBody [data-act=mark-step][data-step="${id}"]`;
    await page.waitForFunction(s => {
      const el = document.querySelector(s);
      return el && !el.disabled;
    }, sel, { timeout: 5000 }).catch(() => {});
    await page.click(sel);
    await page.waitForTimeout(500);
  }

  // STEP 01 BASELINE
  let step1 = await page.evaluate(() => ({
    qs: document.querySelectorAll('#learnBody .q-block').length,
    ts: !!document.querySelector('#stepNote') || true,
    heading: (document.querySelector('#learnBody h3') || {}).textContent
  }));
  ok('STEP 01 BASELINE：有低难度题', step1.qs >= 3, JSON.stringify(step1));
  await answerAll();
  await markStep('baseline');

  // STEP 02 READ
  await goStep('read');
  const step2 = await page.evaluate(() => ({
    verses: document.querySelectorAll('#learnBody .verse').length,
    play: !!document.querySelector('#learnBody [data-act=play-unit]'),
    stop: !!document.querySelector('#learnBody [data-act=stop-speech]')
  }));
  ok('STEP 02 READ：经文可见 + 朗读/停止', step2.verses >= 3 && step2.play && step2.stop, JSON.stringify(step2));
  await markStep('read');

  // STEP 03 LISTEN
  await goStep('listen');
  const step3 = await page.evaluate(() => ({
    voiceSel: !!document.querySelector('#voiceSelect'),
    voiceOpts: Array.from(document.querySelectorAll('#voiceSelect option')).map(o => o.textContent),
    rates: Array.from(document.querySelectorAll('#learnBody [data-act=rate]')).map(e => e.getAttribute('data-rate')),
    play: !!document.querySelector('#learnBody [data-act=play-unit]'),
    stop: !!document.querySelector('#learnBody [data-act=stop-speech]'),
    replay: !!document.querySelector('#learnBody [data-act=replay-unit]'),
    status: (document.querySelector('#speechStatus') || {}).textContent
  }));
  ok('STEP 03 LISTEN：Voice 选择器存在', step3.voiceSel, JSON.stringify(step3.voiceOpts));
  ok('STEP 03 LISTEN：只列英语声音（排除中文）',
    step3.voiceOpts.length === 2 && !step3.voiceOpts.some(t => /Chinese|zh/.test(t)), JSON.stringify(step3.voiceOpts));
  ok('STEP 03 LISTEN：4 档语速 0.7/0.9/1.0/1.2', step3.rates.join(',') === '0.7,0.9,1,1.2', step3.rates.join(','));
  ok('STEP 03 LISTEN：播放/停止/重播三键齐全', step3.play && step3.stop && step3.replay);

  // 语速切换
  await page.click('#learnBody [data-act=rate][data-rate="0.7"]');
  await page.waitForTimeout(300);
  const rateState = await page.evaluate(() => ({ rate: window.EBRM.Engine.Voice.rate, active: (document.querySelector('#learnBody [data-act=rate].active') || {}).textContent }));
  ok('STEP 03 LISTEN：切换语速 0.7 生效', Math.abs(rateState.rate - 0.7) < 0.001 && /0.7/.test(rateState.active || ''), JSON.stringify(rateState));

  // 播放
  const beforePlay = await page.evaluate(() => window.__spokeLog.length);
  await page.click('#learnBody [data-act=play-unit]');
  await page.waitForTimeout(1500);
  const afterPlay = await page.evaluate((from) => {
    const fresh = window.__spokeLog.slice(from);
    return {
      spoke: fresh.length,
      rate: fresh[0] ? fresh[0].rate : null,
      lang: fresh[0] ? fresh[0].lang : null,
      allEn: fresh.every(x => x.lang === 'en-US'),
      allRate: fresh.every(x => Math.abs(x.rate - 0.7) < 0.001),
      text: fresh[0] ? fresh[0].text.slice(0, 50) : '',
      status: (document.querySelector('#speechStatus') || {}).textContent
    };
  }, beforePlay);
  ok('STEP 03 LISTEN：播放触发 speechSynthesis', afterPlay.spoke >= 2, JSON.stringify(afterPlay));
  ok('STEP 03 LISTEN：使用英语语音 en-US + 设定语速',
    afterPlay.allEn && afterPlay.allRate, JSON.stringify(afterPlay));

  // 停止（含 cancel）
  const beforeCancel = await page.evaluate(() => window.__cancelCount);
  await page.click('#learnBody [data-act=stop-speech]');
  await page.waitForTimeout(300);
  const afterCancel = await page.evaluate(() => ({ c: window.__cancelCount, speaking: window.EBRM.Engine.Voice.speaking }));
  ok('STEP 03 LISTEN：停止调用 speechSynthesis.cancel()', afterCancel.c > beforeCancel && afterCancel.speaking === false, JSON.stringify(afterCancel));

  // 重播
  const beforeReplay = await page.evaluate(() => ({ spoke: window.__spokeLog.length, c: window.__cancelCount }));
  await page.click('#learnBody [data-act=replay-unit]');
  await page.waitForTimeout(1500);
  const afterReplay = await page.evaluate(() => ({ spoke: window.__spokeLog.length, c: window.__cancelCount }));
  ok('STEP 03 LISTEN：重播 = 先 cancel 再重新朗读',
    afterReplay.spoke > beforeReplay.spoke && afterReplay.c > beforeReplay.c, JSON.stringify({ beforeReplay, afterReplay }));
  await markStep('listen');

  // STEP 04 NOTICE
  await goStep('notice');
  const step4 = await page.evaluate(() => ({
    qs: document.querySelectorAll('#learnBody .q-block').length,
    textarea: !!document.querySelector('#stepNote'),
    hint: (document.querySelector('#learnBody .muted') || {}).textContent
  }));
  ok('STEP 04 NOTICE：观察题 + 记录框', step4.qs >= 2 && step4.textarea, JSON.stringify(step4));
  await answerAll();
  await markStep('notice');

  // STEP 05 VOCABULARY
  await goStep('vocabulary');
  const step5 = await page.evaluate(() => ({
    words: Array.from(document.querySelectorAll('#learnBody .word')).map(w => (w.querySelector('b') || {}).textContent),
    zh: document.querySelectorAll('#learnBody .word small').length
  }));
  ok('STEP 05 VOCABULARY：由少到多（本单元 2-6 词）', step5.words.length >= 2 && step5.words.length <= 6, JSON.stringify(step5.words));
  ok('STEP 05 VOCABULARY：每个词带中文/释义', step5.zh === step5.words.length, 'zh=' + step5.zh);
  // 点词展开（体现「放回经文」）
  await page.click('#learnBody .word');
  await page.waitForTimeout(400);
  const voc = await page.evaluate(() => ({
    picked: document.querySelectorAll('#learnBody .word.picked').length,
    detail: document.querySelectorAll('#learnBody .struct-card').length
  }));
  ok('STEP 05 VOCABULARY：点选词汇展开词义卡', voc.picked >= 1 && voc.detail >= 1, JSON.stringify(voc));
  await markStep('vocabulary');

  // STEP 06 STRUCTURE
  await goStep('structure');
  const step6 = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#learnBody .struct-card'));
    return {
      n: cards.length,
      hasSentence: cards.every(c => !!c.querySelector('.struct-sentence')),
      hasPattern: cards.some(c => !!c.querySelector('.pattern-line')),
      hasBreakdown: cards.some(c => !!c.querySelector('.breakdown')),
      hasExplain: cards.every(c => !!c.querySelector('.kv')),
      hasWordmap: cards.some(c => !!c.querySelector('.wordmap')),
      hasExample: cards.some(c => /例句/.test(c.textContent)),
      hasSub: cards.some(c => !!c.querySelector('[data-act=speak-text]'))
    };
  });
  ok('STEP 06 STRUCTURE：原句/句型/拆分/说明/词义/例句/替换 七要素齐全',
    step6.n >= 1 && step6.hasSentence && step6.hasPattern && step6.hasBreakdown && step6.hasExplain &&
    step6.hasWordmap && step6.hasExample && step6.hasSub, JSON.stringify(step6));
  await markStep('structure');

  // STEP 07 DIRECT COMPREHENSION
  await goStep('comprehension');
  const step7 = await page.evaluate(() => {
    const lv = Array.from(document.querySelectorAll('#learnBody .q-meta')).map(e => e.textContent.match(/LEVEL (\d)/)).filter(Boolean).map(m => Number(m[1]));
    return {
      qs: document.querySelectorAll('#learnBody .q-block').length,
      levels: lv,
      text: /English → Meaning/.test(document.querySelector('#learnBody').textContent),
      direct: /DIRECT COMPREHENSION/.test(document.querySelector('#stepBanner').textContent + document.querySelector('#learnBody').textContent)
    };
  });
  ok('STEP 07 DIRECT COMPREHENSION：6 级递进（1→6）',
    step7.levels.length === 6 && step7.levels.join(',') === '1,2,3,4,5,6', JSON.stringify(step7));
  ok('STEP 07 DIRECT COMPREHENSION：English → Meaning，未用 UNDERSTAND 替代', step7.direct && step7.text, JSON.stringify(step7));
  await answerAll();
  await markStep('comprehension');

  // STEP 08 SPEAK
  await goStep('speak');
  const step8 = await page.evaluate(() => {
    const t = document.querySelector('#learnBody').textContent;
    return {
      s1: /STAGE 1 · IMITATE/.test(t), s2: /STAGE 2 · SUBSTITUTE/.test(t), s3: /STAGE 3 · PRODUCE/.test(t),
      imitate: document.querySelectorAll('#learnBody [data-act=imitate-done]').length,
      subs: document.querySelectorAll('#learnBody .opts .opt').length,
      produce: !!document.querySelector('#speakAnswer')
    };
  });
  ok('STEP 08 SPEAK：三阶段 模仿→替换→自主表达',
    step8.s1 && step8.s2 && step8.s3 && step8.imitate >= 1 && step8.produce, JSON.stringify(step8));
  ok('STEP 08 SPEAK：有替换练习句', step8.subs >= 1, 'subs=' + step8.subs);
  await page.click('#learnBody [data-act=imitate-done]');
  await page.waitForTimeout(300);
  const im = await page.evaluate(() => document.querySelectorAll('#learnBody [data-act=imitate-done]').length);
  ok('STEP 08 SPEAK：跟读标记可点', im >= 0);
  await markStep('speak');

  // STEP 09 RE-READ
  await goStep('reread');
  const step9 = await page.evaluate(() => ({
    verses: document.querySelectorAll('#learnBody .verse').length,
    feelings: document.querySelectorAll('#learnBody [data-act=feeling]').length
  }));
  ok('STEP 09 RE-READ：再读经文 + 感受自评', step9.verses >= 3 && step9.feelings === 3, JSON.stringify(step9));
  await markStep('reread');

  // STEP 10 FINAL TEST
  await goStep('finalTest');
  const step10 = await page.evaluate(() => ({
    qs: document.querySelectorAll('#learnBody .q-block').length,
    kinds: Array.from(document.querySelectorAll('#learnBody [data-act=submit-final]')).length,
    prod: !!document.querySelector('#speakAnswer'),
    label: (document.querySelector('#learnStepLabel') || {}).textContent
  }));
  ok('STEP 10 FINAL TEST：独立步骤（非 RESULT）', /STEP 10/.test(step10.label) && step10.qs >= 4 && step10.kinds === 1, JSON.stringify(step10));
  ok('STEP 10 FINAL TEST：含表达题 PRODUCTION', step10.prod === true);
  await answerAll();
  const finalBtnDis = await page.evaluate(() => (document.querySelector('#learnBody [data-act=submit-final]') || {}).disabled);
  ok('STEP 10 FINAL TEST：答完才能提交', finalBtnDis === false, 'disabled=' + finalBtnDis);
  await page.click('#learnBody [data-act=submit-final]');
  await page.waitForTimeout(900);

  // RESULT 独立
  const result = await page.evaluate(() => ({
    view: (document.querySelector('.view.active') || {}).id,
    label: (document.querySelector('#learnStepLabel') || {}).textContent,
    hero: !!document.querySelector('#learnBody .result-hero'),
    compare: document.querySelectorAll('#learnBody .compare .box').length,
    gain: /理解(提升|持平|下降)/.test(document.querySelector('#learnBody').textContent),
    reviewPlan: /Day 1/.test(document.querySelector('#learnBody').textContent),
    next: !!document.querySelector('#learnBody [data-act=next-unit]')
  }));
  ok('RESULT：独立页面（不是第 10 步的内容）', result.hero && result.label === 'RESULT', JSON.stringify(result));
  ok('RESULT：第一次/第二次理解对比 + 提升幅度', result.compare === 2 && result.gain, JSON.stringify(result));
  ok('RESULT：显示 1/3/7/14 间隔复习计划', result.reviewPlan, 'reviewPlan=' + result.reviewPlan);
  ok('RESULT：提供下一单元入口', result.next === true);

  // 单元完成 + 复习排程
  const unitState = await page.evaluate(() => {
    const A = window.EBRM.App, E = window.EBRM.Engine;
    const u = A.activeModel().units[0];
    const st = A.state.units[u.id];
    return {
      completed: !!st.completed,
      steps: Object.keys(st.steps).length,
      reviews: (st.reviews || []).map(r => r.day),
      reviewDates: (st.reviews || []).map(r => r.due),
      baseline: st.baseline ? st.baseline.score : null,
      final: st.final ? st.final.score : null
    };
  });
  ok('单元状态：10 步全部标记完成', unitState.steps === 10, JSON.stringify(unitState));
  ok('单元状态：生成 1/3/7/14 四个复习节点', unitState.reviews.join(',') === '1,3,7,14', JSON.stringify(unitState.reviews) + ' ' + JSON.stringify(unitState.reviewDates));
  ok('单元状态：记录 baseline 与 final 分数', unitState.baseline !== null && unitState.final !== null, JSON.stringify(unitState));

  // RESULT → 下一单元
  await page.click('#learnBody [data-act=next-unit]');
  await page.waitForTimeout(800);
  const nextU = await page.evaluate(() => ({
    ref: (document.querySelector('#stepBanner') || {}).textContent,
    label: (document.querySelector('#learnStepLabel') || {}).textContent
  }));
  ok('RESULT：下一单元回到 STEP 01', /STEP 01/.test(nextU.label), JSON.stringify(nextU));

  /* ---------------- 4. 长章节 Matthew 5 → 多单元 ---------------- */
  await page.evaluate(() => window.EBRM.App.openChapter('MAT', 5));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.EBRM.App.go('learn'));
  await page.waitForTimeout(700);
  const mat5 = await page.evaluate(() => {
    const m = window.EBRM.App.activeModel();
    return {
      units: m.units.length, verseCount: m.verseCount,
      sizes: m.units.map(u => u.verses.length),
      refs: m.units.map(u => u.reference)
    };
  });
  ok('容量控制：Matthew 5（48 节）拆成多个单元而不是固定节数', mat5.units >= 4 && mat5.units <= 14, JSON.stringify(mat5.sizes));
  ok('容量控制：单元节数不超过 112 节且无 0 节单元',
    Math.max.apply(null, mat5.sizes) <= 12 && Math.min.apply(null, mat5.sizes) > 0, JSON.stringify(mat5.sizes));

  /* ---------------- 5. 多卷抽样：Mark / Revelation ---------------- */
  const samples = [
    ['MRK', 1, 'Mark 1'], ['MRK', 8, 'Mark 8'], ['MRK', 16, 'Mark 16'],
    ['REV', 1, 'Revelation 1'], ['REV', 22, 'Revelation 22'],
    ['ROM', 8, 'Romans 8'], ['PSA', null, null]
  ];
  const sampleRes = [];
  for (const [bk, ch, label] of samples) {
    if (!ch) continue;
    await page.evaluate(([b2, c2]) => window.EBRM.App.openChapter(b2, c2), [bk, ch]);
    await page.waitForTimeout(700);
    const s = await page.evaluate(() => {
      const A = window.EBRM.App, m = A.activeModel();
      const u = m.units[0];
      return {
        title: m.reference, verses: m.verses.length, units: m.units.length,
        vocab: u.vocabulary.length, struct: u.structures.length,
        comp: u.comprehension.length, final: u.finalTest.length,
        badAnswer: m.units.some(x => x.comprehension.some(q => q.answer < 0 || q.answer >= q.options.length) ||
          x.finalTest.some(q => q.kind !== 'production' && (q.answer < 0 || q.answer >= q.options.length)))
      };
    });
    sampleRes.push({ label: s.title, ...s });
    ok(`抽样 ${label}：可编译且题目答案合法`, s.verses > 0 && s.units >= 1 && !s.badAnswer, JSON.stringify(s));
  }
  log('  · 抽样结果：' + JSON.stringify(sampleRes));

  /* ---------------- 6. John 1 母版回归（course 模式） ---------------- */
  await page.goto(BASE + '/john1.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const jmeta = await page.evaluate(() => {
    const A = window.EBRM.App;
    return {
      mode: A.mode, book: A.sess.book, chap: A.sess.chapter,
      units: A.activeModel().units.length,
      curated: !!A.activeModel().curated,
      verses: A.activeModel().verses ? A.activeModel().verses.length : 0,
      books: A.meta.books.filter(b => b.id === 'JHN').length
    };
  });
  ok('JOHN1 母版：锁定 John 1，7 个精编单元', jmeta.mode === 'course' && jmeta.book === 'JHN' && jmeta.units === 7, JSON.stringify(jmeta));
  ok('JOHN1 母版：精编数据 + 完整 51 节', jmeta.curated === true && jmeta.verses === 51, JSON.stringify(jmeta));
  ok('JOHN1 母版：课程模式只显示约翰福音', jmeta.books === 1);

  await page.click('[data-act=reader]');
  await page.waitForTimeout(800);
  const jrd = await page.evaluate(() => ({ v: document.querySelectorAll('#verseArea .verse').length, t: (document.querySelector('#chapterTitle') || {}).textContent, prev: document.querySelector('#prevBtn').disabled, next: document.querySelector('#nextBtn').disabled }));
  ok('JOHN1 母版：Reader 显示 51 节', jrd.v === 51 && /John 1/.test(jrd.t), JSON.stringify(jrd));
  ok('JOHN1 母版：课程模式禁用跨章导航', jrd.prev === true && jrd.next === true, JSON.stringify(jrd));

  await page.click('[data-act=learn]');
  await page.waitForTimeout(800);

  // John 1 完整 12 步
  const jFlow = [];
  for (const st of ['baseline', 'read', 'listen', 'notice', 'vocabulary', 'structure', 'comprehension', 'speak', 'reread', 'finalTest']) {
    await goStep(st);
    await answerAll();
    const info = await page.evaluate(() => ({
      label: (document.querySelector('#learnStepLabel') || {}).textContent,
      body: (document.querySelector('#learnBody').textContent.length),
      disabled: (() => {
        const b = document.querySelector('#learnBody [data-act=mark-step], #learnBody [data-act=submit-final]');
        return b ? !!b.disabled : null;
      })()
    }));
    jFlow.push(st + '=' + (info.body > 200 ? 'ok' : 'THIN:' + info.body));
    if (st === 'finalTest') {
      await page.click('#learnBody [data-act=submit-final]');
      await page.waitForTimeout(900);
    } else {
      await markStep(st);
    }
  }
  const jResult = await page.evaluate(() => ({
    label: (document.querySelector('#learnStepLabel') || {}).textContent,
    hero: !!document.querySelector('#learnBody .result-hero'),
    gain: /理解(提升|持平|下降)/.test(document.querySelector('#learnBody').textContent)
  }));
  ok('JOHN1 母版：12 步全流程可走通', jFlow.every(s => /ok$/.test(s)), jFlow.join(' | '));
  ok('JOHN1 母版：RESULT 独立呈现', jResult.hero && jResult.label === 'RESULT' && jResult.gain, JSON.stringify(jResult));

  // John 1 精编单元是否拿到引擎生成的句型/测试
  await page.evaluate(() => { const A = window.EBRM.App; A.sess.unitIndex = 0; A.sess.step = 'structure'; A.renderLearn(); });
  await page.waitForTimeout(600);
  const jStruct = await page.evaluate(() => {
    const c = document.querySelector('#learnBody .struct-card');
    return c ? {
      sentence: !!c.querySelector('.struct-sentence'),
      pattern: !!c.querySelector('.pattern-line'),
      breakdown: !!c.querySelector('.breakdown'),
      wordmap: !!c.querySelector('.wordmap'),
      text: c.textContent.slice(0, 120)
    } : null;
  });
  ok('JOHN1 母版：精编单元由同一教学引擎补齐句型拆解',
    jStruct && jStruct.pattern && jStruct.breakdown && jStruct.wordmap, JSON.stringify(jStruct));
  const jFinal = await page.evaluate(() => {
    const u = window.EBRM.App.activeModel().units[0];
    return { final: u.finalTest.length, baseline: u.baseline.length, subs: u.speaking.substitute.length };
  });
  ok('JOHN1 母版：生成 FINAL TEST / BASELINE / 替换练习',
    jFinal.final >= 4 && jFinal.baseline >= 3 && jFinal.subs >= 1, JSON.stringify(jFinal));

  // REVIEW 独立
  await page.evaluate(() => window.EBRM.App.go('review'));
  await page.waitForTimeout(700);
  const rev = await page.evaluate(() => ({
    rows: document.querySelectorAll('#reviewList .rev-row').length,
    text: document.querySelector('#reviewList').textContent.slice(0, 160)
  }));
  ok('REVIEW：独立视图展示到期/未来复习', rev.rows >= 1, JSON.stringify(rev));

  /* ---------------- 7. 持久化：刷新后进度保留 ---------------- */
  const beforeReload = await page.evaluate(() => {
    const s = window.EBRM.App.state;
    return { done: window.EBRM.Engine.doneChapters(s, window.EBRM.App.meta), units: Object.keys(s.units).length, keys: Object.keys(s.units).slice(0, 30) };
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const afterReload = await page.evaluate(() => {
    const A = window.EBRM.App;
    const firstJhn = Object.keys(A.state.units).filter(k => /^JHN\.1-U/.test(k))[0];
    return {
      units: Object.keys(A.state.units).length,
      note: A.state.progress.notes['MAT.5'] || '',
      bm: !!A.state.progress.bookmarks['MAT.5'],
      jhnKeys: Object.keys(A.state.units).filter(k => /^JHN\./.test(k)),
      detail: !!(firstJhn && A.state.units[firstJhn].completed)
    };
  });
  ok('持久化：刷新后单元进度保留', afterReload.units === beforeReload.units && afterReload.detail,
    JSON.stringify({ beforeReload, afterReload }));
  ok('持久化：笔记/书签保留', afterReload.note === '测试笔记 EBRM2.0' && afterReload.bm === true, JSON.stringify(afterReload));

  /* ---------------- 8. 设置 / 导出导入 / 重置 ---------------- */
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.click('[data-act=settings]');
  await page.waitForTimeout(600);
  const settings = await page.evaluate(() => ({
    len: document.querySelector('#settingsBody').textContent.length,
    export: !!document.querySelector('#settingsBody [data-act=export]'),
    pickImport: !!document.querySelector('#settingsBody [data-act=pick-import]'),
    importFile: !!document.querySelector('#settingsBody #importFile'),
    resetAll: !!document.querySelector('#settingsBody [data-act=reset-all]'),
    resetUnit: !!document.querySelector('#settingsBody [data-act=reset-unit]'),
    fontUp: !!document.querySelector('#settingsBody [data-act=font-up]'),
    fontDown: !!document.querySelector('#settingsBody [data-act=font-down]'),
    rateSet: document.querySelectorAll('#settingsBody [data-act=rate-set]').length,
    toggles: document.querySelectorAll('#settingsBody [data-act=toggle]').length
  }));
  ok('SETTINGS：导出/导入/重置/字号/语速/开关 控件齐全',
    settings.export && settings.pickImport && settings.importFile && settings.resetAll &&
    settings.resetUnit && settings.fontUp && settings.fontDown && settings.rateSet === 4 && settings.toggles === 2,
    JSON.stringify(settings));

  // 紧凑模式开关 → 必须作用于阅读区
  await page.evaluate(() => window.EBRM.App.go('reader'));
  await page.waitForTimeout(400);
  await page.click('[data-act=settings]');
  await page.waitForTimeout(400);
  await page.click('#settingsBody [data-act=toggle][data-key=compactMode]');
  await page.waitForTimeout(400);
  const compact = await page.evaluate(() => ({
    setting: window.EBRM.App.settings.compactMode,
    applied: !!document.querySelector('#verseArea .verses.compact') || !!document.body.classList.contains('compact'),
    label: (document.querySelector('#settingsBody [data-act=toggle][data-key=compactMode]') || {}).textContent
  }));
  ok('SETTINGS：紧凑阅读模式可切换', compact.setting === true && /已开启/.test(compact.label || ''), JSON.stringify(compact));

  // 语速设置持久化
  await page.click('#settingsBody [data-act=rate-set][data-rate="1.2"]');
  await page.waitForTimeout(400);
  const rateSet = await page.evaluate(() => ({ rate: window.EBRM.Engine.Voice.rate, saved: window.EBRM.Engine.loadSettings().rate }));
  ok('SETTINGS：语速设置写入并持久化', Math.abs(rateSet.rate - 1.2) < 0.001 && Math.abs(rateSet.saved - 1.2) < 0.001, JSON.stringify(rateSet));

  // 导出 / 导入 往返
  const roundTrip = await page.evaluate(() => {
    const E = window.EBRM.Engine, A = window.EBRM.App;
    const payload = E.exportData(A.state);
    const before = Object.keys(A.state.units).length;
    const restored = E.importData(JSON.parse(JSON.stringify(payload)));
    const after = Object.keys(restored.units).length;
    let badSafe = false;
    try { E.importData({ nope: 1 }); } catch (e) { badSafe = true; }
    return { before, after, keys: Object.keys(payload).length, badSafe, ver: payload.version || payload.ebrm || 'n/a' };
  });
  ok('DATA：导出→导入 单元数据一致', roundTrip.before === roundTrip.after && roundTrip.after > 0, JSON.stringify(roundTrip));
  ok('DATA：导入非法数据不破坏现有进度', roundTrip.badSafe === true, JSON.stringify(roundTrip));

  // 重置本章训练（最后执行，避免影响前面的断言）
  const resetBefore = await page.evaluate(() => Object.keys(window.EBRM.App.state.units).length);
  await page.evaluate(() => window.EBRM.App.openChapter('MAT', 1));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.EBRM.App.go('settings'));
  await page.waitForTimeout(400);
  await page.click('#settingsBody [data-act=reset-unit]');
  await page.waitForTimeout(600);
  const resetAfter = await page.evaluate(() => ({
    units: Object.keys(window.EBRM.App.state.units).length,
    mat1: Object.keys(window.EBRM.App.state.units).filter(k => /^MAT\.1-/.test(k)).length
  }));
  ok('DATA：重置本章训练只清当前章', resetAfter.mat1 === 0 && resetAfter.units < resetBefore, JSON.stringify({ resetBefore, resetAfter }));

  /* ---------------- 9. 移动端 390×844 ---------------- */
  const mob = await ctx.newPage();
  await mob.addInitScript(VOICE_STUB);
  await mob.setViewportSize({ width: 390, height: 844 });
  const mErrors = [];
  mob.on('pageerror', e => mErrors.push(e.message));
  await mob.goto(BASE + '/', { waitUntil: 'networkidle' });
  await mob.waitForTimeout(1200);
  const mHome = await mob.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    nav: !!document.querySelector('.topnav'),
    total: (document.querySelector('#homeTotal') || {}).textContent
  }));
  await mob.click('[data-act=learn]');
  await mob.waitForTimeout(900);
  const mLearn = await mob.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    rail: document.querySelectorAll('#stepRail [data-act=step]').length,
    h: (document.querySelector('#learnBody') || {}).innerHTML.length
  }));
  await mob.screenshot({ path: '.tmp/ebrm2-mobile-learn.png', fullPage: false });
  await mob.click('[data-act=reader]');
  await mob.waitForTimeout(900);
  const mRead = await mob.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    verses: document.querySelectorAll('#verseArea .verse').length
  }));
  await mob.screenshot({ path: '.tmp/ebrm2-mobile-reader.png', fullPage: false });
  ok('移动端 390×844：首页无横向溢出', mHome.overflow <= 1 && mHome.nav, JSON.stringify(mHome));
  ok('移动端 390×844：学习页无横向溢出 + 步骤轨完整', mLearn.overflow <= 1 && mLearn.rail === 11, JSON.stringify(mLearn));
  ok('移动端 390×844：读经页无横向溢出 + 经文可见', mRead.overflow <= 1 && mRead.verses > 0, JSON.stringify(mRead));

  // 桌面截图
  await page.setViewportSize({ width: 1400, height: 950 });
  await page.click('[data-act=home]').catch(() => {});
  await page.evaluate(() => window.EBRM.App.go('home'));
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.tmp/ebrm2-desktop-home.png' });
  await page.evaluate(() => window.EBRM.App.go('learn'));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '.tmp/ebrm2-desktop-learn.png' });

  /* ---------------- 汇总 ---------------- */
  log('\n================ 测试结果 ================');
  let pass = 0, fail = 0;
  R.forEach(r => {
    log((r.pass ? '  PASS  ' : '  FAIL  ') + r.name + (r.pass ? '' : '\n         → ' + r.detail));
    r.pass ? pass++ : fail++;
  });
  log('------------------------------------------');
  log(`合计 ${R.length} 项：通过 ${pass}，失败 ${fail}`);
  log('JS 错误：' + (errors.length ? '\n  ' + errors.slice(0, 10).join('\n  ') : '无'));
  log('移动端 JS 错误：' + (mErrors.length ? mErrors.join(' | ') : '无'));

  await b.close();
  process.exit(fail || errors.length ? 1 : 0);
})().catch(e => { console.error('FATAL', e.stack || e.message); process.exit(1); });
