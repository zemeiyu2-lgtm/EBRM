/* =========================================================
   EBRM V0.7
   Golden Training Unit
   John 1:1–5

   GitHub Pages 独立版
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {

  BIBLE_API:
    "https://bible-api.com",

  TRANSLATION:
    "web",

  SPEECH_LANG:
    "en-US",

  NORMAL_RATE:
    0.88,

  SLOW_RATE:
    0.62,

  STATE_KEY:
    "EBRM_V07_STATE"

};


/* =========================================================
   GOLDEN UNIT
========================================================= */

const GOLDEN_UNIT = {

  id:
    "JOHN-1-1-5",

  reference:
    "John 1:1–5",

  start:
    1,

  end:
    5,

  title:
    "The Word",

  production:
    "In simple English, explain who the Word is and what is in the Word.",


  vocabulary: [

    {
      word:
        "Word",

      meaning:
        "道",

      english:
        "the Word"
    },

    {
      word:
        "beginning",

      meaning:
        "起初；开始",

      english:
        "the start"
    },

    {
      word:
        "life",

      meaning:
        "生命",

      english:
        "life"
    },

    {
      word:
        "light",

      meaning:
        "光",

      english:
        "light"
    },

    {
      word:
        "darkness",

      meaning:
        "黑暗",

      english:
        "darkness"
    },

    {
      word:
        "overcome",

      meaning:
        "胜过；制伏",

      english:
        "defeat"
    }

  ],


  structures: [

    {
      pattern:
        "In the beginning was the Word.",

      explanation:
        "时间背景在前，核心主语 Word 在后。先建立时间场景，再告诉读者谁在那里。"
    },

    {
      pattern:
        "The Word was with God.",

      explanation:
        "was with 表达 Word 与 God 之间的关系。"
    },

    {
      pattern:
        "The Word was God.",

      explanation:
        "Subject + be + complement，用于确认身份/本质。"
    },

    {
      pattern:
        "In him was life.",

      explanation:
        "in him 放在前面，突出生命所在的位置。"
    },

    {
      pattern:
        "The light shines in the darkness.",

      explanation:
        "主语 the light + 动词 shines + 地点/范围 in the darkness。"
    }

  ],


  notice: [

    {
      question:
        "What word is repeated as the main focus?",

      options: [
        "Word",
        "Temple",
        "King"
      ],

      answer:
        0
    },

    {
      question:
        "What two ideas are directly contrasted?",

      options: [
        "Light and darkness",
        "King and servant",
        "Life and money"
      ],

      answer:
        0
    },

    {
      question:
        "What is connected with the Word?",

      options: [
        "God, life, and light",
        "Rome, law, and temple",
        "Water, fire, and army"
      ],

      answer:
        0
    },

    {
      question:
        "What action does the darkness fail to accomplish?",

      options: [
        "It does not overcome the light",
        "It creates the light",
        "It becomes life"
      ],

      answer:
        0
    }

  ],


  direct: [

    {
      question:
        "Who was with God in the beginning?",

      options: [
        "The Word",
        "John",
        "Moses"
      ],

      answer:
        0,

      chinese:
        "道与神同在。"
    },

    {
      question:
        "What was in the Word?",

      options: [
        "Darkness",
        "Life",
        "Death"
      ],

      answer:
        1,

      chinese:
        "生命在祂里面。"
    },

    {
      question:
        "What was the life in the Word?",

      options: [
        "The light of men",
        "The law of Moses",
        "The temple"
      ],

      answer:
        0,

      chinese:
        "这生命就是人的光。"
    },

    {
      question:
        "Where does the light shine?",

      options: [
        "In the darkness",
        "In the temple",
        "In Rome"
      ],

      answer:
        0,

      chinese:
        "光照在黑暗里。"
    },

    {
      question:
        "Has the darkness overcome the light?",

      options: [
        "Yes",
        "No",
        "The passage does not say"
      ],

      answer:
        1,

      chinese:
        "黑暗没有胜过光。"
    }

  ]

};


/* =========================================================
   STATE
========================================================= */

let currentPassage =
  null;

let currentVerseIndex =
  0;

let speechRate =
  CONFIG.NORMAL_RATE;

let selectedVoice =
  null;

let continuousReading =
  false;

let repeatCurrentVerse =
  false;

let baselineScore =
  0;

let finalScore =
  0;

let baselineSubmitted =
  false;

let finalSubmitted =
  false;

let currentFeeling =
  0;


let state =
  loadState();


