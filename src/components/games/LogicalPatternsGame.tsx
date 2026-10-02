'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Brain } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

interface LogicalPatternsGameProps {
  onClose: () => void;
}

interface LogicChallenge {
  title: string;
  type: 'pattern' | 'odd-one-out';
  sequence: string[];
  answer: string;
  options: string[];
  explanation: string;
}

const CHALLENGES: LogicChallenge[] = [
  {
    title: 'Complete the pattern! What comes next?',
    type: 'pattern',
    sequence: ['🔴', '🟦', '🔴', '🟦', '❓'],
    answer: '🔴',
    options: ['🔴', '🟦', '⭐', '🔺'],
    explanation: 'The pattern repeats: Red Circle, Blue Square, Red Circle, Blue Square, and then Red Circle!',
  },
  {
    title: 'Find the ODD one out! Which one does NOT belong?',
    type: 'odd-one-out',
    sequence: ['🍎', '🍌', '🥕', '🍓'],
    answer: '🥕 Carrot',
    options: ['🍎 Apple', '🍌 Banana', '🥕 Carrot', '🍓 Berry'],
    explanation: 'Carrot is a crunchy vegetable, while all the others are sweet fruits!',
  },
  {
    title: 'Look at the sky pattern! What comes next in the row?',
    type: 'pattern',
    sequence: ['⭐', '🌙', '⭐', '🌙', '❓'],
    answer: '⭐',
    options: ['☀️', '⭐', '☁️', '🌙'],
    explanation: 'The pattern goes: Star, Moon, Star, Moon, and then Star!',
  },
  {
    title: 'Which creature CANNOT fly up in the air?',
    type: 'odd-one-out',
    sequence: ['🦅', '✈️', '🐟', '🦋'],
    answer: '🐟 Fish',
    options: ['🦅 Eagle', '✈️ Airplane', '🐟 Fish', '🦋 Butterfly'],
    explanation: 'Fish swim in the water, while the others fly in the sky!',
  },
  {
    title: 'Count up by ones! What number comes next?',
    type: 'pattern',
    sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❓'],
    answer: '5️⃣',
    options: ['6️⃣', '5️⃣', '8️⃣', '0️⃣'],
    explanation: 'Counting in order: 1, 2, 3, 4, 5!',
  },
];

import AnswerFeedback from '@/components/AnswerFeedback';
import { Heart, Volume2, Lightbulb } from 'lucide-react';

