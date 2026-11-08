import React from 'react';
import { useWorkspaceStore, completeQuest } from '../../store/workspaceStore';
import { arcadeAudio } from '../../utils/audio';
import { getAllGames } from '../../data/gamesRegistry';
import { WorkspaceState } from '../../types/lesson';
import { Target, CheckCircle2, Award, Zap, X, Sparkles } from 'lucide-react';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  checkCondition: (state: WorkspaceState) => boolean;
}

export const DAILY_QUESTS: QuestItem[] = [
  {
    id: 'polyglot_switcher',
    title: 'PolyGlot Explorer',
    description: 'Switch and run code in 2 or more programming languages (JS, Python, Java).',
    xpReward: 150,
    icon: '🌐',
    checkCondition: (state) => Object.keys(state.codeMap).filter((k) => state.codeMap[k as keyof typeof state.codeMap]?.length > 20).length >= 2,
  },
  {
    id: 'speed_coder',
    title: 'Flawless Validator',
    description: 'Pass all test cases on any step lesson.',
    xpReward: 200,
    icon: '⚡',
    checkCondition: (state) => Object.values(state.completedStepsByGame ?? {}).some((steps) => Object.values(steps).some(Boolean)) || Object.values(state.completedSteps).some(Boolean),
  },
  {
    id: 'cyber_madness',
    title: 'Nightmare Mode Specialist',
    description: 'Set game engine difficulty to Level 5 (Cyber Chaos).',
    xpReward: 250,
    icon: '🔥',
    checkCondition: (state) => state.difficulty === 5,
  },
  {
    id: 'overdrive_combo',
    title: 'Combo Overdrive',
    description: 'Reach a 3x or higher Combo Streak in the workspace.',
    xpReward: 300,
    icon: '💥',
    checkCondition: (state) => state.comboStreak >= 3,
  },
  {
    id: 'arcade_master',
    title: 'Game Path Champion',
    description: 'Complete every lesson in any game.',
    xpReward: 400,
    icon: '👑',
    checkCondition: (state) => getAllGames().some((game) => game.lessons.every((lesson) => Boolean(state.completedStepsByGame?.[game.id]?.[lesson.id]))),
  },
];

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({ isOpen, onClose }) => {
  const completedQuests = useWorkspaceStore((state) => state.completedQuests);
  const fullState = useWorkspaceStore((state) => state);

  if (!isOpen) return null;

  const handleClaimReward = (quest: QuestItem) => {
    arcadeAudio.playAchievementUnlock();
    completeQuest(quest.id, quest.xpReward, quest.title);
  };

  const completedCount = Object.keys(completedQuests).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85dvh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Daily Developer Quests</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                  {completedCount}/{DAILY_QUESTS.length} CLAIMED
                </span>
              </h2>
              <p className="text-xs text-slate-400">Complete challenges to earn XP & unlock rank titles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quest List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {DAILY_QUESTS.map((quest) => {
            const isClaimed = Boolean(completedQuests[quest.id]);
            const isReadyToClaim = !isClaimed && quest.checkCondition(fullState);

            return (
              <div
                key={quest.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isClaimed
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-75'
                    : isReadyToClaim
                    ? 'bg-pink-950/30 border-pink-500/50 shadow-neon-magenta'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-2xl shrink-0 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                    {quest.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-200 truncate">{quest.title}</h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{quest.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isClaimed ? (
                    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CLAIMED</span>
                    </div>
                  ) : isReadyToClaim ? (
                    <button
                      onClick={() => handleClaimReward(quest)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-pink-500/20 transition-all animate-pulse"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>CLAIM XP</span>
                    </button>
                  ) : (
                    <div className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                      IN PROGRESS
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quests reset daily</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-300 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
