import React, { Suspense, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { getGameById } from '../../data/gamesRegistry';
import {
  useWorkspaceStore,
  toggleSound,
  toggleCrtMode,
  setCurrentStepId,
  clearLogs,
  setIsRunning,
} from '../../store/workspaceStore';
import { arcadeAudio } from '../../utils/audio';
import {
  House,
  Volume2,
  VolumeX,
  CheckCircle2,
  HelpCircle,
  Tv,
  Trophy,
  Award,
  Target,
  User,
  Share2,
  Swords,
} from 'lucide-react';
import { GameSwitcher } from './GameSwitcher';
import { GameManualModal } from './GameManualModal';
import { DailyQuestsModal, DAILY_QUESTS } from '../gamification/DailyQuestsModal';
import { LevelUpModal } from '../gamification/LevelUpModal';
import { XpToastFloating } from '../gamification/XpToastFloating';
import { QuickStartGuideModal } from './QuickStartGuideModal';
import { CommandPaletteModal } from '../editor/CommandPaletteModal';
import { PWAInstallButton } from './PWAInstallButton';

const HighScoreModal = React.lazy(() => import('../highscores/HighScoreModal').then((module) => ({ default: module.HighScoreModal })));
const AchievementsModal = React.lazy(() => import('../achievements/AchievementsModal').then((module) => ({ default: module.AchievementsModal })));
const UserProfileModal = React.lazy(() => import('../profile/UserProfileModal').then((module) => ({ default: module.UserProfileModal })));
const ShareProgressModal = React.lazy(() => import('../social/ShareProgressModal').then((module) => ({ default: module.ShareProgressModal })));
const CodeDuelLobbyModal = React.lazy(() => import('../social/CodeDuelLobbyModal').then((module) => ({ default: module.CodeDuelLobbyModal })));

interface NavbarProps {
  currentStepId: string;
  onSelectStep: (stepId: string) => void;
  onSelectGame: (gameId: string, stepId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStepId, onSelectStep, onSelectGame }) => {
  const [showManual, setShowManual] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDuelLobby, setShowDuelLobby] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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
  const completedSteps = useWorkspaceStore(
    (state) => state.completedStepsByGame?.[state.activeGameId] || state.completedSteps
  );
  const soundEnabled = useWorkspaceStore((state) => state.soundEnabled);
  const crtModeEnabled = useWorkspaceStore((state) => state.crtModeEnabled);
  const xp = useWorkspaceStore((state) => state.xp);
  const completedQuests = useWorkspaceStore((state) => state.completedQuests);
  const fullState = useWorkspaceStore((state) => state);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  arcadeAudio.enabled = soundEnabled;

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
      <header className="flex items-center justify-between gap-2 sm:gap-6 px-2 sm:px-6 py-2 bg-slate-950 border-b border-slate-800 text-slate-100 shrink-0 relative z-30 min-w-0">
        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <Link
            to="/"
            onClick={() => setIsRunning(false)}
            aria-label="Go to home page"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <House className="h-4 w-4 shrink-0" />
            <span>Home</span>
          </Link>

          <GameSwitcher onSelectGame={onSelectGame} />
        </div>

        {/* Zone 2: Step Navigation Links for Active Game (Desktop only) */}
        <nav className="hidden xl:flex items-center gap-1.5 overflow-x-auto py-1" aria-label="Lesson steps">
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

        {/* Optional actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowMobileMenu(!showMobileMenu);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
            aria-expanded={showMobileMenu}
            aria-controls="arcade-more-menu"
          >
            More
            {claimableCount > 0 && <span className="rounded-full bg-pink-500 px-1.5 text-[10px] text-slate-950">{claimableCount}</span>}
          </button>
        </div>
      </header>

      {/* Optional actions menu */}
      {showMobileMenu && (
        <div id="arcade-more-menu" className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <PWAInstallButton />
          {/* Mobile Step Pills Bar */}
          <div className="space-y-1.5 xl:hidden">
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

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => { setShowGuide(true); setShowMobileMenu(false); }}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-cyan-800 bg-cyan-950/40 p-2.5 text-cyan-200"
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              <span>Quick start</span>
            </button>
            <button
              type="button"
              onClick={() => { setShowManual(true); setShowMobileMenu(false); }}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-200"
            >
              <HelpCircle className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>Game guide</span>
            </button>
          </div>

          <details className="rounded-xl border border-slate-800 bg-slate-900/50 p-2">
            <summary className="cursor-pointer px-2 py-1 text-xs font-semibold text-slate-300">Community and rewards</summary>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
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
          </details>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
            <span className="w-full text-slate-500">Settings</span>
            <button
              onClick={() => {
                toggleSound();
                arcadeAudio.playClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>Sound {soundEnabled ? 'on' : 'off'}</span>
            </button>
            <button
              onClick={() => {
                arcadeAudio.playClick();
                toggleCrtMode();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
            >
              <Tv className="w-3.5 h-3.5 text-pink-400" />
              <span>CRT {crtModeEnabled ? 'on' : 'off'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Notifications & Modals */}
      <XpToastFloating />
      <LevelUpModal onOpenShare={() => setShowShare(true)} />
      {showProfile && <Suspense fallback={null}>
        <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} onOpenShare={() => setShowShare(true)} />
      </Suspense>}
      {showShare && <Suspense fallback={null}>
        <ShareProgressModal isOpen={showShare} onClose={() => setShowShare(false)} />
      </Suspense>}
      <GameManualModal isOpen={showManual} onClose={() => setShowManual(false)} onSelectGame={onSelectGame} />
      {showHighScores && <Suspense fallback={null}>
        <HighScoreModal isOpen={showHighScores} onClose={() => setShowHighScores(false)} />
      </Suspense>}
      {showBadges && <Suspense fallback={null}>
        <AchievementsModal isOpen={showBadges} onClose={() => setShowBadges(false)} onOpenShare={() => setShowShare(true)} />
      </Suspense>}
      <DailyQuestsModal isOpen={showQuests} onClose={() => setShowQuests(false)} />
      {showDuelLobby && <Suspense fallback={null}><CodeDuelLobbyModal
        isOpen={showDuelLobby}
        onClose={() => setShowDuelLobby(false)}
        onSelectDuelLesson={(lessonId, gameId) => {
          onSelectGame(gameId, lessonId);
        }}
      /></Suspense>}
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
        onOpenGuide={() => setShowGuide(true)}
        onToggleTheme={() => {
          // Trigger theme toggle event or handle theme
        }}
      />
      <QuickStartGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
};


