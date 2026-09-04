/* =========================================================
   EBRM V0.7.1
   Golden Training Unit
   John 1:1–5

   GitHub Pages 独立版
   ---------------------------------------------------------
   修复：
   1. 所有 onclick 全局函数
   2. 页面初始化
   3. HOME / BASELINE / READ
   4. NOTICE
   5. DIRECT COMPREHENSION
   6. SPEAK
   7. RE-READ
   8. FINAL TEST
   9. REVIEW
   10. 朗读
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
        "EBRM_V071_STATE",

    VOICE_KEY:
        "EBRM_V071_VOICE"
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
            word: "Word",
            meaning: "道",
            english: "the Word"
        },

        {
            word: "beginning",
            meaning: "起初；开始",
            english: "the start"
        },

        {
            word: "life",
            meaning: "生命",
            english: "life"
        },

        {
            word: "light",
            meaning: "光",
            english: "light"
        },

        {
            word: "darkness",
            meaning: "黑暗",
            english: "darkness"
        },

        {
            word: "overcome",
            meaning: "胜过；制伏",
            english: "to defeat"
        }

    ],


    structures: [

        {
            pattern:
                "In the beginning was the Word.",

            explanation:
                "时间背景在前，核心主语 Word 在后。"
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
                "in him 放在前面，突出生命所在的位置。"
        },

        {
            pattern:
                "The light shines in the darkness.",

            explanation:
                "主语 + 动词 + 地点/范围。"
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

let currentPassage = null;

let currentVerseIndex = 0;

let speechRate =
    CONFIG.NORMAL_RATE;

let selectedVoice = null;

let continuousReading = false;

let repeatCurrentVerse = false;

let baselineScore = 0;

let finalScore = 0;

let baselineSubmitted = false;

let finalSubmitted = false;

let currentFeeling = 0;

let noticeAnswers = {};

let directAnswers = {};

let state = loadState();


/* =========================================================
   LOAD STATE
========================================================= */

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

        completed: false,

        baseline: 0,

        final: 0,

        feeling: 0,

        completedAt: null,

        reviewDates: []

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
            "Save state error:",
            error
        );

    }

}


/* =========================================================
   HELPERS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function escapeHTML(value) {

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


function safeText(value) {

    return String(
        value ?? ""
    );

}


/* =========================================================
   INIT
========================================================= */

function init() {

    loadSavedScores();

    renderBaselineQuestions();

    renderFinalQuestions();

    renderHomeProgress();

    initSpeech();

}


/* =========================================================
   LOAD SAVED SCORES
========================================================= */

function loadSavedScores() {

    if (
        typeof state.baseline ===
        "number"
    ) {

        baselineScore =
            state.baseline;

        if (
            baselineScore > 0
        ) {

            baselineSubmitted =
                true;

        }

    }


    if (
        typeof state.final ===
        "number"
    ) {

        finalScore =
            state.final;

        if (
            finalScore > 0
        ) {

            finalSubmitted =
                true;

        }

    }


    currentFeeling =
        Number(
            state.feeling || 0
        );

}


/* =========================================================
   HOME PROGRESS
========================================================= */

function renderHomeProgress() {

    const bar =
        $("goldenProgressBar");

    const text =
        $("goldenProgressText");


    let progress = 0;


    if (
        baselineSubmitted
    ) {

        progress = 15;

    }


    if (
        state.completed
    ) {

        progress = 100;

    }


    if (
        bar
    ) {

        bar.style.width =
            progress + "%";

    }


    if (
        text
    ) {

        text.textContent =
            progress + "%";

    }

}


/* =========================================================
   START
========================================================= */

function startGoldenUnit() {

    currentPassage = null;

    currentVerseIndex = 0;

    showScreen("read");

    loadPassage();

}


function startBaseline() {

    renderBaselineQuestions();

    showScreen("baseline");

}


/* =========================================================
   NAVIGATION
========================================================= */

function showScreen(
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
            "Screen not found:",
            screenId
        );

        return;

    }


    target.classList.add(
        "active"
    );


    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });


    if (
        screenId ===
        "review"
    ) {

        renderReviews();

    }


    if (
        screenId ===
        "read"
    ) {

        setTimeout(
            function() {

                renderVoicePanel();

            },
            100
        );

    }

}


/* =========================================================
   BASELINE
========================================================= */

