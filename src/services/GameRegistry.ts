import { GameDefinition, GameEngineStrategy } from '../types/game';
import { LessonStep, DifficultyLevel } from '../types/lesson';
import { LESSONS } from '../data/lessonsData';
import { CYBER_INVADERS_LESSONS } from '../data/cyberInvadersLessonsData';
import { neonDungeonEngine, neonDungeonDifficultyConfig } from '../engines/neonDungeonEngine';
import { cyberInvadersEngine, cyberInvadersDifficultyConfig } from '../engines/cyberInvadersEngine';

/**
 * Generic Validation Result for Game Configurations
 */
export interface GameValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Listener callback for dynamic game registry mutations
 */
export type GameRegistryListener<T extends GameDefinition = GameDefinition> = (games: T[]) => void;

/**
 * Generic Interface for Game Registry & Configuration Management
 */
export interface IGameRegistry<T extends GameDefinition = GameDefinition> {
  /**
   * Register a new game configuration or template.
   * Throws an error if game already exists unless options.override is true.
   */
  register(game: T, options?: { override?: boolean }): void;

  /**
   * Unregister an existing game definition by its ID.
   * Default game cannot be unregistered.
   */
  unregister(gameId: string): boolean;

  /**
   * Retrieve a game definition by its unique identifier.
   */
  get(gameId: string): T | undefined;

  /**
   * Retrieve a game definition with automatic fallback to default.
   */
  getOrFallback(gameId?: string, fallbackId?: string): T;

  /**
   * Check if a game ID is currently registered.
   */
  has(gameId: string): boolean;

  /**
   * Retrieve an array of all registered game definitions.
   */
  getAll(): T[];

  /**
   * Retrieve the current default game ID.
   */
  getDefaultGameId(): string;

  /**
   * Set the default game ID.
   */
  setDefaultGameId(gameId: string): void;

  /**
   * Search across all games to find which game contains a given lesson ID.
   */
  findGameByLessonId(lessonId: string): T | undefined;

  /**
   * Retrieve a lesson step for a specific game, with resilient cross-game resolution.
   */
  getLesson(gameId: string, lessonId: string): LessonStep;

  /**
   * Validate a game definition's structure and completeness.
   */
  validate(game: Partial<T>): GameValidationResult;

  /**
   * Subscribe to registry changes (when games are added, updated, or removed).
   * Returns an unsubscribe function.
   */
  subscribe(listener: GameRegistryListener<T>): () => void;

  /**
   * Clear and reset registry to initial preset templates.
   */
  resetToDefaults(): void;
}

/**
 * Default Game Configurations
 */
const DEFAULT_NEON_DUNGEON: GameDefinition = {
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
};

const DEFAULT_CYBER_INVADERS: GameDefinition = {
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
};

/**
 * Robust, production-grade GameRegistry service implementation.
 * Encapsulates game configurations, runtime dynamic loading, and validation.
 */
export class GameRegistryService<T extends GameDefinition = GameDefinition> implements IGameRegistry<T> {
  private gamesMap: Map<string, T> = new Map();
  private defaultGameId: string = 'neon-dungeon';
  private listeners: Set<GameRegistryListener<T>> = new Set();

  constructor(initialGames?: T[], defaultId: string = 'neon-dungeon') {
    this.defaultGameId = defaultId;
    if (initialGames && initialGames.length > 0) {
      initialGames.forEach((game) => this.register(game, { override: true }));
    } else {
      this.resetToDefaults();
    }
  }

  /**
   * Resets the registry to initial standard arcade games.
   */
  public resetToDefaults(): void {
    this.gamesMap.clear();
    this.register(DEFAULT_NEON_DUNGEON as unknown as T, { override: true });
    this.register(DEFAULT_CYBER_INVADERS as unknown as T, { override: true });
    this.defaultGameId = 'neon-dungeon';
  }

