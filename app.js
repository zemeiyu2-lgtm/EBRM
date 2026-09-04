/* =========================================================
   EBRM V0.3
   English Bible Reading Model
   John 1
   GitHub Pages Independent Version
========================================================= */

const CONFIG = {
  BIBLE_API: 'https://bible-api.com'
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
    ],

    context:
      'John begins his Gospel by presenting the Word in relation to God, creation, life, and light.',

    production:
      'In 2–3 English sentences, explain who the Word is and what is in the Word.'
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
    ],

    context:
      'John the Baptist is introduced as a witness. The passage contrasts the true light with the response of the world and those who receive him.',

    production:
      'Explain in English why John came and what happens to those who receive the Word.'
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
    ],

    context:
      'John 1:14 is central to the Gospel: the Word became flesh and lived among humanity. The passage connects Jesus with glory, grace, and truth.',

    production:
      'Write 2–3 English sentences about what the Word became and what people saw in him.'
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
    ],

    context:
      'Religious leaders question John about his identity. John points away from himself and toward the one who is coming after him.',

    production:
      'Explain in English who John said he was not and what he did with water.'
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
    ],

    context:
      'John identifies Jesus as the Lamb of God and testifies that the Spirit remained upon him.',

    production:
      'Explain in English who Jesus is according to John and what the Spirit did.'
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
    ],

    context:
      'The first disciples begin following Jesus. Andrew brings Simon to Jesus after discovering the Messiah.',

    production:
      'Describe in English how the first disciples began to follow Jesus.'
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
    ],

    context:
      'Jesus calls Philip and Nathanael. The section ends with Jesus presenting himself as the Son of Man.',

    production:
      'Explain in English what Jesus promised Nathanael would see.'
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


  const progress =
    document.getElementById('progressFill');


  if (progress) {

    progress.style.width =
      ((index / (order.length - 1)) * 100) + '%';

  }


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
    localStorage.getItem('EBRM_CURRENT_UNIT');


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


  const title =
    document.getElementById('readTitle');

  if (title) {
    title.textContent =
      currentUnit.title;
  }


  const answer =
    document.getElementById('productionAnswer');

  if (answer) {
    answer.value = '';
  }


  const result =
    document.getElementById('productionResult');

  if (result) {
    result.classList.remove('show');
    result.innerHTML = '';
  }


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
    document.getElementById('unitGrid');


  if (!box) return;


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
      unit.title.replace('John ', '');


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


  const box =
    document.getElementById('chapterProgress');


  if (!box) return;


  box.innerHTML = `
    <b>${completed} / ${total}</b>
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
    document.getElementById('passageText');


  const audio =
    document.getElementById('audioBox');


  if (!box) return;


  box.innerHTML = `
    <div class="notice">
      正在读取英文圣经……
    </div>
  `;


  if (audio) {

    audio.innerHTML = `
      <div class="muted">
        本版本暂未连接圣经音频。
      </div>
    `;

  }


  const reference =
    `John ${currentUnit.start}:${currentUnit.end}`;


  const url =
    CONFIG.BIBLE_API +
    '/' +
    encodeURIComponent(reference) +
    '?translation=web';


  try {

    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        'Bible API HTTP ' +
        response.status
      );

    }


    const data =
      await response.json();


    if (
      !data.text ||
      !data.text.trim()
    ) {

      throw new Error(
        '没有返回经文内容'
      );

    }


    box.innerHTML =
      renderPassage(data.text);


    const version =
      document.createElement('div');


    version.className =
      'muted passage-version';


    version.textContent =
      'World English Bible (WEB)';


    box.appendChild(version);


  } catch(error) {

    console.error(
      'Bible API Error:',
      error
    );


    box.innerHTML = `

      <div class="notice">

        <b>
          经文读取失败
        </b>

        <p class="muted">
          ${escapeHtml(error.message)}
        </p>

        <p class="muted">
          请检查网络连接，然后重新打开本训练单元。
        </p>

      </div>

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
      /\n/g,
      '<br>'
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


  return html;

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


  const word =
    document.getElementById('popupWord');

  const chinese =
    document.getElementById('popupChinese');

  const english =
    document.getElementById('popupEnglish');

  const popup =
    document.getElementById('wordPopup');


  if (word) {
    word.textContent =
      item.word;
  }

  if (chinese) {
    chinese.textContent =
      item.chinese;
  }

  if (english) {
    english.textContent =
      item.english;
  }

  if (popup) {
    popup.classList.add('show');
  }

}


