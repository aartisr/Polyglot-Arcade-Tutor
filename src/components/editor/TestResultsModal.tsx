import React from 'react';
import { CheckCircle2, XCircle, Beaker, HelpCircle, X, ShieldAlert, Sparkles } from 'lucide-react';
import { arcadeAudio } from '../../utils/audio';

export interface TestResultItem {
  testId: string;
  name: string;
  description: string;
  hint: string;
  passed: boolean;
  message: string;
}

interface TestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: TestResultItem[];
  lessonTitle: string;
  onApplySolution?: () => void;
}

export const TestResultsModal: React.FC<TestResultsModalProps> = ({
  isOpen,
  onClose,
  results,
  lessonTitle,
  onApplySolution,
}) => {
  if (!isOpen) return null;

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Beaker className="w-6 h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-slate-100 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>Test results</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  allPassed
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                }`}>
                  {passedCount}/{totalCount} Passed
                </span>
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Active Lesson: <strong className="text-cyan-300">{lessonTitle}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close test results"
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="shrink-0 p-2 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-6">
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              No physics assertions defined for this step.
            </div>
          ) : (
            results.map((test) => (
              <div
                key={test.testId}
                className={`p-4 rounded-xl border transition-all ${
                  test.passed
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : 'bg-red-950/30 border-red-500/50 shadow-neon-magenta'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {test.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{test.name}</h4>
                      <p className="text-xs text-slate-400">{test.description}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                      test.passed
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-red-950 text-red-400 border-red-800'
                    }`}
                  >
                    {test.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>

                <div className="pl-7 space-y-1 text-xs font-mono">
                  <div className={`p-2 rounded-lg border ${test.passed ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' : 'bg-red-950/50 border-red-900/85 text-red-300'}`}>
                    <strong>Assertion Result:</strong> {test.message}
                  </div>

                  {!test.passed && test.hint && (
                    <div className="p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-300 flex items-start gap-2 mt-2">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-400">Architect Hint:</strong> {test.hint}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 font-mono">
            {allPassed ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> All physics & logic tests verified successfully!
              </span>
            ) : (
              <span>Review test assertions and hints to fix your code implementation.</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                arcadeAudio.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close Test Suite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
