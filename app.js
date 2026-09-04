/* =====================================================
   EBRM V0.5
   English Bible Reading Model

   GitHub Pages 独立版

   V0.5 新增：
   1. Bible API
   2. 经文阅读
   3. 浏览器英文朗读
   4. 单节朗读
   5. 单词发音
   6. 句型朗读
   7. 正常 / 慢速
   8. 理解测试
   9. 英文输出
   10. Day 1 / Day 3 / Day 7 复习
   11. 逐节自动播放
   12. 当前经文高亮
   13. 上一句 / 下一句
   14. 单节循环跟读
   15. 自动连续听读
   16. 跟读状态提示
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const CONFIG = {

  BIBLE_API:
    "https://bible-api.com",

  TRANSLATION:
    "web",

  SPEECH_LANG:
    "en-US",

  STORAGE_KEY:
    "EBRM_V05_STATE"

};


/* =====================================================
   JOHN 1 TRAINING UNITS
===================================================== */

const UNITS = [

  {
    id: "j1-01",
    start: 1,
    end: 5,
    title: "道与生命之光",
    ref: "John 1:1–5",

    vocab: [
      ["Word", "BV", "圣经核心词汇"],
      ["beginning", "BV", "起初、开始"],
      ["life", "BT", "生命"],
      ["light", "BT", "光"],
      ["darkness", "BT", "黑暗"],
      ["overcome", "BT", "胜过、制伏"]
    ],

    structures: [
      [
        "In the beginning...",
        "时间背景短语：把读者带回创造与起初。"
      ],
      [
        "the Word was...",
        "be 动词结构表达持续存在的状态。"
      ],
      [
        "All things were made through him",
        "被动结构 + through，强调创造的媒介。"
      ]
    ],

    questions: [
      [
        "Q1",
        "According to the passage, who was in the beginning with God?",
        ["The Word", "John the Baptist", "Moses"],
        0
      ],
      [
        "Q2",
        "What does the passage say about life?",
        ["It was hidden", "It was in him", "It was created later"],
        1
      ],
      [
        "Q3",
        "What does the light do in the darkness?",
        ["It disappears", "It overcomes it", "It creates darkness"],
        1
      ]
    ],

    context:
      "John opens his Gospel with a theological prologue. The passage presents the Word in relation to God, creation, life, and light before the narrative introduces Jesus' earthly ministry.",

    production:
      "In simple English, explain the relationship between the Word, life, and light in this passage."
  },


  {
    id: "j1-02",
    start: 6,
    end: 13,
    title: "光来到世界",
    ref: "John 1:6–13",

    vocab: [
      ["witness", "BV", "见证人"],
      ["believe", "BV", "相信"],
      ["true", "BT", "真实的"],
      ["receive", "BV", "领受"],
      ["children of God", "BT", "神的儿女"]
    ],

    structures: [
      [
        "There was a man sent from God",
        "there was + 名词 + 过去分词，介绍一个被差遣的人。"
      ],
      [
        "to bear witness about the light",
        "to + 动词表示目的。"
      ],
      [
        "gave the right to become children of God",
        "give + 人 + 名词，表达赐予身份/权利。"
      ]
    ],

    questions: [
      [
        "Q1",
        "What was John's role?",
        ["To create the light", "To bear witness", "To replace the Word"],
        1
      ],
      [
        "Q2",
        "Who can become children of God?",
        ["Those who receive and believe", "Only rulers", "Only angels"],
        0
      ],
      [
        "Q3",
        "How does the passage describe the world's response?",
        ["Everyone understood", "The world did not recognize him", "No one saw the light"],
        1
      ]
    ],

    context:
      "The prologue moves from who the Word is to how the light enters the human world. John the Baptist is introduced as a witness, while belief and receiving the Word become central responses.",

    production:
      "Write one or two simple English sentences about what it means to receive the light."
  },


  {
    id: "j1-03",
    start: 14,
    end: 18,
    title: "道成了肉身",
    ref: "John 1:14–18",

    vocab: [
      ["dwelt", "BT", "居住、住在"],
      ["glory", "BT", "荣耀"],
      ["grace", "BT", "恩典"],
      ["truth", "BT", "真理"],
      ["only Son", "BT", "独生子/唯一的子"]
    ],

    structures: [
      [
        "The Word became flesh",
        "become + 名词，表达真实进入人的状态。"
      ],
      [
        "we have seen his glory",
        "现在完成时，强调已经看见并仍具有见证意义。"
      ],
      [
        "full of grace and truth",
        "形容词短语作补充说明。"
      ]
    ],

    questions: [
      [
        "Q1",
        "What did the Word become?",
        ["Flesh", "An angel", "A prophet"],
        0
      ],
      [
        "Q2",
        "What was the Word full of?",
        ["Power and wealth", "Grace and truth", "Fear and judgment"],
        1
      ],
      [
        "Q3",
        "What have the witnesses seen?",
        ["His glory", "His childhood", "The temple only"],
        0
      ]
    ],

    context:
      "John 1:14 is a central statement about the incarnation. The eternal Word is presented as truly entering human existence, and the witnesses speak of glory, grace, and truth.",

    production:
      "In simple English, say why John 1:14 is important for understanding Jesus."
  },


  {
    id: "j1-04",
    start: 19,
    end: 28,
    title: "约翰的见证",
    ref: "John 1:19–28",

    vocab: [
      ["confess", "BV", "承认、承认身份"],
      ["Christ", "BT", "基督"],
      ["prophet", "BV", "先知"],
      ["voice", "BV", "声音"],
      ["make straight", "BS", "修直、预备"]
    ],

    structures: [
      [
        "Who are you?",
        "疑问句直接推动身份辨认。"
      ],
      [
        "I am not the Christ",
        "否定结构，强调约翰不是基督。"
      ],
      [
        "I am the voice of one crying out",
        "I am + 名词，定义身份与使命。"
      ]
    ],

    questions: [
      [
        "Q1",
        "What did John say he was not?",
        ["The Christ", "A witness", "A voice"],
        0
      ],
      [
        "Q2",
        "What did John call himself?",
        ["The king", "A voice", "The light"],
        1
      ],
      [
        "Q3",
        "What was John's ministry connected with?",
        ["Preparing the way", "Building a palace", "Writing laws"],
        0
      ]
    ],

    context:
      "The religious leaders question John about his identity. John consistently redirects attention away from himself toward the one whose coming he announces.",

    production:
      "Complete this idea in English: John did not point people to himself; he pointed them to ____."
  },


  {
    id: "j1-05",
    start: 29,
    end: 34,
    title: "看见神的羔羊",
    ref: "John 1:29–34",

    vocab: [
      ["Lamb of God", "BT", "神的羔羊"],
      ["take away", "BV", "除去"],
      ["sin", "BT", "罪"],
      ["Spirit", "BT", "圣灵"],
      ["remain", "BV", "停留、常住"]
    ],

    structures: [
      [
        "Behold, the Lamb of God",
        "behold 是引导注意的表达。"
      ],
      [
        "who takes away the sin of the world",
        "who 引导关系从句，说明羔羊的工作。"
      ],
      [
        "I saw the Spirit descend and remain",
        "过去时叙述见证，多个动作形成见证链。"
      ]
    ],

    questions: [
      [
        "Q1",
        "What title does John give Jesus?",
        ["Lamb of God", "King of Rome", "Son of Joseph"],
        0
      ],
      [
        "Q2",
        "What does the Lamb of God take away?",
        ["The temple", "The sin of the world", "The law"],
        1
      ],
      [
        "Q3",
        "What did John see remain on Jesus?",
        ["The Spirit", "A crown", "A book"],
        0
      ]
    ],

    context:
      "John's witness now identifies Jesus directly. The title 'Lamb of God' connects Jesus with God's saving work, while the descent and remaining of the Spirit authenticate his identity.",

    production:
      "In simple English, explain what John says Jesus came to do."
  },


  {
    id: "j1-06",
    start: 35,
    end: 42,
    title: "来，看耶稣",
    ref: "John 1:35–42",

    vocab: [
      ["follow", "BV", "跟随"],
      ["Rabbi", "BV", "拉比、老师"],
      ["Messiah", "BT", "弥赛亚"],
      ["stay", "BV", "住、停留"],
      ["found", "BV", "找到"]
    ],

    structures: [
      [
        "What are you seeking?",
        "现在进行时疑问，直接询问人的寻找。"
      ],
      [
        "Come and you will see",
        "祈使句 + and + 结果，邀请进入经历。"
      ],
      [
        "We have found the Messiah",
        "现在完成时表达发现已经发生且具有当前意义。"
      ]
    ],

    questions: [
      [
        "Q1",
        "What did the disciples do after hearing John?",
        ["They followed Jesus", "They left immediately", "They argued"],
        0
      ],
      [
        "Q2",
        "What invitation did Jesus give?",
        ["Come and you will see", "Go and hide", "Write a book"],
        0
      ],
      [
        "Q3",
        "What did Andrew say they had found?",
        ["The prophet", "The Messiah", "The temple"],
        1
      ]
    ],

    context:
      "The focus shifts from public testimony to personal following. The disciples hear testimony, approach Jesus, spend time with him, and begin inviting others.",

    production:
      "Write one simple sentence about what it means to follow Jesus."
  },


  {
    id: "j1-07",
    start: 43,
    end: 51,
    title: "跟随我",
    ref: "John 1:43–51",

    vocab: [
      ["follow me", "BV", "跟从我"],
      ["Nazareth", "BV", "拿撒勒"],
      ["true Israelite", "BT", "真以色列人"],
      ["heaven", "BT", "天"],
      ["Son of Man", "BT", "人子"]
    ],

    structures: [
      [
        "Follow me",
        "最简洁的命令式呼召。"
      ],
      [
        "Can anything good come out of Nazareth?",
        "Can + 主语 + 动词，表达质疑可能性。"
      ],
      [
        "You will see heaven opened",
        "will + 动词，表达将要经历的启示。"
      ]
    ],

    questions: [
      [
        "Q1",
        "What did Jesus say to Philip?",
        ["Follow me", "Stay here", "Go home"],
        0
      ],
      [
        "Q2",
        "Where was Jesus from?",
        ["Nazareth", "Bethlehem", "Rome"],
        0
      ],
      [
        "Q3",
        "What did Jesus promise Nathanael would see?",
        ["Heaven opened", "The Roman army", "A new temple"],
        0
      ]
    ],

    context:
      "Jesus personally calls Philip, who then brings Nathanael. The passage closes with Jesus revealing a larger horizon: heaven opened and the Son of Man as the meeting point between heaven and earth.",

    production:
      "In simple English, describe the movement: Jesus calls → a person follows → the person brings another person."
  }

];


