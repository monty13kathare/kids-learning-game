'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Volume2 } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

interface EnglishLearningGameProps {
  onClose: () => void;
}

interface EnglishQuestion {
  prompt: string;
  category: string;
  icon: string;
  answer: string;
  options: string[];
  explanation: string;
}

const QUESTIONS: EnglishQuestion[] = [
  {
    prompt: 'What is the opposite of HOT? 🔥',
    category: 'Opposites',
    icon: '🔥',
    answer: 'Cold ❄️',
    options: ['Warm ☀️', 'Cold ❄️', 'Spicy 🌶️', 'Sunny 🏖️'],
    explanation: 'Hot and Cold are opposite temperatures!',
  },
  {
    prompt: 'Which word rhymes with CAT? 🐱',
    category: 'Rhyming Words',
    icon: '🐱',
    answer: 'Hat 🎩',
    options: ['Dog 🐶', 'Hat 🎩', 'Fish 🐟', 'Bird 🐦'],
    explanation: 'Cat and Hat share the same ending sound "-at"!',
  },
  {
    prompt: 'What is the opposite of HAPPY? 😊',
    category: 'Opposites',
    icon: '😊',
    answer: 'Sad 😢',
    options: ['Angry 😠', 'Sleepy 😴', 'Sad 😢', 'Excited 🤩'],
    explanation: 'Happy and Sad are opposite feelings!',
  },
  {
    prompt: 'Which word is an ACTION verb that you do with your feet? 🏃',
    category: 'Action Verbs',
    icon: '🏃',
    answer: 'Jump 🦘',
    options: ['Chair 🪑', 'Blue 🟦', 'Jump 🦘', 'Apple 🍎'],
    explanation: 'Jump is an action verb telling what someone does!',
  },
  {
    prompt: 'What is the plural for more than one STAR? ⭐',
    category: 'Plurals',
    icon: '⭐',
    answer: 'Stars ✨',
    options: ['Stares', 'Stars ✨', 'Staries', 'Staring'],
    explanation: 'One star, many stars! We add "-s" for most plurals.',
  },
];

import AnswerFeedback from '@/components/AnswerFeedback';
import { Heart, Lightbulb } from 'lucide-react';

export default function EnglishLearningGame({ onClose }: EnglishLearningGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const current = QUESTIONS[qIndex];
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
    soundManager.speak(current.prompt);
  }, [qIndex, current]);

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
      setFeedbackMessage(`Correct! "${current.answer}" is the right choice.`);
      setFeedbackTip(current.explanation);

      try {
        soundManager.playChime();
        soundManager.speak(`Superb English! ${current.explanation}`);
      } catch {}

      addXP(25 + nextStreak * 5, 5);
      unlockBadge('builder-1');

      setTimeout(() => {
        setShowCelebration(true);
      }, 1200);
    } else {
      setStreak(0);
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      setFeedbackStatus('wrong');
      setFeedbackMessage(`"${selectedOption}" is not correct here.`);
      setFeedbackTip(
        current.category === 'Opposites'
          ? `Think of the complete reverse word for "${current.prompt.split(' ')[2] || 'this'}".`
          : current.category === 'Rhyming'
          ? `Listen to the ending sound. Which word ends with the same chime sound?`
          : `Hint: ${current.explanation}`
      );

      try {
        soundManager.playError();
        soundManager.speak(`Not quite. Remember: ${current.explanation}`);
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
      soundManager.speak(`50-50 Hint! Two wrong choices removed.`);
    } catch {}
  };

  const handleNext = () => {
    setShowCelebration(false);
    setFeedbackStatus('idle');
    setQIndex((prev) => (prev + 1) % QUESTIONS.length);
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
            style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
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
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            {current.category} • {qIndex + 1}/{QUESTIONS.length}
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            English Learning
          </h1>
        </div>

        <button
          type="button"
          onClick={() => soundManager.speak(current.prompt)}
          className="w-9 h-9 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs hover:bg-purple-50 active:scale-90 transition-transform cursor-pointer"
          title="Read Question"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl border-2 border-purple-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[190px] my-auto text-center">
        <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-0.5 rounded-full mb-2">
          {current.category}
        </span>
        <div className="text-6xl mb-3 animate-gentle-bounce">
          {current.icon}
        </div>
        <h3 className="text-xl font-black text-slate-800 leading-snug">
          {current.prompt}
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="space-y-2 my-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Select matching word:
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
                    ? 'bg-purple-100 border-purple-500 text-purple-900 ring-2 ring-purple-200 scale-102'
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
            <span>Check Answer</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Word Champion!"
        subtitle={current.explanation}
        xpEarned={25 + streak * 5}
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
