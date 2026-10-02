'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Sparkles, Heart } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface IndianCultureGameProps {
  onClose: () => void;
}

interface HeritageItem {
  title: string;
  category: string;
  icon: string;
  answer: string;
  options: string[];
  fact: string;
  hint: string;
}

const ITEMS: HeritageItem[] = [
  {
    title: "What is India's National Animal?",
    category: 'National Symbol',
    icon: '🐅',
    answer: 'Royal Bengal Tiger',
    options: ['Lion', 'Royal Bengal Tiger', 'Elephant', 'Leopard'],
    fact: 'The Tiger symbolizes strength, grace, and incredible agility!',
    hint: 'Look for the majestic predator with striking black stripes on golden-orange fur!',
  },
  {
    title: "What is India's National Bird?",
    category: 'National Symbol',
    icon: '🦚',
    answer: 'Peacock',
    options: ['Parrot', 'Eagle', 'Peacock', 'Flamingo'],
    fact: 'The Indian Peacock is famous for its breathtaking colorful feathers and rain dance!',
    hint: 'A royal bird with shimmering sapphire neck feathers and a huge fan of eye-spotted plumes!',
  },
  {
    title: "Which festival is called the Festival of Lights?",
    category: 'Celebrations',
    icon: '🪔',
    answer: 'Diwali',
    options: ['Holi', 'Diwali', 'Eid', 'Navratri'],
    fact: 'People light beautiful clay diyas and share delicious sweets during Diwali!',
    hint: 'Celebrated on the darkest night of Kartik month by lighting clay oil lamps (diyas)!',
  },
  {
    title: "What is India's National Flower?",
    category: 'National Symbol',
    icon: '🪷',
    answer: 'Lotus',
    options: ['Rose', 'Sunflower', 'Lotus', 'Jasmine'],
    fact: 'The Lotus symbolizes purity, beauty, and auspicious beginnings.',
    hint: 'An elegant pink and white sacred water blossom that blooms untouched in ponds!',
  },
  {
    title: 'Which joyful festival is celebrated with vibrant colors?',
    category: 'Celebrations',
    icon: '🎨',
    answer: 'Holi',
    options: ['Holi', 'Diwali', 'Baisakhi', 'Pongal'],
    fact: 'Holi celebrates the arrival of spring with colorful powders and water play!',
    hint: 'Friends and families gently throw organic gulal and splash color to celebrate spring!',
  },
  {
    title: "What is India's National Fruit?",
    category: 'National Symbol',
    icon: '🥭',
    answer: 'Mango',
    options: ['Apple', 'Mango', 'Banana', 'Orange'],
    fact: 'The Mango is celebrated as the sweet "King of Fruits" across India!',
    hint: 'The golden, sweet, juicy summer fruit loved by everyone from Kashmir to Kanyakumari!',
  },
];

export default function IndianCultureGame({ onClose }: IndianCultureGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [index, setIndex] = useState(0);
  const current = ITEMS[index];
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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
    setSelectedAnswer(null);
    setFeedbackStatus('idle');
    setHiddenOptions([]);
    setHintUsed(false);
    soundManager.speak(current.title);
  }, [index, current]);

  const handleSelect = (opt: string) => {
    if (feedbackStatus === 'correct') return;
    soundManager.playPop(480);
    setSelectedAnswer(opt);
    soundManager.speak(opt);
  };

  const handleUse5050 = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrong = current.options.filter((o) => o !== current.answer);
    const toHide = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    soundManager.speak(`50-50 Lifeline! Removed 2 options.`);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === current.answer) {
      soundManager.playChime();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Namaste! That is correct: ${current.answer}!`);
      setFeedbackExplanation(current.fact);
      soundManager.speak(`Namaste! That is right! ${current.fact}`);
      addXP(35, 5);
      unlockBadge('animal-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');
      setFeedbackMsg(`Not ${selectedAnswer}! Think about Indian heritage and traditions.`);
      setFeedbackExplanation(`Clue: ${current.hint}`);
      soundManager.speak(`Not ${selectedAnswer}. ${current.hint}`);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setFeedbackStatus('idle');
  };

  const handleNext = () => {
    setShowCelebration(false);
    setFeedbackStatus('idle');
    setIndex((prev) => (prev + 1) % ITEMS.length);
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
            style={{ width: `${((index + 1) / ITEMS.length) * 100}%` }}
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
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
          <span>🇮🇳</span>
          <span>Incredible India ({index + 1}/{ITEMS.length})</span>
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Indian Culture & Heritage
        </h1>
      </div>

      {/* Culture Question Card */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-3xl border-2 border-orange-200 p-5 shadow-sm flex flex-col items-center justify-center min-h-[200px] my-auto text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-white border border-orange-200 shadow-sm flex items-center justify-center text-5xl mb-2 animate-wiggle">
          {current.icon}
        </div>
        <span className="text-[11px] font-extrabold text-orange-700 uppercase tracking-wider bg-orange-100/90 px-2.5 py-0.5 rounded-full mb-1">
          {current.category}
        </span>
        <h3 className="text-xl font-black text-slate-800 leading-snug">
          {current.title}
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {current.options.map((opt) => {
          const isSelected = selectedAnswer === opt;
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
            disabled={selectedAnswer === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedAnswer !== null
                ? 'btn-chunky-green text-white shadow-md'
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
        title="Incredible Explorer!"
        subtitle={current.fact}
        xpEarned={35}
        gemsEarned={5}
        onPlayAgain={() => {
          setSelectedAnswer(null);
          setFeedbackStatus('idle');
          setShowCelebration(false);
        }}
        onContinue={handleNext}
      />
    </div>
  );
}
