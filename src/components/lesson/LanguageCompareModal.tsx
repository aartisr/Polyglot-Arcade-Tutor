import React from 'react';
import { LessonStep, Language } from '../../types/lesson';
import { X, Code2, ArrowRight } from 'lucide-react';

interface LanguageCompareModalProps {
  lesson: LessonStep;
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageCompareModal: React.FC<LanguageCompareModalProps> = ({ lesson, isOpen, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>('javascript');

  if (!isOpen) return null;

  const comparePoints = [
    {
      feature: 'Graphics API & Canvas',
      javascript: 'HTML5 Canvas 2D Context (ctx.fillRect)',
      python: 'Pygame / Pyodide Canvas Bridge (ctx.fill_rect)',
      java: 'Swing Graphics2D (g2d.fillRect)',
    },
    {
      feature: 'Event Listeners & Key State',
      javascript: "window.addEventListener('keydown', e => ...)",
      python: 'def on_key_down(key): keys[key] = True',
      java: 'public void keyPressed(KeyEvent e)',
    },
    {
      feature: 'Game Loop Animation',
      javascript: 'requestAnimationFrame(gameLoop)',
      python: 'while running: clock.tick(60)',
      java: 'javax.swing.Timer (16ms delta)',
    },
    {
      feature: 'AABB Collision Math',
      javascript: 'r1.x < r2.x + r2.width && r1.x + r1.width > r2.x',
      python: "r1['x'] < r2['x'] + r2['width'] and ...",
      java: 'java.awt.Rectangle.intersects(other)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90dvh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800/50 text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">PolyGlot Language Comparison</h2>
              <p className="text-xs text-slate-400">{lesson.title} — JS vs Python vs Java</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Quick Syntax Rosetta Matrix */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">
              Syntax Rosetta Matrix
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-300 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Concept</th>
                    <th className="p-3 text-yellow-400">JavaScript</th>
                    <th className="p-3 text-sky-400">Python</th>
                    <th className="p-3 text-orange-400">Java</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900 font-mono text-[11.5px]">
                  {comparePoints.map((pt, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans font-medium text-slate-200">{pt.feature}</td>
                      <td className="p-3 text-slate-300">{pt.javascript}</td>
                      <td className="p-3 text-slate-300">{pt.python}</td>
                      <td className="p-3 text-slate-300">{pt.java}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Side-by-Side Code Comparison */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">
              Full Step Code Side-by-Side
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['javascript', 'python', 'java'] as Language[]).map((lang) => (
                <div key={lang} className="flex flex-col bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
                    <span className={lang === 'javascript' ? 'text-yellow-400' : lang === 'python' ? 'text-sky-400' : 'text-orange-400'}>
                      {lang.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Solution snippet</span>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed bg-slate-950">
                    {lesson.solution[lang]}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