function closeWord() {

  const popup =
    document.getElementById('wordPopup');


  if (popup) {
    popup.classList.remove('show');
  }

}


/* =========================================================
   VOCABULARY
========================================================= */

function renderVocabulary() {

  const box =
    document.getElementById('vocabularyList');


  if (!box) return;


  box.innerHTML = '';


  currentUnit.words.forEach(function(item) {

    const div =
      document.createElement('div');


    div.className =
      'card';


    div.innerHTML = `
      <b>${escapeHtml(item[0])}</b>

      <span class="muted">
        · ${escapeHtml(item[1])}
      </span>

      <p class="muted">
        ${escapeHtml(item[2])}
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
    document.getElementById('structureList');


  if (!box) return;


  box.innerHTML = '';


  currentUnit.structures.forEach(function(item) {

    const div =
      document.createElement('div');


    div.className =
      'structure-card';


    div.innerHTML = `
      <div class="structure-en">
        ${escapeHtml(item[0])}
      </div>

      <div class="structure-pattern">
        ${escapeHtml(item[1])}
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
    document.getElementById('questionList');


  if (!box) return;


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
          ${escapeHtml(question.q)}
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
              ${escapeHtml(option)}
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
    currentUnit.questions[questionIndex];


  quizAnswers[questionIndex] =
    selected;


  const buttons =
    button.parentElement
      .querySelectorAll('.choice');


  buttons.forEach(function(btn, index) {

    if (
      index === question.answer
    ) {

      btn.classList.add('correct');

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

    button.classList.add('wrong');


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


  if (!el) return;


  el.textContent =
    message;


  el.classList.add('show');

}


function updateQuizScore() {

  const box =
    document.getElementById('quizScore');


  if (!box) return;


  box.textContent =
    quizScore +
    ' / ' +
    currentUnit.questions.length;

}


/* =========================================================
   UNDERSTAND
========================================================= */

function renderContext() {

  const box =
    document.getElementById('contextText');


  if (!box) return;


  box.innerHTML = `
    <div class="card">
      ${escapeHtml(currentUnit.context || '')}
    </div>
  `;

}


/* =========================================================
   PRODUCTION
========================================================= */

function scoreProduction() {

  const input =
    document.getElementById(
      'productionAnswer'
    );


  if (!input) return;


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
    'christ',
    'john',
    'spirit',
    'lamb',
    'messiah'
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
    text
      .split(/\s+/)
      .filter(Boolean)
      .length;


  let score = 0;


  score +=
    Math.min(
      matched * 1.2,
      6
    );


  if (
    wordCount >= 12
  ) {

    score += 2;

  } else if (
    wordCount >= 6
  ) {

    score += 1;

  }


  if (
    text.includes('because') ||
    text.includes('that') ||
    text.includes('and') ||
    text.includes('who')
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


  if (!result) return;


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
    'EBRM_TRAIN_' + currentUnit.id,
    JSON.stringify(record)
  );


  localStorage.setItem(
    'EBRM_CURRENT_UNIT',
    currentUnit.id
  );


  const message =
    document.getElementById(
      'doneMessage'
    );


  if (message) {

    message.textContent =
      currentUnit.title +
      ' 已完成。';

  }


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


  if (!box) return;


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
            ${escapeHtml(unit.title)}
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
            startReview('${escapeAttribute(unit.id)}')
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

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


function escapeAttribute(text) {

  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");

}


/* =========================================================
   INIT
========================================================= */

function init() {

  renderUnits();

  renderReview();

}


init();
