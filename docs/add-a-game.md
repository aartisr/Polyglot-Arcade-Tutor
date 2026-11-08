---
title: Add or Remove a Game
description: Extend the PolyGlot Arcade Tutor game registry with reusable game modules.
---

# Add or remove a game

Create a working starter with `npm run game:new -- my-game "My Game"`. It immediately adds a playable collection game, a lesson, three language examples, and touch controls. Customize the generated `src/games/my-game.game.ts` file to give it its own gameplay and lessons.

To add a custom game directly, drop one `*.game.ts` module with a default `GameDefinition` export into [`src/games/`](https://github.com/aartisr/Polyglot-Arcade-Tutor/tree/main/src/games). Give it a unique `id`, at least one lesson, and an engine with `createInitialState`, `update`, and `render`. The catalog is generated automatically when you run `dev`, `build`, `lint`, or `test:games`. Use optional `catalogOrder` to control chooser order; the first game becomes the default.

Run `npm run test:games`, `npm run lint`, and `npm run build` before shipping. If you add a file while the dev server is running, run `npm run sync:games` to refresh the catalog.

The home screen, game switcher, lesson route, manual, snippets, and touch controls read from the registry. The live site's discovery pages and sitemap are also generated from it.

To remove a game, delete its `*.game.ts` module and run a normal command. Keep at least one game. Review saved user progress separately if you persist workspace data.

Python and Java remain simulated preview modes. Adding real execution for either language requires a new runner.

[Source overview](https://github.com/aartisr/Polyglot-Arcade-Tutor#add-or-remove-a-game) · [Wiki contributor guide](https://github.com/aartisr/Polyglot-Arcade-Tutor/wiki/Add-a-Game) · [Live tutor](https://pat.pcssiirobotics.org/) · [Documentation home](index.html)

<small>By <a href="https://ai-aarti.com/" rel="author">Aarti S Ravikumar</a> · Hack Club Haven host: <a href="https://pcssiirobotics.org/">PCSS II Robotics Club</a></small>
