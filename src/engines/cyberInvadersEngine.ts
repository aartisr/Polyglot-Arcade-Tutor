import { DifficultyLevel } from '../types/lesson';
import { GameEngineStrategy, DifficultyParamDetail, EngineHooks } from '../types/game';

export const cyberInvadersDifficultyConfig = (level: DifficultyLevel): DifficultyParamDetail => {
  switch (level) {
    case 1:
      return {
        speedMult: 1.0,
        hazardSpeedMult: 0.8,
        label: 'Lvl 1: Cadet Patrol (1.0x Speed)',
        color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      };
    case 2:
      return {
        speedMult: 1.25,
        hazardSpeedMult: 1.0,
        label: 'Lvl 2: Alien Swarm (1.25x Speed)',
        color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
      };
    case 3:
      return {
        speedMult: 1.5,
        hazardSpeedMult: 1.3,
        label: 'Lvl 3: Fleet Invasion (1.5x Speed)',
        color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      };
    case 4:
      return {
        speedMult: 1.75,
        hazardSpeedMult: 1.6,
        label: 'Lvl 4: Mothership Assault (1.75x Speed)',
        color: 'text-orange-400 bg-orange-950/60 border-orange-800/60',
      };
    case 5:
    default:
      return {
        speedMult: 2.0,
        hazardSpeedMult: 2.0,
        label: 'Lvl 5: Supernova Blitz (2.0x Chaos)',
        color: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      };
  }
};

