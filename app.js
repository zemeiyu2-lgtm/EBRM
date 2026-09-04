/* =========================================================
   EBRM V0.7.3
   Golden Training Unit
   John 1:1–5

   重要变化：

   本版本不再依赖 Bible API。

   John 1:1–5 直接内置。
   GitHub Pages 可以直接显示经文。
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {

  LANGUAGE:
    "en-US",

  NORMAL_RATE:
    0.88,

  SLOW_RATE:
    0.62,

  STATE_KEY:
    "EBRM_V073_STATE",

  VOICE_KEY:
    "EBRM_V073_VOICE"

};


/* =========================================================
   GOLDEN UNIT
========================================================= */

const GOLDEN_UNIT = {

  id:
    "JOHN-1-1-5",

  reference:
    "John 1:1–5",

  title:
    "The Word",

  production:
    "In simple English, explain who the Word is and what is in the Word.",


  /* -------------------------------------------------------
     John 1:1–5
     WEB Public Domain text
  ------------------------------------------------------- */

  verses: [

    {
      verse:
        1,

      text:
        "In the beginning was the Word, and the Word was with God, and the Word was God."
    },

    {
      verse:
        2,

      text:
        "The same was in the beginning with God."
    },

    {
      verse:
        3,

      text:
        "All things were made through him. Without him, nothing was made that has been made."
    },

    {
      verse:
        4,

      text:
        "In him was life, and the life was the light of men."
    },

    {
      verse:
        5,

      text:
        "The light shines in the darkness, and the darkness hasn’t overcome it."
    }

  ],


  /* -------------------------------------------------------
     VOCABULARY
  ------------------------------------------------------- */

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
        "with",

      meaning:
        "与……同在",

      english:
        "together with"
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
        "胜过；克服",

      english:
        "to defeat or overcome"
    }

  ],


  /* -------------------------------------------------------
     STRUCTURES
  ------------------------------------------------------- */

  structures: [

    {
      pattern:
        "In the beginning was the Word.",

      explanation:
        "时间背景放在前面，再出现核心主语 Word。"
    },

    {
      pattern:
        "The Word was with God.",

      explanation:
        "was with 表达 Word 与 God 的关系。"
    },

    {
      pattern:
        "The Word was God.",

      explanation:
        "Subject + be + complement，表达身份/本质。"
    },

    {
      pattern:
        "In him was life.",

      explanation:
        "in him 放在句首，突出生命所在的位置。"
    },

    {
      pattern:
        "The light shines in the darkness.",

      explanation:
        "the light 是主语，shines 是动作，in the darkness 表达范围/环境。"
    }

  ],


  /* -------------------------------------------------------
     NOTICE
  ------------------------------------------------------- */

  notice: [

    {
      question:
        "What word is repeated as a main focus?",

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
        "God, creation, life, and light",
        "Rome, law, and temple",
        "Water, fire, and army"
      ],

      answer:
        0
    },

    {
      question:
        "What does the darkness fail to do?",

      options: [
        "Overcome the light",
        "Create life",
        "Become the Word"
      ],

      answer:
        0
    }

  ],


  /* -------------------------------------------------------
     DIRECT COMPREHENSION
  ------------------------------------------------------- */

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

let currentFeeling =
  0;

let currentDirectAnswers =
  {};

let state =
  loadState();


/* =========================================================
   STATE LOAD
========================================================= */

function loadState() {

  try {

    const raw =
      localStorage.getItem(
        CONFIG.STATE_KEY
      );


    if (raw) {

      return JSON.parse(
        raw
      );

    }

  } catch (error) {

    console.warn(
      "State load error:",
      error
    );

  }


  return {

    baseline:
      null,

    final:
      null,

    feeling:
      null,

    completed:
      false,

    completedAt:
      null,

    reviews:
      []

  };

}


function saveState() {

  try {

    localStorage.setItem(

      CONFIG.STATE_KEY,

      JSON.stringify(
        state
      )

    );

  } catch (error) {

    console.warn(
      "State save error:",
      error
    );

  }

}


/* =========================================================
   HELPER
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


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);


function init() {

  bindEvents();

  initSpeech();

  renderHome();

  renderBaseline();

  renderFinal();

  renderReviews();

  updateHomeProgress();

}


/* =========================================================
   BIND EVENTS
========================================================= */

