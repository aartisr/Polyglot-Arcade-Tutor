---
title: Add or Remove a Game
description: Extend the PolyGlot Arcade Tutor game registry with reusable game modules.
---

# Add or remove a game

Each game is a `GameDefinition` module in [`src/games/`](https://github.com/aartisr/Polyglot-Arcade-Tutor/tree/main/src/games). The built-in games show the pattern.

1. Create a module that exports a `GameDefinition` with a unique `id`, at least one lesson, and an engine with `createInitialState`, `update`, and `render`.
2. Add the module to `builtInGames` in [`src/games/index.ts`](https://github.com/aartisr/Polyglot-Arcade-Tutor/blob/main/src/games/index.ts). The first entry is the default.
3. Include lesson starter code, worked examples, hints, and checks for JavaScript, Python, and Java. Add optional snippets, manual cards, touch controls, and achievements as needed.
4. Run `bun run test:games`, `bun run lint`, and `bun run build`.

The home screen, game switcher, lesson route, manual, snippets, and touch controls read from the registry. The live site's discovery pages and sitemap are also generated from it.

To remove a game, remove its import and entry from `builtInGames`. Keep at least one game. Review saved user progress separately if you persist workspace data.

Python and Java remain simulated preview modes. Adding real execution for either language requires a new runner.

[Source overview](https://github.com/aartisr/Polyglot-Arcade-Tutor#add-or-remove-a-game) · [Wiki contributor guide](https://github.com/aartisr/Polyglot-Arcade-Tutor/wiki/Add-a-Game) · [Live tutor](https://pat.pcssiirobotics.org/) · [Documentation home](index.html)

<small>By <a href="https://ai-aarti.com/" rel="author">Aarti S Ravikumar</a></small>
