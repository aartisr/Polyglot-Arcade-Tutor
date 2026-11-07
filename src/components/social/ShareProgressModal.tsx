import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore, getRankForXp } from '../../store/workspaceStore';
import { BADGE_CATALOG, subscribeUnlockedAchievements, UnlockedAchievementRecord } from '../../lib/achievementService';
import { getGameById } from '../../data/gamesRegistry';
import { arcadeAudio } from '../../utils/audio';
import {
  Share2,
  X,
  Twitter,
  Copy,
  Check,
  Download,
  Sparkles,
  Trophy,
  Award,
  Zap,
  ExternalLink,
  Code2,
  Gamepad2,
} from 'lucide-react';

interface ShareProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProgressModal: React.FC<ShareProgressModalProps> = ({ isOpen, onClose }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [unlockedBadgesMap, setUnlockedBadgesMap] = useState<Record<string, UnlockedAchievementRecord>>({});

  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const activeGame = getGameById(activeGameId);
  const xp = useWorkspaceStore((state) => state.xp);
  const completedSteps = useWorkspaceStore(
    (state) => state.completedStepsByGame?.[state.activeGameId] || state.completedSteps
  );
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeUnlockedAchievements((map) => {
      setUnlockedBadgesMap(map);
    });
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRank = getRankForXp(xp);
  const unlockedBadges = BADGE_CATALOG.filter((b) => unlockedBadgesMap[b.id]);
  const completedCount = Object.keys(completedSteps).filter((k) => completedSteps[k]).length;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://polyglot-arcade.vercel.app';
  const tutorialUrl = `${shareUrl}/tutor/${activeGame.lessons[0].id}`;

  const badgesListText = unlockedBadges.length > 0
    ? unlockedBadges.map((b) => `${b.icon} ${b.title}`).join(', ')
    : '⚡ First Step Ready';

  const tweetContent = `🎮 Leveled up to Level ${currentRank.level}: ${currentRank.title} (${xp} XP) on PolyGlot Arcade Tutor!\n\n` +
    `🏆 Badges Unlocked: ${badgesListText}\n` +
    `🕹️ Building "${activeGame.title}" across JavaScript, Python & Java.\n\n` +
    `Play & code the retro 2D engine here:`;

  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetContent
  )}&url=${encodeURIComponent(tutorialUrl)}&hashtags=GameDev,IndieDev,LearnToCode,JavaScript,Python,Java,RetroGames`;

  const handleCopyText = async () => {
    arcadeAudio.playClick();
    try {
      await navigator.clipboard.writeText(`${tweetContent} ${tutorialUrl}`);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Fallback if clipboard API restricted
    }
  };

  const handleCopyLink = async () => {
    arcadeAudio.playClick();
    try {
      await navigator.clipboard.writeText(tutorialUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const generateAndDownloadCardImage = () => {
    arcadeAudio.playVictoryFanfare();
    setGeneratingImage(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setGeneratingImage(false);
      return;
    }

    // 1. Synthwave Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGradient.addColorStop(0, '#020617');
    bgGradient.addColorStop(0.5, '#090d16');
    bgGradient.addColorStop(1, '#020617');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Cyber Grid Lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // 3. Neon Synthwave Sun & Glow Horizon
    const sunGrad = ctx.createRadialGradient(600, 630, 40, 600, 630, 320);
    sunGrad.addColorStop(0, 'rgba(255, 0, 127, 0.35)');
    sunGrad.addColorStop(0.5, 'rgba(0, 243, 255, 0.15)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 300, 1200, 330);

    // 4. Outer Glowing Neon Border
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 1152, 582);
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, 1140, 570);

    // 5. Header: Wordmark & Tagline
    ctx.fillStyle = '#ff007f';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('POLYGLOT ARCADE TUTOR · DEVELOPER PASSPORT', 60, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(activeGame.title, 60, 130);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText(`${activeGame.genre} (JS · Python · Java)`, 60, 165);

    // 6. Player Stat Box
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, 210, 620, 250);
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 210, 620, 250);

    // Level Badge Icon & Title
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(currentRank.badge, 90, 290);

    ctx.fillStyle = '#00f3ff';
    ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Level ${currentRank.level}: ${currentRank.title}`, 170, 275);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.fillText(`TOTAL SCORE: ${xp.toLocaleString()} XP`, 170, 310);

    // Steps Completed Tracker
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(`STATUS: ${completedCount}/4 Steps Complete · 60 FPS Canvas Tested`, 90, 370);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText(`ACTIVE LANGUAGE: ${activeLanguage.toUpperCase()} MODE`, 90, 410);

    // 7. Right Card: Unlocked Medals Grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(710, 210, 430, 250);
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(710, 210, 430, 250);

    ctx.fillStyle = '#ff007f';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(`EARNED MEDALS (${unlockedBadges.length}/${BADGE_CATALOG.length})`, 735, 250);

    const badgesToShow = BADGE_CATALOG.slice(0, 4);
    badgesToShow.forEach((badge, idx) => {
      const isUnlocked = Boolean(unlockedBadgesMap[badge.id]);
      const bx = 735 + (idx % 2) * 195;
      const by = 275 + Math.floor(idx / 2) * 75;

      ctx.fillStyle = isUnlocked ? '#1e293b' : '#020617';
      ctx.fillRect(bx, by, 185, 60);
      ctx.strokeStyle = isUnlocked ? '#ff007f80' : '#334155';
      ctx.strokeRect(bx, by, 185, 60);

      ctx.font = '24px sans-serif';
      ctx.fillText(isUnlocked ? badge.icon : '🔒', bx + 12, by + 40);

      ctx.fillStyle = isUnlocked ? '#f8fafc' : '#64748b';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(badge.title, bx + 48, by + 28);

      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`+${badge.points} XP`, bx + 48, by + 46);
    });

    // 8. Footer URL & Watermark
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('Learn & Play Free at:', 60, 520);

    ctx.fillStyle = '#00f3ff';
    ctx.font = '900 22px "JetBrains Mono", monospace';
    ctx.fillText(tutorialUrl, 60, 555);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('TanStack Router + Query + Monaco Editor + Web Audio 8-bit', 620, 555);

    // Download generated blob
    canvas.toBlob((blob) => {
      if (!blob) {
        setGeneratingImage(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `polyglot-arcade-progress-lvl${currentRank.level}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setGeneratingImage(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-neon-cyan">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Share Your Arcade Progress</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/60 font-bold uppercase tracking-wider">
                  Social Card
                </span>
              </h2>
              <p className="text-xs text-slate-400">Share your developer rank, unlocked medals, and game tutorial link</p>
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

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Social Card Preview Component */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/30 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Gamepad2 className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  PolyGlot Arcade Tutor
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-700/60 font-bold uppercase">
                {activeGame.title}
              </span>
            </div>

            {/* Rank & Stats Hero */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-pink-500 p-0.5 shadow-neon-cyan shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-3xl">
                    {currentRank.badge}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">CURRENT RANK</div>
                  <h3 className={`text-base font-black ${currentRank.color}`}>
                    Level {currentRank.level}: {currentRank.title}
                  </h3>
                  <div className="text-xs font-mono font-bold text-slate-300">
                    {xp.toLocaleString()} XP Total
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-slate-400">CURRICULUM</div>
                <div className="text-sm font-bold text-emerald-400">
                  {completedCount}/4 Steps Complete
                </div>
                <div className="text-[11px] text-slate-500">
                  JS · Python · Java
                </div>
              </div>
            </div>

            {/* Unlocked Badges Preview Pill List */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-pink-400" />
                  <span>Unlocked Medals ({unlockedBadges.length}/{BADGE_CATALOG.length})</span>
                </span>
                <span className="text-amber-400 font-bold">
                  +{unlockedBadges.reduce((acc, b) => acc + b.points, 0)} XP Earned
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {unlockedBadges.length > 0 ? (
                  unlockedBadges.map((badge) => (
                    <span
                      key={badge.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-pink-500/40 text-xs font-mono text-pink-200 shadow-neon-magenta"
                    >
                      <span>{badge.icon}</span>
                      <span className="font-semibold">{badge.title}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-mono text-slate-500 italic">
                    Complete Step 1 tests to unlock your first medals!
                  </span>
                )}
              </div>
            </div>

            {/* Link Preview Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs font-mono">
              <span className="text-cyan-300 truncate mr-2">{tutorialUrl}</span>
              <span className="text-[10px] text-slate-400 shrink-0 uppercase tracking-widest font-bold">
                Play in Browser
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Share on Twitter / X */}
            <a
              href={twitterIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => arcadeAudio.playClick()}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-sky-500/20"
            >
              <Twitter className="w-4 h-4 fill-current" />
              <span>Share on X</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Download PNG Card */}
            <button
              onClick={generateAndDownloadCardImage}
              disabled={generatingImage}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-neon-magenta disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{generatingImage ? 'Exporting...' : 'Download Card'}</span>
            </button>

            {/* Copy Post Text */}
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-400">Copied Post!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Tutorial Link Share Bar */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-400 shrink-0 font-mono">Tutorial Link:</span>
              <span className="text-slate-200 font-mono truncate">{tutorialUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono font-semibold rounded-lg shrink-0 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Card generated dynamically from your live workspace stats</span>
          </div>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="px-3 py-1 text-slate-300 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
