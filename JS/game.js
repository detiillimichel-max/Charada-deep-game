// Array com as 9 charadas
const riddles = [
    {
        id: 1,
        riddle: "O que é, o que é? Tem cabeça mas não pensa, tem boca mas não fala?",
        answer: "O relógio ⏰"
    },
    {
        id: 2,
        riddle: "O que é, o que é? Quanto mais se tira, maior fica?",
        answer: "O buraco 🕳️"
    },
    {
        id: 3,
        riddle: "O que é, o que é? Tem dentes mas não come, tem barba mas não é homem?",
        answer: "O alho 🧄"
    },
    {
        id: 4,
        riddle: "O que é, o que é? Passa pelo mar e não se molha, passa pelo fogo e não se queima?",
        answer: "A sombra 🌑"
    },
    {
        id: 5,
        riddle: "O que é, o que é? Tem asas mas não voa, tem boca mas não fala, tem patas mas não anda?",
        answer: "A mesa 🪑"
    },
    {
        id: 6,
        riddle: "O que é, o que é? Cai em pé e corre deitado?",
        answer: "A chuva 🌧️"
    },
    {
        id: 7,
        riddle: "O que é, o que é? É irmão do pai da minha prima, mas não é meu tio?",
        answer: "Meu pai 👨"
    },
    {
        id: 8,
        riddle: "O que é, o que é? Entra na água mas não se molha, entra no fogo mas não se queima?",
        answer: "O gelo 🧊"
    },
    {
        id: 9,
        riddle: "O que é, o que é? Quanto maior menos se vê?",
        answer: "A escuridão 🌌"
    }
];

let gameState = {
    score: 0,
    revealed: new Array(9).fill(false),
    total: riddles.length
};

const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const resetBtn = document.getElementById('reset-btn');

function updateScoreUI() {
    scoreElement.textContent = gameState.score;
    totalElement.textContent = gameState.total;
}

function saveGameState() {
    localStorage.setItem('oque_game_state', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('oque_game_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.revealed && parsed.revealed.length === riddles.length) {
                gameState = parsed;
                updateScoreUI();
                return true;
            }
        } catch(e) {
            console.error('Erro ao carregar salvamento:', e);
        }
    }
    return false;
}

function revealCard(index) {
    if (!gameState.revealed[index]) {
        gameState.revealed[index] = true;
        gameState.score++;
        updateScoreUI();
        saveGameState();
        renderCards();
        
        // Efeito visual de confete ao completar
        if (gameState.score === gameState.total) {
            setTimeout(() => {
                alert('🎉 PARABÉNS! 🎉\n\nVocê completou todas as 9 charadas!\nQue tal jogar novamente?');
                triggerConfetti();
            }, 100);
        }
    }
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#667eea', '#764ba2', '#ff6b6b', '#4ecdc4']
        });
    } else {
        console.log('🎉🎊 CONFETE VIRTUAL! Você venceu! 🎊🎉');
    }
}

function renderCards() {
    if (!gameContainer) return;
    
    gameContainer.innerHTML = '';
    
    riddles.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `card ${gameState.revealed[index] ? 'revealed' : ''}`;
        
        const numberEmoji = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪'][index];
        
        card.innerHTML = `
            <h3>${numberEmoji} Charada ${index + 1}</h3>
            <div class="riddle">${item.riddle}</div>
            <div class="answer">
                ✨ <strong>Resposta:</strong> ${item.answer}
            </div>
            ${!gameState.revealed[index] ? '<div class="reveal-hint">🔍 Clique para ver a resposta</div>' : '✓ Já revelada'}
        `;
        
        if (!gameState.revealed[index]) {
            card.addEventListener('click', () => revealCard(index));
        }
        
        gameContainer.appendChild(card);
    });
}

function resetGame() {
    if (confirm('⚠️ Tem certeza que deseja reiniciar?\nTodo seu progresso será perdido!')) {
        gameState = {
            score: 0,
            revealed: new Array(riddles.length).fill(false),
            total: riddles.length
        };
        updateScoreUI();
        saveGameState();
        renderCards();
        
        // Animação de reset
        const container = document.querySelector('.container');
        if (container) {
            container.style.transform = 'scale(0.98)';
            setTimeout(() => {
                container.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

function initGame() {
    totalElement.textContent = gameState.total;
    loadGameState();
    renderCards();
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    console.log('🎮 Jogo iniciado! Clique nos cards para revelar as respostas.');
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
