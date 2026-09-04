/* =========================================================
   EBRM V0.5
   English Bible Reading Model
   GitHub Pages 独立版
   ---------------------------------------------------------
   V0.5 新增：
   1. 英文声音选择器
   2. 自动优先男性英语声音
   3. 记住用户选择的声音
   4. 正常 / 慢速朗读
   5. 整段朗读
   6. 单节朗读
   7. 连续朗读
   8. 当前经文高亮
   9. 朗读3遍训练
   10. Production答案朗读
   ========================================================= */

const CONFIG = {
    BIBLE_API: "https://bible-api.com",
    TRANSLATION: "web",
    SPEECH_LANG: "en-US",

    STATE_KEY: "EBRM_V05_STATE",
    VOICE_KEY: "EBRM_V05_VOICE",

    NORMAL_RATE: 0.88,
    SLOW_RATE: 0.62
};


/* =========================================================
   1. 课程数据
   ========================================================= */

const UNITS = [

    {
        id: "J1-01",
        title: "The Word Became Flesh — Part 1",
        reference: "John 1:1–5",
        start: 1,
        end: 5,

        vocabulary: [
            {
                word: "beginning",
                meaning: "起初；开始",
                type: "noun"
            },
            {
                word: "Word",
                meaning: "道",
                type: "noun"
            },
            {
                word: "life",
                meaning: "生命",
                type: "noun"
            },
            {
                word: "light",
                meaning: "光",
                type: "noun"
            },
            {
                word: "darkness",
                meaning: "黑暗",
                type: "noun"
            }
        ],

        structures: [
            {
                pattern: "In the beginning was...",
                explanation: "表示“起初……就已经存在”。"
            },
            {
                pattern: "was with...",
                explanation: "表示“与……同在”。"
            },
            {
                pattern: "was God",
                explanation: "说明身份或本质。"
            }
        ],

        questions: [
            {
                question: "Who was in the beginning?",
                answer: "The Word."
            },
            {
                question: "Who was the Word with?",
                answer: "God."
            },
            {
                question: "What was the Word?",
                answer: "God."
            }
        ],

        context:
            "John begins his Gospel by presenting Jesus as the eternal Word. " +
            "The opening connects Jesus with creation, life, and light.",

        production:
            "In one English sentence, describe who the Word is."
    },


    {
        id: "J1-02",
        title: "The Witness to the Light",
        reference: "John 1:6–13",
        start: 6,
        end: 13,

        vocabulary: [
            {
                word: "witness",
                meaning: "见证人；见证",
                type: "noun"
            },
            {
                word: "testify",
                meaning: "作见证",
                type: "verb"
            },
            {
                word: "true",
                meaning: "真实的；真正的",
                type: "adjective"
            },
            {
                word: "receive",
                meaning: "接受",
                type: "verb"
            },
            {
                word: "believe",
                meaning: "相信",
                type: "verb"
            },
            {
                word: "children",
                meaning: "儿女",
                type: "noun"
            }
        ],

        structures: [
            {
                pattern: "There was a man...",
                explanation: "用于介绍一个人物。"
            },
            {
                pattern: "He came as a witness...",
                explanation: "as + 身份，表示“作为……”。"
            },
            {
                pattern: "those who believe",
                explanation: "who 引导关系从句，修饰 those。"
            }
        ],

        questions: [
            {
                question: "Who came as a witness?",
                answer: "John."
            },
            {
                question: "What did John testify about?",
                answer: "The light."
            },
            {
                question: "What happens to those who receive the Word?",
                answer: "They become children of God."
            }
        ],

        context:
            "John the Baptist is introduced as a witness. " +
            "His ministry points people toward the true light.",

        production:
            "Write one English sentence about John the Baptist's role."
    },


    {
        id: "J1-03",
        title: "The Word Became Flesh — Part 2",
        reference: "John 1:14–18",
        start: 14,
        end: 18,

        vocabulary: [
            {
                word: "flesh",
                meaning: "肉身",
                type: "noun"
            },
            {
                word: "glory",
                meaning: "荣耀",
                type: "noun"
            },
            {
                word: "grace",
                meaning: "恩典",
                type: "noun"
            },
            {
                word: "truth",
                meaning: "真理",
                type: "noun"
            },
            {
                word: "begotten",
                meaning: "独生的",
                type: "adjective"
            }
        ],

        structures: [
            {
                pattern: "The Word became flesh",
                explanation: "became + 名词，表示“变成/成为”。"
            },
            {
                pattern: "full of grace and truth",
                explanation: "full of 表示“充满……”。"
            },
            {
                pattern: "from his fullness",
                explanation: "from 表示来源。"
            }
        ],

        questions: [
            {
                question: "What did the Word become?",
                answer: "Flesh."
            },
            {
                question: "What was the Word full of?",
                answer: "Grace and truth."
            },
            {
                question: "Who has made God known?",
                answer: "Jesus Christ."
            }
        ],

        context:
            "John 1:14 is central to John's theology: the eternal Word became flesh. " +
            "God's glory is revealed through Jesus Christ.",

        production:
            "Write one English sentence explaining the incarnation."
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
                type: "noun"
            },
            {
                word: "Christ",
                meaning: "基督",
                type: "noun"
            },
            {
                word: "prophet",
                meaning: "先知",
                type: "noun"
            },
            {
                word: "voice",
                meaning: "声音",
                type: "noun"
            },
            {
                word: "prepare",
                meaning: "预备",
                type: "verb"
            }
        ],

        structures: [
            {
                pattern: "I am not...",
                explanation: "否定身份。"
            },
            {
                pattern: "I am the voice...",
                explanation: "说明身份与使命。"
            },
            {
                pattern: "make straight...",
                explanation: "使……变直；这里具有使命性的意义。"
            }
        ],

        questions: [
            {
                question: "Was John the Christ?",
                answer: "No."
            },
            {
                question: "Who did John say he was?",
                answer: "The voice crying in the wilderness."
            }
        ],

        context:
            "John refuses to take the identity of Christ. " +
            "He understands himself as a witness whose mission is to prepare the way.",

        production:
            "Describe John's mission in one English sentence."
    },


    {
        id: "J1-05",
        title: "Behold the Lamb of God",
        reference: "John 1:29–34",
        start: 29,
        end: 34,

        vocabulary: [
            {
                word: "Lamb",
                meaning: "羔羊",
                type: "noun"
            },
            {
                word: "sin",
                meaning: "罪",
                type: "noun"
            },
            {
                word: "reveal",
                meaning: "显明；启示",
                type: "verb"
            },
            {
                word: "Spirit",
                meaning: "圣灵",
                type: "noun"
            },
            {
                word: "remain",
                meaning: "停留；常住",
                type: "verb"
            }
        ],

        structures: [
            {
                pattern: "Behold...",
                explanation: "看哪；用于强调一个重要的人或事实。"
            },
            {
                pattern: "who takes away...",
                explanation: "who 引导关系从句。"
            },
            {
                pattern: "I have seen...",
                explanation: "现在完成时，表达过去发生但与现在有关的经验。"
            }
        ],

        questions: [
            {
                question: "Who takes away the sin of the world?",
                answer: "The Lamb of God."
            },
            {
                question: "What came down like a dove?",
                answer: "The Spirit."
            }
        ],

        context:
            "John identifies Jesus as the Lamb of God. " +
            "The Spirit's descent confirms Jesus' identity.",

        production:
            "Write one English sentence about Jesus as the Lamb of God."
    },


    {
        id: "J1-06",
        title: "Come and See",
        reference: "John 1:35–42",
        start: 35,
        end: 42,

        vocabulary: [
            {
                word: "follow",
                meaning: "跟随",
                type: "verb"
            },
            {
                word: "disciple",
                meaning: "门徒",
                type: "noun"
            },
            {
                word: "Rabbi",
                meaning: "拉比；夫子",
                type: "noun"
            },
            {
                word: "Messiah",
                meaning: "弥赛亚",
                type: "noun"
            },
            {
                word: "stay",
                meaning: "停留",
                type: "verb"
            }
        ],

        structures: [
            {
                pattern: "What are you seeking?",
                explanation: "现在进行时，用于询问当前正在寻找什么。"
            },
            {
                pattern: "Come and see",
                explanation: "两个动词并列，表示邀请。"
            },
            {
                pattern: "We have found...",
                explanation: "现在完成时表示“我们已经找到”。"
            }
        ],

        questions: [
            {
                question: "What did the two disciples do?",
                answer: "They followed Jesus."
            },
            {
                question: "What did Jesus invite them to do?",
                answer: "Come and see."
            },
            {
                question: "What did Andrew say they had found?",
                answer: "The Messiah."
            }
        ],

        context:
            "Discipleship begins with following Jesus. " +
            "John's witness leads people toward Jesus, and Jesus invites them to come and see.",

        production:
            "Write one English sentence about following Jesus."
    },


    {
        id: "J1-07",
        title: "Jesus Calls Philip and Nathanael",
        reference: "John 1:43–51",
        start: 43,
        end: 51,

        vocabulary: [
            {
                word: "follow",
                meaning: "跟随",
                type: "verb"
            },
            {
                word: "find",
                meaning: "找到",
                type: "verb"
            },
            {
                word: "written",
                meaning: "所写的",
                type: "adjective"
            },
            {
                word: "Nazarene",
                meaning: "拿撒勒人",
                type: "noun"
            },
            {
                word: "Israel",
                meaning: "以色列",
                type: "noun"
            }
        ],

        structures: [
            {
                pattern: "Follow me",
                explanation: "祈使句，用于呼召或命令。"
            },
            {
                pattern: "We have found...",
                explanation: "表示已经发现或找到某人/某事。"
            },
            {
                pattern: "You will see...",
                explanation: "will + 动词原形，表达未来。"
            }
        ],

        questions: [
            {
                question: "Who did Jesus say should follow him?",
                answer: "Philip."
            },
            {
                question: "What did Philip tell Nathanael?",
                answer: "We have found Jesus."
            },
            {
                question: "What did Jesus promise Nathanael?",
                answer: "He would see greater things."
            }
        ],

        context:
            "Jesus personally calls Philip. " +
            "Philip then invites Nathanael to come and see Jesus.",

        production:
            "Write one English sentence about Jesus calling a disciple."
    }

];


