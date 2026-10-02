'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check } from 'lucide-react';
import Image from 'next/image';
import CelebrationModal from '@/components/CelebrationModal';

interface MatchItGameProps {
  onClose: () => void;
}

interface MatchPair {
  id: string;
  name: string;
  image?: string;
  emoji: string;
  sound: string;
}

const PAIRS: MatchPair[] = [
  { id: 'lion', name: 'Lion', image: '/images/lion.jpg', emoji: '🦁', sound: 'Roar!' },
  { id: 'elephant', name: 'Elephant', image: '/images/elephant.jpg', emoji: '🐘', sound: 'Trumpet!' },
  { id: 'panda', name: 'Panda', emoji: '🐼', sound: 'Panda eats bamboo!' },
  { id: 'fox', name: 'Fox', emoji: '🦊', sound: 'What does the fox say?' },
];

export default function MatchItGame({ onClose }: MatchItGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // { animalId: nameId }
  const [showCelebration, setShowCelebration] = useState(false);

  // Scrambled names for right column
  const [shuffledNames] = useState<string[]>(() => {
    return ['Lion', 'Elephant', 'Panda', 'Fox'].sort(() => 0.5 - Math.random());
  });

  const handleSelectLeft = (id: string) => {
    soundManager.playPop(440);
    setSelectedLeft(id);
    const item = PAIRS.find(p => p.id === id);
    if (item) soundManager.speak(item.name);
  };

  const handleSelectRight = (name: string) => {
    if (!selectedLeft) return;

    soundManager.playPop(520);
    const correctPair = PAIRS.find(p => p.id === selectedLeft);

    if (correctPair && correctPair.name.toLowerCase() === name.toLowerCase()) {
      // Correct Match!
      soundManager.playChime();
      soundManager.speak(`${name}! Good job!`);
      const nextMatches = { ...matches, [selectedLeft]: name };
      setMatches(nextMatches);
      setSelectedLeft(null);

      // Check if all 4 are matched
      if (Object.keys(nextMatches).length === PAIRS.length) {
        addXP(35, 5);
        unlockBadge('animal-1');
        setTimeout(() => setShowCelebration(true), 600);
      }
    } else {
      // Wrong match
      soundManager.playError();
      soundManager.speak('Try another one!');
      setSelectedLeft(null);
    }
  };

  const isMatched = (id: string) => !!matches[id];
  const isRightMatched = (name: string) => Object.values(matches).includes(name);

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
            style={{ width: `${(Object.keys(matches).length / PAIRS.length) * 100}%` }}
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
      <div className="text-left mt-1 mb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Match It
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Match the animals to their names
        </p>
      </div>

      {/* Matching Columns Area */}
      <div className="flex-1 flex flex-col justify-center gap-3 py-2">
        {PAIRS.map((pair, idx) => {
          const matchedName = matches[pair.id];
          const isSelected = selectedLeft === pair.id;
          const correspondingRightName = shuffledNames[idx];
          const isThisRightMatched = isRightMatched(correspondingRightName);

          return (
            <div key={pair.id} className="flex items-center justify-between gap-3">
              {/* Left Column: Animal Card */}
              <button
                onClick={() => handleSelectLeft(pair.id)}
                disabled={isMatched(pair.id)}
                className={`relative flex items-center justify-center w-20 h-20 rounded-2xl border-2 transition-all shadow-sm ${
                  isMatched(pair.id)
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                    : isSelected
                    ? 'bg-purple-100 border-purple-500 scale-105 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 active:scale-95'
                }`}
              >
                {pair.image ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                    <Image src={pair.image} alt={pair.name} fill className="object-cover" />
                  </div>
                ) : (
                  <span className="text-4xl">{pair.emoji}</span>
                )}

                {/* Left Connector Node */}
                <span
                  className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    isMatched(pair.id) ? 'bg-emerald-500' : isSelected ? 'bg-purple-500 ring-2 ring-purple-300' : 'bg-slate-300'
                  }`}
                />
              </button>

              {/* Connecting Bridge Indicator */}
              <div className="flex-1 flex items-center justify-center px-1">
                {isMatched(pair.id) && matchedName === correspondingRightName ? (
                  <div className="w-full h-1 bg-emerald-400 rounded-full animate-in zoom-in-50" />
                ) : (
                  <div className="w-full border-b border-dashed border-slate-300" />
                )}
              </div>

              {/* Right Column: Name Card */}
              <button
                onClick={() => handleSelectRight(correspondingRightName)}
                disabled={isThisRightMatched}
                className={`relative flex items-center justify-center w-36 h-16 rounded-2xl border-2 font-black text-base transition-all shadow-sm ${
                  isThisRightMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200'
                    : selectedLeft
                    ? 'bg-white border-blue-400 text-slate-800 hover:bg-blue-50 active:scale-95'
                    : 'bg-white border-slate-200 text-slate-700 active:scale-95'
                }`}
              >
                {/* Right Connector Node */}
                <span
                  className={`absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    isThisRightMatched ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
                <span>{correspondingRightName}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Button */}
      <div className="mt-auto mb-2 pt-4">
        <button
          onClick={() => {
            if (Object.keys(matches).length === PAIRS.length) {
              setShowCelebration(true);
            }
          }}
          disabled={Object.keys(matches).length === 0}
          className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
            Object.keys(matches).length === PAIRS.length
              ? 'btn-chunky-green shadow-md'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>
            {Object.keys(matches).length === PAIRS.length ? 'All Matched!' : `${Object.keys(matches).length}/${PAIRS.length} Matched`}
          </span>
        </button>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Matching Master!"
        subtitle="You matched all the animals to their names!"
        xpEarned={35}
        gemsEarned={5}
        onPlayAgain={() => {
          setMatches({});
          setSelectedLeft(null);
          setShowCelebration(false);
        }}
        onContinue={onClose}
      />
    </div>
  );
}
