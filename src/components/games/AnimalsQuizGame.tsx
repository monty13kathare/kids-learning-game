'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Volume2 } from 'lucide-react';
import Image from 'next/image';
import CelebrationModal from '@/components/CelebrationModal';

import AnswerFeedback from '@/components/AnswerFeedback';
import { Heart, Lightbulb } from 'lucide-react';

interface AnimalsQuizGameProps {
  onClose: () => void;
}

interface AnimalQuestion {
  name: string;
  image: string;
  soundText: string;
  clue: string;
  options: string[];
}

const QUESTIONS: AnimalQuestion[] = [
  {
    name: 'Elephant',
    image: '/images/elephant.jpg',
    soundText: 'Pawoo! Elephant trumpet!',
    clue: 'Look for the huge ears and the long curling trunk!',
    options: ['Giraffe', 'Elephant', 'Zebra', 'Lion'],
  },
  {
    name: 'Lion',
    image: '/images/lion.jpg',
    soundText: 'Roar! King of the jungle!',
    clue: 'Look for the big furry golden mane and powerful roar!',
    options: ['Cheetah', 'Tiger', 'Lion', 'Bear'],
  },
  {
    name: 'Zebra',
    image: '/images/zebra.jpg',
    soundText: 'Neigh! Stripes and fun!',
    clue: 'Notice the beautiful black and white zebra stripes!',
    options: ['Horse', 'Donkey', 'Zebra', 'Panda'],
  },
  {
    name: 'Cow',
    image: '/images/cow.jpg',
    soundText: 'Moo! Gives delicious fresh milk!',
    clue: 'Friendly farm animal with black spots saying Moo!',
    options: ['Goat', 'Sheep', 'Cow', 'Horse'],
  },
];

export default function AnimalsQuizGame({ onClose }: AnimalsQuizGameProps) {
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
    soundManager.speak(`Which animal is this? Tap sound to hear its roar.`);
  }, [qIndex, currentQ]);

  const handleSelectOption = (opt: string) => {
    if (eliminatedOptions.includes(opt)) return;
    try { soundManager.playPop(480); } catch {}
    setSelectedOption(opt);
    setFeedbackStatus('idle');
    soundManager.speak(opt);
  };

  const handlePlaySound = () => {
    try { soundManager.playPop(600); } catch {}
    soundManager.speak(currentQ.soundText);
  };

  const handleContinue = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentQ.name) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFeedbackStatus('correct');
      setFeedbackMessage(`Yes! That is an ${currentQ.name}!`);
      setFeedbackTip(currentQ.soundText);

      try {
        soundManager.playChime();
        soundManager.speak(`Yes! That is an ${currentQ.name}! ${currentQ.soundText}`);
      } catch {}

      addXP(25 + nextStreak * 5, 5);
      unlockBadge('animal-1');

      setTimeout(() => {
        setShowCelebration(true);
      }, 1200);
    } else {
      setStreak(0);
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      setFeedbackStatus('wrong');
      setFeedbackMessage(`"${selectedOption}" is not this animal.`);
      setFeedbackTip(currentQ.clue);

      try {
        soundManager.playError();
        soundManager.speak(`Not quite. ${currentQ.clue}`);
      } catch {}

      if (nextLives === 0) {
        setTimeout(() => setLives(3), 2000);
      }
    }
  };

  const handleUseHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrongOptions = currentQ.options.filter((o) => o !== currentQ.name);
    const toEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(toEliminate);

    try {
      soundManager.playSparkle();
      soundManager.speak(`50-50 Hint! Two wrong animal names removed.`);
    } catch {}
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

        {/* Progress Bar Pill */}
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

      {/* Screen Title */}
      <div className="text-left mt-1 mb-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Safari Discovery • {qIndex + 1}/{QUESTIONS.length}
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Which animal is this?
        </h1>
      </div>

      {/* 3D Animal Picture Card */}
      <div className="relative w-full aspect-square max-h-[220px] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-sm bg-white flex items-center justify-center mx-auto my-auto">
        <Image
          src={currentQ.image}
          alt={currentQ.name}
          fill
          className="object-contain p-3"
          priority
        />
        <button
          type="button"
          onClick={handlePlaySound}
          className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 border border-slate-200 px-3 py-1.5 rounded-full shadow-md text-slate-700 font-bold text-xs active:scale-95 transition-transform cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-amber-500" />
          <span>Animal Sound</span>
        </button>
      </div>

      {/* Multiple Choice Options (2x2 Grid) */}
      <div className="space-y-2 my-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Select animal name:
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
                onClick={() => handleSelectOption(opt)}
                className={`h-14 rounded-2xl font-black text-base border-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
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
        onNext={handleNextQuestion}
        onUseHint={handleUseHint}
        hintUsed={hintUsed}
      />

      {/* Continue Button */}
      {feedbackStatus === 'idle' && (
        <div className="mt-auto mb-2">
          <button
            type="button"
            onClick={handleContinue}
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
        title="Safari Explorer!"
        subtitle={`Spot on! You found the ${currentQ.name}!`}
        xpEarned={25 + streak * 5}
        gemsEarned={5}
        onPlayAgain={() => {
          setSelectedOption(null);
          setShowCelebration(false);
          setFeedbackStatus('idle');
        }}
        onContinue={handleNextQuestion}
      />
    </div>
  );
}
