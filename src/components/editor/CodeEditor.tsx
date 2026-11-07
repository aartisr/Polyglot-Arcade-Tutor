import React, { useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useWorkspaceStore, updateCode } from '../../store/workspaceStore';
import { LanguageSelector } from './LanguageSelector';
import { BoilerplateSnippetsMenu } from './BoilerplateSnippetsMenu';
import {
  registerMonacoSynthwaveThemes,
  SYNTHWAVE_NEON_THEME_ID,
  MATRIX_GREEN_THEME_ID,
} from '../../utils/monacoThemes';
import { Palette } from 'lucide-react';

interface CodeEditorProps {
  currentStepId: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ currentStepId }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(SYNTHWAVE_NEON_THEME_ID);

  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const codeMap = useWorkspaceStore((state) => state.codeMap);

  const currentCode = codeMap[activeLanguage] || '';

  const handleEditorChange = (value: string | undefined) => {
    updateCode(activeLanguage, value || '');
  };

  const handleBeforeMount = (monaco: Monaco) => {
    registerMonacoSynthwaveThemes(monaco);
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      default:
        return 'javascript';
    }
  };

  const toggleEditorTheme = () => {
    setSelectedTheme((prev) =>
      prev === SYNTHWAVE_NEON_THEME_ID ? MATRIX_GREEN_THEME_ID : SYNTHWAVE_NEON_THEME_ID
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 overflow-hidden">
      <div className="relative flex items-center justify-between bg-slate-900 border-b border-slate-800">
        <div className="flex-1">
          <LanguageSelector currentStepId={currentStepId} />
        </div>

        {/* Snippets & Theme Selectors */}
        <div className="pr-3 flex items-center gap-2 shrink-0">
          <BoilerplateSnippetsMenu />

          <button
            onClick={toggleEditorTheme}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
              selectedTheme === SYNTHWAVE_NEON_THEME_ID
                ? 'bg-pink-950/60 text-pink-300 border-pink-700/60 shadow-neon-magenta'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
            }`}
            title="Toggle Custom Monaco Synthwave/Matrix Theme"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{selectedTheme === SYNTHWAVE_NEON_THEME_ID ? 'NEON' : 'MATRIX'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getMonacoLanguage(activeLanguage)}
          theme={selectedTheme}
          value={currentCode}
          onChange={handleEditorChange}
          beforeMount={handleBeforeMount}
          options={{
            fontSize: 13.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            tabSize: 2,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            lineNumbersMinChars: 3,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs text-cyan-400 bg-slate-950 font-mono">
              Initializing Synthwave Monaco Engine...
            </div>
          }
        />
      </div>
    </div>
  );
};
