import { useState } from 'react';
import { Eye, Lightbulb } from 'lucide-react';
import type { Language, LessonStep } from '../../types/lesson';

interface LessonHelpProps {
  lesson: LessonStep;
  language: Language;
}

const languageNames: Record<Language, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
};

export function LessonHelp({ lesson, language }: LessonHelpProps) {
  const [visibleHints, setVisibleHints] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const hints = lesson.hints.filter((hint) => {
    const languageMention = hint.match(/^In (JavaScript|Python|Java),/);
    return !languageMention || languageMention[1] === languageNames[language];
  });

  return (
    <section aria-label="Help with this lesson" className="rounded-xl border border-amber-700/40 bg-amber-950/15 p-3.5 space-y-3">
      <div className="flex items-start gap-2.5">
        <Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
        <div>
          <h2 className="text-sm font-semibold text-amber-100">Stuck on a TODO?</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            Start with one hint, then try the code yourself. You can view a completed example whenever you need it.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleHints < hints.length && (
          <button
            type="button"
            onClick={() => setVisibleHints((count) => count + 1)}
            className="rounded-lg border border-amber-700/60 bg-amber-950/40 px-3 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            {visibleHints === 0 ? 'Show a hint' : 'Show another hint'}
          </button>
        )}
        <button
          type="button"
          aria-expanded={showExample}
          onClick={() => setShowExample((value) => !value)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
          {showExample ? 'Hide worked example' : 'View worked example'}
        </button>
      </div>

      {visibleHints > 0 && (
        <ol aria-live="polite" className="list-decimal space-y-2 pl-5 text-xs leading-relaxed text-amber-100">
          {hints.slice(0, visibleHints).map((hint, index) => <li key={index}>{hint}</li>)}
        </ol>
      )}

      {showExample && (
        <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
          <p className="mb-2 text-xs text-slate-300">
            Completed {languageNames[language]} example. Your editor code stays unchanged; compare this with each TODO.
          </p>
          <pre className="max-h-64 overflow-auto whitespace-pre text-[11px] leading-relaxed text-cyan-200"><code>{lesson.solution[language]}</code></pre>
        </div>
      )}
    </section>
  );
}
