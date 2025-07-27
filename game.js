const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 90;
const ballSize = 14;

let leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 10
};

let rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 6
};

let ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    size: ballSize,
    speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
    speedY: (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1)
};

let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp within bounds
    leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
});

// AI for right paddle
function moveAIPaddle() {
    let target = ball.y + ball.size / 2 - rightPaddle.height / 2;
    if (rightPaddle.y < target) {
        rightPaddle.y += rightPaddle.speed;
        if (rightPaddle.y > target) rightPaddle.y = target;
    } else if (rightPaddle.y > target) {
        rightPaddle.y -= rightPaddle.speed;
        if (rightPaddle.y < target) rightPaddle.y = target;
    }
    // Clamp within bounds
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#0ff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillStyle = '#f0f';
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw scores
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(leftScore, canvas.width / 4, 40);
    ctx.fillText(rightScore, 3 * canvas.width / 4, 40);
}

// Collision detection
function checkCollisions() {
    // Top & bottom walls
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.speedY = -ball.speedY;
        ball.y = Math.max(0, Math.min(canvas.height - ball.size, ball.y));
    }

    // Left paddle
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.speedX = Math.abs(ball.speedX);
        ball.x = leftPaddle.x + leftPaddle.width;
        // Add spin
        ball.speedY += ((ball.y + ball.size / 2) - (leftPaddle.y + leftPaddle.height / 2)) * 0.1;
    }

    // Right paddle
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.speedX = -Math.abs(ball.speedX);
        ball.x = rightPaddle.x - ball.size;
        // Add spin
        ball.speedY += ((ball.y + ball.size / 2) - (rightPaddle.y + rightPaddle.height / 2)) * 0.1;
    }

    // Score
    if (ball.x < 0) {
        rightScore++;
        resetBall(-1);
    } else if (ball.x > canvas.width - ball.size) {
        leftScore++;
        resetBall(1);
    }
}

// Reset ball after score
function resetBall(direction) {
    ball.x = canvas.width / 2 - ball.size / 2;
    ball.y = canvas.height / 2 - ball.size / 2;
    ball.speedX = 5 * direction;
    ball.speedY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
}

// Update game state
function update() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    moveAIPaddle();
    checkCollisions();
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();