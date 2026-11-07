import React from 'react';
import Editor from '@monaco-editor/react';
import { useWorkspaceStore, updateCode } from '../../store/workspaceStore';
import { LanguageSelector } from './LanguageSelector';

interface CodeEditorProps {
  currentStepId: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ currentStepId }) => {
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const codeMap = useWorkspaceStore((state) => state.codeMap);

  const currentCode = codeMap[activeLanguage] || '';

  const handleEditorChange = (value: string | undefined) => {
    updateCode(activeLanguage, value || '');
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

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 overflow-hidden">
      <LanguageSelector currentStepId={currentStepId} />
      
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getMonacoLanguage(activeLanguage)}
          theme="vs-dark"
          value={currentCode}
          onChange={handleEditorChange}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            tabSize: 2,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            lineNumbersMinChars: 3,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            smoothScrolling: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs text-slate-400 bg-slate-950 font-mono">
              Loading Monaco Editor...
            </div>
          }
        />
      </div>
    </div>
  );
};
