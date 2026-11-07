import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useWorkspaceStore, dismissLevelUp, getRankForXp } from '../../store/workspaceStore';
import { arcadeAudio } from '../../utils/audio';
import { Sparkles, Trophy, Zap, ArrowUpRight, X } from 'lucide-react';

interface LevelUpModalProps {
  onOpenShare?: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ onOpenShare }) => {
  const levelUpNotification = useWorkspaceStore((state) => state.levelUpNotification);
  const xp = useWorkspaceStore((state) => state.xp);

  useEffect(() => {
    if (levelUpNotification) {
      arcadeAudio.playVictoryFanfare();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#00f3ff', '#ff007f', '#eab308', '#a855f7'],
      });
    }
  }, [levelUpNotification]);

  if (!levelUpNotification) return null;

  const currentRank = getRankForXp(xp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/60 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20 text-center overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={dismissLevelUp}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-100 rounded-lg bg-slate-950/60 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level Up Badge Icon */}
        <div className="mx-auto w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 p-0.5 shadow-neon-cyan animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-4xl">
            {levelUpNotification.badge}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-700/60 text-pink-300 text-xs font-mono font-bold uppercase tracking-widest mb-2">
          <Zap className="w-3.5 h-3.5 text-pink-400 fill-current" />
          <span>LEVEL UP ACHIEVED!</span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-100 mb-1">
          WELCOME TO LEVEL {levelUpNotification.newLevel}
        </h2>
        <p className="text-sm font-semibold text-cyan-400 mb-4">
          Rank Unlocked: {levelUpNotification.title}
        </p>

        {/* XP Card Stats */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 mb-6 text-left">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Previous Level:</span>
            <span className="text-slate-300">Level {levelUpNotification.oldLevel}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Current Total XP:</span>
            <span className="text-cyan-400 font-bold">{xp} XP</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Next Rank Target:</span>
            <span className="text-amber-400 font-bold">{currentRank.maxXp} XP</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {onOpenShare && (
            <button
              onClick={() => {
                dismissLevelUp();
                onOpenShare();
              }}
              className="w-full py-2.5 px-4 bg-pink-500 hover:bg-pink-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-magenta transition-all flex items-center justify-center gap-2"
            >
              <span>SHARE LEVEL UP SOCIAL CARD</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          <button
            onClick={dismissLevelUp}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>CONTINUE HACKING</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
