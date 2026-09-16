/* EBRM production audit: syntax, data, button binding, references */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('PASS', name); }
  catch (e) { failures++; console.log('FAIL', name, '::', e.message); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const html = fs.readFileSync('index.html', 'utf8');

/* 1. JS syntax: inline script + sw.js + app.js */
check('syntax: index.html inline script', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  assert(m, 'script tag not found');
  const f = path.join(os.tmpdir(), 'ebrm_inline.js');
  fs.writeFileSync(f, m[1]);
  execFileSync(process.execPath, ['--check', f]);
});
check('syntax: sw.js', () => {
  execFileSync(process.execPath, ['--check', 'sw.js']);
});
check('syntax: app.js (john1)', () => {
  execFileSync(process.execPath, ['--check', 'app.js']);
});

/* 2. manifest JSON */
check('json: manifest.json parses', () => {
  JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
});

/* 3. scripture data: 27 books / 260 chapters / key chapters */
const data = JSON.parse(fs.readFileSync('data/nt-engwebp.json', 'utf8'));
check('data: 27 books / 260 chapters', () => {
  assert(Array.isArray(data.books) && data.books.length === 27, 'books != 27');
  let chapters = 0;
  for (const b of data.books) for (const c of Object.keys(b.chapters)) {
    assert(Array.isArray(b.chapters[c]) && b.chapters[c].length > 0, b.id + ' ' + c + ' empty');
    chapters++;
  }
  assert(chapters === 260, 'chapters = ' + chapters + ' != 260');
});
check('data: MAT 1 readable', () => {
  const v = data.books.find(b => b.id === 'MAT').chapters['1'];
  assert(v.length >= 20 && /genealogy|Jesus/.test(v[0].text), 'MAT1 bad');
});
check('data: JHN 1 readable', () => {
  const v = data.books.find(b => b.id === 'JHN').chapters['1'];
  assert(/In the beginning was the Word/.test(v[0].text), 'JHN1 bad');
});
check('data: REV 22 readable', () => {
  const v = data.books.find(b => b.id === 'REV').chapters['22'];
  assert(v.length >= 15, 'REV22 too short');
});
check('data: book chapter counts match BOOKS table', () => {
  const m = html.match(/const BOOKS = \[([\s\S]*?)\];/);
  assert(m, 'BOOKS not found');
  const counts = [...m[1].matchAll(/\["([A-Z0-9]+)","([^"]+)","([^"]+)",(\d+)\]/g)];
  assert(counts.length === 27, 'BOOKS entries != 27');
  let total = 0;
  for (const [, id, en, zh, n] of counts) {
    const b = data.books.find(x => x.id === id);
    assert(b, 'data missing ' + id);
    assert(b.name === en, 'name mismatch ' + id);
    assert(Object.keys(b.chapters).length === +n, id + ' chapter count mismatch');
    total += +n;
  }
  assert(total === 260, 'total chapters != 260');
});