/* =====================================================
   STATE
===================================================== */

let currentUnit = null;

let currentPassage = [];

let currentVerseIndex = -1;

let slow = false;

let autoPlay = false;

let repeatMode = false;

let speechGeneration = 0;


let state =
  JSON.parse(
    localStorage.getItem(CONFIG.STORAGE_KEY)
    ||
    '{"completed":{},"reviews":[]}'
  );


/* =====================================================
   BASIC HELPERS
===================================================== */

function $(id) {

  return document.getElementById(id);

}


function save() {

  localStorage.setItem(
    CONFIG.STORAGE_KEY,
    JSON.stringify(state)
  );

}


function esc(value) {

  return String(value ?? "")
    .replace(/[&<>"']/g, function (m) {

      return {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

      }[m];

    });

}


/* =====================================================
   INIT
===================================================== */

function init() {

  injectV05Styles();

  renderUnits();

  renderReviews();

  if (
    "speechSynthesis" in window
  ) {

    speechSynthesis.getVoices();

    if (
      typeof speechSynthesis.onvoiceschanged !==
      "undefined"
    ) {

      speechSynthesis.onvoiceschanged =
        function () {

          speechSynthesis.getVoices();

        };

    }

  }

}


/* =====================================================
   V0.5 STYLE
   不需要修改 style.css
===================================================== */

