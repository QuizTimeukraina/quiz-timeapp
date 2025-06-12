// Конфигурация Stripe
const stripe = Stripe('Т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'); // Замените на ваш ключ
let cardElement;

// Банк вопросов (полная версия из предыдущего ответа)
const questionBank = {
    easy: [
        {
            question: "Скільки континентів на Землі?",
            answers: ["6", "7", "8", "5"],
            correct: 1
        },
        {
            question: "Яка столиця України?",
            answers: ["Львів", "Одеса", "Київ", "Харків"],
            correct: 2
        },
        {
            question: "Яка найдовша річка в Україні?",
            answers: ["Дніпро", "Дунай", "Дністер", "Південний Буг"],
            correct: 0
        },
        {
            question: "Який національний символ України?",
            answers: ["Троянда", "Соняшник", "Калина", "Береза"],
            correct: 2
        },
        {
            question: "Хто автор поеми 'Кобзар'?",
            answers: ["Леся Українка", "Іван Франко", "Тарас Шевченко", "Михайло Коцюбинський"],
            correct: 2
        },
        {
            question: "Якого кольору прапор України?",
            answers: ["Червоний і чорний", "Синій і жовтий", "Зелений і білий", "Жовтий і чорний"],
            correct: 1
        },
        {
            question: "Яка валюта України?",
            answers: ["Євро", "Долар", "Гривня", "Злотий"],
            correct: 2
        },
        {
            question: "Як називається найвища гора України?",
            answers: ["Говерла", "Піп Іван", "Петрос", "Роман-Кош"],
            correct: 0
        },
        {
            question: "Яка найбільша за площею область України?",
            answers: ["Одеська", "Дніпропетровська", "Харківська", "Чернігівська"],
            correct: 0
        },
        {
            question: "Хто був першим президентом України?",
            answers: ["Леонід Кравчук", "Леонід Кучма", "Віктор Ющенко", "Володимир Зеленський"],
            correct: 0
        },
        {
            question: "Яка традиційна українська страва з тіста?",
            answers: ["Борщ", "Вареники", "Сало", "Ковбаса"],
            correct: 1
        },
        {
            question: "Яке море омиває південь України?",
            answers: ["Балтійське", "Чорне", "Азовське", "Середземне"],
            correct: 2
        },
        {
            question: "Як називається український народний інструмент?",
            answers: ["Бандура", "Гітара", "Скрипка", "Баян"],
            correct: 0
        },
        {
            question: "У якому році Україна стала незалежною?",
            answers: ["1989", "1991", "1994", "2000"],
            correct: 1
        },
        {
            question: "Яке озеро в Україні найглибше?",
            answers: ["Ялпуг", "Світязь", "Синевир", "Сомин"],
            correct: 2
        }
    ],
    medium: [
        {
            question: "Який хімічний символ золота?",
            answers: ["Go", "Au", "Ag", "Ge"],
            correct: 1
        },
        {
            question: "Хто написав картину 'Запорожці пишуть листа турецькому султану'?",
            answers: ["Іван Айвазовський", "Ілля Рєпін", "Тарас Шевченко", "Казимир Малевич"],
            correct: 1
        },
        {
            question: "Яка наука вивчає комах?",
            answers: ["Орнітологія", "Ентомологія", "Ботаніка", "Герпетологія"],
            correct: 1
        },
        {
            question: "У якому столітті жив Тарас Шевченко?",
            answers: ["XVII", "XVIII", "XIX", "XX"],
            correct: 2
        },
        {
            question: "Який період в історії України називають 'Руїною'?",
            answers: ["XIV ст.", "XVII ст.", "XIX ст.", "XX ст."],
            correct: 1
        },
        {
            question: "Яка температура кипіння води за нормальних умов?",
            answers: ["90°C", "100°C", "110°C", "120°C"],
            correct: 1
        },
        {
            question: "Яка планета Сонячної системи найбільша?",
            answers: ["Земля", "Юпітер", "Сатурн", "Нептун"],
            correct: 1
        },
        {
            question: "Хто з цих письменників лауреат Нобелівської премії?",
            answers: ["Іван Франко", "Леся Українка", "Михайло Коцюбинський", "Іван Багряний"],
            correct: 0
        },
        {
            question: "Яка частина рослини відповідає за фотосинтез?",
            answers: ["Корінь", "Стебло", "Листок", "Квітка"],
            correct: 2
        },
        {
            question: "Який рік вважається роком заснування Києва?",
            answers: ["482", "882", "1082", "1240"],
            correct: 0
        },
        {
            question: "Яка кількість хромосом у людини?",
            answers: ["23", "46", "64", "32"],
            correct: 1
        },
        {
            question: "Яка довжина екватора Землі?",
            answers: ["10 000 км", "20 000 км", "30 000 км", "40 075 км"],
            correct: 3
        },
        {
            question: "Хто був автором першого українського букваря?",
            answers: ["Тарас Шевченко", "Іван Федоров", "Григорій Сковорода", "Михайло Грушевський"],
            correct: 1
        },
        {
            question: "Яка формула води?",
            answers: ["CO2", "H2O", "O2", "NaCl"],
            correct: 1
        },
        {
            question: "Яка найбільша пустеля у світі?",
            answers: ["Сахара", "Гобі", "Калахарі", "Аравійська"],
            correct: 0
        }
    ],
    hard: [
        {
            question: "Який рік вважається початком Хмельниччини?",
            answers: ["1612", "1648", "1709", "1775"],
            correct: 1
        },
        {
            question: "Який елемент має атомний номер 79?",
            answers: ["Срібло", "Платина", "Золото", "Ртуть"],
            correct: 2
        },
        {
            question: "Хто був останнім гетьманом України?",
            answers: ["Богдан Хмельницький", "Іван Мазепа", "Кирило Розумовський", "Петро Дорошенко"],
            correct: 2
        },
        {
            question: "Яка температура поверхні Сонця?",
            answers: ["2 500°C", "5 500°C", "10 000°C", "15 000°C"],
            correct: 1
        },
        {
            question: "Яка довжина Дніпра в кілометрах?",
            answers: ["1 800 км", "2 201 км", "2 850 км", "3 200 км"],
            correct: 1
        },
        {
            question: "Яка найменша кількість кольорів достатня для розфарбування будь-якої карти?",
            answers: ["2", "3", "4", "5"],
            correct: 2
        },
        {
            question: "Яка швидкість світла у вакуумі?",
            answers: ["150 000 км/с", "225 000 км/с", "300 000 км/с", "400 000 км/с"],
            correct: 2
        },
        {
            question: "Хто з українських поетів писав під псевдонімом 'Руфін Судовський'?",
            answers: ["Тарас Шевченко", "Іван Франко", "Леся Українка", "Микола Вороной"],
            correct: 1
        },
        {
            question: "Яка молекулярна маса кисню (O₂)?",
            answers: ["16", "32", "64", "128"],
            correct: 1
        },
        {
            question: "У якому році була утворена УПА?",
            answers: ["1929", "1939", "1942", "1950"],
            correct: 2
        },
        {
            question: "Яка глибина Маріанської западини?",
            answers: ["5 000 м", "8 000 м", "10 911 м", "12 500 м"],
            correct: 2
        },
        {
            question: "Який період напіврозпаду вуглецю-14?",
            answers: ["1 500 років", "5 730 років", "10 000 років", "12 500 років"],
            correct: 1
        },
        {
            question: "Хто був автором першої української конституції?",
            answers: ["Богдан Хмельницький", "Пилип Орлик", "Михайло Грушевський", "Іван Мазепа"],
            correct: 1
        },
        {
            question: "Яка кількість кіловат-годин енергії виробляється з 1 кг урану-235?",
            answers: ["10 000 кВт·год", "24 000 000 кВт·год", "50 000 кВт·год", "100 000 кВт·год"],
            correct: 1
        },
        {
            question: "Яка приблизна кількість нейронів у мозку людини?",
            answers: ["10 мільйонів", "100 мільйонів", "10 мільярдів", "86 мільярдів"],
            correct: 3
        }
    ]
};

