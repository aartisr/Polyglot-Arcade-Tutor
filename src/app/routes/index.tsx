import React, { useState } from 'react';
import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { RootRoute } from './__root';
import { useWorkspaceStore, setActiveGame } from '../../store/workspaceStore';
import { getAllGames, getGameById } from '../../data/gamesRegistry';
import { RealtimeLeaderboard } from '../../components/highscores/RealtimeLeaderboard';
import { ShareProgressModal } from '../../components/social/ShareProgressModal';
import { arcadeAudio } from '../../utils/audio';
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
} from 'lucide-react';

const IndexComponent: React.FC = () => {
  const navigate = useNavigate();
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const [selectedGameId, setSelectedGameId] = useState<string>(activeGameId || 'neon-dungeon');
  const [showShare, setShowShare] = useState(false);

  const allGames = getAllGames();
  const currentGame = getGameById(selectedGameId);

  const completedSteps = useWorkspaceStore(
    (state) => state.completedStepsByGame?.[selectedGameId] || state.completedSteps
  );

  const handleLaunchGame = (gameId: string, stepId?: string) => {
    arcadeAudio.playClick();
    setActiveGame(gameId);
    setSelectedGameId(gameId);
    const game = getGameById(gameId);
    const targetStep = stepId || game.lessons[0].id;
    navigate({ to: '/tutor/$lessonId', params: { lessonId: targetStep } });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 text-slate-100 p-6 md:p-12">
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto w-full space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                PolyGlot Arcade Tutor
              </h1>
              <p className="text-xs md:text-sm text-cyan-400 font-mono mt-0.5">
                Multi-Game Retro 2D Engine Curriculum in JavaScript, Python & Java
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            Learn professional 2D arcade physics, bounding box collision math, projectile pool management, and 60 FPS animation loops from scratch! Switch effortlessly between <span className="text-yellow-400 font-semibold">JavaScript</span>, <span className="text-sky-400 font-semibold">Python</span>, and <span className="text-orange-400 font-semibold">Java</span> with live browser execution.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleLaunchGame(selectedGameId)}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Launch {currentGame.title} (Step 1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowShare(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-sky-200 font-bold text-sm rounded-xl border border-sky-500/40 shadow-neon-cyan transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Share Progress Card</span>
            </button>
          </div>
        </div>

        {/* Section: Select Arcade Game Engine */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Arcade Machine Selection (Select a Game Engine to Build)</span>
            </div>
            <span className="text-xs font-mono text-slate-500">{allGames.length} Engines Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allGames.map((game) => {
              const isSelected = selectedGameId === game.id;
              const gameCompleted = useWorkspaceStore(
                (state) => state.completedStepsByGame?.[game.id] || (game.id === 'neon-dungeon' ? state.completedSteps : {})
              );
              const completedCount = game.lessons.filter((l) => gameCompleted[l.id]).length;

              return (
                <div
                  key={game.id}
                  onClick={() => {
                    arcadeAudio.playClick();
                    setSelectedGameId(game.id);
                    setActiveGame(game.id);
                  }}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? `bg-slate-900/90 ${game.badgeBorder} ${game.themeGlow} ring-1 ring-cyan-500/50`
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{game.badge}</span>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                            {game.genre}
                          </span>
                          <h3 className={`text-lg font-extrabold ${isSelected ? game.color : 'text-slate-100'}`}>
                            {game.title}
                          </h3>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                          ACTIVE ENGINE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {game.tagline}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Curriculum: {game.lessons.length} Step Modules</span>
                      <span className={completedCount === game.lessons.length ? 'text-emerald-400' : 'text-amber-400'}>
                        {completedCount}/{game.lessons.length} Completed
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span>JS</span>
                        <span className="w-2 h-2 rounded-full bg-sky-400 ml-1" />
                        <span>Python</span>
                        <span className="w-2 h-2 rounded-full bg-orange-400 ml-1" />
                        <span>Java</span>
                      </div>

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
                        <span>Start Engine</span>
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
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>About "{currentGame.title}"</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Story & Architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Step Cards Grid for Selected Game */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
        <div className="pt-4">
          <RealtimeLeaderboard showSubmitForm={true} />
        </div>
      </div>

      <ShareProgressModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
};

export const IndexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: IndexComponent,
});