function injectV05Styles() {

  if (
    document.getElementById("ebrm-v05-style")
  ) {

    return;

  }


  const style =
    document.createElement("style");

  style.id =
    "ebrm-v05-style";


  style.textContent = `

    .verse {
      display: block;
      cursor: pointer;
      padding: 8px 6px;
      margin: 2px 0;
      border-radius: 8px;
      transition: all .2s ease;
    }

    .verse:hover {
      background: rgba(0,0,0,.04);
    }

    .verse.active-verse {
      background: rgba(180,150,90,.16);
      box-shadow: inset 3px 0 0 rgba(120,90,40,.65);
    }

    .verse-num {
      display: inline-block;
      min-width: 26px;
      font-weight: 700;
      opacity: .65;
    }

    .v05-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .v05-controls button {
      min-height: 42px;
    }

    .v05-status {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: rgba(0,0,0,.035);
      font-size: .92rem;
    }

    .v05-current {
      font-weight: 700;
    }

    .sentence-btn.active-sentence {
      border-left: 4px solid #8c6b35;
      background: rgba(180,150,90,.12);
    }

    .repeat-active {
      font-weight: 700;
    }

    .v05-progress {
      height: 5px;
      margin-top: 10px;
      background: rgba(0,0,0,.08);
      border-radius: 10px;
      overflow: hidden;
    }

    .v05-progress-bar {
      height: 100%;
      width: 0%;
      background: currentColor;
      transition: width .25s ease;
    }

    .v05-small {
      font-size: .84rem;
      opacity: .72;
    }

  `;


  document.head.appendChild(style);

}


