# PolyGlot Arcade Tutor 🎮

[Open the live tutor](https://pat.pcssiirobotics.org/) · [Browse the lesson guide](https://pat.pcssiirobotics.org/discover/) · [Read GitHub Pages docs](https://aartisr.github.io/Polyglot-Arcade-Tutor/) · [Visit the Wiki](https://github.com/aartisr/Polyglot-Arcade-Tutor/wiki)

**Learn to build a game, one small step at a time.** PolyGlot Arcade Tutor is a browser based coding playground made for the **Hack Club Haven game jam hosted by PCSS II Robotics Club** on **November 14–15, 2026**. The jam welcomes teens, including people who have never coded before. This project is my way of making that invitation real: open a lesson, change a few lines, see what happens, and keep building with friends.

<details>
<summary>A note from the author</summary>


When I read the Haven invitation, the line that stayed with me was the answer to “What if I don’t know how to code?”: **“we’ll teach you there!”** I wanted this repo to help deliver on that promise. A first time maker should be able to find a starting point without feeling lost, and a more experienced maker should have room to experiment and help someone else.

That is why I made PolyGlot Arcade Tutor. It turns game programming ideas into short, visible steps. You can build a dungeon crawler or a space shooter, compare the same idea in three languages, and learn with a teammate beside you. My hope is that someone who arrives thinking “I can’t make a game” leaves with a small game they helped create and the confidence to keep going.

If you use this at the jam, please share what you changed, explain one idea to another participant, and make space for a beginner on your team. The best outcome is more young people feeling that they belong in a creative coding community.

— [Aarti S Ravikumar](https://ai-aarti.com/)

</details>

## What is in this repo?

| Part | What it does |
| --- | --- |
| **Neon Dungeon: Rogue Crawler** | A four step path through drawing a player, movement, collisions, and a complete dungeon game. |
| **Cyber Invaders: Space Grid** | A four step path through a retro space shooter with movement, lasers, enemies, and defenses. |
| **Lesson + editor + canvas** | Read the task, edit starter code, run the canvas, and inspect console output in one workspace. |
| **Three language views** | Compare JavaScript, Python, and Java examples for the same game concepts. |
| **Hints and lesson checks** | Get unstuck and use **Run Tests** to check the code for each step. |
| **Community features** | Share a progress card and explore co-op, duels, scores, and achievements when the connected Firebase services are configured. |

**How the language views work:** JavaScript code runs in the browser canvas. Python and Java are learning views with a simulated game preview; this app does not compile or execute Python or Java source. Their lesson checks inspect the code you write. You do **not** need to install Python or Java to try the lessons.

## Try it locally

You need [Node.js 22.12 or newer](https://nodejs.org/en/download), [Bun](https://bun.sh/), and a modern browser. The project commands use a compatible Node found on your `PATH`, even if an older nvm version comes first. With nvm, `nvm install && nvm use` selects the project version from `.nvmrc` for the current terminal. Run `bun run check:node` to see the Node executable that the project will use.

1. Download or clone this repository and open a terminal in its folder.
2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the app:

   ```bash
   bun run dev
   ```

4. Open **http://localhost:3000** in your browser.

The repository includes a Firebase client configuration, so the interface can start without creating an `.env` file. Shared features such as leaderboards, profiles, and co-op depend on access to a working Firebase project and its rules. The core lessons are the easiest place to begin.

## Your first five minutes

1. On the home screen, choose **Play game** to try the completed version immediately, or **Start learning** to begin its lessons.
2. Read **Step 1** in the lesson panel. Look for the `TODO` comments in the code editor.
3. Choose **JavaScript** to see your edits run on the canvas. Add or change a little code, then select **Run Canvas** (or press **Ctrl/Cmd + Enter**).
4. Select **Run Tests** to check the lesson. If a check fails, read its hint and try again.
   If you do not know how to fill a `TODO`, use **Stuck on a TODO?** in the lesson panel to reveal one hint at a time or view a completed example. Viewing the example does not replace your editor code.
5. Move to the next step. Use **Compare Languages** when you want to see how the idea looks in Python or Java.

At the final lesson, choose **Play game** to open the completed reference game. Choose **Download game** for a standalone `.html` file that opens in a browser and includes touch controls. This playable export uses the registered game engine. **Download my code** separately saves what is in your current editor as `.js`, `.py`, or `.java`; the playable export does not incorporate unfinished editor changes.

Tip: If you are new to coding, pair up. Have one person read the task aloud while the other changes the code, then switch roles after each step.

## How this can help a community

- **For a game jam:** Use Step 1 as a short group warmup. Then let teams choose a game path and remix its story, art, controls, or rules into their own project.
- **For mentors:** Ask learners to predict what a change will do before they press Run. The canvas and lesson checks make it easier to talk through the result together.
- **For clubs and classrooms:** Reuse the four step paths for weekly sessions. Participants can compare languages without needing three separate development setups.
- **For contributors:** Add clearer hints, accessibility improvements, new lesson checks, or a new game engine so the next beginner has a smoother start.

The repo is organized to support those contributions: lesson content lives in `src/data/`, game definitions in `src/games/`, registry validation in `src/services/GameRegistry.ts`, game logic in `src/engines/`, and the React interface in `src/components/` and `src/app/`.

## Before sharing or deploying your own copy

The checked in `firebase-applet-config.json` points to a specific Firebase project. **Use a Firebase project you control** for a community deployment, update that file with your project's client configuration, and review `firestore.rules` before inviting participants to use shared features. Avoid putting private keys or student information in the repository. For a quick local lesson demo, you can start with the steps above.

### Deploy on Vercel

Import this repository into Vercel with the project root as the Root Directory. `vercel.json` selects the Vite build, installs from the committed Bun lockfile, publishes `dist`, and rewrites lesson URLs to the app entry point. No server process or build environment variables are needed for the core lessons. Set up your own Firebase project and authorize the deployed domain in Firebase Authentication if you want sign-in and shared features. The committed lockfile uses the public npm registry; `.npmrc` is ignored so each developer can set local registry preferences.

The `engines.node` range requires Node 22.12+ without pinning a major version, so Vercel can use its latest supported Node release. The development, build, and preview commands select a compatible Node locally before starting Vite.

The production build generates `robots.txt`, `sitemap.xml`, `llms.txt`, and crawlable lesson guide pages from the game registry. Its canonical URL defaults to `https://pat.pcssiirobotics.org/`; set `PUBLIC_SITE_URL` during the build if you deploy your own copy on another domain. Submit that deployment's sitemap to your search engine webmaster tools after it is public.

The adult-only production deployment for `pat.pcssiirobotics.org` uses Microsoft Clarity project `zafuff49tg`. The build adds its tracking script to the app and generated lesson guide pages only for the production Vercel deployment from this repository. Other deployments can opt in with their own `CLARITY_PROJECT_ID`; leave it unset for deployments intended for people under 18. Editor code and console output are masked from Clarity recordings.

To check a code change before sharing it:

```bash
bun run lint
bun run build
```

The project is built with React, TypeScript, Vite, Monaco Editor, and Firebase. The app can also be installed as a progressive web app in supported browsers.

**Made for Hack Club Haven, hosted by PCSS II Robotics Club.** See you at the arcade.

## Cite this project

**Ravikumar, A. S.** (2026). *PolyGlot Arcade Tutor* [Computer software]. [https://github.com/aartisr/Polyglot-Arcade-Tutor](https://github.com/aartisr/Polyglot-Arcade-Tutor). The machine-readable [CITATION.cff](CITATION.cff) provides the same author, live app, and source links for citation tools.

## Add or remove a game

Each game is a `GameDefinition` module in `src/games/`. The two examples are `neonDungeon.ts` and `cyberInvaders.ts`. A game module owns its lesson list, engine, story and visual details, and optional snippets, manual cards, touch controls, canvas size, keyboard keys, and achievements.

1. Create a module in `src/games/` exporting a `GameDefinition`. Give it a unique `id`, at least one lesson, and an engine implementing `createInitialState`, `update`, and `render`. Use `src/games/neonDungeon.ts` as a working example. Lesson IDs only need to be unique **within that game**.
2. Import the module and add it to `builtInGames` in `src/games/index.ts`. The first entry is the default game. The home page, game switcher, lesson route, workspace state, manual, snippets, and touch controls read from the registry; they do not require a new conditional branch.
3. To remove a game, remove its import and entry from `builtInGames`. Keep at least one game. This does not delete the game's source files; review any saved progress separately if you persist workspace data.
4. Run `bun run test:games`, `bun run lint`, and `bun run build`.

For runtime registration, call `gameRegistry.register(game)` and `gameRegistry.unregister(gameId)`. The registry validates required fields and prevents removing the last game. When the default game is removed, the next registered game becomes the default. The `useGameRegistry` hook updates selection views and moves the active workspace to a remaining game.

Python and Java remain simulated preview modes for every game; adding actual execution for either language requires a separate runner implementation.

The playable HTML export packages the game's registered engine. Keep engine methods self-contained so they can be serialized into the file, or provide `standaloneHtml(difficulty)` on the game definition for an engine that needs external helpers. The export does not package the editor's source code; use **Download my code** for that file.

<small>By <a href="https://ai-aarti.com/" rel="author">Aarti S Ravikumar</a></small>
