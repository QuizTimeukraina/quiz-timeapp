// Конфигурация Stripe
const stripe = Stripe('Т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'); // Тестовый ключ
let cardElement;

// Банк вопросов
const questionBank = {
    easy: [
        {
            question: "Скільки континентів на Землі?",
            answers: ["6", "7", "8", "5"],
            correct: 1
        },
        // ... остальные easy вопросы ...
    ],
    medium: [
        {
            question: "Який хімічний символ золота?",
            answers: ["Go", "Au", "Ag", "Ge"],
            correct: 1
        },
        // ... остальные medium вопросы ...
    ],
    hard: [
        {
            question: "Який рік вважається початком Хмельниччини?",
            answers: ["1612", "1648", "1709", "1775"],
            correct: 1
        },
        // ... остальные hard вопросы ...
    ]
};

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

// Функции управления экранами
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showHomeScreen() {
    showScreen('homeScreen');
    updateStats();
}

function showLevelScreen() {
    showScreen('levelScreen');
}

function showGameScreen() {
    showScreen('gameScreen');
    startTimer();
}

function showResultScreen() {
    showScreen('resultScreen');
    displayResults();
}

// Обновление статистики
function updateStats() {
    document.getElementById('totalGamesStat').textContent = gameState.totalGames;
    document.getElementById('correctAnswersStat').textContent = gameState.correctCount;
    document.getElementById('bestScoreStat').textContent = gameState.bestScore;
}

// Отображение результатов
function displayResults() {
    document.getElementById('finalScore').textContent = gameState.gameScore;
    document.getElementById('finalCoins').textContent = gameState.gameCoins;
    document.getElementById('correctAnswers').textContent = `${gameState.correctAnswers}/${gameState.questions.length}`;
    
    const resultMessage = document.getElementById('resultMessage');
    const percentage = (gameState.correctAnswers / gameState.questions.length) * 100;
    
    if (percentage >= 80) {
        resultMessage.textContent = "Отличный результат! Вы настоящий эксперт!";
        resultMessage.style.color = "#00ff88";
    } else if (percentage >= 50) {
        resultMessage.textContent = "Хороший результат! Можно еще лучше!";
        resultMessage.style.color = "#00ffff";
    } else {
        resultMessage.textContent = "Попробуйте еще раз! Вы сможете лучше!";
        resultMessage.style.color = "#ff5555";
    }
}

// Начало игры
function startGame(level) {
    gameState.currentLevel = level;
    gameState.currentQuestion = 0;
    gameState.gameScore = 0;
    gameState.gameCoins = 0;
    gameState.correctAnswers = 0;
    gameState.questions = [...questionBank[level]];
    gameEnded = false;
    freeAnswersUsed = 0;
    
    // Перемешиваем вопросы
    gameState.questions = shuffleArray(gameState.questions);
    
    showGameScreen();
    loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
    if (gameState.currentQuestion >= gameState.questions.length || gameEnded) {
        endGame();
        return;
    }
    
    const question = gameState.questions[gameState.currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionCounter').textContent = `${gameState.currentQuestion + 1}/${gameState.questions.length}`;
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    question.answers.forEach((answer, index) => {
        answerButtons[index].textContent = answer;
        answerButtons[index].classList.remove('correct', 'wrong');
        answerButtons[index].disabled = false;
    });
    
    // Обновляем кнопку бесплатного ответа
    document.getElementById('freeAnswerBtn').textContent = 
        `Бесплатный ответ (${MAX_FREE_ANSWERS - freeAnswersUsed}/${MAX_FREE_ANSWERS})`;
    document.getElementById('freeAnswerBtn').disabled = freeAnswersUsed >= MAX_FREE_ANSWERS;
    
    // Сброс таймера
    gameState.timeLeft = 30;
    updateTimer();
}

// Проверка ответа
function checkAnswer(answerIndex) {
    if (gameEnded) return;
    
    clearInterval(gameState.timer);
    const question = gameState.questions[gameState.currentQuestion];
    const answerButtons = document.querySelectorAll('.answer-btn');
    const isCorrect = answerIndex === question.correct;
    
    // Подсветка правильного/неправильного ответа
    answerButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === answerIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // Воспроизведение звука
    const sound = document.getElementById(isCorrect ? 'sound-correct' : 'sound-wrong');
    sound.currentTime = 0;
    sound.play();
    
    // Начисление очков
    if (isCorrect) {
        const pointsEarned = Math.floor(gameState.timeLeft * (gameState.currentLevel === 'easy' ? 1 : gameState.currentLevel === 'medium' ? 1.5 : 2));
        gameState.gameScore += pointsEarned;
        gameState.gameCoins += gameState.currentLevel === 'easy' ? 10 : gameState.currentLevel === 'medium' ? 15 : 20;
        gameState.correctAnswers++;
        animatePop(answerButtons[answerIndex]);
    }
    
    // Обновление отображения
    updateDisplay();
    
    // Переход к следующему вопросу через 1.5 секунды
    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 1500);
}

