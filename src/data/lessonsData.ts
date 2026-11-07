import { LessonStep } from '../types/lesson';

export const LESSONS: LessonStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Initializing Canvas & Player Sprite',
    subtitle: 'Step 1: Setting up the 2D rendering grid and drawing the Neon Hero',
    description: `Welcome to **Neon Dungeon: Rogue Crawler**! In this first step, you will initialize the 2D rendering canvas, establish world coordinates, and render your player hero—a glowing cyan knight sprite rectangle at position (x: 180, y: 180).

Learn how 2D Graphics APIs work across **JavaScript**, **Python**, and **Java**, and observe how each language manages canvas contexts and rendering calls.`,
    concepts: [
      {
        title: '2D Screen Coordinate System',
        description: 'Computer graphics grids place origin (0, 0) at the top-left corner. Increasing X moves right, and increasing Y moves down.',
        diagramType: 'canvas-coords',
        codeSnippet: {
          javascript: `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
// Clear canvas background
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, canvas.width, canvas.height);`,
          python: `import canvas

# Setup 2D Surface
ctx = canvas.get_context('2d')
ctx.fill_style = '#0f172a'
ctx.fill_rect(0, 0, 400, 400)`,
          java: `import java.awt.Graphics2D;
import java.awt.Color;

public void paintComponent(Graphics2D g2d) {
    g2d.setColor(new Color(15, 23, 42));
    g2d.fillRect(0, 0, 400, 400);
}`,
        },
      },
      {
        title: 'Player Entity Properties',
        description: 'An entity in 2D games is defined by positional coordinates (x, y), dimensions (width, height), and visual color attributes.',
        codeSnippet: {
          javascript: `const player = {
  x: 180,
  y: 180,
  width: 32,
  height: 32,
  color: '#00f3ff' // Cyber Cyan
};`,
          python: `player = {
    'x': 180,
    'y': 180,
    'width': 32,
    'height': 32,
    'color': '#00f3ff'
}`,
          java: `public class Player {
    int x = 180;
    int y = 180;
    int width = 32;
    int height = 32;
    Color color = Color.CYAN;
}`,
        },
      },
    ],
    codeBoilerplate: {
      javascript: `// PolyGlot Arcade - Step 1: Canvas & Hero Sprite (JavaScript)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// TODO 1: Define the Player object with x: 180, y: 180, width: 32, height: 32, color: '#00f3ff'
const player = {
  // Add player properties here
};

function render() {
  // Clear the screen background (slate-950)
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // TODO 2: Set fillStyle to player.color and draw the player rectangle using ctx.fillRect()
  
  
  // Render HUD status
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillText('Neon Rogue: Online', 16, 28);
}

render();
console.log('Step 1 initialized: Player sprite rendered!');
`,
      python: `# PolyGlot Arcade - Step 1: Canvas & Hero Sprite (Python)
import canvas

ctx = canvas.get_context('2d')

# TODO 1: Define player dictionary with x: 180, y: 180, width: 32, height: 32, color: '#00f3ff'
player = {
    # Add player properties here
}

def render():
    # Clear screen with dark background
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    
    # TODO 2: Set ctx.fill_style to player['color'] and call ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])
    
    
    # Draw status label
    ctx.fill_style = '#94a3b8'
    ctx.draw_text('Neon Rogue: Online', 16, 28)

render()
print("Python Step 1 initialized: Hero active!")
`,
      java: `// PolyGlot Arcade - Step 1: Canvas & Hero Sprite (Java)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Font;

public class NeonDungeonGame {
    // TODO 1: Declare player position fields x = 180, y = 180, width = 32, height = 32
    private int playerX = 180;
    private int playerY = 180;
    private int playerSize = 32;

    public void paintComponent(Graphics2D g2d) {
        // Clear background
        g2d.setColor(new Color(2, 6, 23));
        g2d.fillRect(0, 0, 400, 400);

        // TODO 2: Set color to Cyan (Color.CYAN) and fill rect for player
        
        
        // Draw HUD status
        g2d.setColor(new Color(148, 163, 184));
        g2d.setFont(new Font("Monospaced", Font.BOLD, 14));
        g2d.drawString("Neon Rogue (Java): Online", 16, 28);
    }
}
`,
    },
    solution: {
      javascript: `// PolyGlot Arcade - Step 1: Canvas & Hero Sprite (JavaScript Solution)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 180,
  y: 180,
  width: 32,
  height: 32,
  color: '#00f3ff'
};

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw glowing hero box
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Inner core glow
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(player.x + 8, player.y + 8, player.width - 16, player.height - 16);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillText('Neon Rogue: Online', 16, 28);
}

render();
console.log('Step 1 initialized: Player sprite rendered!');
`,
      python: `# PolyGlot Arcade - Step 1: Canvas & Hero Sprite (Python Solution)
import canvas

ctx = canvas.get_context('2d')

player = {
    'x': 180,
    'y': 180,
    'width': 32,
    'height': 32,
    'color': '#00f3ff'
}

def render():
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    
    ctx.fill_style = player['color']
    ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])
    
    ctx.fill_style = '#94a3b8'
    ctx.draw_text('Neon Rogue: Online', 16, 28)

render()
print("Python Step 1 initialized: Hero active!")
`,
      java: `// PolyGlot Arcade - Step 1: Canvas & Hero Sprite (Java Solution)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Font;

public class NeonDungeonGame {
    private int playerX = 180;
    private int playerY = 180;
    private int playerSize = 32;

    public void paintComponent(Graphics2D g2d) {
        g2d.setColor(new Color(2, 6, 23));
        g2d.fillRect(0, 0, 400, 400);

        g2d.setColor(Color.CYAN);
        g2d.fillRect(playerX, playerY, playerSize, playerSize);
        
        g2d.setColor(Color.WHITE);
        g2d.fillRect(playerX + 8, playerY + 8, playerSize - 16, playerSize - 16);

        g2d.setColor(new Color(148, 163, 184));
        g2d.setFont(new Font("Monospaced", Font.BOLD, 14));
        g2d.drawString("Neon Rogue (Java): Online", 16, 28);
    }
}
`,
    },
    hints: [
      'Ensure the player object or variables have x set to 180 and y set to 180.',
      'In JavaScript, use `ctx.fillStyle = player.color` and `ctx.fillRect(player.x, player.y, player.width, player.height)`.',
      'In Python, set `ctx.fill_style = player["color"]` and call `ctx.fill_rect(player["x"], player["y"], player["width"], player["height"])`.',
      'In Java, set `g2d.setColor(Color.CYAN)` and call `g2d.fillRect(playerX, playerY, playerSize, playerSize)`.',
    ],
    tests: [
      {
        id: 'step1-test-1',
        name: 'Player Position Defined',
        description: 'Verify player coordinates x: 180 and y: 180 are declared.',
        hint: 'Check that player x and y variables or object keys exist and equal 180.',
        check: (code: string) => {
          const hasX = /x\s*[:=]\s*180/i.test(code) || /playerX\s*=\s*180/i.test(code);
          const hasY = /y\s*[:=]\s*180/i.test(code) || /playerY\s*=\s*180/i.test(code);
          if (hasX && hasY) {
            return { passed: true, message: 'Player coordinates (180, 180) configured successfully!' };
          }
          return { passed: false, message: 'Missing player position definition (x: 180, y: 180).' };
        },
      },
      {
        id: 'step1-test-2',
        name: 'Player Draw Method Invoked',
        description: 'Check that fillRect or fill_rect is called to render the sprite.',
        hint: 'Use `fillRect(player.x, player.y, ...)` or equivalent in your language.',
        check: (code: string) => {
          const drawCalled = /fillRect|fill_rect|drawRect/i.test(code);
          if (drawCalled) {
            return { passed: true, message: 'Player draw method verified on 2D canvas context!' };
          }
          return { passed: false, message: 'Canvas draw call (fillRect / fill_rect) not detected.' };
        },
      },
    ],
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Keyboard Controls & Vector Movement',
    subtitle: 'Step 2: Processing WASD / Arrow key inputs and updating movement vectors',
    description: `Now that our hero is rendered, let's give the player movement capabilities! 

In this step, you will capture keydown/keyup events (or key states), update velocity vectors (\`vx\`, \`vy\`), and update position on each frame (\`x += vx\`, \`y += vy\`). You will also enforce screen boundary constraints so the player doesn't wander off grid.`,
    concepts: [
      {
        title: 'Velocity Vector Physics',
        description: 'Character movement in games uses velocity vectors (vx, vy). Direction keys set velocity, which is then added to position coordinates each frame.',
        diagramType: 'velocity-vector',
        codeSnippet: {
          javascript: `// Update position by velocity
player.x += player.vx;
player.y += player.vy;

// Screen boundary collision check
if (player.x < 0) player.x = 0;
if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;`,
          python: `player['x'] += player['vx']
player['y'] += player['vy']

# Clamp to canvas boundaries
player['x'] = max(0, min(player['x'], 400 - player['width']))`,
          java: `playerX += vx;
playerY += vy;

// Boundary check
if (playerX < 0) playerX = 0;
if (playerX > 400 - playerSize) playerX = 400 - playerSize;`,
        },
      },
      {
        title: 'Keyboard Event Handling',
        description: 'Listen to key presses (Arrow keys / WASD) to mutate velocity vectors smoothly.',
        codeSnippet: {
          javascript: `window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') player.vy = -speed;
  if (e.key === 'ArrowDown' || e.key === 's') player.vy = speed;
  if (e.key === 'ArrowLeft' || e.key === 'a') player.vx = -speed;
  if (e.key === 'ArrowRight' || e.key === 'd') player.vx = speed;
});`,
          python: `def handle_key_down(key):
    if key in ['ArrowUp', 'w']: player['vy'] = -speed
    if key in ['ArrowDown', 's']: player['vy'] = speed
    if key in ['ArrowLeft', 'a']: player['vx'] = -speed
    if key in ['ArrowRight', 'd']: player['vx'] = speed`,
          java: `public void keyPressed(KeyEvent e) {
    int key = e.getKeyCode();
    if (key == KeyEvent.VK_W || key == KeyEvent.VK_UP) vy = -speed;
    if (key == KeyEvent.VK_S || key == KeyEvent.VK_DOWN) vy = speed;
    if (key == KeyEvent.VK_A || key == KeyEvent.VK_LEFT) vx = -speed;
    if (key == KeyEvent.VK_D || key == KeyEvent.VK_RIGHT) vx = speed;
}`,
        },
      },
    ],
    codeBoilerplate: {
      javascript: `// PolyGlot Arcade - Step 2: Keyboard Controls & Movement (JavaScript)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const speed = 4;
const player = {
  x: 180,
  y: 180,
  width: 32,
  height: 32,
  vx: 0,
  vy: 0,
  color: '#00f3ff'
};

const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  // Reset velocity
  player.vx = 0;
  player.vy = 0;

  // TODO 1: Update vx and vy based on pressed keys (w, a, s, d or Arrow keys)
  if (keys['ArrowUp'] || keys['w']) player.vy = -speed;
  if (keys['ArrowDown'] || keys['s']) player.vy = speed;
  // Add left and right movement here
  
  
  // TODO 2: Update position: player.x += player.vx and player.y += player.vy
  
  
  // Boundary clamping (0 to canvas limit)
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
}

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillText('Move with WASD / Arrow Keys', 16, 28);
  ctx.fillText(\`Pos: (\${player.x}, \${player.y})\`, 16, 50);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Step 2: Physics update loop listening for arrow keys');
`,
      python: `# PolyGlot Arcade - Step 2: Keyboard Controls & Movement (Python)
import canvas

speed = 4
player = {
    'x': 180,
    'y': 180,
    'width': 32,
    'height': 32,
    'vx': 0,
    'vy': 0,
    'color': '#00f3ff'
}

keys = {}

def on_key_down(key):
    keys[key] = True

def on_key_up(key):
    keys[key] = False

def update():
    player['vx'] = 0
    player['vy'] = 0
    
    # TODO 1: Set player['vy'] and player['vx'] according to pressed keys
    if keys.get('ArrowUp') or keys.get('w'): player['vy'] = -speed
    if keys.get('ArrowDown') or keys.get('s'): player['vy'] = speed
    if keys.get('ArrowLeft') or keys.get('a'): player['vx'] = -speed
    if keys.get('ArrowRight') or keys.get('d'): player['vx'] = speed

    # TODO 2: Update player position (x += vx, y += vy)
    player['x'] += player['vx']
    player['y'] += player['vy']
    
    # Clamp bounds
    player['x'] = max(0, min(player['x'], 400 - player['width']))
    player['y'] = max(0, min(player['y'], 400 - player['height']))

def render():
    ctx = canvas.get_context('2d')
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    
    ctx.fill_style = player['color']
    ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])
    
    ctx.fill_style = '#94a3b8'
    ctx.draw_text('Move with WASD / Arrow Keys', 16, 28)

def game_loop():
    update()
    render()

print("Python Step 2 ready for keyboard movement!")
`,
      java: `// PolyGlot Arcade - Step 2: Keyboard Controls & Movement (Java)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Font;
import java.awt.event.KeyEvent;

public class NeonDungeonGame {
    private int x = 180;
    private int y = 180;
    private int vx = 0;
    private int vy = 0;
    private int speed = 4;
    private int size = 32;

    public void update() {
        // TODO 1: Update position with velocity vector
        x += vx;
        y += vy;

        // TODO 2: Clamp boundaries
        if (x < 0) x = 0;
        if (x > 400 - size) x = 400 - size;
        if (y < 0) y = 0;
        if (y > 400 - size) y = 400 - size;
    }

    public void keyPressed(int keyCode) {
        if (keyCode == KeyEvent.VK_W || keyCode == KeyEvent.VK_UP) vy = -speed;
        if (keyCode == KeyEvent.VK_S || keyCode == KeyEvent.VK_DOWN) vy = speed;
        if (keyCode == KeyEvent.VK_A || keyCode == KeyEvent.VK_LEFT) vx = -speed;
        if (keyCode == KeyEvent.VK_D || keyCode == KeyEvent.VK_RIGHT) vx = speed;
    }

    public void keyReleased(int keyCode) {
        if (keyCode == KeyEvent.VK_W || keyCode == KeyEvent.VK_S || keyCode == KeyEvent.VK_UP || keyCode == KeyEvent.VK_DOWN) vy = 0;
        if (keyCode == KeyEvent.VK_A || keyCode == KeyEvent.VK_D || keyCode == KeyEvent.VK_LEFT || keyCode == KeyEvent.VK_RIGHT) vx = 0;
    }

    public void paintComponent(Graphics2D g2d) {
        g2d.setColor(new Color(2, 6, 23));
        g2d.fillRect(0, 0, 400, 400);

        g2d.setColor(Color.CYAN);
        g2d.fillRect(x, y, size, size);

        g2d.setColor(new Color(148, 163, 184));
        g2d.drawString("WASD Movement Active (Java)", 16, 28);
    }
}
`,
    },
    solution: {
      javascript: `// PolyGlot Arcade - Step 2: Keyboard Controls & Movement (JavaScript Solution)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const speed = 4;
const player = {
  x: 180,
  y: 180,
  width: 32,
  height: 32,
  vx: 0,
  vy: 0,
  color: '#00f3ff'
};

const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  player.vx = 0;
  player.vy = 0;

  if (keys['ArrowUp'] || keys['w']) player.vy = -speed;
  if (keys['ArrowDown'] || keys['s']) player.vy = speed;
  if (keys['ArrowLeft'] || keys['a']) player.vx = -speed;
  if (keys['ArrowRight'] || keys['d']) player.vx = speed;

  player.x += player.vx;
  player.y += player.vy;

  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
}

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillText('Move with WASD / Arrow Keys', 16, 28);
  ctx.fillText(\`Pos: (\${player.x}, \${player.y})\`, 16, 50);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Step 2: Physics update loop listening for arrow keys');
`,
      python: `# PolyGlot Arcade - Step 2: Keyboard Controls & Movement (Python Solution)
import canvas

speed = 4
player = {
    'x': 180,
    'y': 180,
    'width': 32,
    'height': 32,
    'vx': 0,
    'vy': 0,
    'color': '#00f3ff'
}

keys = {}

def on_key_down(key):
    keys[key] = True

def on_key_up(key):
    keys[key] = False

def update():
    player['vx'] = 0
    player['vy'] = 0
    
    if keys.get('ArrowUp') or keys.get('w'): player['vy'] = -speed
    if keys.get('ArrowDown') or keys.get('s'): player['vy'] = speed
    if keys.get('ArrowLeft') or keys.get('a'): player['vx'] = -speed
    if keys.get('ArrowRight') or keys.get('d'): player['vx'] = speed

    player['x'] += player['vx']
    player['y'] += player['vy']
    
    player['x'] = max(0, min(player['x'], 400 - player['width']))
    player['y'] = max(0, min(player['y'], 400 - player['height']))

def render():
    ctx = canvas.get_context('2d')
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    
    ctx.fill_style = player['color']
    ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])
    
    ctx.fill_style = '#94a3b8'
    ctx.draw_text('Move with WASD / Arrow Keys', 16, 28)

def game_loop():
    update()
    render()

print("Python Step 2 ready for keyboard movement!")
`,
      java: `// PolyGlot Arcade - Step 2: Keyboard Controls & Movement (Java Solution)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Font;
import java.awt.event.KeyEvent;

public class NeonDungeonGame {
    private int x = 180;
    private int y = 180;
    private int vx = 0;
    private int vy = 0;
    private int speed = 4;
    private int size = 32;

    public void update() {
        x += vx;
        y += vy;

        if (x < 0) x = 0;
        if (x > 400 - size) x = 400 - size;
        if (y < 0) y = 0;
        if (y > 400 - size) y = 400 - size;
    }

    public void keyPressed(int keyCode) {
        if (keyCode == KeyEvent.VK_W || keyCode == KeyEvent.VK_UP) vy = -speed;
        if (keyCode == KeyEvent.VK_S || keyCode == KeyEvent.VK_DOWN) vy = speed;
        if (keyCode == KeyEvent.VK_A || keyCode == KeyEvent.VK_LEFT) vx = -speed;
        if (keyCode == KeyEvent.VK_D || keyCode == KeyEvent.VK_RIGHT) vx = speed;
    }

    public void keyReleased(int keyCode) {
        if (keyCode == KeyEvent.VK_W || keyCode == KeyEvent.VK_S || keyCode == KeyEvent.VK_UP || keyCode == KeyEvent.VK_DOWN) vy = 0;
        if (keyCode == KeyEvent.VK_A || keyCode == KeyEvent.VK_D || keyCode == KeyEvent.VK_LEFT || keyCode == KeyEvent.VK_RIGHT) vx = 0;
    }

    public void paintComponent(Graphics2D g2d) {
        g2d.setColor(new Color(2, 6, 23));
        g2d.fillRect(0, 0, 400, 400);

        g2d.setColor(Color.CYAN);
        g2d.fillRect(x, y, size, size);

        g2d.setColor(new Color(148, 163, 184));
        g2d.drawString("WASD Movement Active (Java)", 16, 28);
    }
}
`,
    },
    hints: [
      'In JavaScript, make sure `player.x += player.vx` and `player.y += player.vy` are included in your update loop.',
      'Check left and right movement: setting `vx = -speed` for left and `vx = speed` for right.',
      'Ensure boundary constraints prevent coordinates from exceeding `canvas.width` or 400px.',
    ],
    tests: [
      {
        id: 'step2-test-1',
        name: 'Velocity Vectors Configured',
        description: 'Verify vx and vy velocity calculations exist.',
        hint: 'Ensure velocity variables (vx, vy or player.vx) are updated based on key inputs.',
        check: (code: string) => {
          const hasVx = /vx/i.test(code);
          const hasVy = /vy/i.test(code);
          if (hasVx && hasVy) {
            return { passed: true, message: 'Velocity vector components (vx, vy) detected!' };
          }
          return { passed: false, message: 'Velocity vector variables (vx, vy) not found.' };
        },
      },
      {
        id: 'step2-test-2',
        name: 'Position Delta Addition',
        description: 'Check position update statement (x += vx / y += vy).',
        hint: 'Include `player.x += player.vx` (or `x += vx`) in the update logic.',
        check: (code: string) => {
          const hasPositionUpdate = /x\s*\+=\s*(player\.)?vx/i.test(code) || /y\s*\+=\s*(player\.)?vy/i.test(code) || /player\['x'\]\s*\+=/i.test(code);
          if (hasPositionUpdate) {
            return { passed: true, message: 'Player position integration step verified!' };
          }
          return { passed: false, message: 'Missing position update statement (x += vx, y += vy).' };
        },
      },
    ],
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Wall & Obstacle Collision Detection (AABB)',
    subtitle: 'Step 3: Calculating Axis-Aligned Bounding Box (AABB) collisions against dungeon walls',
    description: `A dungeon rogue crawler isn't complete without solid dungeon walls! 

In Step 3, you will define dungeon wall obstacles and write a high-performance **AABB (Axis-Aligned Bounding Box)** collision detection function. When a collision occurs, your player will bounce back or block movement so they cannot pass through walls.`,
    concepts: [
      {
        title: 'Axis-Aligned Bounding Box (AABB) Algorithm',
        description: 'Two rectangles overlap if and only if their projections overlap on both X and Y axes.',
        diagramType: 'aabb-collision',
        codeSnippet: {
          javascript: `function checkCollision(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
}`,
          python: `def check_collision(rect_a, rect_b):
    return (
        rect_a['x'] < rect_b['x'] + rect_b['width'] and
        rect_a['x'] + rect_a['width'] > rect_b['x'] and
        rect_a['y'] < rect_b['y'] + rect_b['height'] and
        rect_a['y'] + rect_a['height'] > rect_b['y']
    )`,
          java: `public boolean checkCollision(int x1, int y1, int w1, int h1, int x2, int y2, int w2, int h2) {
    return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
}`,
        },
      },
    ],
    codeBoilerplate: {
      javascript: `// PolyGlot Arcade - Step 3: Wall Collision Detection (JavaScript)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const speed = 4;
const player = { x: 50, y: 180, width: 32, height: 32, vx: 0, vy: 0, color: '#00f3ff' };

// Neon Dungeon Walls
const walls = [
  { x: 150, y: 80, width: 24, height: 240, color: '#ef4444' },
  { x: 260, y: 160, width: 100, height: 24, color: '#ef4444' }
];

const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// TODO 1: Implement the AABB collision function
function isColliding(rect1, rect2) {
  return (
    // Fill in the 4 overlap conditions:
    // rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && ...
    false
  );
}

function update() {
  player.vx = 0; player.vy = 0;
  if (keys['ArrowUp'] || keys['w']) player.vy = -speed;
  if (keys['ArrowDown'] || keys['s']) player.vy = speed;
  if (keys['ArrowLeft'] || keys['a']) player.vx = -speed;
  if (keys['ArrowRight'] || keys['d']) player.vx = speed;

  // Try moving X
  player.x += player.vx;
  for (let wall of walls) {
    if (isColliding(player, wall)) {
      // Revert X movement on collision
      player.x -= player.vx;
    }
  }

  // Try moving Y
  player.y += player.vy;
  for (let wall of walls) {
    if (isColliding(player, wall)) {
      // Revert Y movement on collision
      player.y -= player.vy;
    }
  }
}

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Walls
  for (let wall of walls) {
    ctx.fillStyle = wall.color;
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }

  // Draw Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillText('AABB Collision Active - Blocked by Red Walls', 16, 28);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Step 3: AABB collision detection setup ready.');
`,
      python: `# PolyGlot Arcade - Step 3: Wall Collision Detection (Python)
import canvas

speed = 4
player = {'x': 50, 'y': 180, 'width': 32, 'height': 32, 'vx': 0, 'vy': 0, 'color': '#00f3ff'}

walls = [
    {'x': 150, 'y': 80, 'width': 24, 'height': 240, 'color': '#ef4444'},
    {'x': 260, 'y': 160, 'width': 100, 'height': 24, 'color': '#ef4444'}
]

keys = {}
def on_key_down(key): keys[key] = True
def on_key_up(key): keys[key] = False

# TODO 1: Implement check_collision function using AABB logic
def check_collision(rect1, rect2):
    return (
        rect1['x'] < rect2['x'] + rect2['width'] and
        rect1['x'] + rect1['width'] > rect2['x'] and
        rect1['y'] < rect2['y'] + rect2['height'] and
        rect1['y'] + rect1['height'] > rect2['y']
    )

def update():
    player['vx'] = 0
    player['vy'] = 0
    if keys.get('ArrowUp') or keys.get('w'): player['vy'] = -speed
    if keys.get('ArrowDown') or keys.get('s'): player['vy'] = speed
    if keys.get('ArrowLeft') or keys.get('a'): player['vx'] = -speed
    if keys.get('ArrowRight') or keys.get('d'): player['vx'] = speed

    player['x'] += player['vx']
    for wall in walls:
        if check_collision(player, wall):
            player['x'] -= player['vx']

    player['y'] += player['vy']
    for wall in walls:
        if check_collision(player, wall):
            player['y'] -= player['vy']

def render():
    ctx = canvas.get_context('2d')
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    for wall in walls:
        ctx.fill_style = wall['color']
        ctx.fill_rect(wall['x'], wall['y'], wall['width'], wall['height'])
    ctx.fill_style = player['color']
    ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])

print("Python Step 3 AABB collisions loaded!")
`,
      java: `// PolyGlot Arcade - Step 3: Wall Collision Detection (Java)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Rectangle;

public class NeonDungeonGame {
    private int x = 50;
    private int y = 180;
    private int vx = 0, vy = 0;
    private int size = 32;

    private Rectangle[] walls = {
        new Rectangle(150, 80, 24, 240),
        new Rectangle(260, 160, 100, 24)
    };

    // TODO 1: Implement AABB Collision detection method
    public boolean checkAABB(Rectangle a, Rectangle b) {
        return a.intersects(b);
    }

    public void update() {
        x += vx;
        Rectangle playerRect = new Rectangle(x, y, size, size);
        for (Rectangle wall : walls) {
            if (checkAABB(playerRect, wall)) {
                x -= vx;
            }
        }

        y += vy;
        playerRect = new Rectangle(x, y, size, size);
        for (Rectangle wall : walls) {
            if (checkAABB(playerRect, wall)) {
                y -= vy;
            }
        }
    }
}
`,
    },
    solution: {
      javascript: `// PolyGlot Arcade - Step 3: Wall Collision Detection (JavaScript Solution)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const speed = 4;
const player = { x: 50, y: 180, width: 32, height: 32, vx: 0, vy: 0, color: '#00f3ff' };

const walls = [
  { x: 150, y: 80, width: 24, height: 240, color: '#ef4444' },
  { x: 260, y: 160, width: 100, height: 24, color: '#ef4444' }
];

const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function update() {
  player.vx = 0; player.vy = 0;
  if (keys['ArrowUp'] || keys['w']) player.vy = -speed;
  if (keys['ArrowDown'] || keys['s']) player.vy = speed;
  if (keys['ArrowLeft'] || keys['a']) player.vx = -speed;
  if (keys['ArrowRight'] || keys['d']) player.vx = speed;

  player.x += player.vx;
  for (let wall of walls) {
    if (isColliding(player, wall)) {
      player.x -= player.vx;
    }
  }

  player.y += player.vy;
  for (let wall of walls) {
    if (isColliding(player, wall)) {
      player.y -= player.vy;
    }
  }
}

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let wall of walls) {
    ctx.fillStyle = wall.color;
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillText('AABB Collision Active - Blocked by Red Walls', 16, 28);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Step 3: AABB collision detection setup ready.');
`,
      python: `# PolyGlot Arcade - Step 3: Wall Collision Detection (Python Solution)
import canvas

speed = 4
player = {'x': 50, 'y': 180, 'width': 32, 'height': 32, 'vx': 0, 'vy': 0, 'color': '#00f3ff'}

walls = [
    {'x': 150, 'y': 80, 'width': 24, 'height': 240, 'color': '#ef4444'},
    {'x': 260, 'y': 160, 'width': 100, 'height': 24, 'color': '#ef4444'}
]

keys = {}
def on_key_down(key): keys[key] = True
def on_key_up(key): keys[key] = False

def check_collision(rect1, rect2):
    return (
        rect1['x'] < rect2['x'] + rect2['width'] and
        rect1['x'] + rect1['width'] > rect2['x'] and
        rect1['y'] < rect2['y'] + rect2['height'] and
        rect1['y'] + rect1['height'] > rect2['y']
    )

def update():
    player['vx'] = 0
    player['vy'] = 0
    if keys.get('ArrowUp') or keys.get('w'): player['vy'] = -speed
    if keys.get('ArrowDown') or keys.get('s'): player['vy'] = speed
    if keys.get('ArrowLeft') or keys.get('a'): player['vx'] = -speed
    if keys.get('ArrowRight') or keys.get('d'): player['vx'] = speed

    player['x'] += player['vx']
    for wall in walls:
        if check_collision(player, wall):
            player['x'] -= player['vx']

    player['y'] += player['vy']
    for wall in walls:
        if check_collision(player, wall):
            player['y'] -= player['vy']

def render():
    ctx = canvas.get_context('2d')
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    for wall in walls:
        ctx.fill_style = wall['color']
        ctx.fill_rect(wall['x'], wall['y'], wall['width'], wall['height'])
    ctx.fill_style = player['color']
    ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])

print("Python Step 3 AABB collisions loaded!")
`,
      java: `// PolyGlot Arcade - Step 3: Wall Collision Detection (Java Solution)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Rectangle;

public class NeonDungeonGame {
    private int x = 50;
    private int y = 180;
    private int vx = 0, vy = 0;
    private int size = 32;

    private Rectangle[] walls = {
        new Rectangle(150, 80, 24, 240),
        new Rectangle(260, 160, 100, 24)
    };

    public boolean checkAABB(Rectangle a, Rectangle b) {
        return a.intersects(b);
    }

    public void update() {
        x += vx;
        Rectangle playerRect = new Rectangle(x, y, size, size);
        for (Rectangle wall : walls) {
            if (checkAABB(playerRect, wall)) {
                x -= vx;
            }
        }

        y += vy;
        playerRect = new Rectangle(x, y, size, size);
        for (Rectangle wall : walls) {
            if (checkAABB(playerRect, wall)) {
                y -= vy;
            }
        }
    }
}
`,
    },
    hints: [
      'AABB requires checking: rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y.',
      'Make sure to test both X and Y collision axis separation so player slides along walls smoothly.',
    ],
    tests: [
      {
        id: 'step3-test-1',
        name: 'Collision Function Defined',
        description: 'Verify collision check routine exists.',
        hint: 'Implement `isColliding(rect1, rect2)` or `check_collision` or `checkAABB`.',
        check: (code: string) => {
          const hasCollisionFunc = /isColliding|check_collision|checkAABB|intersects/i.test(code);
          if (hasCollisionFunc) {
            return { passed: true, message: 'AABB Collision function definition verified!' };
          }
          return { passed: false, message: 'No collision check function (isColliding / check_collision) found.' };
        },
      },
      {
        id: 'step3-test-2',
        name: 'AABB Math Overlap Logic',
        description: 'Check 4-point bounding box overlap conditions.',
        hint: 'Ensure your collision formula tests width and height offsets for both rects.',
        check: (code: string) => {
          const hasAABBConditions = (/width/i.test(code) && /height/i.test(code)) || /intersects/i.test(code);
          if (hasAABBConditions) {
            return { passed: true, message: 'Bounding box width/height intersection logic confirmed!' };
          }
          return { passed: false, message: 'AABB overlap conditions missing width/height checks.' };
        },
      },
    ],
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Game Loop, Enemy Spawns & Score HUD',
    subtitle: 'Step 4: Assembling the complete animated Rogue Crawler loop with enemies & energy gems',
    description: `Congratulations on reaching Step 4—the culmination of your game engine!

In this final step, you will assemble the master **60 FPS Game Loop**, spawn roaming enemy chasers, collect glowing neon energy gems to increase your score (+100 PTS), and display a retro arcade HUD scoreboard. Complete this step to conquer **Neon Dungeon: Rogue Crawler**!`,
    concepts: [
      {
        title: 'Master Game Loop Architecture',
        description: 'A 60 FPS game loop separates input parsing, physics updates, and screen rendering.',
        diagramType: 'game-loop',
        codeSnippet: {
          javascript: `function gameLoop() {
  processInput();
  updateGameState();
  renderFrame();
  requestAnimationFrame(gameLoop);
}`,
          python: `def game_loop():
    while running:
        handle_events()
        update_physics()
        draw_graphics()
        clock.tick(60)`,
          java: `public void run() {
    while (running) {
        updateGame();
        repaint();
        Thread.sleep(16); // ~60 FPS
    }
}`,
        },
      },
      {
        title: 'Score & Gem Collectible Physics',
        description: 'Detect when player overlaps with energy gems, remove collected gem, and trigger particle reward.',
        codeSnippet: {
          javascript: `if (isColliding(player, gem)) {
  score += 100;
  spawnNewGem();
  playPickupSound();
}`,
          python: `if check_collision(player, gem):
    score += 100
    respawn_gem()`,
          java: `if (playerBounds.intersects(gemBounds)) {
    score += 100;
    respawnGem();
}`,
        },
      },
    ],
    codeBoilerplate: {
      javascript: `// PolyGlot Arcade - Step 4: Complete Rogue Crawler Game Engine (JavaScript)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;
const speed = 4;

const player = { x: 50, y: 180, width: 32, height: 32, vx: 0, vy: 0, color: '#00f3ff' };
const enemy = { x: 300, y: 100, width: 28, height: 28, vx: 1.5, vy: 1.5, color: '#f43f5e' };
const gem = { x: 200, y: 200, width: 20, height: 20, color: '#eab308' };

const walls = [
  { x: 150, y: 60, width: 20, height: 280, color: '#334155' }
];

const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function isColliding(r1, r2) {
  return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
}

function update() {
  if (gameOver) return;

  // 1. Player movement
  player.vx = 0; player.vy = 0;
  if (keys['ArrowUp'] || keys['w']) player.vy = -speed;
  if (keys['ArrowDown'] || keys['s']) player.vy = speed;
  if (keys['ArrowLeft'] || keys['a']) player.vx = -speed;
  if (keys['ArrowRight'] || keys['d']) player.vx = speed;

  player.x += player.vx;
  for (let w of walls) if (isColliding(player, w)) player.x -= player.vx;
  player.y += player.vy;
  for (let w of walls) if (isColliding(player, w)) player.y -= player.vy;

  // 2. Enemy Patrol Physics
  enemy.x += enemy.vx;
  enemy.y += enemy.vy;
  if (enemy.x < 180 || enemy.x > 360) enemy.vx *= -1;
  if (enemy.y < 50 || enemy.y > 330) enemy.vy *= -1;

  // TODO 1: Detect gem pickup! If player collides with gem: increase score by 100 & relocate gem
  if (isColliding(player, gem)) {
    // Add score & relocate gem
  }

  // TODO 2: Detect enemy collision! If player collides with enemy, set gameOver = true
  if (isColliding(player, enemy)) {
    // Game over condition
  }
}

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render Wall
  for (let w of walls) {
    ctx.fillStyle = w.color;
    ctx.fillRect(w.x, w.y, w.width, w.height);
  }

  // Render Gem (Gold)
  ctx.fillStyle = gem.color;
  ctx.fillRect(gem.x, gem.y, gem.width, gem.height);

  // Render Enemy (Red Skull)
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

  // Render Player (Cyan Knight)
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Scoreboard HUD
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px JetBrains Mono, monospace';
  ctx.fillText(\`SCORE: \${score} PTS\`, 16, 32);

  if (gameOver) {
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 24px JetBrains Mono, monospace';
    ctx.fillText('GAME OVER - PRESS R TO RESET', 20, 200);
  }
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Step 4: Rogue Crawler Engine Running!');
`,
      python: `# PolyGlot Arcade - Step 4: Complete Rogue Crawler Game Engine (Python)
import canvas, random

score = 0
game_over = False
player = {'x': 50, 'y': 180, 'width': 32, 'height': 32, 'vx': 0, 'vy': 0, 'color': '#00f3ff'}
enemy = {'x': 300, 'y': 100, 'width': 28, 'height': 28, 'vx': 2, 'vy': 2, 'color': '#f43f5e'}
gem = {'x': 200, 'y': 200, 'width': 20, 'height': 20, 'color': '#eab308'}

keys = {}
def on_key_down(key): keys[key] = True
def on_key_up(key): keys[key] = False

def check_collision(r1, r2):
    return (r1['x'] < r2['x'] + r2['width'] and r1['x'] + r1['width'] > r2['x'] and
            r1['y'] < r2['y'] + r2['height'] and r1['y'] + r1['height'] > r2['y'])

def update():
    global score, game_over
    if game_over: return
    
    player['vx'] = 0; player['vy'] = 0
    if keys.get('ArrowUp') or keys.get('w'): player['vy'] = -4
    if keys.get('ArrowDown') or keys.get('s'): player['vy'] = 4
    if keys.get('ArrowLeft') or keys.get('a'): player['vx'] = -4
    if keys.get('ArrowRight') or keys.get('d'): player['vx'] = 4
    
    player['x'] += player['vx']
    player['y'] += player['vy']

    # TODO 1: Gem Pickup
    if check_collision(player, gem):
        score += 100
        gem['x'] = (gem['x'] + 80) % 320 + 40
        gem['y'] = (gem['y'] + 60) % 320 + 40

    # TODO 2: Enemy collision
    if check_collision(player, enemy):
        game_over = True

def render():
    ctx = canvas.get_context('2d')
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    
    ctx.fill_style = gem['color']
    ctx.fill_rect(gem['x'], gem['y'], gem['width'], gem['height'])
    
    ctx.fill_style = enemy['color']
    ctx.fill_rect(enemy['x'], enemy['y'], enemy['width'], enemy['height'])
    
    ctx.fill_style = player['color']
    ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])
    
    ctx.fill_style = '#38bdf8'
    ctx.draw_text(f"SCORE: {score} PTS", 16, 32)

print("Python Step 4 Rogue Engine Loaded!")
`,
      java: `// PolyGlot Arcade - Step 4: Complete Rogue Crawler Game Engine (Java)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Font;
import java.awt.Rectangle;

public class NeonDungeonGame {
    private int score = 0;
    private boolean gameOver = false;

    private Rectangle player = new Rectangle(50, 180, 32, 32);
    private Rectangle enemy = new Rectangle(300, 100, 28, 28);
    private Rectangle gem = new Rectangle(200, 200, 20, 20);

    public void update() {
        if (gameOver) return;

        // TODO 1: Check Gem Pickup
        if (player.intersects(gem)) {
            score += 100;
            gem.x = (gem.x + 90) % 300 + 50;
        }

        // TODO 2: Check Enemy Collision
        if (player.intersects(enemy)) {
            gameOver = true;
        }
    }

    public void paintComponent(Graphics2D g2d) {
        g2d.setColor(new Color(2, 6, 23));
        g2d.fillRect(0, 0, 400, 400);

        // Draw Gem
        g2d.setColor(Color.YELLOW);
        g2d.fillRect(gem.x, gem.y, gem.width, gem.height);

        // Draw Enemy
        g2d.setColor(Color.RED);
        g2d.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Draw Player
        g2d.setColor(Color.CYAN);
        g2d.fillRect(player.x, player.y, player.width, player.height);

        // Draw Score HUD
        g2d.setColor(new Color(56, 189, 248));
        g2d.setFont(new Font("Monospaced", Font.BOLD, 16));
        g2d.drawString("SCORE: " + score + " PTS", 16, 32);
    }
}
`,
    },
    solution: {
      javascript: `// PolyGlot Arcade - Step 4: Complete Rogue Crawler Game Engine (JavaScript Solution)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;
const speed = 4;

const player = { x: 50, y: 180, width: 32, height: 32, vx: 0, vy: 0, color: '#00f3ff' };
const enemy = { x: 300, y: 100, width: 28, height: 28, vx: 1.5, vy: 1.5, color: '#f43f5e' };
const gem = { x: 200, y: 200, width: 20, height: 20, color: '#eab308' };

const walls = [
  { x: 150, y: 60, width: 20, height: 280, color: '#334155' }
];

const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === 'r' || e.key === 'R') {
    score = 0;
    gameOver = false;
    player.x = 50; player.y = 180;
  }
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

function isColliding(r1, r2) {
  return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
}

function update() {
  if (gameOver) return;

  player.vx = 0; player.vy = 0;
  if (keys['ArrowUp'] || keys['w']) player.vy = -speed;
  if (keys['ArrowDown'] || keys['s']) player.vy = speed;
  if (keys['ArrowLeft'] || keys['a']) player.vx = -speed;
  if (keys['ArrowRight'] || keys['d']) player.vx = speed;

  player.x += player.vx;
  for (let w of walls) if (isColliding(player, w)) player.x -= player.vx;
  player.y += player.vy;
  for (let w of walls) if (isColliding(player, w)) player.y -= player.vy;

  enemy.x += enemy.vx;
  enemy.y += enemy.vy;
  if (enemy.x < 180 || enemy.x > 360) enemy.vx *= -1;
  if (enemy.y < 50 || enemy.y > 330) enemy.vy *= -1;

  if (isColliding(player, gem)) {
    score += 100;
    gem.x = (gem.x + 90) % 300 + 40;
    gem.y = (gem.y + 70) % 300 + 40;
  }

  if (isColliding(player, enemy)) {
    gameOver = true;
  }
}

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let w of walls) {
    ctx.fillStyle = w.color;
    ctx.fillRect(w.x, w.y, w.width, w.height);
  }

  ctx.fillStyle = gem.color;
  ctx.fillRect(gem.x, gem.y, gem.width, gem.height);

  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px JetBrains Mono, monospace';
  ctx.fillText(\`SCORE: \${score} PTS\`, 16, 32);

  if (gameOver) {
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px JetBrains Mono, monospace';
    ctx.fillText('GAME OVER - PRESS R TO RESTART', 30, 200);
  }
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Step 4: Rogue Crawler Engine Running!');
`,
      python: `# PolyGlot Arcade - Step 4: Complete Rogue Crawler Game Engine (Python Solution)
import canvas, random

score = 0
game_over = False
player = {'x': 50, 'y': 180, 'width': 32, 'height': 32, 'vx': 0, 'vy': 0, 'color': '#00f3ff'}
enemy = {'x': 300, 'y': 100, 'width': 28, 'height': 28, 'vx': 2, 'vy': 2, 'color': '#f43f5e'}
gem = {'x': 200, 'y': 200, 'width': 20, 'height': 20, 'color': '#eab308'}

keys = {}
def on_key_down(key): keys[key] = True
def on_key_up(key): keys[key] = False

def check_collision(r1, r2):
    return (r1['x'] < r2['x'] + r2['width'] and r1['x'] + r1['width'] > r2['x'] and
            r1['y'] < r2['y'] + r2['height'] and r1['y'] + r1['height'] > r2['y'])

def update():
    global score, game_over
    if game_over: return
    
    player['vx'] = 0; player['vy'] = 0
    if keys.get('ArrowUp') or keys.get('w'): player['vy'] = -4
    if keys.get('ArrowDown') or keys.get('s'): player['vy'] = 4
    if keys.get('ArrowLeft') or keys.get('a'): player['vx'] = -4
    if keys.get('ArrowRight') or keys.get('d'): player['vx'] = 4
    
    player['x'] += player['vx']
    player['y'] += player['vy']

    if check_collision(player, gem):
        score += 100
        gem['x'] = (gem['x'] + 80) % 320 + 40
        gem['y'] = (gem['y'] + 60) % 320 + 40

    if check_collision(player, enemy):
        game_over = True

def render():
    ctx = canvas.get_context('2d')
    ctx.fill_style = '#020617'
    ctx.fill_rect(0, 0, 400, 400)
    
    ctx.fill_style = gem['color']
    ctx.fill_rect(gem['x'], gem['y'], gem['width'], gem['height'])
    
    ctx.fill_style = enemy['color']
    ctx.fill_rect(enemy['x'], enemy['y'], enemy['width'], enemy['height'])
    
    ctx.fill_style = player['color']
    ctx.fill_rect(player['x'], player['y'], player['width'], player['height'])
    
    ctx.fill_style = '#38bdf8'
    ctx.draw_text(f"SCORE: {score} PTS", 16, 32)

print("Python Step 4 Rogue Engine Loaded!")
`,
      java: `// PolyGlot Arcade - Step 4: Complete Rogue Crawler Game Engine (Java Solution)
import java.awt.Graphics2D;
import java.awt.Color;
import java.awt.Font;
import java.awt.Rectangle;

public class NeonDungeonGame {
    private int score = 0;
    private boolean gameOver = false;

    private Rectangle player = new Rectangle(50, 180, 32, 32);
    private Rectangle enemy = new Rectangle(300, 100, 28, 28);
    private Rectangle gem = new Rectangle(200, 200, 20, 20);

    public void update() {
        if (gameOver) return;

        if (player.intersects(gem)) {
            score += 100;
            gem.x = (gem.x + 90) % 300 + 50;
        }

        if (player.intersects(enemy)) {
            gameOver = true;
        }
    }

    public void paintComponent(Graphics2D g2d) {
        g2d.setColor(new Color(2, 6, 23));
        g2d.fillRect(0, 0, 400, 400);

        g2d.setColor(Color.YELLOW);
        g2d.fillRect(gem.x, gem.y, gem.width, gem.height);

        g2d.setColor(Color.RED);
        g2d.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        g2d.setColor(Color.CYAN);
        g2d.fillRect(player.x, player.y, player.width, player.height);

        g2d.setColor(new Color(56, 189, 248));
        g2d.setFont(new Font("Monospaced", Font.BOLD, 16));
        g2d.drawString("SCORE: " + score + " PTS", 16, 32);
    }
}
`,
    },
    hints: [
      'Detect gem collision with `if (isColliding(player, gem))` or `player.intersects(gem)`.',
      'Increase `score += 100` and change gem coordinates.',
      'Check enemy collision to set `gameOver = true`.',
    ],
    tests: [
      {
        id: 'step4-test-1',
        name: 'Score Counter & Gem Pickup',
        description: 'Verify score addition logic when collecting gems.',
        hint: 'Increase score by adding `score += 100` (or `score = score + 100`) on collision.',
        check: (code: string) => {
          const hasScore = /score\s*(\+=|\=)\s*/i.test(code);
          if (hasScore) {
            return { passed: true, message: 'Score calculation routine verified!' };
          }
          return { passed: false, message: 'Missing score increment logic (score += 100).' };
        },
      },
      {
        id: 'step4-test-2',
        name: 'Enemy Collision / Game Over Condition',
        description: 'Check game over or enemy collision check.',
        hint: 'Test enemy collision and toggle `gameOver = true`.',
        check: (code: string) => {
          const hasGameOver = /gameOver\s*=\s*true|game_over\s*=\s*True/i.test(code) || /enemy/i.test(code);
          if (hasGameOver) {
            return { passed: true, message: 'Enemy collision and game over state registered!' };
          }
          return { passed: false, message: 'Missing enemy collision / game over trigger.' };
        },
      },
    ],
  },
];
