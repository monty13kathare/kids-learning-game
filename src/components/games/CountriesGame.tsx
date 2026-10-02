'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check, Heart, Sparkles, Globe } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface CountriesGameProps {
  onClose: () => void;
}

interface CountryQuestion {
  country: string;
  flag: string;
  landmark: string;
  clue: string;
  tip: string;
  options: string[];
}

const QUESTIONS: CountryQuestion[] = [
  {
    country: 'India',
    flag: '🇮🇳',
    landmark: 'Taj Mahal',
    clue: 'Known for the majestic Taj Mahal, Tigers, and colorful festivals!',
    tip: 'Tricolor flag with saffron on top, white in middle with Navy Ashoka Chakra, and green at bottom!',
    options: ['India', 'Japan', 'Brazil', 'France'],
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    landmark: 'Mount Fuji',
    clue: 'Known as the Land of the Rising Sun, with bullet trains and cherry blossoms!',
    tip: 'A crisp white flag featuring a bright red circular sun right in the center!',
    options: ['Canada', 'Japan', 'Australia', 'Egypt'],
  },
  {
    country: 'United States',
    flag: '🇺🇸',
    landmark: 'Statue of Liberty',
    clue: 'Home to the famous green Statue of Liberty in New York harbor!',
    tip: 'The Stars and Stripes: 50 white stars on a blue corner with 13 red and white stripes!',
    options: ['United States', 'Germany', 'Italy', 'India'],
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    landmark: 'Sydney Opera House',
    clue: 'Famous for hopping Kangaroos, cuddly Koalas, and the Opera House!',
    tip: 'Dark blue flag with the Southern Cross constellation stars and the Union Jack in the corner!',
    options: ['Australia', 'Spain', 'Mexico', 'South Africa'],
  },
  {
    country: 'France',
    flag: '🇫🇷',
    landmark: 'Eiffel Tower',
    clue: 'Home of the glowing Eiffel Tower in Paris and yummy croissants!',
    tip: 'Vertical tricolor flag with three equal bands of Blue, White, and Red!',
    options: ['Greece', 'France', 'India', 'China'],
  },
  {
    country: 'Egypt',
    flag: '🇪🇬',
    landmark: 'Giza Pyramids & Sphinx',
    clue: 'Home to ancient giant pyramids, mummies, and the mighty River Nile!',
    tip: 'Horizontal stripes of Red, White, and Black with the golden Eagle of Saladin in center!',
    options: ['Egypt', 'Canada', 'Brazil', 'Japan'],
  },
];

export default function CountriesGame({ onClose }: CountriesGameProps) {
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
    soundManager.speak(`Which country is represented by this flag? ${current.clue}`);
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
    const wrong = current.options.filter((o) => o !== current.country);
    const toHide = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    soundManager.speak(`50-50 Lifeline! Eliminated 2 wrong countries.`);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === current.country) {
      soundManager.playChime();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Splendid! That is indeed ${current.country}!`);
      setFeedbackExplanation(`Landmark: ${current.landmark}. ${current.tip}`);
      soundManager.speak(`Fantastic! This is ${current.country}! ${current.clue}`);
      addXP(30, 5);
      unlockBadge('star-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');
      setFeedbackMsg(`Not ${selectedOption}! Look at the flag colors carefully.`);
      setFeedbackExplanation(`Clue: ${current.tip}`);
      soundManager.speak(`Not ${selectedOption}. Look at the colors and symbols on the flag!`);
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
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" />
          <span>Geography & World ({qIndex + 1}/{QUESTIONS.length})</span>
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Countries & Flags
        </h1>
      </div>

      {/* Flag Display Card */}
      <div className="bg-white rounded-3xl border-2 border-blue-200 p-5 shadow-sm flex flex-col items-center justify-center min-h-[200px] my-auto text-center">
        <div className="text-7xl sm:text-8xl mb-2 drop-shadow-md animate-bounce">
          {current.flag}
        </div>
        <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-1">
          Landmark: {current.landmark}
        </span>
        <p className="text-xs font-semibold text-slate-600 max-w-xs mt-1">
          {current.clue}
        </p>
      </div>

      {/* 4 Choices Grid */}
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
        correctAnswerText={current.country}
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
            <span>Check Answer</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Globe Trotter!"
        subtitle={`Splendid! That is the flag of ${current.country}!`}
        xpEarned={30}
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
