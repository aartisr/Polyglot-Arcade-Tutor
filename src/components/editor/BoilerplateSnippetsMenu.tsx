import React, { useState } from 'react';
import { useWorkspaceStore, updateCode, appendLog } from '../../store/workspaceStore';
import { getGameById } from '../../data/gamesRegistry';
import { arcadeAudio } from '../../utils/audio';
import { Sparkles, ChevronDown } from 'lucide-react';

interface BoilerplateSnippetsMenuProps {
  className?: string;
}

export const BoilerplateSnippetsMenu: React.FC<BoilerplateSnippetsMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const currentCode = useWorkspaceStore((state) => state.codeMap[activeLanguage] || '');

  const snippets = getGameById(activeGameId).snippets ?? [];

  if (snippets.length === 0) return null;

  const handleInsertSnippet = (snippetText: string, label: string) => {
    arcadeAudio.playClick();
    const updated = currentCode ? `${currentCode}\n\n${snippetText}` : snippetText;
    updateCode(activeLanguage, updated);
    appendLog(`[SYSTEM] Inserted boilerplate snippet '${label}' into ${activeLanguage.toUpperCase()} editor.`);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => {
          arcadeAudio.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold rounded-lg transition-all shadow-sm cursor-pointer"
        title="Insert pre-configured game entity code snippets"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Snippets</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed inset-x-2 top-36 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full mt-2 w-auto sm:w-72 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 flex items-center justify-between">
            <span>Entity Code Snippets</span>
            <span className="text-cyan-400">{activeLanguage.toUpperCase()}</span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {snippets.map((snip) => (
              <button
                key={snip.id}
                onClick={() => handleInsertSnippet(snip.snippets[activeLanguage], snip.label)}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {snip.label}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">+ Insert</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{snip.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
