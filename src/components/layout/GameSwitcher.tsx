import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore, setActiveGame } from '../../store/workspaceStore';
import { getAllGames, getGameById } from '../../data/gamesRegistry';
import { arcadeAudio } from '../../utils/audio';
import { Gamepad2, ChevronDown, Check, Sparkles, Layers } from 'lucide-react';

interface GameSwitcherProps {
  onSelectGame?: (gameId: string) => void;
  className?: string;
}

export const GameSwitcher: React.FC<GameSwitcherProps> = ({ onSelectGame, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const games = getAllGames();
  const currentGame = getGameById(activeGameId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGameChange = (gameId: string) => {
    arcadeAudio.playClick();
    setActiveGame(gameId);
    setIsOpen(false);
    if (onSelectGame) {
      onSelectGame(gameId);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => {
          arcadeAudio.playClick();
          setIsOpen((prev) => !prev);
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm group text-left"
        title="Switch Active Game Engine"
      >
        <span className="text-base shrink-0">{currentGame.badge}</span>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span>ARCADE ENGINE</span>
            <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300">
              {games.length} GAMES
            </span>
          </span>
          <span className="text-xs font-bold text-slate-100 truncate max-w-[130px] sm:max-w-[170px]">
            {currentGame.title.split(':')[0]}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-1.5 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 flex items-center justify-between">
            <span>SELECT GAME TUTOR</span>
            <Sparkles className="w-3 h-3 text-cyan-400" />
          </div>

          {games.map((game) => {
            const isSelected = game.id === activeGameId;
            return (
              <button
                key={game.id}
                onClick={() => handleGameChange(game.id)}
                className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border border-cyan-500/50 shadow-neon-cyan'
                    : 'hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="text-2xl p-1.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                  {game.badge}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-100 truncate">{game.title}</h4>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{game.genre}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-tight">
                    {game.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
