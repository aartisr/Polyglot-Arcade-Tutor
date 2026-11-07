import React, { useState } from 'react';
import { getGameById } from '../../data/gamesRegistry';
import {
  useWorkspaceStore,
  toggleSound,
  toggleCrtMode,
  setCurrentStepId,
  getRankForXp,
  RANKS,
  clearLogs,
} from '../../store/workspaceStore';
import { arcadeAudio } from '../../utils/audio';
import {
  Gamepad2,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Tv,
  Trophy,
  Award,
  Target,
  Flame,
  Zap,
  User,
  Share2,
  Swords,
  Command,
} from 'lucide-react';
import { GameSwitcher } from './GameSwitcher';
import { GameManualModal } from './GameManualModal';
import { HighScoreModal } from '../highscores/HighScoreModal';
import { AchievementsModal } from '../achievements/AchievementsModal';
import { DailyQuestsModal, DAILY_QUESTS } from '../gamification/DailyQuestsModal';
import { LevelUpModal } from '../gamification/LevelUpModal';
import { XpToastFloating } from '../gamification/XpToastFloating';
import { UserProfileModal } from '../profile/UserProfileModal';
import { ShareProgressModal } from '../social/ShareProgressModal';
import { CodeDuelLobbyModal } from '../social/CodeDuelLobbyModal';
import { CommandPaletteModal } from '../editor/CommandPaletteModal';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentStepId: string;
  onSelectStep: (stepId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStepId, onSelectStep }) => {
  const [showManual, setShowManual] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDuelLobby, setShowDuelLobby] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Global Keyboard Shortcuts Listener (Ctrl+K, Ctrl+Enter, Ctrl+L)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K: Open Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      // Ctrl+Enter or Cmd+Enter: Run Code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('arcade-run-code'));
      }
      // Ctrl+L or Cmd+L: Clear Console Logs
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        clearLogs();
        arcadeAudio.playClick();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const activeGame = getGameById(activeGameId);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const completedSteps = useWorkspaceStore(
    (state) => state.completedStepsByGame?.[state.activeGameId] || state.completedSteps
  );
  const soundEnabled = useWorkspaceStore((state) => state.soundEnabled);
  const crtModeEnabled = useWorkspaceStore((state) => state.crtModeEnabled);
  const xp = useWorkspaceStore((state) => state.xp);
  const comboStreak = useWorkspaceStore((state) => state.comboStreak);
  const completedQuests = useWorkspaceStore((state) => state.completedQuests);
  const fullState = useWorkspaceStore((state) => state);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  arcadeAudio.enabled = soundEnabled;

  const currentRank = getRankForXp(xp);
  const currentLevelMinXp = currentRank.minXp;
  const currentLevelMaxXp = currentRank.maxXp;
  const rankProgress = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelMinXp) / (currentLevelMaxXp - currentLevelMinXp)) * 100))
  );

  // Count claimable quests
  const claimableCount = DAILY_QUESTS.filter(
    (q) => !completedQuests[q.id] && q.checkCondition(fullState)
  ).length;

  const handleStepClick = (stepId: string) => {
    arcadeAudio.playClick();
    setCurrentStepId(stepId);
    onSelectStep(stepId);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="flex items-center justify-between gap-3 sm:gap-6 px-3 sm:px-6 py-2 bg-slate-950 border-b border-slate-800 text-slate-100 shrink-0 relative z-30">
        {/* Zone 1: Brand Wordmark, Game Switcher & Developer Level Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-neon-cyan shrink-0">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleStepClick(activeGame.lessons[0].id);
            }}
            className="text-xs sm:text-base font-bold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-2"
          >
            <span className="hidden xs:inline">PolyGlot Arcade</span>
            <span className="xs:hidden">Arcade</span>
          </a>

          {/* Generic Game Switcher Dropdown */}
          <GameSwitcher />

          {/* Hack Club Haven Sponsor Logo Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-lime-950/70 border border-lime-500/70 rounded-lg shadow-[0_0_15px_rgba(132,204,22,0.3)] shrink-0">
            <img
              src="/assets/aistudio/image_59a3d311.png"
              alt="Hack Club Haven"
              className="w-7 h-7 object-contain rounded-md animate-pulse"
            />
            <span className="text-xs font-mono font-bold text-lime-300 tracking-wider">Hack Club Haven</span>
          </div>

          {/* Rank Level Pill (Desktop) */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowProfile(true);
            }}
            className={`hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-lg border ${currentRank.borderColor} ${currentRank.bgColor} text-xs font-mono font-bold hover:brightness-125 transition-all cursor-pointer`}
            title={`Developer Rank: ${currentRank.title} (Click to open profile)`}
          >
            <span>{currentRank.badge}</span>
            <span className={currentRank.color}>Lvl {currentRank.level}: {currentRank.title}</span>
            <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${rankProgress}%` }}
              />
            </div>
          </button>
        </div>

        {/* Zone 2: Step Navigation Links for Active Game (Desktop only) */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 overflow-x-auto py-1">
          {activeGame.lessons.map((step) => {
            const isActive = currentStepId === step.id;
            const isDone = Boolean(completedSteps[step.id]);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950/40'
                    : isDone
                    ? 'bg-slate-900/80 text-emerald-400 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] font-mono flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                )}
                <span>Step {step.stepNumber}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Desktop Actions & Mobile Menu Drawer Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Flame Combo Streak Counter */}
          {comboStreak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-950/60 border border-amber-500/50 text-amber-400 text-[11px] sm:text-xs font-mono font-bold rounded-lg shadow-neon-amber animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{comboStreak}x</span>
            </div>
          )}

          {/* Desktop Full Action Toolbar (XL screens and above) */}
          <div className="hidden xl:flex items-center gap-2">
            {/* Command Palette Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowCommandPalette(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded-lg transition-all shadow-neon-cyan cursor-pointer"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="w-4 h-4 text-cyan-400" />
              <span>Cmd+K</span>
            </button>
            {/* 1v1 Code Duel Lobby Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowDuelLobby(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/70 text-cyan-300 text-xs font-semibold rounded-lg transition-all shadow-neon-cyan cursor-pointer animate-pulse"
              title="1v1 Code Duel Arena - Real-time matchmaking"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>1v1 Duel</span>
            </button>

            {/* Share Progress Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowShare(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/60 text-sky-300 text-xs font-semibold rounded-lg transition-all shadow-neon-cyan cursor-pointer"
              title="Share Your Progress on Twitter / Social Media"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Share</span>
            </button>

            {/* User Profile Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowProfile(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 text-xs font-semibold rounded-lg transition-colors shadow-neon-cyan cursor-pointer"
              title="Open Developer Profile & Stats"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Profile</span>
            </button>

            {/* Daily Quests Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowQuests(true);
              }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-pink-950/50 hover:bg-pink-900/60 border border-pink-700/60 text-pink-300 text-xs font-semibold rounded-lg transition-colors shadow-neon-magenta cursor-pointer"
              title="View Daily Coding Quests"
            >
              <Target className="w-4 h-4 text-pink-400" />
              <span>Quests</span>
              {claimableCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-slate-950 font-mono text-[10px] font-black flex items-center justify-center animate-bounce">
                  {claimableCount}
                </span>
              )}
            </button>

            {/* Achievements Medals Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowBadges(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/60 text-purple-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="View Earned Badges & Achievements"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>Badges</span>
            </button>

            {/* Leaderboard High Scores Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowHighScores(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-semibold rounded-lg transition-colors shadow-neon-amber cursor-pointer"
              title="View Global High Scores Leaderboard"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>High Scores</span>
            </button>

            {/* How to Play Manual Button */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowManual(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="View Game Manual & Controls"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Manual</span>
            </button>

            {/* CRT Scanlines Toggle */}
            <button
              onClick={() => {
                arcadeAudio.playClick();
                toggleCrtMode();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                crtModeEnabled
                  ? 'bg-pink-950/60 text-pink-400 border-pink-800/60 shadow-neon-magenta'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title={crtModeEnabled ? 'CRT Scanlines ON (Click to toggle)' : 'CRT Scanlines OFF'}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="font-bold">CRT {crtModeEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Live XP Counter Pill */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-cyan-500/30 rounded-lg text-xs font-mono shadow-neon-cyan">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">XP:</span>
              <span className="text-cyan-300 font-bold">{xp}</span>
            </div>
          </div>

          {/* Sound Toggle (Always visible on all screen sizes) */}
          <PWAInstallButton />
          <button
            onClick={() => {
              toggleSound();
              arcadeAudio.playClick();
            }}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Retro SFX' : 'Enable Retro SFX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mobile / Tablet Menu Drawer Button */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowMobileMenu(!showMobileMenu);
            }}
            className="xl:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            title="Open Arcade Tools Menu"
          >
            <span className="text-cyan-400 font-mono text-[11px] font-bold">
              {currentRank.badge} Lvl {currentRank.level}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown Sheet */}
      {showMobileMenu && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Step Pills Bar */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Curriculum Steps:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {activeGame.lessons.map((step) => {
                const isActive = currentStepId === step.id;
                const isDone = Boolean(completedSteps[step.id]);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 shadow-neon-cyan'
                        : isDone
                        ? 'bg-slate-900 text-emerald-400 border-emerald-900/60'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>Step {step.stepNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Quick Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowProfile(true);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Profile ({xp} XP)</span>
            </button>

            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowQuests(true);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-900 border border-pink-900/50 rounded-xl text-pink-300 relative"
            >
              <Target className="w-4 h-4 text-pink-400" />
              <span>Daily Quests</span>
              {claimableCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-pink-500 absolute top-2 right-2 animate-ping" />
              )}
            </button>

            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowBadges(true);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-900 border border-purple-900/50 rounded-xl text-purple-300"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>Badges</span>
            </button>

            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowHighScores(true);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-900 border border-amber-900/50 rounded-xl text-amber-300"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>High Scores</span>
            </button>

            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowManual(true);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Game Manual</span>
            </button>

            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowShare(true);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-900 border border-sky-900/50 rounded-xl text-sky-300"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Share Progress</span>
            </button>

            <button
              onClick={() => {
                arcadeAudio.playClick();
                setShowDuelLobby(true);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-cyan-950 border border-cyan-500/60 rounded-xl text-cyan-300 col-span-2"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>1v1 Code Duel Arena</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
            <button
              onClick={() => {
                arcadeAudio.playClick();
                toggleCrtMode();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
            >
              <Tv className="w-3.5 h-3.5 text-pink-400" />
              <span>CRT Scanlines: {crtModeEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <span className="text-slate-400">
              Lang: <strong className="text-cyan-400">{activeLanguage.toUpperCase()}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Floating Notifications & Modals */}
      <XpToastFloating />
      <LevelUpModal onOpenShare={() => setShowShare(true)} />
      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onOpenShare={() => setShowShare(true)}
      />
      <ShareProgressModal isOpen={showShare} onClose={() => setShowShare(false)} />
      <GameManualModal isOpen={showManual} onClose={() => setShowManual(false)} />
      <HighScoreModal isOpen={showHighScores} onClose={() => setShowHighScores(false)} />
      <AchievementsModal
        isOpen={showBadges}
        onClose={() => setShowBadges(false)}
        onOpenShare={() => setShowShare(true)}
      />
      <DailyQuestsModal isOpen={showQuests} onClose={() => setShowQuests(false)} />
      <CodeDuelLobbyModal
        isOpen={showDuelLobby}
        onClose={() => setShowDuelLobby(false)}
        onSelectDuelLesson={(lessonId, gameId) => {
          onSelectStep(lessonId);
        }}
      />
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onToggleRun={() => {
          window.dispatchEvent(new CustomEvent('arcade-run-code'));
        }}
        isRunning={false}
        onOpenShare={() => setShowShare(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenQuests={() => setShowQuests(true)}
        onOpenHighScores={() => setShowHighScores(true)}
        onOpenManual={() => setShowManual(true)}
        onOpenDuelLobby={() => setShowDuelLobby(true)}
        onToggleTheme={() => {
          // Trigger theme toggle event or handle theme
        }}
      />
    </>
  );
};


