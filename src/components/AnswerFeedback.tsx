'use client';

import React from 'react';
import { soundManager } from '@/utils/audio';
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, ArrowRight, Heart, Sparkles, Volume2 } from 'lucide-react';

interface AnswerFeedbackProps {
  status: 'idle' | 'correct' | 'wrong';
  message?: string;
  explanation?: string;
  correctAnswerText?: string;
  lives?: number;
  streak?: number;
  onTryAgain?: () => void;
  onNext?: () => void;
  onUseHint?: () => void;
  hintUsed?: boolean;
}

export default function AnswerFeedback({
  status,
  message,
  explanation,
  correctAnswerText,
  lives = 3,
  streak = 0,
  onTryAgain,
  onNext,
  onUseHint,
  hintUsed = false,
}: AnswerFeedbackProps) {
  if (status === 'idle') return null;

  const isCorrect = status === 'correct';

  const handleSpeak = () => {
    try {
      soundManager.playPop();
      if (isCorrect) {
        soundManager.speak(`Great job! ${explanation || message || 'Correct answer!'}`);
      } else {
        soundManager.speak(`Not quite! ${message || 'Try again!'} ${explanation ? 'Hint: ' + explanation : ''}`);
      }
    } catch {}
  };

  return (
    <div
      className={`rounded-3xl p-4 my-3 border-2 shadow-md animate-in slide-in-from-bottom duration-300 transition-all ${
        isCorrect
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-emerald-400 text-emerald-950'
          : 'bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 border-rose-300 text-rose-950'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-sm ${
              isCorrect ? 'bg-emerald-500' : 'bg-rose-500 animate-wiggle'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <XCircle className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>

          <div>
            {/* Header with Title & Listen Button */}
            <div className="flex items-center gap-2">
              <h4 className="font-black text-base sm:text-lg leading-tight">
                {isCorrect
                  ? streak > 1
                    ? `🔥 Amazing! ${streak}x Streak!`
                    : '🎉 Brilliant! Correct Answer!'
                  : '❌ Oops! Try Again!'}
              </h4>
              <button
                type="button"
                onClick={handleSpeak}
                className={`p-1 rounded-full text-xs shadow-xs active:scale-90 transition-transform ${
                  isCorrect ? 'bg-emerald-200/70 text-emerald-800' : 'bg-rose-200/70 text-rose-800'
                }`}
                title="Listen to Explanation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Explanation or Hint */}
            <p className="text-xs sm:text-sm font-semibold mt-1 leading-snug text-slate-700">
              {message || (isCorrect ? 'You solved it perfectly!' : 'That was not the right choice this time.')}
            </p>

            {explanation && (
              <div
                className={`mt-2 p-2.5 rounded-xl text-xs font-bold flex items-start gap-1.5 ${
                  isCorrect
                    ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100/70 text-rose-800 border border-rose-200'
                }`}
              >
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  <strong>Tip:</strong> {explanation}
                </span>
              </div>
            )}

            {/* If wrong and correctAnswerText is provided */}
            {!isCorrect && correctAnswerText && (
              <p className="text-xs font-bold text-slate-500 mt-1.5">
                Clue: Look for options related to &ldquo;{correctAnswerText}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Lives Counter on Wrong */}
        {!isCorrect && (
          <div className="flex items-center gap-0.5 shrink-0 bg-white/80 border border-rose-200 px-2 py-1 rounded-full shadow-xs">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200/60">
        {!isCorrect && onTryAgain && (
          <button
            type="button"
            onClick={() => {
              try { soundManager.playPop(); } catch {}
              onTryAgain();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        {!isCorrect && onUseHint && !hintUsed && (
          <button
            type="button"
            onClick={() => {
              try { soundManager.playSparkle(); } catch {}
              onUseHint();
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-extrabold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>50:50 Clue</span>
          </button>
        )}

        {isCorrect && onNext && (
          <button
            type="button"
            onClick={() => {
              try { soundManager.playPop(); } catch {}
              onNext();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span>Next Challenge</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
