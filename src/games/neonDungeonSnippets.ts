import { GameSnippet } from '../types/game';

export const neonDungeonSnippets: GameSnippet[] = [
    {
      id: 'player_vector',
      label: 'Cyber Hero Physics',
      description: 'Vector position and velocity update loop for player movement',
      snippets: {
        javascript: `// [Boilerplate: Cyber Hero Physics]
let player = { x: 200, y: 200, vx: 0, vy: 0, size: 20, speed: 3 };
if (keys['ArrowUp'] || keys['w']) player.vy = -player.speed;
else if (keys['ArrowDown'] || keys['s']) player.vy = player.speed;
else player.vy = 0;

if (keys['ArrowLeft'] || keys['a']) player.vx = -player.speed;
else if (keys['ArrowRight'] || keys['d']) player.vx = player.speed;
else player.vx = 0;

player.x += player.vx;
player.y += player.vy;`,
        python: `# [Boilerplate: Cyber Hero Physics]
player_x, player_y = 200, 200
player_vx, player_vy = 0, 0
speed = 3
if keys.get('UP') or keys.get('w'):
    player_vy = -speed
elif keys.get('DOWN') or keys.get('s'):
    player_vy = speed
else:
    player_vy = 0`,
        java: `// [Boilerplate: Cyber Hero Physics]
int playerX = 200, playerY = 200;
int vx = 0, vy = 0, speed = 3;
if (keys.containsKey("UP") || keys.containsKey("w")) {
    vy = -speed;
} else if (keys.containsKey("DOWN") || keys.containsKey("s")) {
    vy = speed;
} else {
    vy = 0;
}`,
      },
    },
    {
      id: 'aabb_collision',
      label: 'AABB Wall Collision',
      description: 'Bounding box boundary check for dungeon walls',
      snippets: {
        javascript: `// [Boilerplate: AABB Wall Collision]
function checkWallCollision(px, py, size, wall) {
  return px < wall.x + wall.w &&
         px + size > wall.x &&
         py < wall.y + wall.h &&
         py + size > wall.y;
}`,
        python: `# [Boilerplate: AABB Wall Collision]
def check_wall_collision(px, py, size, wall):
    return (px < wall['x'] + wall['w'] and
            px + size > wall['x'] and
            py < wall['y'] + wall['h'] and
            py + size > wall['y'])`,
        java: `// [Boilerplate: AABB Wall Collision]
public boolean checkWallCollision(int px, int py, int size, Rectangle wall) {
    return px < wall.x + wall.width &&
           px + size > wall.x &&
           py < wall.y + wall.height &&
           py + size > wall.y;
}`,
      },
    },
    {
      id: 'gem_spawner',
      label: 'Energy Gem Spawner',
      description: 'Random energy cell generator with score increment',
      snippets: {
        javascript: `// [Boilerplate: Energy Gem Spawner]
let gem = { x: Math.random() * 360 + 20, y: Math.random() * 360 + 20, size: 14 };
function respawnGem() {
  gem.x = Math.floor(Math.random() * 350) + 25;
  gem.y = Math.floor(Math.random() * 350) + 25;
  playScore();
}`,
        python: `# [Boilerplate: Energy Gem Spawner]
import random
gem = {'x': random.randint(30, 370), 'y': random.randint(30, 370), 'size': 14}
def respawn_gem():
    gem['x'] = random.randint(30, 370)
    gem['y'] = random.randint(30, 370)`,
        java: `// [Boilerplate: Energy Gem Spawner]
Point gem = new Point(150, 150);
public void respawnGem() {
    gem.x = (int)(Math.random() * 350) + 25;
    gem.y = (int)(Math.random() * 350) + 25;
}`,
      },
    },
  ];
