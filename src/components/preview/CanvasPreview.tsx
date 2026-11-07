import React, { useRef, useState } from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { getGameById } from '../../data/gamesRegistry';
import { useGameRunner } from '../../services';
import { VirtualGameController } from './VirtualGameController';
import { Play, Square, Gamepad2, Info, Gauge, Smartphone } from 'lucide-react';

interface CanvasPreviewProps {
  currentStepId: string;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ currentStepId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showTouchControls, setShowTouchControls] = useState<boolean>(true);

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

  React.useEffect(() => {
    const handleRunEvent = () => {
      toggleRun();
    };
    window.addEventListener('arcade-run-code', handleRunEvent);
    return () => window.removeEventListener('arcade-run-code', handleRunEvent);
  }, [toggleRun]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 overflow-y-auto">
      {/* Canvas Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200 truncate max-w-[150px] sm:max-w-none">
            {activeGame.title}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded hidden xs:inline">
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Touch D-Pad Toggle */}
          <button
            onClick={() => setShowTouchControls(!showTouchControls)}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer ${
              showTouchControls
                ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
            title="Toggle On-Screen Virtual Touch Gamepad"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">D-Pad</span>
          </button>

          <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 hidden sm:inline">Diff:</span>
            <span className={`font-bold ${diffParams.color} text-[11px]`}>
              Lvl {difficulty} ({diffParams.speedMult}x)
            </span>
          </div>

          <button
            onClick={toggleRun}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
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
      <div className="flex-1 flex flex-col items-center justify-start sm:justify-center p-3 bg-slate-950 relative overflow-y-auto space-y-3">
        <div
          className={`relative rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-950/20 w-full max-w-[380px] aspect-square flex items-center justify-center ${
            crtModeEnabled ? 'crt-overlay' : ''
          }`}
        >
          <canvas
            id="game-canvas"
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-full object-contain bg-slate-950 cursor-crosshair touch-none"
            tabIndex={0}
            title={activeGame.controlsTip}
          />

          {!isRunning && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 mb-2 shadow-lg shadow-cyan-500/10 text-3xl">
                {activeGame.badge}
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">{activeGame.title}</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-3 font-mono">
                {diffParams.label}
              </p>
              <button
                onClick={toggleRun}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Game Engine
              </button>
            </div>
          )}
        </div>

        {/* Virtual On-Screen Gamepad for Mobile & Touchscreens */}
        {showTouchControls && (
          <VirtualGameController
            gameId={activeGame.id}
            isRunning={isRunning}
            className="w-full shrink-0"
          />
        )}

        {/* Controls Tip */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 text-center max-w-sm px-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{activeGame.controlsTip}</span>
        </div>
      </div>
    </div>
  );
};