function loadState() {

  try {

    const saved =
      localStorage.getItem(
        CONFIG.STATE_KEY
      );

    if (saved) {

      return JSON.parse(
        saved
      );

    }

  } catch (error) {

    console.warn(
      "EBRM state error:",
      error
    );

  }


  return {

    completed:
      false,

    baseline:
      0,

    final:
      0,

    feeling:
      0,

    completedAt:
      null,

    reviewDates:
      []

  };

}


function saveState() {

  localStorage.setItem(

    CONFIG.STATE_KEY,

    JSON.stringify(
      state
    )

  );

}


/* =========================================================
   HELPERS
========================================================= */

function $(
  id
) {

  return document.getElementById(
    id
  );

}


function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function escapeJS(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /'/g,
      "\\'"
    )
    .replace(
      /\r/g,
      ""
    )
    .replace(
      /\n/g,
      "\\n"
    );

}


/* =========================================================
   INIT
========================================================= */

function init() {

  updateHomeProgress();

  renderBaselineQuestions();

  renderFinalQuestions();

  initVoices();

}


function initVoices() {

  if (
    !window.speechSynthesis
  ) {

    return;

  }


  selectedVoice =
    chooseVoice();


  speechSynthesis.onvoiceschanged =
    function() {

      selectedVoice =
        chooseVoice();

      renderVoicePanel();

    };

}


function chooseVoice() {

  const voices =
    speechSynthesis
      .getVoices()
      .filter(
        function(voice) {

          return (
            voice.lang &&
            voice.lang
              .toLowerCase()
              .startsWith(
                "en"
              )
          );

        }
      );


  if (!voices.length) {

    return null;

  }


  const saved =
    localStorage.getItem(
      "EBRM_V07_VOICE"
    );


  if (saved) {

    const found =
      voices.find(
        function(voice) {

          return (
            voice.name ===
            saved
          );

        }
      );


    if (found) {

      return found;

    }

  }


  const names = [

    "david",
    "daniel",
    "alex",
    "mark",
    "james",
    "george",
    "guy",
    "fred"

  ];


  const preferred =
    voices.find(
      function(voice) {

        const name =
          voice.name.toLowerCase();


        return names.some(
          function(word) {

            return name.includes(
              word
            );

          }
        );

      }
    );


  if (preferred) {

    return preferred;

  }


  return (
    voices.find(
      function(voice) {

        return (
          voice.lang
            .toLowerCase() ===
          "en-us"
        );

      }
    )
    || voices[0]
  );

}


/* =========================================================
   HOME
========================================================= */

function updateHomeProgress() {

  const bar =
    $("goldenProgressBar");

  const text =
    $("goldenProgressText");


  let progress =
    0;


  if (
    baselineSubmitted
  ) {

    progress =
      12;

  }


  if (
    finalSubmitted
  ) {

    progress =
      100;

  }


  if (bar) {

    bar.style.width =
      progress + "%";

  }


  if (text) {

    text.textContent =
      progress + "%";

  }

}


/* =========================================================
   START GOLDEN UNIT
========================================================= */

function startGoldenUnit() {

  go(
    "read"
  );

  loadPassage();

  updateHomeProgress();

}


/* =========================================================
   BASELINE
========================================================= */

function startBaseline() {

  renderBaselineQuestions();

  go(
    "baseline"
  );

}


function renderBaselineQuestions() {

  const container =
    $("baselineQuestions");


  if (!container) {

    return;

  }


  container.innerHTML = "";


  const questions = [

    [
      "What was with God in the beginning?",
      [
        "The Word",
        "The darkness",
        "John"
      ],
      0
    ],

    [
      "What was in the Word?",
      [
        "Life",
        "Darkness",
        "Death"
      ],
      0
    ],

    [
      "Where does the light shine?",
      [
        "In the darkness",
        "In Rome",
        "In the temple"
      ],
      0
    ]

  ];


  questions.forEach(
    function(item, index) {

      const block =
        document.createElement(
          "div"
        );


      block.className =
        "notice-question";


      const title =
        document.createElement(
          "div"
        );


      title.className =
        "notice-question-title";


      title.textContent =
        `${index + 1}. ${item[0]}`;


      block.appendChild(
        title
      );


      item[1].forEach(
        function(option, optionIndex) {

          const button =
            document.createElement(
              "button"
            );


          button.className =
            "option";


          button.textContent =
            option;


          button.onclick =
            function() {

              block
                .querySelectorAll(
                  ".option"
                )
                .forEach(
                  function(btn) {

                    btn.classList.remove(
                      "selected"
                    );

                  }
                );


              button.classList.add(
                "selected"
              );


              button.dataset.answer =
                optionIndex;

            };


          block.appendChild(
            button
          );

        }
      );


      block.dataset.answer =
        item[2];


      container.appendChild(
        block
      );

    }
  );

}