export const cyberInvadersEngine: GameEngineStrategy = {
  createInitialState(difficulty: DifficultyLevel, diffParams: DifficultyParamDetail) {
    const shipSpeed = 5 * diffParams.speedMult;
    const alienSpeed = 1.2 * (diffParams.hazardSpeedMult || 1);

    // Initial alien fleet grid (3 rows x 6 columns)
    const aliens = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        aliens.push({
          x: 45 + c * 52,
          y: 40 + r * 35,
          width: 28,
          height: 20,
          alive: true,
          row: r,
          color: r === 0 ? '#ff007f' : r === 1 ? '#a855f7' : '#00f3ff',
        });
      }
    }

    // 3 Defensive Shield Bunkers
    const bunkers = [
      { x: 60, y: 300, width: 44, height: 18, hp: 4, color: '#10b981' },
      { x: 178, y: 300, width: 44, height: 18, hp: 4, color: '#10b981' },
      { x: 296, y: 300, width: 44, height: 18, hp: 4, color: '#10b981' },
    ];

    // Background starfield
    const stars = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: (i * 27) % 400,
        y: (i * 39) % 400,
        size: (i % 3) + 1,
        speed: ((i % 3) + 1) * 0.5,
      });
    }

    return {
      ship: { x: 182, y: 355, width: 36, height: 22, vx: 0, speed: shipSpeed },
      lasers: [] as { x: number; y: number; width: number; height: number; vy: number }[],
      alienBombs: [] as { x: number; y: number; width: number; height: number; vy: number }[],
      aliens,
      bunkers,
      stars,
      fleetDirection: 1, // 1 = right, -1 = left
      fleetSpeed: alienSpeed,
      score: 0,
      lastFireTime: 0,
      lastBombTime: 0,
    };
  },

  update(state, keys, stepId, diffParams, hooks) {
    const now = Date.now();

    // 1. Background starfield animation
    for (const star of state.stars) {
      star.y += star.speed;
      if (star.y > 400) {
        star.y = 0;
        star.x = (star.x + 37) % 400;
      }
    }

    // 2. Player Ship Movement (WASD / Arrows)
    state.ship.vx = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) state.ship.vx = -state.ship.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) state.ship.vx = state.ship.speed;

    if (stepId !== 'step-1') {
      state.ship.x += state.ship.vx;
    }

    const prevX = state.ship.x;
    state.ship.x = Math.max(10, Math.min(400 - state.ship.width - 10, state.ship.x));
    if (prevX !== state.ship.x && (state.ship.x === 10 || state.ship.x === 400 - state.ship.width - 10)) {
      hooks.playCollision();
    }

    // 3. Firing Lasers (Space / ArrowUp / W)
    if (stepId !== 'step-1') {
      if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && now - state.lastFireTime > 240) {
        state.lastFireTime = now;
        state.lasers.push({
          x: state.ship.x + state.ship.width / 2 - 2,
          y: state.ship.y - 8,
          width: 4,
          height: 12,
          vy: -8,
        });
        hooks.playMove();
      }
    }

    // 4. Update Player Lasers
    for (let i = state.lasers.length - 1; i >= 0; i--) {
      const laser = state.lasers[i];
      laser.y += laser.vy;

      if (laser.y < -10) {
        state.lasers.splice(i, 1);
        continue;
      }

      // Check laser collisions with Bunkers
      if (stepId === 'step-3' || stepId === 'step-4') {
        for (const bunker of state.bunkers) {
          if (bunker.hp > 0 &&
              laser.x < bunker.x + bunker.width &&
              laser.x + laser.width > bunker.x &&
              laser.y < bunker.y + bunker.height &&
              laser.y + laser.height > bunker.y) {
            bunker.hp--;
            hooks.playCollision();
            state.lasers.splice(i, 1);
            break;
          }
        }
      }

      // Check laser collisions with Aliens
      if (stepId === 'step-3' || stepId === 'step-4') {
        for (const alien of state.aliens) {
          if (alien.alive &&
              laser.x < alien.x + alien.width &&
              laser.x + laser.width > alien.x &&
              laser.y < alien.y + alien.height &&
              laser.y + laser.height > alien.y) {
            alien.alive = false;
            state.score += 150;
            hooks.playScore();
            hooks.addXp(30, 'Invader Vaporized');
            hooks.incrementCombo();
            state.lasers.splice(i, 1);
            break;
          }
        }
      }
    }

    // 5. Update Alien Fleet March
    if (stepId === 'step-3' || stepId === 'step-4') {
      let hitEdge = false;
      const aliveAliens = state.aliens.filter((a: any) => a.alive);

      for (const alien of aliveAliens) {
        if ((alien.x + alien.width >= 390 && state.fleetDirection > 0) ||
            (alien.x <= 10 && state.fleetDirection < 0)) {
          hitEdge = true;
          break;
        }
      }

      if (hitEdge) {
        state.fleetDirection *= -1;
        for (const alien of state.aliens) {
          alien.y += 12; // March downward!
        }
        hooks.playCollision();
      } else {
        for (const alien of state.aliens) {
          alien.x += state.fleetSpeed * state.fleetDirection;
        }
      }

      // Respawn wave if all aliens defeated
      if (aliveAliens.length === 0) {
        state.score += 500;
        hooks.playScore();
        hooks.addXp(150, 'Alien Fleet Cleared!');
        hooks.incrementCombo();
        for (const a of state.aliens) {
          a.alive = true;
          a.y = 40 + a.row * 35;
        }
      }

      // Alien bomb drops (Step 4)
      if (stepId === 'step-4' && now - state.lastBombTime > 900 && aliveAliens.length > 0) {
        state.lastBombTime = now;
        const randomAlien = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        state.alienBombs.push({
          x: randomAlien.x + randomAlien.width / 2 - 2,
          y: randomAlien.y + randomAlien.height,
          width: 4,
          height: 10,
          vy: 3 * (diffParams.hazardSpeedMult || 1),
        });
      }

      // Update Alien Bombs
      for (let j = state.alienBombs.length - 1; j >= 0; j--) {
        const bomb = state.alienBombs[j];
        bomb.y += bomb.vy;

        if (bomb.y > 410) {
          state.alienBombs.splice(j, 1);
          continue;
        }

        // Bunker hits
        for (const bunker of state.bunkers) {
          if (bunker.hp > 0 &&
              bomb.x < bunker.x + bunker.width &&
              bomb.x + bomb.width > bunker.x &&
              bomb.y < bunker.y + bunker.height &&
              bomb.y + bomb.height > bunker.y) {
            bunker.hp--;
            hooks.playCollision();
            state.alienBombs.splice(j, 1);
            break;
          }
        }

        // Player ship hit
        if (bomb.x < state.ship.x + state.ship.width &&
            bomb.x + bomb.width > state.ship.x &&
            bomb.y < state.ship.y + state.ship.height &&
            bomb.y + bomb.height > state.ship.y) {
          hooks.playCollision();
          state.alienBombs.splice(j, 1);
          state.score = Math.max(0, state.score - 50);
        }
      }
    }
  },

  render(ctx, state, stepId, diffParams, languageLabel) {
    // Deep Space Background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 400, 400);

    // Render Starfield
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (const star of state.stars) {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // Grid Horizon Line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 385);
    ctx.lineTo(400, 385);
    ctx.stroke();

    // Render Bunkers (Step 3 & 4)
    if (stepId === 'step-3' || stepId === 'step-4') {
      for (const bunker of state.bunkers) {
        if (bunker.hp > 0) {
          const alpha = bunker.hp / 4;
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fillRect(bunker.x, bunker.y, bunker.width, bunker.height);
          ctx.strokeStyle = '#34d399';
          ctx.strokeRect(bunker.x, bunker.y, bunker.width, bunker.height);
        }
      }
    }

    // Render Aliens (Step 3 & 4)
    if (stepId === 'step-3' || stepId === 'step-4') {
      for (const alien of state.aliens) {
        if (alien.alive) {
          ctx.fillStyle = alien.color;
          ctx.fillRect(alien.x, alien.y, alien.width, alien.height);

          // Neon Alien Eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(alien.x + 4, alien.y + 4, 4, 4);
          ctx.fillRect(alien.x + alien.width - 8, alien.y + 4, 4, 4);
        }
      }
    }

    // Render Player Lasers
    ctx.fillStyle = '#00f3ff';
    for (const laser of state.lasers) {
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(laser.x + 1, laser.y, 2, laser.height);
      ctx.fillStyle = '#00f3ff';
    }

    // Render Alien Bombs
    ctx.fillStyle = '#f43f5e';
    for (const bomb of state.alienBombs) {
      ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
    }

    // Render Player Defense Ship
    ctx.fillStyle = '#38bdf8';
    // Hull
    ctx.fillRect(state.ship.x, state.ship.y + 8, state.ship.width, state.ship.height - 8);
    // Cannon Nose
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(state.ship.x + state.ship.width / 2 - 4, state.ship.y, 8, 8);
    // Cockpit
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(state.ship.x + state.ship.width / 2 - 2, state.ship.y + 9, 4, 5);

    // Engine Header Info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11.5px JetBrains Mono, monospace';
    ctx.fillText(`${languageLabel} · ${diffParams.label}`, 16, 24);

    if (stepId === 'step-3' || stepId === 'step-4') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px JetBrains Mono, monospace';
      ctx.fillText(`SCORE: ${state.score} PTS`, 16, 44);
    }
  },
};