function renderBaselineQuestions() {

    const container =
        $("baselineQuestions");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const questions = [

        {
            question:
                "What was with God in the beginning?",

            options: [
                "The Word",
                "The darkness",
                "John"
            ],

            answer: 0
        },

        {
            question:
                "What was in the Word?",

            options: [
                "Life",
                "Darkness",
                "Death"
            ],

            answer: 0
        },

        {
            question:
                "Where does the light shine?",

            options: [
                "In the darkness",
                "In Rome",
                "In the temple"
            ],

            answer: 0
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
                item.question;


            block.appendChild(
                title
            );


            item.options.forEach(
                function(option, optionIndex) {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.className =
                        "option";


                    button.type =
                        "button";


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

    const container =
        $("baselineQuestions");


    if (!container) {

        return;

    }


    const blocks =
        container.querySelectorAll(
            ".notice-question"
        );


    let correct = 0;

    let answered = 0;


    blocks.forEach(
        function(block) {

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
                    Number(
                        block.dataset.correct
                    )
                ) {

                    correct++;

                }

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
            ) * 100
        );


    baselineSubmitted =
        true;


    state.baseline =
        baselineScore;


    saveState();


    const result =
        $("baselineResult");


    if (result) {

        result.classList.remove(
            "hidden"
        );


        result.innerHTML =
            "<div class='success'>" +

            "<strong>" +

            "第一次理解：" +

            baselineScore +

            "%</strong>" +

            "<br><br>" +

            "现在开始精读。" +

            "</div>";

    }


    renderHomeProgress();

}


/* =========================================================
   BIBLE API
========================================================= */

async function loadPassage() {

    const box =
        $("passageText");


    if (!box) {

        return;

    }


    box.innerHTML =
        "<div>正在读取英文圣经……</div>";


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
                    method: "GET",
                    cache: "no-store"
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
                                safeText(
                                    item.text
                                ).trim()

                        };

                    }
                )

        };


        renderPassage();

        renderVoicePanel();

        renderAudioControls();

        renderImitationList();

        renderRereadPassage();


    } catch (error) {

        console.error(
            "EBRM Bible API:",
            error
        );


        box.innerHTML =

            "<div class='success'>" +

            "<strong>" +

            "经文读取失败" +

            "</strong>" +

            "<br><br>" +

            escapeHTML(
                error.message
            ) +

            "<br><br>" +

            "请刷新页面重试。" +

            "</div>";

    }

}


/* =========================================================
   RENDER PASSAGE
========================================================= */

function renderPassage() {

    const box =
        $("passageText");


    if (
        !box ||
        !currentPassage
    ) {

        return;

    }


    box.innerHTML = "";


    currentPassage
        .verses
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


                span.innerHTML =
                    "<sup>" +
                    escapeHTML(
                        verse.verse
                    ) +
                    "</sup> " +
                    escapeHTML(
                        verse.text
                    );


                span.addEventListener(
                    "click",
                    function() {

                        playVerse(
                            index
                        );

                    }
                );


                box.appendChild(
                    span
                );

            }
        );


    highlightVerse(
        currentVerseIndex
    );

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


    container.innerHTML = "";


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "eyebrow";


    title.textContent =
        "LISTENING TRAINING";


    container.appendChild(
        title
    );


    const controls =
        document.createElement(
            "div"
        );


    controls.className =
        "audio-controls";


    const buttons = [

        [
            "🔊 听整段",
            speakPassage
        ],

        [
            "▶ 连续逐节",
            startContinuousReading
        ],

        [
            "◀ 上一节",
            playPreviousVerse
        ],

        [
            "下一节 ▶",
            playNextVerse
        ],

        [
            "🔁 当前节",
            toggleRepeatCurrentVerse
        ],

        [
            "🐢 正常/慢速",
            toggleSlow
        ],

        [
            "⏹ 停止",
            stopSpeech
        ]

    ];


    buttons.forEach(
        function(item) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                item[0];


            button.addEventListener(
                "click",
                function() {

                    item[1]();

                }
            );


            controls.appendChild(
                button
            );

        }
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
        "<select id='voiceSelect' " +
        "style='width:100%;padding:10px;margin-top:8px;border:1px solid #ddd;border-radius:10px;background:white'>" +
        "</select>" +
        "<div style='margin-top:7px;color:#777;font-size:11px'>" +
        "声音由当前设备和浏览器提供。" +
        "</div>";


    const select =
        $("voiceSelect");


    if (
        !window.speechSynthesis
    ) {

        return;

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

            const found =
                voices.find(
                    function(voice) {

                        return (
                            voice.name ===
                            select.value
                        );

                    }
                );


            if (found) {

                selectedVoice =
                    found;


                localStorage.setItem(
                    CONFIG.VOICE_KEY,
                    found.name
                );

            }

        }
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


            updateSpeechStatus(
                "朗读完成"
            );


            if (callback) {

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

    if (
        !currentPassage
    ) {

        alert(
            "请先等待经文加载完成。"
        );

        return;

    }


    const text =
        currentPassage
            .verses
            .map(
                function(verse) {

                    return verse.text;

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
                        "✓ 连续逐节完成"
                    );

                }

            }

        }

    );

}


