import { Store } from '@tanstack/store';
import { useStore } from '@tanstack/react-store';
import { Language, DifficultyLevel, WorkspaceState } from '../types/lesson';

export interface RankInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

export const RANKS: RankInfo[] = [
  { level: 1, title: 'Novice Hacker', minXp: 0, maxXp: 200, badge: '⚡', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-950/40' },
  { level: 2, title: 'Script Cadet', minXp: 200, maxXp: 500, badge: '🎮', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-950/40' },
  { level: 3, title: 'Pixel Knight', minXp: 500, maxXp: 1000, badge: '⚔️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-950/40' },
  { level: 4, title: 'Physics Master', minXp: 1000, maxXp: 1800, badge: '🔥', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-950/40' },
  { level: 5, title: 'Rogue Engine Legend', minXp: 1800, maxXp: 3000, badge: '👑', color: 'text-rose-400', borderColor: 'border-rose-500/40', bgColor: 'bg-rose-950/40' },
];

export function getRankForXp(xp: number): RankInfo {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

const initialCodeMap: Record<Language, string> = {
  javascript: '',
  python: '',
  java: '',
};

export const workspaceStore = new Store<WorkspaceState>({
  activeGameId: 'neon-dungeon',
  activeLanguage: 'javascript',
  codeMap: initialCodeMap,
  codeMapByGame: {
    'neon-dungeon': { ...initialCodeMap },
    'cyber-invaders': { ...initialCodeMap },
  },
  isRunning: false,
  logs: ['[SYSTEM] PolyGlot Arcade Engine ready. Select a lesson step and press Run Code.'],
  currentStepId: 'step-1',
  completedSteps: {},
  completedStepsByGame: {
    'neon-dungeon': {},
    'cyber-invaders': {},
  },
  validationResults: {},
  soundEnabled: true,
  difficulty: 3,
  crtModeEnabled: true,
  xp: 0,
  comboStreak: 0,
  completedQuests: {},
  levelUpNotification: null,
  xpFloatMessage: null,
});

// Helper actions
export const setActiveGame = (gameId: string) => {
  workspaceStore.setState((state) => {
    if (state.activeGameId === gameId) return state;

    const gameCodeMap = state.codeMapByGame?.[gameId] || initialCodeMap;
    const gameCompleted = state.completedStepsByGame?.[gameId] || {};

    return {
      ...state,
      activeGameId: gameId,
      codeMap: { ...gameCodeMap },
      completedSteps: { ...gameCompleted },
      currentStepId: 'step-1',
      isRunning: false,
      validationResults: {},
      logs: [...state.logs.slice(-80), `[SYSTEM] Switched active tutorial to game: ${gameId}`],
    };
  });
};

export const setLanguage = (lang: Language) => {
  workspaceStore.setState((state) => ({
    ...state,
    activeLanguage: lang,
  }));
};

export const setDifficulty = (diff: DifficultyLevel) => {
  workspaceStore.setState((state) => ({
    ...state,
    difficulty: diff,
  }));
};

export const toggleCrtMode = () => {
  workspaceStore.setState((state) => ({
    ...state,
    crtModeEnabled: !state.crtModeEnabled,
  }));
};

export const updateCode = (lang: Language, code: string) => {
  workspaceStore.setState((state) => {
    const activeGame = state.activeGameId || 'neon-dungeon';
    const existingGameCodes = state.codeMapByGame?.[activeGame] || { ...state.codeMap };

    return {
      ...state,
      codeMap: {
        ...state.codeMap,
        [lang]: code,
      },
      codeMapByGame: {
        ...(state.codeMapByGame || {}),
        [activeGame]: {
          ...existingGameCodes,
          [lang]: code,
        },
      },
    };
  });
};

export const appendLog = (msg: string) => {
  workspaceStore.setState((state) => ({
    ...state,
    logs: [...state.logs.slice(-100), msg],
  }));
};

export const clearLogs = () => {
  workspaceStore.setState((state) => ({
    ...state,
    logs: [],
  }));
};

export const setIsRunning = (val: boolean) => {
  workspaceStore.setState((state) => ({
    ...state,
    isRunning: val,
  }));
};

export const setCurrentStepId = (stepId: string) => {
  workspaceStore.setState((state) => ({
    ...state,
    currentStepId: stepId,
    validationResults: {},
  }));
};

export const setStepCompleted = (stepId: string, completed = true) => {
  workspaceStore.setState((state) => {
    const activeGame = state.activeGameId || 'neon-dungeon';
    const existingGameCompleted = state.completedStepsByGame?.[activeGame] || {};

    return {
      ...state,
      completedSteps: {
        ...state.completedSteps,
        [stepId]: completed,
      },
      completedStepsByGame: {
        ...(state.completedStepsByGame || {}),
        [activeGame]: {
          ...existingGameCompleted,
          [stepId]: completed,
        },
      },
    };
  });
};

export const setValidationResult = (testId: string, passed: boolean, message: string) => {
  workspaceStore.setState((state) => ({
    ...state,
    validationResults: {
      ...state.validationResults,
      [testId]: { passed, message },
    },
  }));
};

export const toggleSound = () => {
  workspaceStore.setState((state) => ({
    ...state,
    soundEnabled: !state.soundEnabled,
  }));
};

// Gamification actions
export const addXp = (amount: number, reason?: string) => {
  workspaceStore.setState((state) => {
    const oldXp = state.xp;
    const newXp = oldXp + amount;
    const oldRank = getRankForXp(oldXp);
    const newRank = getRankForXp(newXp);

    const levelUp = newRank.level > oldRank.level;
    const logMsg = reason
      ? `[XP GAINED] +${amount} XP (${reason}) -> Total: ${newXp} XP`
      : `[XP GAINED] +${amount} XP -> Total: ${newXp} XP`;

    return {
      ...state,
      xp: newXp,
      logs: [...state.logs.slice(-100), logMsg],
      xpFloatMessage: reason ? `+${amount} XP: ${reason}` : `+${amount} XP`,
      levelUpNotification: levelUp
        ? {
            oldLevel: oldRank.level,
            newLevel: newRank.level,
            title: newRank.title,
            badge: newRank.badge,
          }
        : state.levelUpNotification,
    };
  });
};

export const incrementCombo = () => {
  workspaceStore.setState((state) => {
    const nextCombo = state.comboStreak + 1;
    let xpBonus = 0;
    let bonusReason = '';

    if (nextCombo === 3) {
      xpBonus = 50;
      bonusReason = '3x Combo Streak Bonus!';
    } else if (nextCombo === 5) {
      xpBonus = 150;
      bonusReason = '5x Combo Streak Bonus!';
    } else if (nextCombo === 10) {
      xpBonus = 300;
      bonusReason = '10x ULTRA Combo Streak Bonus!';
    }

    const updatedXp = state.xp + xpBonus;
    const oldRank = getRankForXp(state.xp);
    const newRank = getRankForXp(updatedXp);
    const levelUp = newRank.level > oldRank.level;

    return {
      ...state,
      comboStreak: nextCombo,
      xp: updatedXp,
      xpFloatMessage: bonusReason ? `🔥 ${bonusReason}` : state.xpFloatMessage,
      levelUpNotification: levelUp
        ? {
            oldLevel: oldRank.level,
            newLevel: newRank.level,
            title: newRank.title,
            badge: newRank.badge,
          }
        : state.levelUpNotification,
    };
  });
};

export const resetCombo = () => {
  workspaceStore.setState((state) => ({
    ...state,
    comboStreak: 0,
  }));
};

export const completeQuest = (questId: string, xpReward: number, questTitle: string) => {
  workspaceStore.setState((state) => {
    if (state.completedQuests[questId]) return state;

    const newCompleted = { ...state.completedQuests, [questId]: true };
    const oldXp = state.xp;
    const newXp = oldXp + xpReward;
    const oldRank = getRankForXp(oldXp);
    const newRank = getRankForXp(newXp);
    const levelUp = newRank.level > oldRank.level;

    return {
      ...state,
      completedQuests: newCompleted,
      xp: newXp,
      logs: [...state.logs.slice(-100), `[QUEST CLAIMED] Completed '${questTitle}'! +${xpReward} XP!`],
      xpFloatMessage: `🎯 QUEST REWARD! +${xpReward} XP`,
      levelUpNotification: levelUp
        ? {
            oldLevel: oldRank.level,
            newLevel: newRank.level,
            title: newRank.title,
            badge: newRank.badge,
          }
        : state.levelUpNotification,
    };
  });
};

export const dismissLevelUp = () => {
  workspaceStore.setState((state) => ({
    ...state,
    levelUpNotification: null,
  }));
};

export const dismissXpFloat = () => {
  workspaceStore.setState((state) => ({
    ...state,
    xpFloatMessage: null,
  }));
};

// React hook wrapper
export function useWorkspaceStore<T>(selector: (state: WorkspaceState) => T): T {
  return useStore(workspaceStore, selector);
}
