import React, { useRef } from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { getGameById } from '../../data/gamesRegistry';
import { useGameRunner } from '../../services';
import { Play, Square, Gamepad2, Info, Gauge } from 'lucide-react';

interface CanvasPreviewProps {
  currentStepId: string;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ currentStepId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const difficulty = useWorkspaceStore((state) => state.difficulty);
  const crtModeEnabled = useWorkspaceStore((state) => state.crtModeEnabled);

  const activeGame = getGameById(activeGameId);
  const diffParams = activeGame.getDifficultyParams(difficulty);

  // Delegate execution lifecycle, animation frame loop, and key listeners to GameRunner service
  const { fps, isRunning, toggleRun } = useGameRunner({
    canvasRef,
    game: activeGame,
    stepId: currentStepId,
  });

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      {/* Canvas Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">{activeGame.title}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
            400x400
          </span>
          {isRunning && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {fps} FPS
            </span>
          )}
        </div>

        {/* Active Difficulty Readout Badge & Run/Pause Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Diff:</span>
            <span className={`font-bold ${diffParams.color} px-1.5 py-0.5 rounded text-[11px]`}>
              Lvl {difficulty} ({diffParams.speedMult}x)
            </span>
          </div>

          <button
            onClick={toggleRun}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-neon-cyan font-bold'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Canvas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas Viewport Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 bg-slate-950 relative overflow-hidden">
        <div
          className={`relative rounded-lg overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-950/20 ${
            crtModeEnabled ? 'crt-overlay' : ''
          }`}
        >
          <canvas
            id="game-canvas"
            ref={canvasRef}
            width={400}
            height={400}
            className="block w-[360px] h-[360px] sm:w-[400px] sm:h-[400px] bg-slate-950 cursor-crosshair"
            tabIndex={0}
            title={activeGame.controlsTip}
          />

          {!isRunning && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10 text-3xl">
                {activeGame.badge}
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">{activeGame.title}</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-3 font-mono">
                {diffParams.label}
              </p>
              <button
                onClick={toggleRun}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Game Engine
              </button>
            </div>
          )}
        </div>

        {/* Controls Tip */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 text-center max-w-sm">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{activeGame.controlsTip}</span>
        </div>
      </div>
    </div>
  );
};
