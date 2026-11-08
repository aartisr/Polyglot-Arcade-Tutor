import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { getGameById } from '../../data/gamesRegistry';
import { TouchControl } from '../../types/game';
import { gameRunner } from '../../services/GameRunner';

interface VirtualGameControllerProps {
  gameId: string;
  isRunning: boolean;
  className?: string;
}

const icons = {
  up: ArrowUp,
  down: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
  fire: Zap,
  restart: RotateCcw,
} satisfies Record<TouchControl['icon'], typeof ArrowUp>;

export const VirtualGameController: React.FC<VirtualGameControllerProps> = ({ gameId, isRunning, className = '' }) => {
  const controller = getGameById(gameId).touchControls;
  if (!controller?.buttons.length) return null;

  return (
    <div className={`mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl select-none ${className}`} aria-label={`${controller.label} touch controller`}>
      <div className="mb-2 flex items-center justify-between gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <span>Touch controls</span>
        <span className={isRunning ? 'text-emerald-400' : 'text-slate-500'}>{controller.label}</span>
      </div>
      <div className="mx-auto grid max-w-xs grid-cols-3 grid-rows-3 gap-2">
        {controller.buttons.map((control) => {
          const Icon = icons[control.icon];
          return (
            <button
              key={`${control.row}-${control.column}-${control.key}`}
              type="button"
              aria-label={control.label}
              title={control.label}
              style={{ gridRow: control.row, gridColumn: control.column, touchAction: 'none' }}
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                gameRunner.handleKeyDown({ key: control.key } as KeyboardEvent);
              }}
              onPointerUp={() => gameRunner.handleKeyUp({ key: control.key } as KeyboardEvent)}
              onPointerCancel={() => gameRunner.handleKeyUp({ key: control.key } as KeyboardEvent)}
              onLostPointerCapture={() => gameRunner.handleKeyUp({ key: control.key } as KeyboardEvent)}
              onContextMenu={(event) => event.preventDefault()}
              className={`flex h-14 min-w-0 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition-colors active:scale-95 ${control.emphasis ? 'border-cyan-400 bg-cyan-500 text-slate-950 active:bg-cyan-300' : 'border-slate-700 bg-slate-900 text-slate-200 active:border-cyan-400 active:text-cyan-300'}`}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-0.5 truncate text-[10px]">{control.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
