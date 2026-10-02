'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

import AnswerFeedback from '@/components/AnswerFeedback';
import { Heart, Volume2, Lightbulb } from 'lucide-react';

interface GkQuizGameProps {
  onClose: () => void;
}

interface GkQuestion {
  question: string;
  icon: string;
  answer: string;
  clue: string;
  options: string[];
}

const QUESTIONS: GkQuestion[] = [
  {
    question: 'Which planet do we live on?',
    icon: '🌍',
    answer: 'Earth',
    clue: 'It is the beautiful blue and green planet with oceans and air!',
    options: ['Mars', 'Earth', 'Jupiter', 'Moon'],
  },
  {
    question: 'Which animal has a very long neck?',
    icon: '🦒',
    answer: 'Giraffe',
    clue: 'It reaches tall acacia trees and has spotted patterns!',
    options: ['Elephant', 'Lion', 'Giraffe', 'Zebra'],
  },
  {
    question: 'How many colors are there in a rainbow?',
    icon: '🌈',
    answer: '7 Colors',
    clue: 'Remember VIBGYOR: Violet, Indigo, Blue, Green, Yellow, Orange, Red!',
    options: ['5 Colors', '7 Colors', '10 Colors', '3 Colors'],
  },
  {
    question: 'Which vehicle flies high in the sky?',
    icon: '✈️',
    answer: 'Airplane',
    clue: 'It has wings and jet engines to soar above the clouds!',
    options: ['Boat', 'Train', 'Airplane', 'Bicycle'],
  },
  {
    question: 'What is the fastest animal on land?',
    icon: '🐆',
    answer: 'Cheetah',
    clue: 'A spotted wild cat that can run as fast as a car on highway!',
    options: ['Horse', 'Rabbit', 'Cheetah', 'Turtle'],
  },
];

export default function GkQuizGame({ onClose }: GkQuizGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const currentQ = QUESTIONS[qIndex];
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
    soundManager.speak(currentQ.question);
  }, [qIndex, currentQ]);

  const handleSelect = (opt: string) => {
    if (eliminatedOptions.includes(opt)) return;
    try { soundManager.playPop(480); } catch {}
    setSelectedOption(opt);
    setFeedbackStatus('idle');
    soundManager.speak(opt);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentQ.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFeedbackStatus('correct');
      setFeedbackMessage(`Superb! "${currentQ.answer}" is 100% correct!`);
      setFeedbackTip(currentQ.clue);

      try {
        soundManager.playChime();
        soundManager.speak(`Super! The answer is ${currentQ.answer}! ${currentQ.clue}`);
      } catch {}

      addXP(25 + nextStreak * 5, 5);
      unlockBadge('star-1');

      setTimeout(() => {
        setShowCelebration(true);
      }, 1200);
    } else {
      setStreak(0);
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      setFeedbackStatus('wrong');
      setFeedbackMessage(`"${selectedOption}" is not correct.`);
      setFeedbackTip(currentQ.clue);

      try {
        soundManager.playError();
        soundManager.speak(`Not quite. Clue: ${currentQ.clue}`);
      } catch {}

      if (nextLives === 0) {
        setTimeout(() => setLives(3), 2000);
      }
    }
  };

  const handleUseHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrongOptions = currentQ.options.filter((o) => o !== currentQ.answer);
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
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            General Knowledge • Question {qIndex + 1}/{QUESTIONS.length}
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Fun GK Quiz
          </h1>
        </div>

        <button
          type="button"
          onClick={() => soundManager.speak(currentQ.question)}
          className="w-9 h-9 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs hover:bg-amber-50 active:scale-90 transition-transform cursor-pointer"
          title="Read Question"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[190px] my-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center text-5xl mb-3 shadow-inner">
          {currentQ.icon}
        </div>
        <h3 className="text-xl font-black text-slate-800 leading-snug">
          {currentQ.question}
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="space-y-2 my-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Select the answer:
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
          {currentQ.options.map((opt) => {
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
                    ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-200 scale-102'
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

      {/* Bottom Button */}
      {feedbackStatus === 'idle' && (
        <div className="mt-auto mb-2">
          <button
            type="button"
            onClick={handleCheck}
            disabled={selectedOption === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              selectedOption !== null
                ? 'btn-chunky-blue text-white shadow-md cursor-pointer'
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
        title="Knowledge Champion!"
        subtitle={`Spot on! The answer is ${currentQ.answer}!`}
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
