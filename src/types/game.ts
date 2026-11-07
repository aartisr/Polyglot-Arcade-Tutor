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

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  tagline: string;
  description: string;
  story: string;
  objective: string;
  controlsTip: string;
  badge: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  themeGlow: string;
  lessons: LessonStep[];
  getDifficultyParams: (level: DifficultyLevel) => DifficultyParamDetail;
  engine: GameEngineStrategy;
}
