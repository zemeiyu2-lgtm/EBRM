/* =========================================================
   EBRM V0.6
   English Bible Reading Model

   GitHub Pages 独立版

   V0.6 核心升级：
   1. Bible API
   2. 经文阅读
   3. 英文朗读
   4. 单节朗读
   5. 单词发音
   6. 句型朗读
   7. 正常 / 慢速
   8. 自动连续朗读
   9. 当前经文高亮
   10. Notice 观察训练
   11. Direct Comprehension 直接理解训练
   12. 中文延迟显示
   13. 结构观察
   14. 英文输出
   15. 再读
   16. Day 1 / 3 / 7 复习
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
        "EBRM_V06_STATE"

};


/* =========================================================
   TRAINING UNITS
========================================================= */

const UNITS = [

    {
        id: "J1-01",

        title:
            "The Word",

        reference:
            "John 1:1–5",

        start:
            1,

        end:
            5,

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
                    "life; being alive"
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
                    "defeat; overcome"
            }

        ],

        structures: [

            {
                pattern:
                    "In the beginning was the Word.",

                explanation:
                    "先出现时间背景，再出现主语 Word。"
            },

            {
                pattern:
                    "The Word was with God.",

                explanation:
                    "be + with 表达关系。"
            },

            {
                pattern:
                    "The Word was God.",

                explanation:
                    "be 动词连接主语和身份/表语。"
            },

            {
                pattern:
                    "The light shines in the darkness.",

                explanation:
                    "主语 + 动词 + 介词短语。"
            }

        ],

        notice: [

            {
                question:
                    "What word or idea is repeated in this passage?",

                type:
                    "repeat",

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
                    "What two images are strongly contrasted?",

                type:
                    "contrast",

                options: [

                    "Life and death",

                    "Light and darkness",

                    "King and servant"

                ],

                answer:
                    1
            },

            {
                question:
                    "Who is at the center of the opening passage?",

                type:
                    "focus",

                options: [

                    "John",

                    "The Word",

                    "Moses"

                ],

                answer:
                    1
            }

        ],

        directComprehension: [

            {
                englishQuestion:
                    "Who was with God in the beginning?",

                chineseHint:
                    "想一想：起初谁与神同在？",

                options: [

                    "The Word",

                    "John",

                    "Moses"

                ],

                answer:
                    0,

                chineseAnswer:
                    "道与神同在。"
            },

            {
                englishQuestion:
                    "What was in the Word?",

                chineseHint:
                    "想一想：道里面有什么？",

                options: [

                    "Darkness",

                    "Life",

                    "Death"

                ],

                answer:
                    1,

                chineseAnswer:
                    "生命在祂里面。"
            },

            {
                englishQuestion:
                    "What shines in the darkness?",

                chineseHint:
                    "想一想：什么照在黑暗里？",

                options: [

                    "The law",

                    "The temple",

                    "The light"

                ],

                answer:
                    2,

                chineseAnswer:
                    "光照在黑暗里。"
            }

        ],

        context:
            "John opens his Gospel with the Word. The Word is presented in relation to God, creation, life, and light. The passage establishes the identity of the Word before the story of Jesus' earthly ministry begins.",

        production:
            "In simple English, explain who the Word is and what is in the Word."

    },


    {
        id:
            "J1-02",

        title:
            "The Witness",

        reference:
            "John 1:6–13",

        start:
            6,

        end:
            13,

        vocabulary: [

            {
                word:
                    "witness",

                meaning:
                    "见证人",

                english:
                    "a person who gives testimony"
            },

            {
                word:
                    "believe",

                meaning:
                    "相信",

                english:
                    "to trust"
            },

            {
                word:
                    "receive",

                meaning:
                    "接受；领受",

                english:
                    "to accept"
            },

            {
                word:
                    "true",

                meaning:
                    "真实的",

                english:
                    "real; genuine"
            },

            {
                word:
                    "children",

                meaning:
                    "儿女",

                english:
                    "sons and daughters"
            }

        ],

        structures: [

            {
                pattern:
                    "There was a man sent from God.",

                explanation:
                    "There was 用来引出一个人物。"
            },

            {
                pattern:
                    "He came as a witness.",

                explanation:
                    "as + 身份，表示作为……。"
            },

            {
                pattern:
                    "those who believe",

                explanation:
                    "who 引导关系从句。"
            },

            {
                pattern:
                    "children of God",

                explanation:
                    "of 表达所属关系。"
            }

        ],

        notice: [

            {
                question:
                    "What role does John have in the passage?",

                type:
                    "role",

                options: [

                    "Witness",

                    "King",

                    "Savior"

                ],

                answer:
                    0
            },

            {
                question:
                    "What response to the light is emphasized?",

                type:
                    "response",

                options: [

                    "Receive and believe",

                    "Hide",

                    "Fight"

                ],

                answer:
                    0
            },

            {
                question:
                    "What phrase identifies a new relationship with God?",

                type:
                    "identity",

                options: [

                    "Children of God",

                    "Citizens of Rome",

                    "Servants of Caesar"

                ],

                answer:
                    0
            }

        ],

        directComprehension: [

            {
                englishQuestion:
                    "Why did John come?",

                chineseHint:
                    "想一想：约翰为什么来？",

                options: [

                    "To bear witness to the light",

                    "To become the light",

                    "To build a temple"

                ],

                answer:
                    0,

                chineseAnswer:
                    "约翰来为光作见证。"
            },

            {
                englishQuestion:
                    "What happens to people who receive the Word?",

                chineseHint:
                    "想一想：领受祂的人有什么身份？",

                options: [

                    "They become children of God",

                    "They become kings",

                    "They become angels"

                ],

                answer:
                    0,

                chineseAnswer:
                    "他们成为神的儿女。"
            }

        ],

        context:
            "John the Baptist is presented as a witness, not the light itself. The passage emphasizes the human response to the light: receiving and believing.",

        production:
            "In simple English, explain John's role and the response of believers."

    },


    {
        id:
            "J1-03",

        title:
            "The Word Became Flesh",

        reference:
            "John 1:14–18",

        start:
            14,

        end:
            18,

        vocabulary: [

            {
                word:
                    "flesh",

                meaning:
                    "肉身",

                english:
                    "human bodily existence"
            },

            {
                word:
                    "dwelt",

                meaning:
                    "住在",

                english:
                    "lived among"
            },

            {
                word:
                    "glory",

                meaning:
                    "荣耀",

                english:
                    "greatness and honor"
            },

            {
                word:
                    "grace",

                meaning:
                    "恩典",

                english:
                    "undeserved kindness"
            },

            {
                word:
                    "truth",

                meaning:
                    "真理",

                english:
                    "what is true"
            }

        ],

        structures: [

            {
                pattern:
                    "The Word became flesh.",

                explanation:
                    "became + 名词，表示成为。"
            },

            {
                pattern:
                    "We have seen his glory.",

                explanation:
                    "现在完成时表达已经看见并仍具意义。"
            },

            {
                pattern:
                    "full of grace and truth",

                explanation:
                    "full of 表示充满。"
            }

        ],

        notice: [

            {
                question:
                    "What major change in state do you notice?",

                type:
                    "change",

                options: [

                    "The Word became flesh",

                    "John became king",

                    "Light became darkness"

                ],

                answer:
                    0
            },

            {
                question:
                    "Which pair is repeated as a major theme?",

                type:
                    "theme",

                options: [

                    "Grace and truth",

                    "Law and temple",

                    "King and army"

                ],

                answer:
                    0
            }

        ],

        directComprehension: [

            {
                englishQuestion:
                    "What did the Word become?",

                chineseHint:
                    "想一想：道成了什么？",

                options: [

                    "Flesh",

                    "Light",

                    "Darkness"

                ],

                answer:
                    0,

                chineseAnswer:
                    "道成了肉身。"
            },

            {
                englishQuestion:
                    "What did the witnesses see?",

                chineseHint:
                    "想一想：他们看见了什么？",

                options: [

                    "His glory",

                    "His temple",

                    "His kingdom on earth"

                ],

                answer:
                    0,

                chineseAnswer:
                    "他们看见了祂的荣耀。"
            }

        ],

        context:
            "John 1:14 moves the reader from the eternal Word to the incarnation. The Word becomes flesh and reveals glory, grace, and truth.",

        production:
            "In simple English, explain what John means by 'the Word became flesh.'"

    },


    {
        id:
            "J1-04",

        title:
            "John's Testimony",

        reference:
            "John 1:19–28",

        start:
            19,

        end:
            28,

        vocabulary: [

            {
                word:
                    "testimony",

                meaning:
                    "见证",

                english:
                    "testimony"
            },

            {
                word:
                    "Christ",

                meaning:
                    "基督",

                english:
                    "the Messiah"
            },

            {
                word:
                    "prophet",

                meaning:
                    "先知",

                english:
                    "a person who speaks God's message"
            },

            {
                word:
                    "voice",

                meaning:
                    "声音",

                english:
                    "voice"
            },

            {
                word:
                    "baptize",

                meaning:
                    "施洗",

                english:
                    "to baptize"
            }

        ],

        structures: [

            {
                pattern:
                    "Who are you?",

                explanation:
                    "疑问句直接寻找身份。"
            },

            {
                pattern:
                    "I am not the Christ.",

                explanation:
                    "否定身份。"
            },

            {
                pattern:
                    "I am the voice...",

                explanation:
                    "I am + 名词，说明身份和使命。"
            }

        ],

        notice: [

            {
                question:
                    "What does John repeatedly deny?",

                type:
                    "identity",

                options: [

                    "He is the Christ",

                    "He is a witness",

                    "He baptizes with water"

                ],

                answer:
                    0
            },

            {
                question:
                    "What identity does John accept?",

                type:
                    "identity",

                options: [

                    "The voice in the wilderness",

                    "The Messiah",

                    "The King"

                ],

                answer:
                    0
            }

        ],

        directComprehension: [

            {
                englishQuestion:
                    "Was John the Christ?",

                chineseHint:
                    "答案就在经文中。",

                options: [

                    "Yes",

                    "No",

                    "We do not know"

                ],

                answer:
                    1,

                chineseAnswer:
                    "不是。"
            },

            {
                englishQuestion:
                    "What did John call himself?",

                chineseHint:
                    "约翰怎样描述自己的身份？",

                options: [

                    "The voice in the wilderness",

                    "The Christ",

                    "The King of Israel"

                ],

                answer:
                    0,

                chineseAnswer:
                    "他称自己是旷野中的声音。"
            }

        ],

        context:
            "John's identity is defined in relation to Jesus. He refuses glory for himself and identifies his mission as preparing the way.",

        production:
            "Describe John's identity and mission in simple English."

    },


    {
        id:
            "J1-05",

        title:
            "The Lamb of God",

        reference:
            "John 1:29–34",

        start:
            29,

        end:
            34,

        vocabulary: [

            {
                word:
                    "Lamb",

                meaning:
                    "羔羊",

                english:
                    "a lamb"
            },

            {
                word:
                    "sin",

                meaning:
                    "罪",

                english:
                    "sin"
            },

            {
                word:
                    "Spirit",

                meaning:
                    "圣灵",

                english:
                    "the Holy Spirit"
            },

            {
                word:
                    "remain",

                meaning:
                    "停留；常住",

                english:
                    "stay"
            }

        ],

        structures: [

            {
                pattern:
                    "Behold, the Lamb of God.",

                explanation:
                    "Behold 用来引起注意。"
            },

            {
                pattern:
                    "who takes away the sin of the world",

                explanation:
                    "who 引导关系从句，说明 Lamb 的工作。"
            },

            {
                pattern:
                    "the Spirit descend and remain",

                explanation:
                    "多个动作组成见证过程。"
            }

        ],

        notice: [

            {
                question:
                    "What title does John give Jesus?",

                type:
                    "title",

                options: [

                    "The Lamb of God",

                    "The prophet",

                    "The voice"

                ],

                answer:
                    0
            },

            {
                question:
                    "What is the Lamb connected with?",

                type:
                    "work",

                options: [

                    "Taking away sin",

                    "Building the temple",

                    "Leading Rome"

                ],

                answer:
                    0
            },

            {
                question:
                    "What does the Spirit do?",

                type:
                    "action",

                options: [

                    "Descends and remains",

                    "Leaves immediately",

                    "Builds a house"

                ],

                answer:
                    0
            }

        ],

        directComprehension: [

            {
                englishQuestion:
                    "Who is Jesus according to John?",

                chineseHint:
                    "约翰给耶稣什么称号？",

                options: [

                    "The Lamb of God",

                    "The prophet only",

                    "The Roman king"

                ],

                answer:
                    0,

                chineseAnswer:
                    "耶稣是神的羔羊。"
            },

            {
                englishQuestion:
                    "What does the Lamb take away?",

                chineseHint:
                    "注意 take away 后面的宾语。",

                options: [

                    "The law",

                    "The sin of the world",

                    "The temple"

                ],

                answer:
                    1,

                chineseAnswer:
                    "除去世人的罪。"
            }

        ],

        context:
            "John's witness becomes more explicit: Jesus is the Lamb of God. The descent and remaining of the Spirit serves as confirmation of Jesus' identity.",

        production:
            "Explain in simple English what John says about Jesus."
    },


    {
        id:
            "J1-06",

        title:
            "Come and See",

        reference:
            "John 1:35–42",

        start:
            35,

        end:
            42,

        vocabulary: [

            {
                word:
                    "disciple",

                meaning:
                    "门徒",

                english:
                    "a learner and follower"
            },

            {
                word:
                    "follow",

                meaning:
                    "跟随",

                english:
                    "to go after"
            },

            {
                word:
                    "Rabbi",

                meaning:
                    "拉比；夫子",

                english:
                    "teacher"
            },

            {
                word:
                    "Messiah",

                meaning:
                    "弥赛亚",

                english:
                    "the promised Messiah"
            },

            {
                word:
                    "stay",

                meaning:
                    "停留；住",

                english:
                    "remain"
            }

        ],

        structures: [

            {
                pattern:
                    "What are you seeking?",

                explanation:
                    "现在进行时询问当前正在寻找什么。"
            },

            {
                pattern:
                    "Come and you will see.",

                explanation:
                    "邀请 + 结果。"
            },

            {
                pattern:
                    "We have found the Messiah.",

                explanation:
                    "现在完成时表达已经发现。"
            }

        ],

        notice: [

            {
                question:
                    "What action begins the discipleship movement?",

                type:
                    "action",

                options: [

                    "They follow Jesus",

                    "They leave Jesus",

                    "They hide"

                ],

                answer:
                    0
            },

            {
                question:
                    "What invitation does Jesus give?",

                type:
                    "invitation",

                options: [

                    "Come and see",

                    "Go away",

                    "Stay outside"

                ],

                answer:
                    0
            },

            {
                question:
                    "Who does Andrew bring to Jesus?",

                type:
                    "relationship",

                options: [

                    "Simon",

                    "Moses",

                    "Pilate"

                ],

                answer:
                    0
            }

        ],

        directComprehension: [

            {
                englishQuestion:
                    "What did the disciples do after hearing John?",

                chineseHint:
                    "他们听见约翰说话之后做了什么？",

                options: [

                    "They followed Jesus",

                    "They went home",

                    "They followed Moses"

                ],

                answer:
                    0,

                chineseAnswer:
                    "他们跟随了耶稣。"
            },

            {
                englishQuestion:
                    "What did Jesus say?",

                chineseHint:
                    "耶稣邀请他们做什么？",

                options: [

                    "Come and see",

                    "Go and hide",

                    "Wait outside"

                ],

                answer:
                    0,

                chineseAnswer:
                    "来，你们就必看见。"
            }

        ],

        context:
            "John's testimony leads to personal discipleship. The disciples follow Jesus, stay with him, and one of them immediately brings another person to Jesus.",

        production:
            "Describe the first steps of following Jesus in simple English."
    },


    {
        id:
            "J1-07",

        title:
            "Follow Me",

        reference:
            "John 1:43–51",

        start:
            43,

        end:
            51,

        vocabulary: [

            {
                word:
                    "follow",

                meaning:
                    "跟随",

                english:
                    "to go after"
            },

            {
                word:
                    "Nazareth",

                meaning:
                    "拿撒勒",

                english:
                    "Nazareth"
            },

            {
                word:
                    "Nathanael",

                meaning:
                    "拿但业",

                english:
                    "Nathanael"
            },

            {
                word:
                    "heaven",

                meaning:
                    "天",

                english:
                    "heaven"
            },

            {
                word:
                    "angels",

                meaning:
                    "天使",

                english:
                    "angels"
            }

        ],

        structures: [

            {
                pattern:
                    "Follow me.",

                explanation:
                    "最简洁的祈使句呼召。"
            },

            {
                pattern:
                    "Can anything good come out of Nazareth?",

                explanation:
                    "Can + 主语 + 动词构成一般疑问句。"
            },

            {
                pattern:
                    "You will see heaven opened.",

                explanation:
                    "will 表达未来。"
            }

        ],

        notice: [

            {
                question:
                    "What does Jesus directly say to Philip?",

                type:
                    "call",

                options: [

                    "Follow me",

                    "Go home",

                    "Wait for John"

                ],

                answer:
                    0
            },

            {
                question:
                    "What does Philip do next?",

                type:
                    "response",

                options: [

                    "He finds Nathanael",

                    "He leaves",

                    "He hides"

                ],

                answer:
                    0
            },

            {
                question:
                    "What future vision does Jesus promise?",

                type:
                    "vision",

                options: [

                    "Heaven opened",

                    "The temple destroyed",

                    "Rome defeated"

                ],

                answer:
                    0
            }

        ],

        directComprehension: [

            {
                englishQuestion:
                    "Who said, 'Follow me'?",

                chineseHint:
                    "是谁呼召腓力？",

                options: [

                    "Jesus",

                    "John",

                    "Nathanael"

                ],

                answer:
                    0,

                chineseAnswer:
                    "耶稣说：跟从我。"
            },

            {
                englishQuestion:
                    "What did Nathanael come to recognize?",

                chineseHint:
                    "拿但业最后怎样认识耶稣？",

                options: [

                    "Jesus as the Son of God",

                    "Jesus as a Roman leader",

                    "Jesus as only a teacher"

                ],

                answer:
                    0,

                chineseAnswer:
                    "他承认耶稣是神的儿子。"
            }

        ],

        context:
            "Jesus calls Philip, Philip brings Nathanael, and the encounter moves from questions to recognition. The section ends with a larger revelation concerning the Son of Man.",

        production:
            "Describe how Jesus calls Philip and how Philip responds."
    }

];


