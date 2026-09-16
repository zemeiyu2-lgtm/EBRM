/* =========================================================
   EBRM 2.0 · CORE ENGINE
   ---------------------------------------------------------
   一个正式入口 / 一个数据系统 / 一个语音引擎 / 一个复习调度

   层次：
     Bible Content（data/）
       ↓ 加载（懒加载，按卷）
     Content Engine（ebrm-content.js）→ 教学单元
       ↓
     Core Engine（本文件）：状态 · 复习 · 语音
       ↓
     App（ebrm-app.js）：渲染与交互
========================================================= */
(function (global) {
  'use strict';

  var Engine = {};

  /* =======================================================
     常量
  ======================================================= */
  Engine.VERSION = '2.0';

  Engine.STORE = 'EBRM_V1_DATA_V1';        // 学习数据（保持兼容）
  Engine.SET = 'EBRM_V1_DATA_V1_SET';      // 设置
  Engine.JOHN1_STORE = 'EBRM_V09_FINAL_STATE';   // John 1 独立课程数据（兼容保留）
  Engine.JOHN1_VOICE = 'EBRM_V09_VOICE';

  Engine.TRAINING_STEPS = [
    { id: 'baseline', no: 1, en: 'BASELINE', zh: '第一次理解', hint: '不查中文，只看英文，凭直觉回答。' },
    { id: 'read', no: 2, en: 'READ', zh: '读经', hint: '先不翻译，问自己：What is happening?' },
    { id: 'listen', no: 3, en: 'LISTEN', zh: '听读', hint: '选声音、调速，反复听，再跟着读。' },
    { id: 'notice', no: 4, en: 'NOTICE', zh: '观察', hint: '先看见：重复 · 对比 · 人物 · 动作 · 关系。' },
    { id: 'vocabulary', no: 5, en: 'VOCABULARY', zh: '核心词汇', hint: '不只是背中文，把词放回经文里。' },
    { id: 'structure', no: 6, en: 'STRUCTURE', zh: '句子结构', hint: '看英语怎样组织意义。' },
    { id: 'comprehension', no: 7, en: 'DIRECT COMPREHENSION', zh: '直接理解', hint: 'English → Meaning，不先翻译。' },
    { id: 'speak', no: 8, en: 'SPEAK', zh: '英文表达', hint: '模仿 → 替换 → 自己表达。' },
    { id: 'reread', no: 9, en: 'RE-READ', zh: '再读一次', hint: '第二次阅读应该比第一次更容易。' },
    { id: 'finalTest', no: 10, en: 'FINAL TEST', zh: '最后理解测试', hint: '不看中文，再根据英文回答。' }
  ];
  Engine.RESULT_NODE = { id: 'result', en: 'RESULT', zh: '学习结果' };
  Engine.REVIEW_NODE = { id: 'review', en: 'REVIEW', zh: '间隔复习' };

  Engine.REVIEW_INTERVALS = [1, 3, 7, 14];   // Day 1 / 3 / 7 / 14

  /* =======================================================
     工具
  ======================================================= */
  function iso(d) { return new Date(d).toISOString(); }
  function dayKey(d) { return new Date(d).toISOString().slice(0, 10); }
  function addDays(n, from) {
    var d = from ? new Date(from) : new Date();
    d.setDate(d.getDate() + n);
    return d;
  }
  function isArray(v) { return Object.prototype.toString.call(v) === '[object Array]'; }
  function isObj(v) { return v && typeof v === 'object' && !isArray(v); }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function fetchJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' · ' + url);
      return r.json();
    });
  }
  Engine.fetchJSON = fetchJSON;

  /* =======================================================
     状态：默认值 / 规范化（旧数据兼容）
  ======================================================= */
  Engine.defaultState = function () {
    return {
      version: 2,
      last: null,                 // { book, chapter, unit, step }
      units: {},                  // "MAT.1-U01" → 单元学习记录
      chapters: {},               // "MAT.1" → { unitsDone, unitsTotal, completedAt }
      /* 旧版字段：保留以便读取历史数据 */
      progress: {
        done: {}, read: {}, notes: {}, bookmarks: {},
        trainings: {}, reviewAt: {}, words: []
      },
      stats: { startedAt: null, steps: 0 }
    };
  };

  Engine.defaultSettings = function () {
    return {
      autoMarkRead: true,
      compactMode: false,
      font: 20,
      voiceURI: '',
      rate: 0.9,
      showChinese: true
    };
  };

  Engine.normalizeUnit = function (u) {
    var out = isObj(u) ? u : {};
    if (!isObj(out.steps)) out.steps = {};
    Engine.TRAINING_STEPS.forEach(function (s) {
      if (typeof out.steps[s.id] !== 'boolean') out.steps[s.id] = false;
    });
    if (!isObj(out.notes)) out.notes = {};
    ['notice', 'structure', 'comprehension', 'reread'].forEach(function (k) {
      if (typeof out.notes[k] !== 'string') out.notes[k] = '';
    });
    if (!isArray(out.vocabulary)) out.vocabulary = [];
    if (!isArray(out.substitutions)) out.substitutions = [];
    if (typeof out.production !== 'string') out.production = '';
    if (!isArray(out.weak)) out.weak = [];
    if (!isArray(out.reviews)) out.reviews = [];
    out.reviews = out.reviews.map(function (r) {
      if (typeof r === 'string') return { due: r.slice(0, 10), done: false };
      var o = isObj(r) ? r : {};
      return { due: String(o.due || '').slice(0, 10), done: !!o.done };
    }).filter(function (r) { return r.due; });
    if (typeof out.completed !== 'boolean') out.completed = false;
    if (out.baseline !== null && out.baseline !== undefined && typeof out.baseline === 'object') {
      if (!isArray(out.baseline.answers)) out.baseline.answers = [];
    } else {
      out.baseline = null;
    }
    if (out.final !== null && out.final !== undefined && typeof out.final === 'object') {
      if (!isArray(out.final.answers)) out.final.answers = [];
    } else {
      out.final = null;
    }
    return out;
  };

  Engine.normalizeState = function (raw) {
    var base = Engine.defaultState();
    var s = isObj(raw) ? raw : {};
    var out = base;
    out.version = 2;

    if (isObj(s.last)) {
      out.last = {
        book: s.last.book || s.last.b || '',
        chapter: Number(s.last.chapter || s.last.c || 0) || 0,
        unit: Number(s.last.unit || 0) || 0,
        step: s.last.step || ''
      };
    }
    if (isObj(s.units)) {
      Object.keys(s.units).forEach(function (k) {
        out.units[k] = Engine.normalizeUnit(s.units[k]);
      });
    }
    if (isObj(s.chapters)) {
      Object.keys(s.chapters).forEach(function (k) {
        var c = s.chapters[k] || {};
        out.chapters[k] = {
          unitsDone: Number(c.unitsDone || 0),
          unitsTotal: Number(c.unitsTotal || 0),
          completedAt: c.completedAt || null
        };
      });
    }
    if (isObj(s.stats)) {
      out.stats.startedAt = s.stats.startedAt || null;
      out.stats.steps = Number(s.stats.steps || 0);
    }

    /* 旧字段：保证永远是正确的类型，绝不 undefined */
    var p = isObj(s.progress) ? s.progress : {};
    ['done', 'read', 'notes', 'bookmarks', 'trainings', 'reviewAt'].forEach(function (k) {
      out.progress[k] = isObj(p[k]) ? p[k] : {};
    });
    out.progress.words = isArray(p.words) ? p.words : [];
    out.progress.trainings = out.progress.trainings || {};
    out.progress.reviewAt = out.progress.reviewAt || {};

    /* 旧数据迁移：章级 done / read / notes / bookmarks / 词表 */
    Object.keys(out.progress.done).forEach(function (ck) {
      if (!out.chapters[ck]) out.chapters[ck] = { unitsDone: 0, unitsTotal: 0, completedAt: out.progress.done[ck] && typeof out.progress.done[ck] === 'string' ? out.progress.done[ck] : null, legacy: true };
      else out.chapters[ck].legacy = true;
    });

    /* 旧 trainings 结构 → 新 units 结构（尽力迁移） */
    Object.keys(out.progress.trainings).forEach(function (ck) {
      var old = out.progress.trainings[ck];
      if (!isObj(old)) return;
      var unitKey = ck + '-U01';
      if (out.units[unitKey]) return;
      var nu = Engine.normalizeUnit({});
      Engine.TRAINING_STEPS.forEach(function (s) {
        if (old[s.id]) nu.steps[s.id] = true;
      });
      if (old.freeNotes) {
        if (old.freeNotes.notice) nu.notes.notice = old.freeNotes.notice;
        if (old.freeNotes.structure) nu.notes.structure = old.freeNotes.structure;
        if (old.freeNotes.understand) nu.notes.comprehension = old.freeNotes.understand;
        if (old.freeNotes.reread) nu.notes.reread = old.freeNotes.reread;
      }
      Object.keys(old).forEach(function (k) {
        if (/^s\d|step/.test(k)) return;
      });
      out.units[unitKey] = nu;
    });

    return out;
  };

  Engine.loadState = function () {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(Engine.STORE) || 'null'); } catch (e) { raw = null; }
    var s = Engine.normalizeState(raw);
    if (!s.stats.startedAt) s.stats.startedAt = iso(Date.now());
    return s;
  };

  Engine.saveState = function (s) {
    try {
      localStorage.setItem(Engine.STORE, JSON.stringify(s));
      return true;
    } catch (e) {
      console.warn('EBRM: 保存失败', e);
      return false;
    }
  };

  Engine.loadSettings = function () {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(Engine.SET) || 'null'); } catch (e) { raw = null; }
    var d = Engine.defaultSettings();
    if (isObj(raw)) {
      Object.keys(d).forEach(function (k) {
        if (raw[k] !== undefined && typeof raw[k] === typeof d[k]) d[k] = raw[k];
      });
      if (typeof raw.font === 'number' && raw.font >= 14 && raw.font <= 40) d.font = raw.font;
      if (typeof raw.rate === 'number' && raw.rate >= 0.5 && raw.rate <= 1.6) d.rate = raw.rate;
    }
    return d;
  };

  Engine.saveSettings = function (s) {
    try { localStorage.setItem(Engine.SET, JSON.stringify(s)); } catch (e) { console.warn('EBRM: 设置保存失败', e); }
  };

  /* =======================================================
     数据层：懒加载
  ======================================================= */
  var cache = { books: {}, lexicon: null, meta: null, models: {} };

  Engine.bootstrap = function () {
    if (cache.meta) return Promise.resolve();
    var jobs = [
      fetchJSON('data/books.json').then(function (m) { cache.meta = m; }),
      fetchJSON('data/lexicon.json').then(function (l) { cache.lexicon = l; })
    ];
    return Promise.all(jobs);
  };

  Engine.meta = function () { return cache.meta; };
  Engine.lexicon = function () { return cache.lexicon; };

  Engine.loadBook = function (bookId) {
    if (cache.books[bookId]) return Promise.resolve(cache.books[bookId]);
    var entry = (cache.meta.books || []).filter(function (b) { return b.id === bookId; })[0];
    var url = entry ? ('data/' + entry.file) : ('data/nt/' + bookId + '.json');
    return fetchJSON(url).then(function (b) {
      cache.books[bookId] = b;
      return b;
    });
  };

  /* 章节模型（含教学编译）——按需编译并缓存 */
  Engine.chapterModel = function (bookId, chapter) {
    var key = bookId + '.' + chapter;
    if (cache.models[key]) return Promise.resolve(cache.models[key]);
    return Engine.loadBook(bookId).then(function (book) {
      var raw = book.chapters[String(chapter)];
      if (!raw || !raw.length) throw new Error('找不到经文：' + book.name + ' ' + chapter);
      var verses = raw.map(function (v) { return { number: v.n, text: v.t }; });
      var model = global.EBRM.Content.compileChapter(
        { id: book.id, name: book.name, nameZh: book.nameZh },
        chapter, verses, cache.lexicon
      );
      cache.models[key] = model;
      return model;
    });
  };

  /* 精编课程（John 1 原型数据）：存在则优先使用 */
  var curated = {};
  Engine.loadCurated = function (bookId, chapter) {
    var key = bookId + '.' + chapter;
    if (curated[key] !== undefined) return Promise.resolve(curated[key]);
    if (!(bookId === 'JHN' && chapter === 1)) { curated[key] = null; return Promise.resolve(null); }
    return fetchJSON('data/john1-course.json').then(function (d) {
      curated[key] = d;
      return d;
    }).catch(function () { curated[key] = null; return null; });
  };

  /* 统一入口：返回 { model, curated } */
  Engine.open = function (bookId, chapter) {
    return Promise.all([
      Engine.chapterModel(bookId, chapter),
      Engine.loadCurated(bookId, chapter)
    ]).then(function (r) {
      return { model: r[0], curated: r[1] };
    });
  };

  /* 把精编课程单元映射为引擎单元（结构对齐）
     —— 关键：精编课程只负责「选段 + 精编词汇 / 观察 / 理解」，
        句型拆解、替换练习、测试题全部由同一个教学引擎生成，
        因此 John 1 与其余 26 卷走的是完全相同的教学逻辑。 */
  Engine.curatedModel = function (course) {
    if (!course) return null;
    var C = global.EBRM.Content;
    var lex = cache.lexicon;

    var allVerses = [];
    (course.units || []).forEach(function (u) {
      (u.verses || []).forEach(function (v) {
        if (!allVerses.some(function (x) { return x.number === v.number; })) {
          allVerses.push({ number: v.number, text: v.text });
        }
      });
    });
    allVerses.sort(function (a, b) { return a.number - b.number; });

    var units = (course.units || []).map(function (u) {
      /* --- STRUCTURE：以精编解释为准，句型/拆分/词义/例句/替换由引擎补齐 --- */
      var engineSt = C.structuresFor(u.verses, lex, Math.max(2, (u.structures || []).length || 3));
      var structures = ((u.structures && u.structures.length ? u.structures : [])).map(function (s, i) {
        var e = engineSt[i] || engineSt[0] || {};
        return {
          id: e.id || 'curated',
          sentence: s.sentence,
          pattern: e.pattern || '',
          breakdown: e.breakdown || [],
          explanation: s.explanation || e.explanation || '',
          meaning: e.meaning || [],
          example: e.example || '',
          substitutions: e.substitutions || [],
          verseText: (u.verses || []).filter(function (v) {
            return v.text.indexOf(s.sentence.replace(/[.?!]$/, '')) >= 0;
          })[0] ? (u.verses || []).filter(function (v) {
            return v.text.indexOf(s.sentence.replace(/[.?!]$/, '')) >= 0;
          })[0].text : ''
        };
      });
      /* 精编未给句型时，直接用引擎句型 */
      if (!structures.length) structures = engineSt;

      /* --- 统一中间模型，供引擎生成 baseline / finalTest --- */
      var seedUnit = {
        id: u.id,
        number: u.number,
        reference: u.reference,
        verses: u.verses,
        vocabulary: (u.vocabulary || []).map(function (v) {
          return {
            english: v.english, shown: v.english, zh: v.zh, gloss: v.gloss,
            cls: 'noun', pos: 'noun', verse: '', example: ''
          };
        }),
        structures: structures,
        comprehension: [],
        speaking: { imitate: [], substitute: [], produce: u.production || '' }
      };
      seedUnit.comprehension = (u.comprehension || []).map(function (q, i) {
        return {
          level: Math.min(6, 2 + i), question: q.question, options: q.options,
          answer: q.answer, correct: q.options[q.answer], hint: q.hint || ''
        };
      });

      /* 母版也必须满足「6 级递进」：精编题优先，缺的层级由同一教学引擎补齐 */
      var haveLevel = {};
      seedUnit.comprehension.forEach(function (q) { haveLevel[q.level] = true; });
      var chapterSents = [];
      (course.units || []).forEach(function (uu) {
        (uu.verses || []).forEach(function (vv) {
          C.sentencize(vv.text).forEach(function (ss) {
            if (chapterSents.indexOf(ss) < 0) chapterSents.push(ss);
          });
        });
      });
      C.comprehensionFor(u.verses, u.number, lex, {
        bookName: course.bookName, chapterSentences: chapterSents
      }).forEach(function (q) {
        if (!haveLevel[q.level]) { haveLevel[q.level] = true; seedUnit.comprehension.push(q); }
      });
      seedUnit.comprehension.sort(function (a, b) { return a.level - b.level; });

      /* --- SPEAK：模仿 / 替换 / 自主表达 --- */
      var subs = [];
      structures.forEach(function (s) {
        (s.substitutions || []).forEach(function (x) { if (subs.indexOf(x) < 0) subs.push(x); });
      });

      return {
        id: u.id,
        number: u.number,
        reference: u.reference,
        first: u.verses[0] ? u.verses[0].number : 1,
        last: u.verses[u.verses.length - 1] ? u.verses[u.verses.length - 1].number : 1,
        title: u.title,
        verses: u.verses,
        vocabulary: seedUnit.vocabulary,
        structures: structures,
        notice: (u.notice || []).map(function (q) {
          return {
            kind: 'curated', question: q.question, options: q.options,
            answer: q.answer, correct: q.options[q.answer],
            hint: q.hint || (q.options[q.answer] ? '正确答案：' + q.options[q.answer] : '')
          };
        }),
        comprehension: seedUnit.comprehension,
        speaking: {
          imitate: (u.verses || []).slice(0, 3).map(function (v) { return { text: v.text, verse: v.number }; }),
          substitute: subs.slice(0, 4),
          produce: u.production || ''
        },
        baseline: (u.baseline && u.baseline.length)
          ? u.baseline.map(function (q) {
            return { question: q.question, options: q.options, answer: q.answer, correct: q.options[q.answer], hint: '' };
          })
          : C.baselineFor(seedUnit, lex),
        finalTest: C.finalTestFor(seedUnit, lex),
        curated: true
      };
    });

    return {
      book: course.book,
      bookName: course.bookName,
      bookNameZh: course.bookNameZh,
      chapter: course.chapter,
      reference: course.bookName + ' ' + course.chapter,
      verseCount: allVerses.length,
      verses: allVerses,
      curated: true,
      units: units
    };
  };

  /* =======================================================
     学习记录：步骤 / 单元
  ======================================================= */
  Engine.unitState = function (state, unitId) {
    if (!state.units[unitId]) state.units[unitId] = Engine.normalizeUnit({});
    return state.units[unitId];
  };

  /* 只读：不写入 state（渲染时使用，避免「看一眼」就产生空记录） */
  Engine.readUnit = function (state, unitId) {
    return state.units[unitId] || Engine.normalizeUnit({});
  };

  Engine.markStep = function (state, unitId, stepId) {
    var u = Engine.unitState(state, unitId);
    u.steps[stepId] = true;
    state.stats.steps = Number(state.stats.steps || 0) + 1;
    Engine.saveState(state);
    return u;
  };

  Engine.unitProgress = function (state, unitId) {
    var u = state.units[unitId];
    if (!u) return 0;
    var done = Engine.TRAINING_STEPS.filter(function (s) { return u.steps[s.id]; }).length;
    return Math.round(done / Engine.TRAINING_STEPS.length * 100);
  };

  Engine.chapterProgress = function (state, model) {
    var total = model.units.length;
    var done = model.units.filter(function (u) {
      var st = state.units[u.id];
      return st && st.completed;
    }).length;
    return { done: done, total: total, percent: total ? Math.round(done / total * 100) : 0 };
  };

  Engine.chapterDone = function (state, bookId, chapter) {
    var key = bookId + '.' + chapter;
    var c = state.chapters[key];
    if (c && c.completedAt) return true;
    return !!state.progress.done[key];
  };

  /* 单元完成 → 生成 1/3/7/14 复习计划 */
  Engine.completeUnit = function (state, unitId, model) {
    var u = Engine.unitState(state, unitId);
    u.completed = true;
    u.completedAt = iso(Date.now());
    if (!u.reviews.length) {
      u.reviews = Engine.REVIEW_INTERVALS.map(function (d) {
        return { due: dayKey(addDays(d)), done: false, day: d };
      });
    }
    /* 整章完成检查 */
    if (model) {
      var prog = Engine.chapterProgress(state, model);
      var key = model.book + '.' + model.chapter;
      state.chapters[key] = {
        unitsDone: prog.done,
        unitsTotal: prog.total,
        completedAt: prog.done >= prog.total ? iso(Date.now()) : (state.chapters[key] || {}).completedAt || null
      };
      if (prog.done >= prog.total) {
        state.progress.done[key] = state.chapters[key].completedAt;
        /* 章级复习节点（与单元级并行，便于整章回顾） */
        if (!state.progress.reviewAt[key] || !state.progress.reviewAt[key].length) {
          state.progress.reviewAt[key] = Engine.REVIEW_INTERVALS.map(function (d) {
            return dayKey(addDays(d));
          });
        }
      }
    }
    Engine.saveState(state);
    return u;
  };

  /* =======================================================
     复习调度
  ======================================================= */
  Engine.dueReviews = function (state, refDate) {
    var today = dayKey(refDate || Date.now());
    var out = [];
    Object.keys(state.units).forEach(function (unitId) {
      var u = state.units[unitId];
      (u.reviews || []).forEach(function (r, i) {
        if (r.done) return;
        if (r.due <= today) out.push({ unitId: unitId, index: i, due: r.due, overdueDays: Math.round((new Date(today) - new Date(r.due)) / 86400000) });
      });
    });
    out.sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : 0; });
    return out;
  };

  Engine.upcomingReviews = function (state, days, refDate) {
    var now = new Date(refDate || Date.now());
    var limit = dayKey(addDays(days || 30, now));
    var today = dayKey(now);
    var out = [];
    Object.keys(state.units).forEach(function (unitId) {
      (state.units[unitId].reviews || []).forEach(function (r, i) {
        if (r.done) return;
        if (r.due > today && r.due <= limit) out.push({ unitId: unitId, index: i, due: r.due });
      });
    });
    out.sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    return out;
  };

  Engine.completeReview = function (state, unitId, index) {
    var u = Engine.unitState(state, unitId);
    if (!u.reviews[index]) return false;
    u.reviews.splice(index, 1);       // 完成本次 → 该节点消失，保留后续安排
    u.lastReviewedAt = iso(Date.now());
    Engine.saveState(state);
    return true;
  };

  /* =======================================================
     计划：下一个未完成章节
  ======================================================= */
  Engine.nextChapter = function (state, meta) {
    var books = (meta && meta.books) || [];
    for (var i = 0; i < books.length; i++) {
      for (var c = 1; c <= books[i].chapters; c++) {
        if (!Engine.chapterDone(state, books[i].id, c)) {
          return { book: books[i].id, chapter: c, name: books[i].name, nameZh: books[i].nameZh };
        }
      }
    }
    return null;
  };

  Engine.totalChapters = function (meta) {
    return (meta && meta.totalChapters) || 260;
  };

  Engine.doneChapters = function (state, meta) {
    var n = 0;
    ((meta && meta.books) || []).forEach(function (b) {
      for (var c = 1; c <= b.chapters; c++) {
        if (Engine.chapterDone(state, b.id, c)) n++;
      }
    });
    return n;
  };

  /* =======================================================
     导出 / 导入 / 重置
  ======================================================= */
  Engine.exportData = function (state, settings) {
    return {
      app: 'EBRM',
      version: Engine.VERSION,
      exportedAt: iso(Date.now()),
      progress: state.progress,
      units: state.units,
      chapters: state.chapters,
      last: state.last,
      stats: state.stats,
      settings: settings
    };
  };

  Engine.importData = function (payload) {
    if (!isObj(payload)) throw new Error('数据格式不是对象');
    var looksLikeEbrn = payload.progress || payload.units || payload.chapters;
    if (!looksLikeEbrn) throw new Error('这不是 EBRM 的学习数据（缺少 progress / units / chapters）');
    var state = Engine.normalizeState({
      units: payload.units || {},
      chapters: payload.chapters || {},
      progress: payload.progress || {},
      last: payload.last || null,
      stats: payload.stats || null
    });
    Engine.saveState(state);
    if (isObj(payload.settings)) {
      var s = Engine.loadSettings();
      Object.keys(s).forEach(function (k) {
        if (payload.settings[k] !== undefined && typeof payload.settings[k] === typeof s[k]) s[k] = payload.settings[k];
      });
      Engine.saveSettings(s);
    }
    return state;
  };

  Engine.resetAll = function () {
    try {
      localStorage.removeItem(Engine.STORE);
      localStorage.removeItem(Engine.SET);
    } catch (e) { /* ignore */ }
    return { state: Engine.loadState(), settings: Engine.loadSettings() };
  };

  /* =======================================================
     语音引擎（Voice Engine）
  ======================================================= */
  var Voice = {
    supported: typeof global.speechSynthesis !== 'undefined' && typeof global.SpeechSynthesisUtterance !== 'undefined',
    voices: [],
    voiceURI: '',
    rate: 0.9,
    speaking: false,
    listeners: [],
    _current: null
  };

  Voice.emit = function () {
    Voice.listeners.forEach(function (fn) {
      try { fn({ speaking: Voice.speaking, rate: Voice.rate, voiceURI: Voice.voiceURI }); } catch (e) { }
    });
  };
  Voice.on = function (fn) { Voice.listeners.push(fn); };
  Voice.off = function (fn) { Voice.listeners = Voice.listeners.filter(function (f) { return f !== fn; }); };

  Voice.refresh = function () {
    if (!Voice.supported) return [];
    var all = global.speechSynthesis.getVoices() || [];
    /* 只列出英语声音（en / en-US / en_GB …），绝不用中文声音读英文 */
    Voice.voices = all.filter(function (v) { return /^en([-_]|$)/i.test(v.lang || ''); });
    if (!Voice.voiceURI && Voice.voices.length) {
      var preferred = Voice.voices.filter(function (v) { return /en[-_]US/i.test(v.lang); })[0] || Voice.voices[0];
      Voice.voiceURI = preferred.voiceURI || preferred.name;
    }
    Voice.emit();
    return Voice.voices;
  };

  Voice.init = function (saved) {
    if (saved) {
      if (saved.voiceURI) Voice.voiceURI = saved.voiceURI;
      if (typeof saved.rate === 'number') Voice.rate = saved.rate;
    }
    if (!Voice.supported) return [];
    Voice.refresh();
    if (global.speechSynthesis.addEventListener) {
      global.speechSynthesis.addEventListener('voiceschanged', function () { Voice.refresh(); });
    } else {
      global.speechSynthesis.onvoiceschanged = function () { Voice.refresh(); };
    }
    return Voice.voices;
  };

  Voice.find = function (uri) {
    return Voice.voices.filter(function (v) {
      return (v.voiceURI === uri) || (v.name === uri);
    })[0] || null;
  };

  Voice.setVoice = function (uri) {
    Voice.voiceURI = uri || '';
    Voice.emit();
    return Voice.voiceURI;
  };
  Voice.setRate = function (r) {
    Voice.rate = Math.max(0.5, Math.min(1.6, Number(r) || 0.9));
    Voice.emit();
    return Voice.rate;
  };

  Voice.stop = function () {
    if (!Voice.supported) return;
    try { global.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    Voice.speaking = false;
    Voice._current = null;
    Voice.emit();
  };

  /* 朗读；opts: { onVerse(index), onDone(), onError() } */
  Voice.speak = function (text, opts) {
    opts = opts || {};
    if (!Voice.supported) {
      if (opts.onError) opts.onError('unsupported');
      return false;
    }
    var parts = opts.parts && opts.parts.length ? opts.parts : [text];
    if (!parts.length || !String(parts.join('')).trim()) {
      if (opts.onError) opts.onError('empty');
      return false;
    }

    Voice.stop();

    var idx = 0;
    Voice.speaking = true;
    Voice.emit();

    function next() {
      if (!Voice.speaking) return;
      if (idx >= parts.length) {
        Voice.speaking = false;
        Voice.emit();
        if (opts.onDone) opts.onDone();
        return;
      }
      var i = idx;
      var u = new global.SpeechSynthesisUtterance(String(parts[i]));
      u.lang = 'en-US';
      u.rate = Voice.rate;
      u.pitch = 0.95;
      u.volume = 1;
      var found = Voice.find(Voice.voiceURI);
      if (found) u.voice = found;
      u.onstart = function () {
        if (opts.onVerse) opts.onVerse(i);
      };
      u.onend = function () {
        idx++;
        if (!Voice.speaking) return;
        global.setTimeout(next, 60);
      };
      u.onerror = function () {
        Voice.speaking = false;
        Voice.emit();
        if (opts.onError) opts.onError('playback');
      };
      try {
        global.speechSynthesis.speak(u);
      } catch (e) {
        Voice.speaking = false;
        Voice.emit();
        if (opts.onError) opts.onError('exception');
      }
    }
    next();
    return true;
  };

  /* 兼容别名（旧接口） */
  Voice.isSpeaking = function () { return Voice.speaking; };

  Engine.Voice = Voice;

  /* 语音可用性说明 */
  Engine.voiceStatus = function () {
    if (!Voice.supported) return { ok: false, message: '当前浏览器不支持语音朗读（speechSynthesis），请更换 Chrome / Edge / Safari。' };
    if (!Voice.voices.length) return { ok: true, message: '正在读取系统英语语音…', voices: 0 };
    return { ok: true, message: '可用英语语音 ' + Voice.voices.length + ' 个', voices: Voice.voices.length };
  };

  global.EBRM = global.EBRM || {};
  global.EBRM.Engine = Engine;

})(typeof window !== 'undefined' ? window : globalThis);
