/* =========================================================
   EBRM 2.0 · CONTENT ENGINE
   ---------------------------------------------------------
   把「圣经经文」编译成「渐进式英语学习单元」。

   教学母版：JOHN 1 原型
     01 BASELINE / 02 READ / 03 LISTEN / 04 NOTICE
     05 VOCABULARY / 06 STRUCTURE / 07 DIRECT COMPREHENSION
     08 SPEAK / 09 RE-READ / 10 FINAL TEST
     → RESULT → REVIEW

   六条渐进原则（必须体现在生成的数据里）：
     由易到难 / 由少到多 / 识别→理解 / 理解→表达
     模仿→替换→自主 / 一次学习→间隔复习

   本文件只做「内容 → 教学」的确定性编译，不接触 DOM。
========================================================= */
(function (global) {
  'use strict';

  var Content = {};

  /* =======================================================
     工具：确定性伪随机（保证同一章每次编译结果一致）
  ======================================================= */
  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function makeRng(seedStr) {
    var s = hashSeed(seedStr) || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  function shuffled(list, seedStr) {
    var rnd = makeRng(seedStr);
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* =======================================================
     词法工具
  ======================================================= */
  function tokenize(text) {
    return (String(text || '')
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .match(/[a-z]+(?:'[a-z]+)?/g) || []);
  }

  function sentencize(text) {
    var raw = String(text || '').trim();
    if (!raw) return [];
    var parts = raw.split(/(?<=[.!?])\s+(?=[A-Z"'\u201c])/);
    if (parts.length === 1 && parts[0].length > 200) {
      parts = raw.split(/;\s+/);
    }
    return parts.map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function baseForms(w) {
    var out = [w];
    if (w.slice(-2) === "'s") out.push(w.slice(0, -2));
    if (w.slice(-3) === "n't") out.push(w.slice(0, -3));
    if (w.slice(-3) === 'ves') out.push(w.slice(0, -3) + 'f', w.slice(0, -3) + 'fe');
    if (w.slice(-3) === 'ies') out.push(w.slice(0, -3) + 'y');
    if (w.slice(-2) === 'es') out.push(w.slice(0, -2));
    if (w.slice(-1) === 's') out.push(w.slice(0, -1));
    if (w.slice(-2) === 'ed') out.push(w.slice(0, -2), w.slice(0, -1));
    if (w.slice(-3) === 'ing') out.push(w.slice(0, -3), w.slice(0, -3) + 'e');
    if (w.slice(-2) === 'ly') out.push(w.slice(0, -2));
    if (w.slice(-3) === 'est') out.push(w.slice(0, -3));
    if (w.slice(-2) === 'er') out.push(w.slice(0, -2));
    return out;
  }

  function makeLex(lexicon) {
    var entries = (lexicon && lexicon.entries) || {};
    var stop = {};
    ((lexicon && lexicon.stopwords) || []).forEach(function (w) { stop[w] = true; });
    function lemmaOf(w) {
      var forms = baseForms(w);
      for (var i = 0; i < forms.length; i++) {
        var e = entries[forms[i]];
        if (!e) continue;
        /* 屈折形式（type='x'，如 became / feet）：顺着释义回到词元 */
        if (e.type === 'x') {
          var m = /(?:of|from)\s+([a-z][a-z'-]*)/i.exec(e.gloss || '');
          if (m) {
            var bf = baseForms(m[1].toLowerCase());
            for (var j = 0; j < bf.length; j++) {
              if (entries[bf[j]] && entries[bf[j]].type !== 'x') return bf[j];
            }
          }
          continue;   // 不要把屈折形式本身当成词元
        }
        return forms[i];
      }
      return null;
    }
    function isStop(w) { return !!stop[w]; }
    function info(w) {
      var key = entries[w] ? w : lemmaOf(w);
      return key ? entries[key] : null;
    }
    return { entries: entries, stop: stop, lemmaOf: lemmaOf, isStop: isStop, info: info };
  }

  /* 反义对（用于 NOTICE 的「对比」观察题） */
  var ANTONYMS = [
    ['light', 'darkness'], ['life', 'death'], ['good', 'evil'], ['day', 'night'],
    ['heaven', 'earth'], ['truth', 'false'], ['love', 'hate'], ['believe', 'doubt'],
    ['give', 'take'], ['come', 'go'], ['rich', 'poor'], ['strong', 'weak'],
    ['wise', 'foolish'], ['clean', 'unclean'], ['holy', 'unclean'], ['first', 'last'],
    ['righteous', 'wicked'], ['joy', 'sorrow'], ['peace', 'war'], ['faithful', 'unfaithful'],
    ['save', 'destroy'], ['live', 'die'], ['rejoice', 'mourn'], ['free', 'bondage'],
    ['spirit', 'flesh'], ['above', 'below'], ['in', 'out'], ['with', 'without']
  ];

  /* 时间与地点线索词 */
  var TIME_WORDS = ['beginning', 'then', 'now', 'after', 'before', 'when', 'day', 'night', 'morning', 'evening', 'hour', 'time', 'year', 'sabbath', 'today', 'tomorrow', 'afterward', 'meanwhile', 'again', 'immediately', 'suddenly', 'until'];
  var PLACE_WORDS = ['galilee', 'judea', 'jerusalem', 'bethlehem', 'nazareth', 'capernaum', 'samaria', 'temple', 'synagogue', 'mountain', 'sea', 'lake', 'river', 'desert', 'wilderness', 'city', 'village', 'house', 'field', 'garden', 'tomb', 'grave', 'heaven', 'earth', 'egypt', 'rome', 'jordan', 'road', 'way', 'boat', 'ship', 'damascus', 'antioch', 'corinth', 'ephesus', 'philippi', 'babylon', 'israel', 'judea', 'galilee', 'samaria', 'asia', 'macedonia', 'caesarea', 'bethany', 'emmaus', 'gethsemane', 'golgotha', 'sinai', 'zion', 'egypt', 'babylon'];
  var PLACE_SET = {};
  PLACE_WORDS.forEach(function (p) { PLACE_SET[p] = true; });
  var CONNECTORS = [
    { w: 'but', fn: 'contrast', zh: '转折' },
    { w: 'therefore', fn: 'result', zh: '结果' },
    { w: 'because', fn: 'reason', zh: '原因' },
    { w: 'so that', fn: 'purpose', zh: '目的' },
    { w: 'then', fn: 'sequence', zh: '次序' },
    { w: 'and', fn: 'addition', zh: '添加' },
    { w: 'if', fn: 'condition', zh: '条件' },
    { w: 'when', fn: 'time', zh: '时间' }
  ];

  /* =======================================================
     句型模板（STRUCTURE 步骤的核心）
  ======================================================= */
  var PATTERN_RULES = [
    {
      id: 'became-of',
      test: function (s) {
        var m = s.match(/^(.{2,45}?)\s+(became|was|were)\s+the (father|mother|son|daughter|brother|sister)\s+of\s+(.{2,60}?)(\s+by\s+.+)?[.!?]?$/i);
        if (!m) return null;
        return {
          pattern: '[人] + ' + m[2] + ' the ' + m[3] + ' of + [亲属]',
          breakdown: [m[1], m[2] + ' the ' + m[3] + ' of', m[4]],
          explanation: '"' + m[2] + ' the ' + m[3] + ' of" 是圣经家谱最常用的说法：of 后面接的是「谁的父亲 / 谁的儿子」，用最简单的结构一代一代连下去。',
          example: 'Abraham became the father of Isaac.'
        };
      }
    },
    {
      id: 'fronted-adverbial',
      test: function (s) {
        var m = s.match(/^(In|On|At|By|Through|After|Before|From|With|Under|Above|Among|For)\s+([^,]{2,40}?),?\s+(was|were|is|are|comes|came|shines|stood)\s+(.{2,80})$/i);
        if (!m) return null;
        return {
          pattern: m[1] + ' + [背景] + ' + m[3] + ' + [主语]',
          breakdown: [m[1] + ' ' + m[2], m[3], m[4]],
          explanation: '把时间或地点背景放在句子前面，先给出「在什么情况下」，再说「谁是什么 / 发生了什么」。中文习惯也说「起初，……」。',
          example: m[1] + ' the morning, the city was quiet.'
        };
      }
    },
    {
      id: 'there-be',
      test: function (s) {
        var m = s.match(/^There\s+((?:will|shall|has|have|had)\s+be(?:en)?|was|were|is|are|comes|came)\s+(.{2,80})$/i);
        if (!m) return null;
        return {
          pattern: 'There ' + m[1] + ' + [名词]',
          breakdown: ['There ' + m[1], m[2]],
          explanation: 'There + be 表示「有……」。这句话的重点不是 there，而是后面的名词 —— 英文先说「有」，再说「有什么」。',
          example: 'There was a man in the city.'
        };
      }
    },
    {
      id: 'emphatic-front-verb',
      test: function (s) {
        var m = s.match(/^(In\s+\w+|In\s+\w+\s+\w+)\s+(was|were|came|stands?)\s+(.+)$/i);
        if (!m) return null;
        return {
          pattern: m[1] + ' + ' + m[2] + ' + [主语]',
          breakdown: [m[1], m[2], m[3]],
          explanation: '正常语序是「主语 + was + 地点」，这里把地点提前，用来强调这个地点 —— 突出「就在这里」。',
          example: 'In him was strength.'
        };
      }
    },
    {
      id: 'be-complement',
      test: function (s) {
        var m = s.match(/^(.{2,50}?)\s+(was|were|is|are)\s+(not\s+)?(.{2,80})$/i);
        if (!m) return null;
        if (/^(there|it|this|these|those|that)$/i.test(m[1].trim())) return null;
        return {
          pattern: '[主语] + ' + m[2] + ' (not) + [说明]',
          breakdown: [m[1], m[2] + (m[3] ? ' ' + m[3].trim() : ''), m[4]],
          explanation: m[2] + ' 是 be 动词的过去式，用来连接主语和它的说明：主语「是」什么、处在什么状态。',
          example: 'The servant was faithful.'
        };
      }
    },
    {
      id: 'purpose-clause',
      test: function (s) {
        var m = s.match(/\b(so that|that|in order that)\s+(.{4,90})$/i);
        if (!m || m[1].toLowerCase() === 'that' && s.split(' ').length < 8) return null;
        return {
          pattern: '…… + ' + m[1] + ' + [目的 / 结果]',
          breakdown: [s.slice(0, m.index).trim(), m[1], m[2]],
          explanation: m[1] + ' 引出目的或结果，说明前面这件事是「为了什么」而发生的。',
          example: 'He spoke so that all might hear.'
        };
      }
    },
    {
      id: 'relative-clause',
      test: function (s) {
        var m = s.match(/\b(who|which|that|whose)\s+(.{4,80})$/i);
        if (!m) return null;
        return {
          pattern: '[名词] + ' + m[1] + ' + [说明]',
          breakdown: [s.slice(0, m.index).trim(), m[1], m[2]],
          explanation: m[1] + ' 是关系词，用来给前面的名词补充说明：不是新句子，而是「哪一个 / 什么样的」。',
          example: 'The man who came was a teacher.'
        };
      }
    },
    {
      id: 'imperative',
      test: function (s) {
        var m = s.match(/^(Come|Go|Follow|Give|Take|Let|Believe|Repent|Love|Fear|Behold|Hear|See|Do not|Don't|Arise|Stand|Rejoice|Remember|Keep|Watch|Pray|Speak|Tell|Bring|Make|Be)\b([^.!?]*)/i);
        if (!m || m[2].trim().split(/\s+/).length < 1) return null;
        return {
          pattern: '[动词原形] + [内容]',
          breakdown: [m[1], m[2].trim()].filter(Boolean),
          explanation: '祈使句直接用动词原形开头，省略主语 you。这是命令、邀请或请求。',
          example: 'Follow me and see.'
        };
      }
    },
    {
      id: 'passive',
      test: function (s) {
        var m = s.match(/\b(was|were|is|are|been|being|am)\s+([a-z]+(?:ed|en|given|taken|sent|made|born|written|spoken|shown|held|led|kept|found|left|built|chosen|known))\b/i);
        if (!m) return null;
        return {
          pattern: '[受事] + ' + m[1] + ' + [动词过去分词]',
          breakdown: [s.slice(0, m.index).trim() || '[受事]', m[1], m[2]].filter(Boolean),
          explanation: 'be 动词 + 过去分词 = 被动语态。重点在「被做什么」，而不是「谁做」。',
          example: 'The book was written long ago.'
        };
      }
    },
    {
      id: 'negation',
      test: function (s) {
        var m = s.match(/\b(did not|does not|do not|has not|have not|had not|no one|no man|nothing|cannot|can not|will not|shall not)\b/i);
        if (!m) return null;
        return {
          pattern: '…… + ' + m[1] + ' + [动词]',
          breakdown: [s.slice(0, m.index).trim() || '……', m[1], s.slice(m.index + m[1].length).trim()],
          explanation: '否定结构：' + m[1] + '。英文的否定常常放在助动词后面，而不是直接加在动词上。',
          example: 'He did not turn away.'
        };
      }
    },
    {
      id: 'participle',
      test: function (s) {
        var m = s.match(/^([A-Z]?[a-z]+ing\b[^,]{0,40}),\s*(.+)$/);
        if (!m || m[1].split(' ').length > 8) return null;
        return {
          pattern: '[分词短语], [主句]',
          breakdown: [m[1], m[2]],
          explanation: '句子开头的 -ing 短语是分词结构，给出同时发生或先发生的动作背景，主句才是重点。',
          example: 'Seeing the crowd, he taught them.'
        };
      }
    },
    {
      id: 'if-condition',
      test: function (s) {
        var m = s.match(/^(If|Unless|When)\s+([^,]{4,60}),\s*(.+)$/i);
        if (!m) return null;
        return {
          pattern: m[1] + ' + [条件], + [结果]',
          breakdown: [m[1] + ' ' + m[2], m[3]],
          explanation: '条件句：前半句给出条件，后半句给出结果。英文用逗号分开两部分。',
          example: 'If you believe, you will see.'
        };
      }
    }
  ];

  /* 长句限制：太长的句子不适合作句型教学样本 */
  var RULE_MAX_WORDS = {
    'be-complement': 15,
    'relative-clause': 16,
    'purpose-clause': 18,
    'fronted-adverbial': 18,
    'emphatic-front-verb': 14,
    'participle': 16,
    'if-condition': 18,
    'there-be': 16,
    'imperative': 14,
    'passive': 18,
    'negation': 20,
    'became-of': 14
  };

  function buildStructure(sentence, vocabItems, lex) {
    var wordCount = tokenize(sentence).length;
    if (wordCount < 3) return null;

    for (var i = 0; i < PATTERN_RULES.length; i++) {
      var rule = PATTERN_RULES[i];
      var cap = RULE_MAX_WORDS[rule.id];
      if (cap && wordCount > cap) continue;
      var r = null;
      try { r = rule.test(sentence); } catch (e) { r = null; }
      if (!r) continue;
      return {
        id: rule.id,
        sentence: sentence,
        pattern: r.pattern,
        breakdown: r.breakdown,
        explanation: r.explanation,
        meaning: wordMap(sentence, lex),
        example: r.example,
        substitutions: substitutions(sentence, vocabItems, lex)
      };
    }

    /* 兜底一：主语 + 助动词 / be 动词 + 其余 */
    if (wordCount <= 16) {
      var ma = sentence.match(/^(.{2,50}?)\s+(is|are|was|were|will|shall|has|have|had|can|may|must|should|does|do|did)\s+(.{2,60})$/);
      if (ma) {
        return {
          id: 'aux-clause',
          sentence: sentence,
          pattern: '[主语] + ' + ma[2] + ' + [其余部分]',
          breakdown: [ma[1], ma[2], ma[3].replace(/[.!?]+$/, '')],
          explanation: '英文把「时态 / 情态」放在助动词上（这里是 ' + ma[2] + '），主要动词跟在后面。先认出助动词，句子结构就清楚了。',
          meaning: wordMap(sentence, lex),
          example: 'The disciples will follow him.',
          substitutions: substitutions(sentence, vocabItems, lex)
        };
      }
    }

    /* 兜底二：主语 + 动词 + 对象（英文最基本的语序） */
    if (wordCount <= 14) {
      var m = sentence.match(/^([A-Z][\w'\u2019]*(?:\s+[a-z]+){0,3})\s+([a-z]+(?:ed|es|s|eth)?)\s+(.{3,60})$/);
      if (m) {
        var info = lex.info(m[2]);
        var isVerb = info && /^to\s/.test(info.gloss || '');
        if (isVerb) {
          return {
            id: 'svo',
            sentence: sentence,
            pattern: '[主语] + [动词] + [对象]',
            breakdown: [m[1], m[2], m[3].replace(/[.!?]+$/, '')],
            explanation: '英文最基本的语序：先说谁（主语），再说做了什么（动词），最后说对谁 / 对什么（对象）。',
            meaning: wordMap(sentence, lex),
            example: 'The disciples followed him.',
            substitutions: substitutions(sentence, vocabItems, lex)
          };
        }
      }
    }

    /* 兜底三：任何长度的句子都能切出主干（长句 → 先找主句）
       —— 保证每一课都有 STRUCTURE 教学，绝不空着 */
    if (wordCount <= 60) {
      var toks3 = sentence.split(/\s+/);
      var vi = -1;
      for (var ti = 1; ti < toks3.length - 1 && vi < 0; ti++) {
        var raw3 = toks3[ti].toLowerCase().replace(/[^a-z']/g, '');
        if (!raw3) continue;
        var inf3 = lex.info(raw3);
        if (inf3 && (/^to\s/.test(inf3.gloss || '') || BE_FORMS.indexOf(raw3) >= 0)) vi = ti;
      }
      var subj3 = vi > 0 ? toks3.slice(0, vi).join(' ') : toks3[0];
      var verb3 = vi > 0 ? toks3[vi] : (toks3[1] || '');
      var rest3 = (vi > 0 ? toks3.slice(vi + 1).join(' ') : toks3.slice(2).join(' ')).replace(/[.!?]+$/, '');
      return {
        id: 'core-svo',
        sentence: sentence,
        pattern: '[主语] + [动词] + [其余说明]',
        breakdown: [subj3, verb3, rest3].filter(Boolean),
        explanation: '先把句子切成三段：谁 / 什么（' + subj3 + '）→ 做了什么 / 是什么（' + verb3 +
          '）→ 补充说明（' + (rest3 || '—') + '）。长句先抓主干，再看细节，就不会被修饰成分带偏。',
        meaning: wordMap(sentence, lex),
        example: 'The disciples followed him.',
        substitutions: substitutions(sentence, vocabItems, lex)
      };
    }
    return null;
  }

  /* 关键词对照（英文 → 中文），用于「直接理解」的支撑，不做整句机翻 */
  function wordMap(sentence, lex) {
    var seen = {};
    var out = [];
    tokenize(sentence).forEach(function (w) {
      if (lex.isStop(w)) return;
      var key = lex.lemmaOf(w);
      if (!key || seen[key]) return;
      var e = lex.entries[key];
      if (!e) return;
      seen[key] = true;
      out.push({ en: w, zh: e.zh });
    });
    return out.slice(0, 6);
  }

  function escapeRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  var PREPS = ['in', 'with', 'to', 'on', 'at', 'from', 'by', 'for', 'into', 'among',
    'through', 'against', 'upon', 'over', 'under', 'before', 'after', 'around', 'beside'];
  var DETERMINERS = ['the', 'a', 'an', 'his', 'her', 'their', 'your', 'our', 'my', 'its',
    'this', 'that', 'these', 'those', 'all', 'every', 'no', 'some'];
  var BE_FORMS = ['is', 'are', 'was', 'were', 'be', 'been', 'being', 'am'];

  /* 替换练习：保持句型不动，只换一个「核心名词 / 核心动词」（模仿 → 替换）
     规则：只动主语或宾语位置；不碰介词短语内、不碰固定搭配（后接 of）、
           替换词必须与目标词同类（名词↔名词、动词↔动词、形容词↔形容词） */
  function substitutions(sentence, vocabItems, lex) {
    var pool = (vocabItems || []).filter(function (v) { return v && v.english && v.cls; });
    if (!pool.length) return [];

    var text = sentence.replace(/[.!?]+$/, '');
    var tokens = tokenize(text);
    var inSentence = {};
    tokens.forEach(function (t) { inSentence[t] = true; });

    function usable(w) {
      if (lex.isStop(w) || w.length < 3) return null;
      var key = lex.lemmaOf(w);
      var e = key && lex.entries[key];
      if (!e || e.type) return null;
      return { w: w, key: key, cls: classOf(e) };
    }
    function isVerbToken(w) {
      if (BE_FORMS.indexOf(w) >= 0) return true;
      var info = lex.info(w);
      return !!(info && /^to\s/.test(info.gloss || ''));
    }

    /* 同位语（David the king）不替换：语义最容易被破坏 */
    var appositive = {};
    (text.match(/\b([A-Z][a-z]+)\s+the\s+([a-z]+)\b/g) || []).forEach(function (m) {
      var parts = m.split(/\s+/);
      appositive[parts[2]] = true;
    });

    var targets = [];
    tokens.forEach(function (w, i) {
      var t = usable(w);
      if (!t) return;
      if (appositive[t.w]) return;
      var prev1 = tokens[i - 1] || '';
      var prev2 = tokens[i - 2] || '';
      var next1 = tokens[i + 1] || '';
      if (PREPS.indexOf(prev1) >= 0 || prev1 === 'of') return;     // 在介词 / 所属结构内
      if (prev1 === 'the' && (PREPS.indexOf(prev2) >= 0 || prev2 === 'of')) return;
      if (next1 === 'of') return;                                  // 固定搭配，后接 of
      var core = DETERMINERS.indexOf(prev1) >= 0 || isVerbToken(prev1);
      if (!core) return;
      targets.push(t);
    });

    var out = [];
    for (var k = 0; k < targets.length && out.length < 3; k++) {
      for (var v = 0; v < pool.length && out.length < 3; v++) {
        var cand = pool[v];
        if (cand.cls !== targets[k].cls) continue;                 // 同类才替换
        if (cand.english === targets[k].key) continue;
        if (inSentence[cand.english]) continue;
        var replaced = text.replace(new RegExp('\\b' + escapeRe(targets[k].w) + '\\b'), cand.english);
        if (replaced !== text && out.indexOf(replaced) < 0) out.push(replaced);
      }
    }

    /* 放宽一轮：核心位置找不到可替换点（常见于长句 / 家谱类经文）时，
       允许替换「句中任意实词」，但仍然要求：同类、不在介词短语内、后不接 of */
    function isInflectedVerb(w) {
      return /(?:ed|ing|es|eth)$/.test(w) && !/(?:ss|us)$/.test(w);
    }
    if (out.length < 3) {
      for (var k3 = 0; k3 < tokens.length && out.length < 3; k3++) {
        var t3 = usable(tokens[k3]);
        if (!t3) continue;
        if (appositive[t3.w]) continue;
        var p1 = tokens[k3 - 1] || '', p2 = tokens[k3 - 2] || '', n1 = tokens[k3 + 1] || '';
        if (PREPS.indexOf(p1) >= 0 || p1 === 'of') continue;
        if (p1 === 'the' && (PREPS.indexOf(p2) >= 0 || p2 === 'of')) continue;
        if (n1 === 'of') continue;
        /* 句尾通常是谓语：只替换「原形动词」，避免 Abraham call 这类语法错误 */
        if (!n1 && !(isVerbToken(t3.w) || t3.cls === 'verb')) continue;
        /* 只替换动词原形（became / born / called 等屈折形式不换，避免语法错误） */
        if (t3.cls === 'verb' && lex.lemmaOf(t3.w) !== t3.w) continue;
        /* 复数名词不换单数名词，避免数字不一致 */
        if (t3.cls !== 'verb' && /(?:s|es)$/.test(t3.w) && !/(?:ss|us|is|sses)$/.test(t3.w)) continue;
        for (var v3 = 0; v3 < pool.length && out.length < 3; v3++) {
          var cd = pool[v3];
          if (cd.cls !== t3.cls) continue;
          if (cd.english === t3.key) continue;
          if (inSentence[cd.english]) continue;
          var rp = text.replace(new RegExp('\\b' + escapeRe(t3.w) + '\\b'), cd.english);
          if (rp !== text && out.indexOf(rp) < 0) out.push(rp);
        }
      }
    }

    /* 家谱类句式：「the son of X, the son of Y…」——保持句框，替换句框名词
       （son → father / brother …，这类经文最值得操练的就是这个句型） */
    if (!out.length) {
      /* became / turned 等状态转变动词后，mother / daughter 语义不通，改用中性名词 */
      var changeState = /\b(?:became|become|turned|was made)\b/i.test(text);
      var FAMILY = (changeState
        ? ['brother', 'friend', 'neighbor', 'father']
        : ['father', 'brother', 'mother', 'daughter', 'friend', 'neighbor'])
        .filter(function (f) { return lex.entries[f] && !inSentence[f]; });
      var frames = text.match(/\b(the\s+)?(son|father|brother|mother|daughter)\s+of\s+[A-Z][a-z]+\b/g) || [];
      for (var fi = 0; fi < frames.length && out.length < 3; fi++) {
        var head = frames[fi].replace(/^the\s+/, '').split(/\s+/)[0];
        for (var fj = 0; fj < FAMILY.length && out.length < 3; fj++) {
          if (FAMILY[fj] === head) continue;
          var rpF = text.replace(new RegExp('\\b' + escapeRe(head) + '(\\s+of\\s+' +
            escapeRe((frames[fi].match(/[A-Z][a-z]+$/) || [''])[0]) + ')'), FAMILY[fj] + '$1');
          if (rpF !== text && out.indexOf(rpF) < 0) out.push(rpF);
        }
      }
    }

    /* 最后保底：本段与本章都找不到同类词时，从词典里取同类的常见词
       （仍保持「同类替换 + 不碰介词短语」两条底线） */
    if (!out.length) {
      var globalPool = [];
      Object.keys(lex.entries).forEach(function (k) {
        if (globalPool.length >= 40) return;
        var ge = lex.entries[k];
        if (!ge || ge.type || !ge.zh) return;
        if (k.length < 3 || k.length > 9) return;
        globalPool.push({ english: k, cls: classOf(ge) });
      });
      /* 目标为空时，退一步：允许句首主语与句尾谓语作为替换点 */
      var relTargets = targets.slice();
      if (!relTargets.length) {
        tokens.forEach(function (w, i) {
          if (i !== 0 && i !== tokens.length - 1) return;
          var t = usable(w);
          if (!t) return;
          var n1 = tokens[i + 1] || '';
          if (n1 === 'of') return;
          if (!n1 && !(isVerbToken(t.w) || t.cls === 'verb')) return;
          relTargets.push(t);
        });
      }
      for (var k4 = 0; k4 < relTargets.length && out.length < 3; k4++) {
        for (var v4 = 0; v4 < globalPool.length && out.length < 3; v4++) {
          var gp = globalPool[v4];
          if (gp.cls !== relTargets[k4].cls) continue;
          if (gp.english === relTargets[k4].key) continue;
          if (inSentence[gp.english]) continue;
          var rp4 = text.replace(new RegExp('\\b' + escapeRe(relTargets[k4].w) + '\\b'), gp.english);
          if (rp4 !== text && out.indexOf(rp4) < 0) out.push(rp4);
        }
      }
    }
    return out;
  }

  /* =======================================================
     UNIT 切分（学习容量控制，不是简单分页）
  ======================================================= */
  var UNIT_STARTERS = /^(Therefore|Then|But|And it came to pass|After these things|After this|Now|So|When|There|Behold|For|Yet|Nevertheless|Finally|Then Jesus|And)\b/i;

  Content.splitUnits = function (verses) {
    var total = verses.length;
    if (total <= 7) return [verses.slice()];

    var per = total <= 12 ? 4 : total <= 20 ? 5 : total <= 32 ? 6 : 7;
    var count = Math.max(2, Math.round(total / per));
    var base = Math.floor(total / count);
    var extra = total % count;

    var sizes = [];
    for (var i = 0; i < count; i++) sizes.push(base + (i < extra ? 1 : 0));

    /* 边界微调：在第 2 节之后若出现段落起始词，且偏差在 1 节内，则对齐到段落 */
    var groups = [];
    var cursor = 0;
    for (var g = 0; g < sizes.length; g++) {
      var size = sizes[g];
      if (g < sizes.length - 1 && cursor + size < total) {
        for (var d = -1; d <= 1; d++) {
          var probe = cursor + size + d;
          if (probe <= cursor + 1 || probe >= total) continue;
          var firstWords = sentencize(verses[probe].text)[0] || verses[probe].text;
          if (UNIT_STARTERS.test(firstWords)) { size = size + d; break; }
        }
        /* 最后一段不要只剩 1 节 */
        if (total - (cursor + size) === 1 && g === sizes.length - 2) size += 1;
      }
      groups.push(verses.slice(cursor, cursor + size));
      cursor += size;
    }
    if (cursor < total) groups[groups.length - 1] = groups[groups.length - 1].concat(verses.slice(cursor));
    return groups.filter(function (gr) { return gr.length; });
  };

  /* =======================================================
     VOCABULARY —— 由少到多、由易到难
  ======================================================= */
  /* 词类判定（用于替换练习的同类匹配）
     verb  : 简单英文解释以 to 开头
     adj   : 中文释义以「的」结尾（形容词 / 副词）
     noun  : 其余实词
     proper: 专有名词（不参与替换） */
  function classOf(entry) {
    if (!entry) return 'none';
    if (entry.type === 'n') return 'proper';
    if (/^to\s/.test(entry.gloss || '')) return 'verb';
    if (/\u7684$/.test(entry.zh || '')) return 'adj';
    return 'noun';
  }
  function posOf(entry) { return classOf(entry); }

  function pickVocabulary(unitVerses, chapterFreq, lex, limit, used) {
    var freq = {};
    var firstAt = {};
    unitVerses.forEach(function (v) {
      tokenize(v.text).forEach(function (w) {
        freq[w] = (freq[w] || 0) + 1;
        if (firstAt[w] === undefined) firstAt[w] = v;
      });
    });

    function collect(allowUsed, maxFreq, minLen) {
      var cands = [];
      Object.keys(freq).forEach(function (w) {
        if (lex.isStop(w)) return;
        var key = lex.lemmaOf(w);
        if (!key) return;                          // 只教词表内收录的词
        var e = lex.entries[key];
        if (!e || e.type) return;                  // 变形 / 专有名词不教学
        if (!used_ok(key)) return;
        if (freq[w] > maxFreq) return;
        if (key.length < minLen) return;

        var score = 0;
        score += freq[w] * 3;
        score += (chapterFreq[w] || 0) >= 2 ? 2 : 0;
        score += key.length >= 6 ? 2 : key.length >= 4 ? 1 : 0;
        if (/^[A-Z]/.test(w)) score -= 6;          // 句中大写：多为专有名词
        cands.push({ w: w, key: key, score: score, verse: firstAt[w] });
      });
      cands.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.key < b.key ? -1 : 1;
      });
      return cands;
      function used_ok(key) { return allowUsed ? true : !used[key]; }
    }

    /* 由少到多 + 逐级放宽：先取「新词」，不足时允许复用本章已教词 */
    var stages = [
      collect(false, 6, 3),
      collect(false, 10, 3),
      collect(true, 8, 3),
      collect(true, 20, 2)
    ];
    var picked = [];
    var seenKey = {};
    stages.forEach(function (cands) {
      for (var i = 0; i < cands.length && picked.length < limit; i++) {
        if (seenKey[cands[i].key]) continue;
        seenKey[cands[i].key] = true;
        var e = lex.entries[cands[i].key];
        var verseText = cands[i].verse.text;
        picked.push({
          english: cands[i].key,
          shown: cands[i].w,
          cls: classOf(e),
          pos: classOf(e),
          zh: e.zh,
          gloss: e.gloss,
          verse: verseText,
          example: sentenceWith(verseText, cands[i].w)
        });
        used[cands[i].key] = true;
      }
    });

    /* 终极兜底：仍为空时，容许「专有名词」，保证每一课都有可教的词 */
    if (!picked.length) {
      Object.keys(freq).some(function (w) {
        if (lex.isStop(w) || w.length < 3) return false;
        var key = lex.lemmaOf(w) || w;
        var e = lex.entries[key];
        if (!e || !e.zh) return false;
        if (/^[A-Z]/.test(w)) return false;
        picked.push({
          english: key, shown: w, cls: classOf(e), pos: classOf(e),
          zh: e.zh, gloss: e.gloss, verse: firstAt[w].text,
          example: sentenceWith(firstAt[w].text, w)
        });
        return true;
      });
    }
    return picked;
  }

  function vocabItem(word, lex) {
    var key = lex.lemmaOf(word) || word;
    var e = lex.entries[key];
    if (!e || e.type) return null;
    return { english: key, shown: word, pos: classOf(e), cls: classOf(e), zh: e.zh, gloss: e.gloss };
  }

  function sentenceWith(text, word) {
    var ss = sentencize(text);
    var lower = word.toLowerCase();
    for (var i = 0; i < ss.length; i++) {
      if (tokenize(ss[i]).indexOf(lower) >= 0) return ss[i];
    }
    return ss[0] || text;
  }

  /* =======================================================
     NOTICE —— 先看见，再翻译
  ======================================================= */
  function buildNotice(unitVerses, unitNumber, lex, bookName) {
    var text = unitVerses.map(function (v) { return v.text; }).join(' ');
    var freq = {};
    unitVerses.forEach(function (v) {
      tokenize(v.text).forEach(function (w) { freq[w] = (freq[w] || 0) + 1; });
    });
    var words = Object.keys(freq);

    var out = [];
    var seed = bookName + '#' + unitNumber;

    /* 1. 重复词（最典型的观察） */
    var repeated = words.filter(function (w) {
      if (lex.isStop(w)) return false;
      var key = lex.lemmaOf(w);
      if (!key || !lex.entries[key] || lex.entries[key].type) return false;
      return freq[w] >= 2;
    }).sort(function (a, b) { return freq[b] - freq[a]; });

    if (repeated.length >= 1) {
      var top = repeated[0];
      var d1 = [];
      /* 干扰项优先取本段出现但频次更低的实词 */
      words.forEach(function (w) {
        if (d1.length >= 3 || w === top) return;
        if (freq[w] >= freq[top]) return;
        var e = lex.info(w);
        if (!e || e.type || w.length < 3) return;
        if (d1.indexOf(w) >= 0) return;
        d1.push(w);
      });
      ['temple', 'king', 'law', 'army', 'city', 'stone', 'field', 'ship'].forEach(function (w) {
        if (d1.length < 3 && d1.indexOf(w) < 0 && w !== top) d1.push(w);
      });
      out.push({
        kind: 'repeat',
        question: 'Which word is repeated most in this passage?',
        options: shuffled([top].concat(d1.slice(0, 3)), seed + '-repeat'),
        answer: -1,
        correct: top,
        note: '重复是作者给出的重点信号。'
      });
    }

    /* 2. 对比（light/darkness 之类） */
    var pair = null;
    ANTONYMS.forEach(function (p) {
      if (pair) return;
      var a = words.indexOf(p[0]) >= 0, b = words.indexOf(p[1]) >= 0;
      if (a && b) pair = p;
    });
    if (pair) {
      var otherPairs = ANTONYMS.filter(function (p) {
        return p !== pair && !(words.indexOf(p[0]) >= 0 && words.indexOf(p[1]) >= 0);
      }).slice(0, 3);
      var correctPair = cap(pair[0]) + ' and ' + pair[1];
      out.push({
        kind: 'contrast',
        question: 'Which two ideas are set against each other in this passage?',
        options: shuffled([correctPair].concat(otherPairs.map(function (p) {
          return cap(p[0]) + ' and ' + p[1];
        })), seed + '-contrast'),
        answer: -1,
        correct: correctPair,
        note: '经文常用对比来显示重点。'
      });
    }

    /* 3. 人物 */
    var people = [];
    words.forEach(function (w) {
      var key = lex.lemmaOf(w);
      var e = key && lex.entries[key];
      if (e && e.type === 'n' && !PLACE_SET[key]) { if (people.indexOf(key) < 0) people.push(key); }
    });
    if (people.length) {
      var person = people[0];
      var missing = ['moses', 'pilate', 'herod', 'caiaphas', 'pharaoh', 'barnabas', 'stephen']
        .filter(function (p) { return people.indexOf(p) < 0; }).slice(0, 3);
      if (missing.length === 3) {
        out.push({
          kind: 'person',
          question: 'Which person is named in this passage?',
          options: shuffled([person].concat(missing), seed + '-person'),
          answer: -1,
          correct: person,
          note: '先确认「谁在场」。'
        });
      }
    }

    /* 4. 地点或时间 */
    var place = words.filter(function (w) { return PLACE_WORDS.indexOf(w) >= 0; })[0];
    if (place) {
      var otherPlaces = PLACE_WORDS.filter(function (p) {
        return words.indexOf(p) < 0;
      }).slice(0, 3);
      if (otherPlaces.length === 3) {
        out.push({
          kind: 'place',
          question: 'Which place is mentioned in this passage?',
          options: shuffled([place].concat(otherPlaces), seed + '-place'),
          answer: -1,
          correct: place,
          note: '地点常常决定事情的意义。'
        });
      }
    } else {
      var timeWord = words.filter(function (w) { return TIME_WORDS.indexOf(w) >= 0; })[0];
      if (timeWord) {
        var otherTimes = TIME_WORDS.filter(function (t) { return words.indexOf(t) < 0; }).slice(0, 3);
        if (otherTimes.length === 3) {
          out.push({
            kind: 'time',
            question: 'Which time word appears in this passage?',
            options: shuffled([timeWord].concat(otherTimes), seed + '-time'),
            answer: -1,
            correct: timeWord,
            note: '时间词告诉你事情发生的次序。'
          });
        }
      }
    }

    /* 5. 连接词：作者怎样连接句子 */
    var found = null;
    CONNECTORS.forEach(function (c) {
      if (found) return;
      if (words.indexOf(c.w) >= 0 && c.w.indexOf(' ') < 0) found = c;
    });
    if (found) {
      var others = CONNECTORS.filter(function (c) {
        return c.fn !== found.fn && c.w.indexOf(' ') < 0 && words.indexOf(c.w) < 0;
      }).slice(0, 3);
      if (others.length === 3) {
        out.push({
          kind: 'connector',
          question: 'Which connecting word shows ' + found.fn + ' in this passage?',
          options: shuffled([found.w].concat(others.map(function (c) { return c.w; })), seed + '-conn'),
          answer: -1,
          correct: found.w,
          note: '连接词表示 ' + found.fn + '（' + found.zh + '）。'
        });
      }
    }

    /* 由少到多：第 1 单元 3 题，之后 4 题 */
    var limit = unitNumber <= 2 ? 3 : 4;
    return out.slice(0, limit).map(function (q) { return finalizeAnswer(q); });
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function distinctWords(exclude, pool, n, lex, freq) {
    var out = [];
    var list = pool.slice();
    for (var i = 0; i < list.length && out.length < n; i++) {
      if (list[i] !== exclude && out.indexOf(list[i]) < 0) out.push(list[i]);
    }
    return out;
  }

  function finalizeAnswer(q) {
    if (q.answer >= 0) return q;
    var idx = q.options.indexOf(q.correct);
    q.answer = idx < 0 ? 0 : idx;
    return q;
  }

  /* =======================================================
     DIRECT COMPREHENSION —— 六层递进
     层级固定不可缺：L1 人物 → L2 动作 → L3 关系 → L4 句子意义 → L5 上下文 → L6 综合
     每一层都有「最佳形态」与「保底形态」，保证 6 级永远齐全且答案必然正确。
  ======================================================= */
  function paraphraseOf(sentence) {
    var s = sentence.replace(/[.!?]+$/, '').trim();
    var m;
    function mk(t) { return { ok: 1, text: t }; }
    /* 家谱 / 父子关系 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:became|was)\s+the father of\s+(.{2,40})$/i))) return mk(cap(m[2].trim()) + ' was the son of ' + m[1].trim() + '.');
    if ((m = s.match(/^(.{2,40}?)\s+bore\s+(.{2,40})$/i))) return mk(cap(m[1].trim()) + ' was the father of ' + m[2].trim() + '.');
    /* 同在关系 */
    if ((m = s.match(/^(.{2,40}?)\s+was with\s+(.{2,40})$/i))) return mk(cap(m[1].trim()) + ' and ' + m[2].trim() + ' were together.');
    /* 表语（X is/was Y）：保留原句 be 动词的时态与单复数 */
    if ((m = s.match(/^(.{2,40}?)\s+(is|are|was|were)\s+(.{2,60})$/i))) {
      return mk(cap(m[3].trim()) + ' is what ' + m[1].trim() + ' ' + m[2].toLowerCase() + '.');
    }
    /* 状态转变 */
    if ((m = s.match(/^(.{2,40}?)\s+became\s+(.{2,60})$/i))) return mk(cap(m[1].trim()) + ' turned into ' + m[2].trim() + '.');
    /* 发光 / 胜过 */
    if ((m = s.match(/^(.{2,40}?)\s+shines?\s+in\s+(.{2,40})$/i))) return mk(cap(m[1].trim()) + ' gives light inside ' + m[2].trim() + '.');
    if ((m = s.match(/^(.{2,40}?)\s+(?:has|have)?\s*not\s+(?:overcome|overcame)\s+(.{2,40})$/i))) return mk(cap(m[2].trim()) + ' was not beaten by ' + m[1].trim() + '.');
    /* 移动 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:came|comes|went|goes)\s+(?:to|into|out to|up to|down to|out into)\s+(.{2,40})$/i))) return mk(cap(m[1].trim()) + ' traveled to ' + m[2].trim() + '.');
    /* 说话 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:said|says|spoke|speaks|answered|answered and said|replied)\s*(?:to\s+(.{2,40}))?$/i))) return mk(cap(m[1].trim()) + ' spoke' + (m[2] ? ' to ' + m[2].trim() : '') + '.');
    /* 看见 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:saw|sees|beheld|looked at)\s+(.{2,50})$/i))) return mk(cap(m[1].trim()) + ' looked at ' + m[2].trim() + '.');
    /* 给予 / 领受 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:gave|gives|give)\s+(.{2,60})$/i))) return mk(cap(m[1].trim()) + ' handed over ' + m[2].trim() + '.');
    if ((m = s.match(/^(.{2,40}?)\s+(?:took|takes|received|receives)\s+(.{2,50})$/i))) return mk(cap(m[1].trim()) + ' picked up ' + m[2].trim() + '.');
    /* 做 / 造 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:made|makes|did|does)\s+(.{2,50})$/i))) return mk(cap(m[1].trim()) + ' did ' + m[2].trim() + '.');
    /* 差遣 / 命名 / 找到 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:sent|sends)\s+(.{2,50})$/i))) return mk(cap(m[1].trim()) + ' sent out ' + m[2].trim() + '.');
    if ((m = s.match(/^(.{2,40}?)\s+(?:called|named|calls|names)\s+(.{2,50})$/i))) return mk(cap(m[1].trim()) + ' named ' + m[2].trim() + '.');
    if ((m = s.match(/^(.{2,40}?)\s+(?:found|finds)\s+(.{2,50})$/i))) return mk(cap(m[1].trim()) + ' discovered ' + m[2].trim() + '.');
    /* 爱 / 恨 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:loved|loves|hated|hates)\s+(.{2,50})$/i))) {
      var neg = /\b(?:hated|hates)\b/i.test(s);
      return mk(cap(m[1].trim()) + (neg ? ' did not love ' : ' cared for ') + m[2].trim() + '.');
    }
    /* 将来 / 应当 */
    if ((m = s.match(/^(.{2,40}?)\s+(?:will|shall)\s+(.{2,60})$/i))) return mk(cap(m[1].trim()) + ' is going to ' + m[2].trim() + '.');
    if ((m = s.match(/^(.{2,40}?)\s+(?:must|should|ought to)\s+(.{2,60})$/i))) return mk(cap(m[1].trim()) + ' needs to ' + m[2].trim() + '.');
    return null;
  }

  function isVerbEntry(e) {
    return !!e && !e.type && /^to\s/.test(e.gloss || '');
  }

  /* 句中实词（有序去重） */
  function contentTokensOf(text, lex) {
    var out = [], seen = {};
    tokenize(text).forEach(function (w) {
      if (lex.isStop(w)) return;
      if (PREPS.indexOf(w) >= 0 || DETERMINERS.indexOf(w) >= 0 || BE_FORMS.indexOf(w) >= 0) return;
      var key = lex.lemmaOf(w);
      if (!key || seen[key]) return;
      var e = lex.entries[key];
      if (!e || !e.zh) return;
      seen[key] = true;
      out.push({ w: key, e: e, surface: w });
    });
    return out;
  }

  /* 句子关键词组（用于「这一句在说什么」类问题的正确项） */
  function keyPhraseOf(sentence, lex, n) {
    var toks = contentTokensOf(sentence, lex);
    var nouns = toks.filter(function (t) { return !isVerbEntry(t.e); });
    var pick = (nouns.length >= 2 ? nouns : toks).slice(0, n || 3);
    return pick.map(function (t) { return t.w; }).join(', ');
  }

  /* 从候选池里取 n 个「不在本段经文里出现」的干扰项，避免干扰项碰巧也正确 */
  function safeDistractors(correct, bank, passageLower, n) {
    var out = [];
    for (var i = 0; i < bank.length && out.length < n; i++) {
      var b = bank[i];
      if (b === correct) continue;
      if (out.indexOf(b) >= 0) continue;
      if (passageLower.indexOf(String(b).toLowerCase()) >= 0) continue;
      out.push(b);
    }
    return out;
  }

  var FILLER_PEOPLE = ['Peter', 'Paul', 'Moses', 'Pharaoh', 'Herod', 'Barnabas', 'Stephen', 'Silas', 'Timothy', 'Titus'];
  var FILLER_THINGS = ['temple', 'army', 'ship', 'field', 'harvest', 'prison', 'vineyard', 'boat', 'well', 'gate', 'tower', 'trumpet'];
  var FILLER_VERBS = ['build', 'sail', 'count', 'divide', 'plant', 'sell', 'throw', 'gather', 'wash', 'carry', 'dig', 'climb'];
  var FILLER_TOPICS = ['Building a temple in the city', 'Paying taxes to the empire', 'Sailing and trading routes', 'Making war against a king', 'Planting a field of grain', 'Counting silver in the market'];
  var FILLER_SENTENCES = ['It says that nothing happened in that place.', 'It describes a journey to a far country.', 'It speaks only about money and trade.', 'It tells how to build a house of stone.'];
  /* mkChoice 兜底填充项：任何情况下都保证 4 个互不相同的选项 */
  var TOPUP = ['In the beginning', 'A man sent from God', 'The light of the world', 'A city on a hill', 'A field of grain', 'The sound of many waters'];

  function buildComprehension(unitVerses, unitNumber, lex, bookName, context) {
    var out = [];
    context = context || {};
    var allText = unitVerses.map(function (v) { return v.text; }).join(' ');
    var passageLower = ' ' + tokenize(allText).join(' ') + ' ';
    var sentences = [];
    unitVerses.forEach(function (v) {
      sentencize(v.text).forEach(function (s) { sentences.push({ s: s, verse: v.number }); });
    });
    var seed = bookName + '#' + unitNumber + '#' + (unitVerses[0] ? unitVerses[0].number : 0);

    var freq = {};
    var lowerFreq = {};   // 仅统计原文中小写出现的次数（排除「总是大写」的专名）
    unitVerses.forEach(function (v) {
      tokenize(v.text).forEach(function (w) { freq[w] = (freq[w] || 0) + 1; });
      (String(v.text).match(/[a-z][a-z']+/g) || []).forEach(function (w) {
        lowerFreq[w] = (lowerFreq[w] || 0) + 1;
      });
    });
    var words = Object.keys(freq);

    /* 本章其它句子（用于 L3 / L4 / L5 的干扰项与对比材料） */
    var chapterSentences = (context.chapterSentences || []).filter(function (s) {
      return allText.indexOf(s.slice(0, 24)) < 0;
    });

    /* ---------- L1 认人 / 认物 ---------- */
    var unitPeople = [];
    words.forEach(function (w) {
      var key = lex.lemmaOf(w);
      var e = key && lex.entries[key];
      if (e && e.type === 'n' && !PLACE_SET[key] && unitPeople.indexOf(key) < 0) unitPeople.push(key);
    });
    var l1 = null;
    if (unitPeople.length) {
      var p0 = cap(unitPeople[0]);
      var pWrong = safeDistractors(p0, FILLER_PEOPLE, passageLower, 3);
      if (pWrong.length === 3) l1 = mkChoice(1, 'Which person is named in this passage?', [p0].concat(pWrong), p0, seed + '-l1b', '先认出「谁」出现在这段经文里。');
    }
    if (!l1) {
      var KIN = { father: 1, mother: 1, brother: 1, sister: 1, son: 1, daughter: 1, man: 1, woman: 1, children: 1, child: 1 };
      var things = words.filter(function (w) {
        var key = lex.lemmaOf(w);
        if (!key || lex.isStop(w)) return false;
        var e = lex.entries[key];
        if (!e || e.type || !e.zh || isVerbEntry(e)) return false;
        if (KIN[key]) return false;
        if (!lowerFreq[w]) return false;
        return freq[w] >= 2;
      }).sort(function (a, b) { return freq[b] - freq[a]; });
      var t0 = things[0] && cap(lex.lemmaOf(things[0]));
      var tWrong = t0 ? safeDistractors(t0, FILLER_THINGS, passageLower, 3) : [];
      if (t0 && tWrong.length === 3) l1 = mkChoice(1, 'Which thing is spoken of most in this passage?', [t0].concat(tWrong.map(cap)), t0, seed + '-l1a', '先认出经文反复提到的那个「事物」。');
    }
    if (!l1) {
      /* 保底：本段出现最多的实词 */
      var topAny = contentTokensOf(allText, lex).sort(function (a, b) { return (freq[b.w] || 0) - (freq[a.w] || 0); })[0];
      if (topAny) {
        var c0 = cap(topAny.w);
        var cWrong = safeDistractors(c0, FILLER_THINGS.concat(FILLER_PEOPLE), passageLower, 3);
        l1 = mkChoice(1, 'Which word appears in this passage?', [c0].concat(cWrong.map(cap)), c0, seed + '-l1c', '先认出这段经文里的关键词。');
      }
    }
    if (l1) out.push(l1);

    /* ---------- L2 认动作 ---------- */
    function verbLemmaOf(w) {
      var key = lex.lemmaOf(w);
      var e = key && lex.entries[key];
      return isVerbEntry(e) ? key : null;
    }
    var verbWords = words.filter(function (w) { return !lex.isStop(w) && !!verbLemmaOf(w); });
    var verbs = verbWords.filter(function (w) { return !!lowerFreq[w]; })           // 只在句中大写出现的多半不是动词
      .sort(function (a, b) { return freq[b] - freq[a]; });
    if (!verbs.length) {
      verbs = verbWords.slice().sort(function (a, b) { return freq[b] - freq[a]; });
    }
    if (!verbs.length) {
      /* 保底：跟在助动词 / be 动词 / to 之后，且词典确实标为动词 */
      var HELPERS = ['shall', 'will', 'may', 'might', 'can', 'could', 'would', 'should', 'must', 'let', 'do', 'does', 'did', 'to', 'not'];
      var toks = tokenize(allText);
      for (var hi = 1; hi < toks.length && !verbs.length; hi++) {
        var prev = toks[hi - 1];
        if (HELPERS.indexOf(prev) >= 0 && verbLemmaOf(toks[hi])) verbs.push(toks[hi]);
      }
    }
    if (verbs.length) {
      var v0 = cap(verbs[0]);
      var vWrong = safeDistractors(v0, FILLER_VERBS, passageLower, 3);
      if (vWrong.length === 3) {
        out.push(mkChoice(2, 'Which action is found in this passage?', [v0].concat(vWrong.map(cap)), v0, seed + '-l2', '动作题：这段经文说「做了什么」。'));
      }
    }
    if (!out.some(function (q) { return q.level === 2; })) {
      /* 极少数无动词单元：改为同层级的「动词形态辨认」，仍然只考动作词 */
      var vForm = words.filter(function (w) { return /(?:ed|ing|s|eth)$/.test(w) && !lex.isStop(w); })
        .sort(function (a, b) { return freq[b] - freq[a]; })[0];
      if (vForm) {
        var vf = cap(vForm);
        var vfWrong = safeDistractors(vf, FILLER_VERBS, passageLower, 3);
        if (vfWrong.length === 3) out.push(mkChoice(2, 'Which word in this passage is a doing-word?', [vf].concat(vfWrong.map(cap)), vf, seed + '-l2f', '动作题：找出表示动作的词。'));
      }
    }

    /* ---------- L3 理解关系 ---------- */
    var l3 = null;
    var relA = null, relB = null, relKind = '';
    sentences.forEach(function (item) {
      var s = item.s.replace(/[.!?]+$/, '');
      var m;
      if (!relA && (m = s.match(/^(.{2,40}?)\s+(?:became|was)\s+the father of\s+(.{2,40})$/i))) { relA = m[1].trim(); relB = m[2].trim(); relKind = 'father'; }
      else if (!relA && (m = s.match(/^(.{2,40}?)\s+was with\s+(.{2,40})$/i))) { relA = m[1].trim(); relB = m[2].trim(); relKind = 'with'; }
      else if (!relA && (m = s.match(/^(.{2,40}?)\s+(?:is|was)\s+(.{2,50})$/i))) { relA = m[1].trim(); relB = m[2].trim(); relKind = 'is'; }
    });
    if (relA && relB) {
      var correctRel;
      var wrongs;
      if (relKind === 'father') {
        correctRel = cap(relA) + ' was the father of ' + relB + '.';
        wrongs = [cap(relB) + ' was the father of ' + relA + '.', cap(relA) + ' ruled over ' + relB + '.', cap(relA) + ' went away from ' + relB + '.'];
      } else if (relKind === 'with') {
        correctRel = cap(relA) + ' and ' + relB + ' were together.';
        wrongs = [cap(relA) + ' ruled over ' + relB + '.', cap(relB) + ' created ' + relA + '.', cap(relA) + ' went away from ' + relB + '.'];
      } else {
        correctRel = cap(relB) + ' is what ' + relA + ' is.';
        wrongs = [cap(relA) + ' is the enemy of ' + relB + '.', cap(relB) + ' did not know ' + relA + '.', cap(relA) + ' replaced ' + relB + '.'];
      }
      l3 = mkChoice(3, 'What relation does this passage show?', [correctRel].concat(wrongs), correctRel, seed + '-l3', '关系题：谁和谁在一起、谁属于谁。');
    }
    if (!l3) {
      /* 保底：同一句里共同出现的两个实词 */
      var pair = [];
      for (var si = 0; si < sentences.length && pair.length < 2; si++) {
        var toks = contentTokensOf(sentences[si].s, lex).filter(function (t) { return !isVerbEntry(t.e); });
        if (toks.length >= 2) pair = [cap(toks[0].w), cap(toks[1].w)];
      }
      if (pair.length < 2) {
        var allToks = contentTokensOf(allText, lex).filter(function (t) { return !isVerbEntry(t.e); });
        pair = allToks.slice(0, 2).map(function (t) { return cap(t.w); });
      }
      if (pair.length === 2 && pair[0] !== pair[1]) {
        var correctPair = pair[0] + ' and ' + pair[1];
        var pairWrong = [
          pair[0] + ' and ' + cap(FILLER_THINGS[0]),
          pair[1] + ' and ' + cap(FILLER_PEOPLE[0]),
          cap(FILLER_THINGS[1]) + ' and ' + cap(FILLER_PEOPLE[1])
        ];
        l3 = mkChoice(3, 'Which two are spoken of together in this passage?', [correctPair].concat(pairWrong), correctPair, seed + '-l3b', '关系题：本段把哪两个放在一起说。');
      }
    }
    if (l3) out.push(l3);

    /* ---------- L4 理解句子意义 ---------- */
    var l4 = null;
    for (var i = 0; i < sentences.length && !l4; i++) {
      var p = paraphraseOf(sentences[i].s);
      if (!p || !p.text) continue;
      if (messagesTooClose(p.text, sentences[i].s)) continue;
      var src = sentences[i].s;
      var l4wrong = [];
      /* 优先用本章其它句子的改写做干扰项，更像真的在做语义判断 */
      for (var ci = 0; ci < chapterSentences.length && l4wrong.length < 3; ci++) {
        var cp = paraphraseOf(chapterSentences[ci]);
        if (cp && cp.text && !messagesTooClose(cp.text, p.text) && l4wrong.indexOf(cp.text) < 0) l4wrong.push(cp.text);
      }
      while (l4wrong.length < 3) {
        var f = FILLER_SENTENCES[l4wrong.length];
        if (l4wrong.indexOf(f) < 0) l4wrong.push(f); else break;
      }
      if (l4wrong.length === 3) {
        l4 = mkChoice(4, 'Which sentence gives the meaning of: "' + trim(src, 96) + '" ?', [p.text].concat(l4wrong), p.text, seed + '-l4-' + i, '不看中文，直接判断这句在说什么。');
      }
    }
    if (!l4) {
      /* 保底：这一句在说什么（关键词组，选项格式统一） */
      var best = null;
      sentences.forEach(function (item) {
        var ph = keyPhraseOf(item.s, lex, 3);
        if (!best || ph.length > best.ph.length) best = { s: item.s, ph: ph };
      });
      if (best && best.ph) {
        var correctAbout = 'It is about ' + best.ph + '.';
        var aboutWrong = [];
        chapterSentences.forEach(function (cs) {
          var q = keyPhraseOf(cs, lex, 3);
          var t = q ? 'It is about ' + q + '.' : '';
          if (t && t !== correctAbout && aboutWrong.indexOf(t) < 0 && aboutWrong.length < 3) aboutWrong.push(t);
        });
        FILLER_TOPICS.forEach(function (t) {
          var w = 'It is about ' + t.charAt(0).toLowerCase() + t.slice(1) + '.';
          if (w !== correctAbout && aboutWrong.indexOf(w) < 0 && aboutWrong.length < 3) aboutWrong.push(w);
        });
        if (aboutWrong.length >= 3) {
          l4 = mkChoice(4, 'What does this sentence say?  "' + trim(best.s, 96) + '"', [correctAbout].concat(aboutWrong.slice(0, 3)), correctAbout, seed + '-l4f', '句子意义：抓住这一句的中心词。');
        }
      }
    }
    if (l4) out.push(l4);

    /* ---------- L5 理解上下文（哪一句在这段经文的开头） ---------- */
    var l5 = null;
    var ordered = unitVerses.slice().sort(function (a, b) { return a.number - b.number; });
    var firstSentence = sentencize(ordered[0].text)[0] || ordered[0].text;
    var laterSentences = [];
    for (var k = 1; k < ordered.length && laterSentences.length < 3; k++) {
      var s0 = sentencize(ordered[k].text)[0] || ordered[k].text;
      if (s0 !== firstSentence && laterSentences.indexOf(s0) < 0) laterSentences.push(s0);
    }
    if (laterSentences.length < 3) {
      for (var qi = 0; qi < chapterSentences.length && laterSentences.length < 3; qi++) {
        if (chapterSentences[qi] !== firstSentence && laterSentences.indexOf(chapterSentences[qi]) < 0) laterSentences.push(chapterSentences[qi]);
      }
    }
    while (laterSentences.length < 3) {
      var fs = FILLER_SENTENCES[laterSentences.length];
      if (laterSentences.indexOf(fs) < 0) laterSentences.push(fs); else break;
    }
    if (laterSentences.length === 3) {
      l5 = mkChoice(5, 'Which sentence opens this passage?', [firstSentence].concat(laterSentences), firstSentence, seed + '-l5', '上下文题：先读哪里，后读哪里。');
    }
    if (l5) out.push(l5);

    /* ---------- L6 综合理解（整段主旨） ---------- */
    var topicWords = Object.keys(freq).filter(function (w) {
      var key = lex.lemmaOf(w);
      if (!key || lex.isStop(w)) return false;
      var e = lex.entries[key];
      if (!e || e.type === 'x') return false;
      if (isVerbEntry(e)) return false;                  // 主旨用名词/名物，不用动词
      return freq[w] >= 2 && key.length >= 4;
    }).sort(function (a, b) {
      if (freq[b] !== freq[a]) return freq[b] - freq[a];
      return b.length - a.length;
    }).slice(0, 3).map(function (w) { return cap(lex.lemmaOf(w)); });

    if (topicWords.length < 2) {
      topicWords = contentTokensOf(allText, lex)
        .filter(function (t) { return !isVerbEntry(t.e) && t.w.length >= 3; })
        .slice(0, 3).map(function (t) { return cap(t.w); });
    }
    if (topicWords.length >= 2) {
      var correctTopic = topicWords.join(', ');
      /* 干扰项同样采用「词组」格式，保证四个选项形态一致 */
      var topicWrong = [
        cap(FILLER_THINGS[0]) + ', ' + cap(FILLER_THINGS[1]) + ', ' + cap(FILLER_THINGS[2]),
        cap(FILLER_THINGS[3]) + ', ' + cap(FILLER_THINGS[4]) + ', ' + cap(FILLER_THINGS[5]),
        cap(FILLER_PEOPLE[0]) + ', ' + cap(FILLER_THINGS[6]) + ', ' + cap(FILLER_THINGS[7])
      ].filter(function (x) { return x !== correctTopic; }).slice(0, 3);
      out.push(mkChoice(6, 'Which group of words best names the main subject of this passage?',
        [correctTopic].concat(topicWrong),
        correctTopic, seed + '-l6', '综合题：整段经文主要在说什么（' + topicWords.map(function (w) {
          var e = lex.entries[w.toLowerCase()];
          return e ? e.zh : '';
        }).filter(Boolean).join('、') + '）。'));
    } else {
      /* 终极保底：本卷主旨定位 */
      var correctBook = 'The passage is from ' + bookName + '.';
      var bookWrong = ['The passage is from Genesis.', 'The passage is from Exodus.', 'The passage is from Isaiah.']
        .filter(function (x) { return x !== correctBook; }).slice(0, 3);
      out.push(mkChoice(6, 'Where is this passage taken from?', [correctBook].concat(bookWrong), correctBook, seed + '-l6f', '综合题：定位本段出处。'));
    }

    /* 按层级排序，确保层序稳定 */
    out.sort(function (a, b) { return a.level - b.level; });
    return out;
  }

  /* 判断两个句子是否过于接近（避免干扰项与正确项实质相同） */
  function messagesTooClose(a, b) {
    function norm(s) {
      return String(s).toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
    }
    var x = norm(a), y = norm(b);
    if (!x || !y) return true;
    if (x === y) return true;
    var xa = x.split(' '), ya = y.split(' ');
    var set = {};
    ya.forEach(function (w) { set[w] = 1; });
    var same = xa.filter(function (w) { return set[w]; }).length;
    return same / Math.max(xa.length, 1) > 0.7;
  }

  function capFirstOnly(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function trim(s, n) {
    s = String(s);
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }
  function mkChoice(level, question, options, correct, seed, hint) {
    /* 先去掉重复选项，再打乱，保证：选项唯一 + 正确项必然存在 + answer 一定合法 */
    var seen = {}, uniq = [];
    options.forEach(function (o) {
      var s = String(o);
      if (seen[s]) return;
      seen[s] = true;
      uniq.push(s);
    });
    if (uniq.indexOf(String(correct)) < 0) uniq.unshift(String(correct));
    for (var ti = 0; ti < TOPUP.length && uniq.length < 4; ti++) {
      var t = TOPUP[ti];
      if (seen[t]) continue;
      seen[t] = true;
      uniq.push(t);
    }
    var opts = shuffled(uniq, seed);
    return {
      level: level,
      question: question,
      options: opts,
      answer: Math.max(0, opts.indexOf(String(correct))),
      correct: String(correct),
      hint: hint || ''
    };
  }

  /* =======================================================
     SPEAK —— 模仿 → 替换 → 自主表达
  ======================================================= */
  function buildSpeaking(unitVerses, unitNumber, structures, lex, reference, vocabItems) {
    var sentences = [];
    unitVerses.forEach(function (v) {
      sentencize(v.text).forEach(function (s) {
        var wc = tokenize(s).length;
        if (wc >= 3 && wc <= 16) sentences.push({ text: s, verse: v.number, wc: wc });
      });
    });
    sentences.sort(function (a, b) { return a.wc - b.wc; });

    var imitate = sentences.slice(0, unitNumber <= 2 ? 3 : 4).map(function (s) {
      return { text: s.text, verse: s.verse };
    });

    /* 兜底：本单元全是长句时，放宽词长窗口 */
    if (!imitate.length) {
      var wider = [];
      unitVerses.forEach(function (v) {
        sentencize(v.text).forEach(function (s) {
          var wc = tokenize(s).length;
          if (wc >= 3) wider.push({ text: s, verse: v.number, wc: wc });
        });
      });
      wider.sort(function (a, b) { return a.wc - b.wc; });
      imitate = wider.slice(0, unitNumber <= 2 ? 3 : 4).map(function (s) {
        return { text: s.text, verse: s.verse };
      });
      /* 最后保底：本单元最短的一节 */
      if (!imitate.length) {
        var vs = unitVerses.slice().sort(function (a, b) {
          return tokenize(a.text).length - tokenize(b.text).length;
        });
        if (vs[0]) imitate = [{ text: vs[0].text, verse: vs[0].number }];
      }
    }

    var substitute = [];
    structures.forEach(function (st) {
      (st.substitutions || []).forEach(function (s) {
        if (substitute.indexOf(s) < 0) substitute.push(s);
      });
    });

    /* 兜底：句型句没有可替换位置时，从本单元其它句子生成替换练习 */
    if (substitute.length < 2) {
      var poolItems = (vocabItems || []).concat(structures.map(function (st) { return st.sentence; }));
      sentences.forEach(function (s) {
        if (substitute.length >= 3) return;
        substitutions(s.text, vocabItems || [], lex).forEach(function (x) {
          if (substitute.length < 3 && substitute.indexOf(x) < 0) substitute.push(x);
        });
      });
    }
    substitute = substitute.slice(0, 4);

    return {
      imitate: imitate,
      substitute: substitute,
      produce: 'In simple English, tell what happens in ' + reference + '. Use at least one sentence from the passage.'
    };
  }

  /* =======================================================
     FINAL TEST —— 综合检查（正式流程的一部分）
  ======================================================= */
  function buildFinalTest(unit, lex) {
    var out = [];
    var seed = unit.id + '#final';

    /* 1-2. 词汇 → 意义（用简单英文解释，不要求中文） */
    unit.vocabulary.slice(0, 2).forEach(function (v, i) {
      var others = unit.vocabulary.filter(function (x) { return x.english !== v.english; })
        .slice(0, 3).map(function (x) { return x.english; });
      if (others.length < 3) return;
      out.push(mkChoice('vocabulary', 'Which word means: "' + v.gloss + '" ?',
        [v.english].concat(others).map(cap), cap(v.english), seed + '-v' + i, v.zh + ' · 出现在经文里'));
    });

    /* 3. 句型辨认 */
    if (unit.structures.length) {
      var st = unit.structures[0];
      var wrong = unit.structures.slice(1, 4).map(function (x) { return x.sentence; });
      var pool = ['In the beginning was the Word.', 'The light shines in the darkness.', 'There came a man sent from God.'];
      while (wrong.length < 3) {
        var c = pool.shift();
        if (c && c !== st.sentence && wrong.indexOf(c) < 0) wrong.push(c);
        else if (!pool.length) break;
      }
      if (wrong.length === 3) {
        out.push(mkChoice('structure', 'Which sentence follows this pattern: ' + st.pattern + ' ?',
          [st.sentence].concat(wrong), st.sentence, seed + '-s', '句型辨认：看结构，不看内容。'));
      }
    }

    /* 4. 阅读确认 */
    var sentencePool = [];
    unit.verses.forEach(function (v) {
      sentencize(v.text).forEach(function (s) { if (tokenize(s).length >= 4) sentencePool.push(s); });
    });
    if (sentencePool.length) {
      var realSentence = sentencePool[0];
      var fake = ['The teacher sat down by the river and taught the crowd.',
        'They counted the silver and wrote it in the book.',
        'The soldiers built a wall around the small town.'];
      out.push(mkChoice('reading', 'Which sentence appears in this passage?',
        [realSentence].concat(fake), realSentence, seed + '-r', '回忆经文本身。'));
    }

    /* 5-6. 直接理解（复用理解题的最高两层） */
    var deep = unit.comprehension.filter(function (q) { return q.level >= 4; }).slice(0, 2);
    deep.forEach(function (q, i) {
      out.push(mkChoice('comprehension', q.question, q.options.slice(), q.correct, seed + '-c' + i, q.hint));
    });

    /* 7. 表达（简答，关键词检查） */
    out.push({
      kind: 'production',
      question: unit.speaking.produce,
      keywords: unit.vocabulary.slice(0, 4).map(function (v) { return v.english; }),
      answer: -1,
      options: []
    });

    return out;
  }

  /* =======================================================
     BASELINE —— 少量、低难度、不制造压力
  ======================================================= */
  function buildBaseline(unit, lex) {
    var out = unit.comprehension.filter(function (q) { return q.level <= 2; }).slice(0, 3).map(function (q) {
      return {
        question: q.question,
        options: q.options.slice(),
        answer: q.answer,
        correct: q.correct,
        hint: q.hint
      };
    });

    /* 保证 3 题（低难度、不制造压力） */
    var fallbacks = [];
    if (unit.vocabulary.length >= 4) {
      var v = unit.vocabulary[0];
      var others = unit.vocabulary.slice(1, 4).map(function (x) { return cap(x.english); });
      fallbacks.push({
        question: 'Which word appears in this passage?',
        options: shuffled([cap(v.english)].concat(others), unit.id + '#base'),
        answer: -1,
        correct: cap(v.english),
        hint: '先认出经文里的词：' + v.zh
      });
    }
    var fake = ['The teacher went down to the sea and slept.',
      'They built a house beside the road.',
      'The soldiers counted the silver in the temple.'];
    unit.verses.forEach(function (vv, i) {
      if (i > 1) return;
      var real = sentencize(vv.text)[0] || vv.text;
      fallbacks.push({
        question: 'Which sentence is really in this passage?',
        options: shuffled([real].concat(fake), unit.id + '#base-s' + i),
        answer: -1,
        correct: real,
        hint: '先认出经文本身。'
      });
    });

    for (var f = 0; f < fallbacks.length && out.length < 3; f++) out.push(fallbacks[f]);
    return out.map(finalizeAnswer);
  }

  /* =======================================================
     单元标题（由核心词生成）
  ======================================================= */
  function unitTitle(unitVerses, lex) {
    var freq = {};
    unitVerses.forEach(function (v) {
      tokenize(v.text).forEach(function (w) { freq[w] = (freq[w] || 0) + 1; });
    });
    var keys = Object.keys(freq).filter(function (w) {
      var key = lex.lemmaOf(w);
      if (!key || lex.isStop(w)) return false;
      var e = lex.entries[key];
      return e && !e.type && key.length >= 4;
    }).sort(function (a, b) {
      if (freq[b] !== freq[a]) return freq[b] - freq[a];
      return b.length - a.length;
    }).slice(0, 3).map(function (w) { return cap(lex.lemmaOf(w)); });
    return keys.join(' · ') || 'Passage';
  }

  /* =======================================================
     主编译入口：一章 → 学习模型
  ======================================================= */
  Content.compileChapter = function (book, chapter, verses, lexicon) {
    var lex = makeLex(lexicon);
    var groups = Content.splitUnits(verses);

    var chapterFreq = {};
    tokenize(verses.map(function (v) { return v.text; }).join(' ')).forEach(function (w) {
      chapterFreq[w] = (chapterFreq[w] || 0) + 1;
    });

    /* 全章句子（供单元内部生成上下文/语义干扰项，保证 6 级理解题材料充足） */
    var chapterSentences = [];
    verses.forEach(function (v) {
      sentencize(v.text).forEach(function (s) {
        if (s && chapterSentences.indexOf(s) < 0) chapterSentences.push(s);
      });
    });
    var chapterCtx = { chapterSentences: chapterSentences, bookName: book.name, bookId: book.id };

    var used = {};

    var units = groups.map(function (grp, idx) {
      var first = grp[0].number;
      var last = grp[grp.length - 1].number;
      var reference = book.name + ' ' + chapter + ':' + first + (last > first ? '–' + last : '');

      /* 由少到多：靠前的单元词汇量少一些 */
      var vocabLimit = Math.min(4 + idx, 6);
      var vocabulary = pickVocabulary(grp, chapterFreq, lex, vocabLimit, used);

      var grpSentences = [];
      grp.forEach(function (v) {
        sentencize(v.text).forEach(function (s) { grpSentences.push(s); });
      });

      /* 替换池：本单元词汇 + 本章其它实词（按词性匹配后用于 SUBSTITUTE 练习） */
      var pool = vocabulary.slice();
      var poolSeen = {};
      pool.forEach(function (v) { poolSeen[v.english] = true; });
      Object.keys(chapterFreq).forEach(function (w) {
        if (pool.length >= 26) return;
        if (w.length < 4) return;
        var item = vocabItem(w, lex);
        if (!item || poolSeen[item.english]) return;
        poolSeen[item.english] = true;
        pool.push(item);
      });

      var structures = [];
      var stLimit = idx === 0 ? 2 : 3;
      var seenPattern = {};
      for (var i = 0; i < grpSentences.length && structures.length < stLimit; i++) {
        var st = buildStructure(grpSentences[i], pool, lex);
        if (!st) continue;
        if (seenPattern[st.id]) continue;
        seenPattern[st.id] = true;
        structures.push(st);
      }

      var unit = {
        id: book.id + '.' + chapter + '-U' + String(idx + 1).padStart(2, '0'),
        number: idx + 1,
        reference: reference,
        first: first,
        last: last,
        title: '',
        verses: grp.map(function (v) { return { number: v.number, text: v.text }; }),
        vocabulary: vocabulary,
        structures: structures,
        notice: [],
        comprehension: [],
        speaking: { imitate: [], substitute: [], produce: '' },
        baseline: [],
        finalTest: []
      };

      unit.title = unitTitle(grp, lex);
      unit.notice = buildNotice(grp, idx + 1, lex, book.name);
      unit.comprehension = buildComprehension(grp, idx + 1, lex, book.name, chapterCtx);
      unit.speaking = buildSpeaking(grp, idx + 1, structures, lex, reference, pool);
      unit.baseline = buildBaseline(unit, lex);
      unit.finalTest = buildFinalTest(unit, lex);
      return unit;
    });

    return {
      book: book.id,
      bookName: book.name,
      bookNameZh: book.nameZh || '',
      chapter: Number(chapter),
      reference: book.name + ' ' + chapter,
      verseCount: verses.length,
      verses: verses.map(function (v) { return { number: v.number, text: v.text }; }),
      units: units
    };
  };

  /* =======================================================
     公开工具：供「精编课程」（John 1 母版）复用同一套教学引擎
     —— 保证每一课都不是素材，而是被同一引擎加工出的教学单元
  ======================================================= */
  Content.makeLex = makeLex;
  Content.sentencize = sentencize;

  /* 用教学引擎为一组经文生成完整 STRUCTURE 数据
     （原句 / 句型 / 拆分 / 说明 / 词义 / 例句 / 替换练习） */
  Content.structuresFor = function (verses, lexicon, limit) {
    var lex = makeLex(lexicon);
    var sentences = [];
    (verses || []).forEach(function (v) {
      sentencize(v.text).forEach(function (s) { sentences.push(s); });
    });
    var freq = {};
    tokenize((verses || []).map(function (v) { return v.text; }).join(' ')).forEach(function (w) {
      freq[w] = (freq[w] || 0) + 1;
    });
    var pool = [], seen = {};
    Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; }).forEach(function (w) {
      if (pool.length >= 26) return;
      if (w.length < 4) return;
      var item = vocabItem(w, lex);
      if (!item || seen[item.english]) return;
      seen[item.english] = true;
      pool.push(item);
    });
    var out = [], seenPattern = {};
    var max = limit || 3;
    for (var i = 0; i < sentences.length && out.length < max; i++) {
      var st = buildStructure(sentences[i], pool, lex);
      if (!st) continue;
      if (seenPattern[st.id]) continue;
      seenPattern[st.id] = true;
      out.push(st);
    }
    return out;
  };

  /* 用教学引擎生成六层 DIRECT COMPREHENSION（含保底） */
  Content.comprehensionFor = function (verses, unitNumber, lexicon, context) {
    return buildComprehension(verses || [], unitNumber || 1, makeLex(lexicon), (context && context.bookName) || '', context || {});
  };

  /* 用教学引擎生成 FINAL TEST（词汇 / 句型 / 阅读 / 理解 / 表达） */
  Content.finalTestFor = function (unit, lexicon) {
    return buildFinalTest(unit, makeLex(lexicon));
  };

  /* 用教学引擎生成 BASELINE（低难度、不制造压力） */
  Content.baselineFor = function (unit, lexicon) {
    return buildBaseline(unit, makeLex(lexicon));
  };

  global.EBRM = global.EBRM || {};
  global.EBRM.Content = Content;

})(typeof window !== 'undefined' ? window : globalThis);