/* =====================================================
   UNIT LIST
===================================================== */

function renderUnits() {

  const grid =
    $("unitGrid");

  if (!grid) {

    return;

  }


  grid.innerHTML =

    UNITS.map(function (u, i) {

      return `

        <button
          class="unit ${state.completed[u.id] ? "done" : ""}"
          onclick="openUnit(${i})">

          <div class="unit-num">
            UNIT ${String(i + 1).padStart(2, "0")}
          </div>

          <div class="unit-title">
            ${esc(u.title)}
          </div>

          <div class="unit-ref">
            ${esc(u.ref)}
            ${state.completed[u.id] ? " ✓" : ""}
          </div>

        </button>

      `;

    }).join("");

}


/* =====================================================
   OPEN UNIT
===================================================== */

function openUnit(index) {

  stopSpeech();

  currentUnit =
    UNITS[index];

  currentPassage = [];

  currentVerseIndex = -1;

  autoPlay = false;

  repeatMode = false;


  $("readTitle").textContent =
    currentUnit.title;


  $("readReference").textContent =
    currentUnit.ref;


  $("passageText").textContent =
    "正在读取经文……";


  $("sentenceList").innerHTML =
    "";


  $("productionAnswer").value =
    "";


  $("productionResult").innerHTML =
    "";


  $("quizScore").textContent =
    "";


  $("contextText").textContent =
    currentUnit.context;


  $("productionPrompt").textContent =
    currentUnit.production;


  renderVocabulary();

  renderStructure();

  renderQuestions();

  prepareV05Controls();

  go("read");

  loadPassage();

}


/* =====================================================
   V0.5 READING CONTROLS
===================================================== */

function prepareV05Controls() {

  const passageCard =
    document.querySelector(
      ".passage-card"
    );


  if (!passageCard) {

    return;

  }


  const old =
    document.getElementById(
      "v05ReadingControls"
    );


  if (old) {

    old.remove();

  }


  const controls =
    document.createElement("div");


  controls.id =
    "v05ReadingControls";

  controls.className =
    "v05-controls";


  controls.innerHTML = `

    <button
      onclick="playCurrentVerse()">

      ▶ 当前节

    </button>

    <button
      onclick="playPreviousVerse()">

      ◀ 上一节

    </button>

    <button
      onclick="playNextVerse()">

      下一节 ▶

    </button>

    <button
      onclick="toggleAutoPlay()">

      ▶▶ 自动连续

    </button>

    <button
      onclick="toggleRepeatMode()">

      🔁 单节循环

    </button>

  `;


  const status =
    document.createElement("div");


  status.id =
    "v05SpeechStatus";


  status.className =
    "v05-status";


  status.innerHTML =
    `准备开始听读。`;


  const progress =
    document.createElement("div");


  progress.className =
    "v05-progress";


  progress.innerHTML = `

    <div
      id="v05ProgressBar"
      class="v05-progress-bar">
    </div>

  `;


  passageCard.appendChild(
    controls
  );

  passageCard.appendChild(
    status
  );

  passageCard.appendChild(
    progress
  );

}


