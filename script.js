const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 30;  // Tamaño de cada celda
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake = [{x: 0, y: 0}]; // La serpiente empieza en la esquina superior izquierda
let food = {x: Math.floor(Math.random() * cols) * scale, y: Math.floor(Math.random() * rows) * scale};
let direction = '';
let score = 0;
let gameInterval;
let gameRunning = false;
let hasEaten = false;  // Indica si la serpiente ha comido al menos una manzana

// Cargar la imagen de la manzana
const appleImage = new Image();
appleImage.src = 'apple.png';  // Ruta a la imagen de la manzana

// Colores del fondo tipo ajedrez con tonos más suaves
const lightGreen = '#b2d8b2';  // Verde claro y suave
const darkGreen = '#8fbc8f';   // Verde más oscuro pero suave

// Función para dibujar el fondo y la cuadrícula tipo ajedrez
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la cuadrícula tipo ajedrez
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillStyle = darkGreen;
            } else {
                ctx.fillStyle = lightGreen;
            }
            ctx.fillRect(j * scale, i * scale, scale, scale);
        }
    }
}

// Función para dibujar la serpiente
function drawSnake() {
    ctx.fillStyle = 'black';  // Color de la serpiente
    snake.forEach(part => ctx.fillRect(part.x, part.y, scale, scale));
}

// Función para dibujar la comida
function drawFood() {
    ctx.drawImage(appleImage, food.x, food.y, scale, scale);
}

// Función para dibujar la puntuación
function drawScore() {
    document.getElementById('score').textContent = `Cantidad 🍎 : ${score}`;
}

// Función para mover la serpiente
function moveSnake() {
    let head = {x: snake[0].x, y: snake[0].y};

    switch (direction) {
        case 'up':
            head.y -= scale;
            break;
        case 'down':
            head.y += scale;
            break;
        case 'left':
            head.x -= scale;
            break;
        case 'right':
            head.x += scale;
            break;
    }

    // Verifica si la serpiente choca con los bordes o consigo misma
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - scale;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - scale;

    // Comprobar si la serpiente choca consigo misma
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            if (hasEaten) {
                resetGame();
                return;
            }
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        hasEaten = true;
        drawScore();
        food = {x: Math.floor(Math.random() * cols) * scale, y: Math.floor(Math.random() * rows) * scale};
    } else {
        snake.pop();
    }
}

// Función para reiniciar el juego
function resetGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    direction = '';
    snake = [{x: 0, y: 0}]; // Reiniciar la serpiente en la esquina superior izquierda
    food = {x: Math.floor(Math.random() * cols) * scale, y: Math.floor(Math.random() * rows) * scale};
    score = 0;
    hasEaten = false;  // Reiniciar el estado de la comida
    drawScore();
    drawGame();
}

// Función para detener el juego
function stopGame() {
    clearInterval(gameInterval);
    gameRunning = false;
}

// Función para dibujar el juego
function drawGame() {
    drawBackground();  // Llamar a la función para dibujar el fondo
    drawSnake();
    drawFood();
}

// Función de actualización del juego
function update() {
    if (gameRunning) {
        moveSnake();
        drawGame();
    }
}

// Función para iniciar el juego
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameInterval = setInterval(update, 200); // Ajustar la velocidad
    }
}

// Manejadores de eventos para los controles y botones
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('stopBtn').addEventListener('click', stopGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Esperar a que la imagen de la manzana se cargue antes de dibujar el juego
appleImage.onload = () => {
    drawGame();  // Dibuja el juego inicial
};

