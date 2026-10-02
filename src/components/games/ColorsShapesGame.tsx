'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Heart, Sparkles, Shapes } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface ColorsShapesGameProps {
  onClose: () => void;
}

interface ShapeItem {
  label: string;
  shape: string;
  color: string;
  bg: string;
}

interface ShapeChallenge {
  prompt: string;
  target: string;
  tip: string;
  items: ShapeItem[];
}

const CHALLENGES: ShapeChallenge[] = [
  {
    prompt: 'Tap the Red Circle!',
    target: 'Red Circle',
    tip: 'A circle is completely round with no sharp corners or straight sides, colored bright red!',
    items: [
      { label: 'Red Circle', shape: '🔴', color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
      { label: 'Blue Square', shape: '🟦', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
      { label: 'Yellow Star', shape: '⭐', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
      { label: 'Green Triangle', shape: '🔺', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
    ],
  },
  {
    prompt: 'Which shape has 3 corners and 3 straight sides?',
    target: 'Green Triangle',
    tip: 'A triangle always has 3 points and 3 straight edges - like a slice of pizza or roof of a house!',
    items: [
      { label: 'Blue Square', shape: '🟦', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
      { label: 'Green Triangle', shape: '🔺', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
      { label: 'Orange Diamond', shape: '🔶', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
      { label: 'Purple Circle', shape: '🟣', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
    ],
  },
  {
    prompt: 'Find the Yellow Star shining bright!',
    target: 'Yellow Star',
    tip: 'A star has 5 shiny points radiating outwards and glows in yellow!',
    items: [
      { label: 'Red Heart', shape: '❤️', color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
      { label: 'Blue Circle', shape: '🔵', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
      { label: 'Yellow Star', shape: '⭐', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
      { label: 'Green Square', shape: '🟩', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
    ],
  },
  {
    prompt: 'Tap the Purple Heart!',
    target: 'Purple Heart',
    tip: 'A heart curves gently at the top lobes and tapers to a single point at the bottom in violet-purple!',
    items: [
      { label: 'Purple Heart', shape: '💜', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
      { label: 'Yellow Sun', shape: '☀️', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
      { label: 'Blue Diamond', shape: '🔷', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
      { label: 'Red Apple', shape: '🍎', color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
    ],
  },
  {
    prompt: 'Which shape has 4 equal sides and 4 square corners?',
    target: 'Blue Square',
    tip: 'A square has 4 sides that are all the exact same length with four 90-degree corners!',
    items: [
      { label: 'Blue Square', shape: '🟦', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
      { label: 'Red Circle', shape: '🔴', color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
      { label: 'Green Triangle', shape: '🔺', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
      { label: 'Yellow Star', shape: '⭐', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
    ],
  },
];

export default function ColorsShapesGame({ onClose }: ColorsShapesGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [levelIndex, setLevelIndex] = useState(0);
  const challenge = CHALLENGES[levelIndex];

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Logical Feedback & Lifelines
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackExplanation, setFeedbackExplanation] = useState('');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [hiddenLabels, setHiddenLabels] = useState<string[]>([]);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setSelectedLabel(null);
    setFeedbackStatus('idle');
    setHiddenLabels([]);
    setHintUsed(false);
    soundManager.speak(challenge.prompt);
  }, [levelIndex, challenge]);

  const handleSelectItem = (item: ShapeItem) => {
    if (feedbackStatus === 'correct') return;
    soundManager.playPop(520);
    setSelectedLabel(item.label);
    soundManager.speak(item.label);
  };

  const handleUse5050 = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrong = challenge.items.filter((i) => i.label !== challenge.target).map((i) => i.label);
    const toHide = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenLabels(toHide);
    soundManager.speak(`50-50 Lifeline! Removed 2 shapes.`);
  };

  const handleCheck = () => {
    if (selectedLabel === null) return;

    if (selectedLabel === challenge.target) {
      soundManager.playChime();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Yes! That is the ${challenge.target}!`);
      setFeedbackExplanation(challenge.tip);
      soundManager.speak(`Yes! That is the ${challenge.target}! Great eye!`);
      addXP(25, 5);
      unlockBadge('book-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');
      setFeedbackMsg(`You selected ${selectedLabel}. Look closely at geometry and color!`);
      setFeedbackExplanation(`Clue: ${challenge.tip}`);
      soundManager.speak(`Not ${selectedLabel}. Look closely at the sides and colors!`);
    }
  };

  const handleTryAgain = () => {
    setSelectedLabel(null);
    setFeedbackStatus('idle');
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
            style={{ width: `${((levelIndex + 1) / CHALLENGES.length) * 100}%` }}
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
          <Shapes className="w-3.5 h-3.5" />
          <span>Visual Recognition ({levelIndex + 1}/{CHALLENGES.length})</span>
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Colors & Shapes
        </h1>
      </div>

      {/* Prompt Banner */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 p-4 shadow-sm text-center my-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
          Challenge Task
        </span>
        <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
          {challenge.prompt}
        </h3>
      </div>

      {/* 2x2 Shapes Grid */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {challenge.items.map((item) => {
          const isSelected = selectedLabel === item.label;
          const isHidden = hiddenLabels.includes(item.label);

          if (isHidden) {
            return (
              <div
                key={item.label}
                className="h-28 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-300 font-bold text-xs select-none"
              >
                Eliminated
              </div>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => handleSelectItem(item)}
              className={`h-28 rounded-3xl border-2 p-3 flex flex-col items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200 scale-105 shadow-md'
                  : `${item.bg} hover:scale-[1.02]`
              }`}
            >
              <span className="text-5xl mb-1 animate-wiggle">{item.shape}</span>
              <span className="text-xs font-black text-slate-700">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rich Logical Feedback Card */}
      <AnswerFeedback
        status={feedbackStatus}
        message={feedbackMsg}
        explanation={feedbackExplanation}
        correctAnswerText={challenge.target}
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
            disabled={selectedLabel === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedLabel !== null
                ? 'btn-chunky-purple text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Confirm Selection</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Shape Genius!"
        subtitle={`Awesome! You found the ${challenge.target}!`}
        xpEarned={25}
        gemsEarned={5}
        onPlayAgain={() => {
          setSelectedLabel(null);
          setFeedbackStatus('idle');
          setShowCelebration(false);
        }}
        onContinue={handleNext}
      />
    </div>
  );
}
