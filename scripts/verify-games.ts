import assert from 'node:assert/strict';
import { GameRegistryService, gameRegistry } from '../src/services/GameRegistry';
import { neonDungeonGame } from '../src/games/neonDungeon';
import { cyberInvadersGame } from '../src/games/cyberInvaders';
import { setActiveGame, updateCode, workspaceStore } from '../src/store/workspaceStore';
import { createStandaloneGameHtml } from '../src/services/gameExport';

for (const game of [neonDungeonGame, cyberInvadersGame]) {
  const html = createStandaloneGameHtml(game);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, `${game.id} export must include a game script`);
  assert.doesNotThrow(() => new Function(script), `${game.id} export must contain valid JavaScript`);
  assert.match(html, /id="game-canvas"/);
  const difficulty = game.getDifficultyParams(3);
  const state = game.engine.createInitialState(3, difficulty);
  const before = game.id === 'neon-dungeon' ? state.x : state.ship.x;
  const noOp = () => {};
  game.engine.update(state, { ArrowLeft: true }, game.lessons.at(-1)!.id, difficulty, {
    playCollision: noOp, playMove: noOp, playScore: noOp, addXp: noOp,
    incrementCombo: noOp, appendLog: noOp, unlockAchievement: noOp,
  });
  const after = game.id === 'neon-dungeon' ? state.x : state.ship.x;
  assert.ok(after < before, `${game.id} must respond to movement controls in the final game`);
}

const registry = new GameRegistryService([neonDungeonGame, cyberInvadersGame]);
assert.equal(registry.getLesson('neon-dungeon', 'step-1').title, neonDungeonGame.lessons[0].title);
assert.equal(registry.getLesson('cyber-invaders', 'step-1').title, cyberInvadersGame.lessons[0].title);
assert.throws(() => registry.getLesson('cyber-invaders', 'missing-step'), /Unknown lesson/);

const thirdGame = {
  ...neonDungeonGame,
  id: 'test-third-game',
  title: 'Third Game',
  snippets: undefined,
  manual: undefined,
  touchControls: undefined,
  achievements: undefined,
  inputKeys: undefined,
  canvas: undefined,
};
assert.equal(registry.validate({ ...thirdGame, lessons: [thirdGame.lessons[0], thirdGame.lessons[0]] }).valid, false);
registry.register(thirdGame);
assert.equal(registry.getAll().length, 3);
assert.equal(registry.getLesson(thirdGame.id, 'step-1').title, thirdGame.lessons[0].title);
registry.setDefaultGameId(thirdGame.id);
assert.equal(registry.unregister(thirdGame.id), true);
assert.equal(registry.getDefaultGameId(), neonDungeonGame.id);
assert.equal(registry.getAll().length, 2);
assert.equal(registry.unregister('cyber-invaders'), true);
assert.equal(registry.unregister('neon-dungeon'), false, 'The last game must remain available');

const originalGameId = workspaceStore.state.activeGameId;
gameRegistry.register(thirdGame);
try {
  setActiveGame(thirdGame.id);
  assert.equal(workspaceStore.state.activeGameId, thirdGame.id);
  assert.equal(workspaceStore.state.currentStepId, thirdGame.lessons[0].id);
  updateCode('javascript', 'third game code');
  assert.equal(workspaceStore.state.codeMapByGame?.[thirdGame.id]?.javascript, 'third game code');
  setActiveGame(originalGameId);
  assert.equal(workspaceStore.state.activeGameId, originalGameId);
  setActiveGame(thirdGame.id);
  assert.equal(workspaceStore.state.codeMap.javascript, 'third game code');
} finally {
  setActiveGame(originalGameId);
  gameRegistry.unregister(thirdGame.id);
}

console.log('Game registry, duplicate lesson IDs, game removal, and isolated workspace state verified.');
