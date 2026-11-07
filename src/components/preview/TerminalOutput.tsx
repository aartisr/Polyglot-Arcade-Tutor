import React, { useRef, useEffect } from 'react';
import { useWorkspaceStore, clearLogs } from '../../store/workspaceStore';
import { Terminal, Trash2, Copy, Check } from 'lucide-react';

export const TerminalOutput: React.FC = () => {
  const logs = useWorkspaceStore((state) => state.logs);
  const [copied, setCopied] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogStyle = (log: string) => {
    if (log.includes('[ERROR]') || log.includes('Error') || log.includes('FAILED')) {
      return 'text-rose-400 bg-rose-950/20 border-l-2 border-rose-500 pl-2';
    }
    if (log.includes('[TEST PASSED]') || log.includes('SUCCESS') || log.includes('PASSED')) {
      return 'text-emerald-400 font-medium';
    }
    if (log.includes('[SYSTEM]')) {
      return 'text-cyan-400 font-semibold';
    }
    if (log.includes('[PYTHON]') || log.includes('[JAVA]')) {
      return 'text-amber-300';
    }
    return 'text-slate-300';
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800 text-xs font-mono select-text">
      {/* Console Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Execution Console</span>
          <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-800 font-sans">
            {logs.length} logs
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Copy logs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[11px] font-sans">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-3 h-3" />
            <span className="text-[11px] font-sans">Clear</span>
          </button>
        </div>
      </div>

      {/* Log Output Area */}
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-1 bg-slate-950/90">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-4 text-center">Console output empty. Run code to view output logs.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`leading-relaxed break-words font-mono text-[11.5px] ${getLogStyle(log)}`}>
              <span className="text-slate-600 mr-2 select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
