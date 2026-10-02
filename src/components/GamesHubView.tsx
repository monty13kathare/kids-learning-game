'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { Play, Sparkles } from 'lucide-react';
import Header from './Header';

export default function GamesHubView() {
  const { setActiveGame } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All (21)', icon: '🌟' },
    { id: 'gk', label: 'GK & Tech', icon: '💻' },
    { id: 'stories', label: 'Stories & English', icon: '📚' },
    { id: 'math', label: 'Maths & Time', icon: '🔢' },
    { id: 'life', label: 'Habits & Body', icon: '💖' },
    { id: 'culture', label: 'Culture & World', icon: '🇮🇳' },
    { id: 'logic', label: 'Logic & Puzzles', icon: '🧩' },
  ];

  const allGames = [
    // GK & Tech
    {
      id: 'computer',
      title: 'Computer GK & Tech',
      subtitle: 'CPU brain, keyboard, robots & internet',
      icon: '💻',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      btnColor: 'bg-blue-600',
      tag: 'Tech',
      category: 'gk',
    },
    {
      id: 'politics',
      title: 'Politics & Civics GK',
      subtitle: 'Voting, Parliament, Constitution & Leaders',
      icon: '🏛️',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      btnColor: 'bg-amber-600',
      tag: 'Civics',
      category: 'gk',
    },
    {
      id: 'gk',
      title: 'General Knowledge (GK)',
      subtitle: 'Planets, fast animals, world wonders',
      icon: '💡',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      btnColor: 'bg-yellow-600',
      tag: 'Trivia',
      category: 'gk',
    },
    {
      id: 'nature',
      title: 'Nature & Science Explorer',
      subtitle: 'Rainbows, butterflies, sun & oceans',
      icon: '🌿',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      btnColor: 'bg-emerald-600',
      tag: 'Nature',
      category: 'gk',
    },

    // Stories & English
    {
      id: 'stories',
      title: 'Moral Short Stories',
      subtitle: 'Tortoise & Hare, Thirsty Crow, Lion & Mouse',
      icon: '📖',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      btnColor: 'bg-amber-600',
      tag: 'Moral',
      category: 'stories',
    },
    {
      id: 'english',
      title: 'English Learning',
      subtitle: 'Opposites, rhyming words, verbs & plurals',
      icon: '📚',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      btnColor: 'bg-purple-600',
      tag: 'Grammar',
      category: 'stories',
    },
    {
      id: 'word-builder',
      title: 'Word Builder Spelling',
      subtitle: 'Build COW, ZEBRA, LION letter by letter',
      icon: '🐮',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      btnColor: 'bg-blue-600',
      tag: 'Spelling',
      category: 'stories',
    },
    {
      id: 'trace',
      title: 'Trace the Letter',
      subtitle: 'Trace A, B, C with interactive glowing pen',
      icon: '✏️',
      color: 'bg-violet-100 text-violet-700 border-violet-200',
      btnColor: 'bg-violet-600',
      tag: 'Phonics',
      category: 'stories',
    },
    {
      id: 'match-letters',
      title: 'Match & Learn Phonics',
      subtitle: 'Match pictures with starting letters',
      icon: '🔤',
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      btnColor: 'bg-pink-600',
      tag: 'Letters',
      category: 'stories',
    },

    // Maths & Time
    {
      id: 'maths',
      title: 'Fun Kids Maths',
      subtitle: 'Add and subtract with visual counters',
      icon: '➕',
      color: 'bg-sky-100 text-sky-700 border-sky-200',
      btnColor: 'bg-sky-600',
      tag: 'Maths',
      category: 'math',
    },
    {
      id: 'clock',
      title: 'Clock & Time Master',
      subtitle: 'Read analog clock hands & daily routine times',
      icon: '⏰',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      btnColor: 'bg-blue-600',
      tag: 'Clock',
      category: 'math',
    },
    {
      id: 'number-count',
      title: 'How Many Apples?',
      subtitle: 'Tap to count fruits out loud',
      icon: '🍎',
      color: 'bg-red-100 text-red-700 border-red-200',
      btnColor: 'bg-red-600',
      tag: 'Counting',
      category: 'math',
    },

    // Habits & Body
    {
      id: 'habits',
      title: 'Good Habits & Manners',
      subtitle: 'Saying Please, Thank you, sharing & hygiene',
      icon: '💖',
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      btnColor: 'bg-pink-600',
      tag: 'Manners',
      category: 'life',
    },
    {
      id: 'body',
      title: 'Body Parts & 5 Senses',
      subtitle: 'Eyes, ears, nose, hands, feet & senses',
      icon: '🖐️',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      btnColor: 'bg-emerald-600',
      tag: 'Anatomy',
      category: 'life',
    },

    // Culture & World
    {
      id: 'culture',
      title: 'Indian Culture & Heritage',
      subtitle: 'Tiger, Peacock, Lotus, Diwali, Holi & Taj Mahal',
      icon: '🇮🇳',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      btnColor: 'bg-orange-600',
      tag: 'India',
      category: 'culture',
    },
    {
      id: 'countries',
      title: 'Countries & World Flags',
      subtitle: 'India, Japan, USA, Australia & France',
      icon: '🌍',
      color: 'bg-teal-100 text-teal-700 border-teal-200',
      btnColor: 'bg-teal-600',
      tag: 'Flags',
      category: 'culture',
    },

    // Logic & Puzzles
    {
      id: 'logic',
      title: 'Logical Patterns & Odd One',
      subtitle: 'Sequences, patterns, and odd-one-out puzzles',
      icon: '🧠',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      btnColor: 'bg-indigo-600',
      tag: 'Logic',
      category: 'logic',
    },
    {
      id: 'puzzle',
      title: 'Flip & Match Puzzle',
      subtitle: 'Card memory puzzle matching cute animal pairs',
      icon: '🧩',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      btnColor: 'bg-purple-600',
      tag: 'Memory',
      category: 'logic',
    },
    {
      id: 'colors',
      title: 'Colors & Shapes',
      subtitle: 'Find circles, squares, stars & vibrant colors',
      icon: '🎨',
      color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      btnColor: 'bg-fuchsia-600',
      tag: 'Shapes',
      category: 'logic',
    },
    {
      id: 'match-animals',
      title: 'Match Animals to Names',
      subtitle: 'Connect Lion, Elephant, Panda, Fox with lines',
      icon: '🦁',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      btnColor: 'bg-amber-600',
      tag: 'Animals',
      category: 'logic',
    },
    {
      id: 'animals-quiz',
      title: 'Animals Quiz & Sounds',
      subtitle: 'Guess animal names with 3D pictures & sounds',
      icon: '🐘',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      btnColor: 'bg-emerald-600',
      tag: 'Nature',
      category: 'logic',
    },
  ];

  const filteredGames =
    selectedCategory === 'all'
      ? allGames
      : allGames.filter((g) => g.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF6ED] pb-24 w-full">
      <Header title="Arcade of 21 Games" subtitle="Pick any fun game to learn!" />

      <main className="px-4 py-3 space-y-3.5">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full mb-1.5">
              🎮 21 Fun Learning Games
            </span>
            <h2 className="text-xl font-black">Choose What to Learn!</h2>
            <p className="text-xs text-purple-100 mt-0.5">
              Maths, Stories, GK, Computers, Politics, Clock, Manners & Puzzles!
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 pointer-events-none">
            🎯
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  try { soundManager.playPop(isSelected ? 480 : 420); } catch {}
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Games List Cards */}
        <div className="space-y-2.5">
          {filteredGames.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                try { soundManager.playPop(); } catch {}
                setActiveGame(g.id);
              }}
              className="w-full bg-white rounded-3xl p-3.5 border-2 border-slate-200/80 shadow-sm flex items-center justify-between gap-3 text-left hover:border-purple-300 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-13 h-13 rounded-2xl border flex items-center justify-center text-3xl shadow-sm shrink-0 p-2.5 ${g.color}`}
                >
                  {g.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-tight">
                      {g.title}
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {g.tag}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
                    {g.subtitle}
                  </p>
                </div>
              </div>

              <div
                className={`w-9 h-9 rounded-full ${g.btnColor} text-white flex items-center justify-center shadow-sm shrink-0 active:scale-90 transition-transform`}
              >
                <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