// Использование бесплатного ответа
function useFreeAnswer() {
    if (freeAnswersUsed >= MAX_FREE_ANSWERS || gameEnded) return;
    
    freeAnswersUsed++;
    const question = gameState.questions[gameState.currentQuestion];
    checkAnswer(question.correct);
}

// Таймер
function startTimer() {
    clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            timeUp();
        }
        
        // Звуковое предупреждение при 5 секундах
        if (gameState.timeLeft === 5) {
            const timerSound = document.getElementById('sound-timer');
            timerSound.currentTime = 0;
            timerSound.play();
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('timerDisplay').textContent = gameState.timeLeft;
    document.getElementById('timerBar').style.width = `${(gameState.timeLeft / 30) * 100}%`;
    
    // Изменение цвета при малом времени
    if (gameState.timeLeft <= 5) {
        document.getElementById('timerBar').style.backgroundColor = '#ff5555';
    } else {
        document.getElementById('timerBar').style.backgroundColor = '#00ff88';
    }
}

function timeUp() {
    if (gameEnded) return;
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => btn.disabled = true);
    
    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 1500);
}

// Завершение игры
function endGame() {
    gameEnded = true;
    clearInterval(gameState.timer);
    
    // Обновление общей статистики
    gameState.score += gameState.gameScore;
    gameState.coins += gameState.gameCoins;
    gameState.correctCount += gameState.correctAnswers;
    gameState.totalGames++;
    
    if (gameState.gameScore > gameState.bestScore) {
        gameState.bestScore = gameState.gameScore;
    }
    
    // Сохранение данных
    saveData();
    showResultScreen();
}

// Анимация
function animatePop(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

// Обновление отображения
function updateDisplay() {
    document.getElementById('coinsDisplay').textContent = gameState.coins + gameState.gameCoins;
    document.getElementById('pointsDisplay').textContent = gameState.score + gameState.gameScore;
}

// Сохранение и загрузка данных
function saveData() {
    localStorage.setItem('quizGameData', JSON.stringify({
        score: gameState.score,
        coins: gameState.coins,
        correctCount: gameState.correctCount,
        totalGames: gameState.totalGames,
        bestScore: gameState.bestScore
    }));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('quizGameData'));
    if (data) {
        gameState.score = data.score || 0;
        gameState.coins = data.coins || 0;
        gameState.correctCount = data.correctCount || 0;
        gameState.totalGames = data.totalGames || 0;
        gameState.bestScore = data.bestScore || 0;
    }
    updateDisplay();
}

// Вспомогательные функции
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function toggleMusic() {
    const music = document.getElementById('background-music');
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

// Подписка
function checkSubscription() {
    // Здесь должна быть проверка подписки через бэкенд
    return false;
}

function showSubscribePopup() {
    document.getElementById('subscribePopup').style.display = 'block';
}

function hideSubscribePopup() {
    document.getElementById('subscribePopup').style.display = 'none';
}

async function processSubscription() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Обработка...';
    
    try {
        const { token, error } = await stripe.createToken(cardElement);
        
        if (error) {
            alert(error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'ОПЛАТИТЬ $2.99/МЕС';
            return;
        }
        
        // Здесь должна быть отправка токена на ваш бэкенд
        // Примерно так:
        // const response = await fetch('/create-subscription', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ token: token.id })
        // });
        // const data = await response.json();
        
        // Временно имитируем успешную подписку
        alert('Подписка оформлена успешно!');
        hideSubscribePopup();
    } catch (err) {
        console.error('Ошибка:', err);
        alert('Произошла ошибка при обработке платежа');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ОПЛАТИТЬ $2.99/МЕС';
    }
}

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