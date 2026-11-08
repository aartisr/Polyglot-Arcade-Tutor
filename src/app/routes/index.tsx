import React, { Suspense, useEffect, useRef, useState } from 'react';
import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { RootRoute } from './__root';
import { useWorkspaceStore, setActiveGame } from '../../store/workspaceStore';
import { getGameById, getDefaultGameId } from '../../data/gamesRegistry';
import { useGameRegistry } from '../../services/useGameRegistry';
import { arcadeAudio } from '../../utils/audio';
import { downloadGame } from '../../services/gameExport';
import {
  Gamepad2,
  Code2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Keyboard,
  Target,
  Trophy,
  Shield,
  HelpCircle,
  Share2,
  Rocket,
  Flame,
  Zap,
  Play,
} from 'lucide-react';

const RealtimeLeaderboard = React.lazy(() => import('../../components/highscores/RealtimeLeaderboard').then((module) => ({ default: module.RealtimeLeaderboard })));
const ShareProgressModal = React.lazy(() => import('../../components/social/ShareProgressModal').then((module) => ({ default: module.ShareProgressModal })));
const FinishedGameModal = React.lazy(() => import('../../components/preview/FinishedGameModal').then((module) => ({ default: module.FinishedGameModal })));

function DeferredLeaderboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearScreen, setIsNearScreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !('IntersectionObserver' in window)) {
      setIsNearScreen(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearScreen(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {isNearScreen ? (
        <Suspense fallback={<div className="p-6 text-center text-xs text-slate-400">Loading leaderboard…</div>}>
          <RealtimeLeaderboard showSubmitForm={true} />
        </Suspense>
      ) : (
        <div className="min-h-32 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center text-xs text-slate-400">Leaderboard loads as you scroll</div>
      )}
    </div>
  );
}

const IndexComponent: React.FC = () => {
  const navigate = useNavigate();
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const [selectedGameId, setSelectedGameId] = useState<string>(activeGameId || getDefaultGameId());
  const [showShare, setShowShare] = useState(false);
  const [previewGameId, setPreviewGameId] = useState<string | null>(null);
  const difficulty = useWorkspaceStore((state) => state.difficulty);

  const { games: allGames } = useGameRegistry();
  useEffect(() => {
    if (!allGames.some((game) => game.id === selectedGameId)) setSelectedGameId(allGames[0].id);
  }, [allGames, selectedGameId]);
  const currentGame = getGameById(selectedGameId);

  const completedSteps = useWorkspaceStore(
    (state) => state.completedStepsByGame?.[selectedGameId] || state.completedSteps
  );
  const completedStepsByGame = useWorkspaceStore((state) => state.completedStepsByGame);
  const defaultCompletedSteps = useWorkspaceStore((state) => state.completedSteps);

  const handleLaunchGame = (gameId: string, stepId?: string) => {
    arcadeAudio.playClick();
    setActiveGame(gameId);
    setSelectedGameId(gameId);
    const game = getGameById(gameId);
    const targetStep = stepId || game.lessons[0].id;
    navigate({ to: '/tutor/$lessonId', params: { lessonId: targetStep }, search: { game: gameId } });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-12">
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto w-full space-y-8 sm:space-y-10">
        <div className="grid grid-cols-[4rem_minmax(0,1fr)] md:grid-cols-[12rem_minmax(0,1fr)] gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-2 items-start">
          <div className="row-span-2 md:row-span-4 self-stretch flex flex-col items-center justify-center gap-3 rounded-2xl border border-lime-400/30 bg-gradient-to-br from-lime-950/70 via-slate-900 to-slate-950 p-2 md:p-4 shadow-[0_12px_36px_-18px_rgba(132,204,22,0.45)] ring-1 ring-inset ring-lime-400/10">
            <img
              src="/assets/aistudio/image_59a3d311.png"
              alt="Hack Club Haven"
              className="block w-full max-h-16 md:max-h-28 object-contain"
            />
            <span className="hidden md:block text-center text-[9px] font-semibold tracking-[0.16em] text-lime-200/70 uppercase">Community Partner</span>
          </div>

          <h1 className="col-start-2 min-w-0 text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight flex items-start sm:items-center gap-2 sm:gap-3">
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-cyan-400 mt-0.5 sm:mt-0" />
            <span>PolyGlot Arcade Tutor</span>
          </h1>

          <p className="col-start-2 min-w-0 text-xs md:text-sm text-cyan-400 font-mono">
            Build games while learning JavaScript, Python, and Java.
          </p>

          <p className="col-span-2 md:col-span-1 md:col-start-2 min-w-0 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            Play a finished game now, or follow short lessons to learn how it works.
          </p>

          {/* Quick Action Buttons */}
          <div className="col-span-2 md:col-span-1 md:col-start-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              onClick={() => handleLaunchGame(selectedGameId)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
            >
              <span>Start {currentGame.title.split(':')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section: Select Arcade Game Engine */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Choose a game</span>
            </div>
            <span className="text-xs text-slate-500">{allGames.length} games</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allGames.map((game) => {
              const isSelected = selectedGameId === game.id;
              const gameCompleted = completedStepsByGame?.[game.id] || (game.id === activeGameId ? defaultCompletedSteps : {});
              const completedCount = game.lessons.filter((l) => gameCompleted[l.id]).length;

              return (
                <div
                  key={game.id}
                  onClick={() => {
                    arcadeAudio.playClick();
                    setSelectedGameId(game.id);
                    setActiveGame(game.id);
                  }}
                  style={isSelected ? { borderColor: game.accentColor ?? '#22d3ee', boxShadow: `0 0 24px color-mix(in srgb, ${game.accentColor ?? '#22d3ee'} 22%, transparent)` } : undefined}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-slate-900/90'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{game.badge}</span>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                            {game.genre}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-100" style={isSelected ? { color: game.accentColor ?? '#22d3ee' } : undefined}>
                            {game.title}
                          </h3>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                          SELECTED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {game.tagline}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{game.lessons.length} lessons</span>
                      <span className={completedCount === game.lessons.length ? 'text-emerald-400' : 'text-amber-400'}>
                        {completedCount}/{game.lessons.length} Completed
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setPreviewGameId(game.id);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-600 hover:text-cyan-300"
                      >
                        <Play className="h-3.5 w-3.5" /> Play game
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchGame(game.id);
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-neon-cyan'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>Start learning</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed "About the Selected Game & Architecture" Section */}
        <details className="group rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-xl">
          <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Game details: {currentGame.title}</span>
            </span>
            <span className="text-xs text-slate-400 group-open:hidden">Show story, controls, and goal</span>
          </summary>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Story & Premise */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>1. Story & Lore</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentGame.story}
              </p>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                <Keyboard className="w-4 h-4 text-amber-400" />
                <span>2. Engine Input Controls</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentGame.controlsTip}
              </p>
            </div>

            {/* Objective & Rules */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                <Trophy className="w-4 h-4 text-rose-400" />
                <span>3. Win Objective & Hazards</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentGame.objective}
              </p>
            </div>
          </div>
        </details>

        {/* Step Cards Grid for Selected Game */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Curriculum Roadmap: {currentGame.title} ({currentGame.lessons.length} Steps)</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400">Click any step to begin coding</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentGame.lessons.map((step) => {
              const isDone = Boolean(completedSteps[step.id]);
              return (
                <button
                  key={step.id}
                  onClick={() => handleLaunchGame(currentGame.id, step.id)}
                  className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3 text-left cursor-pointer"
                >
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        STEP {step.stepNumber}
                      </span>
                      {isDone && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>COMPLETED</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {step.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-800/60 w-full">
                    <span>JS · Python · Java</span>
                    <span className="group-hover:translate-x-1 transition-transform text-cyan-400 flex items-center gap-1 font-bold">
                      <span>Code Step {step.stepNumber}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Global Leaderboard Section */}
        <details className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <summary className="cursor-pointer font-semibold text-sm text-slate-300">Leaderboard</summary>
          <div className="pt-4"><DeferredLeaderboard /></div>
        </details>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 py-5 text-xs text-slate-400">
          <span>Created by <a className="text-cyan-300 hover:underline" rel="author" href="https://ai-aarti.com/">Aarti S Ravikumar</a></span>
          <nav aria-label="Project information" className="flex flex-wrap gap-4">
            <a className="hover:text-cyan-300" href="/discover/">Explore all lessons</a>
            <a className="hover:text-cyan-300" href="https://aartisr.github.io/Polyglot-Arcade-Tutor/">Documentation</a>
            <a className="hover:text-cyan-300" href="https://github.com/aartisr/Polyglot-Arcade-Tutor/wiki">Wiki</a>
            <a className="hover:text-cyan-300" href="https://github.com/aartisr/Polyglot-Arcade-Tutor">Source and citation</a>
          </nav>
        </footer>
      </div>

      {showShare && (
        <Suspense fallback={null}>
          <ShareProgressModal isOpen={showShare} onClose={() => setShowShare(false)} />
        </Suspense>
      )}
      {previewGameId && (
        <Suspense fallback={<div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950 text-cyan-300">Opening game…</div>}>
          <FinishedGameModal
            game={getGameById(previewGameId)}
            difficulty={difficulty}
            onClose={() => setPreviewGameId(null)}
            onDownload={() => downloadGame(getGameById(previewGameId), difficulty)}
          />
        </Suspense>
      )}
    </div>
  );
};

export const IndexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: IndexComponent,
});