function submitBaseline() {

  const blocks =
    document.querySelectorAll(
      "#baselineQuestions .notice-question"
    );


  let correct =
    0;


  blocks.forEach(
    function(block) {

      const selected =
        block.querySelector(
          ".option.selected"
        );


      if (
        selected &&
        Number(
          selected.dataset.answer
        ) ===
        Number(
          block.dataset.answer
        )
      ) {

        correct++;

      }

    }
  );


  baselineScore =
    Math.round(
      (
        correct /
        blocks.length
      ) * 100
    );


  baselineSubmitted =
    true;


  $("baselineResult")
    .classList
    .remove(
      "hidden"
    );


  $("baselineResult")
    .innerHTML =

    "<div class='success'>" +

    "第一次理解：" +

    baselineScore +

    "%<br><br>" +

    "现在进入训练。不要回头查答案。" +

    "</div>";


  state.baseline =
    baselineScore;


  saveState();

  updateHomeProgress();

}


/* =========================================================
   LOAD PASSAGE
========================================================= */

async function loadPassage() {

  const box =
    $("passageText");


  if (!box) {

    return;

  }


  box.innerHTML =
    "正在读取英文圣经……";


  const reference =
    "John 1:" +
    GOLDEN_UNIT.start +
    "-" +
    GOLDEN_UNIT.end;


  const url =
    CONFIG.BIBLE_API +
    "/" +
    encodeURIComponent(
      reference
    ) +
    "?translation=" +
    CONFIG.TRANSLATION;


  try {

    const response =
      await fetch(
        url,
        {
          cache:
            "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "HTTP " +
        response.status
      );

    }


    const data =
      await response.json();


    if (
      !data.verses ||
      !data.verses.length
    ) {

      throw new Error(
        "没有返回经文"
      );

    }


    currentPassage = {

      reference:
        GOLDEN_UNIT.reference,

      verses:
        data.verses.map(
          function(item) {

            return {

              verse:
                item.verse,

              text:
                String(
                  item.text
                ).trim()

            };

          }
        )

    };


    renderPassage();

    renderRereadPassage();

    renderImitationList();

    renderVoicePanel();

    renderAudioControls();


  } catch (error) {

    box.innerHTML =

      "<div class='success'>" +

      "<strong>经文读取失败</strong>" +

      "<br><br>" +

      escapeHTML(
        error.message
      ) +

      "</div>";

  }

}


/* =========================================================
   PASSAGE
========================================================= */

function renderPassage() {

  const container =
    $("passageText");


  if (
    !container ||
    !currentPassage
  ) {

    return;

  }


  container.innerHTML =
    "";


  currentPassage.verses
    .forEach(
      function(verse, index) {

        const span =
          document.createElement(
            "span"
          );


        span.className =
          "verse";


        span.dataset.index =
          index;


        const number =
          document.createElement(
            "sup"
          );


        number.textContent =
          verse.verse;


        span.appendChild(
          number
        );


        span.appendChild(
          document.createTextNode(
            " " +
            verse.text
          )
        );


        span.onclick =
          function() {

            playVerse(
              index
            );

          };


        container.appendChild(
          span
        );

      }
    );

}


/* =========================================================
   REREAD
========================================================= */

function renderRereadPassage() {

  const container =
    $("rereadPassage");


  if (
    !container ||
    !currentPassage
  ) {

    return;

  }


  container.innerHTML =
    currentPassage.verses
      .map(
        function(verse) {

          return (

            escapeHTML(
              String(
                verse.verse
              )
            ) +
            " " +
            escapeHTML(
              verse.text
            )

          );

        }
      )
      .join(
        "<br><br>"
      );

}


/* =========================================================
   VOICE PANEL
========================================================= */

