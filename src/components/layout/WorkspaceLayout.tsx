import React, { useState } from 'react';
import { LessonViewer } from '../lesson/LessonViewer';
import { CodeEditor } from '../editor/CodeEditor';
import { CanvasPreview } from '../preview/CanvasPreview';
import { TerminalOutput } from '../preview/TerminalOutput';
import { CommunityActivityPanel } from './CommunityActivityPanel';
import { LessonStep } from '../../types/lesson';
import { useWorkspaceStore } from '../../store/workspaceStore';
import {
  Columns,
  Monitor,
  Terminal,
  Activity,
  BookOpen,
  Code2,
  Gamepad2,
  SlidersHorizontal,
} from 'lucide-react';
import { arcadeAudio } from '../../utils/audio';

interface WorkspaceLayoutProps {
  lesson: LessonStep;
  onNavigateNext: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ lesson, onNavigateNext }) => {
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(40);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [rightBottomTab, setRightBottomTab] = useState<'canvas' | 'console' | 'split'>('split');
  const [showActivityFeed, setShowActivityFeed] = useState<boolean>(false);

  // Mobile/Tablet View Switcher ('guide' | 'editor' | 'canvas' | 'console')
  const [mobileTab, setMobileTab] = useState<'guide' | 'editor' | 'canvas' | 'console'>('editor');

  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const validationResults = useWorkspaceStore((state) => state.validationResults);

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
      className="flex-1 flex flex-col min-h-0 bg-slate-950 select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 1. Mobile & Tablet View Selector Bar (< lg screens) */}
      <div className="lg:hidden flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setMobileTab('guide');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors relative cursor-pointer ${
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
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
        <div className="flex items-center gap-2">
          {totalTestsCount > 0 && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
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

      {/* 2. Desktop Sub-toolbar for Right Panel view modes (>= lg screens) */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-xs shrink-0">
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
      <div className="lg:hidden flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {mobileTab === 'guide' && (
          <div className="flex-1 overflow-y-auto">
            <LessonViewer lesson={lesson} onNavigateNext={onNavigateNext} />
          </div>
        )}

        {mobileTab === 'editor' && (
          <div className="flex-1 flex flex-col min-h-0">
            <CodeEditor currentStepId={lesson.id} />
          </div>
        )}

        {mobileTab === 'canvas' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <CanvasPreview currentStepId={lesson.id} />
          </div>
        )}

        {mobileTab === 'console' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <TerminalOutput />
          </div>
        )}

        {/* Community Activity Sidebar Overlay on Mobile */}
        <CommunityActivityPanel
          isOpen={showActivityFeed}
          onClose={() => setShowActivityFeed(false)}
        />
      </div>

      {/* Desktop Multi-Pane Split Workbench (>= lg) */}
      <div className="hidden lg:flex flex-1 min-h-0 relative">
        {/* Left Panel: Lesson & Concept Diagrams */}
        <div
          style={{ width: `${leftWidthPercent}%` }}
          className="h-full min-w-[300px] flex flex-col shrink-0"
        >
          <LessonViewer lesson={lesson} onNavigateNext={onNavigateNext} />
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
            <CodeEditor currentStepId={lesson.id} />
          </div>

          {/* Bottom Half: Output Canvas & Terminal */}
          <div className="h-2/5 min-h-[220px] border-t border-slate-800 flex min-h-0">
            {rightBottomTab === 'split' && (
              <>
                <div className="w-1/2 h-full border-r border-slate-800 min-w-0">
                  <CanvasPreview currentStepId={lesson.id} />
                </div>
                <div className="w-1/2 h-full min-w-0">
                  <TerminalOutput />
                </div>
              </>
            )}

            {rightBottomTab === 'canvas' && (
              <div className="w-full h-full">
                <CanvasPreview currentStepId={lesson.id} />
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
        <CommunityActivityPanel
          isOpen={showActivityFeed}
          onClose={() => setShowActivityFeed(false)}
        />
      </div>
    </div>
  );
};
