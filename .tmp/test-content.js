/* 内容引擎输出质量检查 */
const path = require('path');
const root = path.join(__dirname, '..');
global.window = global;
require(path.join(root, 'ebrm-content.js'));
const EB = global.EBRM.Content;
const lex = require(path.join(root, 'data', 'lexicon.json'));
const nt = require(path.join(root, 'data', 'nt-engwebp.json'));

function book(id) { return nt.books.find(b => b.id === id); }

function show(bookId, ch, unitLimit) {
  const b = book(bookId);
  const verses = b.chapters[String(ch)];
  const t0 = Date.now();
  const model = EB.compileChapter(b, ch, verses, lex);
  const ms = Date.now() - t0;
  console.log('\n================ ' + model.reference + ' (' + model.verseCount + ' verses → ' + model.units.length + ' units, ' + ms + 'ms) ================');
  model.units.slice(0, unitLimit || 2).forEach(u => {
    console.log('\n--- ' + u.id + ' | ' + u.reference + ' | ' + u.title + ' | verses ' + u.verses.length);
    console.log('  VOCAB(' + u.vocabulary.length + '): ' + u.vocabulary.map(v => v.english + '(' + v.zh + ')').join(', '));
    console.log('  STRUCT(' + u.structures.length + '): ' + u.structures.map(s => s.pattern).join(' || '));
    u.structures.forEach(s => {
      console.log('      · ' + s.sentence);
      console.log('        pattern: ' + s.pattern + ' | breakdown: ' + JSON.stringify(s.breakdown));
      console.log('        expl: ' + s.explanation);
      console.log('        map: ' + (s.meaning || []).map(m => m.en + '=' + m.zh).join(', '));
      console.log('        subs: ' + JSON.stringify(s.substitutions));
    });
    console.log('  NOTICE(' + u.notice.length + '):');
    u.notice.forEach(q => console.log('      Q: ' + q.question + ' | opts=' + JSON.stringify(q.options) + ' | ans=' + q.answer + ' (' + q.correct + ')'));
    console.log('  COMPREHENSION(' + u.comprehension.length + '):');
    u.comprehension.forEach(q => console.log('      L' + q.level + ': ' + q.question + ' | ans=' + q.answer + ' (' + q.correct + ') | opts=' + JSON.stringify(q.options)));
    console.log('  SPEAK: imitate=' + u.speaking.imitate.length + ' substitute=' + JSON.stringify(u.speaking.substitute));
    console.log('      produce: ' + u.speaking.produce);
    console.log('  BASELINE(' + u.baseline.length + '): ' + u.baseline.map(q => q.question + '→' + q.answer).join(' | '));
    console.log('  FINAL(' + u.finalTest.length + '): ' + u.finalTest.map(q => (q.kind || ('L' + q.level)) + '→' + (q.answer >= 0 ? q.answer + '(' + q.correct + ')' : 'production')).join(' | '));
  });
}

show('MAT', 1, 2);
show('MAT', 5, 2);
show('REV', 22, 1);

/* 全量编译一次，检查异常与分布 */
console.log('\n================ FULL COMPILE ================');
let t0 = Date.now(), units = 0, noVocab = 0, noStruct = 0, noNotice = 0, noComp = 0, noFinal = 0, noBase = 0;
const badAnswer = [];
for (const b of nt.books) {
  for (const ch of Object.keys(b.chapters)) {
    const model = EB.compileChapter(b, Number(ch), b.chapters[ch], lex);
    units += model.units.length;
    model.units.forEach(u => {
      if (!u.vocabulary.length) noVocab++;
      if (!u.structures.length) noStruct++;
      if (!u.notice.length) noNotice++;
      if (u.comprehension.length < 3) noComp++;
      if (u.finalTest.length < 5) noFinal++;
      if (!u.baseline.length) noBase++;
      [].concat(u.notice, u.comprehension, u.finalTest, u.baseline).forEach(q => {
        if (q.options && q.options.length && (q.answer < 0 || q.answer >= q.options.length)) {
          badAnswer.push(u.id + ':' + q.question.slice(0, 40));
        }
        if (q.options && q.options.length && q.correct !== undefined && q.options[q.answer] !== q.correct) {
          badAnswer.push('MISMATCH ' + u.id + ':' + q.question.slice(0, 40));
        }
      });
    });
  }
}
console.log('total units:', units, '| compile time:', (Date.now() - t0) + 'ms');
console.log('units missing vocab:', noVocab, '| structures:', noStruct, '| notice:', noNotice, '| comp<3:', noComp, '| final<5:', noFinal, '| baseline:', noBase);
console.log('bad answers:', badAnswer.length);
if (badAnswer.length) console.log(badAnswer.slice(0, 10).join('\n'));
