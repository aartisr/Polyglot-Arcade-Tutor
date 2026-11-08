import { LessonStep } from '../types/lesson';

export const CYBER_INVADERS_LESSONS: LessonStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Initializing Space Canvas & Defense Ship',
    subtitle: 'Step 1: Setting up the 2D deep space canvas and drawing the player defense cannon',
    description: `Welcome to **Cyber Invaders: Grid Defender**! In this first step, you will initialize the 2D deep space canvas (400x400) and render your defense cannon ship at the bottom of the screen (x: 182, y: 355, width: 36, height: 22).

Learn how space arcade games represent coordinate systems, entity bounds, and draw primitives across **JavaScript**, **Python**, and **Java**.`,
    concepts: [
      {
        title: 'Deep Space Rendering Surface',
        description: 'Set up an HTML5 2D rendering surface with a dark deep-space background (#030712) and clear canvas on every frame.',
        diagramType: 'canvas-coords',
        codeSnippet: {
          javascript: `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#030712';
ctx.fillRect(0, 0, canvas.width, canvas.height);`,
          python: `import canvas
ctx = canvas.get_context('2d')
ctx.fill_style = '#030712'
ctx.fill_rect(0, 0, 400, 400)`,
          java: `public void paintComponent(Graphics2D g2d) {
    g2d.setColor(new Color(3, 7, 18));
    g2d.fillRect(0, 0, 400, 400);
}`,
        },
      },
      {
        title: 'Player Ship Sprite & Cannon Nose',
        description: 'Render the main cyan hull and cannon turret pointing upwards to intercept incoming alien armadas.',
        codeSnippet: {
          javascript: `// Draw ship hull and cannon nose
ctx.fillStyle = '#38bdf8';
ctx.fillRect(ship.x, ship.y + 8, ship.width, ship.height - 8);
ctx.fillStyle = '#00f3ff';
ctx.fillRect(ship.x + ship.width / 2 - 4, ship.y, 8, 8);`,
        },
      },
    ],
    codeBoilerplate: {
      javascript: `// === STEP 1: INITIALIZE SPACE CANVAS & DEFENSE SHIP ===
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 1. Defense Ship Entity
const ship = {
  x: 182,
  y: 355,
  width: 36,
  height: 22,
  color: '#38bdf8'
};

function render() {
  // Clear space background
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // TODO: Set fillStyle to ship.color and draw the hull with ctx.fillRect.

  console.log('[SPACE RADAR] Defense ship online at x: ' + ship.x + ', y: ' + ship.y);
}

render();
`,
      python: `# === STEP 1: PYTHON SPACE SHIP ENTITY ===
import canvas
ctx = canvas.get_context('2d')
ship = {
    'x': 182,
    'y': 355,
    'width': 36,
    'height': 22,
    'color': '#38bdf8'
}

# TODO: Set ctx.fill_style to ship['color'] and draw the hull with ctx.fill_rect.
print(f"[RADAR] Space defense ship ready at ({ship['x']}, {ship['y']})")
`,
      java: `// === STEP 1: JAVA GRAPHICS2D DEFENSE SHIP ===
import java.awt.*;
import javax.swing.*;

public class SpaceDefender extends JPanel {
    int shipX = 182;
    int shipY = 355;
    int shipWidth = 36;
    int shipHeight = 22;

    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setColor(new Color(3, 7, 18));
        g2d.fillRect(0, 0, 400, 400);

        // TODO: Set the ship color and draw its hull with g2d.fillRect.
    }
}
`,
    },
    solution: {
      javascript: `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const ship = {
  x: 182,
  y: 355,
  width: 36,
  height: 22,
  color: '#38bdf8'
};

function render() {
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

  // Cannon nose
  ctx.fillStyle = '#00f3ff';
  ctx.fillRect(ship.x + ship.width / 2 - 4, ship.y - 4, 8, 6);

  console.log('[SPACE RADAR] Defense ship online at x: ' + ship.x + ', y: ' + ship.y);
}

render();
`,
      python: `import canvas
ctx = canvas.get_context('2d')
ship = {
    'x': 182,
    'y': 355,
    'width': 36,
    'height': 22,
    'color': '#38bdf8'
}
ctx.fill_style = ship['color']
ctx.fill_rect(ship['x'], ship['y'], ship['width'], ship['height'])
print(f"[RADAR] Space defense ship ready at ({ship['x']}, {ship['y']})")
`,
      java: `import java.awt.*;
import javax.swing.*;

public class SpaceDefender extends JPanel {
    int shipX = 182;
    int shipY = 355;
    int shipWidth = 36;
    int shipHeight = 22;

    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setColor(new Color(3, 7, 18));
        g2d.fillRect(0, 0, 400, 400);
        g2d.setColor(new Color(56, 189, 248));
        g2d.fillRect(shipX, shipY, shipWidth, shipHeight);
    }
}
`,
    },
    hints: [
      'Set the drawing color from the ship, then draw a rectangle at its x and y position using its width and height.',
      'Make sure to clear the canvas using ctx.fillStyle = "#030712" before drawing.',
    ],
    tests: [
      {
        id: 'test-canvas-exists',
        name: 'Canvas Context Initialized',
        description: 'Verify 2D space canvas context is initialized.',
        hint: 'Call document.getElementById("game-canvas").getContext("2d").',
        check: (code) => {
          const passed = code.includes('getContext') || code.includes('Graphics2D') || code.includes('get_context');
          return { passed, message: passed ? 'Canvas context active.' : 'Missing canvas context initialization.' };
        },
      },
      {
        id: 'test-ship-entity',
        name: 'Ship Entity Properties',
        description: 'Ensure ship entity contains x, y coordinates and dimensions.',
        hint: 'Define ship with x, y, width, and height.',
        check: (code) => {
          const passed = /fillRect\s*\(\s*(?:ship\.x|shipX)/.test(code) || /fill_rect\s*\(\s*ship\[['"]x/.test(code);
          return { passed, message: passed ? 'Ship entity rendered.' : 'Ship definition or render call missing.' };
        },
      },
    ],
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Keyboard Strafe & Plasma Laser Weapon',
    subtitle: 'Step 2: Vector strafe movement and firing plasma laser projectiles on spacebar',
    description: `In Step 2, connect keyboard event listeners to steer your defense ship left and right across the base perimeter, and fire glowing plasma laser bolts toward the sky when pressing **Space** or **W**!`,
    concepts: [
      {
        title: 'Horizontal Strafe Physics',
        description: 'Calculate horizontal movement using velocity vectors: ship.x += ship.vx. Clamp to screen boundaries.',
        diagramType: 'velocity-vector',
      },
      {
        title: 'Projectile Spawning Pool',
        description: 'When space is pressed, push a new laser entity: { x: ship.x + width/2 - 2, y: ship.y, vy: -8 } into a lasers array.',
      },
    ],
    codeBoilerplate: {
      javascript: `// === STEP 2: STRAFE & PLASMA LASERS ===
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const ship = { x: 182, y: 355, width: 36, height: 22, vx: 0, speed: 5 };
const lasers = [];

window.addEventListener('keydown', (e) => {
  // TODO 1: Set ship.vx to -ship.speed for left and +ship.speed for right.
  if (e.key === ' ' || e.key === 'ArrowUp') {
    // TODO 2: Push a laser at the center of the ship with vy: -8.
  }
});

window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) ship.vx = 0;
});

function update() {
  ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x + ship.vx));
  // TODO 3: Move each laser upward by adding its vy to its y position.
}
`,
      python: `# === STEP 2: PYTHON WEAPON FIRING ===
lasers = []

def fire_laser(ship_x, ship_y):
    # TODO: Append a laser centered on the ship with upward velocity -8.
    print(f"[LASER] Bolt launched! Total active: {len(lasers)}")

fire_laser(182, 355)
`,
      java: `// === STEP 2: JAVA KEYBOARD & PROJECTILES ===
import java.awt.Point;
import java.awt.event.*;
import java.util.ArrayList;

public class ShipController extends KeyAdapter {
    ArrayList<Point> lasers = new ArrayList<>();
    int shipX = 182;

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            // TODO: Add a Point at the ship's center to the lasers list.
        }
    }
}
`,
    },
    solution: {
      javascript: `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const ship = { x: 182, y: 355, width: 36, height: 22, vx: 0, speed: 5 };
const lasers = [];

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') ship.vx = -ship.speed;
  if (e.key === 'ArrowRight' || e.key === 'd') ship.vx = ship.speed;
  if (e.key === ' ' || e.key === 'ArrowUp') {
    lasers.push({ x: ship.x + ship.width / 2 - 2, y: ship.y, width: 4, height: 12, vy: -8 });
  }
});
window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) ship.vx = 0;
});

function update() {
  ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x + ship.vx));
  lasers.forEach((laser) => { laser.y += laser.vy; });
}
`,
      python: `lasers = []
def fire_laser(ship_x, ship_y):
    lasers.append({'x': ship_x + 16, 'y': ship_y, 'vy': -8})
`,
      java: `import java.awt.Point;
import java.awt.event.*;
import java.util.ArrayList;

public class ShipController extends KeyAdapter {
    ArrayList<Point> lasers = new ArrayList<>();
    int shipX = 182;

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            lasers.add(new Point(shipX + 16, 355));
            System.out.println("[WEAPON] Laser fired!");
        }
    }
}
`,
    },
    hints: [
      'In JavaScript, set vx to a negative speed for left and a positive speed for right. Add a laser object to the lasers array when firing.',
      'In JavaScript, move each laser every frame with laser.y += laser.vy.',
      'In Python, append a dictionary with x, y, and vy keys to the lasers list.',
      'In Java, use lasers.add(new Point(shipX + 16, 355)) inside the Space key branch.',
    ],
    tests: [
      {
        id: 'test-event-listeners',
        name: 'Keyboard Input Handling',
        description: 'Verify event listeners for ship movement and firing are present.',
        hint: 'Add addEventListener("keydown") or KeyListener.',
        check: (code) => {
          const passed = code.includes('addEventListener') || code.includes('keyPressed') || code.includes('fire');
          return { passed, message: passed ? 'Keyboard weapon controls registered.' : 'Keyboard listeners missing.' };
        },
      },
      {
        id: 'test-laser-pool',
        name: 'Laser Projectile Array',
        description: 'Ensure lasers projectile collection is managed.',
        hint: 'Declare const lasers = [] or ArrayList<Point> lasers.',
        check: (code) => {
          const passed = /lasers\.(?:push|append|add)\s*\(/.test(code);
          return { passed, message: passed ? 'Laser projectile system verified.' : 'Lasers array missing.' };
        },
      },
    ],
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Alien Grid Invasion & AABB Collisions',
    subtitle: 'Step 3: Marching alien armada grid and projectile Axis-Aligned Bounding Box collision math',
    description: `In Step 3, generate a marching grid of cyber alien invaders across rows and columns. Implement AABB bounding box collision math between your laser projectiles and the alien armada!`,
    concepts: [
      {
        title: 'Alien Fleet Grid Generation',
        description: 'Iterate rows and columns (e.g. 3 rows x 6 columns) to spawn structured alien squadrons.',
      },
      {
        title: 'Laser AABB Collision Check',
        description: 'Evaluate if a laser intersects an alien: laser.x < alien.x + alien.w && laser.x + laser.w > alien.x && laser.y < alien.y + alien.h && laser.y + laser.h > alien.y.',
        diagramType: 'aabb-collision',
      },
    ],
    codeBoilerplate: {
      javascript: `// === STEP 3: ALIEN FLEET & AABB COLLISIONS ===
function checkLaserCollision(laser, alien) {
  // TODO 1: Return true when an alive alien overlaps a laser on both axes.
  return false;
}

// Fleet grid setup
const aliens = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 6; c++) {
    // TODO 2: Push an alive alien at x: 45 + c * 52, y: 40 + r * 35.
  }
}

console.log('[FLEET] Initialized invasion grid with ' + aliens.length + ' invaders.');
`,
      python: `# === STEP 3: PYTHON AABB CHECK ===
def check_collision(laser, alien):
    # TODO: Return true only when the alive alien overlaps the laser on both axes.
    return False
`,
      java: `// === STEP 3: JAVA AABB COLLISION ===
public boolean checkCollision(Rectangle laser, Rectangle alien) {
    // TODO: Use Rectangle.intersects to test whether the laser hits the alien.
    return false;
}
`,
    },
    solution: {
      javascript: `function checkLaserCollision(laser, alien) {
  return (
    alien.alive &&
    laser.x < alien.x + alien.width &&
    laser.x + laser.width > alien.x &&
    laser.y < alien.y + alien.height &&
    laser.y + laser.height > alien.y
  );
}

const aliens = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 6; c++) {
    aliens.push({ x: 45 + c * 52, y: 40 + r * 35, width: 28, height: 20, alive: true });
  }
}
`,
      python: `def check_collision(laser, alien):
    return (
        alien['alive'] and
        laser['x'] < alien['x'] + alien['width'] and
        laser['x'] + laser['width'] > alien['x'] and
        laser['y'] < alien['y'] + alien['height'] and
        laser['y'] + laser['height'] > alien['y']
    )
`,
      java: `public boolean checkCollision(Rectangle laser, Rectangle alien) {
    return laser.intersects(alien);
}
`,
    },
    hints: [
      'AABB collision checks whether two rectangles overlap horizontally and vertically.',
      'In JavaScript, create 18 aliens by pushing one object for each row and column. Give each alien width, height, and alive fields.',
      'In Python, compare the x and y edges of the laser and alien dictionaries after checking alien["alive"].',
      'In Java, Rectangle.intersects already performs the four edge comparisons.',
    ],
    tests: [
      {
        id: 'test-collision-function',
        name: 'AABB Collision Algorithm',
        description: 'Verify Axis-Aligned Bounding Box collision math is implemented.',
        hint: 'Implement checkLaserCollision or bounds intersection.',
        check: (code) => {
          const passed = (code.includes('width') && code.includes('height') && (code.includes('&&') || code.includes('and'))) || code.includes('.intersects(');
          return { passed, message: passed ? 'AABB projectile collision math verified.' : 'Collision check formula missing.' };
        },
      },
    ],
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Game Loop, Bunkers & Score System',
    subtitle: 'Step 4: Full 60 FPS animation loop, destructible shield bunkers, and score counter',
    description: `Complete your retro space arcade masterpiece! Assemble the 60 FPS game loop using requestAnimationFrame, animate descending alien waves, add destructible shield bunkers, and keep high score tracking!`,
    concepts: [
      {
        title: '60 FPS Space Animation Loop',
        description: 'Run continuous input update -> physics movement -> collision tests -> render calls.',
        diagramType: 'game-loop',
      },
      {
        title: 'Destructible Shield Bunkers',
        description: 'Bunkers absorb both player lasers and alien bombs, degrading hit points from 4 to 0.',
      },
    ],
    codeBoilerplate: {
      javascript: `// === STEP 4: 60 FPS GAME LOOP & SCORE ===
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;
const bunkers = [{ x: 90, y: 320, width: 60, height: 16, hp: 4 }];

function gameLoop() {
  if (gameOver) return;

  // TODO 1: Move the aliens and lasers each frame.
  // TODO 2: On a laser hit, remove the alien and add 150 to score.
  // TODO 3: Reduce a bunker's hp when a projectile hits it.
  // TODO 4: Clear the canvas and draw the ship, aliens, bunkers, and lasers.

  // Draw HUD Score
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px JetBrains Mono, monospace';
  ctx.fillText('SCORE: ' + score + ' PTS', 16, 44);

  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('[ENGINE] Cyber Invaders 60 FPS Game Loop Active!');
`,
      python: `# === STEP 4: PYTHON GAME LOOP ===
score = 0
bunkers = [{'hp': 4}]
def update_game():
    global score
    # TODO: Award 150 points for an alien hit and reduce bunker hp on a bunker hit.
    print(f"Game Loop Running | Score: {score}")

update_game()
`,
      java: `// === STEP 4: JAVA GAME LOOP ===
import javax.swing.Timer;

public class SpaceGameLoop {
    int score = 0;
    int bunkerHp = 4;
    // TODO: Create a 16 ms Timer that updates the game and awards 150 points on a hit.
}
`,
    },
    solution: {
      javascript: `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const ship = { x: 182, y: 355, width: 36, height: 22 };
const aliens = Array.from({ length: 6 }, (_, column) => ({
  x: 45 + column * 52, y: 40, width: 28, height: 20, alive: true
}));
const lasers = [];
const bunkers = [{ x: 90, y: 320, width: 60, height: 16, hp: 4 }];
let score = 0;
let gameOver = false;

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') ship.x = Math.max(0, ship.x - 12);
  if (event.key === 'ArrowRight') ship.x = Math.min(canvas.width - ship.width, ship.x + 12);
  if (event.key === ' ') lasers.push({ x: ship.x + 16, y: ship.y, width: 4, height: 12, vy: -8, active: true });
});

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}

function gameLoop() {
  if (gameOver) return;
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const alien of aliens) {
    if (!alien.alive) continue;
    alien.y += 0.04;
    if (alien.y + alien.height >= ship.y) gameOver = true;
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
  }

  for (const laser of lasers) {
    if (!laser.active) continue;
    laser.y += laser.vy;
    if (laser.y < 0) laser.active = false;
    for (const bunker of bunkers) {
      if (bunker.hp > 0 && overlaps(laser, bunker)) {
        bunker.hp -= 1;
        laser.active = false;
      }
    }
    for (const alien of aliens) {
      if (laser.active && alien.alive && overlaps(laser, alien)) {
        alien.alive = false;
        laser.active = false;
        score += 150;
      }
    }
    if (laser.active) {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    }
  }

  for (const bunker of bunkers) {
    if (bunker.hp > 0) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(bunker.x, bunker.y, bunker.width, bunker.height);
    }
  }
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
  ctx.font = 'bold 15px monospace';
  ctx.fillText('SCORE: ' + score, 16, 44);
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
      python: `score = 0
bunkers = [{'hp': 4}]
def update_game():
    global score
    alien_hit = True
    bunker_hit = True
    if alien_hit:
        score += 150
    if bunker_hit and bunkers[0]['hp'] > 0:
        bunkers[0]['hp'] -= 1
    print(f"Game Loop Running | Score: {score}")

update_game()
`,
      java: `import javax.swing.Timer;

public class SpaceGameLoop {
    int score = 0;
    int bunkerHp = 4;
    Timer timer = new Timer(16, event -> {
        boolean alienHit = true;
        boolean bunkerHit = true;
        if (alienHit) score += 150;
        if (bunkerHit && bunkerHp > 0) bunkerHp--;
        System.out.println("SCORE: " + score);
    });
}
`,
    },
    hints: [
      'In JavaScript, call requestAnimationFrame(gameLoop) after updating and drawing each frame. Move a laser with laser.y += laser.vy.',
      'In JavaScript, test overlapping rectangles; mark a hit alien inactive and add 150 to score. Decrease bunker hp on a bunker hit.',
      'In Python, update score inside update_game and reduce bunker hp only while it is above zero.',
      'In Java, a Timer(16, ...) runs an update about every 16 ms; change score and bunkerHp inside its callback.',
    ],
    tests: [
      {
        id: 'test-game-loop',
        name: 'Game Loop Animation',
        description: 'Ensure requestAnimationFrame or Timer runs the continuous simulation.',
        hint: 'Use requestAnimationFrame(gameLoop) or Timer.',
        check: (code) => {
          const passed = code.includes('requestAnimationFrame(gameLoop)') || code.includes('new Timer(') || code.includes('update_game()');
          return { passed, message: passed ? 'Continuous 60 FPS game loop operational.' : 'requestAnimationFrame call missing.' };
        },
      },
      {
        id: 'test-score-counter',
        name: 'Score Counter System',
        description: 'Verify score tracking is updated on game events.',
        hint: 'Declare score variable and render score readout.',
        check: (code) => {
          const passed = /score\s*\+=\s*150/.test(code);
          return { passed, message: passed ? 'Score tracking verified.' : 'Score counter variable missing.' };
        },
      },
      {
        id: 'test-bunker-damage',
        name: 'Bunker Damage',
        description: 'Verify a projectile can reduce a bunker’s hit points.',
        hint: 'Decrease the bunker hp when it is hit.',
        check: (code) => {
          const passed = /(?:bunker\.hp|bunkers\[0\]\[['"]hp['"]\])\s*-=\s*1|bunkerHp--/.test(code);
          return { passed, message: passed ? 'Bunker damage is implemented.' : 'Bunker hit points never decrease.' };
        },
      },
    ],
  },
];
