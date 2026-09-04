/* =========================================================
   EBRM V0.6.1
   English Bible Reading Model

   GitHub Pages 独立版
   修复 SyntaxError
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const CONFIG = {
    BIBLE_API: "https://bible-api.com",
    TRANSLATION: "web",
    SPEECH_LANG: "en-US",
    NORMAL_RATE: 0.88,
    SLOW_RATE: 0.62,
    STATE_KEY: "EBRM_V061_STATE"
};


/* =========================================================
   TRAINING DATA
   ========================================================= */

const UNITS = [
    {
        id: "J1-01",
        title: "The Word",
        reference: "John 1:1–5",
        start: 1,
        end: 5,

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
                meaning: "胜过",
                english: "to defeat"
            }
        ],

        structures: [
            {
                pattern: "In the beginning was the Word.",
                explanation: "先出现时间背景，再出现主语。"
            },
            {
                pattern: "The Word was with God.",
                explanation: "was with 表达关系。"
            },
            {
                pattern: "The Word was God.",
                explanation: "be 动词连接主语和表语。"
            },
            {
                pattern: "The light shines in the darkness.",
                explanation: "主语 + 动词 + 介词短语。"
            }
        ],

        notice: [
            {
                question: "What word is repeated in the passage?",
                options: ["Word", "Temple", "King"],
                answer: 0
            },
            {
                question: "What two ideas are contrasted?",
                options: [
                    "Light and darkness",
                    "King and servant",
                    "Life and money"
                ],
                answer: 0
            },
            {
                question: "Who is at the center of the passage?",
                options: ["John", "The Word", "Moses"],
                answer: 1
            }
        ],

        directComprehension: [
            {
                question: "Who was with God in the beginning?",
                hint: "先根据英文问题直接找答案。",
                options: [
                    "The Word",
                    "John",
                    "Moses"
                ],
                answer: 0,
                chinese: "道与神同在。"
            },
            {
                question: "What was in the Word?",
                hint: "注意 in the Word。",
                options: [
                    "Darkness",
                    "Life",
                    "Death"
                ],
                answer: 1,
                chinese: "生命在祂里面。"
            },
            {
                question: "What shines in the darkness?",
                hint: "注意 shines。",
                options: [
                    "The law",
                    "The temple",
                    "The light"
                ],
                answer: 2,
                chinese: "光照在黑暗里。"
            }
        ],

        context:
            "John opens his Gospel by presenting the Word in relation to God, creation, life, and light.",

        production:
            "In simple English, explain who the Word is."
    },

    {
        id: "J1-02",
        title: "The Witness",
        reference: "John 1:6–13",
        start: 6,
        end: 13,

        vocabulary: [
            {
                word: "witness",
                meaning: "见证人",
                english: "a person who gives testimony"
            },
            {
                word: "believe",
                meaning: "相信",
                english: "to trust"
            },
            {
                word: "receive",
                meaning: "接受；领受",
                english: "to accept"
            },
            {
                word: "true",
                meaning: "真实的",
                english: "real; genuine"
            },
            {
                word: "children",
                meaning: "儿女",
                english: "sons and daughters"
            }
        ],

        structures: [
            {
                pattern: "There was a man sent from God.",
                explanation: "There was 用于引出一个人物。"
            },
            {
                pattern: "He came as a witness.",
                explanation: "as + 身份。"
            },
            {
                pattern: "those who believe",
                explanation: "who 引导关系从句。"
            }
        ],

        notice: [
            {
                question: "What was John's role?",
                options: [
                    "Witness",
                    "King",
                    "Savior"
                ],
                answer: 0
            },
            {
                question: "What response is emphasized?",
                options: [
                    "Receive and believe",
                    "Hide",
                    "Fight"
                ],
                answer: 0
            }
        ],

        directComprehension: [
            {
                question: "Why did John come?",
                hint: "先找 to bear witness。",
                options: [
                    "To bear witness to the light",
                    "To become the light",
                    "To build a temple"
                ],
                answer: 0,
                chinese: "约翰来为光作见证。"
            },
            {
                question: "What happens to those who receive the Word?",
                hint: "观察 children of God。",
                options: [
                    "They become children of God",
                    "They become angels",
                    "They become kings"
                ],
                answer: 0,
                chinese: "他们成为神的儿女。"
            }
        ],

        context:
            "John the Baptist is introduced as a witness who points people toward the light.",

        production:
            "Explain John's role in simple English."
    },

    {
        id: "J1-03",
        title: "The Word Became Flesh",
        reference: "John 1:14–18",
        start: 14,
        end: 18,

        vocabulary: [
            {
                word: "flesh",
                meaning: "肉身",
                english: "human bodily existence"
            },
            {
                word: "dwelt",
                meaning: "住在",
                english: "lived among"
            },
            {
                word: "glory",
                meaning: "荣耀",
                english: "greatness and honor"
            },
            {
                word: "grace",
                meaning: "恩典",
                english: "undeserved kindness"
            },
            {
                word: "truth",
                meaning: "真理",
                english: "what is true"
            }
        ],

        structures: [
            {
                pattern: "The Word became flesh.",
                explanation: "became + 名词表示成为。"
            },
            {
                pattern: "We have seen his glory.",
                explanation: "现在完成时表示已经看见。"
            },
            {
                pattern: "full of grace and truth",
                explanation: "full of 表示充满。"
            }
        ],

        notice: [
            {
                question: "What major change happens?",
                options: [
                    "The Word became flesh",
                    "John became king",
                    "Light became darkness"
                ],
                answer: 0
            },
            {
                question: "Which pair is emphasized?",
                options: [
                    "Grace and truth",
                    "Law and temple",
                    "King and army"
                ],
                answer: 0
            }
        ],

        directComprehension: [
            {
                question: "What did the Word become?",
                hint: "找 become 后面的词。",
                options: [
                    "Flesh",
                    "Light",
                    "Darkness"
                ],
                answer: 0,
                chinese: "道成了肉身。"
            },
            {
                question: "What did the witnesses see?",
                hint: "注意 have seen。",
                options: [
                    "His glory",
                    "His temple",
                    "His childhood"
                ],
                answer: 0,
                chinese: "他们看见了祂的荣耀。"
            }
        ],

        context:
            "John 1:14 presents the incarnation: the Word became flesh and revealed glory, grace, and truth.",

        production:
            "Explain what 'the Word became flesh' means."
    },

    {
        id: "J1-04",
        title: "John's Testimony",
        reference: "John 1:19–28",
        start: 19,
        end: 28,

        vocabulary: [
            {
                word: "testimony",
                meaning: "见证",
                english: "testimony"
            },
            {
                word: "Christ",
                meaning: "基督",
                english: "the Messiah"
            },
            {
                word: "prophet",
                meaning: "先知",
                english: "a person who speaks God's message"
            },
            {
                word: "voice",
                meaning: "声音",
                english: "voice"
            },
            {
                word: "baptize",
                meaning: "施洗",
                english: "to baptize"
            }
        ],

        structures: [
            {
                pattern: "Who are you?",
                explanation: "寻找身份。"
            },
            {
                pattern: "I am not the Christ.",
                explanation: "否定身份。"
            },
            {
                pattern: "I am the voice...",
                explanation: "说明身份与使命。"
            }
        ],

        notice: [
            {
                question: "What does John deny?",
                options: [
                    "That he is the Christ",
                    "That he is a witness",
                    "That he baptizes"
                ],
                answer: 0
            },
            {
                question: "How does John describe himself?",
                options: [
                    "The voice in the wilderness",
                    "The Messiah",
                    "The King"
                ],
                answer: 0
            }
        ],

        directComprehension: [
            {
                question: "Was John the Christ?",
                hint: "这是最直接的问题。",
                options: [
                    "Yes",
                    "No",
                    "We do not know"
                ],
                answer: 1,
                chinese: "不是。"
            },
            {
                question: "What did John call himself?",
                hint: "注意 voice。",
                options: [
                    "The voice in the wilderness",
                    "The Christ",
                    "The King"
                ],
                answer: 0,
                chinese: "他称自己是旷野中的声音。"
            }
        ],

        context:
            "John defines his identity in relation to the coming Christ and refuses to take the glory for himself.",

        production:
            "Describe John's mission in simple English."
    },

    {
        id: "J1-05",
        title: "The Lamb of God",
        reference: "John 1:29–34",
        start: 29,
        end: 34,

        vocabulary: [
            {
                word: "Lamb",
                meaning: "羔羊",
                english: "a lamb"
            },
            {
                word: "sin",
                meaning: "罪",
                english: "sin"
            },
            {
                word: "Spirit",
                meaning: "圣灵",
                english: "the Holy Spirit"
            },
            {
                word: "remain",
                meaning: "停留",
                english: "stay"
            }
        ],

        structures: [
            {
                pattern: "Behold, the Lamb of God.",
                explanation: "Behold 用于引起注意。"
            },
            {
                pattern: "who takes away the sin of the world",
                explanation: "who 引导关系从句。"
            },
            {
                pattern: "the Spirit descend and remain",
                explanation: "多个动作构成见证过程。"
            }
        ],

        notice: [
            {
                question: "What title does John give Jesus?",
                options: [
                    "The Lamb of God",
                    "The Prophet",
                    "The Voice"
                ],
                answer: 0
            },
            {
                question: "What does the Lamb take away?",
                options: [
                    "Sin",
                    "The temple",
                    "The law"
                ],
                answer: 0
            }
        ],

        directComprehension: [
            {
                question: "Who is Jesus according to John?",
                hint: "注意 John 给出的称号。",
                options: [
                    "The Lamb of God",
                    "The prophet only",
                    "The Roman king"
                ],
                answer: 0,
                chinese: "耶稣是神的羔羊。"
            },
            {
                question: "What does the Lamb take away?",
                hint: "注意 takes away 后面的宾语。",
                options: [
                    "The law",
                    "The sin of the world",
                    "The temple"
                ],
                answer: 1,
                chinese: "除去世人的罪。"
            }
        ],

        context:
            "John identifies Jesus as the Lamb of God and connects him with the work of the Spirit.",

        production:
            "Explain what John says about Jesus."
    },

    {
        id: "J1-06",
        title: "Come and See",
        reference: "John 1:35–42",
        start: 35,
        end: 42,

        vocabulary: [
            {
                word: "disciple",
                meaning: "门徒",
                english: "a follower"
            },
            {
                word: "follow",
                meaning: "跟随",
                english: "to go after"
            },
            {
                word: "Rabbi",
                meaning: "拉比",
                english: "teacher"
            },
            {
                word: "Messiah",
                meaning: "弥赛亚",
                english: "the promised Messiah"
            },
            {
                word: "stay",
                meaning: "停留",
                english: "remain"
            }
        ],

        structures: [
            {
                pattern: "What are you seeking?",
                explanation: "现在进行时询问当前寻找什么。"
            },
            {
                pattern: "Come and you will see.",
                explanation: "邀请 + 结果。"
            },
            {
                pattern: "We have found the Messiah.",
                explanation: "现在完成时。"
            }
        ],

        notice: [
            {
                question: "What action begins the discipleship movement?",
                options: [
                    "They follow Jesus",
                    "They hide",
                    "They leave"
                ],
                answer: 0
            },
            {
                question: "What invitation does Jesus give?",
                options: [
                    "Come and see",
                    "Go away",
                    "Stay outside"
                ],
                answer: 0
            }
        ],

        directComprehension: [
            {
                question: "What did the disciples do after hearing John?",
                hint: "注意 followed。",
                options: [
                    "They followed Jesus",
                    "They went home",
                    "They followed Moses"
                ],
                answer: 0,
                chinese: "他们跟随了耶稣。"
            },
            {
                question: "What did Jesus say?",
                hint: "注意 Jesus 的邀请。",
                options: [
                    "Come and see",
                    "Go and hide",
                    "Wait outside"
                ],
                answer: 0,
                chinese: "来，你们就必看见。"
            }
        ],

        context:
            "The movement from testimony to discipleship is clear: hear, follow, stay, and invite others.",

        production:
            "Write one sentence about following Jesus."
    },

    {
        id: "J1-07",
        title: "Follow Me",
        reference: "John 1:43–51",
        start: 43,
        end: 51,

        vocabulary: [
            {
                word: "follow",
                meaning: "跟随",
                english: "to go after"
            },
            {
                word: "Nazareth",
                meaning: "拿撒勒",
                english: "Nazareth"
            },
            {
                word: "Nathanael",
                meaning: "拿但业",
                english: "Nathanael"
            },
            {
                word: "heaven",
                meaning: "天",
                english: "heaven"
            },
            {
                word: "angels",
                meaning: "天使",
                english: "angels"
            }
        ],

        structures: [
            {
                pattern: "Follow me.",
                explanation: "祈使句呼召。"
            },
            {
                pattern: "Can anything good come out of Nazareth?",
                explanation: "Can + 主语 + 动词。"
            },
            {
                pattern: "You will see heaven opened.",
                explanation: "will 表达未来。"
            }
        ],

        notice: [
            {
                question: "What does Jesus say to Philip?",
                options: [
                    "Follow me",
                    "Go home",
                    "Wait for John"
                ],
                answer: 0
            },
            {
                question: "What does Philip do?",
                options: [
                    "He finds Nathanael",
                    "He leaves",
                    "He hides"
                ],
                answer: 0
            },
            {
                question: "What future vision is promised?",
                options: [
                    "Heaven opened",
                    "A new temple",
                    "The Roman army"
                ],
                answer: 0
            }
        ],

        directComprehension: [
            {
                question: "Who said, 'Follow me'?",
                hint: "先直接找人物。",
                options: [
                    "Jesus",
                    "John",
                    "Nathanael"
                ],
                answer: 0,
                chinese: "耶稣说：跟从我。"
            },
            {
                question: "What did Nathanael recognize?",
                hint: "注意 Son of God。",
                options: [
                    "Jesus as the Son of God",
                    "Jesus as a Roman leader",
                    "Jesus as only a teacher"
                ],
                answer: 0,
                chinese: "拿但业承认耶稣是神的儿子。"
            }
        ],

        context:
            "Jesus calls Philip, Philip brings Nathanael, and the encounter moves toward recognition of Jesus' identity.",

        production:
            "Describe how Jesus calls Philip and how Philip responds."
    }
];


