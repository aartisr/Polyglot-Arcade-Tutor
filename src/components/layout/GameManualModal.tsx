import React, { useState } from 'react';
import { X, Gamepad2, Shield, Gem, Skull, Zap, HelpCircle, Keyboard, Target, Trophy, Rocket, Crosshair } from 'lucide-react';
import { useWorkspaceStore, setActiveGame } from '../../store/workspaceStore';
import { getAllGames, getGameById } from '../../data/gamesRegistry';
import { arcadeAudio } from '../../utils/audio';

interface GameManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameManualModal: React.FC<GameManualModalProps> = ({ isOpen, onClose }) => {
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const [selectedGameId, setSelectedGameId] = useState<string>(activeGameId || 'neon-dungeon');

  if (!isOpen) return null;

  const allGames = getAllGames();
  const selectedGame = getGameById(selectedGameId);

  const isInvaders = selectedGame.id === 'cyber-invaders';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-lime-950/70 border border-lime-500/70 rounded-xl shadow-[0_0_15px_rgba(132,204,22,0.4)] shrink-0">
              <img
                src="/assets/aistudio/image_59a3d311.png"
                alt="Hack Club Haven"
                className="w-10 h-10 object-contain rounded-lg animate-pulse"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedGame.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-lime-950 text-lime-300 border border-lime-700/60 rounded">Hack Club Haven</span>
              </h2>
              <p className="text-xs text-cyan-400 font-mono">Official Arcade Guide & Architecture Manual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Selection Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800">
          <span className="text-xs font-mono text-slate-500 uppercase mr-2">Select Game:</span>
          {allGames.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                arcadeAudio.playClick();
                setSelectedGameId(game.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedGameId === game.id
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{game.badge}</span>
              <span>{game.title}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Game Synopsis */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Target className="w-4 h-4" />
              <span>Engine Overview & Story</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-slate-100">{selectedGame.title}</strong>: {selectedGame.story}
            </p>
            <div className="pt-1 text-[11px] font-mono text-cyan-400/90">
              <span className="text-slate-500">Objective:</span> {selectedGame.objective}
            </div>
          </div>

          {/* Controls */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>Keyboard Controls</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isInvaders ? (
                <>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3">
                    <div className="flex gap-1">
                      <kbd className="px-2 py-1 bg-slate-800 text-pink-300 font-mono font-bold rounded text-xs border border-slate-700">A / &larr;</kbd>
                      <kbd className="px-2 py-1 bg-slate-800 text-pink-300 font-mono font-bold rounded text-xs border border-slate-700">D / &rarr;</kbd>
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">Horizontal Strafe</div>
                      <div className="text-[11px] text-slate-400">Glide cannon along bottom axis with clamped borders</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-slate-800 text-cyan-300 font-mono font-bold rounded text-xs border border-slate-700">SPACE / W</kbd>
                    <div>
                      <div className="font-bold text-slate-100">Fire Plasma Laser</div>
                      <div className="text-[11px] text-slate-400">Spawn high-velocity plasma projectiles upward</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Gameplay Rules & Scoring */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Rules & Game Entities</span>
            </h3>

            {isInvaders ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center gap-2 text-pink-400 font-bold">
                    <Rocket className="w-4 h-4" />
                    <span>Orbital Defense Cannon</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Fires plasma laser bolts vertically upward at 9 px/tick to vaporize alien formations.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <Crosshair className="w-4 h-4" />
                    <span>Alien Armada (+150 PTS)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    March in synchronized grids, dropping lower upon hitting screen bounds and dropping plasma bombs.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Shield className="w-4 h-4" />
                    <span>Destructible Bunkers</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Absorb enemy bombs and player lasers with 4 hitpoint degradation states before crumbling.
                  </p>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {activeGameId !== selectedGameId ? (
            <button
              onClick={() => {
                setActiveGame(selectedGameId);
                onClose();
              }}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Switch Tutorial to {selectedGame.title}
            </button>
          ) : (
            <div className="text-xs font-mono text-emerald-400">
              Currently Active Game
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
