import React, { useState } from 'react';
import { getGameById } from '../../data/gamesRegistry';
import {
  useWorkspaceStore,
  toggleSound,
  toggleCrtMode,
  setCurrentStepId,
  getRankForXp,
  RANKS,
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
  };

  return (
    <>
      <header className="flex items-center justify-between gap-6 px-6 py-2.5 bg-slate-950 border-b border-slate-800 text-slate-100 shrink-0">
        {/* Zone 1: Brand Wordmark, Game Switcher & Developer Level Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-neon-cyan">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleStepClick(activeGame.lessons[0].id);
            }}
            className="text-base font-bold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>PolyGlot Arcade Tutor</span>
          </a>

          {/* Generic Game Switcher Dropdown */}
          <GameSwitcher />

          {/* Rank Level Pill */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowProfile(true);
            }}
            className={`hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg border ${currentRank.borderColor} ${currentRank.bgColor} text-xs font-mono font-bold hover:brightness-125 transition-all cursor-pointer`}
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

        {/* Zone 2: Step Navigation Links for Active Game */}
        <nav className="hidden lg:flex items-center gap-2">
          {activeGame.lessons.map((step) => {
            const isActive = currentStepId === step.id;
            const isDone = Boolean(completedSteps[step.id]);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950/40'
                    : isDone
                    ? 'bg-slate-900/80 text-emerald-400 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] font-mono flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                )}
                <span>{step.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions, Profile, Quests, Streaks & XP */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Flame Combo Streak Counter */}
          {comboStreak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/60 border border-amber-500/50 text-amber-400 text-xs font-mono font-bold rounded-lg shadow-neon-amber animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{comboStreak}x STREAK</span>
            </div>
          )}

          {/* Share Progress Button */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowShare(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/60 text-sky-300 text-xs font-semibold rounded-lg transition-all shadow-neon-cyan"
            title="Share Your Progress on Twitter / Social Media"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowProfile(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 text-xs font-semibold rounded-lg transition-colors shadow-neon-cyan"
            title="Open Developer Profile & Stats"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Daily Quests Button */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowQuests(true);
            }}
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-pink-950/50 hover:bg-pink-900/60 border border-pink-700/60 text-pink-300 text-xs font-semibold rounded-lg transition-colors shadow-neon-magenta"
            title="View Daily Coding Quests"
          >
            <Target className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Quests</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/60 text-purple-300 text-xs font-semibold rounded-lg transition-colors"
            title="View Earned Badges & Achievements"
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Badges</span>
          </button>

          {/* Leaderboard High Scores Button */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowHighScores(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-semibold rounded-lg transition-colors shadow-neon-amber"
            title="View Global High Scores Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">High Scores</span>
          </button>

          {/* How to Play Manual Button */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowManual(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-semibold rounded-lg transition-colors"
            title="View Game Manual & Controls"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Manual</span>
          </button>

          {/* CRT Scanlines Toggle */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              toggleCrtMode();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
              crtModeEnabled
                ? 'bg-pink-950/60 text-pink-400 border-pink-800/60 shadow-neon-magenta'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={crtModeEnabled ? 'CRT Scanlines ON (Click to toggle)' : 'CRT Scanlines OFF'}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-bold">CRT {crtModeEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Live XP Counter Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-cyan-500/30 rounded-lg text-xs font-mono shadow-neon-cyan">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">XP:</span>
            <span className="text-cyan-300 font-bold">{xp} PTS</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleSound();
              arcadeAudio.playClick();
            }}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            title={soundEnabled ? 'Mute Retro SFX' : 'Enable Retro SFX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Current Active Language Indicator */}
          <div className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500">Lang:</span>{' '}
            <span className={activeLanguage === 'javascript' ? 'text-yellow-400' : activeLanguage === 'python' ? 'text-sky-400' : 'text-orange-400'}>
              {activeLanguage.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

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
    </>
  );
};