// Остальной код вашего приложения...

// Игровое состояние
const gameState = {
    currentQuestion: 0,
    score: 0,
    coins: 0,
    timeLeft: 30,
    timer: null,
    gameCoins: 0,
    gameScore: 0,
    correctCount: 0,
    totalGames: 0,
    bestScore: 0,
    currentLevel: 'easy',
    questions: []
};

let gameEnded = false;
let freeAnswersUsed = 0;
const MAX_FREE_ANSWERS = 2;

// Инициализация Stripe
function initStripe() {
    const elements = stripe.elements();
    cardElement = elements.create('card', {
        style: {
            base: {
                color: '#ffffff',
                fontFamily: '"Arial", sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' }
            }
        }
    });
    cardElement.mount('#cardElement');
}

// Все остальные функции (как в оригинале)
function checkSubscription() {...}
function showSubscribePopup() {...}
function hideSubscribePopup() {...}
async function processSubscription() {...}
function animatePop() {...}
function updateDisplay() {...}
// ... и все остальные функции ...

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateDisplay();
    updateStats();
    initStripe();
    
    document.getElementById('stripePaymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        processSubscription();
    });

    const music = document.getElementById('background-music');
    music.volume = 0.3;
    music.play().catch(e => console.log("Автовоспроизведение заблокировано:", e));
});