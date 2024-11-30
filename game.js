const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 60;
const gridSize = canvas.width / tileSize;

let player = { x: 0, y: 0 };
let goal = { x: 9, y: 9 };
let coins = [];
let enemies = [];

let levelIndex = 0;

// Levels
const levels = [
  {
    goal: { x: 9, y: 9 },
    coins: [{ x: 5, y: 5 }, { x: 7, y: 2 }],
    enemies: [{ x: 3, y: 4 }, { x: 8, y: 6 }],
  },
  {
    goal: { x: 5, y: 5 },
    coins: [{ x: 2, y: 2 }, { x: 4, y: 4 }],
    enemies: [{ x: 6, y: 3 }, { x: 7, y: 7 }],
  },
];

// Draw grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.strokeRect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

// Draw goal
function drawGoal() {
  ctx.fillStyle = 'green';
  ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);
}

// Draw coins
function drawCoins() {
  ctx.fillStyle = 'gold';
  for (const coin of coins) {
    ctx.beginPath();
    ctx.arc(
      coin.x * tileSize + tileSize / 2,
      coin.y * tileSize + tileSize / 2,
      tileSize / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

// Draw enemies
function drawEnemies() {
  ctx.fillStyle = 'red';
  for (const enemy of enemies) {
    ctx.fillRect(enemy.x * tileSize, enemy.y * tileSize, tileSize, tileSize);
  }
}

// Initialize level
function loadLevel(level) {
  player = { x: 0, y: 0 };
  goal = level.goal;
  coins = [...level.coins];
  enemies = [...level.enemies];
  drawGame();
}

// Draw the game
function drawGame() {
  drawGrid();
  drawPlayer();
  drawGoal();
  drawCoins();
  drawEnemies();
}

// Move player
function movePlayer(direction) {
  if (direction === 'up' && player.y > 0) player.y--;
  if (direction === 'down' && player.y < gridSize - 1) player.y++;
  if (direction === 'left' && player.x > 0) player.x--;
  if (direction === 'right' && player.x < gridSize - 1) player.x++;
  checkCollision();
  drawGame();
}

// Check collisions and level progress
function checkCollision() {
  // Collect coins
  coins = coins.filter(coin => !(coin.x === player.x && coin.y === player.y));

  // Enemy collision
  for (const enemy of enemies) {
    if (enemy.x === player.x && enemy.y === player.y) {
      document.getElementById('message').textContent = 'You were caught by an enemy!';
      return loadLevel(levels[levelIndex]);
    }
  }

  // Goal reached
  if (player.x === goal.x && player.y === goal.y && coins.length === 0) {
    document.getElementById('message').textContent = 'Level Complete!';
    levelIndex++;
    if (levelIndex < levels.length) {
      setTimeout(() => loadLevel(levels[levelIndex]), 1000);
    } else {
      document.getElementById('message').textContent = 'You won the game!';
    }
  }
}

// Handle run button
document.getElementById('run').addEventListener('click', () => {
  const code = document.getElementById('editor').value;
  try {
    eval(code); // Caution: For educational purposes only!
    drawGame();
  } catch (error) {
    alert('Error in code: ' + error.message);
  }
});

loadLevel(levels[levelIndex]);