/* =========================================================
   STATE
========================================================= */

let currentUnit =
    null;

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


/* =========================================================
   SAVE STATE
========================================================= */

let state =
    loadState();


function loadState() {

    try {

        const raw =
            localStorage.getItem(
                CONFIG.STATE_KEY
            );

        if (raw) {

            return JSON.parse(raw);

        }

    } catch (error) {

        console.warn(
            "EBRM state load error:",
            error
        );

    }


    return {

        completed: {},

        reviews: {},

        scores: {},

        lastUnit: null

    };

}


function saveState() {

    localStorage.setItem(

        CONFIG.STATE_KEY,

        JSON.stringify(state)

    );

}


/* =========================================================
   HELPER
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function esc(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            function(match) {

                return {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#39;"

                }[match];

            }
        );

}


/* =========================================================
   INITIALIZE
========================================================= */

function init() {

    renderHome();

    renderReviews();

    initSpeech();

}


function initSpeech() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    /*
     * 浏览器首次启动时
     * voices 可能尚未加载。
     */

    selectedVoice =
        chooseBestEnglishVoice();


    speechSynthesis.onvoiceschanged =
        function() {

            selectedVoice =
                chooseBestEnglishVoice();

            renderVoicePanel();

        };

}


/* =========================================================
   VOICE SELECTION
========================================================= */