export default function LogicalPatternsGame({ onClose }: LogicalPatternsGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [levelIndex, setLevelIndex] = useState(0);
  const current = CHALLENGES[levelIndex];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Logical Feedback States
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTip, setFeedbackTip] = useState('');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setFeedbackStatus('idle');
    setEliminatedOptions([]);
    setHintUsed(false);
    soundManager.speak(current.title);
  }, [levelIndex, current]);

  const handleSelect = (opt: string) => {
    if (eliminatedOptions.includes(opt)) return;
    try { soundManager.playPop(480); } catch {}
    setSelectedOption(opt);
    setFeedbackStatus('idle');
    soundManager.speak(opt.replace(/[^\w\s]/gi, ''));
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === current.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFeedbackStatus('correct');
      setFeedbackMessage(`Spot on! "${current.answer}" is logically correct!`);
      setFeedbackTip(current.explanation);

      try {
        soundManager.playChime();
        soundManager.speak(`Brilliant logic! ${current.explanation}`);
      } catch {}

      addXP(30 + nextStreak * 5, 5);
      unlockBadge('star-1');

      setTimeout(() => {
        setShowCelebration(true);
      }, 1200);
    } else {
      setStreak(0);
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      setFeedbackStatus('wrong');
      setFeedbackMessage(`"${selectedOption}" doesn't fit the pattern.`);
      setFeedbackTip(
        current.type === 'pattern'
          ? `Look at the repetition in the sequence: notice which shapes or numbers alternate!`
          : `Group the items: three of them share something in common, but one is from a completely different category!`
      );

      try {
        soundManager.playError();
        soundManager.speak(`Not quite. Look closely at the sequence.`);
      } catch {}

      if (nextLives === 0) {
        setTimeout(() => setLives(3), 2000);
      }
    }
  };

  const handleUseHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrongOptions = current.options.filter((o) => o !== current.answer);
    const toEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(toEliminate);

    try {
      soundManager.playSparkle();
      soundManager.speak(`50-50 Hint! Two incorrect options removed.`);
    } catch {}
  };

  const handleNext = () => {
    setShowCelebration(false);
    setFeedbackStatus('idle');
    setLevelIndex((prev) => (prev + 1) % CHALLENGES.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6ED] px-4 py-3 w-full max-w-xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          type="button"
          onClick={() => {
            try { soundManager.playPop(); } catch {}
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-pink-100 rounded-full h-3.5 overflow-hidden p-0.5 max-w-[130px]">
          <div
            className="bg-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((levelIndex + 1) / CHALLENGES.length) * 100}%` }}
          />
        </div>

        {/* Lives Counter & Streak Badge */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-white border border-rose-200 px-2 py-1 rounded-full shadow-xs">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          {streak > 1 && (
            <div className="bg-orange-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full animate-bounce shadow-xs">
              🔥 {streak}x
            </div>
          )}
        </div>
      </div>

      {/* Screen Title & Audio Button */}
      <div className="flex items-center justify-between mt-1 mb-2">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Brain Teaser • Challenge {levelIndex + 1}/{CHALLENGES.length}
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Logical Brain Games
          </h1>
        </div>

        <button
          type="button"
          onClick={() => soundManager.speak(current.title)}
          className="w-9 h-9 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs hover:bg-indigo-50 active:scale-90 transition-transform cursor-pointer"
          title="Read Challenge"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Sequence Board Card */}
      <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 shadow-sm my-auto flex flex-col items-center justify-center min-h-[200px]">
        <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-3 py-0.5 rounded-full mb-2">
          {current.type === 'pattern' ? 'Repeating Pattern' : 'Odd One Out'}
        </span>
        <p className="text-sm font-bold text-slate-700 text-center mb-2">
          {current.title}
        </p>

        <div className="flex items-center justify-center gap-2.5 flex-wrap my-2">
          {current.sequence.map((item, idx) => (
            <div
              key={idx}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-3xl sm:text-4xl shadow-sm transition-all ${
                item === '❓'
                  ? 'bg-amber-100 border-dashed border-amber-400 text-amber-700 animate-pulse font-black text-2xl'
                  : 'bg-indigo-50/70 border-indigo-200'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 4 Choices */}
      <div className="space-y-2 my-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Select your logical pick:
          </span>
          {!hintUsed && (
            <button
              type="button"
              onClick={handleUseHint}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>50:50 Hint</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt) => {
            const isEliminated = eliminatedOptions.includes(opt);
            const isSelected = selectedOption === opt;
            const isWrong = isSelected && feedbackStatus === 'wrong';
            const isRight = isSelected && feedbackStatus === 'correct';

            return (
              <button
                key={opt}
                type="button"
                disabled={isEliminated}
                onClick={() => handleSelect(opt)}
                className={`h-16 rounded-2xl font-black text-base border-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
                  isEliminated
                    ? 'opacity-20 line-through bg-slate-100 border-slate-200 cursor-not-allowed'
                    : isRight
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-300 scale-105'
                    : isWrong
                    ? 'bg-rose-100 border-rose-500 text-rose-800 animate-wiggle'
                    : isSelected
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200 scale-102'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner (Wrong / Correct Message) */}
      <AnswerFeedback
        status={feedbackStatus}
        message={feedbackMessage}
        explanation={feedbackTip}
        lives={lives}
        streak={streak}
        onTryAgain={() => {
          setSelectedOption(null);
          setFeedbackStatus('idle');
        }}
        onNext={handleNext}
        onUseHint={handleUseHint}
        hintUsed={hintUsed}
      />

      {/* Bottom Check Button */}
      {feedbackStatus === 'idle' && (
        <div className="mt-auto mb-2">
          <button
            type="button"
            onClick={handleCheck}
            disabled={selectedOption === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              selectedOption !== null
                ? 'btn-chunky-purple text-white shadow-md cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Confirm Answer</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Logic Mastermind!"
        subtitle={current.explanation}
        xpEarned={30 + streak * 5}
        gemsEarned={5}
        onPlayAgain={() => {
          setSelectedOption(null);
          setShowCelebration(false);
          setFeedbackStatus('idle');
        }}
        onContinue={handleNext}
      />
    </div>
  );
}