/* =====================================================
   LOAD BIBLE PASSAGE
===================================================== */

async function loadPassage() {

  try {

    const reference =
      `John ${currentUnit.start}:${currentUnit.end}`;


    const url =
      `${CONFIG.BIBLE_API}/` +
      `${encodeURIComponent(reference)}` +
      `?translation=${CONFIG.TRANSLATION}`;


    const response =
      await fetch(
        url,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "HTTP " + response.status
      );

    }


    const data =
      await response.json();


    currentPassage =
      (data.verses || [])
        .map(function (verse) {

          return {

            n: verse.verse,

            text:
              verse.text.trim()

          };

        });


    if (!currentPassage.length) {

      throw new Error(
        "没有读取到经文"
      );

    }


    renderPassage();

    updateV05Status(
      "经文已准备好。点击「听整段」或「当前节」开始。"
    );

  }

  catch (error) {

    $("passageText").innerHTML = `

      <div class="success">

        经文读取失败：

        ${esc(error.message)}

        <br><br>

        请检查网络后刷新页面。

      </div>

    `;

  }

}


/* =====================================================
   RENDER PASSAGE
===================================================== */

function renderPassage() {

  $("passageText").innerHTML =

    currentPassage
      .map(function (verse, index) {

        return `

          <span
            id="verse-${index}"
            class="verse"
            onclick="playVerse(${index})">

            <span class="verse-num">
              ${verse.n}
            </span>

            ${esc(verse.text)}

          </span>

        `;

      })
      .join("");


  $("sentenceList").innerHTML =

    currentPassage
      .map(function (verse, index) {

        return `

          <button
            id="sentence-${index}"
            class="sentence-btn"
            onclick="playVerse(${index})">

            🔊 听第 ${verse.n} 节

            <span>
              ${esc(verse.text)}
            </span>

          </button>

        `;

      })
      .join("");

}


/* =====================================================
   PLAY VERSE
===================================================== */

function playVerse(index) {

  if (
    !currentPassage.length ||
    !currentPassage[index]
  ) {

    return;

  }


  autoPlay = false;

  repeatMode = false;

  currentVerseIndex = index;

  highlightVerse(index);

  speakVerse(index);

}


/* =====================================================
   SPEAK CURRENT VERSE
===================================================== */

function playCurrentVerse() {

  if (
    currentVerseIndex < 0
  ) {

    currentVerseIndex = 0;

  }


  if (
    currentVerseIndex >=
    currentPassage.length
  ) {

    currentVerseIndex = 0;

  }


  highlightVerse(
    currentVerseIndex
  );


  speakVerse(
    currentVerseIndex
  );

}


/* =====================================================
   PREVIOUS VERSE
===================================================== */

function playPreviousVerse() {

  if (
    !currentPassage.length
  ) {

    return;

  }


  currentVerseIndex =
    Math.max(
      0,
      currentVerseIndex <= 0
        ? 0
        : currentVerseIndex - 1
    );


  autoPlay = false;

  repeatMode = false;


  highlightVerse(
    currentVerseIndex
  );


  speakVerse(
    currentVerseIndex
  );

}


/* =====================================================
   NEXT VERSE
===================================================== */

function playNextVerse() {

  if (
    !currentPassage.length
  ) {

    return;

  }


  if (
    currentVerseIndex <
    currentPassage.length - 1
  ) {

    currentVerseIndex++;

  }
  else {

    currentVerseIndex = 0;

  }


  autoPlay = false;

  repeatMode = false;


  highlightVerse(
    currentVerseIndex
  );


  speakVerse(
    currentVerseIndex
  );

}


/* =====================================================
   AUTO PLAY
===================================================== */