/* 4. button audit: every $() id exists in HTML; every addEventListener target exists */
check('buttons: all referenced IDs exist in HTML', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const ids = new Set([...m.matchAll(/\$\('([^']+)'\)/g)].map(x => x[1]));
  for (const id of ids) {
    if (['baseLevel','baseNote','noticeNote','structureNote','understandNote','rereadNote'].includes(id)) continue; /* 动态生成 */
    assert(new RegExp('id="' + id + '"').test(html), 'missing #' + id);
  }
});
check('buttons: addEventListener targets exist', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const targets = [...m.matchAll(/\$\('([^']+)'\)\.addEventListener/g)].map(x => x[1]);
  assert(targets.length >= 20, 'too few addEventListener bindings: ' + targets.length);
  for (const id of targets) assert(new RegExp('id="' + id + '"').test(html), 'addEventListener on missing #' + id);
});
check('buttons: no inline onclick in index.html', () => {
  assert(!/onclick=/.test(html), 'inline onclick found');
});
check('buttons: all data-action values handled', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const used = new Set([...m.matchAll(/data-action="([a-z-]+)"/g)].map(x => x[1]));
  const handled = new Set([...m.matchAll(/act === '([a-z-]+)'/g)].map(x => x[1]));
  /* 动态生成的 data-action 在模板字符串里 */
  const dynamic = new Set([...m.matchAll(/data-action=\\"([a-z-]+)\\"/g)].map(x => x[1]));
  for (const a of used) if (a !== 'reload' && a !== 'reload-page' && a !== 'open-review' && a !== 'complete-review' && a !== 'toggle-word')
    assert(handled.has(a), 'unhandled action: ' + a);
  for (const a of dynamic) assert(handled.has(a) || ['reload','reload-page','open-review','complete-review'].includes(a) || handled.size === 0 || m.includes("act === '" + a + "'"), 'unhandled dynamic action: ' + a);
});
check('buttons: single definition of core functions', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/)[1];
  for (const fn of ['loadChapter','openBook','openChapter','speakCurrent','renderVerses','renderTraining','init']) {
    const n = (m.match(new RegExp('function ' + fn + '\\b', 'g')) || []).length;
    assert(n === 1, fn + ' defined ' + n + ' times');
  }
  for (const bad of ['runtime patch', 'LOCAL_BIBLE_DATA=null']) assert(!m.includes(bad), 'legacy patch remnant: ' + bad);
});
check('speech: speakCurrent guards & settings', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const fn = m.match(/function speakCurrent\(\)[\s\S]*?\n}/)[0];
  assert(/speechSynthesis' in window/.test(fn), 'no support guard');
  assert(/u\.lang = 'en-US'/.test(fn), 'lang missing');
  assert(/rate = 0\.9/.test(fn), 'rate missing');
  assert(/state\.speaking/.test(fn), 'button feedback missing');
  assert(!/setStep/.test(fn), 'setStep inside speakCurrent (loop risk)');
});
check('storage: normalize guarantees all keys', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/)[1];
  assert(/function normalizeProgress/.test(m), 'normalizeProgress missing');
  assert(/'EBRM_V1_DATA_V1'/.test(m), 'storage key missing');
  /* 用最小沙箱实际执行 normalize */
  const fnCode = "const STEP_ORDER=['baseline','read','listen','notice','vocab','structure','understand','speak','reread','review'];\n" +
    m.match(/function normalizeProgress\(([\s\S]*?)\nfunction normalizeSettings/)[0].replace(/\nfunction normalizeSettings$/, '');
  const sandbox = new Function(fnCode + '; return normalizeProgress;');
  const normalizeProgress = sandbox();
  const cases = [null, undefined, {}, { words: null, trainings: { 'MAT.1': { baseline: true } }, reviewAt: { 'JHN.1': '2026-01-01T00:00:00Z' }, notes: { 'A.1': 'hi' } }];
  for (const c of cases) {
    const out = normalizeProgress(c);
    for (const k of ['done','read','notes','bookmarks','trainings','reviewAt']) {
      assert(out[k] && typeof out[k] === 'object' && !Array.isArray(out[k]), k + ' not object for case ' + String(JSON.stringify(c)).slice(0, 40));
    }
    assert(Array.isArray(out.words), 'words not array');
  }
  const out = normalizeProgress({ reviewAt: { 'JHN.1': '2026-01-01T00:00:00.000Z' } });
  assert(Array.isArray(out.reviewAt['JHN.1']) && out.reviewAt['JHN.1'].length === 1, 'reviewAt string not normalized');
});
check('review: schedule of 1/3/7/14 days', () => {
  const m = html.match(/<script>([\s\S]*)<\/script>/)[1];
  assert(/const REVIEW_DAYS = \[1, 3, 7, 14\]/.test(m), 'REVIEW_DAYS missing');
  assert(/function completeReview\(/.test(m), 'completeReview missing');
});

/* 5. john1 preserved */
check('john1.html preserved with app.js/style.css refs', () => {
  const j = fs.readFileSync('john1.html', 'utf8');
  assert(/app\.js/.test(j) && /style\.css/.test(j), 'john1 refs missing');
});

/* 6. sw: no HTML patching, new cache name, old cleanup */
check('sw: production design', () => {
  const s = fs.readFileSync('sw.js', 'utf8');
  assert(s.includes("ebrm-v1-production"), 'cache name missing');
  assert(/caches\.keys\(\)[\s\S]*?filter\(k => k !== CACHE\)[\s\S]*?caches\.delete/.test(s), 'old cache cleanup missing');
  assert(!s.includes('index.html') || !s.match(/respondWith[\s\S]*?index\.html[\s\S]*?replace|text\(\)\.then[\s\S]*?replace/i), 'HTML patching suspected');
  assert(!/\.replace\(/.test(s), 'SW must not rewrite content');
  assert(s.includes('data/nt-engwebp.json'), 'data precache missing');
});

console.log(failures ? ('RESULT: ' + failures + ' FAILURES') : 'RESULT: ALL TESTS PASSED');
process.exit(failures ? 1 : 0);
