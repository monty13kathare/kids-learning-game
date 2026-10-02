'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

interface MatchLettersGameProps {
  onClose: () => void;
}

interface PictureItem {
  id: string;
  name: string;
  emoji: string;
  letter: string;
}

const ITEMS: PictureItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', letter: 'A' },
  { id: 'ball', name: 'Ball', emoji: '⚽', letter: 'B' },
  { id: 'cat', name: 'Cat', emoji: '🐱', letter: 'C' },
  { id: 'duck', name: 'Duck', emoji: '🦆', letter: 'D' },
];

export default function MatchLettersGame({ onClose }: MatchLettersGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  const availableLetters = ['A', 'B', 'C', 'D'];

  const handleCardClick = (item: PictureItem) => {
    soundManager.playPop(480);
    soundManager.speak(`${item.letter} for ${item.name}!`);

    // Assign selected letter to card
    const nextAnswers = { ...answers, [item.id]: selectedLetter };
    setAnswers(nextAnswers);

    // Auto move selected letter to next unassigned letter
    const assignedLetters = Object.values(nextAnswers);
    const nextUnassigned = availableLetters.find(l => !assignedLetters.includes(l));
    if (nextUnassigned) {
      setSelectedLetter(nextUnassigned);
    }
  };

  const handleSelectLetterChoice = (letter: string) => {
    soundManager.playPop(520);
    soundManager.speak(`Letter ${letter}`);
    setSelectedLetter(letter);
  };

  const handleCheck = () => {
    // Verify answers
    const allCorrect = ITEMS.every(item => answers[item.id] === item.letter);
    if (allCorrect) {
      soundManager.playChime();
      addXP(30, 5);
      unlockBadge('book-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      soundManager.speak('Almost there! Try placing the matching letters again.');
    }
  };

  const allAssigned = Object.keys(answers).length === ITEMS.length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6ED] px-4 py-3 w-full max-w-xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90 transition-transform"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Pink Progress Bar Pill */}
        <div className="flex-1 bg-pink-100 rounded-full h-3.5 overflow-hidden p-0.5 max-w-[140px]">
          <div
            className="bg-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(answers).length / ITEMS.length) * 100}%` }}
          />
        </div>

        {/* Gems Badge */}
        <div className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full shadow-sm">
          <div className="w-3.5 h-3.5 rounded-sm bg-pink-500 flex items-center justify-center text-[9px] text-white font-bold">
            ★
          </div>
          <span className="font-extrabold text-xs text-pink-600">25</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-left mt-1 mb-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Match & Learn
        </span>
        <h1 className="text-xl font-black text-slate-800 tracking-tight leading-snug">
          Match the picture with the correct letter
        </h1>
      </div>

      {/* 2x2 Picture Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5 my-auto">
        {ITEMS.map((item) => {
          const assigned = answers[item.id];
          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="bg-white rounded-3xl border-2 border-slate-200/90 p-4 shadow-sm flex flex-col items-center justify-center hover:border-blue-400 active:scale-95 transition-all"
            >
              {/* Picture Emoji */}
              <div className="w-20 h-20 rounded-2xl bg-amber-50/60 flex items-center justify-center text-5xl mb-3 shadow-inner">
                {item.emoji}
              </div>

              {/* Slot Below */}
              <div
                className={`w-full max-w-[110px] h-11 rounded-xl border-2 border-dashed flex items-center justify-center font-black text-lg transition-all ${
                  assigned
                    ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm'
                    : 'border-slate-300 text-slate-300'
                }`}
              >
                {assigned || '...'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Letter Choices [A] [B] [C] [D] */}
      <div className="mt-4 mb-3">
        <div className="text-center text-xs font-bold text-slate-500 mb-2">
          Tap a letter, then tap the picture:
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {availableLetters.map((letter) => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => handleSelectLetterChoice(letter)}
                className={`h-14 rounded-2xl font-black text-xl border-2 transition-all shadow-chunky-sm ${
                  isSelected
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105 shadow-md'
                    : 'bg-white border-slate-200 text-slate-800 active:scale-95'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-auto mb-2">
        <button
          onClick={handleCheck}
          disabled={!allAssigned}
          className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
            allAssigned ? 'btn-chunky-blue text-white shadow-md' : 'bg-slate-200 text-slate-400'
          }`}
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Continue</span>
        </button>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Phenomenal Phonics!"
        subtitle="You matched all the pictures to their starting letters!"
        xpEarned={30}
        gemsEarned={5}
        onPlayAgain={() => {
          setAnswers({});
          setSelectedLetter('A');
          setShowCelebration(false);
        }}
        onContinue={onClose}
      />
    </div>
  );
}