function renderVoicePanel() {

  const panel =
    $("voicePanel");


  if (!panel) {

    return;

  }


  panel.innerHTML =

    "<strong>🎙️ English Voice</strong>" +

    "<select " +
    "id='voiceSelect' " +
    "style='width:100%;padding:10px;margin-top:8px;border:1px solid #ddd;border-radius:10px;background:white'>" +
    "</select>" +

    "<div style='margin-top:7px;color:#777;font-size:11px'>" +

    "声音来源于当前设备的浏览器语音系统。" +

    "</div>";


  const select =
    $("voiceSelect");


  const voices =
    speechSynthesis
      .getVoices()
      .filter(
        function(voice) {

          return (
            voice.lang &&
            voice.lang
              .toLowerCase()
              .startsWith(
                "en"
              )
          );

        }
      );


  voices.forEach(
    function(voice) {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        voice.name;


      option.textContent =
        voice.name +
        " (" +
        voice.lang +
        ")";


      if (
        selectedVoice &&
        selectedVoice.name ===
        voice.name
      ) {

        option.selected =
          true;

      }


      select.appendChild(
        option
      );

    }
  );


  if (
    !voices.length
  ) {

    const option =
      document.createElement(
        "option"
      );


    option.textContent =
      "No English voice detected";


    select.appendChild(
      option
    );

  }


  select.onchange =
    function() {

      selectedVoice =
        voices.find(
          function(voice) {

            return (
              voice.name ===
              select.value
            );

          }
        );


      if (selectedVoice) {

        localStorage.setItem(
          "EBRM_V07_VOICE",
          selectedVoice.name
        );

      }

    };

}


/* =========================================================
   AUDIO CONTROLS
========================================================= */

function renderAudioControls() {

  const container =
    $("audioControls");


  if (!container) {

    return;

  }


  container.innerHTML = `

    <div class="eyebrow">
      LISTENING TRAINING
    </div>

    <div class="audio-controls">

      <button
        class="primary"
        onclick="speakPassage()">

        🔊 听整段

      </button>

      <button
        onclick="startContinuousReading()">

        ▶ 连续逐节

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
        onclick="toggleRepeatCurrentVerse()">

        🔁 当前节

      </button>

      <button
        onclick="toggleSlow()">

        🐢
        <span id="speedLabel">
          正常速度
        </span>

      </button>

      <button
        onclick="stopSpeech()">

        ⏹ 停止

      </button>

    </div>

    <div
      id="speechStatus"
      style="margin-top:12px;color:#777;font-size:12px">

      点击开始听读

    </div>

  `;

}


/* =========================================================
   SPEECH
========================================================= */

function speakText(
  text,
  element,
  callback
) {

  if (
    !window.speechSynthesis
  ) {

    alert(
      "当前浏览器不支持语音朗读。"
    );

    return;

  }


  speechSynthesis.cancel();


  document
    .querySelectorAll(
      ".verse-speaking"
    )
    .forEach(
      function(item) {

        item.classList.remove(
          "verse-speaking"
        );

      }
    );


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    CONFIG.SPEECH_LANG;


  utterance.rate =
    speechRate;


  utterance.pitch =
    0.95;


  utterance.volume =
    1;


  if (selectedVoice) {

    utterance.voice =
      selectedVoice;

  }


  if (element) {

    element.classList.add(
      "verse-speaking"
    );


    element.scrollIntoView({

      behavior:
        "smooth",

      block:
        "center"

    });

  }


  updateSpeechStatus(
    "正在朗读……"
  );


  utterance.onend =
    function() {

      if (element) {

        element.classList.remove(
          "verse-speaking"
        );

      }


      if (callback) {

        callback();

      }


      updateSpeechStatus(
        "朗读完成"
      );

    };


  utterance.onerror =
    function() {

      updateSpeechStatus(
        "语音播放失败"
      );

    };


  speechSynthesis.speak(
    utterance
  );

}


function speakPassage() {

  if (!currentPassage) {

    return;

  }


  continuousReading =
    false;

  repeatCurrentVerse =
    false;


  const text =
    currentPassage
      .verses
      .map(
        function(v) {

          return v.text;

        }
      )
      .join(" ");


  speakText(
    text
  );

}


function playVerse(
  index
) {

  if (
    !currentPassage ||
    !currentPassage.verses[index]
  ) {

    return;

  }


  continuousReading =
    false;

  repeatCurrentVerse =
    false;


  currentVerseIndex =
    index;


  speakVerse(
    index
  );

}


function speakVerse(
  index
) {

  if (
    !currentPassage ||
    !currentPassage.verses[index]
  ) {

    return;

  }


  currentVerseIndex =
    index;


  const elements =
    document.querySelectorAll(
      ".verse"
    );


  speakText(

    currentPassage
      .verses[index]
      .text,

    elements[index],

    function() {

      if (
        repeatCurrentVerse
      ) {

        setTimeout(
          function() {

            speakVerse(
              index
            );

          },
          700
        );


        return;

      }


      if (
        continuousReading
      ) {

        const next =
          index + 1;


        if (
          next <
          currentPassage
            .verses
            .length
        ) {

          speakVerse(
            next
          );

        }

        else {

          continuousReading =
            false;

          updateSpeechStatus(
            "连续逐节完成"
          );

        }

      }

    }

  );

}


