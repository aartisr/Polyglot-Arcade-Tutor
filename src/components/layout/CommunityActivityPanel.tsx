import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Activity, Flame, Trophy, Award, X, Sparkles, ChevronRight, Zap } from 'lucide-react';

export interface ActivityFeedItem {
  id: string;
  type: 'score' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  badgeIcon?: string;
  language?: string;
  score?: number;
}

interface CommunityActivityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityActivityPanel: React.FC<CommunityActivityPanelProps> = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const scoreRef = collection(db, 'high_scores');
    const qScores = query(scoreRef, orderBy('createdAt', 'desc'), limit(15));

    const unsubscribeScores = onSnapshot(
      qScores,
      (snapshot) => {
        const items: ActivityFeedItem[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'score',
            title: `${data.playerName || 'Rogue Runner'} High Score!`,
            description: `Scored ${data.score?.toLocaleString() || 0} PTS in ${data.language?.toUpperCase() || 'JS'} (Lvl ${data.difficulty || 1})`,
            timestamp: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            language: data.language,
            score: data.score,
          };
        });

        setActivities((prev) => {
          const achievementsOnly = prev.filter((a) => a.type === 'achievement');
          const merged = [...items, ...achievementsOnly].sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
          );
          return merged.slice(0, 20);
        });
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'high_scores')
    );

    const achRef = collection(db, 'user_achievements');
    const qAch = query(achRef, orderBy('unlockedAt', 'desc'), limit(10));

    const unsubscribeAchievements = onSnapshot(
      qAch,
      (snapshot) => {
        const items: ActivityFeedItem[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'achievement',
            title: `Medal Unlocked: ${data.title || 'Badge'}`,
            description: data.description || 'Completed arcade milestone',
            timestamp: data.unlockedAt?.toDate ? data.unlockedAt.toDate() : new Date(),
            badgeIcon: '🏅',
          };
        });

        setActivities((prev) => {
          const scoresOnly = prev.filter((a) => a.type === 'score');
          const merged = [...items, ...scoresOnly].sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
          );
          return merged.slice(0, 20);
        });
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'user_achievements')
    );

    return () => {
      unsubscribeScores();
      unsubscribeAchievements();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="w-80 h-full bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 select-none z-20 shadow-2xl">
      {/* Header */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>Community Feed</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] font-mono text-cyan-400">Live Firestore Feed</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Activity List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs italic">
            Connecting to Firestore live stream...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs italic">
            No recent activity recorded yet. Run canvas or submit a score to broadcast!
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className={`p-3 rounded-lg border text-xs transition-all ${
                act.type === 'score'
                  ? 'bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-slate-900/90 border-pink-500/30 hover:border-pink-500/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  {act.type === 'score' ? (
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Award className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  )}
                  <span className="truncate text-slate-100">{act.title}</span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-500 shrink-0">
                  {formatTimeAgo(act.timestamp)}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal pl-5">
                {act.description}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[10.5px] font-mono text-slate-400 flex items-center justify-between">
        <span>Realtime Sync</span>
        <span className="text-emerald-400 font-bold">Firestore Active</span>
      </div>
    </div>
  );
};
