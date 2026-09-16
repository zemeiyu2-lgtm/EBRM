/* EBRM 2.0 内容质量审计：答案合法性 / 选项唯一性 / 干扰项不碰巧正确 / 题量 */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
(new Function(fs.readFileSync(path.join(root, 'ebrm-content.js'), 'utf8')))();
const C = globalThis.EBRM.Content;
const lexicon = JSON.parse(fs.readFileSync(path.join(root, 'data/lexicon.json'), 'utf8'));
const books = JSON.parse(fs.readFileSync(path.join(root, 'data/books.json'), 'utf8'));

let units = 0, badAnswer = 0, dupOption = 0, missingLevel = 0, tooFewOpts = 0, dupAcross = 0, correctMismatch = 0, leakDistractor = 0;
let noVocab = 0, noStruct = 0, noImi = 0, noSub = 0, noFinal = 0, noBaseline = 0;
const samples = [];
const FILLER = ['Peter', 'Paul', 'Moses', 'Pharaoh', 'Herod', 'temple', 'army', 'ship', 'field', 'harvest', 'prison',
  'build', 'sail', 'count', 'divide', 'plant', 'sell', 'throw', 'gather', 'wash', 'carry'];

function auditQ(q, ctx) {
  if (!Array.isArray(q.options) || q.options.length < 3) { tooFewOpts++; return; }
  if (!(q.answer >= 0 && q.answer < q.options.length)) badAnswer++;
  const set = {};
  q.options.forEach(o => { if (set[o]) dupOption++; set[o] = 1; });
  if (q.options[q.answer] !== q.correct) correctMismatch++;
}

books.books.forEach(b => {
  const file = JSON.parse(fs.readFileSync(path.join(root, 'data/nt', b.id + '.json'), 'utf8'));
  for (let c = 1; c <= b.chapters; c++) {
    const raw = file.chapters[String(c)]; if (!raw) continue;
    const verses = raw.map(v => ({ number: v.n, text: v.t }));
    const m = C.compileChapter({ id: b.id, name: b.name, nameZh: b.nameZh }, c, verses, lexicon);
    const unitTexts=[];const chapterWords = (' ' + verses.map(v => v.text).join(' ').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ') + ' ');
    m.units.forEach(u => {
      units++;
      const unitText = ' ' + u.verses.map(v=>v.text).join(' ').toLowerCase().replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ') + ' ';
      const lv = {};
      u.comprehension.forEach(q => { lv[q.level] = true; auditQ(q); });
      for (let L = 1; L <= 6; L++) if (!lv[L]) missingLevel++;
      u.notice.forEach(q => auditQ(q));
      u.baseline.forEach(q => auditQ(q));
      u.finalTest.forEach(q => { if (q.kind !== 'production') auditQ(q); });
      if (!u.vocabulary.length) noVocab++;
      if (!u.structures.length) noStruct++;
      if (!u.speaking.imitate.length) noImi++;
      if (!u.speaking.substitute.length) noSub++;
      if (!u.finalTest.some(q => q.kind !== 'production')) noFinal++;
      if (u.baseline.length < 3) noBaseline++;

      /* L1/L2 干扰项不应出现在本段经文中 */
      u.comprehension.forEach(q => {
        if (q.level === 1 || q.level === 2) {
          q.options.forEach((o, i) => {
            if (i === q.answer) return;
            if (unitText.indexOf(' ' + String(o).toLowerCase().replace(/[^a-z ]+/g,'') + ' ') >= 0) leakDistractor++;
          });
        }
      });
      if (samples.length < 3) samples.push({ ref: u.reference, comp: u.comprehension.map(q => 'L' + q.level + ': ' + q.question + ' → ' + q.correct) });
    });
  }
});

console.log('单元总数:', units);
console.log('答案越界:', badAnswer);
console.log('选项内部重复:', dupOption);
console.log('correct 与答案索引不一致:', correctMismatch);
console.log('选项不足 3 个:', tooFewOpts);
console.log('L1/L2 干扰项碰巧出现在经文中:', leakDistractor);
console.log('缺失层级（累计）:', missingLevel);
console.log('缺词汇:', noVocab, ' 缺句型:', noStruct, ' 缺模仿:', noImi, ' 缺替换:', noSub, ' 缺测试:', noFinal, ' baseline<3:', noBaseline);
console.log('\n样例：');
samples.forEach(s => { console.log('· ' + s.ref); s.comp.forEach(l => console.log('    ' + l)); });
