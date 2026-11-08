import { GameDefinition } from '../types/game';
import { LessonStep } from '../types/lesson';
import { builtInGames } from '../games';

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

  /** Unregister a game. The last remaining game cannot be removed. */
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

  /** Retrieve a lesson from exactly one game. Lesson IDs may repeat across games. */
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
 * Registry for built-in and runtime game definitions.
 */
export class GameRegistryService<T extends GameDefinition = GameDefinition> implements IGameRegistry<T> {
  private gamesMap: Map<string, T> = new Map();
  private defaultGameId = '';
  private listeners: Set<GameRegistryListener<T>> = new Set();

  constructor(initialGames?: T[], defaultId?: string) {
    if (initialGames && initialGames.length > 0) {
      initialGames.forEach((game) => this.register(game, { override: true }));
      this.setDefaultGameId(defaultId ?? initialGames[0].id);
    } else {
      this.resetToDefaults();
    }
  }

  /**
   * Resets the registry to initial standard arcade games.
   */
  public resetToDefaults(): void {
    if (builtInGames.length === 0) throw new Error('[GameRegistry] At least one built-in game is required.');
    this.gamesMap.clear();
    this.defaultGameId = builtInGames[0].id;
    builtInGames.forEach((game) => this.register(game as unknown as T, { override: true }));
  }

  /**
   * Validates a game definition to ensure required properties, lessons, and engine hooks exist.
   */
  public validate(game: Partial<T>): GameValidationResult {
    const errors: string[] = [];

    if (!game.id || typeof game.id !== 'string' || game.id.trim() === '') {
      errors.push('Game configuration must have a non-empty string "id".');
    }
    if (game.catalogOrder !== undefined && !Number.isFinite(game.catalogOrder)) {
      errors.push('Game configuration "catalogOrder" must be a finite number.');
    }
    for (const field of ['title', 'subtitle', 'genre', 'tagline', 'description', 'story', 'objective', 'controlsTip', 'badge'] as const) {
      if (typeof game[field] !== 'string' || !game[field]?.trim()) {
        errors.push(`Game configuration must have a non-empty string "${field}".`);
      }
    }
    if (typeof game.getDifficultyParams !== 'function') errors.push('Game configuration must implement getDifficultyParams(level).');
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
      const lessonIds = new Set<string>();
      game.lessons.forEach((lesson, idx) => {
        if (!lesson.id || !lesson.title || !lesson.codeBoilerplate || !lesson.solution) {
          errors.push(`Lesson at index ${idx} is missing required fields (id, title, codeBoilerplate, or solution).`);
        }
        for (const language of ['javascript', 'python', 'java'] as const) {
          if (typeof lesson.codeBoilerplate?.[language] !== 'string' || typeof lesson.solution?.[language] !== 'string') {
            errors.push(`Lesson ${lesson.id || idx} needs ${language} boilerplate and solution strings.`);
          }
        }
        if (lessonIds.has(lesson.id)) errors.push(`Duplicate lesson ID within game: ${lesson.id}`);
        lessonIds.add(lesson.id);
      });
    }
    if (game.touchControls) {
      const positions = new Set<string>();
      for (const button of game.touchControls.buttons) {
        if (button.row < 1 || button.column < 1 || button.row > 3 || button.column > 3) {
          errors.push(`Touch control ${button.label} must use a row and column from 1 to 3.`);
        }
        const position = `${button.row}:${button.column}`;
        if (positions.has(position)) errors.push(`Duplicate touch control position: ${position}`);
        positions.add(position);
        if (game.inputKeys && !game.inputKeys.includes(button.key)) errors.push(`Touch control ${button.label} uses a key missing from inputKeys.`);
      }
    }
    if (game.canvas && (!Number.isFinite(game.canvas.width) || !Number.isFinite(game.canvas.height) || game.canvas.width <= 0 || game.canvas.height <= 0)) {
      errors.push('Canvas width and height must be positive numbers.');
    }
    for (const snippet of game.snippets ?? []) {
      for (const language of ['javascript', 'python', 'java'] as const) {
        if (typeof snippet.snippets?.[language] !== 'string') errors.push(`Snippet ${snippet.id} needs ${language} code.`);
      }
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
    if (!this.defaultGameId) this.defaultGameId = game.id;
    this.notifyListeners();
  }

  /** Remove a game, selecting another default when necessary. */
  public unregister(gameId: string): boolean {
    if (!this.gamesMap.has(gameId) || this.gamesMap.size === 1) return false;

    const deleted = this.gamesMap.delete(gameId);
    if (deleted) {
      if (gameId === this.defaultGameId) this.defaultGameId = this.gamesMap.keys().next().value!;
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

    const firstAvailable = Array.from(this.gamesMap.values())[0];
    if (firstAvailable) {
      return firstAvailable;
    }

    throw new Error('[GameRegistry] No games are registered.');
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

  /** Resolve a lesson only within the requested game. */
  public getLesson(gameId: string, lessonId: string): LessonStep {
    const game = this.get(gameId);
    if (!game) throw new Error(`Unknown game: ${gameId}`);
    const lesson = game.lessons.find((item) => item.id === lessonId);
    if (!lesson) throw new Error(`Unknown lesson ${lessonId} in ${gameId}`);
    return lesson;
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