/* =========================================================
   STATE
========================================================= */

let currentUnit = null;
let currentPassage = null;
let currentVerseIndex = 0;
let speechRate = CONFIG.NORMAL_RATE;
let selectedVoice = null;
let continuousReading = false;
let repeatCurrentVerse = false;

let noticeAnswers = {};
let directAnswers = {};

let state = loadState();


function loadState() {

    try {

        const saved =
            localStorage.getItem(CONFIG.STATE_KEY);

        if (saved) {

            return JSON.parse(saved);

        }

    } catch (error) {

        console.warn(
            "State error:",
            error
        );

    }


    return {
        completed: {},
        reviews: {}
    };

}


function saveState() {

    localStorage.setItem(
        CONFIG.STATE_KEY,
        JSON.stringify(state)
    );

}


/* =========================================================
   HELPERS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeJS(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\r/g, "")
        .replace(/\n/g, "\\n");

}


/* =========================================================
   INIT
========================================================= */

function init() {

    renderHome();

    initSpeech();

}


function initSpeech() {

    if (
        !("speechSynthesis" in window)
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


/* =========================================================
   VOICE
========================================================= */

function chooseVoice() {

    const voices =
        speechSynthesis
            .getVoices()
            .filter(function(voice) {

                return (
                    voice.lang &&
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
                );

            });


    if (!voices.length) {

        return null;

    }


    const saved =
        localStorage.getItem(
            "EBRM_V061_VOICE"
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


    const preferredNames = [

        "david",
        "daniel",
        "alex",
        "george",
        "james",
        "mark",
        "guy",
        "fred",
        "male"

    ];


    const preferred =
        voices.find(
            function(voice) {

                const name =
                    voice.name
                        .toLowerCase();

                return preferredNames.some(
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


    return us || voices[0];

}


function renderVoicePanel() {

    const readScreen =
        $("read");


    if (!readScreen) {

        return;

    }


    let panel =
        $("ebrmVoicePanel");


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "ebrmVoicePanel";

        panel.className =
            "card";


        const passage =
            $("passageText");


        if (
            passage &&
            passage.parentNode
        ) {

            passage.parentNode
                .insertBefore(
                    panel,
                    passage
                );

        } else {

            readScreen.prepend(
                panel
            );

        }

    }


    const voices =
        speechSynthesis
            .getVoices()
            .filter(function(voice) {

                return (
                    voice.lang &&
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
                );

            });


    let options = "";


    voices.forEach(
        function(voice) {

            options +=
                "<option value=\"" +
                escapeHTML(
                    voice.name
                ) +
                "\"" +
                (
                    selectedVoice &&
                    selectedVoice.name ===
                    voice.name
                        ? " selected"
                        : ""
                ) +
                ">" +
                escapeHTML(
                    voice.name
                ) +
                " (" +
                escapeHTML(
                    voice.lang
                ) +
                ")" +
                "</option>";

        }
    );


    if (!options) {

        options =
            "<option>未检测到英文声音</option>";

    }


    panel.innerHTML =

        "<strong>🎙️ English Voice</strong>" +

        "<select " +
        "id=\"ebrmVoiceSelect\" " +
        "style=\"" +
        "width:100%;" +
        "padding:10px;" +
        "margin-top:8px;" +
        "border:1px solid #ddd;" +
        "border-radius:10px;" +
        "background:white;" +
        "\">" +

        options +

        "</select>" +

        "<div " +
        "style=\"" +
        "margin-top:7px;" +
        "color:#777;" +
        "font-size:12px;" +
        "\">" +
        "可用声音取决于当前设备和浏览器。" +
        "</div>";


    const select =
        $("ebrmVoiceSelect");


    if (select) {

        select.onchange =
            function() {

                const voicesNow =
                    speechSynthesis
                        .getVoices();


                selectedVoice =
                    voicesNow.find(
                        function(voice) {

                            return (
                                voice.name ===
                                select.value
                            );

                        }
                    );


                if (selectedVoice) {

                    localStorage.setItem(
                        "EBRM_V061_VOICE",
                        selectedVoice.name
                    );

                }

            };

    }

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
        !("speechSynthesis" in window)
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
                ".verse"
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

        };


    utterance.onerror =
        function(error) {

            console.warn(
                "Speech error:",
                error
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


    continuousReading = false;

    repeatCurrentVerse = false;


    const text =
        currentPassage.verses
            .map(function(item) {

                return item.text;

            })
            .join(" ");


    speakText(text);

}


function speakVerse(index) {

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


    const element =
        elements[index];


    speakText(
        currentPassage
            .verses[index]
            .text,
        element,
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
                    600
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

                } else {

                    continuousReading =
                        false;

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

        speakVerse(
            currentVerseIndex
        );

    } else {

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
        "speechSynthesis" in window
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

}


function toggleSlow() {

    if (
        speechRate ===
        CONFIG.NORMAL_RATE
    ) {

        speechRate =
            CONFIG.SLOW_RATE;

    } else {

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
        "<div class=\"loading\">" +
        "正在读取英文圣经……" +
        "</div>";


    const reference =
        "John 1:" +
        currentUnit.start +
        "-" +
        currentUnit.end;


    const url =
        CONFIG.BIBLE_API +
        "/" +
        encodeURIComponent(reference) +
        "?translation=" +
        CONFIG.TRANSLATION;


    try {

        const response =
            await fetch(
                url,
                {
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


    } catch (error) {

        box.innerHTML =

            "<div class=\"success\">" +

            "<strong>" +
            "经文读取失败" +
            "</strong>" +

            "<br><br>" +

            escapeHTML(
                error.message
            ) +

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


    currentPassage.verses
        .forEach(
            function(verse, index) {

                const element =
                    document.createElement(
                        "span"
                    );


                element.className =
                    "verse";


                element.dataset.index =
                    index;


                const number =
                    document.createElement(
                        "sup"
                    );


                number.textContent =
                    verse.verse;


                const text =
                    document.createTextNode(
                        " " +
                        verse.text
                    );


                element.appendChild(
                    number
                );


                element.appendChild(
                    text
                );


                element.addEventListener(
                    "click",
                    function() {

                        speakVerse(
                            index
                        );

                    }
                );


                box.appendChild(
                    element
                );


                box.appendChild(
                    document.createTextNode(
                        " "
                    )
                );

            }
        );


    addReadingControls();

    renderVoicePanel();

}


/* =========================================================
   READING CONTROLS
========================================================= */

function addReadingControls() {

    const existing =
        $("ebrmReadingControls");


    if (existing) {

        existing.remove();

    }


    const passage =
        $("passageText");


    if (!passage) {

        return;

    }


    const controls =
        document.createElement(
            "div"
        );


    controls.id =
        "ebrmReadingControls";

    controls.className =
        "audio-controls";


    controls.innerHTML =

        "<button onclick=\"speakPassage()\">" +
        "🔊 整段" +
        "</button>" +

        "<button onclick=\"startContinuousReading()\">" +
        "▶️ 连续逐节" +
        "</button>" +

        "<button onclick=\"playPreviousVerse()\">" +
        "◀ 上一节" +
        "</button>" +

        "<button onclick=\"playNextVerse()\">" +
        "下一节 ▶" +
        "</button>" +

        "<button onclick=\"toggleRepeatCurrentVerse()\">" +
        "🔁 当前节" +
        "</button>" +

        "<button onclick=\"toggleSlow()\">" +
        "🐢 <span id=\"speedLabel\">正常速度</span>" +
        "</button>" +

        "<button onclick=\"stopSpeech()\">" +
        "⏹ 停止" +
        "</button>";


    passage.parentNode.insertBefore(
        controls,
        passage.nextSibling
    );

}


/* =========================================================
   NOTICE
========================================================= */

function renderNotice() {

    injectNoticeSection();

}


function injectNoticeSection() {

    const read =
        $("read");


    if (!read) {

        return;

    }


    let section =
        $("ebrmNoticeSection");


    if (!section) {

        section =
            document.createElement(
                "div"
            );


        section.id =
            "ebrmNoticeSection";

        section.className =
            "card";


        read.appendChild(
            section
        );

    }


    section.innerHTML =

        "<div class=\"eyebrow\">" +
        "NOTICE" +
        "</div>" +

        "<h3>" +
        "先观察，不急着翻译" +
        "</h3>" +

        "<p class=\"muted\">" +
        "注意重复、对比、人物、动作和关系。" +
        "</p>" +

        "<div id=\"noticeList\"></div>" +

        "<div id=\"noticeScore\" " +
        "style=\"margin-top:12px;font-weight:700\">" +
        "</div>" +

        "<button " +
        "class=\"primary\" " +
        "style=\"width:100%;margin-top:12px\" " +
        "onclick=\"scrollToDirect()\">" +
        "进入 Direct Comprehension →" +
        "</button>";


    const list =
        $("noticeList");


    if (!list) {

        return;

    }


    noticeAnswers = {};


    currentUnit.notice
        .forEach(
            function(item, index) {

                const block =
                    document.createElement(
                        "div"
                    );


                block.className =
                    "notice-question";


                block.style.padding =
                    "14px 0";


                block.style.borderTop =
                    "1px solid #eee";


                const title =
                    document.createElement(
                        "div"
                    );


                title.innerHTML =
                    "<strong>" +
                    "NOTICE " +
                    (index + 1) +
                    "</strong>";


                block.appendChild(
                    title
                );


                const question =
                    document.createElement(
                        "div"
                    );


                question.textContent =
                    item.question;


                question.style.margin =
                    "7px 0 10px";


                block.appendChild(
                    question
                );


                item.options
                    .forEach(
                        function(option, optionIndex) {

                            const button =
                                document.createElement(
                                    "button"
                                );


                            button.textContent =
                                option;


                            button.style.display =
                                "block";


                            button.style.width =
                                "100%";


                            button.style.textAlign =
                                "left";


                            button.style.padding =
                                "10px";


                            button.style.margin =
                                "6px 0";


                            button.style.border =
                                "1px solid #ddd";


                            button.style.borderRadius =
                                "9px";


                            button.style.background =
                                "white";


                            button.addEventListener(
                                "click",
                                function() {

                                    answerNotice(
                                        index,
                                        optionIndex,
                                        button
                                    );

                                }
                            );


                            block.appendChild(
                                button
                            );

                        }
                    );


                list.appendChild(
                    block
                );

            }
        );

}


/* =========================================================
   NOTICE ANSWER
========================================================= */

function answerNotice(
    index,
    optionIndex,
    button
) {

    noticeAnswers[index] =
        optionIndex;


    const parent =
        button.parentNode;


    Array.from(
        parent.querySelectorAll(
            "button"
        )
    )
    .forEach(
        function(item) {

            item.style.background =
                "white";

            item.style.borderColor =
                "#ddd";

        }
    );


    button.style.background =
        "#e8eee8";


    button.style.borderColor =
        "#496b59";


    let score = 0;


    currentUnit.notice
        .forEach(
            function(item, i) {

                if (
                    noticeAnswers[i] ===
                    item.answer
                ) {

                    score++;

                }

            }
        );


    const result =
        $("noticeScore");


    if (result) {

        result.textContent =
            "NOTICE："
            + score
            + "/"
            + currentUnit.notice.length;

    }

}


function scrollToDirect() {

    const section =
        $("ebrmDirectSection");


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   DIRECT COMPREHENSION
========================================================= */

function renderDirectComprehension() {

    injectDirectSection();

}


function injectDirectSection() {

    const read =
        $("read");


    if (!read) {

        return;

    }


    let section =
        $("ebrmDirectSection");


    if (!section) {

        section =
            document.createElement(
                "div"
            );


        section.id =
            "ebrmDirectSection";

        section.className =
            "card";


        read.appendChild(
            section
        );

    }


    section.innerHTML =

        "<div class=\"eyebrow\">" +
        "DIRECT COMPREHENSION" +
        "</div>" +

        "<h3>" +
        "先用英文理解" +
        "</h3>" +

        "<p class=\"muted\">" +
        "先看英文问题，根据经文直接判断。" +
        "中文只作为最后确认。" +
        "</p>" +

        "<div id=\"directList\"></div>" +

        "<div id=\"directScore\" " +
        "style=\"margin-top:12px;font-weight:700\">" +
        "</div>";


    const list =
        $("directList");


    directAnswers = {};


    currentUnit.directComprehension
        .forEach(
            function(item, index) {

                const block =
                    document.createElement(
                        "div"
                    );


                block.style.padding =
                    "15px 0";


                block.style.borderTop =
                    "1px solid #eee";


                const label =
                    document.createElement(
                        "div"
                    );


                label.style.fontSize =
                    "11px";


                label.style.color =
                    "#496b59";


                label.style.fontWeight =
                    "800";


                label.textContent =
                    "DIRECT " +
                    (index + 1);


                block.appendChild(
                    label
                );


                const question =
                    document.createElement(
                        "div"
                    );


                question.style.fontWeight =
                    "700";


                question.style.margin =
                    "6px 0";


                question.textContent =
                    item.question;


                block.appendChild(
                    question
                );


                const hint =
                    document.createElement(
                        "div"
                    );


                hint.style.fontSize =
                    "11px";


                hint.style.color =
                    "#999";


                hint.style.marginBottom =
                    "9px";


                hint.textContent =
                    item.hint;


                block.appendChild(
                    hint
                );


                item.options
                    .forEach(
                        function(option, optionIndex) {

                            const button =
                                document.createElement(
                                    "button"
                                );


                            button.textContent =
                                option;


                            button.style.display =
                                "block";


                            button.style.width =
                                "100%";


                            button.style.textAlign =
                                "left";


                            button.style.padding =
                                "10px";


                            button.style.margin =
                                "6px 0";


                            button.style.border =
                                "1px solid #ddd";


                            button.style.borderRadius =
                                "9px";


                            button.style.background =
                                "white";


                            button.addEventListener(
                                "click",
                                function() {

                                    answerDirect(
                                        index,
                                        optionIndex,
                                        button
                                    );

                                }
                            );


                            block.appendChild(
                                button
                            );

                        }
                    );


                const chinese =
                    document.createElement(
                        "button"
                    );


                chinese.textContent =
                    "中文确认";


                chinese.style.marginTop =
                    "7px";


                chinese.style.display =
                    "none";


                chinese.style.border =
                    "0";


                chinese.style.background =
                    "#f3f0e8";


                chinese.style.padding =
                    "7px 9px";


                chinese.style.borderRadius =
                    "7px";


                chinese.addEventListener(
                    "click",
                    function() {

                        answerBox.style.display =
                            answerBox.style.display ===
                            "none"
                                ? "block"
                                : "none";

                    }
                );


                block.appendChild(
                    chinese
                );


                const answerBox =
                    document.createElement(
                        "div"
                    );


                answerBox.style.display =
                    "none";


                answerBox.style.marginTop =
                    "6px";


                answerBox.style.padding =
                    "10px";


                answerBox.style.background =
                    "#f8f7f2";


                answerBox.style.borderRadius =
                    "8px";


                answerBox.style.color =
                    "#666";


                answerBox.style.fontSize =
                    "12px";


                answerBox.textContent =
                    item.chinese;


                block.appendChild(
                    answerBox
                );


                block.dataset.chineseButton =
                    "yes";


                list.appendChild(
                    block
                );

            }
        );

}


/* =========================================================
   DIRECT ANSWER
========================================================= */

function answerDirect(
    index,
    optionIndex,
    button
) {

    directAnswers[index] =
        optionIndex;


    const parent =
        button.parentNode;


    Array.from(
        parent.querySelectorAll(
            "button"
        )
    )
    .forEach(
        function(item) {

            if (
                item.textContent ===
                "中文确认"
            ) {

                return;

            }


            item.style.background =
                "white";

            item.style.borderColor =
                "#ddd";

        }
    );


    const question =
        currentUnit
            .directComprehension[index];


    if (
        optionIndex ===
        question.answer
    ) {

        button.style.background =
            "#e8eee8";

        button.style.borderColor =
            "#496b59";

    } else {

        button.style.background =
            "#f4e9e7";

        button.style.borderColor =
            "#9b706a";

    }


    const children =
        Array.from(
            parent.children
        );


    children
        .filter(
            function(item) {

                return (
                    item.tagName ===
                    "BUTTON" &&
                    item.textContent ===
                    "中文确认"
                );

            }
        )
        .forEach(
            function(item) {

                item.style.display =
                    "inline-block";

            }
        );


    let score = 0;


    currentUnit.directComprehension
        .forEach(
            function(item, i) {

                if (
                    directAnswers[i] ===
                    item.answer
                ) {

                    score++;

                }

            }
        );


    const result =
        $("directScore");


    if (result) {

        result.textContent =
            "Direct Comprehension："
            + score
            + "/"
            + currentUnit
                .directComprehension.length;

    }

}


/* =========================================================
   VOCABULARY
========================================================= */

function renderVocabulary() {

    const list =
        $("vocabularyList");


    if (!list || !currentUnit) {

        return;

    }


    list.innerHTML = "";


    currentUnit.vocabulary
        .forEach(
            function(item) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.style.padding =
                    "14px 0";


                card.style.borderTop =
                    "1px solid #eee";


                card.innerHTML =
                    "<strong>" +
                    escapeHTML(
                        item.word
                    ) +
                    "</strong>" +

                    "<div>" +
                    escapeHTML(
                        item.meaning
                    ) +
                    "</div>" +

                    "<small>" +
                    escapeHTML(
                        item.english
                    ) +
                    "</small>";


                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =
                    "🔊";


                button.style.marginLeft =
                    "8px";


                button.addEventListener(
                    "click",
                    function() {

                        speakText(
                            item.word
                        );

                    }
                );


                card.appendChild(
                    button
                );


                list.appendChild(
                    card
                );

            }
        );

}


/* =========================================================
   STRUCTURES
========================================================= */

function renderStructures() {

    const list =
        $("structureList");


    if (!list || !currentUnit) {

        return;

    }


    list.innerHTML = "";


    currentUnit.structures
        .forEach(
            function(item) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.style.padding =
                    "14px 0";


                card.style.borderTop =
                    "1px solid #eee";


                card.innerHTML =
                    "<strong>" +
                    escapeHTML(
                        item.pattern
                    ) +
                    "</strong>" +

                    "<p>" +
                    escapeHTML(
                        item.explanation
                    ) +
                    "</p>";


                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =
                    "🔊 听句型";


                button.addEventListener(
                    "click",
                    function() {

                        speakText(
                            item.pattern
                        );

                    }
                );


                card.appendChild(
                    button
                );


                list.appendChild(
                    card
                );

            }
        );

}


/* =========================================================
   PRODUCTION
========================================================= */

function checkProduction() {

    const input =
        $("productionAnswer");


    const result =
        $("productionResult");


    if (!input || !result) {

        return;

    }


    const answer =
        input.value.trim();


    if (!answer) {

        result.innerHTML =
            "<div class=\"success\">" +
            "请先写一句英文。" +
            "</div>";

        return;

    }


    const wordCount =
        answer
            .split(/\s+/)
            .filter(Boolean)
            .length;


    result.innerHTML =
        "<div class=\"success\">" +

        "✓ 已完成英文输出。" +

        "<br>" +

        "约 " +
        wordCount +
        " 个英文单词。" +

        "<br><br>" +

        "</div>";


    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        "🔊 听我的英文答案";


    button.addEventListener(
        "click",
        function() {

            speakText(
                answer
            );

        }
    );


    result
        .firstElementChild
        .appendChild(
            button
        );

}


/* =========================================================
   FINISH
========================================================= */

function finishUnit() {

    if (!currentUnit) {

        return;

    }


    stopSpeech();


    state.completed[
        currentUnit.id
    ] =
        new Date()
            .toISOString();


    const today =
        new Date();


    state.reviews[
        currentUnit.id
    ] = {

        day1:
            addDays(
                today,
                1
            ),

        day3:
            addDays(
                today,
                3
            ),

        day7:
            addDays(
                today,
                7
            )

    };


    saveState();


    const message =
        $("doneMessage");


    if (message) {

        message.textContent =
            currentUnit.reference +
            " 已完成。";

    }


    renderHome();

    go(
        "done"
    );

}


function addDays(
    date,
    days
) {

    const result =
        new Date(date);


    result.setDate(
        result.getDate() +
        days
    );


    return result.toISOString();

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

    const grid =
        $("unitGrid");


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    UNITS.forEach(
        function(unit, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "unit";


            if (
                state.completed[
                    unit.id
                ]
            ) {

                button.classList.add(
                    "done"
                );

            }


            button.innerHTML =
                "<div class=\"unit-num\">" +
                "UNIT " +
                String(
                    index + 1
                ).padStart(
                    2,
                    "0"
                ) +
                "</div>" +

                "<div class=\"unit-title\">" +
                escapeHTML(
                    unit.title
                ) +
                "</div>" +

                "<div class=\"unit-ref\">" +
                escapeHTML(
                    unit.reference
                ) +
                "</div>";


            button.addEventListener(
                "click",
                function() {

                    openUnit(
                        unit.id
                    );

                }
            );


            grid.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   OPEN UNIT
========================================================= */

function openUnit(
    unitId
) {

    const found =
        UNITS.find(
            function(unit) {

                return (
                    unit.id ===
                    unitId
                );

            }
        );


    if (!found) {

        return;

    }


    stopSpeech();


    currentUnit =
        found;


    currentPassage =
        null;


    currentVerseIndex =
        0;


    noticeAnswers =
        {};

    directAnswers =
        {};


    $("readTitle").textContent =
        currentUnit.title;


    $("readReference").textContent =
        currentUnit.reference;


    $("contextText").textContent =
        currentUnit.context;


    $("productionPrompt").textContent =
        currentUnit.production;


    renderVocabulary();

    renderStructures();

    showScreen(
        "read"
    );


    loadPassage();


    renderNotice();

    renderDirectComprehension();


    setTimeout(
        function() {

            renderVoicePanel();

        },
        300
    );

}


/* =========================================================
   SCREEN
========================================================= */

function showScreen(
    id
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


    const screen =
        $(id);


    if (screen) {

        screen.classList.add(
            "active"
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   REVIEW
========================================================= */

function renderReviews() {

    const list =
        $("reviewList");


    if (!list) {

        return;

    }


    list.innerHTML = "";


    UNITS.forEach(
        function(unit) {

            const review =
                state.reviews[
                    unit.id
                ];


            if (!review) {

                return;

            }


            [
                ["Day 1", review.day1],
                ["Day 3", review.day3],
                ["Day 7", review.day7]
            ]
            .forEach(
                function(item) {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "review-row";


                    row.innerHTML =
                        "<strong>" +
                        escapeHTML(
                            unit.reference
                        ) +
                        "</strong>" +

                        "<span>" +
                        item[0] +
                        " · " +
                        new Date(
                            item[1]
                        )
                            .toLocaleDateString() +
                        "</span>";


                    list.appendChild(
                        row
                    );

                }
            );

        }
    );

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openUnit =
    openUnit;

window.go =
    showScreen;

window.showScreen =
    showScreen;

window.speakText =
    speakText;

window.speakPassage =
    speakPassage;

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

window.checkProduction =
    checkProduction;

window.finishUnit =
    finishUnit;

window.answerNotice =
    answerNotice;

window.scrollToDirect =
    scrollToDirect;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        init();

    }
);
