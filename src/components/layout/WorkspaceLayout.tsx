import React, { Suspense, useEffect, useState } from 'react';
import { MobileCodeEditor } from '../editor/MobileCodeEditor';
import { TerminalOutput } from '../preview/TerminalOutput';
import { LessonStep } from '../../types/lesson';
import { useWorkspaceStore, setIsRunning } from '../../store/workspaceStore';
import { getGameById } from '../../data/gamesRegistry';
import { downloadGame, downloadLessonCode } from '../../services/gameExport';
import {
  Columns,
  Monitor,
  Terminal,
  Activity,
  BookOpen,
  Code2,
  Gamepad2,
  SlidersHorizontal,
  Download,
  Play,
} from 'lucide-react';
import { arcadeAudio } from '../../utils/audio';

const CodeEditor = React.lazy(() => import('../editor/CodeEditor').then((module) => ({ default: module.CodeEditor })));
const LessonViewer = React.lazy(() => import('../lesson/LessonViewer').then((module) => ({ default: module.LessonViewer })));
const CanvasPreview = React.lazy(() => import('../preview/CanvasPreview').then((module) => ({ default: module.CanvasPreview })));
const CommunityActivityPanel = React.lazy(() => import('./CommunityActivityPanel').then((module) => ({ default: module.CommunityActivityPanel })));
const FinishedGameModal = React.lazy(() => import('../preview/FinishedGameModal').then((module) => ({ default: module.FinishedGameModal })));

