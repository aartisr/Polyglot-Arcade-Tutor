import { GameDefinition, GameEngineStrategy } from '../types/game';
import { DifficultyLevel, LessonStep } from '../types/lesson';

const engine: GameEngineStrategy = {
  createInitialState() {
    return {
      player: { x: 200, y: 200 },
      plots: Array.from({ length: 9 }, (_, index) => ({
        x: 80 + (index % 3) * 120, y: 82 + Math.floor(index / 3) * 116,
        growth: 0, planted: false,
      })),
      flowers: 0, tick: 0, actionHeld: false,
    };
  },
  update(state, keys, stepId, difficulty, hooks) {
    state.tick++;
    const dx = Number(Boolean(keys.ArrowRight || keys.d || keys.D)) - Number(Boolean(keys.ArrowLeft || keys.a || keys.A));
    const dy = Number(Boolean(keys.ArrowDown || keys.s || keys.S)) - Number(Boolean(keys.ArrowUp || keys.w || keys.W));
    const length = Math.hypot(dx, dy) || 1;
    state.player.x = Math.max(15, Math.min(385, state.player.x + dx / length * 3));
    state.player.y = Math.max(15, Math.min(385, state.player.y + dy / length * 3));
    if (stepId === 'step-1') return;
    const nearest = state.plots.find((plot: { x: number; y: number }) => Math.hypot(state.player.x - plot.x, state.player.y - plot.y) < 34);
    const actionPressed = Boolean(keys[' '] || keys.Enter);
    if (actionPressed && !state.actionHeld && nearest) {
      if (!nearest.planted) {
        nearest.planted = true; nearest.growth = 0; hooks.playMove();
      } else if (stepId === 'step-3' && nearest.growth >= 100) {
        nearest.planted = false; nearest.growth = 0;
        state.flowers++; hooks.playScore(); hooks.addXp(10, 'Flower harvested');
      }
    }
    state.actionHeld = actionPressed;
    if (stepId === 'step-3') {
      for (const plot of state.plots) {
        if (plot.planted) plot.growth = Math.min(100, plot.growth + 0.12 * difficulty.speedMult);
      }
    }
  },
  render(ctx, state, stepId, _difficulty, languageLabel) {
    ctx.fillStyle = '#102c28'; ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#164439';
    for (let x = 0; x < 400; x += 40) {
      for (let y = 0; y < 400; y += 40) ctx.fillRect(x + 2, y + 2, 36, 36);
    }
    if (stepId !== 'step-1') {
      for (const plot of state.plots) {
        ctx.fillStyle = '#724b31'; ctx.fillRect(plot.x - 23, plot.y - 17, 46, 34);
        if (plot.planted) {
          ctx.fillStyle = plot.growth >= 100 ? '#f9a8d4' : '#86efac';
          ctx.beginPath(); ctx.arc(plot.x, plot.y, plot.growth >= 100 ? 13 : 4 + plot.growth / 12, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(plot.x, plot.y, 3, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(state.player.x, state.player.y, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e293b'; ctx.fillRect(state.player.x - 6, state.player.y - 3, 3, 3); ctx.fillRect(state.player.x + 3, state.player.y - 3, 3, 3);
    ctx.fillStyle = '#fff'; ctx.font = '14px monospace'; ctx.fillText(`Flowers ${state.flowers}`, 12, 22);
    ctx.font = '11px monospace'; ctx.fillText('Move to a plot · Space to plant / pick', 12, 386);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(languageLabel, 12, 42);
  },
};

const jsStart = `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gardener = { x: 200, y: 200 };
ctx.fillStyle = '#102c28';
ctx.fillRect(0, 0, 400, 400);`;
const pyStart = `gardener = {'x': 200, 'y': 200}\n`;
const javaStart = `class Gardener { int x = 200, y = 200; }\n`;

const lessons: LessonStep[] = [
  {
    id: 'step-1', stepNumber: 1, title: 'Draw a garden', subtitle: 'Canvas and character coordinates',
    description: 'Give your gardener a place to stand. A green canvas and a simple character are enough to start a game world.',
    concepts: [{ title: '2D coordinates', description: 'Place the gardener near the middle of the canvas at (200, 200).', diagramType: 'canvas-coords' }],
    codeBoilerplate: {
      javascript: `${jsStart}\n// TODO: Draw the gardener at gardener.x and gardener.y with ctx.arc.\n`,
      python: `${pyStart}# TODO: Print the gardener's position.\n`,
      java: `${javaStart}// TODO: Print the gardener's position.\n`,
    },
    solution: {
      javascript: `${jsStart}\nctx.fillStyle = '#fde68a';\nctx.beginPath();\nctx.arc(gardener.x, gardener.y, 12, 0, Math.PI * 2);\nctx.fill();\n`,
      python: `${pyStart}print(gardener['x'], gardener['y'])\n`,
      java: `${javaStart}class GardenDemo { public static void main(String[] args) { Gardener g = new Gardener(); System.out.println(g.x + "," + g.y); } }\n`,
    },
    hints: ['Start at the center of the garden.', 'Use beginPath, arc, and fill in JavaScript.'],
    tests: [{ id: 'gardener', name: 'Gardener placed', description: 'Create a character at the center.', hint: 'Use the gardener coordinates.', check: (code) => ({ passed: /gardener|Gardener/.test(code) && /200/.test(code), message: 'Gardener coordinates checked.' }) }],
  },
  {
    id: 'step-2', stepNumber: 2, title: 'Plant a seed', subtitle: 'Interact with a nearby plot',
    description: 'A garden plot has a position and a planted state. Check the distance to the gardener before placing a seed.',
    concepts: [{ title: 'Proximity', description: 'Use the distance between the gardener and the plot to decide when an action is allowed.', diagramType: 'aabb-collision' }],
    codeBoilerplate: {
      javascript: `${jsStart}\nconst plot = { x: 200, y: 200, planted: false };\n// TODO: Use Math.hypot to plant when the gardener is within 34 pixels.\n`,
      python: `${pyStart}plot = {'x': 200, 'y': 200, 'planted': False}\n# TODO: Use math.hypot to plant when nearby.\n`,
      java: `${javaStart}class Plot { int x = 200, y = 200; boolean planted = false; }\n// TODO: Use Math.hypot to plant when nearby.\n`,
    },
    solution: {
      javascript: `${jsStart}\nconst plot = { x: 200, y: 200, planted: false };\nif (Math.hypot(gardener.x - plot.x, gardener.y - plot.y) < 34) plot.planted = true;\nconsole.log('Planted', plot.planted);\n`,
      python: `import math\n${pyStart}plot = {'x': 200, 'y': 200, 'planted': False}\nif math.hypot(gardener['x'] - plot['x'], gardener['y'] - plot['y']) < 34:\n    plot['planted'] = True\nprint(plot['planted'])\n`,
      java: `${javaStart}class Plot { int x = 200, y = 200; boolean planted = false; }\nclass GardenPlant { public static void main(String[] args) { Gardener g = new Gardener(); Plot plot = new Plot(); if (Math.hypot(g.x - plot.x, g.y - plot.y) < 34) plot.planted = true; System.out.println(plot.planted); } }\n`,
    },
    hints: ['Compare the gardener and plot positions.', 'Set planted to true when the distance is below 34.'],
    tests: [{ id: 'plant', name: 'Plant nearby', description: 'Check distance and change plot state.', hint: 'Use hypot and planted.', check: (code) => ({ passed: /hypot/.test(code) && /planted/.test(code), message: 'Planting logic checked.' }) }],
  },
  {
    id: 'step-3', stepNumber: 3, title: 'Grow and harvest', subtitle: 'Progress, timing, and reward',
    description: 'Make plants grow over time. Once growth reaches 100, harvest a flower and add it to the score.',
    concepts: [{ title: 'Growth over frames', description: 'Increase growth a little each frame, cap it at 100, then allow harvesting.', diagramType: 'game-loop' }],
    codeBoilerplate: {
      javascript: `${jsStart}\nconst plot = { planted: true, growth: 99 };\nlet flowers = 0;\n// TODO: Increase growth to 100 and add a flower when ready.\n`,
      python: `plot = {'planted': True, 'growth': 99}\nflowers = 0\n# TODO: Increase growth to 100 and add a flower when ready.\n`,
      java: `class GardenHarvest { // TODO: Increase growth to 100 and add a flower when ready.\n}\n`,
    },
    solution: {
      javascript: `${jsStart}\nconst plot = { planted: true, growth: 99 };\nlet flowers = 0;\nplot.growth = Math.min(100, plot.growth + 1);\nif (plot.planted && plot.growth >= 100) { flowers += 1; plot.planted = false; }\nconsole.log('Flowers', flowers);\n`,
      python: `plot = {'planted': True, 'growth': 99}\nflowers = 0\nplot['growth'] = min(100, plot['growth'] + 1)\nif plot['planted'] and plot['growth'] >= 100:\n    flowers += 1\n    plot['planted'] = False\nprint(flowers)\n`,
      java: `class GardenHarvest { public static void main(String[] args) { boolean planted = true; int growth = 99, flowers = 0; growth = Math.min(100, growth + 1); if (planted && growth >= 100) { flowers += 1; planted = false; } System.out.println(flowers); } }\n`,
    },
    hints: ['Cap growth at 100.', 'Only harvest a planted plot that is fully grown.'],
    tests: [{ id: 'harvest', name: 'Harvest a flower', description: 'Track growth and flowers.', hint: 'Use growth and flowers.', check: (code) => ({ passed: /growth/.test(code) && /flowers/.test(code) && /100/.test(code), message: 'Harvest logic checked.' }) }],
  },
];

export const cozyGardenGame: GameDefinition = {
  id: 'cozy-garden', title: 'Little Garden: Bloom Day', subtitle: 'Plant, grow, and pick flowers',
  catalogOrder: 30,
  genre: 'Cozy collection', tagline: 'Plant nearby plots and harvest flowers at your own pace.',
  description: 'Build a calm garden game while learning coordinates, proximity, and growth over time.',
  story: 'A quiet garden is ready for a new gardener. Fill its plots with flowers.',
  objective: 'Plant seeds in empty plots and pick flowers when they bloom.',
  controlsTip: 'Move with WASD or Arrow keys. Press Space near a plot to plant or harvest.',
  badge: '🌼', accentColor: '#86efac', lessons, engine,
  getDifficultyParams: (level: DifficultyLevel) => ({ speedMult: 0.8 + level * 0.2, label: `Level ${level}: Garden pace`, color: 'text-emerald-300' }),
  canvas: { width: 400, height: 400 },
  inputKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'Enter'],
  touchControls: { label: 'Move and plant', buttons: [
    { key: 'ArrowUp', label: 'Up', icon: 'up', row: 1, column: 2 },
    { key: 'ArrowLeft', label: 'Left', icon: 'left', row: 2, column: 1 },
    { key: ' ', label: 'Plant / Pick', icon: 'fire', row: 2, column: 2, emphasis: true },
    { key: 'ArrowRight', label: 'Right', icon: 'right', row: 2, column: 3 },
    { key: 'ArrowDown', label: 'Down', icon: 'down', row: 3, column: 2 },
  ] },
  manual: { controls: [
    { title: 'Move', keys: ['WASD', 'Arrow keys'], description: 'Walk toward a garden plot.' },
    { title: 'Plant or pick', keys: ['Space'], description: 'Plant a seed or harvest a blooming flower.' },
  ], entities: [
    { title: 'Gardener', symbol: '🟡', description: 'Your character.' },
    { title: 'Plot', symbol: '🟫', description: 'A place to plant.' },
    { title: 'Flower', symbol: '🌸', description: 'Pick when fully grown.' },
  ] },
};

export default cozyGardenGame;
