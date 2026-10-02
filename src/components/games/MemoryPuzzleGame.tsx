'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

interface MemoryPuzzleGameProps {
  onClose: () => void;
}

interface CardItem {
  id: number;
  emoji: string;
  name: string;
}

const ICONS = [
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐮', name: 'Cow' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🍓', name: 'Strawberry' },
];

export default function MemoryPuzzleGame({ onClose }: MemoryPuzzleGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedNames, setMatchedNames] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize deck
  const resetGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => 0.5 - Math.random())
      .map((item, idx) => ({ ...item, id: idx }));
    setCards(deck);
    setFlippedIndices([]);
    setMatchedNames([]);
    setMoves(0);
    setShowCelebration(false);
    soundManager.speak('Find the matching pairs!');
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index)) return;
    const card = cards[index];
    if (matchedNames.includes(card.name)) return;

    soundManager.playPop(520);
    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards[nextFlipped[0]];
      const secondCard = cards[nextFlipped[1]];

      if (firstCard.name === secondCard.name) {
        // Matched!
        soundManager.playChime();
        soundManager.speak(`${firstCard.name} match!`);
        const nextMatched = [...matchedNames, firstCard.name];
        setMatchedNames(nextMatched);
        setFlippedIndices([]);

        if (nextMatched.length === ICONS.length) {
          addXP(40, 8);
          unlockBadge('star-1');
          setTimeout(() => setShowCelebration(true), 600);
        }
      } else {
        // Not matched
        soundManager.playError();
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
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
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex-1 bg-pink-100 rounded-full h-3.5 overflow-hidden p-0.5 max-w-[140px]">
          <div
            className="bg-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(matchedNames.length / ICONS.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full shadow-sm">
          <div className="w-3.5 h-3.5 rounded-sm bg-pink-500 flex items-center justify-center text-[9px] text-white font-bold">
            ★
          </div>
          <span className="font-extrabold text-xs text-pink-600">25</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="flex items-center justify-between mt-1 mb-3">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Memory Puzzle
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Flip & Match
          </h1>
        </div>
        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-sm text-xs font-black text-slate-700">
          Moves: {moves}
        </div>
      </div>

      {/* 4x3 Card Grid */}
      <div className="grid grid-cols-4 gap-2.5 my-auto">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedNames.includes(card.name);
          const isMatched = matchedNames.includes(card.name);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`h-24 rounded-2xl flex items-center justify-center text-3xl font-black transition-all duration-300 shadow-sm ${
                isMatched
                  ? 'bg-emerald-100 border-2 border-emerald-400 scale-95 opacity-90'
                  : isFlipped
                  ? 'bg-white border-2 border-purple-400 shadow-md rotate-y-180'
                  : 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white border-2 border-purple-400 active:scale-95'
              }`}
            >
              {isFlipped ? (
                <span className="animate-in zoom-in-50">{card.emoji}</span>
              ) : (
                <span className="text-2xl opacity-60">❓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Reset Button */}
      <div className="mt-auto mb-2 pt-3 flex gap-3">
        <button
          onClick={resetGame}
          className="w-full h-14 rounded-2xl bg-white border-2 border-slate-200 font-bold text-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset Puzzle</span>
        </button>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Puzzle Master!"
        subtitle={`You matched all pairs in ${moves} moves!`}
        xpEarned={40}
        gemsEarned={8}
        onPlayAgain={resetGame}
        onContinue={onClose}
      />
    </div>
  );
}
