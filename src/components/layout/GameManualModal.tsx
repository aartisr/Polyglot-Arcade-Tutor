import React from 'react';
import { X, Gamepad2, Shield, Gem, Skull, Zap, HelpCircle, Keyboard, Target, Trophy } from 'lucide-react';

interface GameManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameManualModal: React.FC<GameManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-800/50 text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Neon Dungeon: Rogue Crawler</h2>
              <p className="text-xs text-cyan-400 font-mono">Official Game Guide & Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Game Synopsis */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Target className="w-4 h-4" />
              <span>Game Overview</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-slate-100">Neon Dungeon: Rogue Crawler</strong> is a retro 2D top-down arcade game engine. As the Cyber Knight, your mission is to navigate treacherous grid dungeons, dodge solid neon walls, collect high-value energy gems, and outmaneuver rogue enemy chasers.
            </p>
          </div>

          {/* How to Play & Controls */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>Keyboard Controls</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-center">
                    <kbd className="px-2 py-1 bg-slate-800 text-cyan-300 font-mono font-bold rounded text-xs border border-slate-700">W / &uarr;</kbd>
                  </div>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-slate-800 text-cyan-300 font-mono font-bold rounded text-xs border border-slate-700">A / &larr;</kbd>
                    <kbd className="px-2 py-1 bg-slate-800 text-cyan-300 font-mono font-bold rounded text-xs border border-slate-700">S / &darr;</kbd>
                    <kbd className="px-2 py-1 bg-slate-800 text-cyan-300 font-mono font-bold rounded text-xs border border-slate-700">D / &rarr;</kbd>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-100">Hero Vector Movement</div>
                  <div className="text-[11px] text-slate-400">Move Up, Down, Left, Right across the 400x400 screen</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3">
                <kbd className="px-3 py-1.5 bg-slate-800 text-amber-300 font-mono font-bold rounded text-xs border border-slate-700">R</kbd>
                <div>
                  <div className="font-bold text-slate-100">Restart Level / Loop</div>
                  <div className="text-[11px] text-slate-400">Reset player coordinates and score upon Game Over</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gameplay Rules & Scoring */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Rules & Game Entities</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <div className="w-3.5 h-3.5 bg-cyan-400 rounded-xs" />
                  <span>Cyber Hero (Player)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Your character sprite. Controlled by position (x, y) and velocity vectors (vx, vy).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-xs" />
                  <span>Energy Gem (+100 PTS)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Collect yellow gems to increase your score! Spawns at new random locations.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <div className="w-3.5 h-3.5 bg-rose-500 rounded-xs" />
                  <span>Enemy Skull & Red Walls</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Red walls block player movement. Touching enemy skulls triggers Game Over!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
