/* =========================================================
   EBRM V0.2
   John 1
========================================================= */


/*
 * 把这里换成你的 Cloudflare Worker 地址。
 *
 * 例如：
 *
 * https://ebrm-esv.xxxxx.workers.dev
 */

const CONFIG = {

  WORKER_URL:
    'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev'

};


/* =========================================================
   TRAINING UNITS
========================================================= */

const UNITS = [

  {
    id: 'john1-1-5',

    title: 'John 1:1–5',

    start: 1,
    end: 5,

    words: [

      ['beginning', '开始', 'the start'],

      ['Word', '道', 'the Word in John 1'],

      ['with', '与……同在', 'together / in relationship with'],

      ['life', '生命', 'living; source of life'],

      ['light', '光', 'light'],

      ['darkness', '黑暗', 'darkness']

    ],

    structures: [

      [
        'In the beginning was the Word.',
        'In the beginning + was + subject'
      ],

      [
        'The Word was with God.',
        'Subject + was + with + person'
      ],

      [
        'The Word was God.',
        'Subject + was + complement'
      ]

    ],

    questions: [

      {
        q: 'What was with God in the beginning?',

        options: [
          'The Word',
          'The light',
          'The darkness'
        ],

        answer: 0
      },

      {
        q: 'What was in the Word?',

        options: [
          'Darkness',
          'Life',
          'Beginning'
        ],

        answer: 1
      },

      {
        q: 'Where does the light shine?',

        options: [
          'In the beginning',
          'With God',
          'In the darkness'
        ],

        answer: 2
      }

    ]

  },


  {
    id: 'john1-6-13',

    title: 'John 1:6–13',

    start: 6,
    end: 13,

    words: [

      ['witness', '见证人', 'a person who gives testimony'],

      ['believe', '相信', 'to trust or accept as true'],

      ['true', '真的', 'real; genuine'],

      ['world', '世界', 'the world'],

      ['receive', '接受', 'to accept'],

      ['children', '儿女', 'children']

    ],

    structures: [

      [
        'There was a man sent from God.',
        'There was + noun + past participle'
      ],

      [
        'He came as a witness.',
        'Subject + came + as + noun'
      ],

      [
        'He was not the light.',
        'Subject + was not + noun'
      ]

    ],

    questions: [

      {
        q: 'Why did John come?',

        options: [
          'To be the light',
          'To bear witness to the light',
          'To create the world'
        ],

        answer: 1
      },

      {
        q: 'What happens to those who receive the Word?',

        options: [
          'They become children of God',
          'They become angels',
          'They become prophets'
        ],

        answer: 0
      }

    ]

  },


  {
    id: 'john1-14-18',

    title: 'John 1:14–18',

    start: 14,
    end: 18,

    words: [

      ['flesh', '肉身', 'human bodily existence'],

      ['dwelt', '住', 'lived among'],

      ['glory', '荣耀', 'splendor; honor'],

      ['grace', '恩典', 'undeserved favor'],

      ['truth', '真理', 'what is true'],

      ['revealed', '显明', 'made known']

    ],

    structures: [

      [
        'The Word became flesh.',
        'Subject + became + noun'
      ],

      [
        'We have seen his glory.',
        'Subject + have seen + object'
      ],

      [
        'Grace and truth came through Jesus Christ.',
        'Noun + came through + person'
      ]

    ],

    questions: [

      {
        q: 'What did the Word become?',

        options: [
          'Light',
          'Flesh',
          'Darkness'
        ],

        answer: 1
      },

      {
        q: 'What did John see?',

        options: [
          'His glory',
          'The beginning',
          'The law only'
        ],

        answer: 0
      }

    ]

  },


  {
    id: 'john1-19-28',

    title: 'John 1:19–28',

    start: 19,
    end: 28,

    words: [

      ['testimony', '见证', 'testimony'],

      ['Christ', '基督', 'Messiah / Christ'],

      ['prophet', '先知', 'prophet'],

      ['baptize', '施洗', 'to baptize'],

      ['worthy', '配得', 'deserving']

    ],

    structures: [

      [
        'Who are you?',
        'Question word + be + subject'
      ],

      [
        'I am not the Christ.',
        'Subject + be not + noun'
      ],

      [
        'I baptize with water.',
        'Subject + verb + with + noun'
      ]

    ],

    questions: [

      {
        q: 'Who did John say he was not?',

        options: [
          'Elijah',
          'The Christ',
          'A prophet'
        ],

        answer: 1
      },

      {
        q: 'With what did John baptize?',

        options: [
          'Fire',
          'Oil',
          'Water'
        ],

        answer: 2
      }

    ]

  },


  {
    id: 'john1-29-34',

    title: 'John 1:29–34',

    start: 29,
    end: 34,

    words: [

      ['Lamb', '羔羊', 'Lamb'],

      ['sin', '罪', 'sin'],

      ['Spirit', '圣灵', 'Spirit'],

      ['remain', '住', 'stay; continue'],

      ['Son', '儿子', 'Son']

    ],

    structures: [

      [
        'Behold, the Lamb of God.',
        'Behold + noun phrase'
      ],

      [
        'He takes away the sin of the world.',
        'Subject + verb + object'
      ],

      [
        'The Spirit remained on him.',
        'Subject + remained + prepositional phrase'
      ]

    ],

    questions: [

      {
        q: 'Who takes away the sin of the world?',

        options: [
          'John',
          'The Lamb of God',
          'Elijah'
        ],

        answer: 1
      },

      {
        q: 'What descended like a dove?',

        options: [
          'The Spirit',
          'The light',
          'The Word'
        ],

        answer: 0
      }

    ]

  },


  {
    id: 'john1-35-42',

    title: 'John 1:35–42',

    start: 35,
    end: 42,

    words: [

      ['disciple', '门徒', 'a follower'],

      ['follow', '跟随', 'to go after'],

      ['Rabbi', '拉比', 'teacher'],

      ['Messiah', '弥赛亚', 'Messiah'],

      ['brother', '兄弟', 'brother']

    ],

    structures: [

      [
        'What are you seeking?',
        'Question word + be + subject + participle'
      ],

      [
        'Come and you will see.',
        'Imperative + and + result'
      ],

      [
        'We have found the Messiah.',
        'Present perfect + object'
      ]

    ],

    questions: [

      {
        q: 'What did the disciples call Jesus?',

        options: [
          'Rabbi',
          'Elijah',
          'Prophet only'
        ],

        answer: 0
      },

      {
        q: 'Who did Andrew bring to Jesus?',

        options: [
          'John',
          'Simon',
          'Philip'
        ],

        answer: 1
      }

    ]

  },


  {
    id: 'john1-43-51',

    title: 'John 1:43–51',

    start: 43,
    end: 51,

    words: [

      ['follow', '跟随', 'to go after'],

      ['Nazareth', '拿撒勒', 'Nazareth'],

      ['Nathanael', '拿但业', 'Nathanael'],

      ['fig', '无花果', 'fig'],

      ['heaven', '天', 'heaven'],

      ['angels', '天使', 'angels']

    ],

    structures: [

      [
        'Follow me.',
        'Imperative'
      ],

      [
        'Can anything good come out of Nazareth?',
        'Can + subject + verb + ...?'
      ],

      [
        'You will see heaven opened.',
        'Subject + will + verb + object'
      ]

    ],

    questions: [

      {
        q: 'Who said, “Follow me”?',

        options: [
          'Jesus',
          'Nathanael',
          'Moses'
        ],

        answer: 0
      },

      {
        q: 'What did Jesus say Nathanael would see?',

        options: [
          'The temple',
          'Heaven opened',
          'The Jordan'
        ],

        answer: 1
      }

    ]

  }

];


