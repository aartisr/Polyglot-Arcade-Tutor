import { useState, useEffect, useRef, useCallback } from 'react';
import { gameRunner, RunnerExecutionOptions } from './GameRunner';
import { GameTemplate, EngineHooks } from '../types/game';
import { Language, DifficultyLevel } from '../types/lesson';
import { useWorkspaceStore, setIsRunning, appendLog, addXp, incrementCombo } from '../store/workspaceStore';
import { arcadeAudio } from '../utils/audio';
import { unlockAchievement } from '../lib/achievementService';

export interface UseGameRunnerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  game: GameTemplate;
  stepId: string;
}

export interface UseGameRunnerReturn {
  fps: number;
  isRunning: boolean;
  toggleRun: () => void;
  start: () => void;
  stop: () => void;
}

/**
 * Custom React hook that connects CanvasPreview to the GameRunner service.
 * Manages game lifecycle, keyboard interaction, audio hooks, and performance metrics.
 */
export function useGameRunner({ canvasRef, game, stepId }: UseGameRunnerProps): UseGameRunnerReturn {
  const [fps, setFps] = useState<number>(60);

  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const codeMap = useWorkspaceStore((state) => state.codeMap);
  const difficulty = useWorkspaceStore((state) => state.difficulty);

  const activeCode = codeMap[activeLanguage] || '';

  // Setup window key listeners connected to the GameRunner service
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in Monaco editor or input fields
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }
      const intercepted = gameRunner.handleKeyDown(e);
      if (intercepted) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      gameRunner.handleKeyUp(e);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Synchronize execution with isRunning state and configuration changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isRunning) {
      gameRunner.stop();
      return;
    }

    const engineHooks: EngineHooks = {
      playCollision: () => arcadeAudio.playCollision(),
      playMove: () => arcadeAudio.playPlayerMove(),
      playScore: () => arcadeAudio.playGemPickup(),
      addXp: (amount, reason) => addXp(amount, reason),
      incrementCombo: () => incrementCombo(),
      appendLog: (msg) => appendLog(msg),
      unlockAchievement: (id) => unlockAchievement(id),
    };

    const options: RunnerExecutionOptions = {
      game,
      language: activeLanguage,
      code: activeCode,
      stepId,
      difficulty,
      hooks: engineHooks,
      onFpsUpdate: (newFps) => setFps(newFps),
      onError: (err) => {
        appendLog(`[GameRunner Error] ${err.message}`);
        setIsRunning(false);
      },
      onStateChange: (running) => {
        if (!running && isRunning) {
          setIsRunning(false);
        }
      },
    };

    gameRunner.start(canvas, options);

    return () => {
      gameRunner.stop();
    };
  }, [canvasRef, isRunning, game.id, activeLanguage, activeCode, stepId, difficulty]);

  const toggleRun = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      arcadeAudio.playClick();
      appendLog('[SYSTEM] Game execution paused by user.');
    } else {
      arcadeAudio.playStartEngine();
      setIsRunning(true);
      if (difficulty === 5) {
        unlockAchievement('nightmare_runner');
      }
    }
  }, [isRunning, difficulty]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    fps,
    isRunning,
    toggleRun,
    start,
    stop,
  };
}
