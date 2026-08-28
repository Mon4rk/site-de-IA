let draggedElement = null;
let draggedFrom = null;

// Adicionar event listeners para os elementos arrastáveis
function setupDragListeners() {
    const wordItems = document.querySelectorAll('.word-item');
    const blanks = document.querySelectorAll('.blank');

    // Event listeners para palavras
    wordItems.forEach(word => {
        word.addEventListener('dragstart', handleDragStart);
        word.addEventListener('dragend', handleDragEnd);
    });

    // Event listeners para espaços em branco
    blanks.forEach(blank => {
        blank.addEventListener('dragover', handleDragOver);
        blank.addEventListener('drop', handleDrop);
        blank.addEventListener('dragenter', handleDragEnter);
        blank.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    draggedFrom = 'words';
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.style.opacity = '1';
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.style.background = '#e7f3ff';
}

function handleDragLeave(e) {
    this.style.background = '#fff';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedElement) return;

    const text = draggedElement.textContent.trim();
    const expectedAnswer = this.getAttribute('data-answer');

    // Verificar se a palavra já foi usada
    if (draggedElement.classList.contains('used')) {
        this.style.background = '#fff';
        return;
    }

    // Adicionar palavra ao espaço em branco
    this.textContent = text;
    this.setAttribute('data-placed', text);
    this.classList.add('filled');
    this.classList.remove('incorrect');
    this.style.background = '#fff';

    // Marcar a palavra como usada
    draggedElement.classList.add('used');
    draggedElement.style.opacity = '1';

    // Permitir remover a palavra clicando no espaço
    this.style.cursor = 'pointer';
}

// Permitir clicar no espaço preenchido para remover a palavra
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('blank') && e.target.classList.contains('filled')) {
        const text = e.target.textContent.trim();
        const wordItems = document.querySelectorAll('.word-item');
        
        wordItems.forEach(item => {
            if (item.textContent.trim() === text) {
                item.classList.remove('used');
            }
        });

        e.target.textContent = e.target.getAttribute('data-answer').replace(/./g, '_');
        e.target.classList.remove('filled', 'incorrect');
        e.target.removeAttribute('data-placed');
        e.target.style.cursor = 'grab';
    }
});

// Verificar respostas
document.getElementById('checkBtn').addEventListener('click', function() {
    const blanks = document.querySelectorAll('.blank');
    let allCorrect = true;
    let correctCount = 0;

    blanks.forEach(blank => {
        const answer = blank.getAttribute('data-answer');
        const placed = blank.getAttribute('data-placed');

        if (placed && placed.toLowerCase() === answer.toLowerCase()) {
            blank.classList.remove('incorrect');
            blank.classList.add('filled');
            correctCount++;
        } else if (placed) {
            blank.classList.add('incorrect');
            blank.classList.remove('filled');
            allCorrect = false;
        } else {
            allCorrect = false;
        }
    });

    const resultMessage = document.getElementById('resultMessage');
    
    if (allCorrect && correctCount === blanks.length) {
        resultMessage.textContent = '🎉 Parabéns! Você acertou todas as respostas!';
        resultMessage.classList.add('success');
        resultMessage.classList.remove('error');
    } else if (correctCount > 0) {
        resultMessage.textContent = `✓ Você acertou ${correctCount} de ${blanks.length} respostas. Tente novamente!`;
        resultMessage.classList.add('error');
        resultMessage.classList.remove('success');
    } else {
        resultMessage.textContent = '❌ Nenhuma resposta correta. Tente de novo!';
        resultMessage.classList.add('error');
        resultMessage.classList.remove('success');
    }
});

// Recomeçar o jogo
document.getElementById('resetBtn').addEventListener('click', function() {
    // Limpar todos os espaços em branco
    const blanks = document.querySelectorAll('.blank');
    blanks.forEach(blank => {
        blank.textContent = blank.getAttribute('data-answer').replace(/./g, '_');
        blank.removeAttribute('data-placed');
        blank.classList.remove('filled', 'incorrect');
        blank.style.background = '#fff';
        blank.style.cursor = 'grab';
    });

    // Desmarcar todas as palavras como usadas
    const wordItems = document.querySelectorAll('.word-item');
    wordItems.forEach(word => {
        word.classList.remove('used');
    });

    // Limpar mensagem de resultado
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.textContent = '';
    resultMessage.classList.remove('success', 'error');

    draggedElement = null;
    draggedFrom = null;
});

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setupDragListeners();
    
    // Criar underscores nos espaços em branco
    const blanks = document.querySelectorAll('.blank');
    blanks.forEach(blank => {
        const answer = blank.getAttribute('data-answer');
        blank.textContent = answer.replace(/./g, '_');
    });
});