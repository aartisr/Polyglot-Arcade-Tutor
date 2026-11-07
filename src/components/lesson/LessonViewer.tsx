import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { LessonStep } from '../../types/lesson';
import {
  useWorkspaceStore,
  setValidationResult,
  setStepCompleted,
  appendLog,
  setIsRunning,
  addXp,
  incrementCombo,
} from '../../store/workspaceStore';
import { arcadeAudio } from '../../utils/audio';
import { unlockAchievement } from '../../lib/achievementService';
import { LanguageCompareModal } from './LanguageCompareModal';
import { BookOpen, CheckCircle2, XCircle, Play, HelpCircle, Code2, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

interface LessonViewerProps {
  lesson: LessonStep;
  onNavigateNext?: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onNavigateNext }) => {
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const codeMap = useWorkspaceStore((state) => state.codeMap);
  const logs = useWorkspaceStore((state) => state.logs);
  const validationResults = useWorkspaceStore((state) => state.validationResults);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);

  const stepStartRef = useRef<number>(Date.now());
  const userCode = codeMap[activeLanguage] || '';
  const isStepCompleted = Boolean(completedSteps[lesson.id]);

  const handleRunTests = async () => {
    appendLog(`[TEST SUITE] Executing validation checks for ${lesson.title}...`);
    setIsRunning(true);

    let allPassed = true;
    let passedCount = 0;

    lesson.tests.forEach((test) => {
      const result = test.check(userCode, logs);
      setValidationResult(test.id, result.passed, result.message);

      if (result.passed) {
        appendLog(`[TEST PASSED] ${test.name}: ${result.message}`);
        passedCount++;
        addXp(100, `Passed ${test.name}`);
        incrementCombo();
      } else {
        appendLog(`[TEST FAILED] ${test.name}: ${result.message}`);
        allPassed = false;
      }
    });

    if (allPassed && passedCount > 0) {
      setStepCompleted(lesson.id, true);
      addXp(200, `Completed ${lesson.title}`);
      appendLog(`[SYSTEM] STEP COMPLETE! Great job mastering ${lesson.title}.`);
      arcadeAudio.playVictoryFanfare();

      // Check achievement conditions
      const elapsed = (Date.now() - stepStartRef.current) / 1000;
      if (elapsed <= 15) {
        unlockAchievement('speed_demon');
      }
      unlockAchievement('flawless_compiler');

      if (lesson.id === 'step-3') {
        unlockAchievement('aabb_architect');
      }

      // Check if all 4 steps completed
      const totalDone = Object.keys({ ...completedSteps, [lesson.id]: true }).length;
      if (totalDone >= 4) {
        unlockAchievement('master_rogue');
      }

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#ff007f', '#eab308'],
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 overflow-y-auto">
      {/* Lesson Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              STEP {lesson.stepNumber} OF 4
            </span>
            <span className="text-xs text-slate-400 font-mono">Neon Dungeon: Rogue Crawler</span>
          </div>

          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-md transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Compare Languages</span>
          </button>
        </div>

        <h1 className="text-lg font-bold text-slate-100 mb-1">{lesson.title}</h1>
        <p className="text-xs text-slate-400 leading-relaxed">{lesson.subtitle}</p>
      </div>

      {/* Main Instruction Body */}
      <div className="flex-1 p-4 space-y-6 text-sm text-slate-300">
        {/* Description Section */}
        <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-2">
          {lesson.description.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-slate-300">
              {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          ))}
        </div>

        {/* Concepts & Interactive Diagrams */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Key Game Engineering Concepts</span>
          </h2>

          {lesson.concepts.map((concept, idx) => (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <h3 className="text-xs font-bold text-slate-200">{concept.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{concept.description}</p>

              {/* Interactive Visual Diagrams */}
              {concept.diagramType === 'canvas-coords' && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-cyan-400 mb-2 flex items-center justify-between">
                    <span>2D Canvas Coordinate Surface</span>
                    <span>(0,0) Top-Left Origin</span>
                  </div>
                  <div className="relative h-28 bg-slate-950 rounded border border-slate-800 p-2 flex items-center justify-center">
                    <span className="absolute top-1 left-2 text-[10px] font-mono text-cyan-400">(0,0)</span>
                    <span className="absolute top-1 right-2 text-[10px] font-mono text-slate-500">+X (400px) &rarr;</span>
                    <span className="absolute bottom-1 left-2 text-[10px] font-mono text-slate-500">+Y (400px) &darr;</span>
                    
                    <div className="w-10 h-10 bg-cyan-400/20 border-2 border-cyan-400 rounded flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <span className="text-[9px] font-mono text-cyan-300 font-bold">HERO</span>
                    </div>
                  </div>
                </div>
              )}

              {concept.diagramType === 'velocity-vector' && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-cyan-400 mb-2">Vector Physics Formula: pos += velocity</div>
                  <div className="flex items-center justify-around p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs">
                    <span className="text-slate-300">x: {180}</span>
                    <span className="text-cyan-400">+ vx ({4})</span>
                    <span className="text-slate-500">&rarr;</span>
                    <span className="text-emerald-400 font-bold">newX: {184}</span>
                  </div>
                </div>
              )}

              {concept.diagramType === 'aabb-collision' && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-rose-400 mb-2">AABB Overlap Test Formula</div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[10.5px] text-slate-300 leading-relaxed">
                    r1.x &lt; r2.x + r2.w &amp;&amp; r1.x + r1.w &gt; r2.x &amp;&amp; <br />
                    r1.y &lt; r2.y + r2.h &amp;&amp; r1.y + r1.h &gt; r2.y
                  </div>
                </div>
              )}

              {concept.diagramType === 'game-loop' && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-cyan-400 mb-2">60 FPS Game Loop Lifecycle</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10.5px] font-mono">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">1. Input Events</div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-cyan-300">2. Physics Update</div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-300">3. Render Frame</div>
                  </div>
                </div>
              )}

              {/* Language Code Snippet */}
              {concept.codeSnippet && concept.codeSnippet[activeLanguage] && (
                <div className="bg-slate-900 rounded border border-slate-800 overflow-hidden">
                  <div className="px-2.5 py-1 bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{activeLanguage.toUpperCase()} Pattern</span>
                  </div>
                  <pre className="p-2.5 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                    {concept.codeSnippet[activeLanguage]}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Test Validation Suite */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Step Test Validation Suite</span>
            </h2>
            <button
              onClick={handleRunTests}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-md shadow-md shadow-cyan-500/20 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Validate Code</span>
            </button>
          </div>

          <div className="space-y-2">
            {lesson.tests.map((test) => {
              const res = validationResults[test.id];
              return (
                <div
                  key={test.id}
                  className={`p-3 rounded-lg border text-xs transition-colors ${
                    res?.passed
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                      : res
                      ? 'bg-rose-950/20 border-rose-800/60 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-medium">
                      {res?.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : res ? (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span>{test.name}</span>
                    </div>
                    {res && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${res.passed ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'}`}>
                        {res.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6">{test.description}</p>
                  {res && !res.passed && (
                    <div className="mt-2 pl-6 text-[11px] text-rose-400 font-mono">
                      Feedback: {res.message}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hints Accordion */}
          {lesson.hints && lesson.hints.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Need a Hint?</span>
              </div>
              <div className="space-y-1.5">
                {lesson.hints.map((hint, idx) => (
                  <div key={idx} className="bg-slate-900 rounded border border-slate-800">
                    <button
                      onClick={() => setActiveHintIndex(activeHintIndex === idx ? null : idx)}
                      className="w-full px-3 py-1.5 text-left text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center justify-between"
                    >
                      <span>Hint #{idx + 1}</span>
                      <span className="text-slate-500">{activeHintIndex === idx ? 'Hide' : 'Show'}</span>
                    </button>
                    {activeHintIndex === idx && (
                      <div className="px-3 py-2 bg-slate-950 text-xs text-amber-200/90 border-t border-slate-800 font-sans">
                        {hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Button */}
        {onNavigateNext && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-mono">
              {isStepCompleted ? 'Step completed! Ready for next level.' : 'Complete tests to advance.'}
            </div>
            <button
              onClick={onNavigateNext}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-lg transition-all ${
                isStepCompleted
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Language Comparison Modal */}
      <LanguageCompareModal
        lesson={lesson}
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
      />
    </div>
  );
};
