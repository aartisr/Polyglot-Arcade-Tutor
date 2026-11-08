import React, { useState } from 'react';
import { Beaker } from 'lucide-react';
import { useWorkspaceStore, updateCode } from '../../store/workspaceStore';
import { gameRegistry } from '../../services/GameRegistry';
import { arcadeAudio } from '../../utils/audio';
import { BoilerplateSnippetsMenu } from './BoilerplateSnippetsMenu';
import { LanguageSelector } from './LanguageSelector';
import { TestResultsModal, TestResultItem } from './TestResultsModal';

interface MobileCodeEditorProps {
  currentStepId: string;
}

export const MobileCodeEditor: React.FC<MobileCodeEditorProps> = ({ currentStepId }) => {
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const currentCode = useWorkspaceStore((state) => state.codeMap[state.activeLanguage] || '');
  const logs = useWorkspaceStore((state) => state.logs);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const currentLesson = gameRegistry.getLesson(activeGameId, currentStepId);

  const handleRunTests = () => {
    arcadeAudio.playClick();
    setTestResults(gameRegistry.runLessonTests(activeGameId, currentStepId, currentCode, logs));
    setShowTestModal(true);
  };

  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 bg-slate-950">
      <LanguageSelector currentStepId={currentStepId} />
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
        <span className="text-xs text-slate-400">Mobile code editor</span>
        <div className="flex items-center gap-2">
          <BoilerplateSnippetsMenu />
          <button
            type="button"
            onClick={handleRunTests}
            className="flex items-center gap-1 rounded-lg border border-cyan-500/60 bg-cyan-950/70 px-3 py-1.5 text-xs font-semibold text-cyan-300"
          >
            <Beaker className="h-4 w-4" />
            Run Tests
          </button>
        </div>
      </div>
      <textarea
        aria-label={`${activeLanguage} code editor`}
        value={currentCode}
        onChange={(event) => updateCode(activeLanguage, event.target.value)}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="min-h-0 min-w-0 flex-1 resize-none overflow-auto select-text bg-slate-950 p-4 font-mono text-base leading-6 text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
      />
      <TestResultsModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        results={testResults}
        lessonTitle={currentLesson.title}
      />
    </div>
  );
};