interface WorkspaceLayoutProps {
  lesson: LessonStep;
  onNavigateNext: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ lesson, onNavigateNext }) => {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1280px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const update = () => setIsDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(40);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [rightBottomTab, setRightBottomTab] = useState<'canvas' | 'console' | 'split'>('split');
  const [showActivityFeed, setShowActivityFeed] = useState<boolean>(false);
  const [showFinishedGame, setShowFinishedGame] = useState(false);

  // Mobile/Tablet View Switcher ('guide' | 'editor' | 'canvas' | 'console')
  const [mobileTab, setMobileTab] = useState<'guide' | 'editor' | 'canvas' | 'console'>('guide');

  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const difficulty = useWorkspaceStore((state) => state.difficulty);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const codeMap = useWorkspaceStore((state) => state.codeMap);
  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const validationResults = useWorkspaceStore((state) => state.validationResults);
  const activeGame = getGameById(activeGameId);
  const isFinalLesson = activeGame.lessons.at(-1)?.id === lesson.id;

  const playFinishedGame = () => {
    setIsRunning(false);
    setShowFinishedGame(true);
  };

  const previewCurrentStep = () => {
    setMobileTab('canvas');
    setRightBottomTab('canvas');
    setIsRunning(true);
  };

  const passedTestsCount = Object.values(validationResults).filter((r) => r.passed).length;
  const totalTestsCount = lesson.tests?.length || 0;

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const containerWidth = window.innerWidth;
    const newPercent = (e.clientX / containerWidth) * 100;
    if (newPercent >= 25 && newPercent <= 65) {
      setLeftWidthPercent(newPercent);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-950 select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 1. Mobile & Tablet View Selector Bar (< lg screens) */}
      <div className="xl:hidden flex items-center justify-between gap-2 px-2 sm:px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-xs shrink-0 min-w-0">
        <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 min-w-0 overflow-x-auto">
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setMobileTab('guide');
            }}
            className={`flex shrink-0 items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              mobileTab === 'guide'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          <button
            onClick={() => {
              arcadeAudio.playClick();
              setMobileTab('editor');
            }}
            className={`flex shrink-0 items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              mobileTab === 'editor'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => {
              arcadeAudio.playClick();
              setMobileTab('canvas');
            }}
            className={`flex shrink-0 items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors relative cursor-pointer ${
              mobileTab === 'canvas'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Game</span>
            {isRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              arcadeAudio.playClick();
              setMobileTab('console');
            }}
            className={`flex shrink-0 items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              mobileTab === 'console'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>
        </div>

        {/* Live Activity & Tests Indicator */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {totalTestsCount > 0 && (
            <span
              className={`hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                passedTestsCount === totalTestsCount
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {passedTestsCount}/{totalTestsCount} Tests
            </span>
          )}

          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowActivityFeed(!showActivityFeed);
            }}
            className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
              showActivityFeed
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="Toggle Live Activity Sidebar"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isFinalLesson ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-cyan-900/60 bg-cyan-950/30 px-3 py-2 text-xs sm:px-4">
          <span className="mr-auto font-semibold text-cyan-200">Final lesson · Play the completed game</span>
          <button type="button" onClick={playFinishedGame} className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 font-bold text-slate-950"><Play className="h-4 w-4" /> Play game</button>
          <button type="button" onClick={() => downloadGame(activeGame, difficulty)} className="flex items-center gap-1.5 rounded-lg border border-cyan-700 px-3 py-2 font-semibold text-cyan-200"><Download className="h-4 w-4" /> Download game</button>
          <button type="button" onClick={() => downloadLessonCode(activeGame, codeMap[activeLanguage] ?? '', activeLanguage)} className="rounded-lg px-2 py-2 text-slate-300 underline underline-offset-4">Download my code</button>
        </div>
      ) : (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-400 sm:px-4">
          <span>Steps 1–{activeGame.lessons.length - 1} build the game. The final lesson has Play and Download.</span>
          <button type="button" onClick={previewCurrentStep} className="rounded-lg border border-slate-700 px-3 py-1.5 font-semibold text-cyan-300">Preview this step</button>
        </div>
      )}

      {/* 2. Desktop Sub-toolbar for Right Panel view modes (>= lg screens) */}
      <div className="hidden xl:flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span>IDE Mode: Multi-Pane Split Workbench</span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-md border border-slate-800">
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setRightBottomTab('split');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                rightBottomTab === 'split' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Canvas & Console</span>
            </button>
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setRightBottomTab('canvas');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                rightBottomTab === 'canvas' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Canvas</span>
            </button>
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setRightBottomTab('console');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                rightBottomTab === 'console' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Full Console</span>
            </button>
          </div>

          {/* Toggle Community Activity Panel Button */}
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setShowActivityFeed(!showActivityFeed);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold font-mono border transition-colors cursor-pointer ${
              showActivityFeed
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60 shadow-neon-cyan'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Live Firestore Activity Feed"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Activity</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* 3. Responsive Workspace Body */}
      {/* Mobile/Tablet Single Tab Viewport (< lg) */}
      {!isDesktop && <div className="flex-1 flex flex-col min-h-0 min-w-0 relative overflow-hidden">
        {mobileTab === 'guide' && (
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<div className="p-4 text-xs text-cyan-400">Loading guide…</div>}>
              <LessonViewer lesson={lesson} onNavigateNext={onNavigateNext} isFinalLesson={isFinalLesson} />
            </Suspense>
          </div>
        )}

        {mobileTab === 'editor' && (
          <div className="flex-1 flex flex-col min-h-0">
            <MobileCodeEditor currentStepId={lesson.id} />
          </div>
        )}

        {mobileTab === 'canvas' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <Suspense fallback={<div className="p-4 text-xs text-cyan-400">Loading game…</div>}>
              <CanvasPreview currentStepId={lesson.id} />
            </Suspense>
          </div>
        )}

        {mobileTab === 'console' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <TerminalOutput />
          </div>
        )}

        {/* Community Activity Sidebar Overlay on Mobile */}
        {showActivityFeed && (
          <Suspense fallback={null}>
            <CommunityActivityPanel isOpen={showActivityFeed} onClose={() => setShowActivityFeed(false)} />
          </Suspense>
        )}
      </div>}

      {/* Desktop Multi-Pane Split Workbench (>= lg) */}
      {isDesktop && <div className="flex flex-1 min-h-0 relative">
        {/* Left Panel: Lesson & Concept Diagrams */}
        <div
          style={{ width: `${leftWidthPercent}%` }}
          className="h-full min-w-[300px] flex flex-col shrink-0"
        >
          <Suspense fallback={<div className="p-4 text-xs text-cyan-400">Loading guide…</div>}>
            <LessonViewer lesson={lesson} onNavigateNext={onNavigateNext} isFinalLesson={isFinalLesson} />
          </Suspense>
        </div>

        {/* Resizable Divider Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1.5 h-full cursor-col-resize hover:bg-cyan-500/80 transition-colors z-10 flex items-center justify-center shrink-0 ${
            isDragging ? 'bg-cyan-400' : 'bg-slate-800'
          }`}
          title="Drag to resize panels"
        >
          <div className="w-0.5 h-8 bg-slate-600 rounded-full" />
        </div>

        {/* Center Panel: Code Editor (Top) + Canvas / Console (Bottom) */}
        <div className="flex-1 h-full min-w-[360px] flex flex-col min-h-0 bg-slate-950">
          {/* Top Half: Monaco Editor */}
          <div className="h-3/5 min-h-[240px] flex flex-col">
            <Suspense fallback={<div className="p-4 text-xs text-cyan-400">Loading code editor…</div>}>
              <CodeEditor currentStepId={lesson.id} />
            </Suspense>
          </div>

          {/* Bottom Half: Output Canvas & Terminal */}
          <div className="h-2/5 min-h-[220px] border-t border-slate-800 flex min-h-0">
            {rightBottomTab === 'split' && (
              <>
                <div className="w-1/2 h-full border-r border-slate-800 min-w-0">
                  <Suspense fallback={<div className="p-4 text-xs text-cyan-400">Loading game…</div>}>
                    <CanvasPreview currentStepId={lesson.id} />
                  </Suspense>
                </div>
                <div className="w-1/2 h-full min-w-0">
                  <TerminalOutput />
                </div>
              </>
            )}

            {rightBottomTab === 'canvas' && (
              <div className="w-full h-full">
                <Suspense fallback={<div className="p-4 text-xs text-cyan-400">Loading game…</div>}>
                  <CanvasPreview currentStepId={lesson.id} />
                </Suspense>
              </div>
            )}

            {rightBottomTab === 'console' && (
              <div className="w-full h-full">
                <TerminalOutput />
              </div>
            )}
          </div>
        </div>

        {/* Right Docked Panel: Community Activity Sidebar */}
        {showActivityFeed && (
          <Suspense fallback={null}>
            <CommunityActivityPanel isOpen={showActivityFeed} onClose={() => setShowActivityFeed(false)} />
          </Suspense>
        )}
      </div>}
      {showFinishedGame && <Suspense fallback={<div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950 text-cyan-300">Opening game…</div>}>
        <FinishedGameModal game={activeGame} difficulty={difficulty} onClose={() => setShowFinishedGame(false)} onDownload={() => downloadGame(activeGame, difficulty)} />
      </Suspense>}
    </div>
  );
};