function startContinuousReading() {

  if (!currentPassage) {

    return;

  }


  stopSpeech();


  continuousReading =
    true;

  repeatCurrentVerse =
    false;


  currentVerseIndex =
    0;


  updateSpeechStatus(
    "连续逐节朗读中……"
  );


  speakVerse(
    0
  );

}


function toggleRepeatCurrentVerse() {

  if (!currentPassage) {

    return;

  }


  continuousReading =
    false;


  repeatCurrentVerse =
    !repeatCurrentVerse;


  if (
    repeatCurrentVerse
  ) {

    updateSpeechStatus(
      "当前节循环中……"
    );


    speakVerse(
      currentVerseIndex
    );

  }

  else {

    stopSpeech();

  }

}


function playPreviousVerse() {

  if (!currentPassage) {

    return;

  }


  continuousReading =
    false;

  repeatCurrentVerse =
    false;


  currentVerseIndex =
    Math.max(
      0,
      currentVerseIndex - 1
    );


  speakVerse(
    currentVerseIndex
  );

}


function playNextVerse() {

  if (!currentPassage) {

    return;

  }


  continuousReading =
    false;

  repeatCurrentVerse =
    false;


  currentVerseIndex =
    Math.min(

      currentPassage
        .verses
        .length - 1,

      currentVerseIndex + 1

    );


  speakVerse(
    currentVerseIndex
  );

}


function stopSpeech() {

  continuousReading =
    false;

  repeatCurrentVerse =
    false;


  if (
    window.speechSynthesis
  ) {

    speechSynthesis.cancel();

  }


  document
    .querySelectorAll(
      ".verse-speaking"
    )
    .forEach(
      function(item) {

        item.classList.remove(
          "verse-speaking"
        );

      }
    );


  updateSpeechStatus(
    "语音已停止"
  );

}


function toggleSlow() {

  speechRate =
    speechRate ===
    CONFIG.NORMAL_RATE

      ? CONFIG.SLOW_RATE

      : CONFIG.NORMAL_RATE;


  const label =
    $("speedLabel");


  if (label) {

    label.textContent =

      speechRate ===
      CONFIG.NORMAL_RATE

        ? "正常速度"

        : "慢速";

  }

}


function updateSpeechStatus(
  text
) {

  const status =
    $("speechStatus");


  if (status) {

    status.textContent =
      text;

  }

}


/* =========================================================
   NOTICE
========================================================= */

function goToNotice() {

  renderNotice();

  go(
    "notice"
  );

}


function renderNotice() {

  const container =
    $("noticeQuestions");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  GOLDEN_UNIT.notice
    .forEach(
      function(item, index) {

        const block =
          document.createElement(
            "div"
          );


        block.className =
          "notice-question";


        const title =
          document.createElement(
            "div"
          );


        title.className =
          "notice-question-title";


        title.textContent =
          `${index + 1}. ${item.question}`;


        block.appendChild(
          title
        );


        item.options
          .forEach(
            function(option, optionIndex) {

              const button =
                document.createElement(
                  "button"
                );


              button.className =
                "option";


              button.textContent =
                option;


              button.onclick =
                function() {

                  block
                    .querySelectorAll(
                      ".option"
                    )
                    .forEach(
                      function(btn) {

                        btn.classList.remove(
                          "selected"
                        );

                      }
                    );


                  button.classList.add(
                    "selected"
                  );


                  button.dataset.answer =
                    optionIndex;

                };


              block.appendChild(
                button
              );

            }
          );


        container.appendChild(
          block
        );

      }
    );

}


/* =========================================================
   VOCABULARY
========================================================= */

function goToVocabulary() {

  renderVocabulary();

  go(
    "vocabulary"
  );

}


function renderVocabulary() {

  const container =
    $("vocabularyList");


  if (!container) {

    return;

  }


  container.innerHTML = "";


  GOLDEN_UNIT
    .vocabulary
    .forEach(
      function(item) {

        const div =
          document.createElement(
            "div"
          );


        div.className =
          "vocab-item";


        div.innerHTML = `

          <div class="vocab-top">

            <div class="term">
              ${escapeHTML(
                item.word
              )}
            </div>

          </div>

          <div class="vocab-meaning">

            ${escapeHTML(
              item.meaning
            )}

          </div>

          <div class="vocab-en">

            ${escapeHTML(
              item.english
            )}

          </div>

        `;


        const button =
          document.createElement(
            "button"
          );


        button.className =
          "mini";


        button.textContent =
          "🔊 发音";


        button.onclick =
          function() {

            speakText(
              item.word
            );

          };


        div
          .querySelector(
            ".vocab-top"
          )
          .appendChild(
            button
          );


        container.appendChild(
          div
        );

      }
    );

}


