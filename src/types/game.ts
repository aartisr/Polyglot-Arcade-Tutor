import { LessonStep, DifficultyLevel, Language } from './lesson';

export interface DifficultyParamDetail {
  speedMult: number;
  hazardSpeedMult?: number;
  label: string;
  color: string;
  extraConfig?: Record<string, any>;
}

export interface EngineHooks {
  playCollision: () => void;
  playMove: () => void;
  playScore: () => void;
  addXp: (amount: number, reason?: string) => void;
  incrementCombo: () => void;
  appendLog: (msg: string) => void;
  unlockAchievement: (id: string) => void;
}

export interface GameEngineStrategy {
  createInitialState: (difficulty: DifficultyLevel, diffParams: DifficultyParamDetail) => any;
  update: (
    state: any,
    keys: Record<string, boolean>,
    stepId: string,
    diffParams: DifficultyParamDetail,
    hooks: EngineHooks
  ) => void;
  render: (
    ctx: CanvasRenderingContext2D,
    state: any,
    stepId: string,
    diffParams: DifficultyParamDetail,
    languageLabel: string
  ) => void;
}

export interface GameSnippet {
  id: string;
  label: string;
  description: string;
  snippets: Record<Language, string>;
}

export interface GameManualItem {
  title: string;
  description: string;
  keys?: string[];
  symbol?: string;
}

export interface TouchControl {
  key: string;
  label: string;
  icon: 'up' | 'down' | 'left' | 'right' | 'fire' | 'restart';
  row: number;
  column: number;
  emphasis?: boolean;
}

export interface GameDefinition {
  id: string;
  /** Optional position in the game chooser; the first game is the default. */
  catalogOrder?: number;
  title: string;
  subtitle: string;
  genre: string;
  tagline: string;
  description: string;
  story: string;
  objective: string;
  controlsTip: string;
  badge: string;
  accentColor?: string;
  lessons: LessonStep[];
  getDifficultyParams: (level: DifficultyLevel) => DifficultyParamDetail;
  engine: GameEngineStrategy;
  snippets?: GameSnippet[];
  manual?: {
    controls: GameManualItem[];
    entities: GameManualItem[];
  };
  touchControls?: {
    label: string;
    buttons: TouchControl[];
  };
  inputKeys?: string[];
  canvas?: { width: number; height: number };
  achievements?: {
    lessonComplete?: Record<string, string[]>;
    gameComplete?: string[];
  };
  standaloneHtml?: (difficulty: DifficultyLevel) => string;
}

/**
 * Generic GameTemplate alias for registered game configurations
 */
export type GameTemplate = GameDefinition;
