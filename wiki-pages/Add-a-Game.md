# Add a Game

The app uses `GameDefinition` modules in [`src/games/`](https://github.com/aartisr/Polyglot-Arcade-Tutor/tree/main/src/games).

1. Create a game module with a unique ID, lessons, and an engine implementing `createInitialState`, `update`, and `render`.
2. Register it in [`src/games/index.ts`](https://github.com/aartisr/Polyglot-Arcade-Tutor/blob/main/src/games/index.ts).
3. Provide starter code, hints, worked examples, and checks for each lesson and language view.
4. Run `bun run test:games`, `bun run lint`, and `bun run build`.

The interface, live discovery guide, and sitemap read from the registry. To remove a game, remove its entry and keep at least one game registered.

[Detailed Pages contributor guide](https://aartisr.github.io/Polyglot-Arcade-Tutor/add-a-game.html) · [Wiki Home](Home)

Created by [Aarti S Ravikumar](https://ai-aarti.com/).
