'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Heart, Sparkles, RefreshCw } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface NumbersCountingGameProps {
  onClose: () => void;
}

interface Question {
  fruit: string;
  name: string;
  count: number;
  options: number[];
  hint: string;
}

const QUESTIONS: Question[] = [
  { fruit: '🍎', name: 'Apples', count: 7, options: [5, 6, 7, 8], hint: 'Tap each juicy apple one by one until all are glowing!' },
  { fruit: '🍌', name: 'Bananas', count: 5, options: [3, 4, 5, 6], hint: 'There is one banana for each finger on one hand!' },
  { fruit: '🍓', name: 'Strawberries', count: 8, options: [6, 7, 8, 9], hint: 'Eight little berries in a bunch, count them in pairs: 2, 4, 6, 8!' },
  { fruit: '⭐', name: 'Twinkling Stars', count: 6, options: [4, 5, 6, 7], hint: 'Six stars shining brightly! Count the top row and bottom row.' },
  { fruit: '🧁', name: 'Sweet Cupcakes', count: 4, options: [2, 3, 4, 5], hint: 'A quartet of cupcakes! Two on the left and two on the right.' },
  { fruit: '🎈', name: 'Party Balloons', count: 9, options: [7, 8, 9, 10], hint: 'Just one less than 10 fingers! Count carefully.' },
];

export default function NumbersCountingGame({ onClose }: NumbersCountingGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const currentQ = QUESTIONS[qIndex];

  const [tappedApples, setTappedApples] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Logical Feedback & Lifelines
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackExplanation, setFeedbackExplanation] = useState('');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setTappedApples([]);
    setSelectedOption(null);
    setFeedbackStatus('idle');
    setHiddenOptions([]);
    setHintUsed(false);
    soundManager.speak(`How many ${currentQ.name}? Tap each one to count!`);
  }, [qIndex, currentQ]);

  // Tap an individual fruit to count it
  const handleTapFruit = (index: number) => {
    soundManager.playPop(300 + index * 40);
    if (!tappedApples.includes(index)) {
      const nextTapped = [...tappedApples, index];
      setTappedApples(nextTapped);
      soundManager.speak(nextTapped.length.toString(), 1.2, 1.1);
    }
  };

  const handleSelectOption = (opt: number) => {
    if (feedbackStatus === 'correct') return;
    soundManager.playPop(520);
    setSelectedOption(opt);
    soundManager.speak(`${opt}`);
  };

  const handleUse5050 = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrong = currentQ.options.filter((o) => o !== currentQ.count);
    const toHide = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    soundManager.speak(`50-50 Lifeline! Removed 2 numbers.`);
  };

  const handleContinue = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentQ.count) {
      soundManager.playChime();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Splendid! There are exactly ${currentQ.count} ${currentQ.name}!`);
      setFeedbackExplanation(`You counted all ${currentQ.count} accurately! Super math skills!`);
      soundManager.speak(`Correct! There are ${currentQ.count} ${currentQ.name}!`);
      addXP(25, 5);
      unlockBadge('math-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');

      const difference = Math.abs(selectedOption - currentQ.count);
      const isMore = selectedOption > currentQ.count;
      const compareText = isMore ? `${difference} too many` : `${difference} too few`;

      setFeedbackMsg(`Not quite! You chose ${selectedOption}, which is ${compareText}.`);
      setFeedbackExplanation(`Count them by tapping each item! Hint: ${currentQ.hint}`);
      soundManager.speak(`You selected ${selectedOption}, but there are ${currentQ.count}. Tap each fruit to count!`);
    }
  };

  const handleTryAgain = () => {
    setSelectedOption(null);
    setFeedbackStatus('idle');
  };

  const handleNextQuestion = () => {
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
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90 transition-transform cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Pink Progress Bar Pill */}
        <div className="flex-1 bg-pink-100 rounded-full h-3.5 overflow-hidden p-0.5 max-w-[140px]">
          <div
            className="bg-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Lives & Streak Indicators */}
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
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Counting Numbers ({qIndex + 1}/{QUESTIONS.length})
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          How many {currentQ.name}?
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Tap each {currentQ.fruit} to number it, then select the total below!
        </p>
      </div>

      {/* Fruits Display Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm flex flex-col items-center justify-center min-h-[220px] my-2">
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-[280px]">
          {Array.from({ length: currentQ.count }).map((_, idx) => {
            const isTapped = tappedApples.includes(idx);
            const tapOrder = tappedApples.indexOf(idx) + 1;

            return (
              <button
                key={idx}
                onClick={() => handleTapFruit(idx)}
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-4xl transition-all duration-200 active:scale-90 cursor-pointer ${
                  isTapped ? 'scale-110 drop-shadow-md bg-amber-50 border-2 border-amber-300' : 'hover:scale-105 bg-slate-50 border border-slate-200'
                }`}
              >
                <span>{currentQ.fruit}</span>
                {isTapped && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-md animate-bounce">
                    {tapOrder}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Tapped: <strong className="text-emerald-600 font-black">{tappedApples.length}</strong> / {currentQ.count}
          </span>
          {tappedApples.length > 0 && (
            <button
              onClick={() => {
                soundManager.playPop();
                setTappedApples([]);
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Multiple Choice Options (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isHidden = hiddenOptions.includes(opt);

          if (isHidden) {
            return (
              <div
                key={opt}
                className="h-14 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-300 font-bold text-sm select-none"
              >
                Hidden
              </div>
            );
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelectOption(opt)}
              className={`h-14 rounded-2xl font-black text-2xl border-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
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
        correctAnswerText={`${currentQ.count} ${currentQ.name}`}
        lives={lives}
        streak={streak}
        onTryAgain={handleTryAgain}
        onNext={handleNextQuestion}
        onUseHint={handleUse5050}
        hintUsed={hintUsed}
      />

      {/* Continue / Check Button (shown if feedback is idle or trying again) */}
      {feedbackStatus === 'idle' && (
        <div className="mt-auto mb-2 pt-2">
          <button
            onClick={handleContinue}
            disabled={selectedOption === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedOption !== null
                ? 'btn-chunky-blue text-white shadow-md'
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
        title="Counting Champion!"
        subtitle={`Awesome! There are ${currentQ.count} ${currentQ.name}!`}
        xpEarned={25}
        gemsEarned={5}
        onPlayAgain={() => {
          setTappedApples([]);
          setSelectedOption(null);
          setFeedbackStatus('idle');
          setShowCelebration(false);
        }}
        onContinue={handleNextQuestion}
      />
    </div>
  );
}
