import React, { useState } from 'react';
import { LessonViewer } from '../lesson/LessonViewer';
import { CodeEditor } from '../editor/CodeEditor';
import { CanvasPreview } from '../preview/CanvasPreview';
import { TerminalOutput } from '../preview/TerminalOutput';
import { CommunityActivityPanel } from './CommunityActivityPanel';
import { LessonStep } from '../../types/lesson';
import { Columns, Monitor, Terminal, Activity } from 'lucide-react';
import { arcadeAudio } from '../../utils/audio';

interface WorkspaceLayoutProps {
  lesson: LessonStep;
  onNavigateNext: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ lesson, onNavigateNext }) => {
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(40);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [rightBottomTab, setRightBottomTab] = useState<'canvas' | 'console' | 'split'>('split');
  const [showActivityFeed, setShowActivityFeed] = useState<boolean>(true);

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
      {/* Sub-toolbar for Right Panel view modes & Community Feed Toggle */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span>IDE Mode: Split Workbench</span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-md border border-slate-800">
            <button
              onClick={() => {
                arcadeAudio.playClick();
                setRightBottomTab('split');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
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
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold font-mono border transition-colors ${
              showActivityFeed
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60 shadow-neon-cyan'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Live Firestore Activity Feed"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Activity</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main 2-Panel Split Workspace + Docked Community Sidebar */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Panel: Lesson & Concept Diagrams */}
        <div
          style={{ width: `${leftWidthPercent}%` }}
          className="h-full min-w-[280px] flex flex-col shrink-0"
        >
          <LessonViewer lesson={lesson} onNavigateNext={onNavigateNext} />
        </div>

        {/* Resizable Divider Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1.5 h-full cursor-col-resize hover:bg-cyan-500/80 transition-colors z-10 flex items-center justify-center ${
            isDragging ? 'bg-cyan-400' : 'bg-slate-800'
          }`}
          title="Drag to resize panels"
        >
          <div className="w-0.5 h-8 bg-slate-600 rounded-full" />
        </div>

        {/* Center Panel: Code Editor (Top) + Canvas / Console (Bottom) */}
        <div className="flex-1 h-full min-w-[320px] flex flex-col min-h-0 bg-slate-950">
          {/* Top Half: Monaco Editor */}
          <div className="h-3/5 min-h-[220px] flex flex-col">
            <CodeEditor currentStepId={lesson.id} />
          </div>

          {/* Bottom Half: Output Canvas & Terminal */}
          <div className="h-2/5 min-h-[200px] border-t border-slate-800 flex min-h-0">
            {rightBottomTab === 'split' && (
              <>
                <div className="w-1/2 h-full border-r border-slate-800">
                  <CanvasPreview currentStepId={lesson.id} />
                </div>
                <div className="w-1/2 h-full">
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
