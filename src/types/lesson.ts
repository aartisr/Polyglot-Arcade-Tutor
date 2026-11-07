export type Language = 'javascript' | 'python' | 'java';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type CodeBoilerplate = Record<Language, string>;

export interface LessonConcept {
  title: string;
  description: string;
  codeSnippet?: Partial<Record<Language, string>>;
  diagramType?: 'canvas-coords' | 'velocity-vector' | 'aabb-collision' | 'game-loop';
}

export interface ValidationTest {
  id: string;
  name: string;
  description: string;
  hint: string;
  check: (code: string, logs: string[], canvasState?: any) => { passed: boolean; message: string };
}

export interface LessonStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  concepts: LessonConcept[];
  codeBoilerplate: CodeBoilerplate;
  solution: CodeBoilerplate;
  hints: string[];
  tests: ValidationTest[];
}

export interface LevelUpNotification {
  oldLevel: number;
  newLevel: number;
  title: string;
  badge: string;
}

export interface WorkspaceState {
  activeGameId: string;
  activeLanguage: Language;
  codeMap: Record<Language, string>;
  codeMapByGame?: Record<string, Record<Language, string>>;
  isRunning: boolean;
  logs: string[];
  currentStepId: string;
  completedSteps: Record<string, boolean>;
  completedStepsByGame?: Record<string, Record<string, boolean>>;
  validationResults: Record<string, { passed: boolean; message: string }>;
  soundEnabled: boolean;
  difficulty: DifficultyLevel;
  crtModeEnabled: boolean;
  xp: number;
  comboStreak: number;
  completedQuests: Record<string, boolean>;
  levelUpNotification?: LevelUpNotification | null;
  xpFloatMessage?: string | null;
}
