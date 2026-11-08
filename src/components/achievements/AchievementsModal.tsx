import React, { useEffect, useState } from 'react';
import {
  BADGE_CATALOG,
  BadgeDefinition,
  UnlockedAchievementRecord,
  subscribeUnlockedAchievements
} from '../../lib/achievementService';
import { arcadeAudio } from '../../utils/audio';
import { Award, X, Lock, CheckCircle2, Sparkles, Zap, Shield, Trophy, Share2 } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShare?: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, onOpenShare }) => {
  const [unlockedMap, setUnlockedMap] = useState<Record<string, UnlockedAchievementRecord>>({});
  const [filterCat, setFilterCat] = useState<string>('all');

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeUnlockedAchievements((map) => {
      setUnlockedMap(map);
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedCount = Object.keys(unlockedMap).length;
  const totalXP = BADGE_CATALOG.reduce((acc, b) => (unlockedMap[b.id] ? acc + b.points : acc), 0);

  const filteredBadges = BADGE_CATALOG.filter((b) => filterCat === 'all' || b.category === filterCat);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85dvh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-pink-950 border border-pink-800/50 text-pink-400 shadow-neon-magenta">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Arcade Badges & Medals</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/50 font-bold">
                  {unlockedCount} / {BADGE_CATALOG.length} Unlocked
                </span>
              </h2>
              <p className="text-xs text-slate-400">Earn medals stored persistently in Firestore through code speed & accuracy</p>
            </div>
          </div>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats & Category Filter Toolbar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
            {['all', 'speed', 'accuracy', 'polyglot', 'mastery'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  arcadeAudio.playClick();
                  setFilterCat(cat);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                  filterCat === cat
                    ? 'bg-slate-800 text-pink-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Earned XP:</span>
            <span className="text-pink-400 font-bold">{totalXP} XP</span>
          </div>
        </div>

        {/* Badge Cards Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBadges.map((badge) => {
              const isUnlocked = Boolean(unlockedMap[badge.id]);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-slate-950 border-pink-500/50 shadow-neon-magenta text-slate-100'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-500 opacity-75'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      isUnlocked
                        ? 'bg-pink-950/80 border border-pink-800/60 shadow-lg'
                        : 'bg-slate-900 border border-slate-800'
                    }`}
                  >
                    {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-600" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-bold ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                        {badge.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                        +{badge.points} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{badge.category}</span>
                      {isUnlocked && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>UNLOCKED</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            {onOpenShare && (
              <button
                onClick={() => {
                  arcadeAudio.playClick();
                  onClose();
                  onOpenShare();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-950 hover:bg-pink-900 border border-pink-700/60 text-pink-300 font-bold text-xs rounded-lg transition-colors shadow-neon-magenta"
                title="Share your unlocked badges on social media"
              >
                <Share2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Share Medals Card</span>
              </button>
            )}
          </div>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors"
          >
            Close Badges
          </button>
        </div>
      </div>
    </div>
  );
};
