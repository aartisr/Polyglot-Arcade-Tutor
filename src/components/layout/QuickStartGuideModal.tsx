import React, { useState } from 'react';
import { X, Play, Code2, Terminal, BookOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: GuideStep[] = [
  {
    title: 'Welcome to the Arcade',
    description: 'Master retro 2D game development across JavaScript, Python, and Java. Follow this tour to get started!',
    icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
  },
  {
    title: 'Code Editor',
    description: 'Write your game logic here. Use the snippet menu to scaffold entities and toggle themes for that classic synthwave vibe.',
    icon: <Code2 className="w-8 h-8 text-pink-400" />,
  },
  {
    title: 'Game Canvas',
    description: 'Preview your game engine in real-time. Use the Run button or Ctrl+Enter to initialize the loop and physics.',
    icon: <Play className="w-8 h-8 text-emerald-400" />,
  },
  {
    title: 'Terminal Console',
    description: 'Debug your engine output, view physics logs, and check test results in the terminal pane.',
    icon: <Terminal className="w-8 h-8 text-amber-400" />,
  },
];

interface QuickStartGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickStartGuideModal: React.FC<QuickStartGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wider">QUICK START GUIDE ({currentStep + 1}/{steps.length})</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            {step.icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">{step.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {step.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-cyan-400' : 'bg-slate-700'}`} />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
