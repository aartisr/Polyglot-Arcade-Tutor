import React, { useEffect } from 'react';
import { useWorkspaceStore, dismissXpFloat } from '../../store/workspaceStore';
import { Sparkles } from 'lucide-react';

export const XpToastFloating: React.FC = () => {
  const xpFloatMessage = useWorkspaceStore((state) => state.xpFloatMessage);
  const comboStreak = useWorkspaceStore((state) => state.comboStreak);

  useEffect(() => {
    if (xpFloatMessage) {
      const timer = setTimeout(() => {
        dismissXpFloat();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [xpFloatMessage]);

  if (!xpFloatMessage) return null;

  return (
    <div className="fixed top-16 right-6 z-40 pointer-events-none animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-900 to-cyan-950 border border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-500/20 text-slate-100 font-mono text-xs font-bold backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
        <span className="text-cyan-300">{xpFloatMessage}</span>
        {comboStreak > 1 && (
          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono text-[10px]">
            {comboStreak}x STREAK
          </span>
        )}
      </div>
    </div>
  );
};
