import React, { useState } from 'react';
import { useWorkspaceStore, setLanguage, setDifficulty, updateCode, appendLog } from '../../store/workspaceStore';
import { Language, DifficultyLevel } from '../../types/lesson';
import { getLessonByGameAndId } from '../../data/gamesRegistry';
import { RotateCcw, Eye, Gauge, SlidersHorizontal } from 'lucide-react';

interface LanguageSelectorProps {
  currentStepId: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentStepId }) => {
  const [showOptions, setShowOptions] = useState(false);
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const difficulty = useWorkspaceStore((state) => state.difficulty);

  const currentStep = getLessonByGameAndId(activeGameId, currentStepId);

  const languages: { id: Language; label: string; icon: string; color: string }[] = [
    { id: 'javascript', label: 'JavaScript', icon: 'JS', color: 'bg-yellow-400 text-slate-950 font-bold' },
    { id: 'python', label: 'Python', icon: 'PY', color: 'bg-sky-400 text-slate-950 font-bold' },
    { id: 'java', label: 'Java', icon: 'JAVA', color: 'bg-orange-500 text-white font-bold' },
  ];

  const difficultyLabels: Record<DifficultyLevel, { name: string; speed: string; color: string }> = {
    1: { name: 'Casual', speed: '1.0x Speed', color: 'text-emerald-400' },
    2: { name: 'Normal', speed: '1.25x Speed', color: 'text-cyan-400' },
    3: { name: 'Challenging', speed: '1.5x Speed', color: 'text-amber-400' },
    4: { name: 'Hard', speed: '1.75x Speed', color: 'text-orange-400' },
    5: { name: 'Extreme', speed: '2.0x Speed', color: 'text-rose-400' },
  };

  const handleResetCode = () => {
    if (confirm(`Reset ${activeLanguage.toUpperCase()} code to step starter template?`)) {
      const boilerplate = currentStep.codeBoilerplate[activeLanguage];
      updateCode(activeLanguage, boilerplate);
      appendLog(`[SYSTEM] Reset ${activeLanguage} code to starter template.`);
    }
  };

  const handleRevealSolution = () => {
    if (confirm(`Load complete solution for ${activeLanguage.toUpperCase()}?`)) {
      const solution = currentStep.solution[activeLanguage];
      updateCode(activeLanguage, solution);
      appendLog(`[SYSTEM] Revealed solution for ${activeLanguage} in ${currentStep.title}.`);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = Number(e.target.value) as DifficultyLevel;
    setDifficulty(level);
    appendLog(`[SYSTEM] Execution difficulty set to Level ${level} (${difficultyLabels[level].name} - ${difficultyLabels[level].speed})`);
  };

  return (
    <div className="flex flex-col gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0 min-w-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
      {/* Language Switcher Tabs */}
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto p-0.5 bg-slate-950 rounded-lg border border-slate-800">
        {languages.map((lang) => {
          const isActive = activeLanguage === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                appendLog(`[SYSTEM] Switched active language tab to ${lang.label}`);
              }}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                isActive
                  ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className={`text-[9px] px-1 py-0.2 rounded ${lang.color}`}>
                {lang.icon}
              </span>
              <span>{lang.label}</span>
            </button>
          );
        })}
      </div>

      <button type="button" aria-expanded={showOptions} onClick={() => setShowOptions((value) => !value)} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-300 hover:text-cyan-300">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Options</span>
      </button>
      </div>
      {showOptions && <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-2">
      <label className="flex items-center gap-2 px-2.5 py-2 bg-slate-950 rounded-lg border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>Difficulty</span>
        </div>

        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={difficulty}
          onChange={handleSliderChange}
          className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          title={`Adjust game difficulty (Level ${difficulty}: ${difficultyLabels[difficulty].name})`}
        />

        <div className="flex items-center gap-1 text-xs font-mono font-semibold">
          <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">Lvl {difficulty}</span>
        </div>
      </label>

      <div className="flex items-center gap-2">
        <button
          onClick={handleResetCode}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
          title="Reset starter boilerplate"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleRevealSolution}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 rounded-md transition-colors"
          title="Show solution code"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Solution</span>
        </button>
      </div>
      </div>}
    </div>
  );
};
