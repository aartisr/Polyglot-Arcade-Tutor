import { GameDefinition } from '../types/game';
import { LESSONS } from './lessonsData';
import { CYBER_INVADERS_LESSONS } from './cyberInvadersLessonsData';
import { neonDungeonEngine, neonDungeonDifficultyConfig } from '../engines/neonDungeonEngine';
import { cyberInvadersEngine, cyberInvadersDifficultyConfig } from '../engines/cyberInvadersEngine';

export const DEFAULT_GAME_ID = 'neon-dungeon';

export const GAMES_REGISTRY: Record<string, GameDefinition> = {
  'neon-dungeon': {
    id: 'neon-dungeon',
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
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-500/50',
    themeGlow: 'shadow-neon-cyan',
    lessons: LESSONS,
    getDifficultyParams: neonDungeonDifficultyConfig,
    engine: neonDungeonEngine,
  },

  'cyber-invaders': {
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
    color: 'text-pink-400',
    badgeBg: 'bg-pink-950/60',
    badgeBorder: 'border-pink-500/50',
    themeGlow: 'shadow-neon-magenta',
    lessons: CYBER_INVADERS_LESSONS,
    getDifficultyParams: cyberInvadersDifficultyConfig,
    engine: cyberInvadersEngine,
  },
};

export function getAllGames(): GameDefinition[] {
  return Object.values(GAMES_REGISTRY);
}

export function getGameById(gameId?: string): GameDefinition {
  if (gameId && GAMES_REGISTRY[gameId]) {
    return GAMES_REGISTRY[gameId];
  }
  return GAMES_REGISTRY[DEFAULT_GAME_ID];
}

export function findGameByLessonId(lessonId: string): GameDefinition | undefined {
  return Object.values(GAMES_REGISTRY).find((game) =>
    game.lessons.some((l) => l.id === lessonId)
  );
}

export function getLessonByGameAndId(gameId: string, lessonId: string) {
  let game = getGameById(gameId);
  let found = game.lessons.find((l) => l.id === lessonId);
  if (!found) {
    const matchedGame = findGameByLessonId(lessonId);
    if (matchedGame) {
      return matchedGame.lessons.find((l) => l.id === lessonId) || matchedGame.lessons[0];
    }
  }
  return found || game.lessons[0];
}
