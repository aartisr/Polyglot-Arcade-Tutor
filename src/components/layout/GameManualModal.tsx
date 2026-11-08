import React, { useEffect, useState } from 'react';
import { X, Keyboard, Target, Trophy } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { getGameById, getDefaultGameId } from '../../data/gamesRegistry';
import { useGameRegistry } from '../../services/useGameRegistry';
import { arcadeAudio } from '../../utils/audio';

interface GameManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameId: string) => void;
}

export const GameManualModal: React.FC<GameManualModalProps> = ({ isOpen, onClose, onSelectGame }) => {
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const { games } = useGameRegistry();
  const [selectedGameId, setSelectedGameId] = useState(activeGameId || getDefaultGameId());

  useEffect(() => {
    if (isOpen) setSelectedGameId(activeGameId);
  }, [isOpen, activeGameId]);

  if (!isOpen) return null;

  const selectedGame = getGameById(selectedGameId);
  const controls = selectedGame.manual?.controls ?? [{ title: 'Controls', description: selectedGame.controlsTip }];
  const entities = selectedGame.manual?.entities ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${selectedGame.title} manual`}>
      <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-800 bg-slate-950 p-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-100">{selectedGame.badge} {selectedGame.title}</h2>
            <p className="mt-1 text-xs text-slate-400">Game guide</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close game guide" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-5 w-5" /></button>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b border-slate-800 px-4 py-3" aria-label="Select game guide">
          {games.map((game) => (
            <button key={game.id} type="button" onClick={() => { arcadeAudio.playClick(); setSelectedGameId(game.id); }} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${selectedGameId === game.id ? 'bg-cyan-950 text-cyan-300 ring-1 ring-cyan-600' : 'bg-slate-800 text-slate-300'}`}>
              {game.badge} {game.title}
            </button>
          ))}
        </nav>

        <div className="space-y-5 overflow-y-auto p-4 text-sm">
          <section className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-cyan-300"><Target className="h-4 w-4" /> Your goal</h3>
            <p className="text-slate-300">{selectedGame.story}</p>
            <p className="mt-2 text-slate-400">{selectedGame.objective}</p>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-200"><Keyboard className="h-4 w-4 text-cyan-400" /> Controls</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {controls.map((control) => (
                <div key={control.title} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {control.keys?.map((key) => <kbd key={key} className="rounded bg-slate-800 px-2 py-1 text-xs text-cyan-300">{key}</kbd>)}
                    <strong className="text-slate-100">{control.title}</strong>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{control.description}</p>
                </div>
              ))}
            </div>
          </section>

          {entities.length > 0 && <section>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-200"><Trophy className="h-4 w-4 text-amber-400" /> Rules and game pieces</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {entities.map((entity) => (
                <div key={entity.title} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <strong className="text-slate-100">{entity.symbol && <span aria-hidden="true" className="mr-1">{entity.symbol}</span>}{entity.title}</strong>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{entity.description}</p>
                </div>
              ))}
            </div>
          </section>}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950 p-4">
          {activeGameId !== selectedGameId ? <button type="button" onClick={() => { onSelectGame(selectedGameId); onClose(); }} className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">Play {selectedGame.title}</button> : <span className="text-xs text-emerald-400">Current game</span>}
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200">Close</button>
        </footer>
      </div>
    </div>
  );
};
