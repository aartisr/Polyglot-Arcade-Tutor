import React, { useEffect, useRef, useState } from 'react';
import { useWorkspaceStore, appendLog, setIsRunning, addXp, incrementCombo } from '../../store/workspaceStore';
import { DifficultyLevel } from '../../types/lesson';
import { arcadeAudio } from '../../utils/audio';
import { unlockAchievement } from '../../lib/achievementService';
import { Play, Square, Gamepad2, Info, Gauge } from 'lucide-react';

interface CanvasPreviewProps {
  currentStepId: string;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ currentStepId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const codeMap = useWorkspaceStore((state) => state.codeMap);
  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const difficulty = useWorkspaceStore((state) => state.difficulty);
  const crtModeEnabled = useWorkspaceStore((state) => state.crtModeEnabled);

  const [fps, setFps] = useState<number>(60);
  const animationFrameId = useRef<number | null>(null);

  // Keyboard state for canvas interaction
  const keysPressed = useRef<Record<string, boolean>>({});

  const getDifficultyParams = (level: DifficultyLevel) => {
    switch (level) {
      case 1:
        return {
          speedMult: 1.0,
          enemySpeedMult: 0.8,
          walls: [
            { x: 150, y: 100, width: 24, height: 200, color: '#ef4444' },
          ],
          label: 'Lvl 1: 1.0x Speed (1 Wall)',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
        };
      case 2:
        return {
          speedMult: 1.25,
          enemySpeedMult: 1.0,
          walls: [
            { x: 150, y: 80, width: 24, height: 240, color: '#ef4444' },
            { x: 260, y: 160, width: 100, height: 24, color: '#ef4444' },
          ],
          label: 'Lvl 2: 1.25x Speed (2 Walls)',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
        };
      case 3:
        return {
          speedMult: 1.5,
          enemySpeedMult: 1.3,
          walls: [
            { x: 120, y: 60, width: 20, height: 280, color: '#f59e0b' },
            { x: 200, y: 160, width: 120, height: 20, color: '#f59e0b' },
            { x: 300, y: 40, width: 20, height: 220, color: '#f59e0b' },
          ],
          label: 'Lvl 3: 1.5x Speed (3 Walls)',
          color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
        };
      case 4:
        return {
          speedMult: 1.75,
          enemySpeedMult: 1.6,
          walls: [
            { x: 90, y: 50, width: 20, height: 300, color: '#ea580c' },
            { x: 160, y: 140, width: 140, height: 20, color: '#ea580c' },
            { x: 240, y: 40, width: 20, height: 180, color: '#ea580c' },
            { x: 240, y: 260, width: 120, height: 20, color: '#ea580c' },
          ],
          label: 'Lvl 4: 1.75x Speed (4 Walls)',
          color: 'text-orange-400 bg-orange-950/60 border-orange-800/60',
        };
      case 5:
        return {
          speedMult: 2.0,
          enemySpeedMult: 2.0,
          walls: [
            { x: 80, y: 50, width: 20, height: 300, color: '#dc2626' },
            { x: 160, y: 140, width: 140, height: 20, color: '#dc2626' },
            { x: 240, y: 40, width: 20, height: 180, color: '#dc2626' },
            { x: 240, y: 260, width: 120, height: 20, color: '#dc2626' },
          ],
          label: 'Lvl 5: 2.0x Speed (Dense + 2 Enemies)',
          color: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
        };
      default:
        return {
          speedMult: 1.5,
          enemySpeedMult: 1.3,
          walls: [
            { x: 150, y: 80, width: 24, height: 240, color: '#ef4444' },
            { x: 260, y: 160, width: 100, height: 24, color: '#ef4444' },
          ],
          label: 'Lvl 3',
          color: 'text-cyan-400',
        };
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMoveKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' '].includes(e.key);
      if (isMoveKey) {
        if (document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          if (isRunning) {
            arcadeAudio.playPlayerMove();
          }
        }
      }
      keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const userCode = codeMap[activeLanguage] || '';

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    if (activeLanguage === 'javascript') {
      executeJavaScriptCode(canvas, ctx, userCode);
    } else if (activeLanguage === 'python') {
      executePythonSimulatedCode(canvas, ctx, userCode, currentStepId);
    } else if (activeLanguage === 'java') {
      executeJavaSimulatedCode(canvas, ctx, userCode, currentStepId);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning, activeLanguage, currentStepId, difficulty]);

