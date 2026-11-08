import React from 'react';
import { RealtimeLeaderboard } from './RealtimeLeaderboard';
import { arcadeAudio } from '../../utils/audio';
import { X } from 'lucide-react';

interface HighScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore?: number;
}

export const HighScoreModal: React.FC<HighScoreModalProps> = ({ isOpen, onClose, currentScore = 1500 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92dvh] flex flex-col">
        {/* Modal Close Floating Button */}
        <button
          onClick={() => {
            arcadeAudio.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-100 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors shadow-lg"
          title="Close Leaderboard Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <RealtimeLeaderboard currentScore={currentScore} showSubmitForm={true} className="max-h-[90dvh] overflow-y-auto" />
      </div>
    </div>
  );
};