/* =========================================================
   STRUCTURE
========================================================= */

function goToStructure() {

  renderStructure();

  go(
    "structure"
  );

}


function renderStructure() {

  const container =
    $("structureList");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  GOLDEN_UNIT
    .structures
    .forEach(
      function(item) {

        const div =
          document.createElement(
            "div"
          );


        div.className =
          "structure-item";


        div.innerHTML = `

          <div class="structure-pattern">

            ${escapeHTML(
              item.pattern
            )}

          </div>

          <div class="structure-explanation">

            ${escapeHTML(
              item.explanation
            )}

          </div>

        `;


        const button =
          document.createElement(
            "button"
          );


        button.textContent =
          "🔊 听句型";


        button.style.marginTop =
          "9px";


        button.onclick =
          function() {

            speakText(
              item.pattern
            );

          };


        div.appendChild(
          button
        );


        container.appendChild(
          div
        );

      }
    );

}


/* =========================================================
   DIRECT COMPREHENSION
========================================================= */

function goToDirect() {

  renderDirect();

  go(
    "direct"
  );

}


function renderDirect() {

  const container =
    $("directQuestions");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  GOLDEN_UNIT
    .direct
    .forEach(
      function(item, index) {

        const block =
          document.createElement(
            "div"
          );


        block.className =
          "notice-question";


        const title =
          document.createElement(
            "div"
          );


        title.className =
          "notice-question-title";


        title.textContent =
          `${index + 1}. ${item.question}`;


        block.appendChild(
          title
        );


        item.options
          .forEach(
            function(option, optionIndex) {

              const button =
                document.createElement(
                  "button"
                );


              button.className =
                "option";


              button.textContent =
                option;


              button.onclick =
                function() {

                  block
                    .querySelectorAll(
                      ".option"
                    )
                    .forEach(
                      function(btn) {

                        btn.classList.remove(
                          "selected"
                        );

                      }
                    );


                  button.classList.add(
                    "selected"
                  );


                  button.dataset.answer =
                    optionIndex;

                };


              block.appendChild(
                button
              );

            }
          );


        const confirm =
          document.createElement(
            "button"
          );


        confirm.textContent =
          "中文确认";


        confirm.style.marginTop =
          "9px";


        confirm.onclick =
          function() {

            const answer =
              document.createElement(
                "div"
              );


            answer.className =
              "success";


            answer.textContent =
              item.chinese;


            if (
              block
                .querySelector(
                  ".success"
                )
            ) {

              block
                .querySelector(
                  ".success"
                )
                .remove();

            }


            block.appendChild(
              answer
            );

          };


        block.appendChild(
          confirm
        );


        container.appendChild(
          block
        );

      }
    );


  const score =
    $("directScore");


  if (score) {

    score.innerHTML =
      "选择答案后，会自动统计 Direct Comprehension。";

  }


  updateDirectScore();

}


function updateDirectScore() {

  const blocks =
    document.querySelectorAll(
      "#directQuestions .notice-question"
    );


  if (!blocks.length) {

    return;

  }


  let correct =
    0;

  let answered =
    0;


  blocks.forEach(
    function(block, index) {

      const selected =
        block.querySelector(
          ".option.selected"
        );


      if (
        selected
      ) {

        answered++;


        if (
          Number(
            selected.dataset.answer
          ) ===
          GOLDEN_UNIT
            .direct[index]
            .answer
        ) {

          correct++;

        }

      }

    }
  );


  const score =
    $("directScore");


  if (score) {

    score.textContent =
      `Direct Comprehension：${correct}/${blocks.length} · 已回答 ${answered}/${blocks.length}`;

  }

}


/* =========================================================
   SPEAK
========================================================= */

function goToSpeak() {

  $("speakPrompt").textContent =
    GOLDEN_UNIT.production;


  renderImitationList();


  go(
    "speak"
  );

}