  /**
   * Validates a game definition to ensure required properties, lessons, and engine hooks exist.
   */
  public validate(game: Partial<T>): GameValidationResult {
    const errors: string[] = [];

    if (!game.id || typeof game.id !== 'string' || game.id.trim() === '') {
      errors.push('Game configuration must have a non-empty string "id".');
    }
    if (!game.title || typeof game.title !== 'string') {
      errors.push('Game configuration must have a valid string "title".');
    }
    if (!game.engine || typeof game.engine !== 'object') {
      errors.push('Game configuration must provide an "engine" strategy implementation.');
    } else {
      if (typeof game.engine.createInitialState !== 'function') {
        errors.push('Game engine strategy must implement "createInitialState(difficulty, diffParams)".');
      }
      if (typeof game.engine.update !== 'function') {
        errors.push('Game engine strategy must implement "update(state, keys, stepId, diffParams, hooks)".');
      }
      if (typeof game.engine.render !== 'function') {
        errors.push('Game engine strategy must implement "render(ctx, state, stepId, diffParams, languageLabel)".');
      }
    }
    if (!Array.isArray(game.lessons) || game.lessons.length === 0) {
      errors.push('Game configuration must provide at least one LessonStep in "lessons".');
    } else {
      game.lessons.forEach((lesson, idx) => {
        if (!lesson.id || !lesson.title || !lesson.codeBoilerplate || !lesson.solution) {
          errors.push(`Lesson at index ${idx} is missing required fields (id, title, codeBoilerplate, or solution).`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Registers a game configuration.
   */
  public register(game: T, options?: { override?: boolean }): void {
    const validation = this.validate(game);
    if (!validation.valid) {
      throw new Error(
        `[GameRegistry] Failed to register game "${game.id || 'unknown'}": ${validation.errors.join('; ')}`
      );
    }

    if (this.gamesMap.has(game.id) && !options?.override) {
      throw new Error(
        `[GameRegistry] Game with ID "${game.id}" is already registered. Pass { override: true } to replace.`
      );
    }

    this.gamesMap.set(game.id, game);
    this.notifyListeners();
  }

  /**
   * Unregisters a game by ID. Default game cannot be unregistered.
   */
  public unregister(gameId: string): boolean {
    if (gameId === this.defaultGameId) {
      console.warn(`[GameRegistry] Cannot unregister default game "${gameId}".`);
      return false;
    }

    const deleted = this.gamesMap.delete(gameId);
    if (deleted) {
      this.notifyListeners();
    }
    return deleted;
  }

  /**
   * Retrieves a game definition by ID.
   */
  public get(gameId: string): T | undefined {
    return this.gamesMap.get(gameId);
  }

  /**
   * Retrieves a game definition with fallback.
   */
  public getOrFallback(gameId?: string, fallbackId?: string): T {
    if (gameId && this.gamesMap.has(gameId)) {
      return this.gamesMap.get(gameId)!;
    }

    const fallback = fallbackId ? this.gamesMap.get(fallbackId) : undefined;
    if (fallback) {
      return fallback;
    }

    const defaultGame = this.gamesMap.get(this.defaultGameId);
    if (defaultGame) {
      return defaultGame;
    }

    // Ultimate fallback if map is somehow empty
    const firstAvailable = Array.from(this.gamesMap.values())[0];
    if (firstAvailable) {
      return firstAvailable;
    }

    return DEFAULT_NEON_DUNGEON as unknown as T;
  }

  /**
   * Checks whether a game is registered.
   */
  public has(gameId: string): boolean {
    return this.gamesMap.has(gameId);
  }

  /**
   * Returns all registered games.
   */
  public getAll(): T[] {
    return Array.from(this.gamesMap.values());
  }

  /**
   * Returns the current default game ID.
   */
  public getDefaultGameId(): string {
    return this.defaultGameId;
  }

  /**
   * Sets the default game ID.
   */
  public setDefaultGameId(gameId: string): void {
    if (!this.gamesMap.has(gameId)) {
      throw new Error(`[GameRegistry] Cannot set non-existent game "${gameId}" as default.`);
    }
    this.defaultGameId = gameId;
    this.notifyListeners();
  }

  /**
   * Finds which game owns a given lesson ID.
   */
  public findGameByLessonId(lessonId: string): T | undefined {
    for (const game of this.gamesMap.values()) {
      if (game.lessons.some((l) => l.id === lessonId)) {
        return game;
      }
    }
    return undefined;
  }

  /**
   * Resolves a lesson step generically.
   */
  public getLesson(gameId: string, lessonId: string): LessonStep {
    let game = this.get(gameId);
    let found = game?.lessons.find((l) => l.id === lessonId);

    if (!found) {
      const ownerGame = this.findGameByLessonId(lessonId);
      if (ownerGame) {
        game = ownerGame;
        found = ownerGame.lessons.find((l) => l.id === lessonId);
      }
    }

    if (found) {
      return found;
    }

    // Resilient fallback to first lesson of requested or default game
    const resolvedGame = game || this.getOrFallback();
    return resolvedGame.lessons[0];
  }

  /**
   * Generic testing utility to run unit test assertions for game physics and logic on a given lesson.
   */
  public runLessonTests(
    gameId: string,
    lessonId: string,
    code: string,
    logs: string[]
  ): { testId: string; name: string; description: string; hint: string; passed: boolean; message: string }[] {
    const lesson = this.getLesson(gameId, lessonId);
    if (!lesson || !lesson.tests) {
      return [];
    }

    return lesson.tests.map((test) => {
      try {
        const result = test.check(code, logs);
        return {
          testId: test.id,
          name: test.name,
          description: test.description,
          hint: test.hint,
          passed: result.passed,
          message: result.message,
        };
      } catch (err) {
        return {
          testId: test.id,
          name: test.name,
          description: test.description,
          hint: test.hint,
          passed: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    });
  }

  /**
   * Subscribes to registry changes.
   */
  public subscribe(listener: GameRegistryListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const gamesList = this.getAll();
    this.listeners.forEach((listener) => {
      try {
        listener(gamesList);
      } catch (err) {
        console.error('[GameRegistry] Error in registry listener:', err);
      }
    });
  }
}

/**
 * Singleton instance of the GameRegistry service.
 */
export const gameRegistry = new GameRegistryService<GameDefinition>();

export default gameRegistry;
