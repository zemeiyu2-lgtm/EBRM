/* 统计 6 级 DIRECT COMPREHENSION 的完整性（全 260 章） */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const g = globalThis;
(new Function(fs.readFileSync(path.join(root, 'ebrm-content.js'), 'utf8')))();
const C = globalThis.EBRM.Content;
const lexicon = JSON.parse(fs.readFileSync(path.join(root, 'data/lexicon.json'), 'utf8'));
const books = JSON.parse(fs.readFileSync(path.join(root, 'data/books.json'), 'utf8'));

const missing = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
let units = 0;
const examples = {};

books.books.forEach(b => {
  const file = JSON.parse(fs.readFileSync(path.join(root, 'data/nt', b.id + '.json'), 'utf8'));
  for (let c = 1; c <= b.chapters; c++) {
    const raw = file.chapters[String(c)];
    if (!raw) continue;
    const verses = raw.map(v => ({ number: v.n, text: v.t }));
    const m = C.compileChapter({ id: b.id, name: b.name, nameZh: b.nameZh }, c, verses, lexicon);
    m.units.forEach(u => {
      units++;
      const lv = {};
      u.comprehension.forEach(q => { lv[q.level] = true; });
      for (let L = 1; L <= 6; L++) {
        if (!lv[L]) {
          missing[L]++;
          if (!examples[L]) examples[L] = u.reference + ' :: ' + u.verses.map(v => v.text).join(' ').slice(0, 130);
        }
      }
    });
  }
});

console.log('总单元数:', units);
console.log('缺失各级的单元数:', JSON.stringify(missing));
console.log('缺失占比:', Object.keys(missing).map(L => 'L' + L + '=' + (missing[L] / units * 100).toFixed(1) + '%').join(' '));
console.log('示例:');
Object.keys(examples).forEach(L => console.log('  L' + L + ': ' + examples[L]));

/* 统计每单元理解题数量分布 */
const dist = {};
books.books.forEach(b => {
  const file = JSON.parse(fs.readFileSync(path.join(root, 'data/nt', b.id + '.json'), 'utf8'));
  for (let c = 1; c <= b.chapters; c++) {
    const raw = file.chapters[String(c)]; if (!raw) continue;
    const m = C.compileChapter({ id: b.id, name: b.name, nameZh: b.nameZh }, c, raw.map(v => ({ number: v.n, text: v.t })), lexicon);
    m.units.forEach(u => { const n = u.comprehension.length; dist[n] = (dist[n] || 0) + 1; });
  }
});
console.log('理解题数量分布:', JSON.stringify(dist));
