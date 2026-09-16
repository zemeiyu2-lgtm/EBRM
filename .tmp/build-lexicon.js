/* data/lexicon.txt → data/lexicon.json，并统计新约经文覆盖率 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const STOPWORDS = ('a an the and or but nor so for yet of to in on at by with from into unto out up down over under ' +
  'is was were be been being am are art hast hath has had have do does did done doing will would shall should ' +
  'can could may might must let not no nor none neither either if then than that this these those there here ' +
  'he she it they we you i him her them us me my your his their our its thy thee thou ye myself himself herself ' +
  'itself themselves ourselves yourselves who whom whose which what when where why how as also very even still yet ' +
  'now thus therefore because while after before until unless whether since during among between against above below ' +
  'through across along around beyond within without toward upon both each every all any some more most much many ' +
  'other another same such own only just about again already always never often soon once twice together apart away ' +
  'back forth hence hither thither yes amen behold lo indeed truly verily perhaps rather almost enough even so ' +
  'one two no not nothing anything something everything anyone someone everyone nobody anybody somebody everybody ' +
  's t re ve ll d m o').split(/\s+/).filter(Boolean);

const stop = new Set(STOPWORDS);

/* ---------- 解析词表 ---------- */
const lines = fs.readFileSync(path.join(root, 'data', 'lexicon.txt'), 'utf8').split(/\r?\n/);
const entries = {};
let dup = 0;
for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const parts = t.split('|');
  if (parts.length < 3) { continue; }
  const w = parts[0].trim().toLowerCase();
  if (!w) continue;
  if (entries[w]) dup++;
  const type = (parts[3] || '').trim();   // t/空 = 教学词, x = 变形, n = 专有名词
  entries[w] = { zh: parts[1].trim(), gloss: parts[2].trim() };
  if (type) entries[w].type = type;
}
console.log('lexicon entries:', Object.keys(entries).length, 'duplicates merged:', dup);
const teachable = Object.entries(entries).filter(([, v]) => !v.type).length;
console.log('teachable entries:', teachable, '| inflect:', Object.values(entries).filter(v => v.type === 'x').length, '| proper:', Object.values(entries).filter(v => v.type === 'n').length);
console.log('stopwords:', stop.size);

/* ---------- 覆盖率统计 ---------- */
const nt = require(path.join(root, 'data', 'nt-engwebp.json'));
function tokenize(text) {
  return (text.toLowerCase().replace(/[\u2018\u2019]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) || []);
}
function baseForms(w) {
  const out = [w];
  if (w.endsWith("'s")) out.push(w.slice(0, -2));
  if (w.endsWith("n't")) out.push(w.slice(0, -3));
  if (w.endsWith('ies')) out.push(w.slice(0, -3) + 'y');
  if (w.endsWith('es')) out.push(w.slice(0, -2));
  if (w.endsWith('s')) out.push(w.slice(0, -1));
  if (w.endsWith('ed')) out.push(w.slice(0, -2), w.slice(0, -1));
  if (w.endsWith('ing')) out.push(w.slice(0, -3), w.slice(0, -3) + 'e');
  if (w.endsWith('ly')) out.push(w.slice(0, -2));
  if (w.endsWith('est')) out.push(w.slice(0, -3));
  if (w.endsWith('er')) out.push(w.slice(0, -2));
  return out;
}
function known(w) {
  if (stop.has(w)) return true;
  for (const b of baseForms(w)) if (entries[b]) return true;
  return false;
}
let tokTotal = 0, tokKnown = 0;
const unknownFreq = new Map();
let chaptersWithAllKnown = 0, chapterCount = 0;
for (const b of nt.books) {
  for (const ch of Object.keys(b.chapters)) {
    chapterCount++;
    let all = true;
    for (const v of b.chapters[ch]) {
      for (const w of tokenize(v.text)) {
        tokTotal++;
        if (known(w)) tokKnown++;
        else { all = false; unknownFreq.set(w, (unknownFreq.get(w) || 0) + 1); }
      }
    }
    if (all) chaptersWithAllKnown++;
  }
}
console.log('chapters:', chapterCount);
console.log('token coverage:', (tokKnown / tokTotal * 100).toFixed(2) + '%', '(' + tokKnown + '/' + tokTotal + ')');
console.log('chapters fully covered:', chaptersWithAllKnown);
const top = [...unknownFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 120);
console.log('top unknown tokens:');
console.log(top.map(([w, c]) => w + ':' + c).join(' '));

/* ---------- 输出 JSON ---------- */
const payload = {
  name: 'EBRM NT core lexicon',
  version: 1,
  note: 'zh = 中文释义, gloss = simple English explanation',
  stopwords: [...stop].sort(),
  entries
};
fs.writeFileSync(path.join(root, 'data', 'lexicon.json'), JSON.stringify(payload));
console.log('written data/lexicon.json', fs.statSync(path.join(root, 'data', 'lexicon.json')).size, 'bytes');