function bindEvents() {

  bind(
    "startGoldenBtn",
    startGoldenUnit
  );


  bind(
    "startBaselineBtn",
    startBaseline
  );


  bind(
    "baselineBackBtn",
    function() {

      go("home");

    }
  );


  bind(
    "submitBaselineBtn",
    submitBaseline
  );


  bind(
    "readBackBtn",
    function() {

      go("home");

    }
  );


  bind(
    "noticeBtn",
    goToNotice
  );


  bind(
    "noticeBackBtn",
    function() {

      go("read");

    }
  );


  bind(
    "vocabularyBtn",
    goToVocabulary
  );


  bind(
    "vocabBackBtn",
    function() {

      go("notice");

    }
  );


  bind(
    "structureBtn",
    goToStructure
  );


  bind(
    "structureBackBtn",
    function() {

      go("vocabulary");

    }
  );


  bind(
    "directBtn",
    goToDirect
  );


  bind(
    "directBackBtn",
    function() {

      go("structure");

    }
  );


  bind(
    "speakBtn",
    goToSpeak
  );


  bind(
    "speakBackBtn",
    function() {

      go("direct");

    }
  );


  bind(
    "checkSpeakBtn",
    checkSpeak
  );


  bind(
    "listenAnswerBtn",
    listenToMyAnswer
  );


  bind(
    "rereadBtn",
    goToReread
  );


  bind(
    "rereadBackBtn",
    function() {

      go("speak");

    }
  );


  bind(
    "finalTestBtn",
    goToFinalTest
  );


  bind(
    "finalBackBtn",
    function() {

      go("reread");

    }
  );


  bind(
    "submitFinalBtn",
    submitFinalTest
  );


  bind(
    "resultHomeBtn",
    function() {

      go("home");

    }
  );


  bind(
    "resultReviewBtn",
    function() {

      go("review");

    }
  );


  bind(
    "reviewBackBtn",
    function() {

      go("home");

    }
  );


  document
    .querySelectorAll(
      ".feeling-options button"
    )
    .forEach(
      function(button) {

        button.addEventListener(
          "click",
          function() {

            setFeeling(
              Number(
                button.dataset.feeling
              ),
              button
            );

          }
        );

      }
    );

}