function getVoices() {

    if (
        !("speechSynthesis" in window)
    ) {

        return [];

    }

    return speechSynthesis
        .getVoices();

}


function englishVoices() {

    return getVoices()
        .filter(function(voice) {

            const lang =
                (voice.lang || "")
                .toLowerCase();

            return (
                lang.startsWith("en-") ||
                lang === "en"
            );

        });

}


function chooseBestEnglishVoice() {

    const voices =
        englishVoices();

    if (!voices.length) {

        return null;

    }


    const saved =
        localStorage.getItem(
            "EBRM_V06_VOICE"
        );


    if (saved) {

        const match =
            voices.find(
                function(voice) {

                    return (
                        voice.name === saved
                    );

                }
            );

        if (match) {

            return match;

        }

    }


    const maleNames = [

        "male",
        "man",
        "david",
        "daniel",
        "alex",
        "mark",
        "james",
        "george",
        "guy",
        "fred"

    ];


    const male =
        voices.find(
            function(voice) {

                const name =
                    voice.name
                        .toLowerCase();

                return maleNames.some(
                    function(word) {

                        return name
                            .includes(word);

                    }
                );

            }
        );


    if (male) {

        return male;

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
        document.getElementById("read");


    if (!readScreen) {

        return;

    }


    let panel =
        document.getElementById(
            "ebrmVoicePanel"
        );


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
            document.getElementById(
                "passageText"
            );


        if (
            passage &&
            passage.parentNode
        ) {

            passage.parentNode
                .insertBefore(
                    panel,
                    passage
                );

        }

    }


    const voices =
        englishVoices();


    panel.innerHTML = `

        <strong>
            🎙️ English Voice
        </strong>

        <select
            id="ebrmVoiceSelect"
            style="
                width:100%;
                padding:10px;
                margin-top:10px;
                border:1px solid #ddd;
                border-radius:10px;
                background:white;
            "
        >

            ${
                voices.length
                    ? voices.map(
                        function(voice) {

                            const selected =
                                selectedVoice &&
                                voice.name ===
                                selectedVoice.name
                                    ? "selected"
                                    : "";

                            return `

                                <option
                                    value="${esc(
                                        voice.name
                                    )}"
                                    ${selected}
                                >

                                    ${esc(
                                        voice.name
                                    )}
                                    ·
                                    ${esc(
                                        voice.lang
                                    )}

                                </option>

                            `;

                        }
                    ).join("")
                    : `
                        <option>
                            未检测到英文系统声音
                        </option>
                    `
            }

        </select>

        <div
            style="
                margin-top:7px;
                color:#777;
                font-size:12px;
            "
        >
            建议优先选择英语男性声音。
        </div>

    `;


    const select =
        document.getElementById(
            "ebrmVoiceSelect"
        );


    if (!select) {

        return;

    }


    select.onchange =
        function() {

            const voice =
                voices.find(
                    function(item) {

                        return (
                            item.name ===
                            select.value
                        );

                    }
                );


            if (voice) {

                selectedVoice =
                    voice;


                localStorage.setItem(

                    "EBRM_V06_VOICE",

                    voice.name

                );

            }

        };

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

    const grid =
        document.getElementById(
            "unitGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        UNITS
            .map(function(unit, index) {

                const completed =
                    !!state.completed[
                        unit.id
                    ];


                return `

                    <button
                        class="unit ${
                            completed
                                ? "done"
                                : ""
                        }"
                        onclick="
                            openUnit(
                                '${unit.id}'
                            )
                        "
                    >

                        <div class="unit-num">

                            UNIT
                            ${String(index + 1)
                                .padStart(2, "0")}

                        </div>

                        <div class="unit-title">

                            ${esc(
                                unit.title
                            )}

                        </div>

                        <div class="unit-ref">

                            ${esc(
                                unit.reference
                            )}

                            ${
                                completed
                                    ? " ✓"
                                    : ""
                            }

                        </div>

                    </button>

                `;

            })
            .join("");

}


