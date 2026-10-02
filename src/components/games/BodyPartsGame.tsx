'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Heart, Sparkles } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface BodyPartsGameProps {
  onClose: () => void;
}

interface BodyQuestion {
  question: string;
  sense: string;
  icon: string;
  answer: string;
  options: string[];
  explanation: string;
  hint: string;
}

const QUESTIONS: BodyQuestion[] = [
  {
    question: 'Which body part do we use to SEE colors and read books?',
    sense: 'Sense of Sight',
    icon: '👀',
    answer: 'Eyes',
    options: ['Ears', 'Eyes', 'Nose', 'Feet'],
    explanation: 'Our eyes take in light so we can see friends and beautiful nature!',
    hint: 'Located right above our cheeks, they blink and let you see all rainbow colors!',
  },
  {
    question: 'Which body part do we use to HEAR sweet music and bird songs?',
    sense: 'Sense of Hearing',
    icon: '👂',
    answer: 'Ears',
    options: ['Hands', 'Mouth', 'Ears', 'Knees'],
    explanation: 'Our ears catch sound vibrations to help us listen to words and melodies!',
    hint: 'One on each side of our head, designed to catch gentle sounds and music!',
  },
  {
    question: 'Which body part do we use to SMELL fresh baked cookies and roses?',
    sense: 'Sense of Smell',
    icon: '👃',
    answer: 'Nose',
    options: ['Nose', 'Elbow', 'Eyes', 'Hair'],
    explanation: 'Our nose smells wonderful scents and helps us breathe clean air!',
    hint: 'Right in the middle of our face with two nostrils for breathing and smelling!',
  },
  {
    question: 'Which body part do we use to HOLD a pencil and paint pictures?',
    sense: 'Sense of Touch',
    icon: '🖐️',
    answer: 'Hands & Fingers',
    options: ['Feet', 'Hands & Fingers', 'Ears', 'Shoulders'],
    explanation: 'Our hands have 10 nimble fingers to create, hold, and build things!',
    hint: 'We use them to clap, give high fives, and hold crayons!',
  },
  {
    question: 'Which body part helps us RUN fast and jump high into the air?',
    sense: 'Movement',
    icon: '🦶',
    answer: 'Feet & Legs',
    options: ['Hands', 'Feet & Legs', 'Nose', 'Ears'],
    explanation: 'Strong feet and legs help us run, skip, dance, and play sports!',
    hint: 'Connected from your hips all the way to your toes to carry you everywhere!',
  },
];

export default function BodyPartsGame({ onClose }: BodyPartsGameProps) {
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
    soundManager.speak(current.question);
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
    soundManager.speak(`50-50 Lifeline! Eliminated 2 wrong body parts.`);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === current.answer) {
      soundManager.playChime();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Super anatomy! That is the ${current.answer}!`);
      setFeedbackExplanation(current.explanation);
      soundManager.speak(`Super anatomy! ${current.explanation}`);
      addXP(25, 5);
      unlockBadge('star-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');
      setFeedbackMsg(`Not ${selectedOption}! Think about which organ carries out this function.`);
      setFeedbackExplanation(`Sense hint: ${current.hint}`);
      soundManager.speak(`Not ${selectedOption}. ${current.hint}`);
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
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
          <span>🖐️</span>
          <span>Anatomy & 5 Senses ({qIndex + 1}/{QUESTIONS.length})</span>
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Body Parts & Senses
        </h1>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl border-2 border-emerald-200 p-5 shadow-sm flex flex-col items-center justify-center min-h-[200px] my-auto text-center">
        <span className="text-xs font-black text-emerald-800 bg-emerald-100/90 px-3 py-0.5 rounded-full mb-2">
          {current.sense}
        </span>
        <div className="text-6xl mb-2 animate-wiggle">
          {current.icon}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
          {current.question}
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
              className={`h-14 rounded-2xl font-black text-sm sm:text-base border-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
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
                ? 'btn-chunky-green text-white shadow-md'
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
        title="Body & Senses Whiz!"
        subtitle={current.explanation}
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
