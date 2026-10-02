'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '@/utils/audio';
import { ArrowRight, Share2, Sparkles, X } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  xpEarned?: number;
  gemsEarned?: number;
  onPlayAgain?: () => void;
  onContinue?: () => void;
}

export default function CelebrationModal({
  isOpen,
  title = 'Perfect Scorer',
  subtitle = 'Your flawless quiz performance sets a new standard of excellence for everyone',
  xpEarned = 25,
  gemsEarned = 5,
  onPlayAgain,
  onContinue,
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      soundManager.playSuccess();
      soundManager.speak(title + '! ' + subtitle);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF6B35', '#FFAA00', '#00C897', '#7C3AED', '#38BDF8'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, title, subtitle]);

  if (!isOpen) return null;

  const handleShare = () => {
    soundManager.playPop();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'KidsPlay Achievement!',
        text: `I just achieved "${title}" with +${xpEarned} coins on KidsPlay!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Shared: I scored +${xpEarned} coins on KidsPlay! 🏆`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-amber-400/30 via-yellow-300/20 to-orange-500/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-300">
        {/* Top 3D Golden Trophy Badge (No raster image - pure crisp vector & CSS) */}
        <div className="relative -mb-12 z-20 flex flex-col items-center">
          {/* 3-Star Arc */}
          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="text-xl filter drop-shadow animate-bounce delay-100">⭐</span>
            <span className="text-3xl filter drop-shadow-md -translate-y-1.5 animate-bounce">⭐</span>
            <span className="text-xl filter drop-shadow animate-bounce delay-200">⭐</span>
          </div>

          {/* Golden Shield & Trophy */}
          <div className="relative">
            {/* Outer Pulsing Glow Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 blur-md opacity-70 animate-pulse" />

            {/* Main Trophy Circle */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-600 p-1 shadow-[0_8px_25px_rgba(245,158,11,0.45)] border-2 border-yellow-200/90 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* Gloss highlight overlay */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/40 rounded-full blur-sm pointer-events-none" />
                
                {/* 3D Gold Trophy Icon */}
                <span className="text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)] select-none">
                  🏆
                </span>
              </div>
            </div>

            {/* Sparkle Badges */}
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-300 border border-white flex items-center justify-center text-xs shadow-sm">
              ✨
            </div>
          </div>
        </div>

        {/* Frosted Pure Card */}
        <div className="w-full bg-white rounded-[32px] pt-16 pb-6 px-6 shadow-2xl border border-slate-100/90 text-center relative z-10">
          {/* Close button */}
          <button
            type="button"
            onClick={onContinue}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Level Complete Ribbon */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
              Activity Completed!
            </span>
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {title}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Reward Badges Scorecard */}
          <div className="grid grid-cols-2 gap-2.5 my-5">
            {/* Coins Earned */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 border border-amber-200/70 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl mb-0.5">🪙</span>
              <span className="text-base font-black text-amber-900">
                +{xpEarned * 10}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-600">
                Coins Won
              </span>
            </div>

            {/* XP / Rating */}
            <div className="bg-gradient-to-b from-purple-50 to-indigo-50/50 border border-purple-200/70 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl mb-0.5">🌟</span>
              <span className="text-base font-black text-purple-900">
                +{xpEarned} XP
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-purple-600">
                Bonus Power
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Primary High-Impact Button */}
            <button
              type="button"
              onClick={() => {
                try { soundManager.playPop(); } catch {}
                if (onContinue) onContinue();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-black text-base shadow-[0_5px_0_0_#C2410C] active:translate-y-1 active:shadow-[0_1px_0_0_#C2410C] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Playing</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Secondary Buttons Row */}
            <div className="flex gap-2">
              {onPlayAgain && (
                <button
                  type="button"
                  onClick={() => {
                    try { soundManager.playPop(); } catch {}
                    onPlayAgain();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200 shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Play Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs border border-slate-200 shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
