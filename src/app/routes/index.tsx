import React from 'react';
import { createRoute, Link } from '@tanstack/react-router';
import { RootRoute } from './__root';
import { LESSONS } from '../../data/lessonsData';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { RealtimeLeaderboard } from '../../components/highscores/RealtimeLeaderboard';
import { Gamepad2, Code2, ArrowRight, CheckCircle2, Sparkles, Keyboard, Target, Trophy, Shield, HelpCircle } from 'lucide-react';

const IndexComponent: React.FC = () => {
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 text-slate-100 p-6 md:p-12">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto w-full space-y-8">
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
                Build "Neon Dungeon: Rogue Crawler" in JavaScript, Python & Java
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Learn 2D game engine architecture from scratch! Switch seamlessly between <span className="text-yellow-400 font-semibold">JavaScript</span>, <span className="text-sky-400 font-semibold">Python</span>, and <span className="text-orange-400 font-semibold">Java</span> in real time using Monaco Editor and live HTML5 WebGL canvas execution.
          </p>

          {/* Primary Action Button */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              to="/tutor/$lessonId"
              params={{ lessonId: 'step-1' }}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Game Engine (Step 1)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Detailed "About the Game & How to Play" Section */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>About "Neon Dungeon: Rogue Crawler" & How to Play</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Story & Premise */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>1. The Cyber Knight</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You control a neon cyan hero sprite in a 400x400 grid arena. Your goal is to survive as long as possible while collecting energy cells.
              </p>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                <Keyboard className="w-4 h-4 text-amber-400" />
                <span>2. Movement Controls</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 font-mono rounded text-[11px]">W A S D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 font-mono rounded text-[11px]">Arrow Keys</kbd> on the canvas to mutate velocity vectors and drive movement.
              </p>
            </div>

            {/* Objective & Hazards */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                <Trophy className="w-4 h-4 text-rose-400" />
                <span>3. Gems & Enemies</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Collect yellow <strong className="text-amber-300">Gems (+100 PTS)</strong>, block movement against red walls, and avoid patrolling <strong className="text-rose-400">Enemy Skulls</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Step Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Curriculum Roadmap (4 Sequential Steps)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LESSONS.map((step) => {
              const isDone = Boolean(completedSteps[step.id]);
              return (
                <Link
                  key={step.id}
                  to="/tutor/$lessonId"
                  params={{ lessonId: step.id }}
                  className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
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

                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>JS · Python · Java</span>
                    <span className="group-hover:translate-x-1 transition-transform text-cyan-400 flex items-center gap-1 font-bold">
                      <span>Start Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Real-time Global Leaderboard Section */}
        <div className="pt-4">
          <RealtimeLeaderboard showSubmitForm={true} />
        </div>
      </div>
    </div>
  );
};

export const IndexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: IndexComponent,
});
