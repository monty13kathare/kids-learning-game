'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Plus, Minus, Sparkles } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

import AnswerFeedback from '@/components/AnswerFeedback';
import { Heart, Volume2, Lightbulb } from 'lucide-react';

interface MathsGameProps {
  onClose: () => void;
}

interface MathProblem {
  num1: number;
  num2: number;
  op: '+' | '-';
  emoji: string;
  name: string;
}

const PROBLEMS: MathProblem[] = [
  { num1: 3, num2: 2, op: '+', emoji: '🍎', name: 'apples' },
  { num1: 4, num2: 1, op: '+', emoji: '⭐', name: 'stars' },
  { num1: 5, num2: 2, op: '-', emoji: '🎈', name: 'balloons' },
  { num1: 6, num2: 3, op: '-', emoji: '🍓', name: 'berries' },
  { num1: 4, num2: 4, op: '+', emoji: '🧁', name: 'cupcakes' },
  { num1: 7, num2: 2, op: '-', emoji: '🦁', name: 'lions' },
  { num1: 5, num2: 3, op: '+', emoji: '🌸', name: 'flowers' },
];

export default function MathsGame({ onClose }: MathsGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [levelIndex, setLevelIndex] = useState(0);
  const problem = PROBLEMS[levelIndex];

  const correctAnswer = problem.op === '+' ? problem.num1 + problem.num2 : problem.num1 - problem.num2;

  // Options & Selection
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Logical Feedback States
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTip, setFeedbackTip] = useState('');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setFeedbackStatus('idle');
    setEliminatedOptions([]);
    setHintUsed(false);

    const opts = new Set<number>();
    opts.add(correctAnswer);
    while (opts.size < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const fake = Math.max(0, correctAnswer + (delta === 0 ? 1 : delta));
      opts.add(fake);
    }
    setOptions(Array.from(opts).sort(() => 0.5 - Math.random()));

    const opWord = problem.op === '+' ? 'plus' : 'minus';
    soundManager.speak(`What is ${problem.num1} ${opWord} ${problem.num2}? Count the ${problem.name}.`);
  }, [levelIndex, problem, correctAnswer]);

  const handleSelectOption = (val: number) => {
    if (eliminatedOptions.includes(val)) return;
    try { soundManager.playPop(480); } catch {}
    setSelectedAnswer(val);
    setFeedbackStatus('idle');
    soundManager.speak(`${val}`);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === correctAnswer) {
      // Correct!
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFeedbackStatus('correct');
      setFeedbackMessage(`${problem.num1} ${problem.op} ${problem.num2} is indeed ${correctAnswer}!`);
      setFeedbackTip(`You counted all the ${problem.name} accurately! +${30 + nextStreak * 5} XP`);

      try {
        soundManager.playChime();
        soundManager.speak(`Awesome! ${problem.num1} ${problem.op === '+' ? 'plus' : 'minus'} ${problem.num2} equals ${correctAnswer}!`);
      } catch {}

      addXP(30 + nextStreak * 5, 5);
      unlockBadge('math-1');

      setTimeout(() => {
        setShowCelebration(true);
      }, 1200);
    } else {
      // Wrong Answer!
      setStreak(0);
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      setFeedbackStatus('wrong');

      if (problem.op === '+') {
        setFeedbackMessage(`Oops! ${selectedAnswer} is not correct.`);
        setFeedbackTip(`Start with ${problem.num1} ${problem.name}, then count ${problem.num2} more: ${Array.from({ length: correctAnswer }, (_, i) => i + 1).join(', ')}.`);
      } else {
        setFeedbackMessage(`Oops! ${selectedAnswer} is not correct.`);
        setFeedbackTip(`You had ${problem.num1} ${problem.name} and removed ${problem.num2}. How many are left?`);
      }

      try {
        soundManager.playError();
        soundManager.speak(`Not quite ${selectedAnswer}. Try counting the ${problem.name} again.`);
      } catch {}

      // If out of lives, gently refill
      if (nextLives === 0) {
        setTimeout(() => setLives(3), 2000);
      }
    }
  };

  // 50:50 Hint Function
  const handleUseHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrongOptions = options.filter((o) => o !== correctAnswer);
    // Eliminate up to 2 wrong choices
    const toEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(toEliminate);

    try {
      soundManager.playSparkle();
      soundManager.speak(`50-50 Hint used! Two wrong choices removed.`);
    } catch {}
  };

  const handleNext = () => {
    setShowCelebration(false);
    setFeedbackStatus('idle');
    setLevelIndex((prev) => (prev + 1) % PROBLEMS.length);
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
            style={{ width: `${((levelIndex + 1) / PROBLEMS.length) * 100}%` }}
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
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Level {levelIndex + 1} of {PROBLEMS.length}
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Solve the Equation!
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            const opWord = problem.op === '+' ? 'plus' : 'minus';
            soundManager.speak(`What is ${problem.num1} ${opWord} ${problem.num2}? Count the ${problem.name}.`);
          }}
          className="w-9 h-9 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs hover:bg-blue-50 active:scale-90 transition-transform cursor-pointer"
          title="Read Aloud"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Counters Card */}
      <div className="bg-white rounded-3xl border-2 border-blue-200/90 p-5 shadow-sm my-auto text-center">
        {/* Visual Math Representation */}
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          {/* Group 1 */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3 flex flex-wrap gap-1.5 max-w-[120px] justify-center shadow-inner">
            {Array.from({ length: problem.num1 }).map((_, i) => (
              <span key={i} className="text-2xl animate-gentle-bounce">{problem.emoji}</span>
            ))}
          </div>

          {/* Operator */}
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center shadow-sm">
            {problem.op === '+' ? <Plus className="w-6 h-6 stroke-[3]" /> : <Minus className="w-6 h-6 stroke-[3]" />}
          </div>

          {/* Group 2 */}
          <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3 flex flex-wrap gap-1.5 max-w-[120px] justify-center shadow-inner">
            {Array.from({ length: problem.num2 }).map((_, i) => (
              <span key={i} className="text-2xl animate-gentle-bounce">{problem.emoji}</span>
            ))}
          </div>
        </div>

        {/* Big Numbers Display */}
        <div className="flex items-center justify-center gap-3 text-4xl font-black text-slate-800">
          <span>{problem.num1}</span>
          <span className="text-amber-500 font-extrabold">{problem.op}</span>
          <span>{problem.num2}</span>
          <span className="text-slate-400">=</span>
          <span
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
              feedbackStatus === 'wrong'
                ? 'bg-rose-100 border-rose-400 text-rose-700 animate-wiggle'
                : feedbackStatus === 'correct'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                : selectedAnswer !== null
                ? 'bg-blue-50 border-blue-400 text-blue-800'
                : 'border-dashed border-slate-300 text-slate-300'
            }`}
          >
            {selectedAnswer !== null ? selectedAnswer : '?'}
          </span>
        </div>
      </div>

      {/* Answer Choices Grid */}
      <div className="space-y-2 my-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Select the correct answer:
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

        <div className="grid grid-cols-4 gap-2.5">
          {options.map((opt) => {
            const isEliminated = eliminatedOptions.includes(opt);
            const isSelected = selectedAnswer === opt;
            const isWrong = isSelected && feedbackStatus === 'wrong';
            const isRight = isSelected && feedbackStatus === 'correct';

            return (
              <button
                key={opt}
                type="button"
                disabled={isEliminated}
                onClick={() => handleSelectOption(opt)}
                className={`h-16 rounded-2xl font-black text-2xl border-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
                  isEliminated
                    ? 'opacity-20 line-through bg-slate-100 border-slate-200 cursor-not-allowed'
                    : isRight
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-300 scale-105'
                    : isWrong
                    ? 'bg-rose-100 border-rose-500 text-rose-800 animate-wiggle'
                    : isSelected
                    ? 'bg-blue-100 border-blue-500 text-blue-900 ring-2 ring-blue-200 scale-102'
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
          setSelectedAnswer(null);
          setFeedbackStatus('idle');
        }}
        onNext={handleNext}
        onUseHint={handleUseHint}
        hintUsed={hintUsed}
      />

      {/* Check Button */}
      {feedbackStatus === 'idle' && (
        <div className="mt-auto mb-2">
          <button
            type="button"
            onClick={handleCheck}
            disabled={selectedAnswer === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              selectedAnswer !== null
                ? 'btn-chunky-blue text-white shadow-md cursor-pointer'
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
        title="Math Wizard!"
        subtitle={`Brilliant! ${problem.num1} ${problem.op} ${problem.num2} = ${correctAnswer}`}
        xpEarned={30 + streak * 5}
        gemsEarned={5}
        onPlayAgain={() => {
          setSelectedAnswer(null);
          setShowCelebration(false);
          setFeedbackStatus('idle');
        }}
        onContinue={handleNext}
      />
    </div>
  );
}
