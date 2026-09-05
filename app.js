/* =========================================================
   EBRM V0.9
   English Bible Reading Model

   JOHN 1 COMPLETE COURSE ENGINE

   7 Training Units
   ---------------------------------------------------------
   Unit 01 : John 1:1–5
   Unit 02 : John 1:6–13
   Unit 03 : John 1:14–18
   Unit 04 : John 1:19–28
   Unit 05 : John 1:29–34
   Unit 06 : John 1:35–42
   Unit 07 : John 1:43–51

   Training Flow
   ---------------------------------------------------------
   BASELINE
   READ
   LISTEN
   NOTICE
   VOCABULARY
   STRUCTURE
   DIRECT COMPREHENSION
   SPEAK
   RE-READ
   FINAL TEST
   RESULT
   REVIEW
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
        "EBRM_V09_STATE",

    VOICE_KEY:
        "EBRM_V09_VOICE"

};


/* =========================================================
   JOHN 1 COURSE
========================================================= */

const COURSE = [

    /* =====================================================
       UNIT 01
    ===================================================== */

    {

        id:
            "john1-01",

        number:
            1,

        reference:
            "John 1:1–5",

        title:
            "The Word · Life · Light",

        verses: [

            {
                verse: 1,
                text:
                    "In the beginning was the Word, and the Word was with God, and the Word was God."
            },

            {
                verse: 2,
                text:
                    "The same was in the beginning with God."
            },

            {
                verse: 3,
                text:
                    "All things were made through him. Without him, nothing was made that has been made."
            },

            {
                verse: 4,
                text:
                    "In him was life, and the life was the light of men."
            },

            {
                verse: 5,
                text:
                    "The light shines in the darkness, and the darkness hasn’t overcome it."
            }

        ],

        vocabulary: [

            ["Word", "道", "the Word"],

            ["beginning", "起初", "the start"],

            ["with", "与……同在", "together with"],

            ["life", "生命", "life"],

            ["light", "光", "light"],

            ["darkness", "黑暗", "darkness"],

            ["overcome", "胜过", "to defeat"]

        ],

        structures: [

            [
                "In the beginning was the Word.",
                "时间背景 + 核心主语。"
            ],

            [
                "The Word was with God.",
                "was with 表达关系。"
            ],

            [
                "The Word was God.",
                "Subject + be + complement。"
            ],

            [
                "In him was life.",
                "in him 放在前面突出生命所在。"
            ],

            [
                "The light shines in the darkness.",
                "主语 + 动作 + 环境。"
            ]

        ],

        notice: [

            [
                "What word is repeated as a major focus?",
                [
                    "Word",
                    "Temple",
                    "King"
                ],
                0
            ],

            [
                "What two ideas are contrasted?",
                [
                    "Light and darkness",
                    "King and servant",
                    "Life and money"
                ],
                0
            ],

            [
                "What is connected with the Word?",
                [
                    "God, creation, life, and light",
                    "Rome, law, and temple",
                    "Water, fire, and army"
                ],
                0
            ],

            [
                "What does the darkness fail to do?",
                [
                    "Overcome the light",
                    "Create life",
                    "Become the Word"
                ],
                0
            ]

        ],

        direct: [

            [
                "Who was with God in the beginning?",
                [
                    "The Word",
                    "John",
                    "Moses"
                ],
                0,
                "道与神同在。"
            ],

            [
                "What was in the Word?",
                [
                    "Darkness",
                    "Life",
                    "Death"
                ],
                1,
                "生命在祂里面。"
            ],

            [
                "What was the life in the Word?",
                [
                    "The light of men",
                    "The law of Moses",
                    "The temple"
                ],
                0,
                "这生命就是人的光。"
            ],

            [
                "Where does the light shine?",
                [
                    "In the darkness",
                    "In the temple",
                    "In Rome"
                ],
                0,
                "光照在黑暗里。"
            ],

            [
                "Has the darkness overcome the light?",
                [
                    "Yes",
                    "No",
                    "The passage does not say"
                ],
                1,
                "黑暗没有胜过光。"
            ]

        ],

        production:
            "In simple English, explain who the Word is and what is in the Word."

    },


    /* =====================================================
       UNIT 02
    ===================================================== */

    {

        id:
            "john1-02",

        number:
            2,

        reference:
            "John 1:6–13",

        title:
            "The Light Comes into the World",

        verses: [

            {
                verse: 6,
                text:
                    "There came a man, sent from God, whose name was John."
            },

            {
                verse: 7,
                text:
                    "The same came as a witness, that he might testify about the light, that all might believe through him."
            },

            {
                verse: 8,
                text:
                    "He was not the light, but was sent that he might testify about the light."
            },

            {
                verse: 9,
                text:
                    "The true light that enlightens everyone was coming into the world."
            },

            {
                verse: 10,
                text:
                    "He was in the world, and the world was made through him, and the world didn’t recognize him."
            },

            {
                verse: 11,
                text:
                    "He came to his own, and those who were his own didn’t receive him."
            },

            {
                verse: 12,
                text:
                    "But as many as received him, to them he gave the right to become God’s children, to those who believe in his name."
            },

            {
                verse: 13,
                text:
                    "Who were born not of blood, nor of the will of the flesh, nor of the will of man, but of God."
            }

        ],

        vocabulary: [

            ["witness", "见证人", "a person who gives testimony"],

            ["testify", "作见证", "to give evidence"],

            ["true", "真实的", "real or genuine"],

            ["recognize", "认识", "to know or identify"],

            ["receive", "领受", "to accept"],

            ["believe", "相信", "to trust"],

            ["children", "儿女", "children"]

        ],

        structures: [

            [
                "There came a man, sent from God.",
                "there + 动词结构引入人物。"
            ],

            [
                "that he might testify about the light",
                "that + 主语 + might 表达目的。"
            ],

            [
                "He was not the light.",
                "be 动词否定结构。"
            ],

            [
                "He came to his own.",
                "come + to 表达来到某处/某群体。"
            ],

            [
                "he gave the right to become God's children",
                "give + 人 + 名词 + to do。"
            ]

        ],

        notice: [

            [
                "What was John's main role?",
                [
                    "To bear witness",
                    "To become the light",
                    "To create the world"
                ],
                0
            ],

            [
                "What happened when the light came into the world?",
                [
                    "Everyone received him",
                    "The world did not recognize him",
                    "Everyone became prophets"
                ],
                1
            ],

            [
                "What can people become?",
                [
                    "God's children",
                    "Angels",
                    "Kings"
                ],
                0
            ]

        ],

        direct: [

            [
                "Who sent John?",
                [
                    "God",
                    "Rome",
                    "Moses"
                ],
                0,
                "约翰是从神那里来的。"
            ],

            [
                "Why was John sent?",
                [
                    "To testify about the light",
                    "To become the light",
                    "To build a temple"
                ],
                0,
                "约翰为光作见证。"
            ],

            [
                "Did the world recognize him?",
                [
                    "Yes",
                    "No",
                    "Only Rome did"
                ],
                1,
                "世界却不认识祂。"
            ],

            [
                "What does God give to those who receive him?",
                [
                    "The right to become God's children",
                    "Political power",
                    "Money"
                ],
                0,
                "赐他们成为神儿女的权柄。"
            ]

        ],

        production:
            "In simple English, explain John's role and the response of the world to the light."

    },


    /* =====================================================
       UNIT 03
    ===================================================== */

    {

        id:
            "john1-03",

        number:
            3,

        reference:
            "John 1:14–18",

        title:
            "The Word Became Flesh",

        verses: [

            {
                verse: 14,
                text:
                    "The Word became flesh and lived among us. We saw his glory, such glory as of the only born Son of the Father, full of grace and truth."
            },

            {
                verse: 15,
                text:
                    "John testified about him. He cried out, saying, 'This was he of whom I said, He who comes after me has surpassed me, for he was before me.'"
            },

            {
                verse: 16,
                text:
                    "From his fullness we all received grace upon grace."
            },

            {
                verse: 17,
                text:
                    "For the law was given through Moses. Grace and truth came through Jesus Christ."
            },

            {
                verse: 18,
                text:
                    "No one has seen God at any time. The only born Son, who is in the bosom of the Father, has declared him."
            }

        ],

        vocabulary: [

            ["flesh", "肉身", "human bodily existence"],

            ["dwelt", "居住", "lived among"],

            ["glory", "荣耀", "splendor and honor"],

            ["fullness", "丰盛", "complete abundance"],

            ["grace", "恩典", "undeserved favor"],

            ["truth", "真理", "what is true"],

            ["declared", "显明", "made known"]

        ],

        structures: [

            [
                "The Word became flesh.",
                "became + 名词，表达进入新的状态。"
            ],

            [
                "We saw his glory.",
                "主语 + 动词 + 宾语。"
            ],

            [
                "From his fullness we all received grace.",
                "from 突出来源。"
            ],

            [
                "Grace and truth came through Jesus Christ.",
                "came through 表达媒介/途径。"
            ]

        ],

        notice: [

            [
                "What did the Word become?",
                [
                    "Flesh",
                    "An angel",
                    "A prophet"
                ],
                0
            ],

            [
                "What was the Word full of?",
                [
                    "Grace and truth",
                    "Money and power",
                    "Fear and judgment"
                ],
                0
            ],

            [
                "What did the witnesses see?",
                [
                    "His glory",
                    "His palace",
                    "His army"
                ],
                0
            ]

        ],

        direct: [

            [
                "What did the Word become?",
                [
                    "Flesh",
                    "Light",
                    "Darkness"
                ],
                0,
                "道成了肉身。"
            ],

            [
                "What did people receive from his fullness?",
                [
                    "Grace upon grace",
                    "Political power",
                    "Wealth"
                ],
                0,
                "从祂丰盛里领受恩典。"
            ],

            [
                "Through whom did grace and truth come?",
                [
                    "Moses",
                    "Jesus Christ",
                    "John"
                ],
                1,
                "恩典和真理由耶稣基督而来。"
            ]

        ],

        production:
            "In simple English, explain why John 1:14 is important."

    },


    /* =====================================================
       UNIT 04
    ===================================================== */

    {

        id:
            "john1-04",

        number:
            4,

        reference:
            "John 1:19–28",

        title:
            "John's Witness",

        verses: [

            {
                verse: 19,
                text:
                    "This is John’s testimony, when the Jews sent priests and Levites from Jerusalem to ask him, 'Who are you?'"
            },

            {
                verse: 20,
                text:
                    "He declared, and didn’t deny, but he declared, 'I am not the Christ.'"
            },

            {
                verse: 21,
                text:
                    "They asked him, 'What then? Are you Elijah?' He said, 'I am not.' 'Are you the prophet?' He answered, 'No.'"
            },

            {
                verse: 22,
                text:
                    "They said therefore to him, 'Who are you? Give us an answer, that we may give an answer to those who sent us. What do you say about yourself?'"
            },

            {
                verse: 23,
                text:
                    "He said, 'I am the voice of one crying in the wilderness, Make straight the way of the Lord, as Isaiah the prophet said.'"
            },

            {
                verse: 24,
                text:
                    "The ones who had been sent were from the Pharisees."
            },

            {
                verse: 25,
                text:
                    "They asked him, 'Why then do you baptize, if you are not the Christ, nor Elijah, nor the prophet?'"
            },

            {
                verse: 26,
                text:
                    "John answered them, 'I baptize in water, but among you stands one whom you don’t know.'"
            },

            {
                verse: 27,
                text:
                    "He is the one who comes after me, who has come to be before me, whose sandal strap I’m not worthy to untie.'"
            },

            {
                verse: 28,
                text:
                    "These things were done in Bethany beyond the Jordan, where John was baptizing."
            }

        ],

        vocabulary: [

            ["testimony", "见证", "testimony"],

            ["confess", "承认", "to openly state"],

            ["Christ", "基督", "Messiah"],

            ["prophet", "先知", "prophet"],

            ["voice", "声音", "voice"],

            ["wilderness", "旷野", "desert region"],

            ["worthy", "配得", "deserving"]

        ],

        structures: [

            [
                "Who are you?",
                "疑问句推动身份确认。"
            ],

            [
                "I am not the Christ.",
                "be + not + 名词。"
            ],

            [
                "I am the voice of one crying...",
                "I am + 名词定义身份。"
            ],

            [
                "Make straight the way of the Lord.",
                "祈使句，表达使命。"
            ]

        ],

        notice: [

            [
                "Who was John not?",
                [
                    "The Christ",
                    "A witness",
                    "A voice"
                ],
                0
            ],

            [
                "What did John call himself?",
                [
                    "The king",
                    "The voice",
                    "The Messiah"
                ],
                1
            ],

            [
                "Who did John point toward?",
                [
                    "The coming Lord",
                    "Himself",
                    "Rome"
                ],
                0
            ]

        ],

        direct: [

            [
                "Was John the Christ?",
                [
                    "Yes",
                    "No",
                    "The passage does not say"
                ],
                1,
                "约翰不是基督。"
            ],

            [
                "What did John call himself?",
                [
                    "The voice",
                    "The king",
                    "The light"
                ],
                0,
                "约翰说自己是声音。"
            ],

            [
                "What was John preparing?",
                [
                    "The way of the Lord",
                    "A palace",
                    "A kingdom"
                ],
                0,
                "他预备主的道路。"
            ]

        ],

        production:
            "In simple English, explain how John understood his own role."

    },


    /* =====================================================
       UNIT 05
    ===================================================== */

    {

        id:
            "john1-05",

        number:
            5,

        reference:
            "John 1:29–34",

        title:
            "The Lamb of God",

        verses: [

            {
                verse: 29,
                text:
                    "The next day, he saw Jesus coming to him, and said, 'Behold, the Lamb of God, who takes away the sin of the world!'"
            },

            {
                verse: 30,
                text:
                    "This is he of whom I said, 'After me comes a man who is before me, for he was before me.'"
            },

            {
                verse: 31,
                text:
                    "I didn’t recognize him, but for this reason I came baptizing in water: that he would be revealed to Israel."
            },

            {
                verse: 32,
                text:
                    "John testified, saying, 'I have seen the Spirit descending like a dove out of heaven, and it remained on him.'"
            },

            {
                verse: 33,
                text:
                    "I didn’t recognize him, but he who sent me to baptize in water, he said to me, 'On whomever you will see the Spirit descending and remaining on him, the same is he who baptizes in the Holy Spirit.'"
            },

            {
                verse: 34,
                text:
                    "I have seen and have testified that this is the Son of God."
            }

        ],

        vocabulary: [

            ["Lamb", "羔羊", "Lamb"],

            ["sin", "罪", "sin"],

            ["take away", "除去", "remove"],

            ["Spirit", "圣灵", "Spirit"],

            ["descend", "降下", "come down"],

            ["remain", "停留", "stay"],

            ["testified", "作见证", "gave testimony"]

        ],

        structures: [

            [
                "Behold, the Lamb of God.",
                "behold 用来引起注意。"
            ],

            [
                "who takes away the sin of the world",
                "关系从句说明人物的行动。"
            ],

            [
                "I have seen the Spirit descending.",
                "现在完成时 + 感官动作。"
            ],

            [
                "this is the Son of God",
                "this is + 身份确认。"
            ]

        ],

        notice: [

            [
                "What title does John give Jesus?",
                [
                    "The Lamb of God",
                    "The King of Rome",
                    "The Prophet"
                ],
                0
            ],

            [
                "What does the Lamb take away?",
                [
                    "The sin of the world",
                    "The temple",
                    "The law"
                ],
                0
            ],

            [
                "What descended on Jesus?",
                [
                    "The Spirit",
                    "Fire",
                    "Water"
                ],
                0
            ]

        ],

        direct: [

            [
                "Who is the Lamb of God?",
                [
                    "Jesus",
                    "John",
                    "Moses"
                ],
                0,
                "耶稣是神的羔羊。"
            ],

            [
                "What does the Lamb take away?",
                [
                    "The sin of the world",
                    "The temple",
                    "The law"
                ],
                0,
                "除去世人的罪。"
            ],

            [
                "What remained on Jesus?",
                [
                    "The Spirit",
                    "The crown",
                    "The book"
                ],
                0,
                "圣灵停留在祂身上。"
            ],

            [
                "What did John testify?",
                [
                    "Jesus is the Son of God",
                    "John is the Son of God",
                    "Jesus is a Roman king"
                ],
                0,
                "约翰见证耶稣是神的儿子。"
            ]

        ],

        production:
            "In simple English, explain what John says Jesus came to do."

    },


    /* =====================================================
       UNIT 06
    ===================================================== */

    {

        id:
            "john1-06",

        number:
            6,

        reference:
            "John 1:35–42",

        title:
            "Come and See",

        verses: [

            {
                verse: 35,
                text:
                    "Again, the next day, John was standing with two of his disciples,"
            },

            {
                verse: 36,
                text:
                    "and he looked at Jesus as he walked, and said, 'Behold, the Lamb of God!'"
            },

            {
                verse: 37,
                text:
                    "The two disciples heard him speak, and they followed Jesus."
            },

            {
                verse: 38,
                text:
                    "Jesus turned and saw them following, and said to them, 'What are you looking for?' They said to him, 'Rabbi,' which is to say, being interpreted, 'Teacher, where are you staying?'"
            },

            {
                verse: 39,
                text:
                    "He said to them, 'Come and see.' They came and saw where he was staying, and they stayed with him that day. It was about the tenth hour."
            },

            {
                verse: 40,
                text:
                    "One of the two who heard John and followed him was Andrew, Simon Peter’s brother."
            },

            {
                verse: 41,
                text:
                    "He first found his own brother, Simon, and said to him, 'We have found the Messiah!' which is, being interpreted, Christ."
            },

            {
                verse: 42,
                text:
                    "He brought him to Jesus. Jesus looked at him, and said, 'You are Simon the son of Jonah. You shall be called Cephas,' which is by interpretation, Peter."
            }

        ],

        vocabulary: [

            ["disciple", "门徒", "follower"],

            ["follow", "跟随", "go after"],

            ["Rabbi", "拉比", "teacher"],

            ["Messiah", "弥赛亚", "Christ"],

            ["stay", "停留", "remain"],

            ["found", "找到", "discovered"],

            ["bring", "带来", "take someone to another person"]

        ],

        structures: [

            [
                "They followed Jesus.",
                "主语 + 动词 + 宾语。"
            ],

            [
                "What are you looking for?",
                "现在进行时疑问句。"
            ],

            [
                "Come and see.",
                "祈使句 + and + 结果。"
            ],

            [
                "We have found the Messiah.",
                "现在完成时表达刚刚发现并产生当前意义。"
            ]

        ],

        notice: [

            [
                "What did the disciples do?",
                [
                    "They followed Jesus",
                    "They rejected Jesus",
                    "They ignored John"
                ],
                0
            ],

            [
                "What invitation did Jesus give?",
                [
                    "Come and see",
                    "Go and hide",
                    "Write a book"
                ],
                0
            ],

            [
                "Who did Andrew bring to Jesus?",
                [
                    "Simon",
                    "John",
                    "Moses"
                ],
                0
            ]

        ],

        direct: [

            [
                "What did the two disciples do?",
                [
                    "They followed Jesus",
                    "They followed Rome",
                    "They returned home"
                ],
                0,
                "他们跟随了耶稣。"
            ],

            [
                "What did Jesus say?",
                [
                    "Come and see",
                    "Go away",
                    "Stay home"
                ],
                0,
                "耶稣说：来，你们就看见了。"
            ],

            [
                "Who did Andrew find?",
                [
                    "Simon",
                    "John",
                    "Philip"
                ],
                0,
                "安得烈找到了他的兄弟西门。"
            ],

            [
                "What did Andrew say they had found?",
                [
                    "The Messiah",
                    "The prophet",
                    "The king of Rome"
                ],
                0,
                "我们找到了弥赛亚。"
            ]

        ],

        production:
            "In simple English, describe how the disciples began following Jesus and bringing others to him."

    },


    /* =====================================================
       UNIT 07
    ===================================================== */

    {

        id:
            "john1-07",

        number:
            7,

        reference:
            "John 1:43–51",

        title:
            "Follow Me",

        verses: [

            {
                verse: 43,
                text:
                    "On the next day, he was determined to go out into Galilee, and he found Philip. Jesus said to him, 'Follow me.'"
            },

            {
                verse: 44,
                text:
                    "Now Philip was from Bethsaida, the city of Andrew and Peter."
            },

            {
                verse: 45,
                text:
                    "Philip found Nathanael and said to him, 'We have found him, of whom Moses in the law, and the prophets, wrote: Jesus of Nazareth, the son of Joseph.'"
            },

            {
                verse: 46,
                text:
                    "Nathanael said to him, 'Can any good thing come out of Nazareth?' Philip said to him, 'Come and see.'"
            },

            {
                verse: 47,
                text:
                    "Jesus saw Nathanael coming to him, and said about him, 'Behold, an Israelite indeed, in whom is no deceit!'"
            },

            {
                verse: 48,
                text:
                    "Nathanael said to him, 'How do you know me?' Jesus answered him, 'Before Philip called you, when you were under the fig tree, I saw you.'"
            },

            {
                verse: 49,
                text:
                    "Nathanael answered him, 'Rabbi, you are the Son of God! You are King of Israel!'"
            },

            {
                verse: 50,
                text:
                    "Jesus answered him, 'Because I told you, I saw you underneath the fig tree, do you believe? You will see greater things than these.'"
            },

            {
                verse: 51,
                text:
                    "He said to him, 'Most certainly, I tell you, hereafter you will see heaven opened, and the angels of God ascending and descending on the Son of Man.'"
            }

        ],

        vocabulary: [

            ["follow", "跟随", "go after"],

            ["Nazareth", "拿撒勒", "Nazareth"],

            ["Israelite", "以色列人", "a person of Israel"],

            ["deceit", "诡诈", "deception"],

            ["fig tree", "无花果树", "fig tree"],

            ["heaven", "天", "heaven"],

            ["Son of Man", "人子", "Son of Man"]

        ],

        structures: [

            [
                "Follow me.",
                "最简洁的命令式呼召。"
            ],

            [
                "Can any good thing come out of Nazareth?",
                "Can + 主语 + 动词表达可能性。"
            ],

            [
                "You will see greater things.",
                "will + 动词表达将来的经历。"
            ],

            [
                "You will see heaven opened.",
                "will + see + 宾语 + 过去分词。"
            ]

        ],

        notice: [

            [
                "What did Jesus say to Philip?",
                [
                    "Follow me",
                    "Stay here",
                    "Go home"
                ],
                0
            ],

            [
                "What did Nathanael initially question?",
                [
                    "Nazareth",
                    "Galilee",
                    "Jerusalem"
                ],
                0
            ],

            [
                "What did Nathanael call Jesus?",
                [
                    "Son of God and King of Israel",
                    "Roman governor",
                    "Prophet of Moses"
                ],
                0
            ],

            [
                "What did Jesus promise Nathanael would see?",
                [
                    "Greater things and heaven opened",
                    "The Roman army",
                    "A new temple"
                ],
                0
            ]

        ],

        direct: [

            [
                "What did Jesus say to Philip?",
                [
                    "Follow me",
                    "Go away",
                    "Wait here"
                ],
                0,
                "耶稣呼召腓力跟从祂。"
            ],

            [
                "Where was Jesus from?",
                [
                    "Nazareth",
                    "Rome",
                    "Bethany"
                ],
                0,
                "耶稣来自拿撒勒。"
            ],

            [
                "What did Nathanael call Jesus?",
                [
                    "Son of God and King of Israel",
                    "A Roman soldier",
                    "A priest"
                ],
                0,
                "拿但业称耶稣为神的儿子、以色列的王。"
            ],

            [
                "What did Jesus say Nathanael would see?",
                [
                    "Greater things",
                    "The Roman army",
                    "A palace"
                ],
                0,
                "他将看见更大的事。"
            ]

        ],

        production:
            "Describe in simple English how Jesus calls people, how people respond, and how they bring others to Jesus."

    }

];


