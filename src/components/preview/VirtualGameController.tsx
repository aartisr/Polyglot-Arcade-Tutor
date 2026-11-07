import React, { useCallback } from 'react';
import { gameRunner } from '../../services/GameRunner';
import { arcadeAudio } from '../../utils/audio';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  RotateCcw,
  Zap,
  Crosshair,
} from 'lucide-react';

interface VirtualGameControllerProps {
  gameId: string;
  isRunning: boolean;
  className?: string;
}

export const VirtualGameController: React.FC<VirtualGameControllerProps> = ({
  gameId,
  isRunning,
  className = '',
}) => {
  const isInvaders = gameId === 'cyber-invaders';

  const triggerKeyDown = useCallback((key: string) => {
    gameRunner.handleKeyDown({ key } as KeyboardEvent);
  }, []);

  const triggerKeyUp = useCallback((key: string) => {
    gameRunner.handleKeyUp({ key } as KeyboardEvent);
  }, []);

  const createTouchHandler = (key: string) => {
    return {
      onTouchStart: (e: React.TouchEvent) => {
        e.preventDefault();
        triggerKeyDown(key);
      },
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault();
        triggerKeyUp(key);
      },
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        triggerKeyDown(key);
      },
      onMouseUp: (e: React.MouseEvent) => {
        e.preventDefault();
        triggerKeyUp(key);
      },
      onMouseLeave: () => {
        triggerKeyUp(key);
      },
    };
  };

  return (
    <div
      className={`w-full max-w-md mx-auto p-3 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-xl select-none ${className}`}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Touch Virtual Controller</span>
        </span>
        <span className="text-[10px] font-mono text-cyan-400">
          {isInvaders ? 'Strafe & Fire' : 'D-Pad Movement'}
        </span>
      </div>

      {isInvaders ? (
        /* Cyber Invaders Layout: Strafe Left/Right + Fire + Restart */
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Strafe Left & Right */}
          <div className="flex items-center gap-2">
            <button
              {...createTouchHandler('ArrowLeft')}
              className="w-14 h-14 rounded-xl bg-slate-900 border-2 border-slate-700 active:border-pink-500 active:bg-pink-950/60 text-slate-200 active:text-pink-300 flex flex-col items-center justify-center transition-all shadow-md active:scale-95 touch-manipulation cursor-pointer"
              title="Strafe Left"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-[9px] font-mono mt-0.5">LEFT</span>
            </button>

            <button
              {...createTouchHandler('ArrowRight')}
              className="w-14 h-14 rounded-xl bg-slate-900 border-2 border-slate-700 active:border-pink-500 active:bg-pink-950/60 text-slate-200 active:text-pink-300 flex flex-col items-center justify-center transition-all shadow-md active:scale-95 touch-manipulation cursor-pointer"
              title="Strafe Right"
            >
              <ArrowRight className="w-6 h-6" />
              <span className="text-[9px] font-mono mt-0.5">RIGHT</span>
            </button>
          </div>

          {/* Reset Key */}
          <button
            {...createTouchHandler('r')}
            className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 active:border-amber-500 active:bg-amber-950/60 text-amber-400 flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer"
            title="Restart / Reset Loop"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[8px] font-mono font-bold">R</span>
          </button>

          {/* Primary Plasma Laser Fire Button */}
          <button
            {...createTouchHandler(' ')}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 active:from-pink-400 active:to-rose-500 text-slate-950 font-black text-xs flex flex-col items-center justify-center shadow-lg shadow-pink-500/25 active:scale-95 transition-all touch-manipulation cursor-pointer"
            title="Fire Plasma Laser (SPACE)"
          >
            <Zap className="w-6 h-6 fill-current mb-0.5" />
            <span className="text-[10px] tracking-wider font-mono">FIRE</span>
          </button>
        </div>
      ) : (
        /* Neon Dungeon Layout: 4-Way D-Pad + Reset Key */
        <div className="flex items-center justify-around py-1">
          {/* 4-Way D-Pad Grid */}
          <div className="grid grid-cols-3 gap-1.5 w-36 h-36">
            <div />
            <button
              {...createTouchHandler('ArrowUp')}
              className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-slate-700 active:border-cyan-400 active:bg-cyan-950/60 text-slate-200 active:text-cyan-300 flex items-center justify-center shadow-md active:scale-95 touch-manipulation cursor-pointer"
              title="Move Up"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />

            <button
              {...createTouchHandler('ArrowLeft')}
              className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-slate-700 active:border-cyan-400 active:bg-cyan-950/60 text-slate-200 active:text-cyan-300 flex items-center justify-center shadow-md active:scale-95 touch-manipulation cursor-pointer"
              title="Move Left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              {...createTouchHandler('r')}
              className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 active:border-amber-500 text-slate-500 active:text-amber-400 flex flex-col items-center justify-center text-[9px] font-mono transition-all active:scale-95 touch-manipulation cursor-pointer"
              title="Reset Hero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>R</span>
            </button>

            <button
              {...createTouchHandler('ArrowRight')}
              className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-slate-700 active:border-cyan-400 active:bg-cyan-950/60 text-slate-200 active:text-cyan-300 flex items-center justify-center shadow-md active:scale-95 touch-manipulation cursor-pointer"
              title="Move Right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div />
            <button
              {...createTouchHandler('ArrowDown')}
              className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-slate-700 active:border-cyan-400 active:bg-cyan-950/60 text-slate-200 active:text-cyan-300 flex items-center justify-center shadow-md active:scale-95 touch-manipulation cursor-pointer"
              title="Move Down"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <div />
          </div>

          {/* Quick Action Hint */}
          <div className="flex flex-col items-center justify-center text-center space-y-1 text-slate-400 px-2">
            <span className="text-xs font-mono font-bold text-cyan-400">WASD / ARROWS</span>
            <p className="text-[10px] text-slate-500 max-w-[120px] leading-tight">
              Tap buttons to steer your cyber knight in 60 FPS
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
