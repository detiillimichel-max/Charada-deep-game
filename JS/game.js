// Array com as 9 charadas (O que é, o que é?)
const riddles = [
    {
        riddle: "O que é, o que é? Tem cabeça mas não pensa, tem boca mas não fala?",
        answer: "O relógio ⏰"
    },
    {
        riddle: "O que é, o que é? Quanto mais se tira, maior fica?",
        answer: "O buraco 🕳️"
    },
    {
        riddle: "O que é, o que é? Tem dentes mas não come, tem barba mas não é homem?",
        answer: "O alho 🧄"
    },
    {
        riddle: "O que é, o que é? Passa pelo mar e não se molha, passa pelo fogo e não se queima?",
        answer: "A sombra 🌑"
    },
    {
        riddle: "O que é, o que é? Tem asas mas não voa, tem boca mas não fala, tem patas mas não anda?",
        answer: "A mesa 🪑"
    },
    {
        riddle: "O que é, o que é? Cai em pé e corre deitado?",
        answer: "A chuva 🌧️"
    },
    {
        riddle: "O que é, o que é? É irmão do pai da minha prima, mas não é meu tio?",
        answer: "Meu pai 👨"
    },
    {
        riddle: "O que é, o que é? Entra na água mas não se molha, entra no fogo mas não se queima?",
        answer: "O gelo 🧊"
    },
    {
        riddle: "O que é, o que é? Quanto maior menos se vê?",
        answer: "A escuridão 🌌"
    }
];

let gameState = {
    score: 0,
    revealed: new Array(9).fill(false),
    total: riddles.length
};

// Elementos DOM
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const resetBtn = document.getElementById('reset-btn');

// Atualizar pontuação na tela
function updateScoreUI() {
    scoreElement.textContent = gameState.score;
    totalElement.textContent = gameState.total;
}

// Salvar estado no localStorage
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Carregar estado do localStorage
function loadGameState() {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.revealed && parsed.revealed.length === riddles.length) {
            gameState = parsed;
            updateScoreUI();
            return true;
        }
    }
    return false;
}

// Revelar uma charada
function revealCard(index) {
    if (!gameState.revealed[index]) {
        gameState.revealed[index] = true;
        gameState.score++;
        updateScoreUI();
        saveGameState();
        renderCards();
        
        // Efeito sonoro virtual (opcional - console)
        console.log(`🎉 Acertou! +1 ponto. Total: ${gameState.score}`);
        
        // Verificar se completou o jogo
        if (gameState.score === gameState.total) {
            setTimeout(() => {
                alert('🎉 Parabéns! Você completou todas as charadas! 🎉');
            }, 100);
        }
    }
}

// Renderizar todos os cards
function renderCards() {
    gameContainer.innerHTML = '';
    
    riddles.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `card ${gameState.revealed[index] ? 'revealed' : ''}`;
        
        card.innerHTML = `
            <h3>🔎 Charada ${index + 1}</h3>
            <div class="riddle">${item.riddle}</div>
            <div class="answer">
                ✨ <strong>Resposta:</strong> ${item.answer}
            </div>
            ${!gameState.revealed[index] ? '<div class="reveal-hint">🔍 Clique para revelar a resposta</div>' : ''}
        `;
        
        if (!gameState.revealed[index]) {
            card.addEventListener('click', () => revealCard(index));
        }
        
        gameContainer.appendChild(card);
    });
}

// Resetar o jogo
function resetGame() {
    if (confirm('Tem certeza que deseja reiniciar o jogo? Seu progresso será perdido.')) {
        gameState = {
            score: 0,
            revealed: new Array(riddles.length).fill(false),
            total: riddles.length
        };
        updateScoreUI();
        saveGameState();
        renderCards();
        
        // Efeito visual de reset
        const container = document.querySelector('.container');
        container.style.transform = 'scale(0.98)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 200);
    }
}

// Inicializar o jogo
function initGame() {
    totalElement.textContent = gameState.total;
    
    // Tentar carregar progresso salvo
    const hasSavedProgress = loadGameState();
    
    renderCards();
    
    // Se não havia progresso salvo, salva estado inicial
    if (!hasSavedProgress) {
        saveGameState();
    }
    
    // Adicionar evento de reset
    resetBtn.addEventListener('click', resetGame);
    
    // Mensagem de boas-vindas
    console.log('🎮 Jogo "O Que é, O Que é?" iniciado! Divirta-se!');
}

// Iniciar o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initGame);