function toggleAutoPlay() {

  if (
    !currentPassage.length
  ) {

    return;

  }


  repeatMode = false;

  autoPlay =
    !autoPlay;


  if (autoPlay) {

    if (
      currentVerseIndex < 0 ||
      currentVerseIndex >=
      currentPassage.length
    ) {

      currentVerseIndex = 0;

    }


    updateV05Status(
      "▶ 自动连续听读中……"
    );


    speakVerse(
      currentVerseIndex
    );

  }
  else {

    stopSpeech();

    updateV05Status(
      "自动连续听读已停止。"
    );

  }

}


/* =====================================================
   REPEAT CURRENT VERSE
===================================================== */

function toggleRepeatMode() {

  if (
    !currentPassage.length
  ) {

    return;

  }


  autoPlay = false;

  repeatMode =
    !repeatMode;


  if (
    currentVerseIndex < 0
  ) {

    currentVerseIndex = 0;

  }


  if (repeatMode) {

    updateV05Status(
      "🔁 单节循环中：听 → 跟读 → 再听。"
    );


    speakVerse(
      currentVerseIndex
    );

  }
  else {

    stopSpeech();

    updateV05Status(
      "单节循环已停止。"
    );

  }

}


/* =====================================================
   SPEAK VERSE ENGINE
===================================================== */

function speakVerse(index) {

  if (
    !currentPassage[index]
  ) {

    return;

  }


  if (
    !("speechSynthesis" in window)
  ) {

    alert(
      "当前浏览器不支持语音播放。"
    );

    return;

  }


  speechGeneration++;

  const generation =
    speechGeneration;


  speechSynthesis.cancel();


  currentVerseIndex =
    index;


  highlightVerse(
    index
  );


  const utterance =
    new SpeechSynthesisUtterance(
      currentPassage[index].text
    );


  utterance.lang =
    CONFIG.SPEECH_LANG;


  utterance.rate =
    slow ? 0.72 : 0.95;


  utterance.pitch =
    1;


  utterance.volume =
    1;


  updateV05Status(

    `正在朗读第 ${currentPassage[index].n} 节 · ` +
    `${slow ? "慢速" : "正常速度"}`

  );


  utterance.onend =
    function () {

      if (
        generation !==
        speechGeneration
      ) {

        return;

      }


      if (repeatMode) {

        setTimeout(
          function () {

            if (
              repeatMode
            ) {

              speakVerse(
                index
              );

            }

          },
          700
        );

        return;

      }


      if (
        autoPlay &&
        index <
        currentPassage.length - 1
      ) {

        setTimeout(
          function () {

            if (
              autoPlay
            ) {

              currentVerseIndex =
                index + 1;

              speakVerse(
                currentVerseIndex
              );

            }

          },
          350
        );

        return;

      }


      if (
        autoPlay &&
        index ===
        currentPassage.length - 1
      ) {

        autoPlay = false;

        updateV05Status(
          "✓ 整段自动听读完成。"
        );

        return;

      }


      updateV05Status(
        `第 ${currentPassage[index].n} 节朗读完成。`
      );

    };


  utterance.onerror =
    function () {

      if (
        generation !==
        speechGeneration
      ) {

        return;

      }


      updateV05Status(
        "语音播放出现问题，请重新点击播放。"
      );

    };


  speechSynthesis.speak(
    utterance
  );

}


/* =====================================================
   HIGHLIGHT VERSE
===================================================== */

