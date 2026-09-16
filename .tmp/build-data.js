/* Build local NT scripture data from the Free Use Bible API (eng_webp). */
const fs = require('fs');
const path = require('path');
const https = require('https');

const NT = ['MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'];
const NAMES = { MAT:'Matthew', MRK:'Mark', LUK:'Luke', JHN:'John', ACT:'Acts', ROM:'Romans', '1CO':'1 Corinthians', '2CO':'2 Corinthians', GAL:'Galatians', EPH:'Ephesians', PHP:'Philippians', COL:'Colossians', '1TH':'1 Thessalonians', '2TH':'2 Thessalonians', '1TI':'1 Timothy', '2TI':'2 Timothy', TIT:'Titus', PHM:'Philemon', HEB:'Hebrews', JAS:'James', '1PE':'1 Peter', '2PE':'2 Peter', '1JN':'1 John', '2JN':'2 John', '3JN':'3 John', JUD:'Jude', REV:'Revelation' };
const TOTALS = { MAT:28, MRK:16, LUK:24, JHN:21, ACT:28, ROM:16, '1CO':16, '2CO':13, GAL:6, EPH:6, PHP:4, COL:4, '1TH':5, '2TH':3, '1TI':6, '2TI':4, TIT:3, PHM:1, HEB:13, JAS:5, '1PE':5, '2PE':3, '1JN':5, '2JN':1, '3JN':1, JUD:1, REV:22 };

function get(url, tries = 4) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      https.get(url, { headers: { 'User-Agent': 'EBRM-builder' } }, res => {
        if (res.statusCode !== 200) { res.resume(); if (n < tries) return setTimeout(() => attempt(n + 1), 800 * n); return reject(new Error('HTTP ' + res.statusCode + ' ' + url)); }
        const chunks = []; res.on('data', d => chunks.push(d)); res.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', e => { if (n < tries) return setTimeout(() => attempt(n + 1), 800 * n); reject(e); });
    };
    attempt(1);
  });
}

function verseText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(x => {
    if (typeof x === 'string') return x;
    if (x && typeof x.text === 'string') return x.text;
    return '';
  }).join(' ').replace(/\s+/g, ' ').trim();
  if (content && typeof content.text === 'string') return content.text;
  return '';
}

(async () => {
  const jobs = [];
  for (const b of NT) for (let c = 1; c <= TOTALS[b]; c++) jobs.push({ b, c });
  const results = new Map();
  let done = 0, failed = [];
  const CONC = 10;
  let idx = 0;
  async function worker() {
    while (idx < jobs.length) {
      const j = jobs[idx++];
      const url = `https://bible.helloao.org/api/eng_webp/${j.b}/${j.c}.json`;
      try {
        const buf = await get(url);
        const d = JSON.parse(buf.toString('utf8'));
        const verses = (d.chapter.content || []).filter(x => x.type === 'verse').map((v, i) => ({
          number: Number(v.number) || i + 1,
          text: verseText(v.content !== undefined ? v.content : v.text)
        })).filter(v => v.text);
        if (!verses.length) throw new Error('empty chapter');
        results.set(`${j.b}.${j.c}`, verses);
        done++;
        if (done % 40 === 0) console.log('progress', done, '/', jobs.length);
      } catch (e) {
        failed.push(j.b + '.' + j.c + ' ' + e.message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  if (failed.length) { console.error('FAILED CHAPTERS:', failed); process.exit(1); }

  const books = NT.map(b => {
    const chapters = {};
    for (let c = 1; c <= TOTALS[b]; c++) {
      const verses = results.get(`${b}.${c}`);
      chapters[String(c)] = verses;
    }
    return { id: b, name: NAMES[b], nameZh: null, numberOfChapters: TOTALS[b], chapters };
  });
  const out = {
    translation: { id: 'eng_webp', name: 'World English Bible, Protestant Edition', source: 'Free Use Bible API (bible.helloao.org)', publicDomain: true },
    generatedAt: new Date().toISOString(),
    books
  };
  const file = path.join(__dirname, '..', 'data', 'nt-engwebp.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out));
  const mb = (fs.statSync(file).size / 1048576).toFixed(2);
  console.log('books:', books.length, 'chapters:', books.reduce((a, b) => a + Object.keys(b.chapters).length, 0));
  console.log('verses:', books.reduce((a, b) => a + Object.values(b.chapters).reduce((x, v) => x + v.length, 0), 0));
  console.log('size MB:', mb);
  const mat1 = books[0].chapters['1'];
  const jhn1 = books[3].chapters['1'];
  const rev22 = books[26].chapters['22'];
  console.log('MAT1 v1:', mat1[0].text.slice(0, 60));
  console.log('JHN1 v1:', jhn1[0].text.slice(0, 60));
  console.log('REV22 last:', rev22[rev22.length - 1].text.slice(0, 60));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