/* =========================================================
   STATE
========================================================= */

let currentUnitIndex =
    0;

let currentUnit =
    COURSE[0];

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
   STATE
========================================================= */

function loadState() {

    try {

        const raw =
            localStorage.getItem(
                CONFIG.STATE_KEY
            );


        if (raw) {

            const parsed =
                JSON.parse(
                    raw
                );


            if (
                parsed &&
                typeof parsed ===
                "object"
            ) {

                return parsed;

            }

        }

    } catch (error) {

        console.warn(
            "EBRM V0.9 state error:",
            error
        );

    }


    return {

        units: {},

        currentUnit:
            0

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
            "EBRM save error:",
            error
        );

    }

}


/* =========================================================
   HELPERS
========================================================= */

function $(id) {

    return document.getElementById(
        id
    );

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


function getUnitState(
    index
) {

    const unit =
        COURSE[index];


    if (
        !state.units
    ) {

        state.units =
            {};

    }


    if (
        !state.units[unit.id]
    ) {

        state.units[unit.id] = {

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


    return state.units[
        unit.id
    ];

}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    if (
        typeof state.currentUnit ===
        "number"
    ) {

        currentUnitIndex =
            Math.max(
                0,
                Math.min(
                    COURSE.length - 1,
                    state.currentUnit
                )
            );

    }


    currentUnit =
        COURSE[currentUnitIndex];


    bindEvents();

    initSpeech();

    renderCourseHome();

    renderBaseline();

    renderUnitPassage();

    renderVocabulary();

    renderStructure();

    renderReviews();

}


/* =========================================================
   EVENT BINDING
========================================================= */

function bindEvents() {

    bind(
        "startBaselineBtn",
        startTraining
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

            go("baseline");

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


    if (
        !element
    ) {

        return;

    }


    element.addEventListener(
        "click",
        handler
    );

}


/* =========================================================
   COURSE HOME
========================================================= */

function renderCourseHome() {

    /*
     * 当前 index.html 是 V0.8 的单课首页。
     *
     * 如果 V0.9 首页有 chapterGrid，
     * 自动显示完整 John 1 单元列表。
     */

    const grid =
        $("chapterGrid");


    if (
        grid
    ) {

        renderChapterGrid(
            grid
        );

    }


    updateCourseProgress();

}


function renderChapterGrid(
    container
) {

    container.innerHTML =
        "";


    COURSE.forEach(
        function(unit, index) {

            const item =
                getUnitState(
                    index
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "unit-button";


            if (
                item.completed
            ) {

                button.classList.add(
                    "done"
                );

            }


            button.innerHTML =

                "<strong>" +

                "UNIT " +

                String(
                    unit.number
                ).padStart(
                    2,
                    "0"
                ) +

                "</strong>" +

                "<span>" +

                escapeHTML(
                    unit.reference
                ) +

                "</span>" +

                "<small>" +

                escapeHTML(
                    unit.title
                ) +

                (

                    item.completed
                        ? " ✓"
                        : ""

                ) +

                "</small>";


            button.addEventListener(
                "click",
                function() {

                    selectUnit(
                        index
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


function selectUnit(
    index
) {

    if (
        !COURSE[index]
    ) {

        return;

    }


    stopSpeech();


    currentUnitIndex =
        index;


    currentUnit =
        COURSE[index];


    state.currentUnit =
        index;


    saveState();


    resetCurrentTraining();


    renderCourseHome();


    startTraining();

}


function resetCurrentTraining() {

    currentVerseIndex =
        0;

    baselineScore =
        0;

    finalScore =
        0;

    currentFeeling =
        0;

    currentDirectAnswers =
        {};

}


/* =========================================================
   COURSE PROGRESS
========================================================= */

function updateCourseProgress() {

    const total =
        COURSE.length;


    const completed =
        COURSE.filter(
            function(unit, index) {

                return getUnitState(
                    index
                ).completed;

            }
        ).length;


    const percent =
        Math.round(
            (
                completed /
                total
            ) *
            100
        );


    const bar =
        $("progressBar");


    const text =
        $("progressText");


    if (bar) {

        bar.style.width =
            percent + "%";

    }


    if (text) {

        text.textContent =
            completed +
            "/" +
            total +
            " · " +
            percent +
            "%";

    }

}


/* =========================================================
   TRAINING START
========================================================= */

function startTraining() {

    resetCurrentTraining();


    renderBaseline();


    go(
        "baseline"
    );

}


/* =========================================================
   BASELINE
========================================================= */

function renderBaseline() {

    const container =
        $("baselineQuestions");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    const questions =
        buildBaselineQuestions();


    questions.forEach(
        function(item, index) {

            const block =
                createQuestionBlock(
                    item,
                    index
                );


            container.appendChild(
                block
            );

        }
    );

}


function buildBaselineQuestions() {

    return [

        {

            question:
                currentUnit.reference +
                " — Who is the central figure in this passage?",

            options:
                getBaselineOptions(
                    "central"
                ),

            answer:
                getBaselineAnswer(
                    "central"
                )

        },

        {

            question:
                "What major idea appears in this passage?",

            options:
                getBaselineOptions(
                    "idea"
                ),

            answer:
                getBaselineAnswer(
                    "idea"
                )

        },

        {

            question:
                "What is the main movement of the passage?",

            options:
                getBaselineOptions(
                    "movement"
                ),

            answer:
                getBaselineAnswer(
                    "movement"
                )

        }

    ];

}


function getBaselineOptions(
    type
) {

    if (
        currentUnit.number ===
        1
    ) {

        if (
            type ===
            "central"
        ) {

            return [
                "The Word",
                "John",
                "Moses"
            ];

        }


        if (
            type ===
            "idea"
        ) {

            return [
                "Light and life",
                "Roman politics",
                "Temple construction"
            ];

        }


        return [
            "Word → life → light",
            "Rome → temple → king",
            "Law → army → nation"
        ];

    }


    if (
        currentUnit.number ===
        2
    ) {

        if (
            type ===
            "central"
        ) {

            return [
                "The light and John",
                "Moses",
                "Rome"
            ];

        }


        if (
            type ===
            "idea"
        ) {

            return [
                "Witness and receiving the light",
                "War",
                "Temple construction"
            ];

        }


        return [
            "Witness → light → response",
            "King → army → battle",
            "Law → temple → sacrifice"
        ];

    }


    if (
        currentUnit.number ===
        3
    ) {

        if (
            type ===
            "central"
        ) {

            return [
                "The Word",
                "John",
                "Moses"
            ];

        }


        if (
            type ===
            "idea"
        ) {

            return [
                "The Word becoming flesh",
                "Political power",
                "Temple worship"
            ];

        }


        return [
            "Word → flesh → grace and truth",
            "Law → army → kingdom",
            "Temple → priest → sacrifice"
        ];

    }


    if (
        currentUnit.number ===
        4
    ) {

        if (
            type ===
            "central"
        ) {

            return [
                "John's witness",
                "The Roman governor",
                "Moses"
            ];

        }


        if (
            type ===
            "idea"
        ) {

            return [
                "John points away from himself",
                "John becomes king",
                "Rome controls Israel"
            ];

        }


        return [
            "Question → identity → witness",
            "War → victory → peace",
            "Law → temple → sacrifice"
        ];

    }


    if (
        currentUnit.number ===
        5
    ) {

        if (
            type ===
            "central"
        ) {

            return [
                "Jesus",
                "John",
                "Elijah"
            ];

        }


        if (
            type ===
            "idea"
        ) {

            return [
                "The Lamb of God",
                "Roman government",
                "Temple building"
            ];

        }


        return [
            "Jesus → Spirit → testimony",
            "Rome → army → war",
            "Law → temple → priest"
        ];

    }


    if (
        currentUnit.number ===
        6
    ) {

        if (
            type ===
            "central"
        ) {

            return [
                "Jesus and his disciples",
                "Pilate",
                "Moses"
            ];

        }


        if (
            type ===
            "idea"
        ) {

            return [
                "Following and inviting",
                "Military power",
                "Temple worship"
            ];

        }


        return [
            "Witness → follow → bring others",
            "War → victory → peace",
            "Law → sacrifice → temple"
        ];

    }


    return [

        currentUnit.number ===
        7

            ? "Jesus"

            : "The Word",

        "Moses",

        "Rome"

    ];

}


function getBaselineAnswer(
    type
) {

    if (
        currentUnit.number ===
        7
    ) {

        return 0;

    }


    return 0;

}


function createQuestionBlock(
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
        (
            index + 1
        ) +
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
                                other
                            ) {

                                other.classList.remove(
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


    return block;

}


function submitBaseline() {

    const container =
        $("baselineQuestions");


    const blocks =
        container
            ? container.querySelectorAll(
                ".notice-question"
            )
            : [];


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

            } else {

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


    const unitState =
        getUnitState(
            currentUnitIndex
        );


    unitState.baseline =
        baselineScore;


    saveState();


    updateCourseProgress();


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

            currentUnit.reference +

            "<br>" +

            "现在开始精读。"

            + "</div>";

    }


    setTimeout(
        function() {

            renderUnitPassage();

            renderVocabulary();

            renderStructure();

            renderReviews();

            go("read");

        },
        650
    );

}


/* =========================================================
   READ
========================================================= */

function renderUnitPassage() {

    const container =
        $("passageText");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentUnit
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


    const title =
        document.querySelector(
            "#read h2"
        );


    if (
        title
    ) {

        title.textContent =
            currentUnit.reference;

    }


    const meta =
        document.querySelector(
            ".passage-meta span"
        );


    if (
        meta
    ) {

        meta.textContent =
            currentUnit.reference;

    }

}


/* =========================================================
   VOCABULARY
========================================================= */

function renderVocabulary() {

    const container =
        $("vocabularyList");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentUnit
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
                    item[0];


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
                            item[0]
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
                    item[1];


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
                    item[2];


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

function renderStructure() {

    const container =
        $("structureList");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentUnit
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
                    item[0];


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
                    item[1];


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
                            item[0]
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
   NOTICE
========================================================= */

function goToNotice() {

    renderNotice();

    go("notice");

}


function renderNotice() {

    const container =
        $("noticeQuestions");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentUnit
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
                    (
                        index +
                        1
                    ) +
                    " · " +
                    item[0];


                block.appendChild(
                    title
                );


                item[1]
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
                                                other
                                            ) {

                                                other.classList.remove(
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


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentDirectAnswers =
        {};


    currentUnit
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
                    (
                        index +
                        1
                    ) +
                    " · " +
                    item[0];


                block.appendChild(
                    title
                );


                item[1]
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
                                                other
                                            ) {

                                                other.classList.remove(
                                                    "selected",
                                                    "correct",
                                                    "wrong"
                                                );

                                            }
                                        );


                                    button.classList.add(
                                        "selected"
                                    );


                                    if (
                                        optionIndex ===
                                        item[2]
                                    ) {

                                        button.classList.add(
                                            "correct"
                                        );

                                    } else {

                                        button.classList.add(
                                            "wrong"
                                        );

                                    }


                                    currentDirectAnswers[
                                        index
                                    ] =
                                        optionIndex;


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

                        let answer =
                            block.querySelector(
                                ".success"
                            );


                        if (
                            answer
                        ) {

                            answer.remove();

                            return;

                        }


                        answer =
                            document.createElement(
                                "div"
                            );


                        answer.className =
                            "success";


                        answer.textContent =
                            item[3];


                        block.appendChild(
                            answer
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


    if (
        !score
    ) {

        return;

    }


    let correct =
        0;


    let answered =
        0;


    currentUnit
        .direct
        .forEach(
            function(
                item,
                index
            ) {

                if (
                    currentDirectAnswers[
                        index
                    ] !== undefined
                ) {

                    answered++;


                    if (
                        currentDirectAnswers[
                            index
                        ] ===
                        item[2]
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

        currentUnit
            .direct
            .length +

        " · 已回答 " +

        answered +

        "/" +

        currentUnit
            .direct
            .length;

}


/* =========================================================
   SPEAK
========================================================= */

function goToSpeak() {

    const prompt =
        $("speakPrompt");


    if (
        prompt
    ) {

        prompt.textContent =
            currentUnit.production;

    }


    renderImitationList();


    go(
        "speak"
    );

}


function renderImitationList() {

    const container =
        $("imitationList");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentUnit
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


                item.appendChild(
                    button
                );


                container.appendChild(
                    item
                );

            }
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


    if (
        !text
    ) {

        result.innerHTML =
            "<div class='success'>" +
            "请先写一句英文。" +
            "</div>";

        return;

    }


    const lower =
        text.toLowerCase();


    const keywords =
        getSpeechKeywords();


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
            ) *
            70
        );


    if (
        wordCount >=
        6
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

        "/100</strong>" +

        "<br><br>" +

        "关键词：" +

        hits +

        "/" +

        keywords.length +

        "<br>" +

        "单词数：" +

        wordCount +

        "<br><br>" +

        (
            score >= 80

                ? "很好，你已经抓住本段核心。"

                : score >= 60

                    ? "不错，继续把核心意义说完整。"

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
        "🔊 听我的答案";


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


function getSpeechKeywords() {

    const words =
        [];


    currentUnit
        .vocabulary
        .forEach(
            function(item) {

                const word =
                    item[0]
                        .toLowerCase();


                if (
                    word.indexOf(
                        " "
                    ) ===
                    -1
                ) {

                    words.push(
                        word
                    );

                }

            }
        );


    return words.slice(
        0,
        6
    );

}


function listenToMyAnswer() {

    const input =
        $("speakAnswer");


    if (
        !input
    ) {

        return;

    }


    const text =
        input.value.trim();


    if (
        !text
    ) {

        alert(
            "请先输入英文答案。"
        );

        return;

    }


    speakText(
        text
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


function renderRereadPassage() {

    const container =
        $("rereadPassage");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentUnit
        .verses
        .forEach(
            function(verse) {

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


    if (
        button
    ) {

        button.classList.add(
            "selected"
        );

    }


    const unitState =
        getUnitState(
            currentUnitIndex
        );


    unitState.feeling =
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


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    currentUnit
        .direct
        .slice(
            0,
            Math.min(
                4,
                currentUnit.direct.length
            )
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
                    item[2];


                const title =
                    document.createElement(
                        "div"
                    );


                title.className =
                    "notice-question-title";


                title.textContent =
                    (
                        index +
                        1
                    ) +
                    ". " +
                    item[0];


                block.appendChild(
                    title
                );


                item[1].forEach(
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
                                            other
                                        ) {

                                            other.classList.remove(
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


    if (
        !blocks.length
    ) {

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

            } else {

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


    const unitState =
        getUnitState(
            currentUnitIndex
        );


    unitState.final =
        finalScore;


    unitState.completed =
        true;


    unitState.completedAt =
        new Date()
            .toISOString();


    unitState.reviews = [

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


    renderReviews();

    updateCourseProgress();


    showResult();

}


/* =========================================================
   RESULT
========================================================= */

function showResult() {

    const unitState =
        getUnitState(
            currentUnitIndex
        );


    const baseline =
        Number(
            unitState.baseline ||
            0
        );


    const final =
        Number(
            unitState.final ||
            finalScore ||
            0
        );


    const base =
        $("resultBaseline");


    const result =
        $("resultFinal");


    if (
        base
    ) {

        base.textContent =
            baseline +
            "%";

    }


    if (
        result
    ) {

        result.textContent =
            final +
            "%";

    }


    const gain =
        final -
        baseline;


    const box =
        $("resultImprovement");


    if (
        box
    ) {

        if (
            gain > 0
        ) {

            box.innerHTML =

                "<strong>" +

                "理解提升 +" +

                gain +

                "%</strong>" +

                "<div>" +

                currentUnit.reference +

                " 的英文直接理解有所提升。" +

                "</div>";

        }

        else if (
            gain ===
            0
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

                "本次没有提升" +

                "</strong>" +

                "<div>" +

                "重新听读后再次复习。" +

                "</div>";

        }

    }


    go(
        "result"
    );

}


/* =========================================================
   REVIEW
========================================================= */

function renderReviews() {

    const container =
        $("reviewList");


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    COURSE.forEach(
        function(
            unit,
            index
        ) {

            const unitState =
                getUnitState(
                    index
                );


            if (
                !unitState.reviews
                ||
                !unitState.reviews.length
            ) {

                return;

            }


            unitState.reviews
                .forEach(
                    function(
                        date,
                        reviewIndex
                    ) {

                        const row =
                            document.createElement(
                                "div"
                            );


                        row.className =
                            "review-row";


                        const day =
                            reviewIndex ===
                            0

                                ? 1

                                : reviewIndex ===
                                  1

                                    ? 3

                                    : 7;


                        row.innerHTML =

                            "<div>" +

                            "<strong>" +

                            escapeHTML(
                                unit.reference
                            ) +

                            "</strong>" +

                            "<div>" +

                            "Day " +

                            day +

                            "</div>" +

                            "</div>" +

                            "<span>" +

                            escapeHTML(
                                date
                            ) +

                            "</span>";


                        container.appendChild(
                            row
                        );

                    }
                );

        }
    );


    if (
        !container.children.length
    ) {

        container.innerHTML =

            "<div class='muted'>" +

            "完成单元后，这里会自动建立 Day 1 / Day 3 / Day 7 复习。" +

            "</div>";

    }

}


/* =========================================================
   DATE
========================================================= */

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
   SPEECH
========================================================= */

function initSpeech() {

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


    if (
        !voices.length
    ) {

        return null;

    }


    const saved =
        localStorage.getItem(
            CONFIG.VOICE_KEY
        );


    if (
        saved
    ) {

        const match =
            voices.find(
                function(voice) {

                    return (
                        voice.name ===
                        saved
                    );

                }
            );


        if (
            match
        ) {

            return match;

        }

    }


    const preferred =
        [

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


                return preferred.some(
                    function(word) {

                        return name.includes(
                            word
                        );

                    }
                );

            }
        );


    if (
        male
    ) {

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


    return (
        us ||
        voices[0]
    );

}


function renderVoicePanel() {

    const panel =
        $("voicePanel");


    if (
        !panel
    ) {

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

        return;

    }


    const select =
        document.createElement(
            "select"
        );


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


    panel.appendChild(
        select
    );


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
   SPEECH ENGINE
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
        currentUnit
            .verses
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
        !currentUnit
            .verses[index]
    ) {

        return;

    }


    currentVerseIndex =
        index;


    continuousReading =
        false;


    repeatCurrentVerse =
        false;


    speakVerse(
        index
    );

}


function speakVerse(
    index
) {

    if (
        !currentUnit
            .verses[index]
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

        currentUnit
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
                    currentUnit
                        .verses
                        .length
                ) {

                    speakVerse(
                        next
                    );

                } else {

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
        "连续逐节朗读中……"
    );


    speakVerse(
        0
    );

}


function toggleRepeatCurrentVerse() {

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

    }

    else {

        stopSpeech();

    }

}


function playPreviousVerse() {

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

    continuousReading =
        false;


    repeatCurrentVerse =
        false;


    currentVerseIndex =
        Math.min(

            currentUnit
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


    if (
        status
    ) {

        status.textContent =
            message;

    }

}


/* =========================================================
   GLOBAL COMPATIBILITY
========================================================= */

window.go =
    go;

window.startTraining =
    startTraining;

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
   END
========================================================= */