/* =========================================================
   STATE
========================================================= */

let currentUnit = UNITS[0];

let quizAnswers = {};

let quizScore = 0;

let productionScore = 0;


/* =========================================================
   NAVIGATION
========================================================= */

function showScreen(id) {

  document
    .querySelectorAll('.screen')
    .forEach(function(screen) {

      screen.classList.remove('active');

    });


  const target =
    document.getElementById(id);


  if (!target) return;


  target.classList.add('active');


  const order = [

    'home',
    'read',
    'vocabulary',
    'structure',
    'understand',
    'produce',
    'review',
    'done'

  ];


  let index =
    order.indexOf(id);


  if (index < 0) index = 0;


  document.getElementById(
    'progressFill'
  ).style.width =
    ((index / 7) * 100) + '%';


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });


  if (id === 'review') {

    renderReview();

  }

}


/* =========================================================
   START
========================================================= */

function openToday() {

  const saved =
    localStorage.getItem(
      'EBRM_CURRENT_UNIT'
    );


  if (saved) {

    const found =
      UNITS.find(function(unit) {

        return unit.id === saved;

      });


    if (found) {

      currentUnit = found;

    }

  }


  startUnit();

}


function startUnit() {

  quizAnswers = {};

  quizScore = 0;

  productionScore = 0;


  document.getElementById(
    'readTitle'
  ).textContent =
    currentUnit.title;


  document.getElementById(
    'productionAnswer'
  ).value = '';


  document.getElementById(
    'productionResult'
  ).classList.remove('show');


  renderVocabulary();

  renderStructures();

  renderQuestions();

  loadPassage();

  showScreen('read');

}


