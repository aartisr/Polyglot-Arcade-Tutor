import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore, clearLogs, toggleCrtMode } from '../../store/workspaceStore';
import { arcadeAudio } from '../../utils/audio';
import {
  Terminal,
  Play,
  Trash2,
  Tv,
  Palette,
  Gamepad2,
  Swords,
  Share2,
  Trophy,
  Target,
  User,
  HelpCircle,
  Search,
  Command,
  X,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Editor' | 'Game' | 'System' | 'Multiplayer';
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleRun: () => void;
  isRunning: boolean;
  onOpenShare: () => void;
  onOpenProfile: () => void;
  onOpenQuests: () => void;
  onOpenHighScores: () => void;
  onOpenManual: () => void;
  onOpenDuelLobby: () => void;
  onOpenGuide: () => void;
  onToggleTheme: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onToggleRun,
  isRunning,
  onOpenShare,
  onOpenProfile,
  onOpenQuests,
  onOpenHighScores,
  onOpenManual,
  onOpenDuelLobby,
  onOpenGuide,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const crtModeEnabled = useWorkspaceStore((state) => state.crtModeEnabled);
  const soundEnabled = useWorkspaceStore((state) => state.soundEnabled);

  const commands: CommandItem[] = [
    {
      id: 'run-code',
      title: isRunning ? 'Pause Code / Game Engine' : 'Run Code & Start Engine',
      category: 'Game',
      shortcut: 'Ctrl + Enter',
      icon: <Play className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onToggleRun();
        onClose();
      },
    },
    {
      id: 'clear-logs',
      title: 'Clear Console Terminal Logs',
      category: 'System',
      shortcut: 'Ctrl + L',
      icon: <Trash2 className="w-4 h-4 text-amber-400" />,
      action: () => {
        clearLogs();
        arcadeAudio.playClick();
        onClose();
      },
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Synthwave / Matrix Editor Theme',
      category: 'Editor',
      shortcut: 'Ctrl + T',
      icon: <Palette className="w-4 h-4 text-pink-400" />,
      action: () => {
        onToggleTheme();
        arcadeAudio.playClick();
        onClose();
      },
    },
    {
      id: 'toggle-crt',
      title: `Toggle CRT Scanlines (${crtModeEnabled ? 'ON' : 'OFF'})`,
      category: 'System',
      shortcut: 'Ctrl + Shift + C',
      icon: <Tv className="w-4 h-4 text-purple-400" />,
      action: () => {
        toggleCrtMode();
        arcadeAudio.playClick();
        onClose();
      },
    },
    {
      id: 'open-duels',
      title: 'Open 1v1 Code Duel Arena',
      category: 'Multiplayer',
      shortcut: 'Ctrl + D',
      icon: <Swords className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onOpenDuelLobby();
        onClose();
      },
    },
    {
      id: 'share-progress',
      title: 'Share Progress Social Card',
      category: 'System',
      shortcut: 'Ctrl + S',
      icon: <Share2 className="w-4 h-4 text-sky-400" />,
      action: () => {
        onOpenShare();
        onClose();
      },
    },
    {
      id: 'high-scores',
      title: 'View Global High Scores Leaderboard',
      category: 'Game',
      shortcut: 'Ctrl + H',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      action: () => {
        onOpenHighScores();
        onClose();
      },
    },
    {
      id: 'daily-quests',
      title: 'View Daily Coding Quests & Rewards',
      category: 'System',
      shortcut: 'Ctrl + Q',
      icon: <Target className="w-4 h-4 text-pink-400" />,
      action: () => {
        onOpenQuests();
        onClose();
      },
    },
    {
      id: 'user-profile',
      title: 'Open Developer Profile & XP Stats',
      category: 'System',
      shortcut: 'Ctrl + P',
      icon: <User className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onOpenProfile();
        onClose();
      },
    },
    {
      id: 'game-manual',
      title: 'View Game Manual & Controls',
      category: 'Game',
      shortcut: 'Ctrl + M',
      icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onOpenManual();
        onClose();
      },
    },
    {
      id: 'quick-start',
      title: 'Quick Start Tutorial Guide',
      category: 'System',
      shortcut: 'Ctrl + G',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onOpenGuide();
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-950 border-b border-slate-800">
          <Command className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search actions (e.g. run, clear, theme, duel)..."
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none font-mono"
          />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC to close
          </span>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-mono text-xs">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 shadow-neon-cyan'
                      : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                      {cmd.icon}
                    </div>
                    <div>
                      <div className="text-slate-100 font-bold">{cmd.title}</div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {cmd.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cmd.shortcut && (
                      <span className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[10px] rounded">
                        {cmd.shortcut}
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400 font-bold">PolyGlot Arcade Command Center</span>
        </div>
      </div>
    </div>
  );
};
