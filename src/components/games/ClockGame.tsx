'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Clock, Heart, Sparkles } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface ClockGameProps {
  onClose: () => void;
}

interface ClockChallenge {
  prompt: string;
  hour: number;
  minute: number;
  displayTime: string;
  options: string[];
  routineIcon: string;
  clue: string;
}

const CHALLENGES: ClockChallenge[] = [
  {
    prompt: 'What time does the clock show?',
    hour: 3,
    minute: 0,
    displayTime: '3:00',
    options: ['3:00', '12:15', '6:00', '9:00'],
    routineIcon: '🕒',
    clue: 'Short blue hour hand points straight at 3, long purple hand is at 12 (00 minutes)!',
  },
  {
    prompt: 'Wake up and eat healthy breakfast! What time is it?',
    hour: 8,
    minute: 0,
    displayTime: '8:00 AM',
    options: ['8:00 AM', '2:00 PM', '11:00 PM', '5:30 AM'],
    routineIcon: '🥣',
    clue: 'Morning breakfast time! Short hand points at 8 in the bright morning (AM).',
  },
  {
    prompt: 'Look at the hour and minute hands. What time is it?',
    hour: 7,
    minute: 30,
    displayTime: '7:30',
    options: ['7:00', '7:30', '6:30', '8:00'],
    routineIcon: '⏰',
    clue: 'The long purple minute hand is at 6 (30 minutes past the hour)!',
  },
  {
    prompt: 'Yummy lunchtime with family! What time is it?',
    hour: 12,
    minute: 0,
    displayTime: '12:00 PM',
    options: ['10:00 AM', '12:00 PM', '4:00 PM', '1:30 PM'],
    routineIcon: '🥪',
    clue: 'Midday noon lunch! Both hands point straight up towards the 12!',
  },
  {
    prompt: 'Bedtime for sweet dreams! What time does the clock show?',
    hour: 9,
    minute: 0,
    displayTime: '9:00 PM',
    options: ['9:00 PM', '12:00 AM', '6:00 PM', '3:00 PM'],
    routineIcon: '🌙',
    clue: 'Night bedtime! Short blue hand points at 9 at night (PM).',
  },
];

export default function ClockGame({ onClose }: ClockGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [levelIndex, setLevelIndex] = useState(0);
  const current = CHALLENGES[levelIndex];
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

  // Hour hand angle: 30 deg per hour + 0.5 deg per minute
  const hourAngle = (current.hour % 12) * 30 + current.minute * 0.5;
  // Minute hand angle: 6 deg per minute
  const minuteAngle = current.minute * 6;

  useEffect(() => {
    setSelectedOption(null);
    setFeedbackStatus('idle');
    setHiddenOptions([]);
    setHintUsed(false);
    soundManager.speak(current.prompt);
  }, [levelIndex, current]);

  const handleSelect = (opt: string) => {
    if (feedbackStatus === 'correct') return;
    soundManager.playPop(480);
    setSelectedOption(opt);
    soundManager.speak(opt);
  };

  const handleUse5050 = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrong = current.options.filter((o) => o !== current.displayTime);
    const toHide = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    soundManager.speak(`50-50 Lifeline! Eliminated 2 clock times.`);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === current.displayTime) {
      soundManager.playChime();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Tick-tock! Perfect! It is indeed ${current.displayTime}!`);
      setFeedbackExplanation(current.clue);
      soundManager.speak(`Tick-tock! Perfect! It is ${current.displayTime}!`);
      addXP(25, 5);
      unlockBadge('math-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');
      setFeedbackMsg(`Not ${selectedOption}! Look closely at the short blue and long purple hands.`);
      setFeedbackExplanation(`Clock reading tip: ${current.clue}`);
      soundManager.speak(`Not ${selectedOption}. Look at the short hour hand and long minute hand!`);
    }
  };

  const handleTryAgain = () => {
    setSelectedOption(null);
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
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Time & Daily Routines ({levelIndex + 1}/{CHALLENGES.length})</span>
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Clock Master
        </h1>
        <p className="text-xs font-semibold text-slate-500">{current.prompt}</p>
      </div>

      {/* Interactive Analog Clock Face */}
      <div className="bg-white rounded-3xl border-2 border-blue-200 p-5 shadow-sm my-auto flex flex-col items-center justify-center">
        <div className="relative w-52 h-52 rounded-full border-8 border-amber-300 bg-amber-50/50 shadow-inner flex items-center justify-center">
          {/* Hour Numbers 1 to 12 */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = 78;
            const x = Math.sin(angle) * r;
            const y = -Math.cos(angle) * r;
            return (
              <span
                key={num}
                className="absolute font-black text-xs text-slate-700 select-none"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {num}
              </span>
            );
          })}

          {/* Clock Center Pin */}
          <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-400 z-20" />

          {/* Hour Hand (Thick & shorter, Blue) */}
          <div
            className="absolute z-10 w-2 h-12 bg-blue-600 rounded-full origin-bottom"
            style={{
              bottom: '50%',
              transform: `rotate(${hourAngle}deg)`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />

          {/* Minute Hand (Longer, Purple) */}
          <div
            className="absolute z-10 w-1.5 h-18 bg-purple-600 rounded-full origin-bottom"
            style={{
              bottom: '50%',
              transform: `rotate(${minuteAngle}deg)`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        </div>

        {/* Clue Icon Badge */}
        <div className="mt-3 flex items-center gap-2 bg-amber-100/80 px-3.5 py-1 rounded-full text-xs font-bold text-amber-900 shadow-sm">
          <span>{current.routineIcon}</span>
          <span>Daily Routine Clue</span>
        </div>
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
              className={`h-14 rounded-2xl font-black text-lg border-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
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
        correctAnswerText={current.displayTime}
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
                ? 'btn-chunky-blue text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Check Time</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Time Master!"
        subtitle={`Tick-tock! The clock shows ${current.displayTime}!`}
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
