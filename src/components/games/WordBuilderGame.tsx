'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Lightbulb, Check } from 'lucide-react';
import Image from 'next/image';
import CelebrationModal from '@/components/CelebrationModal';

interface WordBuilderGameProps {
  onClose: () => void;
}

interface WordChallenge {
  word: string;
  image: string;
  sound: string;
  letters: string[];
}

const CHALLENGES: WordChallenge[] = [
  {
    word: 'COW',
    image: '/images/cow.jpg',
    sound: 'Moo! Cow!',
    letters: ['A', 'H', 'W', 'D', 'E', 'C', 'O'],
  },
  {
    word: 'ZEBRA',
    image: '/images/zebra.jpg',
    sound: 'Neigh! Zebra!',
    letters: ['A', 'O', 'Z', 'I', 'E', 'R', 'B', 'U', 'F', 'T'],
  },
  {
    word: 'LION',
    image: '/images/lion.jpg',
    sound: 'Roar! Lion!',
    letters: ['L', 'I', 'O', 'N', 'K', 'S', 'P', 'E'],
  },
];

export default function WordBuilderGame({ onClose }: WordBuilderGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [levelIndex, setLevelIndex] = useState(0);
  const challenge = CHALLENGES[levelIndex];

  const targetLetters = challenge.word.split('');
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  // Initialize board for current challenge
  useEffect(() => {
    setPlacedLetters([]);
    // Shuffle available letters
    const shuffled = [...challenge.letters].sort(() => 0.5 - Math.random());
    setAvailableLetters(shuffled);
    soundManager.speak(`Build the word for this picture!`);
  }, [levelIndex, challenge]);

  // Tap to place letter from keyboard
  const handleSelectLetter = (letter: string, index: number) => {
    if (placedLetters.length >= targetLetters.length) return;

    soundManager.playPop(480);
    soundManager.speak(letter, 1.2, 1.2);
    setPlacedLetters([...placedLetters, letter]);

    // Remove letter from available
    const nextAvailable = [...availableLetters];
    nextAvailable.splice(index, 1);
    setAvailableLetters(nextAvailable);
    setIsWrong(false);
  };

  // Tap to remove letter from placed slot back to keyboard
  const handleRemoveLetter = (index: number) => {
    if (index >= placedLetters.length) return;

    soundManager.playPop(360);
    const removedLetter = placedLetters[index];
    const nextPlaced = [...placedLetters];
    nextPlaced.splice(index, 1);
    setPlacedLetters(nextPlaced);

    // Add back to available
    setAvailableLetters([...availableLetters, removedLetter]);
    setIsWrong(false);
  };

  // Hint function: automatically places next correct letter
  const handleUseHint = () => {
    if (hintsLeft <= 0) return;
    const nextIndex = placedLetters.length;
    if (nextIndex >= targetLetters.length) return;

    const correctLetter = targetLetters[nextIndex];
    // Find correct letter in available
    const availIdx = availableLetters.indexOf(correctLetter);
    if (availIdx !== -1) {
      soundManager.playSparkle();
      setHintsLeft(prev => prev - 1);
      handleSelectLetter(correctLetter, availIdx);
    }
  };

  const handleCheck = () => {
    const builtWord = placedLetters.join('');
    if (builtWord === challenge.word) {
      soundManager.playChime();
      soundManager.speak(`${challenge.word}! ${challenge.sound}`);
      addXP(30, 5);
      unlockBadge('builder-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      setIsWrong(true);
      soundManager.speak('Try again!');
    }
  };

  const handleNextChallenge = () => {
    setShowCelebration(false);
    setLevelIndex((prev) => (prev + 1) % CHALLENGES.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6ED] px-4 py-3 w-full max-w-xl mx-auto">
      {/* Top Bar */}
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
            style={{ width: `${((levelIndex + 1) / CHALLENGES.length) * 100}%` }}
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
      <div className="text-left mt-1 mb-2">
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          Spelling
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Build the word
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Build the word for this picture
        </p>
      </div>

      {/* 3D Cute Animal Illustration */}
      <div className="relative w-full aspect-square max-h-[220px] rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-md bg-white flex items-center justify-center mx-auto my-2">
        <Image
          src={challenge.image}
          alt={challenge.word}
          fill
          className="object-contain p-2"
          priority
        />
        <button
          onClick={() => soundManager.speak(challenge.word)}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
          title="Pronounce"
        >
          🔊
        </button>
      </div>

      {/* Word Slots Row */}
      <div className="flex items-center justify-center gap-2.5 my-3">
        {targetLetters.map((_, idx) => {
          const letter = placedLetters[idx];
          return (
            <button
              key={idx}
              onClick={() => handleRemoveLetter(idx)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black transition-all ${
                letter
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300 shadow-sm animate-in zoom-in-75'
                  : 'bg-white border-2 border-dashed border-slate-300 text-transparent'
              } ${isWrong ? 'border-red-400 bg-red-50 text-red-600 animate-shake' : ''}`}
            >
              {letter || ''}
            </button>
          );
        })}
      </div>

      {/* Available Letter Tiles Keyboard */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-3 my-2 shadow-inner">
        <div className="flex flex-wrap justify-center gap-2">
          {availableLetters.map((letter, idx) => (
            <button
              key={`${letter}-${idx}`}
              onClick={() => handleSelectLetter(letter, idx)}
              className="w-11 h-12 rounded-xl bg-white border border-slate-200 font-black text-lg text-slate-800 shadow-chunky-sm active:scale-90 hover:bg-slate-100 transition-all"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Controls: Hint & Check */}
      <div className="flex items-center gap-3 mt-auto mb-2 pt-2">
        <button
          onClick={handleUseHint}
          disabled={hintsLeft <= 0}
          className="h-14 px-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center gap-1.5 font-bold text-slate-700 active:scale-95 disabled:opacity-50 transition-all"
        >
          <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span className="text-xs">Hint</span>
          <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center">
            {hintsLeft}
          </span>
        </button>

        <button
          onClick={handleCheck}
          disabled={placedLetters.length < targetLetters.length}
          className={`flex-1 h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
            placedLetters.length === targetLetters.length
              ? 'btn-chunky-blue text-white shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Check</span>
        </button>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Word Master!"
        subtitle={`You built the word "${challenge.word}"!`}
        xpEarned={30}
        gemsEarned={5}
        onPlayAgain={() => {
          setPlacedLetters([]);
          setAvailableLetters([...challenge.letters].sort(() => 0.5 - Math.random()));
          setShowCelebration(false);
        }}
        onContinue={handleNextChallenge}
      />
    </div>
  );
}
