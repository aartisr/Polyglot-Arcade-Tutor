import { GameTemplate, EngineHooks, DifficultyParamDetail } from '../types/game';
import { Language, DifficultyLevel } from '../types/lesson';
import { gameRegistry } from './GameRegistry';
import { arcadeAudio } from '../utils/audio';

/**
 * Execution configuration passed to GameRunner
 */
export interface RunnerExecutionOptions {
  /**
   * The GameTemplate instance or game ID from GameRegistry
   */
  game: GameTemplate | string;
  language: Language;
  code: string;
  stepId: string;
  difficulty: DifficultyLevel;
  hooks: EngineHooks;
  onFpsUpdate?: (fps: number) => void;
  onError?: (error: Error) => void;
  onLog?: (message: string) => void;
  onStateChange?: (isRunning: boolean) => void;
}

/**
 * Generic Interface for the GameRunner service
 */
export interface IGameRunner {
  /**
   * Start executing a game in the provided HTML5 canvas.
   */
  start(canvas: HTMLCanvasElement, options: RunnerExecutionOptions): void;

  /**
   * Stop current execution and release animation loop.
   */
  stop(): void;

  /**
   * Returns whether the runner is currently executing.
   */
  isRunning(): boolean;

  /**
   * Returns the current estimated frames per second (FPS).
   */
  getFps(): number;

  /**
   * Handle game key down events. Returns true if key was intercepted as a game key.
   */
  handleKeyDown(e: KeyboardEvent): boolean;

  /**
   * Handle game key up events.
   */
  handleKeyUp(e: KeyboardEvent): void;

  /**
   * Reset keyboard tracking state.
   */
  resetKeys(): void;

  /**
   * Inject language-specific boilerplates and sandboxing harnesses around user code.
   */
  injectLanguageBoilerplate(
    game: GameTemplate,
    language: Language,
    stepId: string,
    userCode: string
  ): string;

  /**
   * Clean up all active listeners, timers, and canvas contexts.
   */
  cleanup(): void;
}

/**
 * Standard game keyboard keys recognized by the engine runner
 */
export const GAME_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'w', 'a', 's', 'd', 'W', 'A', 'S', 'D',
  ' ', 'r', 'R'
]);

/**
 * Generic GameRunner Service
 * Decouples execution, animation loops, and language boilerplate injection from UI components.
 */
export class GameRunnerService implements IGameRunner {
  private activeAnimationFrame: number | null = null;
  private running: boolean = false;
  private currentFps: number = 60;
  private keysPressed: Record<string, boolean> = {};
  private activeCanvas: HTMLCanvasElement | null = null;
  private activeOptions: RunnerExecutionOptions | null = null;

