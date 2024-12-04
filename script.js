const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Increased the size of the snake and food
canvas.width = 20 * box; // Adjusted the canvas width to be a multiple of box size
canvas.height = 20 * box; // Adjusted the canvas height to be a multiple of box size

let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};
let score = 0;
let direction;
let game;
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').textContent = highScore;
document.getElementById('currentScore').textContent = score;

let gameInitialized = false;

// Load the snake head image
const snakeHeadImg = new Image();
snakeHeadImg.src = 'assets/pepe_head.png';

// Load the logo image
const logoImg = new Image();
logoImg.src = 'assets/pepe_head.png'; // Replace with the actual logo image path

// Display the logo initially
logoImg.onload = function() {
    ctx.drawImage(logoImg, (canvas.width - 100) / 2, (canvas.height - 100) / 2, 100, 100);
};

snakeHeadImg.onload = function() {
    // Snake head image loaded successfully
};

snakeHeadImg.onerror = function() {
    console.error("Failed to load snake head image.");
};

document.addEventListener("keydown", directionControl);

function directionControl(event) {
    if ([37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault(); // Prevent arrow keys from focusing buttons
    }
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function collision(newHead, snakeArray) {
    for (let i = 0; i < snakeArray.length; i++) {
        if (newHead.x === snakeArray[i].x && newHead.y === snakeArray[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            // Draw the snake head
            ctx.drawImage(snakeHeadImg, snake[i].x, snake[i].y, box, box);
        } else {
            ctx.fillStyle = "#9ba8ae";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = "#9ba8ae";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
    }

    ctx.fillStyle = "#9ba8ae";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('currentScore').textContent = score;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = "#9ba8ae";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2 - 20);
    ctx.fillText("Score: " + score, canvas.width / 4, canvas.height / 2 + 10);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }

    canvas.addEventListener('click', resetGame, { once: true });
}

function resetGame() {
    score = 0;
    document.getElementById('currentScore').textContent = score;
    direction = null;
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    clearInterval(game);
    game = setInterval(draw, 100); // Adjust speed here
}

let sequence = "";
const startSequence = "733733";

document.querySelectorAll(".num-key").forEach(button => {
    button.addEventListener("click", (event) => {
        const value = event.target.getAttribute("data-value");
        sequence += value;
        console.log(`Button pressed: ${value}, current sequence: ${sequence}`);

        if (sequence === startSequence) {
            console.log("Starting game...");
            sequence = "";
            gameInitialized = true;
            startGame();
        } else if (!startSequence.startsWith(sequence)) {
            console.log("Resetting sequence...");
            sequence = "";
        }
    });
});

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    direction = null;
    score = 0;
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    if (!gameInitialized) {
        sequence = "";
        return;
    }
    game = setInterval(draw, 100); // Adjust speed here
    console.log("Game started.");
}
