/* data/nt-engwebp.json → data/books.json + data/nt/<BOOK>.json（按需加载） */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const ZH = {
  MAT: '马太福音', MRK: '马可福音', LUK: '路加福音', JHN: '约翰福音', ACT: '使徒行传',
  ROM: '罗马书', '1CO': '哥林多前书', '2CO': '哥林多后书', GAL: '加拉太书', EPH: '以弗所书',
  PHP: '腓立比书', COL: '歌罗西书', '1TH': '帖撒罗尼迦前书', '2TH': '帖撒罗尼迦后书',
  '1TI': '提摩太前书', '2TI': '提摩太后书', TIT: '提多书', PHM: '腓利门书', HEB: '希伯来书',
  JAS: '雅各书', '1PE': '彼得前书', '2PE': '彼得后书', '1JN': '约翰一书', '2JN': '约翰二书',
  '3JN': '约翰三书', JUD: '犹大书', REV: '启示录'
};
const ORDER = ['MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL',
  '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'];

const nt = require(path.join(root, 'data', 'nt-engwebp.json'));
const dir = path.join(root, 'data', 'nt');
fs.mkdirSync(dir, { recursive: true });

const index = [];
nt.books.forEach(b => {
  const chapters = {};
  Object.keys(b.chapters).forEach(c => {
    chapters[c] = b.chapters[c].map(v => ({ n: v.number, t: v.text }));
  });
  const payload = {
    id: b.id,
    name: b.name,
    nameZh: ZH[b.id] || b.name,
    order: ORDER.indexOf(b.id) + 1,
    chapterCount: Object.keys(chapters).length,
    chapters
  };
  fs.writeFileSync(path.join(dir, b.id + '.json'), JSON.stringify(payload));
  index.push({
    id: b.id,
    name: b.name,
    nameZh: payload.nameZh,
    order: payload.order,
    chapters: payload.chapterCount,
    file: 'nt/' + b.id + '.json'
  });
});

index.sort((a, b) => a.order - b.order);
const meta = {
  translation: 'eng_webp',
  translationName: 'World English Bible (Public Domain)',
  books: index,
  totalBooks: index.length,
  totalChapters: index.reduce((s, b) => s + b.chapters, 0)
};
fs.writeFileSync(path.join(root, 'data', 'books.json'), JSON.stringify(meta, null, 1));
console.log('books:', meta.totalBooks, 'chapters:', meta.totalChapters);
console.log(index.map(b => b.id + ':' + b.chapters).join(' '));
let total = 0;
fs.readdirSync(dir).forEach(f => { total += fs.statSync(path.join(dir, f)).size; });
console.log('per-book files total:', (total / 1024).toFixed(0) + 'KB', '| books.json:', fs.statSync(path.join(root, 'data', 'books.json')).size + 'B');