function highlightVerse(index) {

  document
    .querySelectorAll(".verse")
    .forEach(function (el) {

      el.classList.remove(
        "active-verse"
      );

    });


  document
    .querySelectorAll(".sentence-btn")
    .forEach(function (el) {

      el.classList.remove(
        "active-sentence"
      );

    });


  const verse =
    $(
      "verse-" + index
    );


  const sentence =
    $(
      "sentence-" + index
    );


  if (verse) {

    verse.classList.add(
      "active-verse"
    );

    verse.scrollIntoView({

      behavior: "smooth",

      block: "center"

    });

  }


  if (sentence) {

    sentence.classList.add(
      "active-sentence"
    );

  }


  updateProgress(
    index
  );

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress(index) {

  const bar =
    $("v05ProgressBar");


  if (
    !bar ||
    !currentPassage.length
  ) {

    return;

  }


  const percent =
    (
      (index + 1) /
      currentPassage.length
    ) * 100;


  bar.style.width =
    percent + "%";

}


/* =====================================================
   STATUS
===================================================== */

function updateV05Status(text) {

  const status =
    $("v05SpeechStatus");


  if (!status) {

    return;

  }


  status.innerHTML = `

    <span class="v05-current">
      ${esc(text)}
    </span>

    <div class="v05-small">
      ${currentPassage.length
        ? `第 ${Math.max(currentVerseIndex + 1, 1)} / ${currentPassage.length} 节`
        : ""}
    </div>

  `;

}


/* =====================================================
   VOCABULARY
===================================================== */

function renderVocabulary() {

  $("vocabularyList").innerHTML =

    currentUnit.vocab
      .map(function (item) {

        return `

          <div class="vocab-item">

            <span class="term">
              ${esc(item[0])}
            </span>

            <span class="type">
              ${esc(item[1])}
            </span>

            <div>
              ${esc(item[2])}
            </div>

            <button
              onclick='speakText(${JSON.stringify(item[0])})'>

              🔊 听发音

            </button>

          </div>

        `;

      })
      .join("");

}


/* =====================================================
   STRUCTURE
===================================================== */

function renderStructure() {

  $("structureList").innerHTML =

    currentUnit.structures
      .map(function (item) {

        return `

          <div class="structure-item">

            <strong>
              ${esc(item[0])}
            </strong>

            <div class="muted">
              ${esc(item[1])}
            </div>

            <button
              onclick='speakText(${JSON.stringify(item[0])})'>

              🔊 听句型

            </button>

          </div>

        `;

      })
      .join("");

}


/* =====================================================
   QUESTIONS
===================================================== */

function renderQuestions() {

  $("questionList").innerHTML =

    currentUnit.questions
      .map(function (q, i) {

        return `

          <div class="question">

            <strong>

              ${esc(q[0])}.
              ${esc(q[1])}

            </strong>

            ${q[2]
              .map(function (option, j) {

                return `

                  <label>

                    <input
                      type="radio"
                      name="q${i}"
                      value="${j}">

                    ${esc(option)}

                  </label>

                `;

              })
              .join("")}

          </div>

        `;

      }).join("") +

      `

        <button
          class="primary"
          onclick="checkQuiz()">

          检查理解

        </button>

      `;

}


/* =====================================================
   QUIZ
===================================================== */

function checkQuiz() {

  let score = 0;


  currentUnit.questions
    .forEach(function (q, i) {

      const answer =
        document.querySelector(
          `input[name="q${i}"]:checked`
        );


      if (
        answer &&
        Number(answer.value) === q[3]
      ) {

        score++;

      }

    });


  $("quizScore").textContent =

    `理解检查：${score}/${currentUnit.questions.length}`;

}


/* =====================================================
   PRODUCTION
===================================================== */

function checkProduction() {

  const text =
    $("productionAnswer")
      .value
      .trim();


  if (!text) {

    $("productionResult").innerHTML = `

      <div class="success">

        请先尝试用英文回答。

      </div>

    `;

    return;

  }


  const words =
    text
      .split(/\s+/)
      .filter(Boolean)
      .length;


  $("productionResult").innerHTML = `

    <div class="success">

      已完成英文输出。

      <br>

      约 ${words} 个英文词。

      <br><br>

      🎤 现在请朗读你的答案，

      然后再听一次经文。

      <br><br>

      <button
        onclick='speakText(${JSON.stringify(text)})'>

        🔊 听我的英文回答

      </button>

    </div>

  `;

}


/* =====================================================
   GENERAL SPEECH
===================================================== */

function speakText(text) {

  if (
    !("speechSynthesis" in window)
  ) {

    alert(
      "当前浏览器不支持语音播放。"
    );

    return;

  }


  speechGeneration++;

  autoPlay = false;

  repeatMode = false;


  speechSynthesis.cancel();


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    CONFIG.SPEECH_LANG;


  utterance.rate =
    slow ? 0.72 : 0.95;


  utterance.pitch =
    1;


  utterance.volume =
    1;


  speechSynthesis.speak(
    utterance
  );

}


/* =====================================================
   WHOLE PASSAGE
===================================================== */

function speakPassage() {

  if (
    !currentPassage.length
  ) {

    return;

  }


  autoPlay = true;

  repeatMode = false;


  if (
    currentVerseIndex < 0 ||
    currentVerseIndex >=
    currentPassage.length
  ) {

    currentVerseIndex = 0;

  }


  updateV05Status(
    "▶ 正在连续朗读整段经文……"
  );


  speakVerse(
    currentVerseIndex
  );

}


/* =====================================================
   STOP
===================================================== */

function stopSpeech() {

  speechGeneration++;

  autoPlay = false;

  repeatMode = false;


  if (
    "speechSynthesis" in window
  ) {

    speechSynthesis.cancel();

  }


  updateV05Status(
    "语音已停止。"
  );

}


/* =====================================================
   NORMAL / SLOW
===================================================== */

function toggleSlow() {

  slow =
    !slow;


  const label =
    $("speedLabel");


  if (label) {

    label.textContent =
      slow ? "慢速" : "正常";

  }


  updateV05Status(

    slow
      ? "已切换为慢速 0.72"
      : "已切换为正常速度 0.95"

  );

}


/* =====================================================
   COMPLETE UNIT
===================================================== */

function finishUnit() {

  if (!currentUnit) {

    return;

  }


  stopSpeech();


  const now =
    new Date();


  state.completed[
    currentUnit.id
  ] = true;


  state.reviews =
    state.reviews.filter(
      function (item) {

        return item.id !==
          currentUnit.id;

      }
    );


  [0, 2, 6]
    .forEach(function (days) {

      const date =
        new Date(now);


      date.setDate(
        date.getDate() + days
      );


      state.reviews.push({

        id:
          currentUnit.id,

        ref:
          currentUnit.ref,

        date:
          date.toISOString()
            .slice(0, 10),

        day:
          days + 1

      });

    });


  save();

  renderUnits();

  renderReviews();


  $("doneMessage").textContent =

    `${currentUnit.ref} 已完成。` +
    `建议在 Day 1、Day 3、Day 7 回来重新听读。`;


  go("done");

}


/* =====================================================
   REVIEW
===================================================== */

function renderReviews() {

  const reviewList =
    $("reviewList");


  if (!reviewList) {

    return;

  }


  const reviews =
    [...state.reviews]
      .sort(function (a, b) {

        return a.date
          .localeCompare(b.date);

      });


  if (!reviews.length) {

    reviewList.innerHTML = `

      <div class="muted">

        完成第一个单元后，

        这里会自动生成复习计划。

      </div>

    `;

    return;

  }


  reviewList.innerHTML =

    reviews
      .map(function (item) {

        return `

          <div class="review-row">

            <div>

              <strong>
                ${esc(item.ref)}
              </strong>

              <div class="review-date">
                Day ${item.day}
              </div>

            </div>

            <span>
              ${esc(item.date)}
            </span>

          </div>

        `;

      })
      .join("");

}


/* =====================================================
   NAVIGATION
===================================================== */

function go(screenId) {

  document
    .querySelectorAll(".screen")
    .forEach(function (screen) {

      screen.classList.remove(
        "active"
      );

    });


  const target =
    $(screenId);


  if (target) {

    target.classList.add(
      "active"
    );

  }


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =====================================================
   GLOBAL FUNCTIONS
   确保 HTML onclick 可以正常调用
===================================================== */

window.openUnit =
  openUnit;

window.checkQuiz =
  checkQuiz;

window.checkProduction =
  checkProduction;

window.speakText =
  speakText;

window.speakPassage =
  speakPassage;

window.stopSpeech =
  stopSpeech;

window.toggleSlow =
  toggleSlow;

window.finishUnit =
  finishUnit;

window.go =
  go;

window.playVerse =
  playVerse;

window.playCurrentVerse =
  playCurrentVerse;

window.playPreviousVerse =
  playPreviousVerse;

window.playNextVerse =
  playNextVerse;

window.toggleAutoPlay =
  toggleAutoPlay;

window.toggleRepeatMode =
  toggleRepeatMode;


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  init
);
