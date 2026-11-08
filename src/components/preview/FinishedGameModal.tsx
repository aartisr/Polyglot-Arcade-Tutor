import React, { useMemo } from 'react';
import { Download, X } from 'lucide-react';
import { GameDefinition } from '../../types/game';
import { DifficultyLevel } from '../../types/lesson';
import { createStandaloneGameHtml } from '../../services/gameExport';

interface FinishedGameModalProps {
  game: GameDefinition;
  difficulty: DifficultyLevel;
  onClose: () => void;
  onDownload: () => void;
}

export const FinishedGameModal: React.FC<FinishedGameModalProps> = ({ game, difficulty, onClose, onDownload }) => {
  const html = useMemo(() => createStandaloneGameHtml(game, difficulty), [game, difficulty]);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950 text-slate-100" role="dialog" aria-modal="true" aria-label={`Play ${game.title}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-3 py-2 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold sm:text-base">{game.badge} Play {game.title}</h2>
          <p className="text-xs text-slate-400">{game.controlsTip}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={onDownload} className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950">
            <Download className="h-4 w-4" /> Download game
          </button>
          <button type="button" onClick={onClose} aria-label="Close finished game" className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200">
            <X className="h-4 w-4" /> Close
          </button>
        </div>
      </header>
      <iframe
        title={`${game.title} playable game`}
        srcDoc={html}
        sandbox="allow-scripts"
        className="min-h-0 w-full flex-1 border-0 bg-slate-950"
      />
    </div>
  );
};
