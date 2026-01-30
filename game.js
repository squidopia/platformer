(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  // Player object
  const player = {
    x: 50,
    y: HEIGHT - 70,
    width: 30,
    height: 50,
    color: '#ff6347',
    velX: 0,
    velY: 0,
    speed: 3,
    jumping: false
  };

  const gravity = 0.5;
  const friction = 0.8;

  // Levels — array of platform arrays
  const levels = [
    // Level 1
    [
      { x: 0, y: HEIGHT - 20, width: WIDTH, height: 20 },
      { x: 120, y: HEIGHT - 90, width: 100, height: 15 },
      { x: 280, y: HEIGHT - 140, width: 100, height: 15 },
      { x: 450, y: HEIGHT - 190, width: 120, height: 15 },
    ],
    // Level 2 (more spaced platforms)
    [
      { x: 0, y: HEIGHT - 20, width: WIDTH, height: 20 },
      { x: 90, y: HEIGHT - 120, width: 80, height: 15 },
      { x: 220, y: HEIGHT - 160, width: 120, height: 15 },
      { x: 400, y: HEIGHT - 100, width: 90, height: 15 },
      { x: 520, y: HEIGHT - 140, width: 70, height: 15 },
    ],
    // Level 3 (higher platforms)
    [
      { x: 0, y: HEIGHT - 20, width: WIDTH, height: 20 },
      { x: 150, y: HEIGHT - 180, width: 130, height: 15 },
      { x: 350, y: HEIGHT - 210, width: 90, height: 15 },
      { x: 500, y: HEIGHT - 240, width: 100, height: 15 },
    ],
    // Level 4 (small platforms, more jumps)
    [
      { x: 0, y: HEIGHT - 20, width: WIDTH, height: 20 },
      { x: 80, y: HEIGHT - 90, width: 50, height: 15 },
      { x: 160, y: HEIGHT - 130, width: 60, height: 15 },
      { x: 250, y: HEIGHT - 170, width: 40, height: 15 },
      { x: 320, y: HEIGHT - 110, width: 70, height: 15 },
      { x: 430, y: HEIGHT - 150, width: 60, height: 15 },
      { x: 520, y: HEIGHT - 90, width: 50, height: 15 },
    ],
    // Level 5 (final, mix of platforms)
    [
      { x: 0, y: HEIGHT - 20, width: WIDTH, height: 20 },
      { x: 100, y: HEIGHT - 150, width: 90, height: 15 },
      { x: 220, y: HEIGHT - 100, width: 80, height: 15 },
      { x: 350, y: HEIGHT - 160, width: 110, height: 15 },
      { x: 490, y: HEIGHT - 120, width: 90, height: 15 },
    ],
  ];

  let currentLevelIndex = 0;
  let platforms = levels[currentLevelIndex];

  const keys = {};

  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  // Collision helper
  function rectsCollide(r1, r2) {
    return !(r2.x > r1.x + r1.width ||
             r2.x + r2.width < r1.x ||
             r2.y > r1.y + r1.height ||
             r2.y + r2.height < r1.y);
  }

  function resetPlayer() {
    player.x = 50;
    player.y = HEIGHT - 70;
    player.velX = 0;
    player.velY = 0;
    player.jumping = false;
  }

  function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Move left/right
    if (keys['ArrowLeft'] || keys['KeyA']) {
      if (player.velX > -player.speed) {
        player.velX--;
      }
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      if (player.velX < player.speed) {
        player.velX++;
      }
    }

    // Jump
    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && !player.jumping) {
      player.velY = -10;
      player.jumping = true;
    }

    // Gravity & friction
    player.velY += gravity;
    player.velX *= friction;

    // Update position
    player.x += player.velX;
    player.y += player.velY;

    // Collision detection
    player.jumping = true;
    for (let platform of platforms) {
      const playerRect = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      };
      const platformRect = {
        x: platform.x,
        y: platform.y,
        width: platform.width,
        height: platform.height
      };
      if (rectsCollide(playerRect, platformRect)) {
        if (player.velY > 0) {
          player.y = platform.y - player.height;
          player.velY = 0;
          player.jumping = false;
        }
      }
    }

    // Boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > WIDTH) player.x = WIDTH - player.width;
    if (player.y + player.height > HEIGHT) {
      player.y = HEIGHT - player.height;
      player.velY = 0;
      player.jumping = false;
    }

    // Draw platforms
    ctx.fillStyle = '#654321';
    for (let platform of platforms) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw current level text
    ctx.fillStyle = '#000';
    ctx.font = '18px Arial';
    ctx.fillText(`Playing Level ${currentLevelIndex + 1}`, 10, 20);

    requestAnimationFrame(gameLoop);
  }

  // UI Elements
  const levelSelectDiv = document.getElementById('level-select');
  const gameCanvas = canvas;

  function showLevelSelect() {
    levelSelectDiv.style.display = 'flex';
    gameCanvas.style.display = 'none';
  }

  function startLevel(levelIndex) {
    currentLevelIndex = levelIndex;
    platforms = levels[currentLevelIndex];
    resetPlayer();

    levelSelectDiv.style.display = 'none';
    gameCanvas.style.display = 'block';

    // Start or resume the game loop
    requestAnimationFrame(gameLoop);
  }

  // Add event listeners to buttons
  levelSelectDiv.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const levelIndex = parseInt(button.getAttribute('data-level'));
      startLevel(levelIndex);
    });
  });

  // Show level select initially
  showLevelSelect();

})();