/* =========================================================
   UNITS
========================================================= */

function renderUnits() {

  const box =
    document.getElementById(
      'unitGrid'
    );


  box.innerHTML = '';


  UNITS.forEach(function(unit) {

    const button =
      document.createElement('button');


    button.className =
      'unit-button';


    if (getTraining(unit.id)) {

      button.classList.add('done');

    }


    button.textContent =
      unit.start +
      '–' +
      unit.end;


    button.onclick =
      function() {

        currentUnit = unit;

        localStorage.setItem(
          'EBRM_CURRENT_UNIT',
          unit.id
        );

        startUnit();

      };


    box.appendChild(button);

  });


  updateChapterProgress();

}


function updateChapterProgress() {

  const completed =
    UNITS.filter(function(unit) {

      return !!getTraining(unit.id);

    }).length;


  const total =
    UNITS.length;


  document.getElementById(
    'chapterProgress'
  ).innerHTML = `

    <b>
      ${completed} / ${total}
    </b>

    <span class="muted">
      个训练单元完成
    </span>

  `;

}


/* =========================================================
   PASSAGE
========================================================= */

async function loadPassage() {

  const box =
    document.getElementById(
      'passageText'
    );


  const audio =
    document.getElementById(
      'audioBox'
    );


  box.textContent =
    '正在读取 ESV……';


  audio.innerHTML =
    '正在准备 ESV Audio……';


  const query =
    `John 1:${currentUnit.start}-${currentUnit.end}`;


  if (
    !CONFIG.WORKER_URL ||
    CONFIG.WORKER_URL.includes('YOUR-WORKER')
  ) {

    box.innerHTML = `

      <b>还没有配置 Cloudflare Worker。</b>

      <p class="muted">
        请打开 app.js，
        修改 CONFIG.WORKER_URL。
      </p>

    `;

    return;

  }


  try {

    const response =
      await fetch(
        CONFIG.WORKER_URL +
        '/passage?q=' +
        encodeURIComponent(query)
      );


    const data =
      await response.json();


    if (
      !data.passages ||
      !data.passages.length
    ) {

      throw new Error(
        'No passage returned'
      );

    }


    box.innerHTML =
      renderPassage(
        data.passages[0]
      );


    loadAudio(query);


  } catch(error) {

    console.error(error);


    box.innerHTML = `

      <b>经文读取失败</b>

      <p class="muted">
        请检查 Worker 地址、
        ESV API Key 和网络连接。
      </p>

    `;

  }

}


/* =========================================================
   PASSAGE RENDER
========================================================= */