  const executeJavaScriptCode = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, code: string) => {
    const diffParams = getDifficultyParams(difficulty);
    arcadeAudio.playStartEngine();
    appendLog(`[SYSTEM] Initializing JavaScript runtime execution (Level ${difficulty} - ${diffParams.speedMult}x speed multiplier)...`);

    const customConsole = {
      log: (...args: any[]) => {
        const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        appendLog(`[JS LOG] ${msg}`);
      },
      error: (...args: any[]) => {
        const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        appendLog(`[JS ERROR] ${msg}`);
      },
      warn: (...args: any[]) => {
        const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        appendLog(`[JS WARN] ${msg}`);
      }
    };

    try {
      const playCollision = () => arcadeAudio.playCollision();
      const playMove = () => arcadeAudio.playPlayerMove();

      const runner = new Function('document', 'window', 'console', 'canvas', 'ctx', 'requestAnimationFrame', 'difficultyLevel', 'speedMultiplier', 'playCollision', 'playMove', `
        try {
          ${code}
        } catch (err) {
          console.error(err.message || String(err));
        }
      `);

      let lastTime = performance.now();
      let frameCount = 0;

      const safeRequestAnimationFrame = (callback: FrameRequestCallback) => {
        animationFrameId.current = window.requestAnimationFrame((timestamp) => {
          frameCount++;
          if (timestamp - lastTime >= 1000) {
            setFps(frameCount);
            frameCount = 0;
            lastTime = timestamp;
          }
          callback(timestamp);
        });
        return animationFrameId.current;
      };

      const mockDocument = {
        getElementById: (id: string) => (id === 'game-canvas' ? canvas : null),
        addEventListener: window.addEventListener.bind(window),
        removeEventListener: window.removeEventListener.bind(window),
      };

      runner(mockDocument, window, customConsole, canvas, ctx, safeRequestAnimationFrame, difficulty, diffParams.speedMult, playCollision, playMove);
      appendLog(`[SYSTEM] JavaScript sandbox running at 60 FPS (Level ${difficulty}).`);
    } catch (err: any) {
      appendLog(`[ERROR] Compilation / Execution error: ${err.message || String(err)}`);
      setIsRunning(false);
    }
  };

  const executePythonSimulatedCode = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, code: string, stepId: string) => {
    const diffParams = getDifficultyParams(difficulty);
    arcadeAudio.playStartEngine();
    appendLog(`[SYSTEM] Initializing Python Canvas Engine (Difficulty Level ${difficulty})...`);

    const baseSpeed = 4 * diffParams.speedMult;
    const enemyBaseSpeed = 2 * diffParams.enemySpeedMult;

    const state = {
      x: 180,
      y: 180,
      width: 32,
      height: 32,
      vx: 0,
      vy: 0,
      speed: baseSpeed,
      score: 0,
      gameOver: false,
      enemy: { x: 300, y: 100, width: 28, height: 28, vx: enemyBaseSpeed, vy: enemyBaseSpeed },
      enemy2: { x: 80, y: 300, width: 24, height: 24, vx: -enemyBaseSpeed * 0.9, vy: enemyBaseSpeed * 0.9 },
      gem: { x: 200, y: 200, width: 20, height: 20 },
      walls: diffParams.walls,
    };

    let lastTime = performance.now();
    let frameCount = 0;

    const loop = (timestamp: number) => {
      frameCount++;
      if (timestamp - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = timestamp;
      }

      state.vx = 0; state.vy = 0;
      if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) state.vy = -state.speed;
      if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) state.vy = state.speed;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) state.vx = -state.speed;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) state.vx = state.speed;

      if (stepId !== 'step-1') {
        state.x += state.vx;
        state.y += state.vy;
      }

      const prevX = state.x;
      const prevY = state.y;

      state.x = Math.max(0, Math.min(400 - state.width, state.x));
      state.y = Math.max(0, Math.min(400 - state.height, state.y));

      if ((prevX !== state.x || prevY !== state.y) && (state.x === 0 || state.x === 400 - state.width || state.y === 0 || state.y === 400 - state.height)) {
        arcadeAudio.playCollision();
      }

      if (stepId === 'step-3' || stepId === 'step-4') {
        for (const w of state.walls) {
          if (state.x < w.x + w.width && state.x + state.width > w.x &&
              state.y < w.y + w.height && state.y + state.height > w.y) {
            state.x -= state.vx;
            state.y -= state.vy;
            arcadeAudio.playCollision();
          }
        }
      }

      if (stepId === 'step-4') {
        state.enemy.x += state.enemy.vx;
        state.enemy.y += state.enemy.vy;
        if (state.enemy.x < 40 || state.enemy.x > 350) state.enemy.vx *= -1;
        if (state.enemy.y < 40 || state.enemy.y > 330) state.enemy.vy *= -1;

        if (difficulty === 5) {
          state.enemy2.x += state.enemy2.vx;
          state.enemy2.y += state.enemy2.vy;
          if (state.enemy2.x < 40 || state.enemy2.x > 350) state.enemy2.vx *= -1;
          if (state.enemy2.y < 40 || state.enemy2.y > 330) state.enemy2.vy *= -1;
        }

        if (state.x < state.gem.x + state.gem.width && state.x + state.width > state.gem.x &&
            state.y < state.gem.y + state.gem.height && state.y + state.height > state.gem.y) {
          state.score += 100;
          arcadeAudio.playGemPickup();
          addXp(25, 'Gem Collected');
          incrementCombo();
          state.gem.x = (state.gem.x + 90) % 300 + 40;
          state.gem.y = (state.gem.y + 70) % 300 + 40;
        }
      }

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 400, 400);

      // Synthwave Cyber Grid Floor
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 400; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(400, i); ctx.stroke();
      }

      if (stepId === 'step-3' || stepId === 'step-4') {
        for (const w of state.walls) {
          ctx.fillStyle = w.color;
          ctx.fillRect(w.x, w.y, w.width, w.height);
        }
      }

      if (stepId === 'step-4') {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(state.gem.x, state.gem.y, state.gem.width, state.gem.height);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(state.enemy.x, state.enemy.y, state.enemy.width, state.enemy.height);
        if (difficulty === 5) {
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(state.enemy2.x, state.enemy2.y, state.enemy2.width, state.enemy2.height);
        }
      }

      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(state.x, state.y, state.width, state.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(state.x + 8, state.y + 8, 16, 16);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(`Python Engine (Lvl ${difficulty} - ${diffParams.speedMult}x)`, 16, 26);
      if (stepId === 'step-4') {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px JetBrains Mono, monospace';
        ctx.fillText(`SCORE: ${state.score} PTS`, 16, 50);
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
  };

  const executeJavaSimulatedCode = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, code: string, stepId: string) => {
    const diffParams = getDifficultyParams(difficulty);
    arcadeAudio.playStartEngine();
    appendLog(`[SYSTEM] Initializing Java Graphics2D Engine (Difficulty Level ${difficulty})...`);

    const baseSpeed = 4 * diffParams.speedMult;
    const enemyBaseSpeed = 2 * diffParams.enemySpeedMult;

    const state = {
      x: 180,
      y: 180,
      size: 32,
      vx: 0,
      vy: 0,
      speed: baseSpeed,
      score: 0,
      enemy: { x: 300, y: 100, width: 28, height: 28, vx: enemyBaseSpeed, vy: enemyBaseSpeed },
      enemy2: { x: 80, y: 300, width: 24, height: 24, vx: -enemyBaseSpeed * 0.9, vy: enemyBaseSpeed * 0.9 },
      gem: { x: 200, y: 200, width: 20, height: 20 },
      walls: diffParams.walls,
    };

    let lastTime = performance.now();
    let frameCount = 0;

    const loop = (timestamp: number) => {
      frameCount++;
      if (timestamp - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = timestamp;
      }

      state.vx = 0; state.vy = 0;
      if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) state.vy = -state.speed;
      if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) state.vy = state.speed;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) state.vx = -state.speed;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) state.vx = state.speed;

      if (stepId !== 'step-1') {
        state.x += state.vx;
        state.y += state.vy;
      }

      const prevX = state.x;
      const prevY = state.y;

      state.x = Math.max(0, Math.min(400 - state.size, state.x));
      state.y = Math.max(0, Math.min(400 - state.size, state.y));

      if ((prevX !== state.x || prevY !== state.y) && (state.x === 0 || state.x === 400 - state.size || state.y === 0 || state.y === 400 - state.size)) {
        arcadeAudio.playCollision();
      }

      if (stepId === 'step-3' || stepId === 'step-4') {
        for (const w of state.walls) {
          if (state.x < w.x + w.width && state.x + state.size > w.x &&
              state.y < w.y + w.height && state.y + state.size > w.y) {
            state.x -= state.vx;
            state.y -= state.vy;
            arcadeAudio.playCollision();
          }
        }
      }

      if (stepId === 'step-4') {
        state.enemy.x += state.enemy.vx;
        state.enemy.y += state.enemy.vy;
        if (state.enemy.x < 40 || state.enemy.x > 350) state.enemy.vx *= -1;
        if (state.enemy.y < 40 || state.enemy.y > 330) state.enemy.vy *= -1;

        if (difficulty === 5) {
          state.enemy2.x += state.enemy2.vx;
          state.enemy2.y += state.enemy2.vy;
          if (state.enemy2.x < 40 || state.enemy2.x > 350) state.enemy2.vx *= -1;
          if (state.enemy2.y < 40 || state.enemy2.y > 330) state.enemy2.vy *= -1;
        }

        if (state.x < state.gem.x + state.gem.width && state.x + state.size > state.gem.x &&
            state.y < state.gem.y + state.gem.height && state.y + state.size > state.gem.y) {
          state.score += 100;
          arcadeAudio.playGemPickup();
          addXp(25, 'Gem Collected');
          incrementCombo();
          state.gem.x = (state.gem.x + 90) % 300 + 40;
          state.gem.y = (state.gem.y + 70) % 300 + 40;
        }
      }

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 400, 400);

      // Synthwave Cyber Grid Floor
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 400; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(400, i); ctx.stroke();
      }

      if (stepId === 'step-3' || stepId === 'step-4') {
        for (const w of state.walls) {
          ctx.fillStyle = w.color;
          ctx.fillRect(w.x, w.y, w.width, w.height);
        }
      }

      if (stepId === 'step-4') {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(state.gem.x, state.gem.y, state.gem.width, state.gem.height);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(state.enemy.x, state.enemy.y, state.enemy.width, state.enemy.height);
        if (difficulty === 5) {
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(state.enemy2.x, state.enemy2.y, state.enemy2.width, state.enemy2.height);
        }
      }

      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(state.x, state.y, state.size, state.size);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(state.x + 8, state.y + 8, 16, 16);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(`Java Graphics2D (Lvl ${difficulty} - ${diffParams.speedMult}x)`, 16, 26);
      if (stepId === 'step-4') {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px JetBrains Mono, monospace';
        ctx.fillText(`SCORE: ${state.score} PTS`, 16, 50);
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
  };

  const handleToggleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      arcadeAudio.playClick();
      appendLog(`[SYSTEM] Execution paused by user.`);
    } else {
      arcadeAudio.playStartEngine();
      setIsRunning(true);
      if (difficulty === 5) {
        unlockAchievement('nightmare_runner');
      }
    }
  };

  const activeDiffParams = getDifficultyParams(difficulty);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      {/* Canvas Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">2D Game Screen</span>
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

        {/* Active Difficulty Readout Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Difficulty:</span>
            <span className={`font-bold ${activeDiffParams.color} px-1.5 py-0.5 rounded`}>
              Lvl {difficulty} ({activeDiffParams.speedMult}x)
            </span>
          </div>

          <button
            onClick={handleToggleRun}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
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
        <div className={`relative rounded-lg overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-950/20 ${crtModeEnabled ? 'crt-overlay' : ''}`}>
          <canvas
            id="game-canvas"
            ref={canvasRef}
            width={400}
            height={400}
            className="block w-[360px] h-[360px] sm:w-[400px] sm:h-[400px] bg-slate-950 cursor-crosshair tabIndex={0}"
            title="Click canvas and use WASD or Arrow keys to move hero"
          />

          {!isRunning && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Canvas Sandbox Ready</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-3">
                Parameters: <span className={`font-mono font-bold border px-1.5 py-0.5 rounded ${activeDiffParams.color}`}>{activeDiffParams.label}</span>
              </p>
              <button
                onClick={handleToggleRun}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Game Engine
              </button>
            </div>
          )}
        </div>

        {/* Controls Tip */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Use <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">W</kbd> <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">A</kbd> <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">S</kbd> <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">D</kbd> or Arrow Keys on canvas.</span>
        </div>
      </div>
    </div>
  );
};
