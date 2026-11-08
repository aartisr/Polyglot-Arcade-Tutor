import assert from 'node:assert/strict';
import vm from 'node:vm';
import { GameRegistryService, gameRegistry } from '../src/services/GameRegistry';
import { builtInGames } from '../src/games';
import { setActiveGame, updateCode, workspaceStore } from '../src/store/workspaceStore';
import { createStandaloneGameHtml } from '../src/services/gameExport';

for (const game of builtInGames) {
  for (const lesson of game.lessons) {
    for (const language of ['javascript', 'python', 'java'] as const) {
      const starter = lesson.codeBoilerplate[language];
      const example = lesson.solution[language];
      if (!starter.includes('TODO')) continue;
      assert.ok(example.trim(), `${game.id}/${lesson.id}/${language} needs a worked example`);
      assert.doesNotMatch(example, /TODO/, `${game.id}/${lesson.id}/${language} example must complete the TODOs`);
      assert.notEqual(example, starter, `${game.id}/${lesson.id}/${language} example must differ from starter code`);
      if (language === 'javascript') {
        assert.doesNotThrow(() => new Function(example), `${game.id}/${lesson.id} JavaScript example must parse`);
      }
      for (const test of lesson.tests) {
        const result = test.check(example, []);
        assert.ok(result.passed, `${game.id}/${lesson.id}/${language} example fails ${test.name}: ${result.message}`);
      }
    }
  }
  const html = createStandaloneGameHtml(game);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, `${game.id} export must include a game script`);
  assert.doesNotThrow(() => new Function(script), `${game.id} export must contain valid JavaScript`);
  assert.match(html, /id="game-canvas"/);
  assert.ok(game.engine.createInitialState(3, game.getDifficultyParams(3)), `${game.id} must initialize`);
}

assert.equal(gameRegistry.getAll().length, builtInGames.length);

const noOp = () => {};
const hooks = { playCollision: noOp, playMove: noOp, playScore: noOp, addXp: noOp, incrementCombo: noOp, appendLog: noOp, unlockAchievement: noOp };
const arenaGame = builtInGames.find((game) => game.id === 'arena-survivor');
if (arenaGame) {
  const difficulty = arenaGame.getDifficultyParams(3);
  const state = arenaGame.engine.createInitialState(3, difficulty);
  for (let frame = 0; frame < 150; frame++) arenaGame.engine.update(state, {}, arenaGame.lessons.at(-1)!.id, difficulty, hooks);
  assert.ok(state.enemies.length > 0, 'Arena must spawn pursuers');
  assert.ok(state.orbs.length > 0, 'Arena must spawn collectible orbs');
}

const gardenGame = builtInGames.find((game) => game.id === 'cozy-garden');
if (gardenGame) {
  const difficulty = gardenGame.getDifficultyParams(3);
  const state = gardenGame.engine.createInitialState(3, difficulty);
  gardenGame.engine.update(state, { ' ': true }, gardenGame.lessons.at(-1)!.id, difficulty, hooks);
  assert.equal(state.plots[4].planted, true, 'Garden must plant the nearby center plot');
  for (let frame = 0; frame < 650; frame++) gardenGame.engine.update(state, {}, gardenGame.lessons.at(-1)!.id, difficulty, hooks);
  assert.equal(state.plots[4].growth, 100, 'Garden plant must mature');
  gardenGame.engine.update(state, { ' ': true }, gardenGame.lessons.at(-1)!.id, difficulty, hooks);
  assert.equal(state.flowers, 1, 'Garden must harvest a mature flower');
}

for (const game of builtInGames) {
  const script = createStandaloneGameHtml(game).match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const context = new Proxy({}, { get: () => noOp, set: () => true });
  const element = () => ({ addEventListener: noOp, setAttribute: noOp, appendChild: noOp, setPointerCapture: noOp, textContent: '' });
  const canvas = { getContext: () => context };
  const document = { getElementById: (id: string) => id === 'game-canvas' ? canvas : element(), createElement: element };
  assert.doesNotThrow(() => vm.runInNewContext(script, { document, window: { addEventListener: noOp }, requestAnimationFrame: noOp, console }), `${game.id} standalone game must start and draw`);
}

const registry = new GameRegistryService(builtInGames);
for (const game of builtInGames) {
  assert.equal(registry.getLesson(game.id, game.lessons[0].id).title, game.lessons[0].title);
  assert.throws(() => registry.getLesson(game.id, 'missing-step'), /Unknown lesson/);
}

const thirdGame = {
  ...builtInGames[0],
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
assert.equal(registry.getAll().length, builtInGames.length + 1);
assert.equal(registry.getLesson(thirdGame.id, thirdGame.lessons[0].id).title, thirdGame.lessons[0].title);
registry.setDefaultGameId(thirdGame.id);
assert.equal(registry.unregister(thirdGame.id), true);
assert.equal(registry.getDefaultGameId(), builtInGames[0].id);
assert.equal(registry.getAll().length, builtInGames.length);
for (const game of builtInGames.slice(1)) assert.equal(registry.unregister(game.id), true);
assert.equal(registry.unregister(builtInGames[0].id), false, 'The last game must remain available');

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

console.log('Game registry, lessons, exports, new game mechanics, removal, and isolated workspace state verified.');
