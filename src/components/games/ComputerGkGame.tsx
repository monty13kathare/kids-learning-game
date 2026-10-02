'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

interface ComputerGkGameProps {
  onClose: () => void;
}

interface Question {
  title: string;
  icon: string;
  answer: string;
  options: string[];
  funFact: string;
}

const QUESTIONS: Question[] = [
  {
    title: 'Which part is called the "Brain of the Computer"?',
    icon: '🧠',
    answer: 'CPU',
    options: ['Monitor', 'CPU', 'Mouse', 'Keyboard'],
    funFact: 'CPU stands for Central Processing Unit and executes all thinking tasks!',
  },
  {
    title: 'What device do we use to type letters and numbers?',
    icon: '⌨️',
    answer: 'Keyboard',
    options: ['Speaker', 'Printer', 'Keyboard', 'Webcam'],
    funFact: 'Keyboards have special keys like Spacebar, Enter, and ABC letters!',
  },
  {
    title: 'What device do we click and move to point on the screen?',
    icon: '🖱️',
    answer: 'Mouse',
    options: ['Mouse', 'Microphone', 'Headphones', 'Battery'],
    funFact: 'A computer mouse got its name because the cord looks like a little mouse tail!',
  },
  {
    title: 'What smart machine can follow computer code instructions to do tasks?',
    icon: '🤖',
    answer: 'Robot',
    options: ['Toaster', 'Robot', 'Clock', 'Flashlight'],
    funFact: 'Robots are built by engineers and programmed with computer languages!',
  },
  {
    title: 'What is the giant world network connecting computers everywhere?',
    icon: '🌐',
    answer: 'Internet',
    options: ['Television', 'Radio', 'Internet', 'Walkie-Talkie'],
    funFact: 'The Internet lets us learn, watch videos, and talk to people across the globe!',
  },
];

import AnswerFeedback from '@/components/AnswerFeedback';
import { Heart, Volume2, Lightbulb } from 'lucide-react';

export default function ComputerGkGame({ onClose }: ComputerGkGameProps) {
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
    soundManager.speak(current.title);
  }, [qIndex, current]);

  const handleSelect = (opt: string) => {
    if (eliminatedOptions.includes(opt)) return;
    try { soundManager.playPop(480); } catch {}
    setSelectedOption(opt);
    setFeedbackStatus('idle');
    soundManager.speak(opt);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === current.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFeedbackStatus('correct');
      setFeedbackMessage(`Spot on! "${current.answer}" is correct!`);
      setFeedbackTip(current.funFact);

      try {
        soundManager.playChime();
        soundManager.speak(`Great job! ${current.funFact}`);
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
      setFeedbackMessage(`"${selectedOption}" is not the right device.`);
      setFeedbackTip(
        current.answer === 'CPU'
          ? 'Think of the internal chip that processes calculations, not the display or input devices!'
          : current.answer === 'Keyboard'
          ? 'Think of the board with keys that you press to type!'
          : current.answer === 'Mouse'
          ? 'Think of the palm-sized handheld pointing gadget with left & right click!'
          : current.answer === 'Robot'
          ? 'Think of automated mechanical machines with sensors!'
          : 'Think of the worldwide web (WWW) connection!'
      );

      try {
        soundManager.playError();
        soundManager.speak(`Not quite. Try again, young coder!`);
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
      soundManager.speak(`50-50 Hint! Two incorrect devices removed.`);
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
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Technology & Computers • {qIndex + 1}/{QUESTIONS.length}
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Computer GK
          </h1>
        </div>

        <button
          type="button"
          onClick={() => soundManager.speak(current.title)}
          className="w-9 h-9 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs hover:bg-blue-50 active:scale-90 transition-transform cursor-pointer"
          title="Read Question"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-3xl border-2 border-blue-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[190px] my-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-white border border-blue-200 shadow-sm flex items-center justify-center text-5xl mb-3 animate-wiggle">
          {current.icon}
        </div>
        <h3 className="text-xl font-black text-slate-800 leading-snug">
          {current.title}
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="space-y-2 my-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Select device / answer:
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
        title="Junior Tech Whiz!"
        subtitle={current.funFact}
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
