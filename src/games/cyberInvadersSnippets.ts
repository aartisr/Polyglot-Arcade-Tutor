import { GameSnippet } from '../types/game';

export const cyberInvadersSnippets: GameSnippet[] = [
    {
      id: 'strafe_physics',
      label: 'Cannon Strafe Physics',
      description: 'Horizontal screen-clamped strafe movement for defense cannon',
      snippets: {
        javascript: `// [Boilerplate: Cannon Strafe Physics]
let cannon = { x: 200, y: 360, width: 40, height: 16, speed: 5 };
if (keys['ArrowLeft'] || keys['a']) cannon.x = Math.max(20, cannon.x - cannon.speed);
if (keys['ArrowRight'] || keys['d']) cannon.x = Math.min(360, cannon.x + cannon.speed);`,
        python: `# [Boilerplate: Cannon Strafe Physics]
cannon_x = 200
speed = 5
if keys.get('LEFT') or keys.get('a'):
    cannon_x = max(20, cannon_x - speed)
elif keys.get('RIGHT') or keys.get('d'):
    cannon_x = min(360, cannon_x + speed)`,
        java: `// [Boilerplate: Cannon Strafe Physics]
int cannonX = 200, speed = 5;
if (keys.containsKey("LEFT") || keys.containsKey("a")) {
    cannonX = Math.max(20, cannonX - speed);
} else if (keys.containsKey("RIGHT") || keys.containsKey("d")) {
    cannonX = Math.min(360, cannonX + speed);
}`,
      },
    },
    {
      id: 'plasma_pool',
      label: 'Plasma Laser Pool',
      description: 'Projectile spawning array for space defense laser bolts',
      snippets: {
        javascript: `// [Boilerplate: Plasma Laser Pool]
let lasers = [];
function fireLaser(x, y) {
  lasers.push({ x: x, y: y, vy: -9, radius: 4 });
  playMove();
}`,
        python: `# [Boilerplate: Plasma Laser Pool]
lasers = []
def fire_laser(x, y):
    lasers.append({'x': x, 'y': y, 'vy': -9, 'radius': 4})`,
        java: `// [Boilerplate: Plasma Laser Pool]
List<Laser> lasers = new ArrayList<>();
public void fireLaser(int x, int y) {
    lasers.add(new Laser(x, y, -9));
}`,
      },
    },
    {
      id: 'armada_matrix',
      label: 'Alien Armada Matrix',
      description: 'Grid-based marching alien fleet matrix movement',
      snippets: {
        javascript: `// [Boilerplate: Alien Armada Matrix]
let armada = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 6; c++) {
    armada.push({ x: 60 + c * 48, y: 50 + r * 36, active: true });
  }
}`,
        python: `# [Boilerplate: Alien Armada Matrix]
armada = [{'x': 60 + c * 48, 'y': 50 + r * 36, 'active': True} for r in range(3) for c in range(6)]`,
        java: `// [Boilerplate: Alien Armada Matrix]
List<Alien> armada = new ArrayList<>();
for (int r = 0; r < 3; r++) {
    for (int c = 0; c < 6; c++) {
        armada.add(new Alien(60 + c * 48, 50 + r * 36));
    }
}`,
      },
    },
  ];