function checkSpeak() {

  const input =
    $("speakAnswer");


  const result =
    $("speakResult");


  const text =
    input.value.trim();


  if (!text) {

    result.classList.remove(
      "hidden"
    );


    result.innerHTML =
      "<div class='success'>" +
      "请先写一句英文。" +
      "</div>";

    return;

  }


  const lower =
    text.toLowerCase();


  const keywords = [

    "word",
    "god",
    "life",
    "light",
    "darkness"

  ];


  let hits =
    0;


  keywords.forEach(
    function(word) {

      if (
        lower.includes(word)
      ) {

        hits++;

      }

    }
  );


  const wordCount =
    text
      .split(/\s+/)
      .filter(Boolean)
      .length;


  let score =
    Math.round(
      (
        Math.min(
          hits,
          5
        ) / 5
      ) *
      70
    );


  if (
    wordCount >= 6
  ) {

    score +=
      15;

  }


  if (
    lower.includes(
      "because"
    )
    ||
    lower.includes(
      "and"
    )
  ) {

    score +=
      15;

  }


  score =
    Math.min(
      100,
      score
    );


  result.classList.remove(
    "hidden"
  );


  result.innerHTML =

    "<div class='success'>" +

    "<strong>" +

    "英文表达：" +

    score +

    "/100" +

    "</strong>" +

    "<br><br>" +

    "关键词：" +

    hits +

    "/5" +

    "<br>" +

    "单词数：" +

    wordCount +

    "<br><br>" +

    (
      score >= 80
        ? "很好，你已经能够用英文抓住这段经文。"
        : score >= 60
          ? "不错，继续尝试让英文表达更完整。"
          : "先不要追求复杂，准确说出核心内容。"
    ) +

    "</div>";

}


function listenToMyAnswer() {

  const text =
    $("speakAnswer")
      .value
      .trim();


  if (!text) {

    alert(
      "请先写下你的英文答案。"
    );

    return;

  }


  speakText(
    text
  );

}


/* =========================================================
   IMITATION
========================================================= */

function renderImitationList() {

  const container =
    $("imitationList");


  if (!container || !currentPassage) {

    return;

  }


  container.innerHTML =
    "";


  currentPassage
    .verses
    .forEach(
      function(verse) {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "imitation-item";


        item.innerHTML = `

          <div class="imitation-sentence">

            ${escapeHTML(
              verse.text
            )}

          </div>

        `;


        const button =
          document.createElement(
            "button"
          );


        button.textContent =
          "🔊 听这一句";


        button.style.marginTop =
          "8px";


        button.onclick =
          function() {

            speakText(
              verse.text
            );

          };


        item.appendChild(
          button
        );


        container.appendChild(
          item
        );

      }
    );

}


/* =========================================================
   REREAD
========================================================= */

function goToReread() {

  renderRereadPassage();

  go(
    "reread"
  );

}


function setFeeling(
  score,
  button
) {

  currentFeeling =
    score;


  document
    .querySelectorAll(
      ".feeling-options button"
    )
    .forEach(
      function(item) {

        item.classList.remove(
          "selected"
        );

      }
    );


  button.classList.add(
    "selected"
  );


  state.feeling =
    score;


  saveState();

}


/* =========================================================
   FINAL TEST
========================================================= */

function goToFinalTest() {

  renderFinalQuestions();

  go(
    "finalTest"
  );

}


function renderFinalQuestions() {

  const container =
    $("finalQuestions");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  GOLDEN_UNIT
    .direct
    .slice(
      0,
      4
    )
    .forEach(
      function(item, index) {

        const block =
          document.createElement(
            "div"
          );


        block.className =
          "notice-question";


        const title =
          document.createElement(
            "div"
          );


        title.className =
          "notice-question-title";


        title.textContent =
          `${index + 1}. ${item.question}`;


        block.appendChild(
          title
        );


        item.options
          .forEach(
            function(option, optionIndex) {

              const button =
                document.createElement(
                  "button"
                );


              button.className =
                "option";


              button.textContent =
                option;


              button.onclick =
                function() {

                  block
                    .querySelectorAll(
                      ".option"
                    )
                    .forEach(
                      function(btn) {

                        btn.classList.remove(
                          "selected"
                        );

                      }
                    );


                  button.classList.add(
                    "selected"
                  );


                  button.dataset.answer =
                    optionIndex;

                };


              block.appendChild(
                button
              );

            }
          );


        block.dataset.answer =
          item.answer;


        container.appendChild(
          block
        );

      }
    );

}


function submitFinalTest() {

  const blocks =
    document.querySelectorAll(
      "#finalQuestions .notice-question"
    );


  let correct =
    0;


  blocks.forEach(
    function(block) {

      const selected =
        block.querySelector(
          ".option.selected"
        );


      if (
        selected &&
        Number(
          selected.dataset.answer
        ) ===
        Number(
          block.dataset.answer
        )
      ) {

        correct++;

      }

    }
  );


  finalScore =
    Math.round(
      (
        correct /
        blocks.length
      ) * 100
    );


  finalSubmitted =
    true;


  state.final =
    finalScore;


  saveState();


  $("finalResult")
    .classList
    .remove(
      "hidden"
    );


  $("finalResult")
    .innerHTML =

    "<div class='success'>" +

    "第二次理解：" +

    finalScore +

    "%" +

    "<br><br>" +

    "你的结果已经记录。" +

    "</div>";


  setTimeout(
    showFinalResult,
    800
  );

}


