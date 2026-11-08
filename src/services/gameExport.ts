import { GameDefinition } from '../types/game';
import { DifficultyLevel, Language } from '../types/lesson';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

const scriptValue = (value: unknown) => JSON.stringify(value).replace(/<\//g, '<\\/');

function functionExpression(fn: Function): string {
  const source = Function.prototype.toString.call(fn);
  if (source.includes('[native code]')) throw new Error('Game engine functions must be self-contained.');
  const expression = /^[A-Za-z_$][\w$]*\s*\(/.test(source) ? `function ${source}` : source;
  return expression.replace(/<\/script/gi, '<\\/script');
}

export function createStandaloneGameHtml(game: GameDefinition, difficulty: DifficultyLevel = 3): string {
  if (game.standaloneHtml) return game.standaloneHtml(difficulty);
  const width = game.canvas?.width ?? 400;
  const height = game.canvas?.height ?? 400;
  const finalStepId = game.lessons.at(-1)!.id;
  const title = escapeHtml(game.title);
  const controls = escapeHtml(game.controlsTip);
  const engine = game.engine;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#020617;color:#e2e8f0;font-family:system-ui,sans-serif}body{display:flex;align-items:center;justify-content:center;padding:16px}main{width:min(100%,720px);display:grid;gap:14px;text-align:center}h1{font-size:clamp(1.25rem,4vw,2rem);margin:0}p{margin:0;color:#94a3b8;font-size:.9rem}canvas{display:block;width:100%;max-width:min(100%,${Math.round(65 * width / height)}dvh);height:auto;aspect-ratio:${width}/${height};margin-inline:auto;background:#020617;border:2px solid #334155;border-radius:14px;touch-action:none}#controls{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}button{min-width:56px;min-height:48px;padding:10px 16px;border:1px solid #0891b2;border-radius:10px;background:#083344;color:#cffafe;font-size:.9rem;font-weight:700;touch-action:none}button:active{background:#06b6d4;color:#020617}#status{min-height:1.3em;color:#fda4af}
</style>
</head>
<body>
<main>
<h1>${title}</h1>
<p>${controls}</p>
<canvas id="game-canvas" width="${width}" height="${height}" aria-label="Game canvas"></canvas>
<div id="controls" aria-label="Touch controls"></div>
<button id="restart" type="button">Restart game</button>
<p id="status" role="status"></p>
</main>
<script>
(() => {
  const engine = {
    createInitialState: ${functionExpression(engine.createInitialState)},
    update: ${functionExpression(engine.update)},
    render: ${functionExpression(engine.render)}
  };
  const difficultyParams = (${functionExpression(game.getDifficultyParams)})(${difficulty});
  const stepId = ${scriptValue(finalStepId)};
  const buttons = ${scriptValue(game.touchControls?.buttons ?? [])};
  const allowedKeys = new Set(${scriptValue(game.inputKeys ?? [])});
  const canvas = document.getElementById('game-canvas');
  const context = canvas.getContext('2d');
  const status = document.getElementById('status');
  const keys = Object.create(null);
  const hooks = {
    playCollision() {}, playMove() {}, playScore() {}, addXp() {}, incrementCombo() {},
    appendLog(message) { console.log(message); }, unlockAchievement() {}
  };
  let state = engine.createInitialState(${difficulty}, difficultyParams);
  function restart() {
    state = engine.createInitialState(${difficulty}, difficultyParams);
    for (const key of Object.keys(keys)) keys[key] = false;
    status.textContent = '';
  }
  document.getElementById('restart').addEventListener('click', restart);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') restart();
    if (allowedKeys.has(event.key)) { event.preventDefault(); keys[event.key] = true; }
  });
  window.addEventListener('keyup', (event) => { keys[event.key] = false; });
  window.addEventListener('blur', () => { for (const key of Object.keys(keys)) keys[key] = false; });
  const controlHost = document.getElementById('controls');
  for (const control of buttons.filter((button) => button.icon !== 'restart')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = control.label;
    button.setAttribute('aria-label', control.label);
    button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); keys[control.key] = true; });
    for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(eventName, () => { keys[control.key] = false; });
    }
    controlHost.appendChild(button);
  }
  function frame() {
    try {
      engine.update(state, keys, stepId, difficultyParams, hooks);
      engine.render(context, state, stepId, difficultyParams, 'Finished Game');
      requestAnimationFrame(frame);
    } catch (error) {
      status.textContent = 'Game stopped: ' + (error?.message || String(error));
      console.error(error);
    }
  }
  frame();
})();
</script>
</body>
</html>`;
}

export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function downloadGame(game: GameDefinition, difficulty: DifficultyLevel): void {
  downloadTextFile(`${game.id.replace(/[^a-z0-9-]/gi, '-')}-playable.html`, createStandaloneGameHtml(game, difficulty), 'text/html;charset=utf-8');
}

export function downloadLessonCode(game: GameDefinition, code: string, language: Language): void {
  const extension = language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'java';
  downloadTextFile(`${game.id.replace(/[^a-z0-9-]/gi, '-')}-my-code.${extension}`, code, 'text/plain;charset=utf-8');
}
