/* 从 app.js 提取 JOHN 1 教学数据（COURSE + baseline 题库）→ data/john1-course.json
   纯读取操作，不修改 app.js。
   策略：先剥离注释与字符串干扰，再做括号平衡提取。 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const raw = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

/* ---------- 0. 剥离注释（保留字符串原样，但把字符串内容替换成等长的占位符以免干扰） ---------- */
function stripCommentsAndStrings(text) {
  let out = '';
  let i = 0;
  let mode = 'code';
  let quote = null;
  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];
    if (mode === 'code') {
      if (ch === '/' && next === '/') { mode = 'line'; i += 2; out += '  '; continue; }
      if (ch === '/' && next === '*') { mode = 'block'; i += 2; out += '  '; continue; }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch; mode = 'str';
        out += '"';            // 归一为双引号
        i++; continue;
      }
      out += ch; i++; continue;
    }
    if (mode === 'line') {
      if (ch === '\n') { mode = 'code'; out += '\n'; i++; continue; }
      out += ' '; i++; continue;
    }
    if (mode === 'block') {
      if (ch === '*' && next === '/') { mode = 'code'; i += 2; out += '  '; continue; }
      out += ch === '\n' ? '\n' : ' '; i++; continue;
    }
    if (mode === 'str') {
      if (ch === '\\') { out += ch + next; i += 2; continue; }
      if (ch === quote) { mode = 'code'; out += '"'; i++; continue; }
      if (ch === '\n') { mode = 'code'; out += '\n'; i++; continue; }  // 容错
      out += ch; i++; continue;
    }
  }
  return out;
}

/* ---------- 1. 括号平衡提取字面量 ---------- */
function extractLiteral(text, openIndex) {
  const open = text[openIndex];
  const close = open === '[' ? ']' : '{';
  const closeCh = open === '[' ? ']' : '}';
  let depth = 0;
  let inStr = false;
  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === open) depth++;
    else if (ch === closeCh) {
      depth--;
      if (depth === 0) return text.slice(openIndex, i + 1);
    }
  }
  throw new Error('unbalanced literal at ' + openIndex);
}

const code = stripCommentsAndStrings(raw);
const values = {};   // 用剥离后的安全文本求值

/* ---------- 2. COURSE ---------- */
const courseStart = code.indexOf('const COURSE');
const courseOpen = code.indexOf('[', courseStart);
const courseLiteral = extractLiteral(code, courseOpen);
const COURSE = new Function('return ' + courseLiteral + ';')();
console.log('COURSE units:', COURSE.length);
COURSE.forEach(u => console.log('  ', u.id, '|', u.reference, '|', u.title, '| verses', u.verses.length, '| vocab', u.vocabulary.length, '| structures', u.structures.length, '| notice', u.notice.length, '| direct', u.direct.length));

/* ---------- 3. baseline 题库（unitNumber 分派，全文扫描） ---------- */
const baselines = {};
const re = /unitNumber\s*===\s*(\d+)\s*\)\s*\{\s*return\s*\[/g;
let m;
while ((m = re.exec(code))) {
  const num = Number(m[1]);
  if (baselines[num]) continue;
  const open = m.index + m[0].length - 1;
  const literal = extractLiteral(code, open);
  baselines[num] = new Function('return ' + literal + ';')();
}
console.log('baseline branches:', Object.keys(baselines).join(',') || '(none)');

/* ---------- 4. 组合输出 ---------- */
const units = COURSE.map(u => ({
  id: 'JHN.1-U' + String(u.number).padStart(2, '0'),
  number: u.number,
  reference: u.reference,
  title: u.title,
  verses: u.verses.map(v => ({ number: v.verse, text: v.text })),
  vocabulary: u.vocabulary.map(v => ({ english: v[0], zh: v[1], gloss: v[2] })),
  structures: u.structures.map(s => ({ sentence: s[0], explanation: s[1] })),
  notice: u.notice.map(q => ({ question: q[0], options: q[1], answer: q[2] })),
  comprehension: u.direct.map(q => ({ question: q[0], options: q[1], answer: q[2], hint: q[3] || '' })),
  production: u.production,
  baseline: baselines[u.number] || null
}));

const payload = {
  book: 'JHN',
  bookName: 'John',
  bookNameZh: '约翰福音',
  chapter: 1,
  title: 'John 1 · 完整精读课程',
  curated: true,
  source: 'EBRM V0.9 JOHN 1 complete course (app.js COURSE)',
  units
};

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'john1-course.json'), JSON.stringify(payload, null, 1));
const size = fs.statSync(path.join(root, 'data', 'john1-course.json')).size;
console.log('written data/john1-course.json', size, 'bytes');

const check = require(path.join(root, 'data', 'john1-course.json'));
console.log('U01 verses:', JSON.stringify(check.units[0].verses.slice(0, 2)));
console.log('U01 vocab:', JSON.stringify(check.units[0].vocabulary.slice(0, 2)));
console.log('U01 struct:', JSON.stringify(check.units[0].structures.slice(0, 1)));
console.log('U01 notice:', JSON.stringify(check.units[0].notice.slice(0, 1)));
console.log('U01 comp:', JSON.stringify(check.units[0].comprehension.slice(0, 1)));
console.log('U01 baseline count:', (check.units[0].baseline || []).length);
console.log('U02 baseline count:', (check.units[1].baseline || []).length);
console.log('U07 baseline count:', (check.units[6].baseline || []).length);
