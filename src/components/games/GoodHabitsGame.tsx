'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Heart, Sparkles } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface GoodHabitsGameProps {
  onClose: () => void;
}

interface HabitQuestion {
  scenario: string;
  category: string;
  icon: string;
  answer: string;
  options: string[];
  praise: string;
  tip: string;
}

const QUESTIONS: HabitQuestion[] = [
  {
    scenario: 'When someone helps you or gives you a wonderful gift, what polite magic words do you say?',
    category: 'Manners & Politeness',
    icon: '🎁',
    answer: 'Thank you!',
    options: ['Give me more!', 'Thank you!', 'Nothing', 'Go away'],
    praise: 'Saying "Thank You" makes others feel loved and appreciated!',
    tip: 'Expressing gratitude with "Thank you!" is one of the most powerful polite habits.',
  },
  {
    scenario: 'What healthy habit should you always do with soap before eating meals?',
    category: 'Health & Cleanliness',
    icon: '🧼',
    answer: 'Wash hands with soap',
    options: ['Wipe on shirt', 'Wash hands with soap', 'Nothing', 'Play in dirt'],
    praise: 'Washing hands washes away germs so you stay strong and healthy!',
    tip: 'Lathering hands with warm water and soap for 20 seconds keeps tummy aches away!',
  },
  {
    scenario: 'When another friend wants to play with building blocks too, what is kind to do?',
    category: 'Kindness & Friendship',
    icon: '🧸',
    answer: 'Share and build together',
    options: ['Hide all blocks', 'Cry loudly', 'Share and build together', 'Throw the blocks'],
    praise: 'Sharing brings joy and makes you a beloved, wonderful friend!',
    tip: 'Teamwork and taking turns turns playing into twice the fun!',
  },
  {
    scenario: 'What keeps your smile bright and teeth cavity-free in the morning and night?',
    category: 'Dental Hygiene',
    icon: '🪥',
    answer: 'Brush teeth twice a day',
    options: ['Eat sugar candy', 'Brush teeth twice a day', 'Drink soda', 'Never brush'],
    praise: 'Brushing morning and night gives you sparkling, healthy teeth!',
    tip: 'Brush circular strokes for 2 full minutes morning and night before sleep.',
  },
  {
    scenario: 'When you want to ask a teacher or parent for a glass of water, what magic word helps?',
    category: 'Polite Speech',
    icon: '🥛',
    answer: 'Please',
    options: ['Now!', 'Give it!', 'Please', 'Hurry up!'],
    praise: '"Please" is a magical polite word that shows caring respect!',
    tip: 'Always say "Please" before asking for help or requesting things.',
  },
];

export default function GoodHabitsGame({ onClose }: GoodHabitsGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const current = QUESTIONS[qIndex];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Logical Feedback & Lifelines
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackExplanation, setFeedbackExplanation] = useState('');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setFeedbackStatus('idle');
    setHiddenOptions([]);
    setHintUsed(false);
    soundManager.speak(current.scenario);
  }, [qIndex, current]);

  const handleSelect = (opt: string) => {
    if (feedbackStatus === 'correct') return;
    soundManager.playPop(480);
    setSelectedOption(opt);
    soundManager.speak(opt);
  };

  const handleUse5050 = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrong = current.options.filter((o) => o !== current.answer);
    const toHide = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    soundManager.speak(`50-50 Lifeline! Eliminated 2 choices.`);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === current.answer) {
      soundManager.playChime();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Wonderful habit! That is the right action!`);
      setFeedbackExplanation(current.praise);
      soundManager.speak(`Wonderful habit! ${current.praise}`);
      addXP(25, 5);
      unlockBadge('star-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');
      setFeedbackMsg(`"${selectedOption}" is not a kind or healthy habit.`);
      setFeedbackExplanation(`Manners tip: ${current.tip}`);
      soundManager.speak(`Not quite. Think about good manners: ${current.tip}`);
    }
  };

  const handleTryAgain = () => {
    setSelectedOption(null);
    setFeedbackStatus('idle');
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
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex-1 bg-pink-100 rounded-full h-3.5 overflow-hidden p-0.5 max-w-[140px]">
          <div
            className="bg-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Lives & Streak */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-black text-amber-700 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{streak}x</span>
            </div>
          )}
          <div className="flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-2 py-1 rounded-full shadow-xs">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-left mt-1 mb-2">
        <span className="text-xs font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1">
          <span>💖</span>
          <span>Manners & Social Skills ({qIndex + 1}/{QUESTIONS.length})</span>
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Good Habits & Manners
        </h1>
      </div>

      {/* Scenario Card */}
      <div className="bg-gradient-to-br from-pink-50 via-white to-amber-50 rounded-3xl border-2 border-pink-200 p-5 shadow-sm flex flex-col items-center justify-center min-h-[200px] my-auto text-center">
        <span className="text-xs font-black text-pink-800 bg-pink-100/90 px-3 py-0.5 rounded-full mb-2">
          {current.category}
        </span>
        <div className="text-6xl mb-2 animate-gentle-bounce">
          {current.icon}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
          {current.scenario}
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {current.options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isHidden = hiddenOptions.includes(opt);

          if (isHidden) {
            return (
              <div
                key={opt}
                className="h-14 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-300 font-bold text-xs select-none"
              >
                Eliminated
              </div>
            );
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`h-14 rounded-2xl font-black text-xs sm:text-sm px-2 border-2 transition-all shadow-sm active:scale-95 leading-tight cursor-pointer ${
                isSelected
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Rich Logical Feedback Card */}
      <AnswerFeedback
        status={feedbackStatus}
        message={feedbackMsg}
        explanation={feedbackExplanation}
        correctAnswerText={current.answer}
        lives={lives}
        streak={streak}
        onTryAgain={handleTryAgain}
        onNext={handleNext}
        onUseHint={handleUse5050}
        hintUsed={hintUsed}
      />

      {/* Bottom Button */}
      {feedbackStatus === 'idle' && (
        <div className="mt-auto mb-2 pt-2">
          <button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedOption !== null
                ? 'btn-chunky-purple text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Confirm Choice</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Manners Superhero!"
        subtitle={current.praise}
        xpEarned={25}
        gemsEarned={5}
        onPlayAgain={() => {
          setSelectedOption(null);
          setFeedbackStatus('idle');
          setShowCelebration(false);
        }}
        onContinue={handleNext}
      />
    </div>
  );
}
