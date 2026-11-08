import { GameDefinition, GameEngineStrategy } from '../types/game';
import { DifficultyLevel, LessonStep } from '../types/lesson';

const engine: GameEngineStrategy = {
  createInitialState() {
    return {
      player: { x: 200, y: 200, radius: 12 },
      enemies: [] as { x: number; y: number }[],
      orbs: [] as { x: number; y: number }[],
      tick: 0, score: 0, lives: 3, invulnerable: 0,
    };
  },
  update(state, keys, stepId, difficulty, hooks) {
    if (state.lives <= 0) {
      if (keys.r || keys.R) {
        state.player.x = 200; state.player.y = 200;
        state.enemies = []; state.orbs = []; state.score = 0;
        state.lives = 3; state.tick = 0; state.invulnerable = 0;
      }
      return;
    }
    state.tick++;
    const dx = Number(Boolean(keys.ArrowRight || keys.d || keys.D)) - Number(Boolean(keys.ArrowLeft || keys.a || keys.A));
    const dy = Number(Boolean(keys.ArrowDown || keys.s || keys.S)) - Number(Boolean(keys.ArrowUp || keys.w || keys.W));
    const distance = Math.hypot(dx, dy) || 1;
    const speed = 2.8 * difficulty.speedMult;
    state.player.x = Math.max(14, Math.min(386, state.player.x + dx / distance * speed));
    state.player.y = Math.max(14, Math.min(386, state.player.y + dy / distance * speed));
    if (stepId === 'step-1') return;

    const interval = Math.max(28, Math.round(95 / (difficulty.hazardSpeedMult || 1)));
    if (state.tick % interval === 0 && state.enemies.length < 18) {
      const edge = (Math.floor(state.tick / interval) - 1) % 4;
      const position = 30 + ((state.tick * 73) % 340);
      state.enemies.push({ x: edge === 0 ? 4 : edge === 1 ? 396 : position, y: edge === 2 ? 4 : edge === 3 ? 396 : position });
    }
    if (state.invulnerable > 0) state.invulnerable--;
    for (const enemy of state.enemies) {
      const ex = state.player.x - enemy.x;
      const ey = state.player.y - enemy.y;
      const length = Math.hypot(ex, ey) || 1;
      enemy.x += ex / length * (0.9 * (difficulty.hazardSpeedMult || 1));
      enemy.y += ey / length * (0.9 * (difficulty.hazardSpeedMult || 1));
      if (length < 20 && state.invulnerable === 0) {
        state.lives--; state.invulnerable = 90;
        hooks.playCollision();
      }
    }
    if (stepId !== 'step-3') return;
    if (state.tick % 145 === 0 && state.orbs.length < 4) {
      state.orbs.push({ x: 35 + (state.tick * 31) % 330, y: 35 + (state.tick * 47) % 330 });
    }
    for (let i = state.orbs.length - 1; i >= 0; i--) {
      if (Math.hypot(state.player.x - state.orbs[i].x, state.player.y - state.orbs[i].y) < 20) {
        state.orbs.splice(i, 1); state.score += 10;
        hooks.playScore(); hooks.addXp(10, 'Energy orb collected');
      }
    }
  },
  render(ctx, state, stepId, _difficulty, languageLabel) {
    ctx.fillStyle = '#101020'; ctx.fillRect(0, 0, 400, 400);
    ctx.strokeStyle = '#243047'; ctx.lineWidth = 1;
    for (let x = 0; x <= 400; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 400); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, x); ctx.lineTo(400, x); ctx.stroke();
    }
    if (stepId !== 'step-1') {
      ctx.fillStyle = '#fb7185';
      for (const enemy of state.enemies) {
        ctx.beginPath(); ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (stepId === 'step-3') {
      ctx.fillStyle = '#facc15';
      for (const orb of state.orbs) {
        ctx.beginPath(); ctx.arc(orb.x, orb.y, 7, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (state.invulnerable % 10 < 5) {
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath(); ctx.arc(state.player.x, state.player.y, state.player.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#e2e8f0'; ctx.font = '14px monospace';
    ctx.fillText(`Lives ${state.lives}   Orbs ${state.score}`, 12, 22);
    if (state.lives <= 0) {
      ctx.fillStyle = 'rgba(2,6,23,.8)'; ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 22px sans-serif'; ctx.fillText('Run over · Press R', 92, 200);
    }
    ctx.font = '10px monospace'; ctx.fillStyle = '#94a3b8'; ctx.fillText(languageLabel, 12, 390);
  },
};

const jsStart = `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const player = { x: 200, y: 200, radius: 12 };
ctx.fillStyle = '#101020';
ctx.fillRect(0, 0, 400, 400);`;
const pyStart = `player = {'x': 200, 'y': 200, 'radius': 12}\n`;
const javaStart = `class ArenaPlayer { int x = 200, y = 200, radius = 12; }\n`;

const lessons: LessonStep[] = [
  {
    id: 'step-1', stepNumber: 1, title: 'Draw your arena hero', subtitle: 'Place a player on a 2D canvas',
    description: 'Start with a small hero at the center of a 400 × 400 arena. Use coordinates and a circle to make the player visible.',
    concepts: [{ title: 'Canvas coordinates', description: 'The center of the arena is x: 200, y: 200.', diagramType: 'canvas-coords' }],
    codeBoilerplate: {
      javascript: `${jsStart}\n// TODO: Draw the player with ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2).\n`,
      python: `${pyStart}# TODO: Print the player's center coordinates.\n`,
      java: `${javaStart}// TODO: Print the player's center coordinates.\n`,
    },
    solution: {
      javascript: `${jsStart}\nctx.fillStyle = '#67e8f9';\nctx.beginPath();\nctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);\nctx.fill();\n`,
      python: `${pyStart}print(player['x'], player['y'])\n`,
      java: `${javaStart}class ArenaDemo { public static void main(String[] args) { ArenaPlayer p = new ArenaPlayer(); System.out.println(p.x + "," + p.y); } }\n`,
    },
    hints: ['The player center is at (200, 200).', 'In JavaScript, call beginPath, arc, then fill.'],
    tests: [{ id: 'player', name: 'Player placed', description: 'Represent the hero at the arena center.', hint: 'Use the player coordinates.', check: (code) => ({ passed: /player|ArenaPlayer/.test(code) && /200/.test(code), message: 'Player coordinates checked.' }) }],
  },
  {
    id: 'step-2', stepNumber: 2, title: 'Move and evade', subtitle: 'Keyboard movement and chasing enemies',
    description: 'Move in two dimensions and keep the hero inside the arena. Enemies steer toward the player, making distance a useful game mechanic.',
    concepts: [{ title: 'Direction vectors', description: 'Combine horizontal and vertical input, then normalize the vector so diagonal movement stays fair.', diagramType: 'velocity-vector' }],
    codeBoilerplate: {
      javascript: `${jsStart}\nlet dx = 1, dy = 1;\n// TODO: Normalize movement using Math.hypot(dx, dy), then update player.x and player.y.\n`,
      python: `${pyStart}dx, dy = 1, 1\n# TODO: Normalize movement with math.hypot and update the player position.\n`,
      java: `${javaStart}class ArenaMove { // TODO: Normalize movement with Math.hypot.\n}\n`,
    },
    solution: {
      javascript: `${jsStart}\nlet dx = 1, dy = 1;\nconst length = Math.hypot(dx, dy) || 1;\nplayer.x = Math.max(12, Math.min(388, player.x + dx / length * 3));\nplayer.y = Math.max(12, Math.min(388, player.y + dy / length * 3));\n`,
      python: `import math\n${pyStart}dx, dy = 1, 1\nlength = math.hypot(dx, dy) or 1\nplayer['x'] = max(12, min(388, player['x'] + dx / length * 3))\nplayer['y'] = max(12, min(388, player['y'] + dy / length * 3))\n`,
      java: `${javaStart}class ArenaMove { static void move(ArenaPlayer player, double dx, double dy) { double length = Math.hypot(dx, dy); if (length == 0) return; player.x = Math.max(12, Math.min(388, player.x + (int)(dx / length * 3))); player.y = Math.max(12, Math.min(388, player.y + (int)(dy / length * 3))); } }\n`,
    },
    hints: ['Use Math.hypot for vector length.', 'Clamp each coordinate to the arena bounds.'],
    tests: [{ id: 'movement', name: 'Movement vector', description: 'Normalize diagonal movement.', hint: 'Use hypot.', check: (code) => ({ passed: /hypot/.test(code), message: 'Movement vector checked.' }) }],
  },
  {
    id: 'step-3', stepNumber: 3, title: 'Collect energy orbs', subtitle: 'Distance based collision and score',
    description: 'Add glowing orbs. When the hero reaches one, remove it and increase the score. The finished game combines movement, hazards, and pickups.',
    concepts: [{ title: 'Pickup collision', description: 'Two circles overlap when the distance between their centers is less than the sum of their radii.', diagramType: 'aabb-collision' }],
    codeBoilerplate: {
      javascript: `${jsStart}\nconst orb = { x: 210, y: 200, radius: 7 };\nlet score = 0;\n// TODO: Use Math.hypot to detect a pickup and add 10 points.\n`,
      python: `${pyStart}orb = {'x': 210, 'y': 200, 'radius': 7}\nscore = 0\n# TODO: Use math.hypot to detect a pickup and add 10 points.\n`,
      java: `${javaStart}class OrbScore { // TODO: Use Math.hypot to detect a pickup and add 10 points.\n}\n`,
    },
    solution: {
      javascript: `${jsStart}\nconst orb = { x: 210, y: 200, radius: 7 };\nlet score = 0;\nif (Math.hypot(player.x - orb.x, player.y - orb.y) < player.radius + orb.radius) score += 10;\nconsole.log('Score', score);\n`,
      python: `import math\n${pyStart}orb = {'x': 210, 'y': 200, 'radius': 7}\nscore = 0\nif math.hypot(player['x'] - orb['x'], player['y'] - orb['y']) < player['radius'] + orb['radius']:\n    score += 10\nprint(score)\n`,
      java: `${javaStart}class OrbScore { public static void main(String[] args) { ArenaPlayer player = new ArenaPlayer(); int orbX = 210, orbY = 200, score = 0; if (Math.hypot(player.x - orbX, player.y - orbY) < player.radius + 7) score += 10; System.out.println(score); } }\n`,
    },
    hints: ['Find the distance from the hero to the orb.', 'Compare the distance with both radii added together.'],
    tests: [{ id: 'pickup', name: 'Orb collision', description: 'Detect overlap and score.', hint: 'Use hypot and score.', check: (code) => ({ passed: /hypot/.test(code) && /score/.test(code), message: 'Pickup scoring checked.' }) }],
  },
];

export const arenaSurvivorGame: GameDefinition = {
  id: 'arena-survivor', title: 'Pulse Arena: Survivor', subtitle: 'Dodge enemies and collect energy',
  catalogOrder: 20,
  genre: 'Arena survival', tagline: 'Move, dodge, and collect orbs to build your score.',
  description: 'Build an original arena survival game while learning movement vectors, pursuit, and pickup collision.',
  story: 'A training drone is trapped in a glowing arena. Collect energy while avoiding the approaching sentries.',
  objective: 'Stay alive and collect energy orbs for points.',
  controlsTip: 'Move with WASD or Arrow keys. Press R to restart after a run.',
  badge: '⚡', accentColor: '#67e8f9', lessons, engine,
  getDifficultyParams: (level: DifficultyLevel) => ({ speedMult: 1, hazardSpeedMult: 0.7 + level * 0.2, label: `Level ${level}: ${level < 3 ? 'Warm up' : level < 5 ? 'Survival' : 'Rush'}`, color: 'text-cyan-300' }),
  canvas: { width: 400, height: 400 },
  inputKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'r', 'R'],
  touchControls: { label: 'Move and restart', buttons: [
    { key: 'ArrowUp', label: 'Up', icon: 'up', row: 1, column: 2 },
    { key: 'ArrowLeft', label: 'Left', icon: 'left', row: 2, column: 1 },
    { key: 'r', label: 'Restart', icon: 'restart', row: 2, column: 2 },
    { key: 'ArrowRight', label: 'Right', icon: 'right', row: 2, column: 3 },
    { key: 'ArrowDown', label: 'Down', icon: 'down', row: 3, column: 2 },
  ] },
  manual: { controls: [
    { title: 'Move', keys: ['WASD', 'Arrow keys'], description: 'Dodge sentries and reach orbs.' },
    { title: 'Restart', keys: ['R'], description: 'Start a fresh run after losing all lives.' },
  ], entities: [
    { title: 'Hero', symbol: '🔵', description: 'Your movable drone.' },
    { title: 'Sentry', symbol: '🔴', description: 'Avoid these pursuers.' },
    { title: 'Energy orb', symbol: '🟡', description: 'Collect for 10 points.' },
  ] },
};

export default arenaSurvivorGame;