/* =========================================================
   2. 状态
   ========================================================= */

let currentUnit = null;
let currentPassage = null;

let speechRate = CONFIG.NORMAL_RATE;
let selectedVoice = null;

let continuousReading = false;
let repeatCount = 0;

let state = loadState();


function loadState() {

    try {

        const saved =
            localStorage.getItem(CONFIG.STATE_KEY);

        if (saved) {
            return JSON.parse(saved);
        }

    } catch (error) {
        console.warn("State load error:", error);
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
   3. 语音系统
   ========================================================= */

function getVoices() {

    return window.speechSynthesis
        ? window.speechSynthesis.getVoices()
        : [];
}


function isLikelyMaleVoice(voice) {

    const name =
        (voice.name || "").toLowerCase();

    const maleWords = [
        "male",
        "man",
        "david",
        "mark",
        "daniel",
        "george",
        "james",
        "alex",
        "guy",
        "ryan",
        "fred"
    ];

    return maleWords.some(word =>
        name.includes(word)
    );
}


function getEnglishVoices() {

    return getVoices().filter(voice => {

        const lang =
            (voice.lang || "").toLowerCase();

        return (
            lang.startsWith("en-us") ||
            lang.startsWith("en-gb") ||
            lang.startsWith("en-au") ||
            lang.startsWith("en-ca")
        );

    });

}


function chooseBestVoice() {

    const voices =
        getEnglishVoices();

    if (!voices.length) {
        return null;
    }

    const savedVoice =
        localStorage.getItem(CONFIG.VOICE_KEY);

    if (savedVoice) {

        const saved =
            voices.find(
                voice => voice.name === savedVoice
            );

        if (saved) {
            return saved;
        }
    }


    /*
     * 第一优先：
     * 看名字是否明显属于男性声音
     */

    const male =
        voices.find(isLikelyMaleVoice);

    if (male) {
        return male;
    }


    /*
     * 第二优先：
     * Google / Microsoft 英语声音
     */

    const preferred =
        voices.find(voice => {

            const name =
                (voice.name || "").toLowerCase();

            return (
                name.includes("google") ||
                name.includes("microsoft")
            );

        });

    if (preferred) {
        return preferred;
    }


    /*
     * 第三优先：
     * 美国英语
     */

    const us =
        voices.find(
            voice =>
                voice.lang.toLowerCase() === "en-us"
        );

    return us || voices[0];
}


function initVoices() {

    selectedVoice =
        chooseBestVoice();

    renderVoiceSelector();
}


function populateVoiceSelector(select) {

    const voices =
        getEnglishVoices();

    select.innerHTML = "";

    if (!voices.length) {

        const option =
            document.createElement("option");

        option.textContent =
            "No English voice detected";

        select.appendChild(option);

        return;
    }


    voices.forEach(voice => {

        const option =
            document.createElement("option");

        option.value = voice.name;

        let label = voice.name;

        if (isLikelyMaleVoice(voice)) {
            label += " — Male?";
        }

        label += ` (${voice.lang})`;

        option.textContent = label;

        if (
            selectedVoice &&
            voice.name === selectedVoice.name
        ) {
            option.selected = true;
        }

        select.appendChild(option);

    });

}


function renderVoiceSelector() {

    const old =
        document.getElementById("ebrmVoicePanel");

    if (old) {
        old.remove();
    }


    const passageScreen =
        document.getElementById("read");

    if (!passageScreen) {
        return;
    }


    const panel =
        document.createElement("div");

    panel.id =
        "ebrmVoicePanel";

    panel.className =
        "audio-card";


    panel.innerHTML = `

        <div class="audio-title">
            🎙️ English Voice
        </div>

        <select
            id="ebrmVoiceSelect"
            style="
                width:100%;
                padding:10px;
                margin-top:8px;
                border-radius:10px;
                border:1px solid #ddd;
                background:white;
                font-size:14px;
            "
        ></select>

        <div
            style="
                margin-top:8px;
                font-size:12px;
                color:#777;
            "
        >
            建议选择 Male / 男性英文声音。
            可用声音取决于你的 Windows / Chrome 语音系统。
        </div>

    `;


    const audioControls =
        passageScreen.querySelector(
            ".audio-controls"
        );


    if (audioControls) {

        audioControls
            .parentNode
            .insertBefore(
                panel,
                audioControls
            );

    } else {

        const passage =
            document.getElementById(
                "passageText"
            );

        if (passage) {
            passage.parentNode.insertBefore(
                panel,
                passage
            );
        }
    }


    const select =
        document.getElementById(
            "ebrmVoiceSelect"
        );

    populateVoiceSelector(select);


    select.addEventListener(
        "change",
        function () {

            const voices =
                getEnglishVoices();

            selectedVoice =
                voices.find(
                    voice =>
                        voice.name === this.value
                );

            if (selectedVoice) {

                localStorage.setItem(
                    CONFIG.VOICE_KEY,
                    selectedVoice.name
                );

            }

        }
    );

}


/* =========================================================
   4. 语音朗读
   ========================================================= */

function speakText(
    text,
    verseElement = null,
    callback = null
) {

    if (!window.speechSynthesis) {

        alert(
            "你的浏览器不支持语音朗读。请使用 Chrome 或 Edge。"
        );

        return;
    }


    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(text);


    utterance.lang =
        CONFIG.SPEECH_LANG;

    utterance.rate =
        speechRate;

    utterance.pitch =
        0.92;

    utterance.volume =
        1;


    if (selectedVoice) {
        utterance.voice =
            selectedVoice;
    }


    if (verseElement) {

        clearVerseHighlight();

        verseElement.classList.add(
            "verse-speaking"
        );

    }


    utterance.onend =
        function () {

            if (verseElement) {
                verseElement.classList.remove(
                    "verse-speaking"
                );
            }

            if (callback) {
                callback();
            }

        };


    utterance.onerror =
        function (event) {

            console.warn(
                "Speech error:",
                event
            );

            clearVerseHighlight();

        };


    window.speechSynthesis
        .speak(utterance);

}


function speakPassage() {

    if (!currentPassage) {
        return;
    }


    stopSpeech();


    const text =
        currentPassage.verses
            .map(v => v.text)
            .join(" ");


    speakText(text);

}


function speakVerse(
    index
) {

    if (!currentPassage) {
        return;
    }


    const verse =
        currentPassage.verses[index];

    if (!verse) {
        return;
    }


    const elements =
        document.querySelectorAll(
            ".verse"
        );

    const element =
        elements[index];


    speakText(
        verse.text,
        element
    );

}


function speakAllVerses(
    index = 0
) {

    if (!currentPassage) {
        return;
    }


    const verses =
        currentPassage.verses;


    if (index >= verses.length) {

        continuousReading = false;

        return;
    }


    if (!continuousReading) {
        return;
    }


    const elements =
        document.querySelectorAll(
            ".verse"
        );


    speakText(
        verses[index].text,
        elements[index],
        function () {

            setTimeout(
                () => {
                    speakAllVerses(index + 1);
                },
                250
            );

        }
    );

}


function startContinuousReading() {

    if (!currentPassage) {
        return;
    }

    stopSpeech();

    continuousReading = true;

    speakAllVerses(0);

}


function stopSpeech() {

    continuousReading = false;

    repeatCount = 0;

    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    clearVerseHighlight();

}


function clearVerseHighlight() {

    document
        .querySelectorAll(".verse-speaking")
        .forEach(element => {

            element.classList.remove(
                "verse-speaking"
            );

        });

}


function toggleSlow() {

    if (
        speechRate === CONFIG.NORMAL_RATE
    ) {

        speechRate =
            CONFIG.SLOW_RATE;

    } else {

        speechRate =
            CONFIG.NORMAL_RATE;

    }


    const label =
        document.getElementById(
            "speedLabel"
        );

    if (label) {

        label.textContent =
            speechRate === CONFIG.NORMAL_RATE
                ? "正常速度"
                : "慢速";

    }

}


function speakProductionAnswer() {

    const answer =
        document.getElementById(
            "productionAnswer"
        );

    if (!answer) {
        return;
    }


    const text =
        answer.value.trim();

    if (!text) {

        alert(
            "请先写下你的英文答案。"
        );

        return;
    }


    speakText(text);

}


/* =========================================================
   5. 朗读三遍训练
   ========================================================= */

function listenThreeTimes() {

    if (!currentPassage) {
        return;
    }


    stopSpeech();

    repeatCount = 0;


    function play() {

        if (repeatCount >= 3) {
            return;
        }


        repeatCount++;


        const text =
            currentPassage.verses
                .map(v => v.text)
                .join(" ");


        speakText(
            text,
            null,
            function () {

                setTimeout(
                    play,
                    500
                );

            }
        );

    }


    play();

}


/* =========================================================
   6. 加载经文
   ========================================================= */

async function loadPassage(
    start,
    end
) {

    const passageText =
        document.getElementById(
            "passageText"
        );

    if (!passageText) {
        return;
    }


    passageText.innerHTML =
        `<div class="loading">
            Loading Scripture...
        </div>`;


    const reference =
        `John 1:${start}-${end}`;


    try {

        const url =
            `${CONFIG.BIBLE_API}/${encodeURIComponent(reference)}` +
            `?translation=${CONFIG.TRANSLATION}`;


        const response =
            await fetch(url);


        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        currentPassage = data;


        renderPassage(data);


    } catch (error) {

        console.error(
            "Bible API error:",
            error
        );


        passageText.innerHTML = `

            <div
                style="
                    padding:20px;
                    background:#fff3f3;
                    border-radius:12px;
                    color:#b42318;
                "
            >

                <strong>
                    经文加载失败
                </strong>

                <p>
                    请检查网络连接后重新打开本课。
                </p>

                <small>
                    ${error.message}
                </small>

            </div>

        `;

    }

}


/* =========================================================
   7. 经文显示
   ========================================================= */

function renderPassage(data) {

    const container =
        document.getElementById(
            "passageText"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    data.verses.forEach(
        (verse, index) => {

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "verse";


            span.dataset.index =
                index;


            span.innerHTML = `

                <sup>
                    ${verse.verse}
                </sup>

                ${escapeHTML(
                    verse.text
                )}

            `;


            span.addEventListener(
                "click",
                function () {

                    speakVerse(index);

                }
            );


            container.appendChild(span);

            container.appendChild(
                document.createTextNode(" ")
            );

        }
    );


    addSpeechTrainingButtons();

}


/* =========================================================
   8. 朗读控制
   ========================================================= */

function addSpeechTrainingButtons() {

    const existing =
        document.getElementById(
            "ebrmSpeechTools"
        );

    if (existing) {
        existing.remove();
    }


    const passage =
        document.getElementById(
            "passageText"
        );

    if (!passage) {
        return;
    }


    const tools =
        document.createElement("div");

    tools.id =
        "ebrmSpeechTools";


    tools.className =
        "audio-controls";


    tools.innerHTML = `

        <button
            class="secondary-btn"
            onclick="speakPassage()"
        >
            🔊 整段朗读
        </button>

        <button
            class="secondary-btn"
            onclick="startContinuousReading()"
        >
            ▶️ 连续逐节
        </button>

        <button
            class="secondary-btn"
            onclick="listenThreeTimes()"
        >
            🔁 听3遍
        </button>

        <button
            class="secondary-btn"
            onclick="toggleSlow()"
        >
            🐢 <span id="speedLabel">
                正常速度
            </span>
        </button>

        <button
            class="secondary-btn"
            onclick="stopSpeech()"
        >
            ⏹ 停止
        </button>

    `;


    passage.parentNode.insertBefore(
        tools,
        passage.nextSibling
    );

}


/* =========================================================
   9. Vocabulary
   ========================================================= */

function renderVocabulary() {

    const list =
        document.getElementById(
            "vocabularyList"
        );

    if (!list || !currentUnit) {
        return;
    }


    list.innerHTML =
        currentUnit.vocabulary
            .map((item, index) => `

                <div class="vocab-card">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                        "
                    >

                        <strong>
                            ${item.word}
                        </strong>

                        <button
                            class="mini-btn"
                            onclick="
                                speakText(
                                    '${escapeJS(item.word)}'
                                )
                            "
                        >
                            🔊
                        </button>

                    </div>

                    <div>
                        ${item.meaning}
                    </div>

                    <small>
                        ${item.type}
                    </small>

                </div>

            `)
            .join("");

}


/* =========================================================
   10. Structure
   ========================================================= */

function renderStructure() {

    const list =
        document.getElementById(
            "structureList"
        );

    if (!list || !currentUnit) {
        return;
    }


    list.innerHTML =
        currentUnit.structures
            .map(item => `

                <div class="structure-card">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            gap:10px;
                        "
                    >

                        <strong>
                            ${item.pattern}
                        </strong>

                        <button
                            class="mini-btn"
                            onclick="
                                speakText(
                                    '${escapeJS(item.pattern)}'
                                )
                            "
                        >
                            🔊
                        </button>

                    </div>

                    <p>
                        ${item.explanation}
                    </p>

                </div>

            `)
            .join("");

}


/* =========================================================
   11. Questions
   ========================================================= */

function renderQuestions() {

    const list =
        document.getElementById(
            "questionList"
        );

    if (!list || !currentUnit) {
        return;
    }


    list.innerHTML =
        currentUnit.questions
            .map((item, index) => `

                <div class="question-card">

                    <p>
                        <strong>
                            ${index + 1}.
                            ${item.question}
                        </strong>
                    </p>

                    <input
                        type="text"
                        class="quiz-input"
                        data-answer="${escapeHTML(
                            item.answer
                        )}"
                        placeholder="Type your answer..."
                    >

                </div>

            `)
            .join("");


    const score =
        document.getElementById(
            "quizScore"
        );

    if (score) {
        score.textContent = "";
    }

}


/* =========================================================
   12. Quiz
   ========================================================= */

function checkQuiz() {

    const inputs =
        document.querySelectorAll(
            ".quiz-input"
        );


    let correct = 0;


    inputs.forEach(input => {

        const user =
            input.value
                .trim()
                .toLowerCase();


        const answer =
            input.dataset.answer
                .trim()
                .toLowerCase();


        if (
            user === answer ||
            user.includes(answer) ||
            answer.includes(user)
        ) {

            correct++;

            input.style.border =
                "2px solid #4caf50";

        } else {

            input.style.border =
                "2px solid #e57373";

        }

    });


    const score =
        document.getElementById(
            "quizScore"
        );


    if (score) {

        score.textContent =
            `Score: ${correct}/${inputs.length}`;

    }

}


/* =========================================================
   13. Production
   ========================================================= */

function checkProduction() {

    const input =
        document.getElementById(
            "productionAnswer"
        );

    const result =
        document.getElementById(
            "productionResult"
        );


    if (!input || !result) {
        return;
    }


    const answer =
        input.value.trim();


    if (!answer) {

        result.innerHTML =
            "Please write an English sentence first.";

        return;
    }


    const wordCount =
        answer
            .split(/\s+/)
            .filter(Boolean)
            .length;


    if (wordCount < 4) {

        result.innerHTML =
            "Try to write a little more. " +
            "Aim for at least 4 English words.";

    } else {

        result.innerHTML =
            "Good. You produced an English sentence. " +
            "Now read it aloud.";

    }

}


/* =========================================================
   14. 打开课程
   ========================================================= */

function openUnit(unitId) {

    const unit =
        UNITS.find(
            u => u.id === unitId
        );


    if (!unit) {
        return;
    }


    currentUnit =
        unit;


    const title =
        document.getElementById(
            "readTitle"
        );

    const reference =
        document.getElementById(
            "readReference"
        );


    if (title) {
        title.textContent =
            unit.title;
    }


    if (reference) {
        reference.textContent =
            unit.reference;
    }


    const context =
        document.getElementById(
            "contextText"
        );

    if (context) {
        context.textContent =
            unit.context;
    }


    const prompt =
        document.getElementById(
            "productionPrompt"
        );

    if (prompt) {
        prompt.textContent =
            unit.production;
    }


    loadPassage(
        unit.start,
        unit.end
    );


    renderVocabulary();
    renderStructure();
    renderQuestions();


    renderVoiceSelector();


    go("read");

}


/* =========================================================
   15. 完成课程
   ========================================================= */

function finishUnit() {

    if (!currentUnit) {
        return;
    }


    const id =
        currentUnit.id;


    state.completed[id] =
        new Date().toISOString();


    state.reviews[id] = {

        day1: getReviewDate(1),
        day3: getReviewDate(3),
        day7: getReviewDate(7)

    };


    saveState();


    const message =
        document.getElementById(
            "doneMessage"
        );


    if (message) {

        message.textContent =
            `You completed ${currentUnit.reference}.`;

    }


    renderHome();


    go("done");

}


function getReviewDate(days) {

    const date =
        new Date();

    date.setDate(
        date.getDate() + days
    );

    return date.toISOString();

}


/* =========================================================
   16. Home
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
        UNITS.map((unit, index) => {

            const completed =
                state.completed[unit.id];


            return `

                <div
                    class="unit-card"
                    onclick="
                        openUnit('${unit.id}')
                    "
                >

                    <div class="unit-number">
                        ${index + 1}
                    </div>

                    <div>

                        <strong>
                            ${unit.title}
                        </strong>

                        <div>
                            ${unit.reference}
                        </div>

                        ${
                            completed
                                ? `
                                    <small>
                                        ✓ Completed
                                    </small>
                                `
                                : ""
                        }

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   17. Review
   ========================================================= */

function renderReviews() {

    const list =
        document.getElementById(
            "reviewList"
        );

    if (!list) {
        return;
    }


    const today =
        new Date();


    const due = [];


    UNITS.forEach(unit => {

        const review =
            state.reviews[unit.id];


        if (!review) {
            return;
        }


        const dates = [
            {
                type: "Day 1",
                date: review.day1
            },
            {
                type: "Day 3",
                date: review.day3
            },
            {
                type: "Day 7",
                date: review.day7
            }
        ];


        dates.forEach(item => {

            if (
                new Date(item.date) <= today
            ) {

                due.push({
                    unit,
                    type: item.type
                });

            }

        });

    });


    if (!due.length) {

        list.innerHTML = `

            <div class="empty-state">
                No reviews due today.
            </div>

        `;

        return;
    }


    list.innerHTML =
        due.map(item => `

            <div class="review-card">

                <strong>
                    ${item.unit.reference}
                </strong>

                <div>
                    ${item.type}
                </div>

                <button
                    class="primary-btn"
                    onclick="
                        openUnit('${item.unit.id}')
                    "
                >
                    Review
                </button>

            </div>

        `).join("");

}


/* =========================================================
   18. 页面导航
   ========================================================= */

function go(screenId) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

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


    if (screenId === "home") {
        renderHome();
    }


    if (screenId === "review") {
        renderReviews();
    }


    if (screenId === "read") {

        setTimeout(
            renderVoiceSelector,
            100
        );

    }

}


/* =========================================================
   19. HTML 安全处理
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeJS(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "");

}


/* =========================================================
   20. 初始化
   ========================================================= */

function init() {

    renderHome();

    /*
     * 浏览器第一次启动时，
     * voices 可能还没有加载完成。
     */

    if (
        window.speechSynthesis
    ) {

        initVoices();


        window.speechSynthesis
            .addEventListener(
                "voiceschanged",
                function () {

                    initVoices();

                }
            );

    }

}


/* =========================================================
   21. 暴露给 HTML onclick
   ========================================================= */

window.openUnit =
    openUnit;

window.go =
    go;

window.speakText =
    speakText;

window.speakPassage =
    speakPassage;

window.speakVerse =
    speakVerse;

window.startContinuousReading =
    startContinuousReading;

window.listenThreeTimes =
    listenThreeTimes;

window.stopSpeech =
    stopSpeech;

window.toggleSlow =
    toggleSlow;

window.speakProductionAnswer =
    speakProductionAnswer;

window.checkQuiz =
    checkQuiz;

window.checkProduction =
    checkProduction;

window.finishUnit =
    finishUnit;


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);