/* =========================================================
   OPEN UNIT
========================================================= */

function openUnit(
    unitId
) {

    stopSpeech();


    currentUnit =
        UNITS.find(
            function(unit) {

                return (
                    unit.id ===
                    unitId
                );

            }
        );


    if (!currentUnit) {

        return;

    }


    state.lastUnit =
        currentUnit.id;


    saveState();


    currentPassage =
        null;


    currentVerseIndex =
        0;


    continuousReading =
        false;


    repeatCurrentVerse =
        false;


    const title =
        $("readTitle");


    if (title) {

        title.textContent =
            currentUnit.title;

    }


    const reference =
        $("readReference");


    if (reference) {

        reference.textContent =
            currentUnit.reference;

    }


    const context =
        $("contextText");


    if (context) {

        context.textContent =
            currentUnit.context;

    }


    const production =
        $("productionPrompt");


    if (production) {

        production.textContent =
            currentUnit.production;

    }


    const answer =
        $("productionAnswer");


    if (answer) {

        answer.value = "";

    }


    renderVocabulary();

    renderStructures();

    renderNotice();

    renderDirectComprehension();

    showScreen(
        "read"
    );


    loadPassage();


    setTimeout(
        function() {

            renderVoicePanel();

        },
        250
    );

}


/* =========================================================
   SHOW SCREEN
========================================================= */

