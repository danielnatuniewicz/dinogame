const scene = document.querySelector('.scene');
const bike = document.querySelector('.bike');
const startButton = document.getElementById('start-button');
const gameOverText = document.getElementById('game-over');
const distanceText = document.getElementById('distance');
const highScoreText = document.getElementById('high-score');

let obstacles = [];
let highScore = localStorage.getItem('highScore') || 0;;
let gameOver = false;
let distance = 0;
let bikeBottom = 20;
let speed = 2; 
let jumpHeight = 50;  
let jumping = false; 
let lastObstacleDistance = 0;
let lastObstacleTime = 0;

function updateScore() {
    distanceText.textContent = `Distance: ${Math.floor(distance)}m`;
}

function updateHighScore() {
    if (distance > highScore) {
        highScore = Math.floor(distance);
        localStorage.setItem('highScore', highScore);
        updateScore(); 
        highScoreText.textContent = `High Score: ${Math.floor(highScore)}m`;
    }
}

function startGame() {
    gameOver = false;
    distance = 0;
    bikeBottom = 20;
    gameOverText.style.display = 'none';
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    startButton.style.display = 'none';
    gameLoop();
}


function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = '100%';
    scene.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    obstacles.forEach(obstacle => {
        const currentPosition = parseFloat(obstacle.style.left);
        obstacle.style.left = `${currentPosition - speed}%`;

        if (currentPosition <= -5) {
            obstacle.remove();
            obstacles = obstacles.filter(ob => ob !== obstacle);
            updateScore();
        }
        
        const wheels = document.querySelectorAll('.wheel');
        wheels.forEach(wheel => {
            const wheelRect = wheel.getBoundingClientRect();
            const wheelCenterX = wheelRect.left + wheelRect.width / 2;
            const wheelCenterY = wheelRect.top + wheelRect.height / 2;
            const wheelRadius = Math.max(wheelRect.width, wheelRect.height) / 2;

            const obstacleRect = obstacle.getBoundingClientRect();
            const obstacleCenterX = obstacleRect.left + obstacleRect.width / 2;
            const obstacleCenterY = obstacleRect.top + obstacleRect.height / 2;
            const obstacleRadius = Math.max(obstacleRect.width, obstacleRect.height) / 2;

            const distance = Math.sqrt(Math.pow(obstacleCenterX - wheelCenterX, 2) + Math.pow(obstacleCenterY - wheelCenterY, 2));

            if (distance < wheelRadius + obstacleRadius) {
                gameOver = true;
                gameOverText.style.display = 'block';
                startButton.style.display = 'block';
                if (distance > highScore) {
                    updateHighScore();
                }
            }
        });
    });

    if (Math.random() < 0.01) {
        createObstacle();
    }
}

function gameLoop() {
    if (gameOver) {
        updateHighScore();
        return;
    }

    moveObstacles();
    updateDistance();
    requestAnimationFrame(gameLoop);
}

function updateDistance() {
    distance += 0.1; 
    distanceText.textContent = `Distance: ${Math.floor(distance)}m`;
}

function jump() {
    if (!jumping && bikeBottom === 20) {
        jumping = true;
        bikeBottom = jumpHeight;
        bike.style.transition = 'bottom 0.2s';
        bike.style.bottom = `${bikeBottom}%`;

        setTimeout(() => {
            bikeBottom = 20;
            bike.style.bottom = `${bikeBottom}%`;
            setTimeout(() => {
                jumping = false; 
            }, 100); 
        }, 200);
    }
}



startButton.addEventListener('click', startGame);
document.addEventListener('click', jump);

startGame();

document.addEventListener('DOMContentLoaded', function() {
    const background = document.querySelector('.background');

    function createTree() {
        const tree = document.createElement('div');
        tree.classList.add('tree');
        tree.style.left = '100%';
        background.appendChild(tree);
    }

    setInterval(() => {
        const interval = Math.floor(Math.random() * (2500 - 1500)) + 1500;
        setTimeout(createTree, interval);
    }, 2000);
});