/* =========================================================
   RESULT
========================================================= */

function showFinalResult() {

  $("baselineScore")
    .textContent =
    baselineScore +
    "%";


  $("finalScore")
    .textContent =
    finalScore +
    "%";


  const improvement =
    finalScore -
    baselineScore;


  const box =
    $("improvementBox");


  if (
    improvement > 0
  ) {

    box.innerHTML =

      "<strong>" +

      "理解提升 +" +

      improvement +

      "%</strong>" +

      "<div style='margin-top:6px;font-size:12px'>" +

      "训练后，你对这段英文经文的直接理解有所提升。" +

      "</div>";

  }

  else if (
    improvement === 0
  ) {

    box.innerHTML =

      "<strong>理解保持不变</strong>" +

      "<div style='margin-top:6px;font-size:12px'>" +

      "再经过几次间隔复习，继续观察变化。" +

      "</div>";

  }

  else {

    box.innerHTML =

      "<strong>这次没有提升</strong>" +

      "<div style='margin-top:6px;font-size:12px'>" +

      "这并不意味着失败。建议重新听读后再测。" +

      "</div>";

  }


  state.completed =
    true;


  state.completedAt =
    new Date().toISOString();


  state.reviewDates = [

    addDays(
      new Date(),
      1
    ),

    addDays(
      new Date(),
      3
    ),

    addDays(
      new Date(),
      7
    )

  ];


  saveState();

  updateHomeProgress();


  go(
    "result"
  );

}


function addDays(
  date,
  days
) {

  const result =
    new Date(
      date
    );


  result.setDate(
    result.getDate() +
    days
  );


  return result
    .toISOString()
    .slice(
      0,
      10
    );

}


/* =========================================================
   REVIEW
========================================================= */

function renderReviews() {

  const container =
    $("reviewList");


  if (!container) {

    return;

  }


  if (
    !state.completed ||
    !state.reviewDates
  ) {

    container.innerHTML =

      "<div class='muted'>" +

      "完成黄金单元后，这里会自动生成复习日期。" +

      "</div>";

    return;

  }


  container.innerHTML =

    state.reviewDates
      .map(
        function(date, index) {

          return `

            <div class="review-row">

              <strong>
                Day ${
                  index === 0
                    ? 1
                    : index === 1
                      ? 3
                      : 7
                }
              </strong>

              <small>
                ${date}
              </small>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   NAVIGATION
========================================================= */

function go(
  screenId
) {

  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(
      function(screen) {

        screen.classList.remove(
          "active"
        );

      }
    );


  const target =
    $(screenId);


  if (target) {

    target.classList.add(
      "active"
    );

  }


  if (
    screenId ===
    "review"
  ) {

    renderReviews();

  }


  window.scrollTo({

    top: 0,

    behavior:
      "smooth"

  });

}


/* =========================================================
   EXPORT FUNCTIONS TO HTML
========================================================= */

window.go =
  go;

window.startGoldenUnit =
  startGoldenUnit;

window.startBaseline =
  startBaseline;

window.submitBaseline =
  submitBaseline;

window.goToNotice =
  goToNotice;

window.goToVocabulary =
  goToVocabulary;

window.goToStructure =
  goToStructure;

window.goToDirect =
  goToDirect;

window.goToSpeak =
  goToSpeak;

window.goToReread =
  goToReread;

window.goToFinalTest =
  goToFinalTest;

window.submitFinalTest =
  submitFinalTest;

window.speakText =
  speakText;

window.speakPassage =
  speakPassage;

window.playVerse =
  playVerse;

window.speakVerse =
  speakVerse;

window.startContinuousReading =
  startContinuousReading;

window.toggleRepeatCurrentVerse =
  toggleRepeatCurrentVerse;

window.playPreviousVerse =
  playPreviousVerse;

window.playNextVerse =
  playNextVerse;

window.stopSpeech =
  stopSpeech;

window.toggleSlow =
  toggleSlow;

window.checkSpeak =
  checkSpeak;

window.listenToMyAnswer =
  listenToMyAnswer;

window.setFeeling =
  setFeeling;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);