function startContinuousReading() {

    if (
        !currentPassage
    ) {

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
        "▶ 连续逐节朗读中……"
    );


    speakVerse(
        0
    );

}


function toggleRepeatCurrentVerse() {

    if (
        !currentPassage
    ) {

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

    if (
        !currentPassage
    ) {

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

    if (
        !currentPassage
    ) {

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
        $("speedLabel");


    if (label) {

        label.textContent =

            speechRate ===
            CONFIG.NORMAL_RATE

                ? "正常速度"

                : "慢速";

    }


    updateSpeechStatus(

        speechRate ===
        CONFIG.NORMAL_RATE

            ? "已切换到正常速度"

            : "已切换到慢速"

    );

}


function updateSpeechStatus(
    message
) {

    const status =
        $("speechStatus");


    if (status) {

        status.textContent =
            message;

    }

}


/* =========================================================
   VOICE INIT
========================================================= */

function initSpeech() {

    if (
        !window.speechSynthesis
    ) {

        return;

    }


    selectedVoice =
        findSavedVoice();


    speechSynthesis.onvoiceschanged =
        function() {

            selectedVoice =
                findSavedVoice();

            renderVoicePanel();

        };

}


function findSavedVoice() {

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


    if (saved) {

        const match =
            voices.find(
                function(voice) {

                    return (
                        voice.name ===
                        saved
                    );

                }
            );


        if (match) {

            return match;

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
        "fred",
        "male"

    ];


    const likelyMale =
        voices.find(
            function(voice) {

                const name =
                    voice.name
                        .toLowerCase();


                return names.some(
                    function(word) {

                        return name
                            .includes(word);

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
   NOTICE
========================================================= */

function goToNotice() {

    renderNotice();

    showScreen(
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


                            button.className =
                                "option";


                            button.type =
                                "button";


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

    showScreen(
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


    GOLDEN_UNIT.vocabulary
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


                button.className =
                    "mini";


                button.type =
                    "button";


                button.textContent =
                    "🔊 发音";


                button.onclick =
                    function() {

                        speakText(
                            item.word
                        );

                    };


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

    showScreen(
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


    GOLDEN_UNIT.structures
        .forEach(
            function(item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "structure-item";


                div.innerHTML =

                    "<div class='structure-pattern'>" +

                    escapeHTML(
                        item.pattern
                    ) +

                    "</div>" +

                    "<div class='structure-explanation'>" +

                    escapeHTML(
                        item.explanation
                    ) +

                    "</div>";


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

    showScreen(
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


    directAnswers =
        {};


    GOLDEN_UNIT.direct
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


                            button.className =
                                "option";


                            button.type =
                                "button";


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


                                    directAnswers[
                                        index
                                    ] =
                                        optionIndex;


                                    updateDirectScore();

                                };


                            block.appendChild(
                                button
                            );

                        }
                    );


                const chineseButton =
                    document.createElement(
                        "button"
                    );


                chineseButton.type =
                    "button";


                chineseButton.textContent =
                    "中文确认";


                chineseButton.style.marginTop =
                    "8px";


                chineseButton.onclick =
                    function() {

                        let box =
                            block.querySelector(
                                ".chinese-confirm"
                            );


                        if (!box) {

                            box =
                                document.createElement(
                                    "div"
                                );


                            box.className =
                                "success";


                            box.style.marginTop =
                                "8px";


                            box.textContent =
                                item.chinese;


                            block.appendChild(
                                box
                            );

                        }

                        else {

                            box.remove();

                        }

                    };


                block.appendChild(
                    chineseButton
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


    let correct = 0;

    let answered = 0;


    GOLDEN_UNIT.direct
        .forEach(
            function(item, index) {

                if (
                    directAnswers[index] !==
                    undefined
                ) {

                    answered++;


                    if (
                        directAnswers[index] ===
                        item.answer
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

        GOLDEN_UNIT.direct.length +

        " · 已回答 " +

        answered +

        "/" +

        GOLDEN_UNIT.direct.length;

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

    showScreen(
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


    let hits = 0;


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
                hits /
                keywords.length
            ) * 70
        );


    if (
        wordCount >= 6
    ) {

        score +=
            15;

    }


    if (
        lower.includes("and") ||
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

        wordCount +

        "<br><br>" +

        (
            score >= 80

                ? "很好，你已经能够抓住经文核心。"

                : score >= 60

                    ? "不错，继续让表达更完整。"

                    : "先准确表达核心内容，不必追求复杂。"

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


    listen.onclick =
        function() {

            speakText(
                text
            );

        };


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


    if (
        !container ||
        !currentPassage
    ) {

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


                const sentence =
                    document.createElement(
                        "div"
                    );


                sentence.className =
                    "imitation-sentence";


                sentence.textContent =
                    verse.text;


                item.appendChild(
                    sentence
                );


                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


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

    showScreen(
        "reread"
    );

}


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
        "";


    currentPassage
        .verses
        .forEach(
            function(verse) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.style.marginBottom =
                    "18px";


                div.textContent =
                    verse.verse +
                    " " +
                    verse.text;


                div.onclick =
                    function() {

                        speakText(
                            verse.text
                        );

                    };


                div.style.cursor =
                    "pointer";


                container.appendChild(
                    div
                );

            }
        );

}


/* =========================================================
   FEELING
========================================================= */

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


    if (button) {

        button.classList.add(
            "selected"
        );

    }


    state.feeling =
        score;


    saveState();

}


/* =========================================================
   FINAL TEST
========================================================= */

function goToFinalTest() {

    renderFinalQuestions();

    showScreen(
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


    GOLDEN_UNIT.direct
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


function submitFinalTest() {

    const blocks =
        document.querySelectorAll(
            "#finalQuestions .notice-question"
        );


    if (!blocks.length) {

        return;

    }


    let correct = 0;

    let answered = 0;


    blocks.forEach(
        function(block) {

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
                    Number(
                        block.dataset.correct
                    )
                ) {

                    correct++;

                }

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
            ) * 100
        );


    finalSubmitted =
        true;


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

            showFinalResult();

        },
        600
    );

}


/* =========================================================
   FINAL RESULT
========================================================= */

function showFinalResult() {

    const baseline =
        $("baselineScore");


    const final =
        $("finalScore");


    const improvementBox =
        $("improvementBox");


    if (baseline) {

        baseline.textContent =
            baselineScore +
            "%";

    }


    if (final) {

        final.textContent =
            finalScore +
            "%";

    }


    const improvement =
        finalScore -
        baselineScore;


    if (
        improvementBox
    ) {

        if (
            improvement > 0
        ) {

            improvementBox.innerHTML =
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

            improvementBox.innerHTML =
                "<strong>" +
                "理解保持不变" +
                "</strong>" +
                "<div>" +
                "继续进行间隔复习。" +
                "</div>";

        }

        else {

            improvementBox.innerHTML =
                "<strong>" +
                "这一次没有提升" +
                "</strong>" +
                "<div>" +
                "建议重新听读后再次复习。" +
                "</div>";

        }

    }


    state.completed =
        true;


    state.completedAt =
        new Date()
            .toISOString();


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

    renderHomeProgress();


    showScreen(
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
   REVIEWS
========================================================= */

function renderReviews() {

    const container =
        $("reviewList");


    if (!container) {

        return;

    }


    if (
        !state.reviewDates ||
        !state.reviewDates.length
    ) {

        container.innerHTML =
            "<div class='muted'>" +
            "完成黄金训练后，这里会显示 Day 1 / Day 3 / Day 7。" +
            "</div>";

        return;

    }


    container.innerHTML =
        "";


    state.reviewDates
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


                row.innerHTML =

                    "<strong>" +
                    "Day " +
                    day +
                    "</strong>" +

                    "<span>" +
                    date +
                    "</span>";


                container.appendChild(
                    row
                );

            }
        );

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.go =
    showScreen;

window.showScreen =
    showScreen;

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
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);
