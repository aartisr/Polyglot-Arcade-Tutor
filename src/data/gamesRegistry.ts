import { gameRegistry } from '../services/GameRegistry';
import { GameDefinition } from '../types/game';

export function getDefaultGameId(): string {
  return gameRegistry.getDefaultGameId();
}

export const GAMES_REGISTRY: Record<string, GameDefinition> = new Proxy({} as Record<string, GameDefinition>, {
  get: (_target, prop: string) => gameRegistry.get(prop),
  ownKeys: () => gameRegistry.getAll().map((g) => g.id),
  getOwnPropertyDescriptor: (_target, prop: string) => {
    const game = gameRegistry.get(prop);
    if (!game) return undefined;
    return {
      configurable: true,
      enumerable: true,
      value: game,
    };
  },
});

export function getAllGames(): GameDefinition[] {
  return gameRegistry.getAll();
}

export function getGameById(gameId?: string): GameDefinition {
  return gameRegistry.getOrFallback(gameId);
}

export function getLessonByGameAndId(gameId: string, lessonId: string) {
  return gameRegistry.getLesson(gameId, lessonId);
}

export { gameRegistry };

