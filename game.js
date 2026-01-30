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
    color: '#ff6347', // tomato red
    velX: 0,
    velY: 0,
    speed: 3,
    jumping: false
  };

  const gravity = 0.5;
  const friction = 0.8;

  // Platforms (x, y, width, height)
  const platforms = [
    { x: 0, y: HEIGHT - 20, width: WIDTH, height: 20 }, // ground
    { x: 120, y: HEIGHT - 90, width: 100, height: 15 },
    { x: 280, y: HEIGHT - 140, width: 100, height: 15 },
    { x: 450, y: HEIGHT - 190, width: 120, height: 15 },
  ];

  // Controls
  const keys = {};

  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  function rectsCollide(r1, r2) {
    return !(r2.x > r1.x + r1.width ||
             r2.x + r2.width < r1.x ||
             r2.y > r1.y + r1.height ||
             r2.y + r2.height < r1.y);
  }

  function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Move player left/right
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

    // Apply gravity
    player.velY += gravity;

    // Apply friction
    player.velX *= friction;

    // Update position
    player.x += player.velX;
    player.y += player.velY;

    // Collision detection with platforms
    player.jumping = true; // Assume in air until collision detected

    for (let platform of platforms) {
      // Define rectangles for collision
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
        // Collision response — simple: place player on top of platform
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
    ctx.fillStyle = '#654321'; // brown
    for (let platform of platforms) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Instructions
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText('Use Arrow keys or WASD to move and jump', 10, 20);

    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  gameLoop();
})();