function showScreen(
    screenId
) {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(function(screen) {

            screen.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(
            screenId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    if (
        screenId ===
        "review"
    ) {

        renderReviews();

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


    box.innerHTML = `

        <div class="loading">

            正在读取英文圣经……

        </div>

    `;


    const reference =
        `John 1:${currentUnit.start}-${currentUnit.end}`;


    const url =
        `${CONFIG.BIBLE_API}/` +
        `${encodeURIComponent(reference)}` +
        `?translation=${CONFIG.TRANSLATION}`;


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
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.verses ||
            !data.verses.length
        ) {

            throw new Error(
                "没有读取到经文"
            );

        }


        currentPassage = {

            reference:
                currentUnit.reference,

            verses:
                data.verses.map(
                    function(item) {

                        return {

                            verse:
                                item.verse,

                            text:
                                item.text
                                    .trim()

                        };

                    }
                )

        };


        renderPassage();

        updateSpeechStatus(
            "经文已加载，可以开始 NOTICE。"
        );


    } catch (error) {

        box.innerHTML = `

            <div class="success">

                <strong>
                    经文读取失败
                </strong>

                <br><br>

                ${esc(
                    error.message
                )}

            </div>

        `;

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

                const el =
                    document.createElement(
                        "span"
                    );


                el.className =
                    "verse";


                el.dataset.index =
                    index;


                el.innerHTML = `

                    <sup>
                        ${verse.verse}
                    </sup>

                    ${esc(
                        verse.text
                    )}

                `;


                el.onclick =
                    function() {

                        playVerse(
                            index
                        );

                    };


                box.appendChild(
                    el
                );


                box.appendChild(
                    document.createTextNode(
                        " "
                    )
                );

            }
        );


    highlightVerse(
        currentVerseIndex
    );

}


/* =========================================================
   HIGHLIGHT
========================================================= */

function highlightVerse(
    index
) {

    document
        .querySelectorAll(
            ".verse"
        )
        .forEach(function(el) {

            el.classList.remove(
                "active-verse",
                "verse-speaking"
            );

        });


    const target =
        document.querySelector(
            `.verse[data-index="${index}"]`
        );


    if (target) {

        target.classList.add(
            "active-verse"
        );

    }

}


/* =========================================================
   SPEECH
========================================================= */

function speakText(
    text,
    element = null,
    callback = null
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

        clearVerseHighlight();

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


function clearVerseHighlight() {

    document
        .querySelectorAll(
            ".verse-speaking"
        )
        .forEach(function(el) {

            el.classList.remove(
                "verse-speaking"
            );

        });

}


/* =========================================================
   PLAY VERSE
========================================================= */

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


    highlightVerse(
        index
    );


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
                    700
                );

            }

            else if (
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
                        "✓ 连续听读完成。"
                    );

                }

            }

            else {

                updateSpeechStatus(
                    `第 ${
                        currentPassage
                            .verses[index]
                            .verse
                    } 节朗读完成。`
                );

            }

        }

    );

}


/* =========================================================
   CONTINUOUS
========================================================= */

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
        "▶ 连续逐节听读中……"
    );


    speakVerse(
        currentVerseIndex
    );

}


/* =========================================================
   REPEAT
========================================================= */

function toggleRepeatCurrentVerse() {

    if (!currentPassage) {

        return;

    }


    continuousReading =
        false;


    repeatCurrentVerse =
        !repeatCurrentVerse;


    updateSpeechStatus(

        repeatCurrentVerse
            ? "🔁 当前节循环中……"
            : "当前节循环已停止。"

    );


    if (
        repeatCurrentVerse
    ) {

        speakVerse(
            currentVerseIndex
        );

    }

}


/* =========================================================
   PREVIOUS
========================================================= */

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


/* =========================================================
   NEXT
========================================================= */

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


/* =========================================================
   STOP
========================================================= */

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


    clearVerseHighlight();

}


/* =========================================================
   SPEED
========================================================= */

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


/* =========================================================
   STATUS
========================================================= */

function updateSpeechStatus(
    message
) {

    let status =
        document.getElementById(
            "ebrmSpeechStatus"
        );


    if (!status) {

        const passage =
            $("passageText");


        if (!passage) {

            return;

        }


        status =
            document.createElement(
                "div"
            );


        status.id =
            "ebrmSpeechStatus";


        status.className =
            "card";


        passage.parentNode
            .insertBefore(
                status,
                passage.nextSibling
            );

    }


    status.innerHTML = `

        <strong>
            ${esc(message)}
        </strong>

        ${
            currentPassage
                ? `
                    <div
                        style="
                            margin-top:5px;
                            color:#777;
                            font-size:12px;
                        "
                    >
                        当前：
                        第 ${
                            Math.max(
                                currentVerseIndex + 1,
                                1
                            )
                        } /
                        ${
                            currentPassage.verses.length
                        } 节
                    </div>
                `
                : ""
        }

    `;

}