function renderPassage(text) {

  let html =
    escapeHtml(text);


  html =
    html.replace(
      /\[(\d+)\]/g,
      '<span class="verse-number">$1</span>'
    );


  const dictionary =
    getDictionary();


  html =
    html.replace(
      /\b[A-Za-z]+(?:['’][A-Za-z]+)?\b/g,
      function(word) {

        const key =
          word
            .toLowerCase()
            .replace(/['’]/g, '');


        if (
          dictionary[key]
        ) {

          return `

            <button
              class="click-word"
              onclick="showWord('${escapeAttribute(key)}')">

              ${word}

            </button>

          `;

        }


        return word;

      }
    );


  html =
    html.replace(
      /\n/g,
      '<br>'
    );


  return html;

}


/* =========================================================
   AUDIO
========================================================= */

async function loadAudio(query) {

  const box =
    document.getElementById(
      'audioBox'
    );


  try {

    const response =
      await fetch(
        CONFIG.WORKER_URL +
        '/audio?q=' +
        encodeURIComponent(query)
      );


    if (!response.ok) {

      throw new Error(
        'Audio request failed'
      );

    }


    const audioUrl =
      CONFIG.WORKER_URL +
      '/audio?q=' +
      encodeURIComponent(query);


    box.innerHTML = `

      <audio
        class="audio-player"
        controls
        preload="none"
        src="${audioUrl}">
      </audio>

    `;

  } catch(error) {

    console.error(error);

    box.innerHTML = `

      <div class="notice">
        ESV Audio 暂时无法加载。
      </div>

    `;

  }

}


/* =========================================================
   DICTIONARY
========================================================= */

function getDictionary() {

  const dictionary = {};


  UNITS.forEach(function(unit) {

    unit.words.forEach(function(item) {

      const key =
        item[0]
          .toLowerCase()
          .replace(/['’]/g, '');


      dictionary[key] = {

        word: item[0],

        chinese: item[1],

        english: item[2]

      };

    });

  });


  return dictionary;

}


/* =========================================================
   WORD POPUP
========================================================= */

function showWord(key) {

  const dictionary =
    getDictionary();


  const item =
    dictionary[key];


  if (!item) return;


  document.getElementById(
    'popupWord'
  ).textContent =
    item.word;


  document.getElementById(
    'popupChinese'
  ).textContent =
    item.chinese;


  document.getElementById(
    'popupEnglish'
  ).textContent =
    item.english;


  document.getElementById(
    'wordPopup'
  ).classList.add('show');

}


function closeWord() {

  document.getElementById(
    'wordPopup'
  ).classList.remove('show');

}


/* =========================================================
   VOCABULARY
========================================================= */

function renderVocabulary() {

  const box =
    document.getElementById(
      'vocabularyList'
    );


  box.innerHTML = '';


  currentUnit.words.forEach(function(item) {

    const div =
      document.createElement('div');


    div.className =
      'card';


    div.innerHTML = `

      <b>
        ${item[0]}
      </b>

      <span class="muted">
        · ${item[1]}
      </span>

      <p class="muted">
        ${item[2]}
      </p>

    `;


    box.appendChild(div);

  });

}


/* =========================================================
   STRUCTURE
========================================================= */

function renderStructures() {

  const box =
    document.getElementById(
      'structureList'
    );


  box.innerHTML = '';


  currentUnit.structures.forEach(function(item) {

    const div =
      document.createElement('div');


    div.className =
      'structure-card';


    div.innerHTML = `

      <div class="structure-en">
        ${item[0]}
      </div>

      <div class="structure-pattern">
        ${item[1]}
      </div>

    `;


    box.appendChild(div);

  });

}


/* =========================================================
   QUESTIONS
========================================================= */

function renderQuestions() {

  const box =
    document.getElementById(
      'questionList'
    );


  box.innerHTML = '';


  currentUnit.questions.forEach(
    function(question, index) {

      const div =
        document.createElement('div');


      div.className =
        'question';


      let html = `

        <b>
          ${index + 1}.
          ${question.q}
        </b>

      `;


      question.options.forEach(
        function(option, optionIndex) {

          html += `

            <button
              class="choice"
              onclick="
                answerQuestion(
                  ${index},
                  ${optionIndex},
                  this
                )
              ">

              ${option}

            </button>

          `;

        }
      );


      html += `

        <div
          id="feedback-${index}"
          class="feedback">
        </div>

      `;


      div.innerHTML =
        html;


      box.appendChild(div);

    }
  );


  updateQuizScore();

}


/* =========================================================
   QUIZ
========================================================= */

function answerQuestion(
  questionIndex,
  selected,
  button
) {

  if (
    quizAnswers[questionIndex] !== undefined
  ) {

    return;

  }


  const question =
    currentUnit.questions[
      questionIndex
    ];


  quizAnswers[
    questionIndex
  ] = selected;


  const buttons =
    button.parentElement
      .querySelectorAll('.choice');


  buttons.forEach(function(btn, index) {

    if (
      index === question.answer
    ) {

      btn.classList.add(
        'correct'
      );

    }

    btn.disabled = true;

  });


  if (
    selected === question.answer
  ) {

    quizScore++;


    showFeedback(
      questionIndex,
      '✓ 正确'
    );

  } else {

    button.classList.add(
      'wrong'
    );


    showFeedback(
      questionIndex,
      '✗ 再读一次经文。'
    );

  }


  updateQuizScore();

}


function showFeedback(
  index,
  message
) {

  const el =
    document.getElementById(
      'feedback-' + index
    );


  el.textContent =
    message;


  el.classList.add(
    'show'
  );

}


function updateQuizScore() {

  document.getElementById(
    'quizScore'
  ).textContent =

    quizScore +
    ' / ' +
    currentUnit.questions.length;

}


/* =========================================================
   PRODUCTION
========================================================= */

function scoreProduction() {

  const input =
    document.getElementById(
      'productionAnswer'
    );


  const text =
    input.value
      .trim()
      .toLowerCase();


  if (!text) {

    alert(
      '请先写一句英文。'
    );

    return;

  }


  const keywords = [

    'word',
    'god',
    'life',
    'light',
    'darkness',
    'jesus',
    'christ'

  ];


  let matched = 0;


  keywords.forEach(function(word) {

    if (
      text.includes(word)
    ) {

      matched++;

    }

  });


  const wordCount =
    text.split(/\s+/).filter(Boolean).length;


  let score = 0;


  score +=
    Math.min(
      matched * 1.2,
      6
    );


  if (
    wordCount >= 8
  ) {

    score += 2;

  } else if (
    wordCount >= 4
  ) {

    score += 1;

  }


  if (
    text.includes('because') ||
    text.includes('that') ||
    text.includes('and')
  ) {

    score += 1;

  }


  score =
    Math.min(
      10,
      Math.round(score)
    );


  productionScore =
    score;


  const result =
    document.getElementById(
      'productionResult'
    );


  result.innerHTML = `

    <div class="big-score">
      ${score}/10
    </div>

    <p>
      关键词：
      ${matched}/${keywords.length}
    </p>

    <p>
      单词数：
      ${wordCount}
    </p>

    <p>
      ${productionComment(score)}
    </p>

  `;


  result.classList.add(
    'show'
  );

}


function productionComment(score) {

  if (score >= 9) {

    return '很好。你已经能够用英文表达经文核心。';

  }


  if (score >= 7) {

    return '不错。继续尝试减少中文翻译依赖。';

  }


  if (score >= 5) {

    return '已经开始建立英文直接理解能力。';

  }


  return '回到经文，再尝试用英文表达。';

}


/* =========================================================
   STORAGE
========================================================= */

function getTraining(id) {

  const data =
    localStorage.getItem(
      'EBRM_TRAIN_' + id
    );


  if (!data) return null;


  try {

    return JSON.parse(data);

  } catch(error) {

    return null;

  }

}


/* =========================================================
   FINISH
========================================================= */

function finishTraining() {

  const record = {

    unitId:
      currentUnit.id,

    title:
      currentUnit.title,

    completedAt:
      new Date().toISOString(),

    quizScore:
      quizScore,

    quizTotal:
      currentUnit.questions.length,

    productionScore:
      productionScore

  };


  localStorage.setItem(

    'EBRM_TRAIN_' +
    currentUnit.id,

    JSON.stringify(record)

  );


  localStorage.setItem(
    'EBRM_CURRENT_UNIT',
    currentUnit.id
  );


  document.getElementById(
    'doneMessage'
  ).textContent =

    currentUnit.title +
    ' 已完成。';


  renderUnits();

  showScreen('done');

}


/* =========================================================
   REVIEW
========================================================= */

function reviewDate(
  completedAt,
  days
) {

  const date =
    new Date(completedAt);


  date.setDate(
    date.getDate() + days
  );


  return date;

}


function isDue(
  completedAt,
  days
) {

  return new Date() >=
    reviewDate(
      completedAt,
      days
    );

}


function renderReview() {

  const box =
    document.getElementById(
      'reviewList'
    );


  box.innerHTML = '';


  let found = false;


  UNITS.forEach(function(unit) {

    const record =
      getTraining(unit.id);


    if (!record) return;


    found = true;


    [1, 3, 7].forEach(function(days) {

      const due =
        isDue(
          record.completedAt,
          days
        );


      const date =
        reviewDate(
          record.completedAt,
          days
        );


      const div =
        document.createElement('div');


      div.className =
        'review-item';


      div.innerHTML = `

        <div>

          <b>
            ${unit.title}
          </b>

          <br>

          <span
            class="${
              due
                ? 'review-due'
                : 'review-ok'
            }">

            Day ${days}
            ·
            ${
              due
                ? '需要复习'
                : '尚未到期'
            }

          </span>

        </div>


        <button
          onclick="
            startReview('${unit.id}')
          ">

          复习

        </button>

      `;


      box.appendChild(div);

    });

  });


  if (!found) {

    box.innerHTML = `

      <div class="card">

        <b>
          暂无复习记录
        </b>

        <p class="muted">
          完成训练后，
          Day 1 / Day 3 / Day 7
          会自动进入复习系统。
        </p>

      </div>

    `;

  }

}


function startReview(id) {

  const unit =
    UNITS.find(function(item) {

      return item.id === id;

    });


  if (!unit) return;


  currentUnit =
    unit;


  startUnit();

}


/* =========================================================
   UTILS
========================================================= */

function escapeHtml(text) {

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


function escapeAttribute(text) {

  return text.replace(
    /'/g,
    "\\'"
  );

}


/* =========================================================
   INIT
========================================================= */

function init() {

  renderUnits();

  renderReview();

}


init();
