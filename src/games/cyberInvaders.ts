import { GameDefinition } from '../types/game';
import { CYBER_INVADERS_LESSONS } from '../data/cyberInvadersLessonsData';
import { cyberInvadersEngine, cyberInvadersDifficultyConfig } from '../engines/cyberInvadersEngine';
import { cyberInvadersSnippets } from './cyberInvadersSnippets';

export const cyberInvadersGame: GameDefinition = {
  id: 'cyber-invaders',
  title: 'Cyber Invaders: Space Grid',
  subtitle: 'Retro 2D Arcade Space Shooter Engine',
  genre: 'Arcade Space Invaders',
  tagline: 'Code horizontal strafe physics, plasma laser projectile pools, marching armada grids & shield bunkers',
  description:
    'Construct a legendary 2D arcade space shooter! Master weapon projectile spawning pools, marching alien fleet matrix movement, bunker degradation math, and wave defense loops across JavaScript, Python, and Java.',
  story:
    'Earth orbital perimeter is under siege by an alien grid fleet! Pilot the planetary defense cannon, deploy plasma laser bolts, and defend shield bunkers from incoming bombs.',
  objective:
    'Eliminate descending alien armada squadrons (+150 PTS), shield your base with destructible bunkers, and dodge alien plasma bombs.',
  controlsTip:
    'Use A/D or Left/Right Arrow keys to strafe, and press Space, W, or Up Arrow to fire plasma lasers.',
  badge: '🚀',
  accentColor: '#f472b6',
  lessons: CYBER_INVADERS_LESSONS,
  getDifficultyParams: cyberInvadersDifficultyConfig,
  engine: cyberInvadersEngine,
  snippets: cyberInvadersSnippets,
  canvas: { width: 400, height: 400 },
  inputKeys: ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'w', 'a', 'd', 'W', 'A', 'D', ' ', 'r', 'R'],
  manual: {
    controls: [
      { title: 'Strafe', keys: ['A / D', '← / →'], description: 'Move the cannon along the bottom edge.' },
      { title: 'Fire', keys: ['Space', 'W', '↑'], description: 'Launch plasma lasers toward the armada.' },
    ],
    entities: [
      { title: 'Defense cannon', symbol: '🚀', description: 'Your ship fires upward.' },
      { title: 'Alien armada', symbol: '👾', description: 'Enemies march in rows and drop bombs.' },
      { title: 'Bunkers', symbol: '🛡️', description: 'Shields absorb hits before breaking.' },
    ],
  },
  touchControls: {
    label: 'Strafe and fire',
    buttons: [
      { key: 'ArrowLeft', label: 'Left', icon: 'left', row: 2, column: 1 },
      { key: 'ArrowRight', label: 'Right', icon: 'right', row: 2, column: 2 },
      { key: ' ', label: 'Fire', icon: 'fire', row: 2, column: 3, emphasis: true },
      { key: 'r', label: 'Restart', icon: 'restart', row: 3, column: 2 },
    ],
  },
};