/* =========================================================
   V5/V6 AUDIO CONTROLS
========================================================= */

function addAdvancedControls() {

    const passage =
        $("passageText");


    if (!passage) {

        return;

    }


    const old =
        document.getElementById(
            "ebrmAdvancedControls"
        );


    if (old) {

        old.remove();

    }


    const controls =
        document.createElement(
            "div"
        );


    controls.id =
        "ebrmAdvancedControls";

    controls.className =
        "audio-controls";


    controls.innerHTML = `

        <button
            onclick="speakPassage()">

            🔊 整段

        </button>

        <button
            onclick="startContinuousReading()">

            ▶️ 连续逐节

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
            onclick="
                toggleRepeatCurrentVerse()
            ">

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

    `;


    passage.parentNode.insertBefore(
        controls,
        passage
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
        currentPassage.verses
            .map(
                function(item) {

                    return item.text;

                }
            )
            .join(" ");


    speakText(
        text
    );

}


/* =========================================================
   NOTICE TRAINING
========================================================= */

function renderNotice() {

    const container =
        document.getElementById(
            "noticeList"
        );


    if (!container) {

        /*
         * 当前 index.html 没有 noticeList 时，
         * 自动插入 V0.6 区块。
         */

        injectNoticeSection();

        return;

    }


    renderNoticeInto(
        container
    );

}


function renderNoticeInto(
    container
) {

    container.innerHTML =

        currentUnit.notice
            .map(
                function(item, index) {

                    return `

                        <div
                            class="notice-question"
                            style="
                                padding:15px 0;
                                border-top:1px solid #eee;
                            "
                        >

                            <div
                                style="
                                    color:#888;
                                    font-size:11px;
                                    font-weight:700;
                                "
                            >
                                NOTICE ${index + 1}
                            </div>

                            <div
                                style="
                                    margin:6px 0 10px;
                                    font-weight:700;
                                "
                            >
                                ${esc(
                                    item.question
                                )}
                            </div>

                            <div>

                                ${item.options
                                    .map(
                                        function(
                                            option,
                                            optionIndex
                                        ) {

                                            return `

                                                <button
                                                    class="
                                                        notice-option
                                                    "
                                                    data-q="
                                                        ${index}
                                                    "
                                                    data-option="
                                                        ${optionIndex}
                                                    "
                                                    style="
                                                        display:block;
                                                        width:100%;
                                                        text-align:left;
                                                        padding:10px;
                                                        margin:6px 0;
                                                        border:1px solid #ddd;
                                                        border-radius:9px;
                                                        background:white;
                                                    "
                                                    onclick="
                                                        answerNotice(
                                                            ${index},
                                                            ${optionIndex},
                                                            this
                                                        )
                                                    "
                                                >

                                                    ${esc(
                                                        option
                                                    )}

                                                </button>

                                            `;

                                        }
                                    )
                                    .join("")}

                            </div>

                            <div
                                id="
                                    noticeFeedback-${index}
                                "
                                style="
                                    margin-top:8px;
                                    color:#777;
                                    font-size:12px;
                                "
                            ></div>

                        </div>

                    `;

                }
            )
            .join("");

}


function injectNoticeSection() {

    const readScreen =
        document.getElementById(
            "read"
        );


    if (!readScreen) {

        return;

    }


    const existing =
        document.getElementById(
            "ebrmNoticeSection"
        );


    if (existing) {

        return;

    }


    const section =
        document.createElement(
            "div"
        );


    section.id =
        "ebrmNoticeSection";

    section.className =
        "card";


    section.innerHTML = `

        <div
            style="
                color:#496b59;
                font-size:11px;
                font-weight:800;
                letter-spacing:.12em;
            "
        >
            NOTICE
        </div>

        <h3 style="margin-top:6px;">
            先观察，不急着翻译
        </h3>

        <p
            style="
                color:#777;
                font-size:12px;
            "
        >
            找重复、对比、人物、动作和关系。
            选择你在英文经文中真正观察到的内容。
        </p>

        <div id="noticeList"></div>

        <div
            id="noticeScore"
            style="
                margin-top:12px;
                font-weight:700;
            "
        ></div>

        <button
            class="primary"
            style="
                width:100%;
                margin-top:12px;
            "
            onclick="
                continueFromNotice()
            "
        >
            进入直接理解 →
        </button>

    `;


    const passageCard =
        readScreen.querySelector(
            ".passage-card"
        );


    if (passageCard) {

        passageCard.parentNode
            .insertBefore(
                section,
                passageCard.nextSibling
            );

    }

    else {

        readScreen.appendChild(
            section
        );

    }


    renderNoticeInto(
        document.getElementById(
            "noticeList"
        )
    );

}


const noticeAnswers = {};


function answerNotice(
    questionIndex,
    optionIndex,
    button
) {

    noticeAnswers[
        questionIndex
    ] =
        optionIndex;


    const buttons =
        document.querySelectorAll(
            `.notice-option[data-q="${questionIndex}"]`
        );


    buttons.forEach(
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


    const question =
        currentUnit.notice[
            questionIndex
        ];


    const feedback =
        document.getElementById(
            `noticeFeedback-${questionIndex}`
        );


    if (feedback) {

        feedback.textContent =
            "已记录。继续观察下一项。";

    }


    updateNoticeScore();

}


function updateNoticeScore() {

    let correct =
        0;


    currentUnit.notice
        .forEach(
            function(question, index) {

                if (
                    noticeAnswers[index] ===
                    question.answer
                ) {

                    correct++;

                }

            }
        );


    const total =
        currentUnit.notice.length;


    const score =
        document.getElementById(
            "noticeScore"
        );


    if (score) {

        score.textContent =
            `NOTICE：${correct}/${total}`;

    }

}


function continueFromNotice() {

    scrollToDirectComprehension();

}


/* =========================================================
   DIRECT COMPREHENSION
========================================================= */

const directAnswers = {};


function renderDirectComprehension() {

    const container =
        document.getElementById(
            "directComprehensionList"
        );


    if (!container) {

        injectDirectComprehension();

        return;

    }


    renderDirectInto(
        container
    );

}


function renderDirectInto(
    container
) {

    container.innerHTML =

        currentUnit.directComprehension
            .map(
                function(item, index) {

                    return `

                        <div
                            class="direct-question"
                            style="
                                padding:16px 0;
                                border-top:1px solid #eee;
                            "
                        >

                            <div
                                style="
                                    font-size:11px;
                                    color:#496b59;
                                    font-weight:800;
                                "
                            >
                                DIRECT ${index + 1}
                            </div>

                            <div
                                style="
                                    margin:7px 0 5px;
                                    font-weight:800;
                                "
                            >
                                ${esc(
                                    item.englishQuestion
                                )}
                            </div>

                            <div
                                style="
                                    color:#999;
                                    font-size:11px;
                                    margin-bottom:9px;
                                "
                            >
                                ${esc(
                                    item.chineseHint
                                )}
                            </div>

                            ${
                                item.options
                                    .map(
                                        function(
                                            option,
                                            optionIndex
                                        ) {

                                            return `

                                                <button
                                                    class="
                                                        direct-option
                                                    "
                                                    data-q="
                                                        ${index}
                                                    "
                                                    onclick="
                                                        answerDirect(
                                                            ${index},
                                                            ${optionIndex},
                                                            this
                                                        )
                                                    "
                                                    style="
                                                        display:block;
                                                        width:100%;
                                                        text-align:left;
                                                        padding:11px;
                                                        margin:6px 0;
                                                        border:1px solid #ddd;
                                                        border-radius:9px;
                                                        background:white;
                                                    "
                                                >

                                                    ${esc(
                                                        option
                                                    )}

                                                </button>

                                            `;

                                        }
                                    )
                                    .join("")
                            }

                            <div
                                id="
                                    directFeedback-${index}
                                "
                                style="
                                    margin-top:8px;
                                    font-size:12px;
                                "
                            ></div>

                            <button
                                id="
                                    directChinese-${index}
                                "
                                style="
                                    display:none;
                                    margin-top:7px;
                                    border:0;
                                    background:#f3f0e8;
                                    padding:7px 9px;
                                    border-radius:7px;
                                    color:#777;
                                    font-size:11px;
                                "
                                onclick="
                                    revealChinese(
                                        ${index}
                                    )
                                "
                            >
                                中文确认
                            </button>

                            <div
                                id="
                                    directChineseText-${index}
                                "
                                style="
                                    display:none;
                                    margin-top:6px;
                                    padding:10px;
                                    background:#f8f7f2;
                                    border-radius:8px;
                                    color:#666;
                                    font-size:12px;
                                "
                            >
                                ${esc(
                                    item.chineseAnswer
                                )}
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


function injectDirectComprehension() {

    const readScreen =
        document.getElementById(
            "read"
        );


    if (!readScreen) {

        return;

    }


    const existing =
        document.getElementById(
            "ebrmDirectSection"
        );


    if (existing) {

        return;

    }


    const section =
        document.createElement(
            "div"
        );


    section.id =
        "ebrmDirectSection";

    section.className =
        "card";


    section.innerHTML = `

        <div
            style="
                color:#496b59;
                font-size:11px;
                font-weight:800;
                letter-spacing:.12em;
            "
        >
            DIRECT COMPREHENSION
        </div>

        <h3 style="margin-top:6px;">
            先用英文理解
        </h3>

        <p
            style="
                color:#777;
                font-size:12px;
                line-height:1.7;
            "
        >
            先看英文问题，依据经文直接选择答案。
            中文只是确认，不是第一步。
        </p>

        <div
            id="directComprehensionList"
        ></div>

        <div
            id="directScore"
            style="
                margin-top:12px;
                font-weight:700;
            "
        ></div>

    `;


    readScreen.appendChild(
        section
    );


    renderDirectInto(
        document.getElementById(
            "directComprehensionList"
        )
    );

}


function answerDirect(
    questionIndex,
    optionIndex,
    button
) {

    directAnswers[
        questionIndex
    ] =
        optionIndex;


    const question =
        currentUnit
            .directComprehension[
                questionIndex
            ];


    const buttons =
        document.querySelectorAll(
            `.direct-option[data-q="${questionIndex}"]`
        );


    buttons.forEach(
        function(item) {

            item.style.background =
                "white";

            item.style.borderColor =
                "#ddd";

        }
    );


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


    const feedback =
        document.getElementById(
            `directFeedback-${questionIndex}`
        );


    const chineseButton =
        document.getElementById(
            `directChinese-${questionIndex}`
        );


    if (
        optionIndex ===
        question.answer
    ) {

        if (feedback) {

            feedback.textContent =
                "✓ Correct. 先用英文直接理解。";

            feedback.style.color =
                "#496b59";

        }

    } else {

        if (feedback) {

            feedback.textContent =
                "再读一次相关经文，然后重新判断。";

            feedback.style.color =
                "#9b706a";

        }

    }


    if (chineseButton) {

        chineseButton.style.display =
            "inline-block";

    }


    updateDirectScore();

}


function revealChinese(
    index
) {

    const text =
        document.getElementById(
            `directChineseText-${index}`
        );


    if (text) {

        text.style.display =
            text.style.display ===
                "none"
                ? "block"
                : "none";

    }

}


function updateDirectScore() {

    let correct =
        0;


    currentUnit
        .directComprehension
        .forEach(
            function(question, index) {

                if (
                    directAnswers[index] ===
                    question.answer
                ) {

                    correct++;

                }

            }
        );


    const total =
        currentUnit
            .directComprehension
            .length;


    const score =
        document.getElementById(
            "directScore"
        );


    if (score) {

        score.textContent =
            `Direct Comprehension：${correct}/${total}`;

    }

}


function scrollToDirectComprehension() {

    const section =
        document.getElementById(
            "ebrmDirectSection"
        );


    if (section) {

        section.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

}


/* =========================================================
   VOCABULARY
========================================================= */

function renderVocabulary() {

    const container =
        $("vocabularyList");


    if (!container || !currentUnit) {

        return;

    }


    container.innerHTML =

        currentUnit
            .vocabulary
            .map(
                function(item) {

                    return `

                        <div
                            class="vocab-item"
                            style="
                                padding:14px 0;
                                border-top:1px solid #eee;
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                "
                            >

                                <strong>

                                    ${esc(
                                        item.word
                                    )}

                                </strong>

                                <button
                                    onclick="
                                        speakText(
                                            '${escapeJS(
                                                item.word
                                            )}'
                                        )
                                    "
                                >

                                    🔊

                                </button>

                            </div>

                            <div
                                style="
                                    margin-top:4px;
                                "
                            >

                                ${esc(
                                    item.meaning
                                )}

                            </div>

                            <small
                                style="
                                    color:#777;
                                "
                            >

                                ${esc(
                                    item.english
                                )}

                            </small>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   STRUCTURE
========================================================= */

function renderStructures() {

    const container =
        $("structureList");


    if (!container || !currentUnit) {

        return;

    }


    container.innerHTML =

        currentUnit.structures
            .map(
                function(item) {

                    return `

                        <div
                            class="structure-item"
                            style="
                                padding:14px 0;
                                border-top:1px solid #eee;
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    gap:10px;
                                "
                            >

                                <strong>

                                    ${esc(
                                        item.pattern
                                    )}

                                </strong>

                                <button
                                    onclick="
                                        speakText(
                                            '${escapeJS(
                                                item.pattern
                                            )}'
                                        )
                                    "
                                >

                                    🔊

                                </button>

                            </div>

                            <p
                                style="
                                    margin:6px 0 0;
                                    color:#777;
                                    font-size:12px;
                                "
                            >

                                ${esc(
                                    item.explanation
                                )}

                            </p>

                        </div>

                    `;

                }
            )
            .join("");

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


    const text =
        input.value.trim();


    if (!text) {

        result.innerHTML = `

            <div class="success">

                请先用英文写一句。

            </div>

        `;

        return;

    }


    const words =
        text
            .split(/\s+/)
            .filter(Boolean);


    result.innerHTML = `

        <div class="success">

            ✓ 已完成英文输出

            <br>

            ${words.length}
            English words

            <br><br>

            <button
                onclick="
                    speakText(
                        '${escapeJS(text)}'
                    )
                "
            >

                🔊 听我的英文

            </button>

        </div>

    `;

}


/* =========================================================
   RE-READ SUPPORT
========================================================= */

function rereadPassage() {

    if (!currentPassage) {

        return;

    }


    stopSpeech();


    currentVerseIndex =
        0;


    highlightVerse(
        0
    );


    speakVerse(
        0
    );

}


/* =========================================================
   COMPLETE
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


    const now =
        new Date();


    state.reviews[
        currentUnit.id
    ] = {

        day1:
            addDays(
                now,
                1
            ),

        day3:
            addDays(
                now,
                3
            ),

        day7:
            addDays(
                now,
                7
            )

    };


    saveState();


    const message =
        $("doneMessage");


    if (message) {

        message.textContent =
            `${currentUnit.reference} 已完成。`;

    }


    renderHome();

    renderReviews();

    showScreen(
        "done"
    );

}


/* =========================================================
   REVIEW
========================================================= */

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


function renderReviews() {

    const container =
        $("reviewList");


    if (!container) {

        return;

    }


    const items = [];


    UNITS.forEach(
        function(unit) {

            const record =
                state.reviews[
                    unit.id
                ];


            if (!record) {

                return;

            }


            [

                ["Day 1", record.day1],

                ["Day 3", record.day3],

                ["Day 7", record.day7]

            ].forEach(
                function(item) {

                    const due =
                        new Date(item[1]) <=
                        new Date();


                    items.push({

                        unit:
                            unit,

                        label:
                            item[0],

                        date:
                            item[1],

                        due:
                            due

                    });

                }
            );

        }
    );


    if (!items.length) {

        container.innerHTML = `

            <div class="muted">

                完成训练后，

                Day 1 / Day 3 / Day 7
                会在这里出现。

            </div>

        `;

        return;

    }


    container.innerHTML =
        items
            .map(
                function(item) {

                    return `

                        <div
                            class="review-row"
                            style="
                                padding:13px 0;
                                border-top:1px solid #eee;
                            "
                        >

                            <div>

                                <strong>

                                    ${esc(
                                        item.unit.reference
                                    )}

                                </strong>

                                <div
                                    class="review-date"
                                >

                                    ${item.label}

                                </div>

                            </div>

                            <div
                                style="
                                    text-align:right;
                                "
                            >

                                <div>

                                    ${
                                        item.due
                                            ? "需要复习"
                                            : "未到期"
                                    }

                                </div>

                                <small>

                                    ${esc(
                                        item.date
                                    )}

                                </small>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   UTILS
========================================================= */

function escapeJS(
    value
) {

    return String(value ?? "")
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
   GLOBAL FUNCTIONS
========================================================= */

window.openUnit =
    openUnit;

window.go =
    go;

window.showScreen =
    showScreen;

window.speakText =
    speakText;

window.speakPassage =
    speakPassage;

window.speakVerse =
    speakVerse;

window.playVerse =
    playVerse;

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

window.checkQuiz =
    checkQuiz;

window.checkProduction =
    checkProduction;

window.finishUnit =
    finishUnit;

window.rereadPassage =
    rereadPassage;

window.answerNotice =
    answerNotice;

window.continueFromNotice =
    continueFromNotice;

window.answerDirect =
    answerDirect;

window.revealChinese =
    revealChinese;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        init();

    }
);
