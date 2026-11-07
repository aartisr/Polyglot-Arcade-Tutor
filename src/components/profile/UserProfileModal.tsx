import React, { useEffect, useState } from 'react';
import { useWorkspaceStore, getRankForXp } from '../../store/workspaceStore';
import { subscribeUserProfile, saveUserProfile, UserProfileData } from '../../lib/userProfileService';
import { BADGE_CATALOG, subscribeUnlockedAchievements } from '../../lib/achievementService';
import { arcadeAudio } from '../../utils/audio';
import {
  User,
  Clock,
  Code2,
  Award,
  Sparkles,
  X,
  CheckCircle2,
  Zap,
  Cloud,
  Shield,
  Trophy,
  Loader2,
  Edit2,
  Save,
  Share2,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShare?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onOpenShare }) => {
  const xp = useWorkspaceStore((state) => state.xp);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const codeMap = useWorkspaceStore((state) => state.codeMap);

  const [profile, setProfile] = useState<UserProfileData>({
    handle: 'CYBER_HERO_2099',
    codingSeconds: 14400, // 4 hours starter
    languagesMastered: ['javascript'],
    earnedBadges: ['flawless_compiler'],
    xp: xp,
  });

  const [unlockedBadgesMap, setUnlockedBadgesMap] = useState<Record<string, any>>({});
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [tempHandle, setTempHandle] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  // Active coding timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setProfile((prev) => ({
        ...prev,
        codingSeconds: prev.codingSeconds + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Firestore real-time profile & achievement listeners
  useEffect(() => {
    if (!isOpen) return;

    const unsubProfile = subscribeUserProfile('local_hero_profile', (firestoreProfile) => {
      setProfile((prev) => ({
        ...prev,
        ...firestoreProfile,
        xp: Math.max(firestoreProfile.xp || 0, xp),
      }));
      setTempHandle(firestoreProfile.handle || 'CYBER_HERO_2099');
    });

    const unsubAchievements = subscribeUnlockedAchievements((achievements) => {
      setUnlockedBadgesMap(achievements);
    });

    return () => {
      unsubProfile();
      unsubAchievements();
    };
  }, [isOpen, xp]);

  if (!isOpen) return null;

  const rankInfo = getRankForXp(xp);
  const rankProgress = Math.min(
    100,
    Math.max(0, Math.round(((xp - rankInfo.minXp) / (rankInfo.maxXp - rankInfo.minXp)) * 100))
  );

  // Formatting hours & minutes
  const hours = Math.floor(profile.codingSeconds / 3600);
  const minutes = Math.floor((profile.codingSeconds % 3600) / 60);
  const seconds = profile.codingSeconds % 60;

  // Language mastery calculations
  const totalCompleted = Object.keys(completedSteps).length;
  const jsCodeLen = (codeMap.javascript || '').length;
  const pythonCodeLen = (codeMap.python || '').length;
  const javaCodeLen = (codeMap.java || '').length;

  const jsMastered = totalCompleted >= 1 || jsCodeLen > 50;
  const pythonMastered = totalCompleted >= 2 || pythonCodeLen > 50;
  const javaMastered = totalCompleted >= 3 || javaCodeLen > 50;

  const handleSaveProfile = async () => {
    arcadeAudio.playClick();
    setIsSyncing(true);
    try {
      const updatedProfile: UserProfileData = {
        ...profile,
        handle: tempHandle.trim() || 'CYBER_HERO_2099',
        languagesMastered: [
          ...(jsMastered ? ['javascript' as const] : []),
          ...(pythonMastered ? ['python' as const] : []),
          ...(javaMastered ? ['java' as const] : []),
        ],
        earnedBadges: Object.keys(unlockedBadgesMap),
        xp: Math.max(profile.xp, xp),
      };

      await saveUserProfile(updatedProfile, 'local_hero_profile');
      arcadeAudio.playVictoryFanfare();
      setProfile(updatedProfile);
      setIsEditingHandle(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-neon-cyan">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Developer Profile & Statistics</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore Live Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">Track total coding hours, language mastery, and unlocked medals</p>
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

        {/* Profile Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Card 1: User Identity & Level Rank */}
          <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 p-0.5 shadow-neon-cyan shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
                  {rankInfo.badge}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  {isEditingHandle ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempHandle}
                        onChange={(e) => setTempHandle(e.target.value)}
                        className="px-2.5 py-1 text-sm bg-slate-950 border border-cyan-500 rounded text-slate-100 font-mono focus:outline-none"
                      />
                      <button
                        onClick={handleSaveProfile}
                        className="p-1 bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-black text-slate-100 font-mono tracking-wide">
                        {profile.handle}
                      </h3>
                      <button
                        onClick={() => setIsEditingHandle(true)}
                        className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Edit Arcade Handle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono mt-1">
                  <span className={`font-bold ${rankInfo.color}`}>
                    Level {rankInfo.level}: {rankInfo.title}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-cyan-400 font-bold">{xp} XP Total</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Sync and Share */}
            <div className="flex items-center gap-2">
              {onOpenShare && (
                <button
                  onClick={() => {
                    arcadeAudio.playClick();
                    onClose();
                    onOpenShare();
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 bg-pink-950/80 hover:bg-pink-900 border border-pink-700/60 text-pink-300 font-bold text-xs uppercase tracking-wider rounded-xl shadow-neon-magenta transition-all"
                  title="Generate Social Media Share Card"
                >
                  <Share2 className="w-4 h-4 text-pink-400" />
                  <span>Share Card</span>
                </button>
              )}

              {/* Sync to Firestore Button */}
              <button
                onClick={handleSaveProfile}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-cyan transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : synced ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>SYNCED TO FIRESTORE!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>SYNC TO CLOUD</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grid 2: Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stat 1: Total Coding Time */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Total Coding Time</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="text-xl font-black font-mono text-cyan-300">
                {hours}h {minutes}m {seconds}s
              </div>
              <p className="text-[11px] text-slate-500">Tracked in IDE editor runtime</p>
            </div>

            {/* Stat 2: Languages Mastered */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>PolyGlot Stack</span>
                </span>
                <span className="text-[10px] text-amber-400 font-bold">3 LANGUAGES</span>
              </div>
              <div className="text-xl font-black font-mono text-amber-300">
                {[jsMastered, pythonMastered, javaMastered].filter(Boolean).length} / 3 Mastered
              </div>
              <p className="text-[11px] text-slate-500">JS, Python & Java Canvas engines</p>
            </div>

            {/* Stat 3: Medals & Badges */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-pink-400" />
                  <span>Unlocked Medals</span>
                </span>
                <span className="text-[10px] text-pink-400 font-bold">FIRESTORE</span>
              </div>
              <div className="text-xl font-black font-mono text-pink-300">
                {Object.keys(unlockedBadgesMap).length} / {BADGE_CATALOG.length} Badges
              </div>
              <p className="text-[11px] text-slate-500">Persistent achievement achievements</p>
            </div>
          </div>

          {/* Section 3: Language Mastery Breakdown */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Language Architecture Mastery</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* JavaScript */}
              <div className="p-3.5 bg-slate-900 border border-yellow-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-yellow-400">JAVASCRIPT</span>
                  {jsMastered ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      MASTERED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">IN PROGRESS</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-yellow-400" style={{ width: jsMastered ? '100%' : '45%' }} />
                </div>
                <p className="text-[11px] text-slate-400">HTML Canvas 2D Context, WASD Physics, AABB Math</p>
              </div>

              {/* Python */}
              <div className="p-3.5 bg-slate-900 border border-sky-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-sky-400">PYTHON</span>
                  {pythonMastered ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      MASTERED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">IN PROGRESS</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-sky-400" style={{ width: pythonMastered ? '100%' : '35%' }} />
                </div>
                <p className="text-[11px] text-slate-400">Pygame Canvas surface loops & class structures</p>
              </div>

              {/* Java */}
              <div className="p-3.5 bg-slate-900 border border-orange-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-orange-400">JAVA</span>
                  {javaMastered ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      MASTERED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">IN PROGRESS</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-orange-400" style={{ width: javaMastered ? '100%' : '25%' }} />
                </div>
                <p className="text-[11px] text-slate-400">Swing Graphics2D, KeyListener & JPanel paintComponent</p>
              </div>
            </div>
          </div>

          {/* Section 4: Earned Badges Showcase */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-400" />
              <span>Earned Badges Showcase</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BADGE_CATALOG.map((badge) => {
                const isUnlocked = Boolean(unlockedBadgesMap[badge.id]);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1 transition-all ${
                      isUnlocked
                        ? 'bg-slate-900 border-pink-500/50 shadow-neon-magenta text-slate-100'
                        : 'bg-slate-950 border-slate-800 text-slate-600 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{isUnlocked ? badge.icon : '🔒'}</div>
                    <span className="text-[11px] font-bold truncate w-full">{badge.title}</span>
                    <span className="text-[9.5px] font-mono text-amber-400">+{badge.points} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
