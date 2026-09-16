/* =========================================================
   EBRM 2.0 · APP（UI 层）
   ---------------------------------------------------------
   两层：
     A. Bible Reader  —— 看圣经 / 章节导航 / 笔记 / 书签 / 计划
     B. Learning      —— BASELINE READ LISTEN NOTICE VOCABULARY
                         STRUCTURE DIRECT COMPREHENSION SPEAK
                         RE-READ FINAL TEST → RESULT → REVIEW

   全部交互统一走 addEventListener + data-act 事件委托，
   不使用任何 inline onclick。
========================================================= */
(function () {
  'use strict';

  var E = window.EBRM.Engine;
  var C = window.EBRM.Content;
  var V = E.Voice;

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function h(tag, cls, html) {
    return '<' + tag + (cls ? ' class="' + cls + '"' : '') + '>' + (html || '') + '</' + tag + '>';
  }

  /* =======================================================
     应用状态
  ======================================================= */
  var App = {
    mode: 'full',          // full（全 27 卷） | course（John 1 课程）
    state: null,
    settings: null,
    meta: null,
    view: 'home',
    sess: {
      book: 'MAT', chapter: 1,
      model: null, curated: null,
      unitIndex: 0, step: 'baseline',
      loading: false, error: '',
      answers: {}, pickedWords: {}, pickedSub: '',
      produce: '', reviewUnit: '', reviewStep: 0,
      tmp: {}                 // 重绘前的输入暂存（避免丢失用户输入）
    },
    locked: false
  };
  window.EBRM.App = App;

  var toastTimer = null;
  function toast(msg, ms) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, ms || 2000);
  }

  /* =======================================================
     启动
  ======================================================= */
  function boot(opts) {
    opts = opts || {};
    App.mode = opts.mode || 'full';

    var root = document.body;
    if (!root.getAttribute('data-ebrm-mode')) root.setAttribute('data-ebrm-mode', App.mode);

    setStateBox('readerState', '正在加载经文数据…', 'loading');

    E.bootstrap().then(function () {
      App.meta = E.meta();
      App.state = E.loadState();
      App.settings = E.loadSettings();
      applySettings();

      V.init(App.settings);
      V.on(updateSpeechUI);
      if (typeof V.on === 'function' && App.settings.voiceURI) V.setVoice(App.settings.voiceURI);

      buildStaticUI();

      /* 恢复上次位置 / 课程模式固定 */
      if (App.mode === 'course') {
        App.sess.book = 'JHN';
        App.sess.chapter = 1;
        App.view = 'home';
      } else if (App.state.last && App.state.last.book) {
        App.sess.book = App.state.last.book;
        App.sess.chapter = App.state.last.chapter || 1;
        App.sess.unitIndex = App.state.last.unit || 0;
        App.sess.step = App.state.last.step || 'baseline';
        App.view = 'home';
      }

      return openChapter(App.sess.book, App.sess.chapter, { silent: true });
    }).then(function () {
      updateHome();
      go(App.view, { keep: true });
      if (App.mode === 'course' && App.state.last && App.state.last.step) {
        /* 课程模式：回到上次的单元与步骤 */
        App.sess.unitIndex = Math.min(App.state.last.unit || 0, Math.max(0, activeModel().units.length - 1));
        App.sess.step = App.state.last.step;
      }
    }).catch(function (err) {
      console.error('EBRM boot failed', err);
      renderFatal(err);
    });
  }
  App.boot = boot;

  function setStateBox(id, msg, kind) {
    var box = $(id);
    if (!box) return;
    box.className = 'state-box' + (kind ? ' ' + kind : '');
    box.innerHTML = esc(msg);
    box.classList.remove('hidden');
  }

  function renderFatal(err) {
    document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
    var box = $('fatalBox');
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML =
        '<div class="card"><div class="eyebrow">ERROR</div><h2>页面初始化失败</h2>' +
        '<p class="muted">' + esc(err && err.message ? err.message : String(err)) + '</p>' +
        '<p class="tiny">请检查网络后刷新页面；本地经文数据位于 data/nt/ 目录。</p>' +
        '<button class="primary wide" data-act="reload">重新加载</button></div>';
    }
  }

  /* =======================================================
     设置应用
  ======================================================= */
  function applySettings() {
    document.body.classList.toggle('compact', !!App.settings.compactMode);
    var vs = document.querySelectorAll('.verses');
    for (var i = 0; i < vs.length; i++) vs[i].style.fontSize = App.settings.font + 'px';
    if (V.supported) {
      V.setRate(App.settings.rate);
      if (App.settings.voiceURI) V.setVoice(App.settings.voiceURI);
    }
  }

  function applyVerseFont() {
    var vs = document.querySelectorAll('.verses');
    for (var i = 0; i < vs.length; i++) vs[i].style.fontSize = App.settings.font + 'px';
  }

  /* =======================================================
     静态骨架（书卷列表 / 复习 / 计划 / 设置）
  ======================================================= */
  function buildStaticUI() {
    renderBookGrid();
    renderReviewView();
    renderPlanView();
    renderSettingsView();
    updateHome();
  }

  function renderBookGrid() {
    var wrap = $('bookList');
    if (!wrap) return;
    var books = (App.meta.books || []).filter(function (b) {
      return App.mode === 'course' ? b.id === 'JHN' : true;
    });
    wrap.innerHTML = books.map(function (b) {
      return '<button class="bookbtn" data-act="book" data-book="' + b.id + '">' +
        '<b>' + esc(b.name) + (bookMark(b.id) ? '<span class="dot' + (bookMark(b.id) === 'part' ? ' part' : '') + '"></span>' : '') + '</b>' +
        '<small>' + esc(b.nameZh) + ' · ' + b.chapters + ' 章</small></button>';
    }).join('');
  }

  function bookMark(bookId) {
    var total = 0, done = 0;
    var b = (App.meta.books || []).filter(function (x) { return x.id === bookId; })[0];
    if (!b) return '';
    for (var c = 1; c <= b.chapters; c++) {
      total++;
      if (E.chapterDone(App.state, bookId, c)) done++;
    }
    if (done === 0) return '';
    return done >= total ? 'full' : 'part';
  }

  function highlightBook() {
    document.querySelectorAll('[data-act=book]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-book') === App.sess.book);
    });
  }

  function renderChapterStrip() {
    var wrap = $('chapterStrip');
    if (!wrap) return;
    var b = (App.meta.books || []).filter(function (x) { return x.id === App.sess.book; })[0];
    if (!b) { wrap.innerHTML = ''; return; }
    var maxCh = App.mode === 'course' ? 1 : b.chapters;
    var html = '';
    for (var c = 1; c <= maxCh; c++) {
      var cls = 'chip';
      if (E.chapterDone(App.state, App.sess.book, c)) cls += ' done';
      if (Number(App.sess.chapter) === c) cls += ' active';
      html += '<button class="' + cls + '" data-act="chapter" data-ch="' + c + '">' + c + '</button>';
    }
    wrap.innerHTML = html;
    var sel = $('chapterSelect');
    if (sel) {
      sel.innerHTML = '';
      for (var k = 1; k <= maxCh; k++) {
        var o = document.createElement('option');
        o.value = k; o.textContent = '第 ' + k + ' 章';
        sel.appendChild(o);
      }
      sel.value = String(App.sess.chapter);
    }
    var title = $('readerHeading');
    if (title) title.textContent = b.name + ' ' + App.sess.chapter;
    var zh = $('readerHeadingZh');
    if (zh) zh.textContent = b.nameZh + ' · 第 ' + App.sess.chapter + ' 章';
  }

  function chapterStats() {
    var model = App.sess.curated || App.sess.model;
    if (!model) return { done: 0, total: 0, percent: 0 };
    return E.chapterProgress(App.state, model);
  }

  function firstIncompleteUnitIndex() {
    var m = activeModel();
    for (var i = 0; i < m.units.length; i++) {
      var st = App.state.units[m.units[i].id];
      if (!st || !st.completed) return i;
    }
    return 0;
  }
  App.firstIncompleteUnitIndex = firstIncompleteUnitIndex;

  function updateHome() {
    if (!App.meta) return;
    var course = App.mode === 'course';
    var total, done;
    if (course) {
      var m0 = activeModel();
      total = m0.units ? m0.units.length : 7;
      done = (m0.units || []).filter(function (u) {
        var st = App.state.units[u.id];
        return st && st.completed;
      }).length;
    } else {
      total = E.totalChapters(App.meta);
      done = E.doneChapters(App.state, App.meta);
    }
    var pct = total ? Math.round(done / total * 100) : 0;
    var set = function (id, v) { var e = $(id); if (e) e.textContent = v; };
    set('homeDone', done);
    set('homeTotal', total);
    set('homePercent', pct + '%');
    var fill = $('homeBar');
    if (fill) fill.style.width = pct + '%';

    var hint = $('homeNextHint');
    if (course) {
      var i = firstIncompleteUnitIndex();
      var u = activeModel().units[i];
      if (hint) {
        hint.textContent = u
          ? ('下一个单元：U' + String(u.number).padStart(2, '0') + ' · ' + u.reference + '（' + u.title + '）')
          : '课程已全部完成 — 进入间隔复习巩固。';
      }
    } else {
      var next = E.nextChapter(App.state, App.meta);
      if (hint) {
        hint.textContent = next
          ? ('下一章：' + next.name + ' ' + next.chapter + '（' + next.nameZh + '）')
          : '全部 260 章已完成 — 继续进入间隔复习。';
      }
    }
    var due = E.dueReviews(App.state).length;
    var dueEl = $('homeDue');
    if (dueEl) dueEl.textContent = due ? (due + ' 项复习到期') : '暂无到期复习';
    var dueBadge = $('navDueBadge');
    if (dueBadge) {
      dueBadge.textContent = due ? ' ' + due : '';
      dueBadge.classList.toggle('hidden', !due);
    }
  }

  /* =======================================================
     视图切换
  ======================================================= */
  function go(view, opts) {
    opts = opts || {};
    App.view = view;
    document.querySelectorAll('.view').forEach(function (v) {
      v.classList.toggle('active', v.id === 'view-' + view);
    });
    document.querySelectorAll('.topnav [data-act]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-act') === view);
    });
    if (view === 'review') renderReviewView();
    if (view === 'plan') renderPlanView();
    if (view === 'settings') renderSettingsView();
    if (view === 'home') updateHome();
    if (view === 'reader') { highlightBook(); renderChapterStrip(); renderReaderBody(); }
    if (view === 'learn') renderLearn();
    if (!opts.keep) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  App.go = go;

  function persistPosition(step) {
    if (!App.state) return;
    App.state.last = {
      book: App.sess.book, chapter: Number(App.sess.chapter),
      unit: App.sess.unitIndex, step: step || App.sess.step
    };
    E.saveState(App.state);
  }

  /* =======================================================
     Bible Reader
  ======================================================= */
  function openChapter(bookId, chapter, opts) {
    opts = opts || {};
    if (App.mode === 'course') { bookId = 'JHN'; chapter = 1; }   // 课程模式：锁定 John 1
    App.sess.book = bookId;
    App.sess.chapter = Number(chapter);
    App.sess.loading = true;
    App.sess.error = '';
    App.sess.answers = {};
    App.sess.pickedWords = {};
    App.sess.produce = '';
    App.sess.tmp = {};
    App.sess.reviewUnit = '';

    if (App.view === 'reader') renderReaderBody();
    if (App.view === 'learn') renderLearn();

    return E.open(bookId, chapter).then(function (r) {
      App.sess.model = r.model;
      App.sess.curated = r.curated ? E.curatedModel(r.curated) : null;
      App.sess.loading = false;
      if (App.sess.unitIndex >= activeModel().units.length) App.sess.unitIndex = 0;

      if (App.settings.autoMarkRead && !opts.silent) {
        var k = bookId + '.' + App.sess.chapter;
        if (!App.state.progress.read[k]) {
          App.state.progress.read[k] = true;
          E.saveState(App.state);
        }
      }
      highlightBook();
      renderChapterStrip();
      updateHome();
      if (App.view === 'reader') renderReaderBody();
      if (App.view === 'learn') renderLearn();
      return r;
    }).catch(function (err) {
      App.sess.loading = false;
      App.sess.error = err && err.message ? err.message : '经文加载失败';
      if (App.view === 'reader') renderReaderBody();
      if (App.view === 'learn') renderLearn();
      throw err;
    });
  }
  App.openChapter = openChapter;

  function activeModel() {
    return App.sess.curated || App.sess.model || { units: [], reference: '', verseCount: 0 };
  }
  App.activeModel = activeModel;

  function renderReaderBody() {
    var box = $('verseArea');
    if (!box) return;
    if (App.sess.loading) {
      box.innerHTML = '<div class="state-box loading">正在加载经文…</div>';
      return;
    }
    if (App.sess.error) {
      box.innerHTML = '<div class="state-box error">' + esc(App.sess.error) +
        '<div style="margin-top:10px"><button class="primary" data-act="reload-chapter">重新加载</button></div></div>';
      return;
    }
    var model = App.sess.model;
    if (!model || !model.verses) {
      box.innerHTML = '<div class="state-box">正在准备经文…</div>';
      return;
    }
    var vlist = App.sess.curated && App.sess.curated.verses && App.sess.curated.verses.length
      ? App.sess.curated.verses : model.verses;
    box.innerHTML = '<div class="verses" id="verseList">' + vlist.map(function (v, i) {
      return '<div class="verse" data-verse="' + i + '"><sup>' + v.number + '</sup>' + esc(v.text) + '</div>';
    }).join('') + '</div>';
    applyVerseFont();

    var meta = $('sourceMeta');
    if (meta) {
      meta.textContent = 'World English Bible · 本地经文数据 · ' + vlist.length + ' 节';
    }
    var note = $('chapterNote');
    if (note) note.value = App.state.progress.notes[App.sess.book + '.' + App.sess.chapter] || '';
    var bm = $('bookmarkBtn');
    if (bm) {
      var on = !!App.state.progress.bookmarks[App.sess.book + '.' + App.sess.chapter];
      bm.textContent = on ? '🔖 已书签' : '🔖 书签';
      bm.classList.toggle('primary', on);
    }
    var ct = $('chapterTitle');
    if (ct) ct.textContent = model.reference || (model.bookName + ' ' + model.chapter);
    var pv = $('prevBtn'), nx = $('nextBtn');
    if (pv) pv.disabled = !hasPrev();
    if (nx) nx.disabled = !hasNext();

    var stats = chapterStats();
    var st = $('chapterStatus');
    if (st) {
      st.innerHTML = '<span class="badge' + (stats.percent === 100 ? ' ok' : '') + '">' +
        '本章训练 ' + stats.done + ' / ' + stats.total + ' 单元（' + stats.percent + '%）</span>' +
        (stats.total ? ' <span class="badge grey">' + activeModel().units.length + ' 个学习单元</span>' : '');
    }
    var bar = $('chapterBar');
    if (bar) bar.style.width = stats.percent + '%';
  }

  function hasPrev() {
    if (App.mode === 'course') return false;
    if (Number(App.sess.chapter) > 1) return true;
    return bookIndex() - 1 >= 0;
  }
  function hasNext() {
    if (App.mode === 'course') return false;
    var b = (App.meta.books || []).filter(function (x) { return x.id === App.sess.book; })[0];
    if (!b) return false;
    if (Number(App.sess.chapter) < b.chapters) return true;
    return bookIndex() + 1 < (App.meta.books || []).length;
  }
  function bookIndex() {
    return (App.meta.books || []).map(function (b) { return b.id; }).indexOf(App.sess.book);
  }

  function gotoPrev() {
    if (!hasPrev()) { toast('已经是第一卷第一章'); return; }
    if (Number(App.sess.chapter) > 1) {
      openChapter(App.sess.book, Number(App.sess.chapter) - 1);
    } else {
      var prev = (App.meta.books || [])[bookIndex() - 1];
      openChapter(prev.id, prev.chapters);
    }
    toast('上一章');
  }
  function gotoNext() {
    if (!hasNext()) { toast('已经是最后一卷最后一章'); return; }
    var b = (App.meta.books || []).filter(function (x) { return x.id === App.sess.book; })[0];
    if (Number(App.sess.chapter) < b.chapters) {
      openChapter(App.sess.book, Number(App.sess.chapter) + 1);
    } else {
      var next = (App.meta.books || [])[bookIndex() + 1];
      openChapter(next.id, 1);
    }
    toast('下一章');
  }

  /* =======================================================
     Learning Engine —— 主渲染
  ======================================================= */
  /* 重绘前把用户还没保存的输入收进内存，避免丢失 */
  function captureInputs() {
    var note = $('stepNote');
    if (note && note.dataset.note) App.sess.tmp[note.dataset.note] = note.value;
    var sp = $('speakAnswer');
    if (sp) App.sess.tmp[App.sess.step] = sp.value;
  }
  function tmpOr(key, fallback) {
    return App.sess.tmp[key] !== undefined ? App.sess.tmp[key] : (fallback || '');
  }

  function renderLearn() {
    captureInputs();
    var head = $('learnStepLabel'), title = $('learnTitle');
    if (App.sess.loading) {
      $('learnBody').innerHTML = '<div class="state-box loading">正在准备学习单元…</div>';
      return;
    }
    if (App.sess.error) {
      $('learnBody').innerHTML = '<div class="state-box error">' + esc(App.sess.error) +
        '<div style="margin-top:10px"><button class="primary" data-act="reload-chapter">重新加载</button></div></div>';
      return;
    }
    var model = activeModel();
    if (!model.units.length) {
      $('learnBody').innerHTML = '<div class="state-box">这一章暂时没有可用的学习单元。</div>';
      return;
    }
    if (App.sess.unitIndex >= model.units.length) App.sess.unitIndex = 0;

    var unit = currentUnit();
    var stepsDone = E.readUnit(App.state, unit.id).steps;

    if (App.sess.step === 'result') {
      if (head) head.textContent = 'RESULT';
      if (title) title.textContent = '学习结果';
    } else if (App.sess.step === 'review') {
      if (head) head.textContent = 'REVIEW';
      if (title) title.textContent = '间隔复习';
    } else {
      var sd = E.TRAINING_STEPS.filter(function (s) { return s.id === App.sess.step; })[0] || E.TRAINING_STEPS[0];
      if (head) head.textContent = 'STEP ' + String(sd.no).padStart(2, '0') + ' · ' + sd.en;
      if (title) title.textContent = sd.zh;
    }

    /* 单元选择条 */
    var strip = $('unitStrip');
    if (strip) {
      strip.innerHTML = model.units.map(function (u, i) {
        var st = App.state.units[u.id];
        var cls = 'unit-pill';
        if (st && st.completed) cls += ' done';
        if (i === App.sess.unitIndex) cls += ' active';
        return '<button class="' + cls + '" data-act="open-unit" data-unit="' + i + '">' +
          'U' + String(u.number).padStart(2, '0') + ' · ' + esc(u.reference.replace(/^[^0-9]*/, '')) + '</button>';
      }).join('');
    }

    /* 步骤导航 */
    var rail = $('stepRail');
    if (rail) {
      var nodes = E.TRAINING_STEPS.map(function (s) {
        var cls = 'step-node';
        if (stepsDone[s.id]) cls += ' done';
        if (s.id === App.sess.step) cls += ' active';
        return '<button class="' + cls + '" data-act="step" data-step="' + s.id + '"><b>' +
          String(s.no).padStart(2, '0') + '</b>' + esc(s.zh) + '</button>';
      });
      var unitState = E.readUnit(App.state, unit.id);
      var rcls = 'step-node' + (unitState.completed ? ' done' : '') + (App.sess.step === 'result' ? ' active' : '');
      nodes.push('<button class="' + rcls + '" data-act="step" data-step="result"><b>11</b>学习结果</button>');
      rail.innerHTML = nodes.join('');
    }

    var banner = $('stepBanner');
    if (banner) {
      var b2 = E.TRAINING_STEPS.filter(function (s) { return s.id === App.sess.step; })[0];
      if (b2) {
        banner.classList.remove('hidden');
        banner.innerHTML = '<b>' + esc(unit.reference) + '</b> · ' + esc(unit.title) + '<br>' + esc(b2.hint);
      } else {
        banner.classList.add('hidden');
      }
    }

    var body = $('learnBody');
    var fn = {
      baseline: stepBaseline, read: stepRead, listen: stepListen, notice: stepNotice,
      vocabulary: stepVocabulary, structure: stepStructure, comprehension: stepComprehension,
      speak: stepSpeak, reread: stepReread, finalTest: stepFinal,
      result: stepResult, review: stepReview
    }[App.sess.step] || stepRead;
    body.innerHTML = fn(unit);

    bindDynamicUnit(unit);
    applyVerseFont();
  }
  App.renderLearn = renderLearn;

  function currentUnit() {
    var model = activeModel();
    return model.units[App.sess.unitIndex] || model.units[0];
  }
  App.currentUnit = currentUnit;

  /* 动态控件绑定（select / 文件输入 / 语音） */
  function bindDynamicUnit(unit) {
    var sel = $('voiceSelect');
    if (sel) {
      sel.innerHTML = V.voices.length
        ? V.voices.map(function (v) {
          return '<option value="' + esc(v.voiceURI || v.name) + '"' +
            ((v.voiceURI || v.name) === V.voiceURI ? ' selected' : '') + '>' +
            esc(v.name + ' (' + v.lang + ')') + '</option>';
        }).join('')
        : '<option value="">（系统未提供英语语音）</option>';
    }
    var note = $('stepNote');
    if (note) {
      var us = E.readUnit(App.state, unit.id);
      if (!note.value) note.value = us.notes[App.sess.step] || '';
    }
  }

  /* ---------- 通用：题目渲染 ---------- */
  function questionBlock(q, qi, ns) {
    var picked = App.sess.answers[ns + ':' + qi];
    var answered = picked !== undefined;
    var html = '<div class="q-block" id="q-' + ns + '-' + qi + '">';
    html += '<div class="q-title">' + esc(q.question) + '</div>';
    html += '<div class="opts">';
    q.options.forEach(function (op, oi) {
      var cls = 'opt';
      if (answered) {
        if (oi === q.answer) cls += ' right';
        else if (oi === picked) cls += ' wrong';
      }
      html += '<button class="' + cls + '" data-act="opt" data-ns="' + ns + '" data-q="' + qi +
        '" data-i="' + oi + '"' + (answered ? ' disabled' : '') + '>' + esc(op) + '</button>';
    });
    html += '</div>';
    if (answered) {
      var ok = picked === q.answer;
      html += '<div class="q-hint ' + (ok ? 'good' : 'bad') + '">' +
        (ok ? '✓ 正确' : '✗ 正确答案：' + esc(q.options[q.answer])) +
        (q.hint ? ' · ' + esc(q.hint) : '') + '</div>';
    }
    html += '</div>';
    return html;
  }

  function scoreOf(questions, ns) {
    var right = 0, answered = 0;
    questions.forEach(function (q, i) {
      var p = App.sess.answers[ns + ':' + i];
      if (p === undefined) return;
      answered++;
      if (p === q.answer) right++;
    });
    return { right: right, answered: answered, total: questions.length };
  }

  /* ---------- 01 BASELINE ---------- */
  function stepBaseline(unit) {
    var qs = unit.baseline && unit.baseline.length ? unit.baseline : unit.comprehension.slice(0, 3);
    if (!qs.length) return emptyStep(unit, 'baseline');
    var us = E.readUnit(App.state, unit.id);
    var sc = scoreOf(qs, 'baseline');
    var html = '<div class="card"><div class="eyebrow">BASELINE · 第一次理解</div>' +
      '<h3>' + esc(unit.reference) + '</h3>' +
      '<p class="muted">不查中文、不查词典。只根据英文，凭现在的理解回答。这不是考试，只是让系统知道你的起点。</p>' +
      '<div class="rule-box"></div></div>';
    html += qs.map(function (q, i) { return questionBlock(q, i, 'baseline'); }).join('');
    html += '<div class="card center">' + (sc.answered === sc.total
      ? '<p><b>第一次理解：' + sc.right + ' / ' + sc.total + '（' + Math.round(sc.right / sc.total * 100) + '%）</b></p>' +
      '<p class="tiny">记住这个分数，学完这一单元后我们再看变化。</p>'
      : '<p class="muted">回答完 ' + sc.total + ' 题后继续。</p>') + '</div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="mark-step" data-step="baseline"' +
      (sc.answered === sc.total ? '' : ' disabled') + '>提交第一次理解，进入 READ →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 02 READ ---------- */
  function stepRead(unit) {
    var html = '<div class="card tight">' +
      '<div class="eyebrow">READ · 读经</div>' +
      '<p class="muted" style="margin:2px 0 0">先不翻译。问自己：<b>What is happening?</b> 读完之后再进入观察。</p></div>';
    html += '<div class="card">' + verseListHTML(unit, 'read') + '</div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="play-unit" data-part="read">🔊 朗读本单元经文</button>' +
      '<button class="wide" data-act="stop-speech">⏹ 停止</button>' +
      '<button class="primary wide" data-act="mark-step" data-step="read">我已读完，进入 LISTEN →</button>' +
      '</div>';
    return html;
  }

  function verseListHTML(unit, ns) {
    return '<div class="verses" id="verses-' + ns + '">' + unit.verses.map(function (v, i) {
      return '<div class="verse" data-vidx="' + i + '"><sup>' + v.number + '</sup>' + esc(v.text) + '</div>';
    }).join('') + '</div>';
  }

  /* ---------- 03 LISTEN ---------- */
  function stepListen(unit) {
    var status = E.voiceStatus();
    var html = '<div class="card">' +
      '<div class="eyebrow">LISTEN · 听读</div>' +
      '<h3>' + esc(unit.reference) + '</h3>' +
      (status.ok ? '' : '<div class="state-box error">' + esc(status.message) + '</div>') +
      '<div class="voice-panel">' +
      '<div class="field"><label>英语声音 Voice</label><select id="voiceSelect" data-act="voice"></select>' +
      '<div class="tiny">' + esc(status.message) + '</div></div>' +
      '<div class="field"><label>语速 Speed</label><div class="speed-row">' +
      [0.7, 0.9, 1.0, 1.2].map(function (r) {
        return '<button class="' + (Math.abs(V.rate - r) < 0.001 ? 'active' : '') + '" data-act="rate" data-rate="' + r + '">' +
          (r === 0.7 ? '慢速 0.7' : r === 0.9 ? '正常 0.9' : r === 1.0 ? '原速 1.0' : '较快 1.2') + '</button>';
      }).join('') + '</div></div>' +
      '<div class="field"><button class="primary wide" data-act="play-unit" data-part="listen">▶ 播放本单元</button>' +
      '<div class="row" style="margin-top:8px">' +
      '<button data-act="stop-speech">⏹ 停止</button>' +
      '<button data-act="replay-unit">↺ 重新播放</button>' +
      '</div>' +
      '<div class="speech-status" id="speechStatus" style="margin-top:8px">未播放</div></div>' +
      '</div></div>';
    html += '<div class="card tight"><p class="muted" style="margin:0">点任意一节可以单独听这一节。</p></div>';
    html += '<div class="card">' + verseListHTML(unit, 'listen') + '</div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="mark-step" data-step="listen">我已听过，进入 NOTICE →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 04 NOTICE ---------- */
  function stepNotice(unit) {
    var qs = unit.notice || [];
    var us = E.readUnit(App.state, unit.id);
    var html = '<div class="card tight">' +
      '<div class="eyebrow">NOTICE · 观察</div>' +
      '<p class="muted" style="margin:2px 0 0">找：<b>重复 · 对比 · 人物 · 动作 · 关系 · 焦点</b>。先看见，再翻译。</p></div>';
    html += qs.map(function (q, i) { return questionBlock(q, i, 'notice'); }).join('');
    html += '<div class="card"><h3>我看见了什么</h3>' +
      '<p class="muted">用一句话写下你观察到的语言现象（可用中文）。</p>' +
      '<textarea id="stepNote" data-note="notice" placeholder="例如：Word 一再重复，light 与 darkness 形成对比…">' + esc(tmpOr('notice', us.notes.notice)) + '</textarea>' +
      '</div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="mark-step" data-step="notice">保存观察，进入 VOCABULARY →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 05 VOCABULARY ---------- */
  function stepVocabulary(unit) {
    var us = E.readUnit(App.state, unit.id);
    var picked = App.sess.pickedWords;
    Object.keys(picked).forEach(function () { });
    var html = '<div class="card tight">' +
      '<div class="eyebrow">VOCABULARY · 核心词汇</div>' +
      '<p class="muted" style="margin:2px 0 0">由少到多。不只是背中文 —— 把每个词重新放回经文。点词可以听发音。</p></div>';
    html += '<div class="card">';
    if (!unit.vocabulary.length) {
      html += '<p class="muted">这一单元没有需要单独教的词（多为专名或极常用词）。</p>';
    } else {
      html += '<div class="word-grid">' + unit.vocabulary.map(function (v) {
        var on = picked[v.english] !== undefined ? picked[v.english] : (us.vocabulary || []).indexOf(v.english) >= 0;
        picked[v.english] = on;
        return '<button class="word' + (on ? ' picked' : '') + '" data-act="word" data-word="' + esc(v.english) + '">' +
          '<b>' + esc(v.english) + '</b>' +
          '<small>' + esc(v.zh) + ' · ' + esc(v.gloss) + '</small></button>';
      }).join('') + '</div>';
      html += '<hr class="sep">';
      html += unit.vocabulary.map(function (v) {
        var on = picked[v.english];
        if (!on) return '';
        return '<div class="struct-card" style="padding:11px">' +
          '<div class="row" style="align-items:center">' +
          '<b style="font-family:var(--serif);font-size:17px;flex:1 1 auto">' + esc(v.english) + '</b>' +
          '<button class="sm" data-act="speak-word" data-word="' + esc(v.english) + '">🔊 发音</button></div>' +
          '<div class="kv"><b>词义</b>：' + esc(v.zh) + ' · ' + esc(v.gloss) + '</div>' +
          (v.example ? '<div class="kv"><b>经文例句</b>：<span style="font-family:var(--serif)">' + esc(v.example) + '</span></div>' : '') +
          '</div>';
      }).join('');
    }
    html += '</div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="mark-step" data-step="vocabulary">保存词汇，进入 STRUCTURE →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 06 STRUCTURE ---------- */
  function stepStructure(unit) {
    var html = '<div class="card tight">' +
      '<div class="eyebrow">STRUCTURE · 句子结构</div>' +
      '<p class="muted" style="margin:2px 0 0">不是为了背语法名称，而是看见英语怎样组织意义。</p></div>';
    if (!unit.structures.length) {
      html += '<div class="card"><p class="muted">这一单元以短句为主，没有需要单独拆解的句型。直接进入直接理解。</p></div>';
    }
    html += (unit.structures || []).map(function (s, i) {
      var h2 = '<div class="struct-card">';
      h2 += '<div class="q-meta">原句 ' + (i + 1) + '</div>';
      h2 += '<div class="struct-sentence">' + esc(s.sentence) + '</div>';
      if (s.pattern) h2 += '<div class="pattern-line">句型：' + esc(s.pattern) + '</div>';
      if (s.breakdown && s.breakdown.length) {
        h2 += '<div class="breakdown">' + s.breakdown.map(function (b, bi) {
          return (bi ? '<i>+</i>' : '') + '<span>' + esc(b) + '</span>';
        }).join('') + '</div>';
      }
      if (s.explanation) h2 += '<div class="kv"><b>说明</b>：' + esc(s.explanation) + '</div>';
      if (s.meaning && s.meaning.length) {
        h2 += '<div class="kv"><b>本句词义</b>：<div class="wordmap">' + s.meaning.map(function (m) {
          return '<span>' + esc(m.en) + ' <i>' + esc(m.zh) + '</i></span>';
        }).join('') + '</div></div>';
      }
      if (s.example) h2 += '<div class="kv"><b>例句</b>：<span style="font-family:var(--serif)">' + esc(s.example) + '</span></div>';
      h2 += '<div class="row" style="margin-top:8px">' +
        '<button class="sm" data-act="speak-text" data-text="' + esc(s.sentence) + '">🔊 听原句</button>' +
        (s.substitutions && s.substitutions.length ? '<button class="sm" data-act="speak-text" data-text="' + esc(s.substitutions[0]) + '">🔊 听替换句</button>' : '') +
        '</div>';
      if (s.substitutions && s.substitutions.length) {
        h2 += '<hr class="sep"><div class="q-meta">SUBSTITUTE · 保持句型，替换一个核心词（句型操练）</div>';
        h2 += '<div class="opts" style="margin-top:8px">' + s.substitutions.map(function (x) {
          return '<button class="opt" data-act="speak-text" data-text="' + esc(x) + '">' + esc(x) + '</button>';
        }).join('') + '</div>';
      }
      h2 += '</div>';
      return h2;
    }).join('');
    html += '<div class="card"><h3>我注意到的句型</h3>' +
      '<textarea id="stepNote" data-note="structure" placeholder="例如：In the beginning was … 把时间背景放在句首">' +
      esc(tmpOr('structure', E.readUnit(App.state, unit.id).notes.structure)) + '</textarea></div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="mark-step" data-step="structure">保存，进入 DIRECT COMPREHENSION →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 07 DIRECT COMPREHENSION ---------- */
  function stepComprehension(unit) {
    var qs = unit.comprehension || [];
    var html = '<div class="card tight">' +
      '<div class="eyebrow">DIRECT COMPREHENSION · 直接理解</div>' +
      '<p class="muted" style="margin:2px 0 0"><b>English → Meaning</b>：不先翻译，直接判断英文在说什么。难度从「认人认物」递进到「整段主旨」。</p></div>';
    if (!qs.length) html += '<div class="card"><p class="muted">这一单元没有足够的理解素材。</p></div>';
    html += qs.map(function (q, i) {
      return '<div class="card" style="padding:0"><div style="padding:12px">' +
        '<div class="q-meta">LEVEL ' + q.level + '</div>' +
        questionBlock(q, i, 'comp') + '</div></div>';
    }).join('');
    var sc = scoreOf(qs, 'comp');
    html += '<div class="card center"><b>已答 ' + sc.answered + ' / ' + sc.total + '，正确 ' + sc.right + '</b></div>';
    html += '<div class="card"><h3>我的理解</h3>' +
      '<textarea id="stepNote" data-note="comprehension" placeholder="用英文或中文写下这段经文在说什么">' +
      esc(tmpOr('comprehension', E.readUnit(App.state, unit.id).notes.comprehension)) + '</textarea></div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="mark-step" data-step="comprehension">保存，进入 SPEAK →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 08 SPEAK ---------- */
  function stepSpeak(unit) {
    var sp = unit.speaking || { imitate: [], substitute: [], produce: '' };
    var us = E.readUnit(App.state, unit.id);
    var html = '<div class="card tight">' +
      '<div class="eyebrow">SPEAK · 英文表达</div>' +
      '<p class="muted" style="margin:2px 0 0">模仿 → 替换 → 自主表达。</p></div>';

    html += '<div class="card"><div class="eyebrow">STAGE 1 · IMITATE 模仿</div>' +
      '<p class="muted">听一句，然后自己重复。</p>';
    html += sp.imitate.map(function (s, i) {
      return '<div class="rev-row"><div class="grow" style="font-family:var(--serif);font-size:15.5px">' + esc(s.text) + '</div>' +
        '<button class="sm" data-act="speak-text" data-text="' + esc(s.text) + '">🔊 听</button>' +
        '<button class="sm" data-act="imitate-done" data-i="' + i + '">✓ 跟读</button></div>';
    }).join('') || '<p class="muted">本单元没有可跟读的短句。</p>';
    html += '</div>';

    html += '<div class="card"><div class="eyebrow">STAGE 2 · SUBSTITUTE 替换</div>' +
      '<p class="muted">保持句型，只替换核心内容。点句子可以听。</p>';
    html += (sp.substitute && sp.substitute.length)
      ? '<div class="opts">' + sp.substitute.map(function (s) {
        return '<button class="opt" data-act="speak-text" data-text="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('') + '</div>'
      : '<p class="muted">这个句型暂时没有安全的替换练习（多为专名或固定短语），可直接进入自主表达。</p>';
    html += '</div>';

    html += '<div class="card"><div class="eyebrow">STAGE 3 · PRODUCE 自己表达</div>' +
      '<p class="speak-prompt"><b>' + esc(sp.produce || 'In simple English, tell what happens in this passage.') + '</b></p>' +
      '<textarea id="speakAnswer" placeholder="Write simple English...">' + esc(tmpOr('speak', us.production)) + '</textarea>' +
      '<div class="row" style="margin-top:8px">' +
      '<button data-act="check-speak">检查表达</button>' +
      '<button data-act="speak-text" data-target="speakAnswer">🔊 听我的答案</button>' +
      '</div><div id="speakResult"></div></div>';

    html += '<div class="actions">' +
      '<button class="primary wide" data-act="mark-step" data-step="speak">保存表达，进入 RE-READ →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 09 RE-READ ---------- */
  function stepReread(unit) {
    var us = E.readUnit(App.state, unit.id);
    var html = '<div class="card tight">' +
      '<div class="eyebrow">RE-READ · 再读一次</div>' +
      '<p class="muted" style="margin:2px 0 0">经过词汇、句型、理解和口语训练后，再读一次。<b>第二次应该比第一次更容易。</b></p></div>';
    html += '<div class="card">' + verseListHTML(unit, 'reread') + '</div>';
    html += '<div class="card"><h3>现在的感觉</h3><div class="opts">' +
      [['3', '很直接，读英文就懂了'], ['2', '基本可以，个别地方要停一下'], ['1', '仍需要翻译才能懂']].map(function (f) {
        return '<button class="opt' + (String(us.feeling) === f[0] ? ' picked' : '') + '" data-act="feeling" data-v="' + f[0] + '">' + f[1] + '</button>';
      }).join('') + '</div></div>';
    html += '<div class="card"><h3>再读的发现</h3>' +
      '<textarea id="stepNote" data-note="reread" placeholder="第二次读，有什么比第一次更清楚？">' + esc(tmpOr('reread', us.notes.reread)) + '</textarea></div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="play-unit" data-part="reread">🔊 边听边读</button>' +
      '<button class="primary wide" data-act="mark-step" data-step="reread">保存，进入 FINAL TEST →</button>' +
      '</div>';
    return html;
  }

  /* ---------- 10 FINAL TEST ---------- */
  function stepFinal(unit) {
    var qs = (unit.finalTest || []).filter(function (q) { return q.kind !== 'production'; });
    var prod = (unit.finalTest || []).filter(function (q) { return q.kind === 'production'; })[0];
    var html = '<div class="card tight">' +
      '<div class="eyebrow">FINAL TEST · 最后理解测试</div>' +
      '<p class="muted" style="margin:2px 0 0">不看中文，再根据英文回答。这是确认「是否真的完成本单元」的综合检查。</p></div>';
    if (!qs.length) {
      html += '<div class="card"><p class="muted">这一单元的测试题正在生成中，可直接提交完成。</p></div>';
    }
    html += qs.map(function (q, i) { return questionBlock(q, i, 'final'); }).join('');
    if (prod) {
      html += '<div class="card"><div class="q-meta">PRODUCTION · 表达</div>' +
        '<p><b>' + esc(prod.question) + '</b></p>' +
        '<textarea id="speakAnswer" placeholder="Write simple English...">' + esc(tmpOr('finalTest', E.readUnit(App.state, unit.id).production)) + '</textarea>' +
        '<div style="margin-top:8px"><button data-act="check-speak">检查表达</button></div>' +
        '<div id="speakResult"></div></div>';
    }
    var sc = scoreOf(qs, 'final');
    html += '<div class="card center"><b>已答 ' + sc.answered + ' / ' + sc.total + '</b></div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="submit-final"' + (sc.answered === sc.total ? '' : ' disabled') + '>提交并查看结果 →</button>' +
      '</div>';
    return html;
  }

  /* ---------- RESULT ---------- */
  function stepResult(unit) {
    var us = E.readUnit(App.state, unit.id);
    var b = us.baseline && typeof us.baseline.score === 'number' ? us.baseline.score : 0;
    var f = us.final && typeof us.final.score === 'number' ? us.final.score : 0;
    var gain = f - b;
    var weak = (us.weak || []).map(function (w) { return w.label; }).filter(Boolean);
    var html = '<div class="result-hero">' +
      '<div class="result-mark">✓</div>' +
      '<div class="eyebrow">UNIT COMPLETE</div>' +
      '<h1>' + esc(unit.reference) + '</h1>' +
      '<p class="muted">' + esc(unit.title) + '</p></div>';
    html += '<div class="compare">' +
      '<div class="box"><span>第一次理解</span><strong>' + b + '%</strong></div>' +
      '<div class="arrow">→</div>' +
      '<div class="box"><span>第二次理解</span><strong>' + f + '%</strong></div></div>';
    html += '<div class="card center"><b>' +
      (gain > 0 ? '理解提升 +' + gain + '%' : gain === 0 ? '理解持平' : '理解下降 ' + gain + '%') +
      '</b><p class="tiny">' + (gain > 0 ? '渐进训练正在起作用。' : '建议用 REVIEW 再走一遍薄弱环节。') + '</p></div>';
    html += '<div class="card"><div class="eyebrow">COMPLETED</div><h3>本单元完成</h3><div class="reslist">' +
      E.TRAINING_STEPS.map(function (s) {
        return '<div>' + (us.steps[s.id] ? '<b>✓</b> ' : '<span class="muted">○</span> ') + esc(s.en) + ' · ' + esc(s.zh) + '</div>';
      }).join('') + '</div></div>';
    if (weak.length) {
      html += '<div class="card"><div class="eyebrow">NEED REVIEW</div><h3>需要再看一眼</h3><div class="reslist">' +
        weak.map(function (w) { return '<div>· ' + esc(w) + '</div>'; }).join('') + '</div>' +
        '<p class="tiny">这些项目已加入复习重点。</p></div>';
    }
    html += '<div class="card"><div class="eyebrow">REVIEW PLAN</div><h3>间隔复习已安排</h3><p class="muted">' +
      (us.reviews || []).map(function (r) { return 'Day ' + (r.day || '') + '（' + r.due + '）'; }).join(' · ') +
      '</p><button class="secondary wide" data-act="go-review">查看复习计划 →</button></div>';
    var model = activeModel();
    var hasNext = App.sess.unitIndex + 1 < model.units.length;
    html += '<div class="actions">' +
      (hasNext
        ? '<button class="primary wide" data-act="next-unit">下一个单元（U' + String(model.units[App.sess.unitIndex + 1].number).padStart(2, '0') + '）→</button>'
        : '<button class="primary wide" data-act="ch-next">进入下一章 →</button>') +
      '<button class="wide" data-act="go-reader">回到读经</button>' +
      '</div>';
    return html;
  }

  function emptyStep(unit, step) {
    return '<div class="card"><p class="muted">这一单元暂时没有 ' + esc(step) + ' 的内容。</p></div>' +
      '<div class="actions"><button class="primary wide" data-act="mark-step" data-step="' + esc(step) + '">跳过并继续 →</button></div>';
  }

  /* ---------- REVIEW（学习流程内的复习屏） ---------- */
  function stepReview(unit) {
    var us = E.readUnit(App.state, unit.id);
    var html = '<div class="card tight"><div class="eyebrow">REVIEW · 间隔复习</div>' +
      '<p class="muted" style="margin:2px 0 0">针对本单元的重点与薄弱项重新走一遍。</p></div>';
    html += '<div class="card"><h3>' + esc(unit.reference) + '</h3>' +
      '<p class="muted">' + esc(unit.title) + '</p>' +
      '<div class="reslist">' +
      '<div>· 完成于：' + esc((us.completedAt || '').slice(0, 10) || '—') + '</div>' +
      '<div>· 剩余复习节点：' + (us.reviews || []).filter(function (r) { return !r.done; }).length + '</div>' +
      '<div>· 薄弱环节：' + ((us.weak || []).length || '无') + '</div></div></div>';

    if (unit.vocabulary.length) {
      html += '<div class="card"><div class="eyebrow">VOCABULARY RECALL</div><h3>核心词汇回顾</h3><div class="word-grid">' +
        unit.vocabulary.map(function (v) {
          return '<button class="word" data-act="speak-word" data-word="' + esc(v.english) + '">' +
            '<b>' + esc(v.english) + '</b><small>' + esc(v.zh) + '</small></button>';
        }).join('') + '</div></div>';
    }
    html += '<div class="card">' + verseListHTML(unit, 'review') + '</div>';
    html += '<div class="actions">' +
      '<button class="primary wide" data-act="play-unit" data-part="review">🔊 听读一次</button>' +
      '<button class="primary wide" data-act="review-done-current">✓ 完成本次复习</button>' +
      '<button class="wide" data-act="go-review">返回复习列表</button>' +
      '</div>';
    return html;
  }

  /* =======================================================
     复习视图
  ======================================================= */
  function unitLabel(unitId) {
    var m = /^([A-Z0-9]{3})\.(\d+)-U(\d+)$/.exec(unitId);
    if (!m) return unitId;
    var b = (App.meta.books || []).filter(function (x) { return x.id === m[1]; })[0];
    return (b ? b.name : m[1]) + ' ' + m[2] + ' · U' + m[3];
  }

  function renderReviewView() {
    var wrap = $('reviewList');
    if (!wrap) return;
    var due = E.dueReviews(App.state);
    var up = E.upcomingReviews(App.state, 30);
    var html = '';
    if (!due.length && !up.length) {
      html = '<div class="state-box">还没有复习安排。完成一个学习单元后，系统会自动排出 Day 1 / 3 / 7 / 14 的复习。</div>';
    }
    if (due.length) {
      html += '<div class="eyebrow" style="margin-bottom:8px">TODAY · 到期复习（' + due.length + '）</div>';
      html += due.map(function (r) {
        return '<div class="rev-row overdue"><div class="grow">' +
          '<b>' + esc(unitLabel(r.unitId)) + '</b><div class="tiny">应复习日期 ' + esc(r.due) +
          (r.overdueDays > 0 ? ' · 已逾期 ' + r.overdueDays + ' 天' : '') + '</div></div>' +
          '<button class="sm primary" data-act="rev-open" data-unit="' + esc(r.unitId) + '">进入复习</button>' +
          '<button class="sm" data-act="rev-done" data-unit="' + esc(r.unitId) + '" data-idx="' + r.index + '">✓ 完成本次</button>' +
          '</div>';
      }).join('');
    }
    if (up.length) {
      html += '<div class="eyebrow" style="margin:16px 0 8px">UPCOMING · 未来 30 天（' + up.length + '）</div>';
      html += up.slice(0, 24).map(function (r) {
        return '<div class="rev-row"><div class="grow"><b>' + esc(unitLabel(r.unitId)) + '</b>' +
          '<div class="tiny">' + esc(r.due) + '</div></div>' +
          '<button class="sm" data-act="rev-open" data-unit="' + esc(r.unitId) + '">查看</button></div>';
      }).join('');
    }
    wrap.innerHTML = html;
  }

  /* =======================================================
     计划视图
  ======================================================= */
  function renderPlanView() {
    var box = $('planInfo');
    if (!box) return;
    var total = E.totalChapters(App.meta);
    var done = E.doneChapters(App.state, App.meta);
    var pct = total ? Math.round(done / total * 100) : 0;
    var next = E.nextChapter(App.state, App.meta);
    var perDay = Math.max(1, Math.ceil((total - done) / 90));
    box.innerHTML =
      '<div class="card"><div class="eyebrow">90 天读完整本新约</div>' +
      '<h3>已完成 ' + done + ' / ' + total + ' 章（' + pct + '%）</h3>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<p class="muted">剩余 ' + (total - done) + ' 章 · 平均每天约 ' + perDay + ' 章</p>' +
      (next
        ? '<p class="muted">下一章：<b>' + esc(next.name) + ' ' + next.chapter + '</b>（' + esc(next.nameZh) + '）</p>' +
        '<button class="primary wide" data-act="plan-jump">进入下一章 →</button>'
        : '<p class="muted">全部完成。进入 REVIEW 巩固。</p><button class="primary wide" data-act="go-review">查看复习</button>') +
      '</div>';
    var books = $('planBooks');
    if (books) {
      books.innerHTML = '<div class="card"><div class="eyebrow">BOOK PROGRESS</div><h3>各卷进度</h3>' +
        (App.meta.books || []).map(function (b) {
          var d = 0;
          for (var c = 1; c <= b.chapters; c++) if (E.chapterDone(App.state, b.id, c)) d++;
          var p = Math.round(d / b.chapters * 100);
          return '<div class="rev-row" style="padding:8px 10px"><div class="grow"><b>' + esc(b.name) + '</b>' +
            '<div class="tiny">' + esc(b.nameZh) + ' · ' + d + '/' + b.chapters + ' 章</div>' +
            '<div class="progress-track" style="margin:4px 0 0"><div class="progress-fill" style="width:' + p + '%"></div></div></div>' +
            '<button class="sm" data-act="book" data-book="' + b.id + '">打开</button></div>';
        }).join('') + '</div>';
    }
  }

  /* =======================================================
     设置视图
  ======================================================= */
  function renderSettingsView() {
    var box = $('settingsBody');
    if (!box) return;
    var s = App.settings;
    box.innerHTML =
      '<div class="card"><div class="eyebrow">LEARNING SETTINGS · 学习设置</div><h3>阅读与学习</h3>' +
      '<div class="rev-row"><div class="grow"><b>自动标记已读</b><div class="tiny">打开章节时自动记为「已读」</div></div>' +
      '<button class="sm ' + (s.autoMarkRead ? 'primary' : '') + '" data-act="toggle" data-key="autoMarkRead">' + (s.autoMarkRead ? '已开启' : '已关闭') + '</button></div>' +
      '<div class="rev-row"><div class="grow"><b>紧凑阅读模式</b><div class="tiny">缩小间距，一屏看到更多经文</div></div>' +
      '<button class="sm ' + (s.compactMode ? 'primary' : '') + '" data-act="toggle" data-key="compactMode">' + (s.compactMode ? '已开启' : '已关闭') + '</button></div>' +
      '<div class="rev-row"><div class="grow"><b>字号</b><div class="tiny">当前 ' + s.font + 'px</div></div>' +
      '<button class="sm" data-act="font-down">A−</button><button class="sm" data-act="font-up">A+</button></div>' +
      '<div class="rev-row"><div class="grow"><b>语速</b><div class="tiny">当前 ' + s.rate + '</div></div>' +
      '<button class="sm" data-act="rate-set" data-rate="0.7">0.7</button>' +
      '<button class="sm" data-act="rate-set" data-rate="0.9">0.9</button>' +
      '<button class="sm" data-act="rate-set" data-rate="1.0">1.0</button>' +
      '<button class="sm" data-act="rate-set" data-rate="1.2">1.2</button></div>' +
      '</div>' +
      '<div class="card"><div class="eyebrow">DATA</div><h3>学习数据</h3>' +
      '<p class="muted">数据保存在本机浏览器（localStorage，键名 EBRM_V1_DATA_V1）。导出后可在其他设备导入。</p>' +
      '<div class="row"><button data-act="export" class="secondary">导出学习数据</button>' +
      '<button data-act="pick-import">导入学习数据</button></div>' +
      '<input type="file" id="importFile" accept="application/json,.json" class="hidden" data-act="import">' +
      '<hr class="sep">' +
      '<div class="row"><button data-act="reset-unit">重置本章训练</button>' +
      '<button data-act="reset-all" class="warn">清除全部数据</button></div></div>' +
      '<div class="card"><div class="eyebrow">ABOUT</div><h3>EBRM ' + E.VERSION + '</h3>' +
      '<p class="muted">以圣经经文为语言材料，以 JOHN 1 渐进式学习模型为教学母版：' +
      '阅读 → 听读 → 观察 → 词汇 → 句型 → 直接理解 → 表达 → 再读 → 综合测试 → 间隔复习。</p>' +
      '<p class="tiny">经文：World English Bible（公有领域）。语音：浏览器 Speech Synthesis。</p></div>';
  }

  /* =======================================================
     动态交互（事件委托）
  ======================================================= */
  function handleAct(act, el) {
    var d = el.dataset;
    switch (act) {
      /* --- 导航 --- */
      case 'home': go('home'); break;
      case 'reader': go('reader'); break;
      case 'learn': go('learn'); break;
      case 'review': go('review'); break;
      case 'plan': go('plan'); break;
      case 'settings': go('settings'); break;
      case 'go-reader': go('reader'); break;
      case 'go-review': go('review'); break;
      case 'reload': location.reload(); break;

      /* --- Reader --- */
      case 'book':
        openChapter(d.book, 1).then(function () { go('reader', { keep: true }); });
        break;
      case 'chapter':
        openChapter(App.sess.book, Number(d.ch));
        break;
      case 'ch-prev': gotoPrev(); break;
      case 'ch-next': gotoNext(); break;
      case 'today': {
        if (App.mode === 'course') {
          openChapter('JHN', 1).then(function () {
            App.sess.unitIndex = firstIncompleteUnitIndex();
            App.sess.step = 'baseline';
            App.sess.answers = {};
            App.sess.tmp = {};
            persistPosition('baseline');
            go('learn', { keep: true });
            toast('开始单元训练（第一次理解）');
          });
          break;
        }
        var nx = E.nextChapter(App.state, App.meta);
        if (!nx) { toast('整本新约已完成'); go('review'); break; }
        openChapter(nx.book, nx.chapter).then(function () { go('reader', { keep: true }); toast('已跳转到 ' + nx.name + ' ' + nx.chapter); });
        break;
      }
      case 'reload-chapter': openChapter(App.sess.book, App.sess.chapter); break;
      case 'font-up': App.settings.font = Math.min(34, App.settings.font + 2); E.saveSettings(App.settings); applySettings(); applyVerseFont(); break;
      case 'font-down': App.settings.font = Math.max(14, App.settings.font - 2); E.saveSettings(App.settings); applySettings(); applyVerseFont(); break;
      case 'bookmark': {
        var k = App.sess.book + '.' + App.sess.chapter;
        if (App.state.progress.bookmarks[k]) delete App.state.progress.bookmarks[k];
        else App.state.progress.bookmarks[k] = true;
        E.saveState(App.state); renderReaderBody(); toast('书签已更新'); break;
      }
      case 'save-note': {
        var note = $('chapterNote');
        var kk = App.sess.book + '.' + App.sess.chapter;
        if (note) App.state.progress.notes[kk] = note.value;
        E.saveState(App.state); toast('笔记已保存'); break;
      }
      case 'play-chapter': {
        var model = App.sess.model;
        if (!model) break;
        V.speak('', {
          parts: model.verses.map(function (v) { return v.text; }),
          onVerse: function (i) { highlightVerse('verseList', i); },
          onDone: function () { highlightVerse('verseList', -1); },
          onError: function (e) { toast(e === 'unsupported' ? '当前浏览器不支持语音朗读' : '朗读失败'); }
        });
        break;
      }
      case 'play-verse': {
        var vl = el.closest('.verses');
        var idx = Number(el.dataset.i || (vl ? Array.prototype.indexOf.call(vl.children, el) : 0));
        var vs = App.sess.model ? App.sess.model.verses : [];
        if (vs[idx]) V.speak(vs[idx].text, { onError: function () { toast('朗读失败'); } });
        break;
      }

      /* --- Learning --- */
      case 'open-unit':
        App.sess.unitIndex = Number(d.unit);
        App.sess.answers = {}; App.sess.pickedSub = ''; App.sess.tmp = {};
        persistPosition(); renderLearn();
        break;
      case 'step':
        App.sess.step = d.step;
        App.sess.answers = {};
        persistPosition(d.step);
        renderLearn(); break;
      case 'opt': {
        var ns = d.ns, qi = Number(d.q), oi = Number(d.i);
        var key = ns + ':' + qi;
        if (App.sess.answers[key] !== undefined) break;
        App.sess.answers[key] = oi;
        renderLearn();
        break;
      }
      case 'word': {
        var w = d.word;
        App.sess.pickedWords[w] = !App.sess.pickedWords[w];
        var unit = currentUnit();
        var us = E.unitState(App.state, unit.id);
        var list = (us.vocabulary || []).slice();
        if (App.sess.pickedWords[w]) { if (list.indexOf(w) < 0) list.push(w); }
        else list = list.filter(function (x) { return x !== w; });
        us.vocabulary = list;
        E.saveState(App.state);
        renderLearn();
        break;
      }
      case 'speak-word': V.speak(d.word, { onError: function () { toast('朗读失败'); } }); break;
      case 'speak-text': {
        var text = d.text;
        if (d.target) {
          var ta = $(d.target);
          text = ta ? ta.value : '';
          if (!text.trim()) { toast('还没有内容可以朗读'); break; }
        }
        V.speak(text, { onError: function (e) { toast(e === 'unsupported' ? '当前浏览器不支持语音朗读' : '朗读失败'); } });
        break;
      }
      case 'imitate-done': {
        el.classList.add('picked');
        el.textContent = '✓ 已跟读';
        toast('很好，继续下一句');
        break;
      }
      case 'feeling': {
        var u2 = currentUnit();
        var ustate = E.unitState(App.state, u2.id);
        ustate.feeling = Number(d.v);
        E.saveState(App.state);
        renderLearn();
        break;
      }
      case 'rate': V.setRate(Number(d.rate)); App.settings.rate = V.rate; E.saveSettings(App.settings); renderLearn(); toast('语速 ' + V.rate); break;
      case 'rate-set': V.setRate(Number(d.rate)); App.settings.rate = V.rate; E.saveSettings(App.settings); renderSettingsView(); toast('语速已设为 ' + V.rate); break;
      case 'stop-speech': V.stop(); toast('已停止朗读'); break;
      case 'replay-unit': playUnit('listen'); break;
      case 'font-cycle': {
        var sizes = [16, 18, 20, 22, 24, 26];
        var i0 = sizes.indexOf(App.settings.font);
        App.settings.font = sizes[(i0 + 1) % sizes.length];
        E.saveSettings(App.settings);
        applyVerseFont();
        toast('字号 ' + App.settings.font + 'px');
        break;
      }
      case 'play-unit': playUnit(d.part); break;

      case 'check-speak': checkSpeak(); break;

      case 'mark-step':
        completeStep(d.step);
        break;

      case 'submit-final': submitFinal(); break;

      case 'next-unit': {
        var m = activeModel();
        if (App.sess.unitIndex + 1 < m.units.length) {
          App.sess.unitIndex++;
          App.sess.step = 'baseline';
          App.sess.answers = {};
          persistPosition('baseline');
          renderLearn();
        }
        break;
      }
      case 'prev-unit': {
        if (App.sess.unitIndex > 0) {
          App.sess.unitIndex--;
          App.sess.step = 'baseline';
          renderLearn();
        }
        break;
      }

      /* --- 复习 --- */
      case 'rev-open': openReviewUnit(d.unit); break;
      case 'rev-done':
        E.completeReview(App.state, d.unit, Number(d.idx));
        renderReviewView(); updateHome();
        toast('已完成本次复习，下一次安排保留');
        break;
      case 'review-done-current': {
        var cur = App.sess.reviewUnit;
        if (!cur) break;
        var due = E.dueReviews(App.state).filter(function (r) { return r.unitId === cur; });
        if (due.length) {
          E.completeReview(App.state, cur, due[0].index);
          toast('已完成本次复习');
        } else {
          toast('当前没有到期节点');
        }
        renderReviewView();
        go('review');
        break;
      }

      /* --- 计划 --- */
      case 'plan-jump': {
        var nx2 = E.nextChapter(App.state, App.meta);
        if (!nx2) { toast('整本新约已完成'); break; }
        openChapter(nx2.book, nx2.chapter).then(function () {
          go('reader', { keep: true });
          toast('已进入 ' + nx2.name + ' ' + nx2.chapter);
        });
        break;
      }

      /* --- 设置 --- */
      case 'toggle': {
        var key = d.key;
        App.settings[key] = !App.settings[key];
        E.saveSettings(App.settings);
        applySettings();
        renderSettingsView();
        toast('设置已更新');
        break;
      }
      case 'export': {
        try {
          var payload = E.exportData(App.state, App.settings);
          var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'ebrm-learning-data-' + new Date().toISOString().slice(0, 10) + '.json';
          document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
          toast('已导出学习数据');
        } catch (e) { toast('导出失败：' + e.message); }
        break;
      }
      case 'pick-import': {
        var f = $('importFile');
        if (f) f.click();
        break;
      }
      case 'reset-unit': {
        if (!window.confirm('重置本章训练？本章所有单元的学习记录将被清除（笔记与书签保留）。')) break;
        var m2 = activeModel();
        m2.units.forEach(function (u) { delete App.state.units[u.id]; });
        delete App.state.chapters[App.sess.book + '.' + App.sess.chapter];
        delete App.state.progress.done[App.sess.book + '.' + App.sess.chapter];
        E.saveState(App.state);
        App.sess.unitIndex = 0; App.sess.step = 'baseline'; App.sess.answers = {};
        renderLearn(); updateHome(); renderBookGrid();
        toast('本章训练已重置');
        break;
      }
      case 'reset-all': {
        if (!window.confirm('确定清除全部学习数据？此操作不可撤销。建议先导出备份。')) break;
        var r = E.resetAll();
        App.state = r.state; App.settings = r.settings;
        applySettings(); buildStaticUI(); go('home');
        toast('已清除全部数据');
        break;
      }
      default: break;
    }
  }

  /* ---------- 学习动作 ---------- */
  function playUnit(part) {
    var unit = currentUnit();
    var handle = part || 'listen';
    if (!unit) return;
    V.speak('', {
      parts: unit.verses.map(function (v) { return v.text; }),
      onVerse: function (i) { highlightVerse('verses-' + handle, i); },
      onDone: function () { highlightVerse('verses-' + handle, -1); updateSpeechUI(); },
      onError: function (e) {
        toast(e === 'unsupported' ? '当前浏览器不支持语音朗读，请使用 Chrome / Edge / Safari。' : '朗读失败，请重试');
      }
    });
    toast('开始朗读…');
  }
  App.playUnit = playUnit;

  function highlightVerse(containerId, index) {
    var box = $(containerId);
    if (!box) return;
    Array.prototype.forEach.call(box.children, function (c, i) {
      c.classList.toggle('speaking', i === index);
    });
    if (index >= 0 && box.children[index] && box.children[index].scrollIntoView) {
      try { box.children[index].scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }
    }
  }

  function updateSpeechUI() {
    var st = $('speechStatus');
    if (st) {
      st.textContent = V.speaking ? '正在朗读…' : '未播放';
      st.classList.toggle('live', V.speaking);
    }
    document.querySelectorAll('[data-act=play-unit]').forEach(function (b) {
      if (b.dataset.part) b.textContent = V.speaking ? '■ 朗读中…' : (b.dataset.part === 'reread' ? '🔊 边听边读' : (b.dataset.part === 'read' ? '🔊 朗读本单元经文' : '▶ 播放本单元'));
    });
  }

  function completeStep(step) {
    var unit = currentUnit();
    if (!unit) return;
    var us = E.unitState(App.state, unit.id);

    /* 保存各级自由输入 */
    var noteEl = $('stepNote');
    if (noteEl && noteEl.dataset.note) us.notes[noteEl.dataset.note] = noteEl.value;
    var speakEl = $('speakAnswer');
    if (speakEl) us.production = speakEl.value;

    /* 评分记录 */
    if (step === 'baseline') {
      var qs = unit.baseline && unit.baseline.length ? unit.baseline : unit.comprehension.slice(0, 3);
      var sc = scoreOf(qs, 'baseline');
      us.baseline = {
        score: qs.length ? Math.round(sc.right / qs.length * 100) : 0,
        right: sc.right, total: qs.length, at: new Date().toISOString(),
        answers: qs.map(function (q, i) { return App.sess.answers['baseline:' + i]; })
      };
      (us.weak = us.weak.filter(function (w) { return w.step !== 'baseline'; }));
      qs.forEach(function (q, i) {
        if (App.sess.answers['baseline:' + i] !== q.answer) {
          us.weak.push({ step: 'baseline', index: i, label: '第一次理解 · ' + q.question.slice(0, 40) });
        }
      });
    }
    if (step === 'comprehension') {
      var cqs = unit.comprehension || [];
      cqs.forEach(function (q, i) {
        if (App.sess.answers['comp:' + i] !== undefined && App.sess.answers['comp:' + i] !== q.answer) {
          if (!us.weak.some(function (w) { return w.step === 'comprehension' && w.index === i; })) {
            us.weak.push({ step: 'comprehension', index: i, label: '直接理解 L' + q.level + ' · ' + q.question.slice(0, 40) });
          }
        }
      });
    }
    if (step === 'notice') {
      (unit.notice || []).forEach(function (q, i) {
        if (App.sess.answers['notice:' + i] !== undefined && App.sess.answers['notice:' + i] !== q.answer) {
          if (!us.weak.some(function (w) { return w.step === 'notice' && w.index === i; })) {
            us.weak.push({ step: 'notice', index: i, label: '观察 · ' + q.question.slice(0, 40) });
          }
        }
      });
    }

    E.markStep(App.state, unit.id, step);

    /* 下一步 */
    var idx = E.TRAINING_STEPS.map(function (s) { return s.id; }).indexOf(step);
    var next = E.TRAINING_STEPS[idx + 1];
    if (next) {
      App.sess.step = next.id;
      App.sess.answers = {};
      persistPosition(next.id);
      renderLearn();
      toast('已保存，进入 ' + next.zh);
    } else {
      App.sess.step = 'finalTest';
      renderLearn();
    }
    updateHome();
  }

  function checkSpeak() {
    var ta = $('speakAnswer');
    var box = $('speakResult');
    if (!ta || !box) return;
    var text = ta.value.trim();
    var unit = currentUnit();
    var us = E.unitState(App.state, unit.id);
    us.production = text;
    E.saveState(App.state);
    if (!text) {
      box.className = 'q-hint bad';
      box.textContent = '先写下你的表达。';
      return;
    }
    var words = text.toLowerCase().match(/[a-z']+/g) || [];
    var keys = unit.vocabulary.map(function (v) { return v.english; }).slice(0, 4);
    var hits = keys.filter(function (k) { return words.indexOf(k) >= 0; });
    var okLen = words.length >= 5;
    box.className = 'q-hint ' + (okLen ? 'good' : 'bad');
    box.innerHTML = '<b>词数 ' + words.length + '</b> · 用到的本单元词汇：' +
      (hits.length ? hits.map(esc).join('、') : '（还没有用到）') +
      (okLen ? '<br>✓ 表达已保存。' : '<br>试着写成一整句或两句英文。');
  }

  function submitFinal() {
    var unit = currentUnit();
    var qs = (unit.finalTest || []).filter(function (q) { return q.kind !== 'production'; });
    var sc = scoreOf(qs, 'final');
    var us = E.unitState(App.state, unit.id);
    var speakEl = $('speakAnswer');
    if (speakEl) us.production = speakEl.value;
    us.final = {
      score: qs.length ? Math.round(sc.right / qs.length * 100) : 100,
      right: sc.right, total: qs.length, at: new Date().toISOString()
    };
    qs.forEach(function (q, i) {
      if (App.sess.answers['final:' + i] !== q.answer) {
        if (!us.weak.some(function (w) { return w.step === 'finalTest' && w.index === i; })) {
          us.weak.push({ step: 'finalTest', index: i, label: '测试 · ' + String(q.kind || ('L' + q.level)) + ' · ' + String(q.question).slice(0, 36) });
        }
      }
    });
    E.markStep(App.state, unit.id, 'finalTest');
    E.completeUnit(App.state, unit.id, activeModel());
    App.sess.step = 'result';
    persistPosition('result');
    renderLearn(); updateHome(); renderBookGrid(); renderReviewView();
    toast('本单元完成，已安排 1 / 3 / 7 / 14 天复习');
  }

  function openReviewUnit(unitId) {
    /* 找到该 unit 所属章节并打开 */
    var m = /^([A-Z0-9]{3})\.(\d+)-U(\d+)$/.exec(unitId);
    if (!m) { toast('无法定位复习单元'); return; }
    var book = m[1], ch = Number(m[2]), uidx = Number(m[3]) - 1;
    openChapter(book, ch).then(function () {
      App.sess.unitIndex = Math.min(uidx, activeModel().units.length - 1);
      App.sess.reviewUnit = unitId;
      App.sess.step = 'review';
      go('learn', { keep: true });
      toast('进入复习：' + unitLabel(unitId));
    }).catch(function () { toast('该单元所在章节加载失败'); });
  }

  /* =======================================================
     事件绑定（统一委托，无 inline onclick）
  ======================================================= */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    if (el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
    if (el.disabled) return;
    ev.preventDefault();
    try {
      handleAct(act, el);
    } catch (err) {
      console.error('EBRM action failed:', act, err);
      toast('操作出错：' + (err && err.message ? err.message : act));
    }
  }, false);

  document.addEventListener('change', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'voice') {
      V.setVoice(el.value);
      App.settings.voiceURI = el.value;
      E.saveSettings(App.settings);
      toast('已切换声音');
      return;
    }
    if (act === 'import') {
      var f = el.files && el.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var payload = JSON.parse(String(reader.result));
          App.state = E.importData(payload);
          App.settings = E.loadSettings();
          applySettings(); buildStaticUI(); go('home');
          E.saveState(App.state);
          toast('导入成功');
        } catch (e) {
          toast('导入失败：' + e.message + '（原有数据未被修改）');
        }
      };
      reader.onerror = function () { toast('读取文件失败'); };
      reader.readAsText(f);
      return;
    }
  }, false);

  /* 章节下拉 */
  document.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el && el.id === 'chapterSelect') {
      openChapter(App.sess.book, Number(el.value));
    }
  }, false);

  /* 单节播放：点击 Reader / LISTEN 中的经文行 */
  document.addEventListener('click', function (ev) {
    var v = ev.target.closest('.verse');
    if (!v) return;
    var box = v.closest('.verses');
    if (!box) return;
    var idx = Array.prototype.indexOf.call(box.children, v);
    var vs = App.sess.model ? App.sess.model.verses : null;
    if (vs && vs[idx]) V.speak(vs[idx].text, { onError: function () { toast('朗读失败'); } });
  }, false);

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') V.stop();
  });

  /* 学习屏的 unit 切换快捷键（可选） */
  window.addEventListener('beforeunload', function () {
    if (App.state) E.saveState(App.state);
  });

  /* 对外暴露启动 */
  window.EBRM.boot = boot;
})();
