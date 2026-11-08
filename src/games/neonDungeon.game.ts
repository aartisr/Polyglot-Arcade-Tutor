import { GameDefinition } from '../types/game';
import { LESSONS } from '../data/lessonsData';
import { neonDungeonEngine, neonDungeonDifficultyConfig } from '../engines/neonDungeonEngine';
import { neonDungeonSnippets } from './neonDungeonSnippets';

export const neonDungeonGame: GameDefinition = {
  id: 'neon-dungeon',
  catalogOrder: 0,
  title: 'Neon Dungeon: Rogue Crawler',
  subtitle: 'Top-Down 2D Dungeon Crawler Engine',
  genre: 'Retro 2D Dungeon Crawler',
  tagline: 'Code player velocity physics, AABB wall boundaries, energy gems & patrolling skulls',
  description:
    'Learn how to engineer a retro 2D top-down dungeon crawler game from scratch! Master coordinate spaces, velocity vectors, AABB bounding box collision math, and 60 FPS animation loops across JavaScript, Python, and Java.',
  story:
    'You are a neon cyber-knight trapped in a high-voltage labyrinth grid. Your mission is to gather rare energy cells, navigate perimeter walls, and outrun cyber skulls.',
  objective:
    'Survive the maze, collect yellow Energy Cells (+100 PTS), prevent passing through walls, and avoid contact with patrol enemies.',
  controlsTip:
    'Use WASD or Arrow keys on the canvas to move your hero across the coordinate surface.',
  badge: '⚔️',
  accentColor: '#22d3ee',
  lessons: LESSONS,
  getDifficultyParams: neonDungeonDifficultyConfig,
  engine: neonDungeonEngine,
  snippets: neonDungeonSnippets,
  canvas: { width: 400, height: 400 },
  inputKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'r', 'R'],
  achievements: {
    lessonComplete: { 'step-3': ['aabb_architect'] },
    gameComplete: ['master_rogue'],
  },
  manual: {
    controls: [
      { title: 'Move', keys: ['WASD', 'Arrow keys'], description: 'Guide the hero through the maze.' },
      { title: 'Restart', keys: ['R'], description: 'Reset the level after a collision.' },
    ],
    entities: [
      { title: 'Hero', symbol: '🛡️', description: 'Move with velocity and stay inside the walls.' },
      { title: 'Energy gem', symbol: '💎', description: 'Collect gems to score points.' },
      { title: 'Skulls and walls', symbol: '💀', description: 'Avoid enemies and blocked paths.' },
    ],
  },
  touchControls: {
    label: 'Move and restart',
    buttons: [
      { key: 'ArrowUp', label: 'Up', icon: 'up', row: 1, column: 2 },
      { key: 'ArrowLeft', label: 'Left', icon: 'left', row: 2, column: 1 },
      { key: 'r', label: 'Restart', icon: 'restart', row: 2, column: 2 },
      { key: 'ArrowRight', label: 'Right', icon: 'right', row: 2, column: 3 },
      { key: 'ArrowDown', label: 'Down', icon: 'down', row: 3, column: 2 },
    ],
  },
};

export default neonDungeonGame;