  constructor() {
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.handleWindowBlur);
    }
  }

  private handleWindowBlur(): void {
    this.resetKeys();
  }

  public isRunning(): boolean {
    return this.running;
  }

  public getFps(): number {
    return this.currentFps;
  }

  public resetKeys(): void {
    this.keysPressed = {};
  }

  public handleKeyDown(e: KeyboardEvent): boolean {
    if (GAME_KEYS.has(e.key)) {
      this.keysPressed[e.key] = true;
      if (this.running && e.key !== ' ' && e.key.toLowerCase() !== 'r') {
        arcadeAudio.playPlayerMove();
      }
      return true;
    }
    return false;
  }

  public handleKeyUp(e: KeyboardEvent): void {
    if (GAME_KEYS.has(e.key)) {
      this.keysPressed[e.key] = false;
    }
  }

  /**
   * Injects language-specific harness boilerplates around user code.
   * Ensures that partial snippets, functions, or full scripts are safely runnable.
   */
  public injectLanguageBoilerplate(
    game: GameTemplate,
    language: Language,
    stepId: string,
    userCode: string
  ): string {
    const trimmed = (userCode || '').trim();

    if (language === 'javascript') {
      // Check if user code is a full self-contained loop or needs boilerplate wrap
      const hasGameLoop = trimmed.includes('requestAnimationFrame') || trimmed.includes('function gameLoop');

      if (hasGameLoop) {
        return `
          // [PolyGlot Harness: Self-Contained JavaScript Loop]
          try {
            ${trimmed}
          } catch (runtimeErr) {
            console.error('[Runtime Error]: ' + (runtimeErr.message || String(runtimeErr)));
          }
        `;
      }

      // If user code is a component function or variable definition, inject sandbox harness
      return `
        // [PolyGlot Harness: Managed Step Evaluation]
        try {
          ${trimmed}
        } catch (execErr) {
          console.error('[Execution Error in Step]: ' + (execErr.message || String(execErr)));
        }
      `;
    }

    // For Python and Java, return user code formatted with runtime metadata
    return trimmed;
  }

  /**
   * Starts game execution on the provided canvas element.
   */
  public start(canvas: HTMLCanvasElement, options: RunnerExecutionOptions): void {
    this.stop(); // Stop any currently running loop before starting fresh

    this.activeCanvas = canvas;
    this.activeOptions = options;
    this.running = true;

    if (options.onStateChange) {
      options.onStateChange(true);
    }

    // Resolve game template from GameRegistry if a string ID was passed
    const gameTemplate: GameTemplate =
      typeof options.game === 'string'
        ? gameRegistry.getOrFallback(options.game)
        : options.game;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      const err = new Error('Failed to acquire 2D rendering context from game canvas.');
      options.onError?.(err);
      this.stop();
      return;
    }

    const diffParams = gameTemplate.getDifficultyParams(options.difficulty);

    // Dispatch execution based on language
    if (options.language === 'javascript') {
      this.runJavaScriptExecution(canvas, ctx, gameTemplate, diffParams, options);
    } else {
      this.runSimulatedEngine(canvas, ctx, gameTemplate, diffParams, options);
    }
  }

  /**
   * Stops current execution cleanly.
   */
  public stop(): void {
    if (this.activeAnimationFrame !== null) {
      cancelAnimationFrame(this.activeAnimationFrame);
      this.activeAnimationFrame = null;
    }
    this.running = false;
    this.resetKeys();

    if (this.activeOptions?.onStateChange) {
      this.activeOptions.onStateChange(false);
    }
  }

  /**
   * JavaScript Sandboxed Execution Runner
   */
  private runJavaScriptExecution(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    game: GameTemplate,
    diffParams: DifficultyParamDetail,
    options: RunnerExecutionOptions
  ): void {
    arcadeAudio.playStartEngine();
    options.hooks.appendLog(
      `[GameRunner] Starting JavaScript runtime for ${game.title} (Lvl ${options.difficulty} - ${diffParams.speedMult}x)...`
    );

    const sandboxedConsole = {
      log: (...args: any[]) => {
        const msg = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        options.hooks.appendLog(`[JS LOG] ${msg}`);
      },
      error: (...args: any[]) => {
        const msg = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        options.hooks.appendLog(`[JS ERROR] ${msg}`);
      },
      warn: (...args: any[]) => {
        const msg = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        options.hooks.appendLog(`[JS WARN] ${msg}`);
      },
    };

    const injectedCode = this.injectLanguageBoilerplate(
      game,
      'javascript',
      options.stepId,
      options.code
    );

    try {
      let lastTime = performance.now();
      let frameCount = 0;

      const safeRequestAnimationFrame = (callback: FrameRequestCallback) => {
        this.activeAnimationFrame = window.requestAnimationFrame((timestamp) => {
          frameCount++;
          if (timestamp - lastTime >= 1000) {
            this.currentFps = frameCount;
            options.onFpsUpdate?.(frameCount);
            frameCount = 0;
            lastTime = timestamp;
          }
          callback(timestamp);
        });
        return this.activeAnimationFrame;
      };

      const mockDocument = {
        getElementById: (id: string) => (id === 'game-canvas' || id === canvas.id ? canvas : null),
        addEventListener: window.addEventListener.bind(window),
        removeEventListener: window.removeEventListener.bind(window),
      };

      const runnerFunction = new Function(
        'document',
        'window',
        'console',
        'canvas',
        'ctx',
        'requestAnimationFrame',
        'difficultyLevel',
        'speedMultiplier',
        'playCollision',
        'playMove',
        'engineHooks',
        `
        try {
          ${injectedCode}
        } catch (err) {
          console.error(err.message || String(err));
        }
      `
      );

      runnerFunction(
        mockDocument,
        window,
        sandboxedConsole,
        canvas,
        ctx,
        safeRequestAnimationFrame,
        options.difficulty,
        diffParams.speedMult,
        options.hooks.playCollision,
        options.hooks.playMove,
        options.hooks
      );

      options.hooks.appendLog(`[GameRunner] JavaScript sandbox executing at 60 FPS (${game.title}).`);
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      options.hooks.appendLog(`[GameRunner] Runtime compilation error: ${errorObj.message}`);
      options.onError?.(errorObj);
      this.stop();
    }
  }

  /**
   * High-Performance Simulated Engine Runner (for Python & Java)
   */
  private runSimulatedEngine(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    game: GameTemplate,
    diffParams: DifficultyParamDetail,
    options: RunnerExecutionOptions
  ): void {
    arcadeAudio.playStartEngine();
    const langLabel = options.language === 'python' ? 'Python Canvas Engine' : 'Java Graphics2D Engine';
    options.hooks.appendLog(`[GameRunner] Initializing ${langLabel} for ${game.title} (Level ${options.difficulty})...`);

    const gameState = game.engine.createInitialState(options.difficulty, diffParams);

    let lastTime = performance.now();
    let frameCount = 0;

    const gameLoop = (timestamp: number) => {
      if (!this.running) return;

      frameCount++;
      if (timestamp - lastTime >= 1000) {
        this.currentFps = frameCount;
        options.onFpsUpdate?.(frameCount);
        frameCount = 0;
        lastTime = timestamp;
      }

      try {
        game.engine.update(gameState, this.keysPressed, options.stepId, diffParams, options.hooks);
        game.engine.render(ctx, gameState, options.stepId, diffParams, langLabel);
      } catch (loopErr: any) {
        const error = loopErr instanceof Error ? loopErr : new Error(String(loopErr));
        options.hooks.appendLog(`[GameRunner Error] Simulation exception: ${error.message}`);
        options.onError?.(error);
        this.stop();
        return;
      }

      this.activeAnimationFrame = requestAnimationFrame(gameLoop);
    };

    this.activeAnimationFrame = requestAnimationFrame(gameLoop);
  }

  public cleanup(): void {
    this.stop();
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.handleWindowBlur);
    }
    this.activeCanvas = null;
    this.activeOptions = null;
  }
}

/**
 * Singleton instance of GameRunner service
 */
export const gameRunner = new GameRunnerService();

export default gameRunner;
