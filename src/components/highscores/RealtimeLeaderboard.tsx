import React, { useEffect, useState } from 'react';
import { HighScoreRecord, subscribeTopHighScores, submitHighScore } from '../../lib/highScoreService';
import { useWorkspaceStore, appendLog } from '../../store/workspaceStore';
import { Language } from '../../types/lesson';
import { arcadeAudio } from '../../utils/audio';
import { Trophy, Crown, Flame, Send, Check, Loader2, Sparkles, Filter, ShieldCheck, Zap } from 'lucide-react';

interface RealtimeLeaderboardProps {
  currentScore?: number;
  className?: string;
  showSubmitForm?: boolean;
}

export const RealtimeLeaderboard: React.FC<RealtimeLeaderboardProps> = ({
  currentScore = 1250,
  className = '',
  showSubmitForm = true,
}) => {
  const [scores, setScores] = useState<HighScoreRecord[]>([]);
  const [filterLang, setFilterLang] = useState<Language | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Form submission state
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const difficulty = useWorkspaceStore((state) => state.difficulty);
  const xp = useWorkspaceStore((state) => state.xp);

  const [handleName, setHandleName] = useState('SYNTH_CODER_2099');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    const unsubscribe = subscribeTopHighScores((updatedScores) => {
      setScores(updatedScores);
      setLoading(false);
    }, filterLang, () => {
      setLoading(false);
      setLoadError(true);
    });

    return () => unsubscribe();
  }, [filterLang]);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    arcadeAudio.playClick();

    const scoreToSubmit = Math.max(currentScore, xp > 0 ? xp : 500);

    try {
      await submitHighScore(handleName, scoreToSubmit, activeLanguage, difficulty);
      arcadeAudio.playVictoryFanfare();
      appendLog(`[LEADERBOARD] Post success! ${handleName} posted ${scoreToSubmit} PTS to live Firestore leaderboard!`);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      appendLog(`[ERROR] Leaderboard submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const topThree = scores.slice(0, 3);
  const remainingScores = scores.slice(3);

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-cyan-950/20 ${className}`}>
      {/* Synthwave Neon Header */}
      <div className="p-5 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 shadow-neon-amber animate-pulse">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-100 flex items-center gap-2">
              <span>NEON LEADERBOARD</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5 uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                REAL-TIME FIRESTORE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Global Hall of Fame for Rogue Crawler Coders</p>
          </div>
        </div>

        {/* Language Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['all', 'javascript', 'python', 'java'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                arcadeAudio.playClick();
                setFilterLang(lang);
              }}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg uppercase transition-all ${
                filterLang === lang
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {lang === 'all' ? 'ALL' : lang === 'javascript' ? 'JS' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Submission Form Bar */}
      {showSubmitForm && (
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
            <Zap className="w-4 h-4 text-cyan-400 fill-current" />
            <span>Active Session:</span>
            <span className="text-cyan-300 font-bold">{xp > 0 ? xp : currentScore} XP</span>
            <span className="text-slate-500">({activeLanguage.toUpperCase()} · Lvl {difficulty})</span>
          </div>

          <form onSubmit={handleSubmitScore} className="flex items-center gap-2">
            <input
              type="text"
              maxLength={25}
              value={handleName}
              onChange={(e) => setHandleName(e.target.value)}
              placeholder="Enter Arcade Handle"
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 w-44 shadow-inner"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-neon-amber transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : submitted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>RECORDED!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBMIT HIGH SCORE</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Leaderboard Content */}
      <div className="p-5 space-y-6">
        {loadError ? (
          <div className="p-6 text-center text-sm text-slate-400">Leaderboard is temporarily unavailable. You can keep using the tutor.</div>
        ) : loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <span>Connecting to Firestore Live Leaderboard...</span>
          </div>
        ) : scores.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs italic">
            No entries logged for this category. Submit your score to claim 1st place!
          </div>
        ) : (
          <>
            {/* Top 3 Podium Cards */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1st Place Gold */}
                {topThree[0] && (
                  <div className="p-4 rounded-xl bg-gradient-to-b from-amber-950/40 to-slate-950 border-2 border-amber-500/60 shadow-neon-amber flex flex-col items-center text-center relative overflow-hidden order-1 md:order-2">
                    <div className="absolute top-2 right-2 text-amber-400">
                      <Crown className="w-5 h-5 fill-current" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl mb-2 font-bold text-amber-300 shadow-md">
                      🥇
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
                      1st PLACE CHAMPION
                    </span>
                    <h3 className="text-sm font-black text-slate-100 truncate w-full mb-1">
                      {topThree[0].playerName}
                    </h3>
                    <div className="text-lg font-black font-mono text-amber-400 mb-2">
                      {topThree[0].score.toLocaleString()} <span className="text-xs text-slate-400 font-normal">PTS</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                      <span className={topThree[0].language === 'javascript' ? 'text-yellow-400 font-bold' : topThree[0].language === 'python' ? 'text-sky-400 font-bold' : 'text-orange-400 font-bold'}>
                        {topThree[0].language.toUpperCase()}
                      </span>
                      <span>·</span>
                      <span>Lvl {topThree[0].difficulty}</span>
                    </div>
                  </div>
                )}

                {/* 2nd Place Silver */}
                {topThree[1] && (
                  <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-cyan-500/40 shadow-neon-cyan flex flex-col items-center text-center relative order-2 md:order-1">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl mb-2 font-bold text-cyan-300">
                      🥈
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                      2nd PLACE
                    </span>
                    <h3 className="text-xs font-black text-slate-100 truncate w-full mb-1">
                      {topThree[1].playerName}
                    </h3>
                    <div className="text-base font-black font-mono text-cyan-300 mb-2">
                      {topThree[1].score.toLocaleString()} <span className="text-xs text-slate-400 font-normal">PTS</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                      <span className={topThree[1].language === 'javascript' ? 'text-yellow-400 font-bold' : topThree[1].language === 'python' ? 'text-sky-400 font-bold' : 'text-orange-400 font-bold'}>
                        {topThree[1].language.toUpperCase()}
                      </span>
                      <span>·</span>
                      <span>Lvl {topThree[1].difficulty}</span>
                    </div>
                  </div>
                )}

                {/* 3rd Place Bronze */}
                {topThree[2] && (
                  <div className="p-4 rounded-xl bg-gradient-to-b from-pink-950/30 to-slate-950 border border-pink-500/40 shadow-neon-magenta flex flex-col items-center text-center relative order-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400 flex items-center justify-center text-xl mb-2 font-bold text-pink-300">
                      🥉
                    </div>
                    <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest mb-1">
                      3rd PLACE
                    </span>
                    <h3 className="text-xs font-black text-slate-100 truncate w-full mb-1">
                      {topThree[2].playerName}
                    </h3>
                    <div className="text-base font-black font-mono text-pink-300 mb-2">
                      {topThree[2].score.toLocaleString()} <span className="text-xs text-slate-400 font-normal">PTS</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                      <span className={topThree[2].language === 'javascript' ? 'text-yellow-400 font-bold' : topThree[2].language === 'python' ? 'text-sky-400 font-bold' : 'text-orange-400 font-bold'}>
                        {topThree[2].language.toUpperCase()}
                      </span>
                      <span>·</span>
                      <span>Lvl {topThree[2].difficulty}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Remaining Scores Ranks 4 to 25 */}
            {remainingScores.length > 0 && (
              <div className="space-y-2">
                <div className="px-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>RANK & PLAYER</span>
                  <span>SCORE & DETAILS</span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {remainingScores.map((rec, idx) => {
                    const actualRank = idx + 4;
                    return (
                      <div
                        key={rec.id || idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 font-mono text-slate-500 font-bold text-center">
                            #{actualRank}
                          </span>
                          <div>
                            <span className="font-bold font-mono text-slate-200">
                              {rec.playerName}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                              <span
                                className={
                                  rec.language === 'javascript'
                                    ? 'text-yellow-400 font-bold'
                                    : rec.language === 'python'
                                    ? 'text-sky-400 font-bold'
                                    : 'text-orange-400 font-bold'
                                }
                              >
                                {rec.language.toUpperCase()}
                              </span>
                              <span>·</span>
                              <span>Difficulty Level {rec.difficulty}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold font-mono text-sm text-cyan-300">
                            {rec.score.toLocaleString()} PTS
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
