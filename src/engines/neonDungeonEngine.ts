import { DifficultyLevel } from '../types/lesson';
import { GameEngineStrategy, DifficultyParamDetail, EngineHooks } from '../types/game';

export const neonDungeonDifficultyConfig = (level: DifficultyLevel): DifficultyParamDetail => {
  switch (level) {
    case 1:
      return {
        speedMult: 1.0,
        hazardSpeedMult: 0.8,
        label: 'Lvl 1: 1.0x Speed (1 Wall)',
        color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
        extraConfig: {
          walls: [{ x: 150, y: 100, width: 24, height: 200, color: '#ef4444' }],
        },
      };
    case 2:
      return {
        speedMult: 1.25,
        hazardSpeedMult: 1.0,
        label: 'Lvl 2: 1.25x Speed (2 Walls)',
        color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
        extraConfig: {
          walls: [
            { x: 150, y: 80, width: 24, height: 240, color: '#ef4444' },
            { x: 260, y: 160, width: 100, height: 24, color: '#ef4444' },
          ],
        },
      };
    case 3:
      return {
        speedMult: 1.5,
        hazardSpeedMult: 1.3,
        label: 'Lvl 3: 1.5x Speed (3 Walls)',
        color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
        extraConfig: {
          walls: [
            { x: 120, y: 60, width: 20, height: 280, color: '#f59e0b' },
            { x: 200, y: 160, width: 120, height: 20, color: '#f59e0b' },
            { x: 300, y: 40, width: 20, height: 220, color: '#f59e0b' },
          ],
        },
      };
    case 4:
      return {
        speedMult: 1.75,
        hazardSpeedMult: 1.6,
        label: 'Lvl 4: 1.75x Speed (4 Walls)',
        color: 'text-orange-400 bg-orange-950/60 border-orange-800/60',
        extraConfig: {
          walls: [
            { x: 90, y: 50, width: 20, height: 300, color: '#ea580c' },
            { x: 160, y: 140, width: 140, height: 20, color: '#ea580c' },
            { x: 240, y: 40, width: 20, height: 180, color: '#ea580c' },
            { x: 240, y: 260, width: 120, height: 20, color: '#ea580c' },
          ],
        },
      };
    case 5:
    default:
      return {
        speedMult: 2.0,
        hazardSpeedMult: 2.0,
        label: 'Lvl 5: 2.0x Speed (Dense + 2 Enemies)',
        color: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
        extraConfig: {
          walls: [
            { x: 80, y: 50, width: 20, height: 300, color: '#dc2626' },
            { x: 160, y: 140, width: 140, height: 20, color: '#dc2626' },
            { x: 240, y: 40, width: 20, height: 180, color: '#dc2626' },
            { x: 240, y: 260, width: 120, height: 20, color: '#dc2626' },
          ],
        },
      };
  }
};

export const neonDungeonEngine: GameEngineStrategy = {
  createInitialState(difficulty: DifficultyLevel, diffParams: DifficultyParamDetail) {
    const baseSpeed = 4 * diffParams.speedMult;
    const enemyBaseSpeed = 2 * (diffParams.hazardSpeedMult || 1);

    return {
      x: 180,
      y: 180,
      width: 32,
      height: 32,
      vx: 0,
      vy: 0,
      speed: baseSpeed,
      score: 0,
      enemy: { x: 300, y: 100, width: 28, height: 28, vx: enemyBaseSpeed, vy: enemyBaseSpeed },
      enemy2: { x: 80, y: 300, width: 24, height: 24, vx: -enemyBaseSpeed * 0.9, vy: enemyBaseSpeed * 0.9 },
      gem: { x: 200, y: 200, width: 20, height: 20 },
      walls: diffParams.extraConfig?.walls || [],
    };
  },

  update(state, keys, stepId, diffParams, hooks) {
    state.vx = 0;
    state.vy = 0;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) state.vy = -state.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) state.vy = state.speed;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) state.vx = -state.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) state.vx = state.speed;

    if (stepId !== 'step-1') {
      state.x += state.vx;
      state.y += state.vy;
    }

    const prevX = state.x;
    const prevY = state.y;

    state.x = Math.max(0, Math.min(400 - state.width, state.x));
    state.y = Math.max(0, Math.min(400 - state.height, state.y));

    if (
      (prevX !== state.x || prevY !== state.y) &&
      (state.x === 0 || state.x === 400 - state.width || state.y === 0 || state.y === 400 - state.height)
    ) {
      hooks.playCollision();
    }

    if (stepId === 'step-3' || stepId === 'step-4') {
      for (const w of state.walls) {
        if (
          state.x < w.x + w.width &&
          state.x + state.width > w.x &&
          state.y < w.y + w.height &&
          state.y + state.height > w.y
        ) {
          state.x -= state.vx;
          state.y -= state.vy;
          hooks.playCollision();
        }
      }
    }

    if (stepId === 'step-4') {
      state.enemy.x += state.enemy.vx;
      state.enemy.y += state.enemy.vy;
      if (state.enemy.x < 40 || state.enemy.x > 350) state.enemy.vx *= -1;
      if (state.enemy.y < 40 || state.enemy.y > 330) state.enemy.vy *= -1;

      if (state.walls.length >= 4) {
        state.enemy2.x += state.enemy2.vx;
        state.enemy2.y += state.enemy2.vy;
        if (state.enemy2.x < 40 || state.enemy2.x > 350) state.enemy2.vx *= -1;
        if (state.enemy2.y < 40 || state.enemy2.y > 330) state.enemy2.vy *= -1;
      }

      if (
        state.x < state.gem.x + state.gem.width &&
        state.x + state.width > state.gem.x &&
        state.y < state.gem.y + state.gem.height &&
        state.y + state.height > state.gem.y
      ) {
        state.score += 100;
        hooks.playScore();
        hooks.addXp(25, 'Energy Cell Collected');
        hooks.incrementCombo();
        state.gem.x = ((state.gem.x + 90) % 300) + 40;
        state.gem.y = ((state.gem.y + 70) % 300) + 40;
      }
    }
  },

  render(ctx, state, stepId, diffParams, languageLabel) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 400, 400);

    // Synthwave Cyber Grid Floor
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 400; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(400, i);
      ctx.stroke();
    }

    if (stepId === 'step-3' || stepId === 'step-4') {
      for (const w of state.walls) {
        ctx.fillStyle = w.color;
        ctx.fillRect(w.x, w.y, w.width, w.height);
      }
    }

    if (stepId === 'step-4') {
      // Energy Gem
      ctx.fillStyle = '#eab308';
      ctx.fillRect(state.gem.x, state.gem.y, state.gem.width, state.gem.height);

      // Enemy 1
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(state.enemy.x, state.enemy.y, state.enemy.width, state.enemy.height);

      // Enemy 2
      if (state.walls.length >= 4) {
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(state.enemy2.x, state.enemy2.y, state.enemy2.width, state.enemy2.height);
      }
    }

    // Hero Sprite
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(state.x, state.y, state.width, state.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(state.x + 8, state.y + 8, 16, 16);

    // Engine Status
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11.5px JetBrains Mono, monospace';
    ctx.fillText(`${languageLabel} · ${diffParams.label}`, 16, 26);

    if (stepId === 'step-4') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px JetBrains Mono, monospace';
      ctx.fillText(`SCORE: ${state.score} PTS`, 16, 50);
    }
  },
};