function bind(
  id,
  handler
) {

  const element =
    $(id);


  if (!element) {

    console.warn(
      "Missing element:",
      id
    );

    return;

  }


  element.addEventListener(
    "click",
    handler
  );

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


  if (!target) {

    console.warn(
      "Missing screen:",
      screenId
    );

    return;

  }


  target.classList.add(
    "active"
  );


  window.scrollTo({

    top:
      0,

    behavior:
      "smooth"

  );


  if (
    screenId ===
    "review"
  ) {

    renderReviews();

  }

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

  updateHomeProgress();

}


function updateHomeProgress() {

  const bar =
    $("goldenProgressBar");


  const text =
    $("goldenProgressText");


  let percent =
    0;


  if (
    state.baseline !==
    null
  ) {

    percent =
      15;

  }


  if (
    state.completed
  ) {

    percent =
      100;

  }


  if (bar) {

    bar.style.width =
      percent +
      "%";

  }


  if (text) {

    text.textContent =
      percent +
      "%";

  }

}


/* =========================================================
   START GOLDEN UNIT
========================================================= */

function startGoldenUnit() {

  stopSpeech();


  currentVerseIndex =
    0;


  renderPassage();


  renderVoicePanel();


  renderAudioControls();


  renderRereadPassage();


  renderImitationList();


  go("read");

}


/* =========================================================
   BASELINE
========================================================= */

function startBaseline() {

  renderBaseline();

  go(
    "baseline"
  );

}


function renderBaseline() {

  const container =
    $("baselineQuestions");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  const questions = [

    {
      q:
        "What was with God in the beginning?",

      options: [
        "The Word",
        "The darkness",
        "John"
      ],

      answer:
        0
    },

    {
      q:
        "What was in the Word?",

      options: [
        "Life",
        "Darkness",
        "Death"
      ],

      answer:
        0
    },

    {
      q:
        "Where does the light shine?",

      options: [
        "In the darkness",
        "In Rome",
        "In the temple"
      ],

      answer:
        0
    }

  ];


  questions.forEach(
    function(item, index) {

      const block =
        document.createElement(
          "div"
        );


      block.className =
        "notice-question";


      block.dataset.correct =
        item.answer;


      const title =
        document.createElement(
          "div"
        );


      title.className =
        "notice-question-title";


      title.textContent =
        (index + 1) +
        ". " +
        item.q;


      block.appendChild(
        title
      );


      item.options.forEach(
        function(option, optionIndex) {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "option";


          button.textContent =
            option;


          button.addEventListener(
            "click",
            function() {

              block
                .querySelectorAll(
                  ".option"
                )
                .forEach(
                  function(itemButton) {

                    itemButton.classList.remove(
                      "selected",
                      "correct",
                      "wrong"
                    );

                  }
                );


              button.classList.add(
                "selected"
              );


              button.dataset.answer =
                optionIndex;

            }
          );


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


function submitBaseline() {

  const blocks =
    document.querySelectorAll(
      "#baselineQuestions .notice-question"
    );


  if (!blocks.length) {

    return;

  }


  let correct =
    0;

  let answered =
    0;


  blocks.forEach(
    function(block) {

      const selected =
        block.querySelector(
          ".option.selected"
        );


      if (!selected) {

        return;

      }


      answered++;


      if (
        Number(
          selected.dataset.answer
        ) ===
        Number(
          block.dataset.correct
        )
      ) {

        correct++;

        selected.classList.add(
          "correct"
        );

      }

      else {

        selected.classList.add(
          "wrong"
        );

      }

    }
  );


  if (
    answered <
    blocks.length
  ) {

    alert(
      "请完成全部问题后再提交。"
    );

    return;

  }


  baselineScore =
    Math.round(
      (
        correct /
        blocks.length
      ) *
      100
    );


  state.baseline =
    baselineScore;


  saveState();

  updateHomeProgress();


  const result =
    $("baselineResult");


  if (result) {

    result.classList.remove(
      "hidden"
    );


    result.innerHTML =

      "<div class='success'>" +

      "<strong>" +

      "第一次直接理解：" +

      baselineScore +

      "%</strong>" +

      "<br><br>" +

      "现在开始精读。" +

      "</div>";

  }

}


/* =========================================================
   PASSAGE
========================================================= */

function renderPassage() {

  const container =
    $("passageText");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  GOLDEN_UNIT.verses
    .forEach(
      function(
        verse,
        index
      ) {

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


        span.addEventListener(
          "click",
          function() {

            playVerse(
              index
            );

          }
        );


        container.appendChild(
          span
        );

      }
    );


  const status =
    $("passageStatus");


  if (status) {

    status.textContent =
      "✓ 经文已加载";

  }

}


/* =========================================================
   REREAD PASSAGE
========================================================= */

function renderRereadPassage() {

  const container =
    $("rereadPassage");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  GOLDEN_UNIT.verses
    .forEach(
      function(verse, index) {

        const div =
          document.createElement(
            "div"
          );


        div.style.marginBottom =
          "18px";


        div.style.cursor =
          "pointer";


        div.textContent =
          verse.verse +
          ". " +
          verse.text;


        div.addEventListener(
          "click",
          function() {

            speakText(
              verse.text
            );

          }
        );


        container.appendChild(
          div
        );

      }
    );

}


/* =========================================================
   AUDIO
========================================================= */

function renderAudioControls() {

  const container =
    $("audioControls");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  const label =
    document.createElement(
      "div"
    );


  label.className =
    "eyebrow";


  label.textContent =
    "LISTENING TRAINING";


  container.appendChild(
    label
  );


  const controls =
    document.createElement(
      "div"
    );


  controls.className =
    "audio-controls";


  addControl(
    controls,
    "🔊 听整段",
    speakPassage
  );


  addControl(
    controls,
    "▶ 连续逐节",
    startContinuousReading
  );


  addControl(
    controls,
    "◀ 上一节",
    playPreviousVerse
  );


  addControl(
    controls,
    "下一节 ▶",
    playNextVerse
  );


  addControl(
    controls,
    "🔁 当前节",
    toggleRepeatCurrentVerse
  );


  addControl(
    controls,
    "🐢 正常 / 慢速",
    toggleSlow
  );


  addControl(
    controls,
    "⏹ 停止",
    stopSpeech
  );


  container.appendChild(
    controls
  );


  const status =
    document.createElement(
      "div"
    );


  status.id =
    "speechStatus";


  status.style.marginTop =
    "10px";


  status.style.fontSize =
    "12px";


  status.style.color =
    "#777";


  status.textContent =
    "点击开始听读";


  container.appendChild(
    status
  );

}


function addControl(
  parent,
  label,
  handler
) {

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.textContent =
    label;


  button.addEventListener(
    "click",
    handler
  );


  parent.appendChild(
    button
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
    "";


  const title =
    document.createElement(
      "strong"
    );


  title.textContent =
    "🎙️ English Voice";


  panel.appendChild(
    title
  );


  if (
    !window.speechSynthesis
  ) {

    const text =
      document.createElement(
        "div"
      );


    text.textContent =
      "当前浏览器不支持语音朗读。";


    panel.appendChild(
      text
    );


    return;

  }


  const select =
    document.createElement(
      "select"
    );


  select.id =
    "voiceSelect";


  select.style.width =
    "100%";


  select.style.padding =
    "10px";


  select.style.marginTop =
    "8px";


  select.style.border =
    "1px solid #ddd";


  select.style.borderRadius =
    "10px";


  select.style.background =
    "white";


  panel.appendChild(
    select
  );


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


  select.addEventListener(
    "change",
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


      if (
        selectedVoice
      ) {

        localStorage.setItem(
          CONFIG.VOICE_KEY,
          selectedVoice.name
        );

      }

    }
  );

}


/* =========================================================
   SPEECH INITIALIZATION
========================================================= */

function initSpeech() {

  if (
    !window.speechSynthesis
  ) {

    return;

  }


  selectedVoice =
    chooseVoice();


  window.speechSynthesis
    .addEventListener(
      "voiceschanged",
      function() {

        selectedVoice =
          chooseVoice();


        if (
          $("read")
            .classList
            .contains(
              "active"
            )
        ) {

          renderVoicePanel();

        }

      }
    );

}


function chooseVoice() {

  if (
    !window.speechSynthesis
  ) {

    return null;

  }


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
      CONFIG.VOICE_KEY
    );


  if (
    saved
  ) {

    const savedVoice =
      voices.find(
        function(voice) {

          return (
            voice.name ===
            saved
          );

        }
      );


    if (savedVoice) {

      return savedVoice;

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


  const likelyMale =
    voices.find(
      function(voice) {

        const name =
          voice.name
            .toLowerCase();


        return names.some(
          function(word) {

            return name.includes(
              word
            );

          }
        );

      }
    );


  if (likelyMale) {

    return likelyMale;

  }


  const us =
    voices.find(
      function(voice) {

        return (
          voice.lang
            .toLowerCase() ===
          "en-us"
        );

      }
    );


  return (
    us ||
    voices[0]
  );

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
    CONFIG.LANGUAGE;


  utterance.rate =
    speechRate;


  utterance.pitch =
    0.95;


  utterance.volume =
    1;


  if (
    selectedVoice
  ) {

    utterance.voice =
      selectedVoice;

  }


  if (
    element
  ) {

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

      if (
        element
      ) {

        element.classList.remove(
          "verse-speaking"
        );

      }


      updateSpeechStatus(
        "朗读完成"
      );


      if (
        callback
      ) {

        callback();

      }

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

  const text =
    GOLDEN_UNIT.verses
      .map(
        function(item) {

          return item.text;

        }
      )
      .join(" ");


  continuousReading =
    false;


  repeatCurrentVerse =
    false;


  speakText(
    text
  );

}


function playVerse(
  index
) {

  if (
    !GOLDEN_UNIT.verses[index]
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
    !GOLDEN_UNIT.verses[index]
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

    GOLDEN_UNIT
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
          GOLDEN_UNIT
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
            "✓ 连续逐节完成"
          );

        }

      }

    }

  );

}


function startContinuousReading() {

  stopSpeech();


  continuousReading =
    true;


  repeatCurrentVerse =
    false;


  currentVerseIndex =
    0;


  updateSpeechStatus(
    "▶ 连续逐节朗读中……"
  );


  speakVerse(
    0
  );

}


function toggleRepeatCurrentVerse() {

  repeatCurrentVerse =
    !repeatCurrentVerse;


  continuousReading =
    false;


  if (
    repeatCurrentVerse
  ) {

    updateSpeechStatus(
      "🔁 当前节循环中……"
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

  repeatCurrentVerse =
    false;

  continuousReading =
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

  repeatCurrentVerse =
    false;

  continuousReading =
    false;


  currentVerseIndex =
    Math.min(

      GOLDEN_UNIT
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

  if (
    speechRate ===
    CONFIG.NORMAL_RATE
  ) {

    speechRate =
      CONFIG.SLOW_RATE;

  }

  else {

    speechRate =
      CONFIG.NORMAL_RATE;

  }


  const label =
    document.querySelector(
      "#speedLabel"
    );


  updateSpeechStatus(

    speechRate ===
      CONFIG.NORMAL_RATE

      ? "已切换到正常速度"

      : "已切换到慢速"

  );


  /*
   * 如果当前不存在 speedLabel，
   * 不报错。
   */

  if (
    label
  ) {

    label.textContent =

      speechRate ===
        CONFIG.NORMAL_RATE

        ? "正常"

        : "慢速";

  }

}


function updateSpeechStatus(
  message
) {

  const status =
    $("speechStatus");


  if (
    status
  ) {

    status.textContent =
      message;

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


  GOLDEN_UNIT
    .notice
    .forEach(
      function(
        item,
        index
      ) {

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
          "NOTICE " +
          (index + 1) +
          " · " +
          item.question;


        block.appendChild(
          title
        );


        item.options
          .forEach(
            function(
              option,
              optionIndex
            ) {

              const button =
                document.createElement(
                  "button"
                );


              button.type =
                "button";


              button.className =
                "option";


              button.textContent =
                option;


              button.addEventListener(
                "click",
                function() {

                  block
                    .querySelectorAll(
                      ".option"
                    )
                    .forEach(
                      function(
                        btn
                      ) {

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

                }
              );


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


  container.innerHTML =
    "";


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


        const top =
          document.createElement(
            "div"
          );


        top.className =
          "vocab-top";


        const word =
          document.createElement(
            "div"
          );


        word.className =
          "term";


        word.textContent =
          item.word;


        top.appendChild(
          word
        );


        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "mini";


        button.textContent =
          "🔊 发音";


        button.addEventListener(
          "click",
          function() {

            speakText(
              item.word
            );

          }
        );


        top.appendChild(
          button
        );


        div.appendChild(
          top
        );


        const meaning =
          document.createElement(
            "div"
          );


        meaning.className =
          "vocab-meaning";


        meaning.textContent =
          item.meaning;


        div.appendChild(
          meaning
        );


        const english =
          document.createElement(
            "div"
          );


        english.className =
          "vocab-en";


        english.textContent =
          item.english;


        div.appendChild(
          english
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


        const pattern =
          document.createElement(
            "div"
          );


        pattern.className =
          "structure-pattern";


        pattern.textContent =
          item.pattern;


        div.appendChild(
          pattern
        );


        const explanation =
          document.createElement(
            "div"
          );


        explanation.className =
          "structure-explanation";


        explanation.textContent =
          item.explanation;


        div.appendChild(
          explanation
        );


        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.textContent =
          "🔊 听句型";


        button.style.marginTop =
          "8px";


        button.addEventListener(
          "click",
          function() {

            speakText(
              item.pattern
            );

          }
        );


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
   DIRECT
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


  currentDirectAnswers =
    {};


  GOLDEN_UNIT
    .direct
    .forEach(
      function(
        item,
        index
      ) {

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
          "DIRECT " +
          (index + 1) +
          " · " +
          item.question;


        block.appendChild(
          title
        );


        item.options
          .forEach(
            function(
              option,
              optionIndex
            ) {

              const button =
                document.createElement(
                  "button"
                );


              button.type =
                "button";


              button.className =
                "option";


              button.textContent =
                option;


              button.addEventListener(
                "click",
                function() {

                  block
                    .querySelectorAll(
                      ".option"
                    )
                    .forEach(
                      function(
                        btn
                      ) {

                        btn.classList.remove(
                          "selected",
                          "correct",
                          "wrong"
                        );

                      }
                    );


                  button.classList.add(
                    "selected"
                  );


                  currentDirectAnswers[
                    index
                  ] =
                    optionIndex;


                  if (
                    optionIndex ===
                    item.answer
                  ) {

                    button.classList.add(
                      "correct"
                    );

                  }

                  else {

                    button.classList.add(
                      "wrong"
                    );

                  }


                  updateDirectScore();

                }
              );


              block.appendChild(
                button
              );

            }
          );


        const confirm =
          document.createElement(
            "button"
          );


        confirm.type =
          "button";


        confirm.textContent =
          "中文确认";


        confirm.style.marginTop =
          "8px";


        confirm.addEventListener(
          "click",
          function() {

            let box =
              block.querySelector(
                ".success"
              );


            if (box) {

              box.remove();

              return;

            }


            box =
              document.createElement(
                "div"
              );


            box.className =
              "success";


            box.textContent =
              item.chinese;


            block.appendChild(
              box
            );

          }
        );


        block.appendChild(
          confirm
        );


        container.appendChild(
          block
        );

      }
    );


  updateDirectScore();

}


function updateDirectScore() {

  const score =
    $("directScore");


  if (!score) {

    return;

  }


  let correct =
    0;


  let answered =
    0;


  GOLDEN_UNIT
    .direct
    .forEach(
      function(
        item,
        index
      ) {

        if (
          currentDirectAnswers[index]
          !== undefined
        ) {

          answered++;


          if (
            currentDirectAnswers[index]
            === item.answer
          ) {

            correct++;

          }

        }

      }
    );


  score.textContent =

    "Direct Comprehension：" +

    correct +

    "/" +

    GOLDEN_UNIT
      .direct
      .length +

    " · 已回答 " +

    answered +

    "/" +

    GOLDEN_UNIT
      .direct
      .length;

}


/* =========================================================
   SPEAK
========================================================= */

function goToSpeak() {

  const prompt =
    $("speakPrompt");


  if (prompt) {

    prompt.textContent =
      GOLDEN_UNIT.production;

  }


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


  if (
    !input ||
    !result
  ) {

    return;

  }


  const text =
    input.value.trim();


  result.classList.remove(
    "hidden"
  );


  if (!text) {

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
    function(keyword) {

      if (
        lower.includes(
          keyword
        )
      ) {

        hits++;

      }

    }
  );


  const words =
    text
      .split(/\s+/)
      .filter(Boolean)
      .length;


  let score =
    Math.round(
      (
        hits /
        keywords.length
      ) *
      70
    );


  if (
    words >= 6
  ) {

    score +=
      15;

  }


  if (
    lower.includes("and")
    ||
    lower.includes("because")
  ) {

    score +=
      15;

  }


  score =
    Math.min(
      100,
      score
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

    words +

    "<br><br>" +

    (
      score >= 80

        ? "很好，你已经抓住经文核心。"

        : score >= 60

          ? "不错，继续让表达更完整。"

          : "先准确表达核心，不必追求复杂。"

    ) +

    "</div>";


  const listen =
    document.createElement(
      "button"
    );


  listen.type =
    "button";


  listen.textContent =
    "🔊 听我的英文答案";


  listen.style.marginTop =
    "8px";


  listen.addEventListener(
    "click",
    function() {

      speakText(
        text
      );

    }
  );


  result
    .firstElementChild
    .appendChild(
      listen
    );

}


function listenToMyAnswer() {

  const input =
    $("speakAnswer");


  if (!input) {

    return;

  }


  const text =
    input.value.trim();


  if (!text) {

    alert(
      "请先写下英文答案。"
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


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  GOLDEN_UNIT
    .verses
    .forEach(
      function(verse) {

        const div =
          document.createElement(
            "div"
          );


        div.className =
          "imitation-item";


        const sentence =
          document.createElement(
            "div"
          );


        sentence.className =
          "imitation-sentence";


        sentence.textContent =
          verse.text;


        div.appendChild(
          sentence
        );


        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.textContent =
          "🔊 听这一节";


        button.style.marginTop =
          "8px";


        button.addEventListener(
          "click",
          function() {

            speakText(
              verse.text
            );

          }
        );


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
   REREAD
========================================================= */

function goToReread() {

  renderRereadPassage();

  go(
    "reread"
  );

}


function setFeeling(
  value,
  button
) {

  currentFeeling =
    value;


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


  if (button) {

    button.classList.add(
      "selected"
    );

  }


  state.feeling =
    value;


  saveState();

}


/* =========================================================
   FINAL TEST
========================================================= */

function goToFinalTest() {

  renderFinal();

  go(
    "finalTest"
  );

}


function renderFinal() {

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
      function(
        item,
        index
      ) {

        const block =
          document.createElement(
            "div"
          );


        block.className =
          "notice-question";


        block.dataset.correct =
          item.answer;


        const title =
          document.createElement(
            "div"
          );


        title.className =
          "notice-question-title";


        title.textContent =
          (index + 1) +
          ". " +
          item.question;


        block.appendChild(
          title
        );


        item.options
          .forEach(
            function(
              option,
              optionIndex
            ) {

              const button =
                document.createElement(
                  "button"
                );


              button.type =
                "button";


              button.className =
                "option";


              button.textContent =
                option;


              button.addEventListener(
                "click",
                function() {

                  block
                    .querySelectorAll(
                      ".option"
                    )
                    .forEach(
                      function(
                        btn
                      ) {

                        btn.classList.remove(
                          "selected",
                          "correct",
                          "wrong"
                        );

                      }
                    );


                  button.classList.add(
                    "selected"
                  );


                  button.dataset.answer =
                    optionIndex;

                }
              );


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


function submitFinalTest() {

  const blocks =
    document.querySelectorAll(
      "#finalQuestions .notice-question"
    );


  if (!blocks.length) {

    return;

  }


  let correct =
    0;


  let answered =
    0;


  blocks.forEach(
    function(block) {

      const selected =
        block.querySelector(
          ".option.selected"
        );


      if (!selected) {

        return;

      }


      answered++;


      if (
        Number(
          selected.dataset.answer
        ) ===
        Number(
          block.dataset.correct
        )
      ) {

        correct++;

        selected.classList.add(
          "correct"
        );

      }

      else {

        selected.classList.add(
          "wrong"
        );

      }

    }
  );


  if (
    answered <
    blocks.length
  ) {

    alert(
      "请完成全部问题后再提交。"
    );

    return;

  }


  finalScore =
    Math.round(
      (
        correct /
        blocks.length
      ) *
      100
    );


  state.final =
    finalScore;


  saveState();


  const result =
    $("finalResult");


  if (result) {

    result.classList.remove(
      "hidden"
    );


    result.innerHTML =

      "<div class='success'>" +

      "<strong>" +

      "第二次理解：" +

      finalScore +

      "%</strong>" +

      "</div>";

  }


  setTimeout(
    function() {

      showResult();

    },
    600
  );

}


/* =========================================================
   RESULT
========================================================= */

function showResult() {

  $("baselineScore")
    .textContent =
    (
      state.baseline ??
      baselineScore
    ) +
    "%";


  $("finalScore")
    .textContent =
    finalScore +
    "%";


  const first =
    Number(
      state.baseline ||
      baselineScore ||
      0
    );


  const improvement =
    finalScore -
    first;


  const box =
    $("improvementBox");


  if (box) {

    if (
      improvement > 0
    ) {

      box.innerHTML =

        "<strong>" +

        "理解提升 +" +

        improvement +

        "%</strong>" +

        "<div>" +

        "训练后，你对这段英文经文的直接理解有所提升。" +

        "</div>";

    }

    else if (
      improvement === 0
    ) {

      box.innerHTML =

        "<strong>" +

        "理解保持不变" +

        "</strong>" +

        "<div>" +

        "继续通过间隔复习巩固。" +

        "</div>";

    }

    else {

      box.innerHTML =

        "<strong>" +

        "这一次没有提升" +

        "</strong>" +

        "<div>" +

        "建议再次听读。" +

        "</div>";

    }

  }


  state.completed =
    true;


  state.completedAt =
    new Date()
      .toISOString();


  state.reviews = [

    addDays(
      1
    ),

    addDays(
      3
    ),

    addDays(
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
  days
) {

  const date =
    new Date();


  date.setDate(
    date.getDate() +
    days
  );


  return date
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
    !state.reviews ||
    !state.reviews.length
  ) {

    container.innerHTML =
      "<div class='muted'>" +

      "完成黄金训练后，" +

      "<br>" +

      "Day 1 / Day 3 / Day 7 会显示在这里。" +

      "</div>";

    return;

  }


  container.innerHTML =
    "";


  state.reviews
    .forEach(
      function(date, index) {

        const row =
          document.createElement(
            "div"
          );


        row.className =
          "review-row";


        const day =
          index === 0
            ? 1
            : index === 1
              ? 3
              : 7;


        const strong =
          document.createElement(
            "strong"
          );


        strong.textContent =
          "Day " +
          day;


        const span =
          document.createElement(
            "span"
          );


        span.textContent =
          date;


        row.appendChild(
          strong
        );


        row.appendChild(
          span
        );


        container.appendChild(
          row
        );

      }
    );

}


/* =========================================================
   PUBLIC FUNCTIONS
   保留全局函数，兼容已有页面
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
