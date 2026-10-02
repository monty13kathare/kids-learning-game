'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import Header from './Header';
import InstallModal from './InstallModal';
import { Play, Sparkles, ChevronRight, BookOpen, Clock, Heart, Brain, Laptop, Shield } from 'lucide-react';
import Image from 'next/image';

export default function HomeView() {
  const { user, setActiveGame, categoryProgress, setActiveTab } = useApp();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleStartGame = (gameId: string) => {
    try {
      soundManager.playPop();
    } catch {}
    setActiveGame(gameId);
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] pb-24 w-full">
      {/* Header with Avatar & Daily Stats */}
      <Header />

      <main className="px-4 py-3 space-y-3.5">
        {/* PWA Mobile App Install Banner */}
        {!bannerDismissed && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-3.5 text-white shadow-sm flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shrink-0">
                📱
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm leading-tight">
                  Install KidsPlay on Mobile
                </h4>
                <p className="text-[11px] text-emerald-100 font-medium leading-tight">
                  Play fullscreen without internet!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  try { soundManager.playPop(); } catch {}
                  setShowInstallModal(true);
                }}
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-black text-xs px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-all"
              >
                Install
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="text-emerald-200 hover:text-white text-xs px-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Today's Goal Card */}
        <div className="bg-white rounded-3xl p-4 border-2 border-slate-200/80 shadow-sm flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Today&apos;s Goal
            </span>
            <h3 className="font-extrabold text-slate-800 text-sm mt-0.5">
              Complete {user.dailyGoal.total} activities today
            </h3>

            {/* Progress Bar */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 bg-pink-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(user.dailyGoal.current / user.dailyGoal.total) * 100}%` }}
                />
              </div>
              <span className="text-xs font-black text-slate-600">
                {user.dailyGoal.current}/{user.dailyGoal.total}
              </span>
            </div>
          </div>

          {/* Star Mascot */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center animate-wiggle">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 flex items-center justify-center text-3xl shadow-inner">
              ⭐
            </div>
          </div>
        </div>

        {/* Featured Learning Categories (2x2 Grid) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-black text-slate-800">Learn & Explore</h2>
            <button
              type="button"
              onClick={() => {
                try { soundManager.playPop(); } catch {}
                setActiveTab('games');
              }}
              className="text-xs font-bold text-purple-600 flex items-center gap-0.5 hover:underline"
            >
              <span>All 21 Games</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Alphabet Card */}
            <button
              type="button"
              onClick={() => handleStartGame('trace')}
              className="bg-emerald-50/70 border-2 border-emerald-200/80 rounded-3xl p-3.5 cursor-pointer shadow-sm hover:border-emerald-400 active:scale-95 transition-all flex flex-col justify-between h-32 text-left w-full"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-emerald-200">
                  🔤
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Alphabet</h3>
                <p className="text-[11px] font-semibold text-emerald-700">Learn letters</p>
              </div>
            </button>

            {/* Maths Card */}
            <button
              type="button"
              onClick={() => handleStartGame('maths')}
              className="bg-blue-50/70 border-2 border-blue-200/80 rounded-3xl p-3.5 cursor-pointer shadow-sm hover:border-blue-400 active:scale-95 transition-all flex flex-col justify-between h-32 text-left w-full"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-blue-200">
                  🔢
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Kids Maths</h3>
                <p className="text-[11px] font-semibold text-blue-700">Add & Subtract</p>
              </div>
            </button>

            {/* Moral Stories Card */}
            <button
              type="button"
              onClick={() => handleStartGame('stories')}
              className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-3.5 cursor-pointer shadow-sm hover:border-amber-400 active:scale-95 transition-all flex flex-col justify-between h-32 text-left w-full"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-amber-200">
                  📖
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Moral Stories</h3>
                <p className="text-[11px] font-semibold text-amber-800">Hare, Crow, Lion</p>
              </div>
            </button>

            {/* Indian Culture Card */}
            <button
              type="button"
              onClick={() => handleStartGame('culture')}
              className="bg-orange-50/70 border-2 border-orange-200/80 rounded-3xl p-3.5 cursor-pointer shadow-sm hover:border-orange-400 active:scale-95 transition-all flex flex-col justify-between h-32 text-left w-full"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-orange-200">
                  🇮🇳
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Indian Culture</h3>
                <p className="text-[11px] font-semibold text-orange-700">Festivals & Symbols</p>
              </div>
            </button>
          </div>
        </div>

        {/* Extra Discovery Categories Row */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-800">
              Special Learning Modules
            </h2>
            <button
              type="button"
              onClick={() => {
                try { soundManager.playPop(); } catch {}
                setActiveTab('games');
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              View All &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Computer GK */}
            <button
              type="button"
              onClick={() => handleStartGame('computer')}
              className="bg-white rounded-3xl p-3 border-2 border-slate-200/80 shadow-sm flex items-center gap-2.5 cursor-pointer hover:border-blue-300 active:scale-95 transition-all text-left w-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-xl shrink-0">
                💻
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Computer GK</h4>
                <p className="text-[10px] text-slate-400 font-semibold">CPU, Robot, Web</p>
              </div>
            </button>

            {/* Politics GK */}
            <button
              type="button"
              onClick={() => handleStartGame('politics')}
              className="bg-white rounded-3xl p-3 border-2 border-slate-200/80 shadow-sm flex items-center gap-2.5 cursor-pointer hover:border-amber-300 active:scale-95 transition-all text-left w-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
                🏛️
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Politics GK</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Civics & Vote</p>
              </div>
            </button>

            {/* Clock & Time */}
            <button
              type="button"
              onClick={() => handleStartGame('clock')}
              className="bg-white rounded-3xl p-3 border-2 border-slate-200/80 shadow-sm flex items-center gap-2.5 cursor-pointer hover:border-sky-300 active:scale-95 transition-all text-left w-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-xl shrink-0">
                ⏰
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Clock Master</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Read Clock Hands</p>
              </div>
            </button>

            {/* Good Habits */}
            <button
              type="button"
              onClick={() => handleStartGame('habits')}
              className="bg-white rounded-3xl p-3 border-2 border-slate-200/80 shadow-sm flex items-center gap-2.5 cursor-pointer hover:border-pink-300 active:scale-95 transition-all text-left w-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-xl shrink-0">
                💖
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Good Habits</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Manners & Care</p>
              </div>
            </button>

            {/* Body Parts */}
            <button
              type="button"
              onClick={() => handleStartGame('body')}
              className="bg-white rounded-3xl p-3 border-2 border-slate-200/80 shadow-sm flex items-center gap-2.5 cursor-pointer hover:border-emerald-300 active:scale-95 transition-all text-left w-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                🖐️
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Body Parts</h4>
                <p className="text-[10px] text-slate-400 font-semibold">5 Senses Quiz</p>
              </div>
            </button>

            {/* Logical Brain Patterns */}
            <button
              type="button"
              onClick={() => handleStartGame('logic')}
              className="bg-white rounded-3xl p-3 border-2 border-slate-200/80 shadow-sm flex items-center gap-2.5 cursor-pointer hover:border-indigo-300 active:scale-95 transition-all text-left w-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-xl shrink-0">
                🧠
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Logic Patterns</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Odd One Out</p>
              </div>
            </button>
          </div>
        </div>

        {/* English & Word Building Pathway */}
        <div className="space-y-2.5 pt-1">
          <h2 className="text-base sm:text-lg font-black text-slate-800">
            Language & Phonics
          </h2>

          <div className="space-y-2">
            <button
              onClick={() => handleStartGame('english')}
              className="w-full bg-purple-50/80 hover:bg-purple-100/80 border-2 border-purple-200/70 rounded-3xl p-3 flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-xl shadow-sm">
                  📚
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">English Learning</h4>
                  <p className="text-xs text-purple-700 font-medium">Opposites, Rhyming words, Verbs</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-sm">
                <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
              </div>
            </button>

            <button
              onClick={() => handleStartGame('word-builder')}
              className="w-full bg-blue-50/80 hover:bg-blue-100/80 border-2 border-blue-200/70 rounded-3xl p-3 flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-xl shadow-sm">
                  🐮
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Word Builder: Animal Spelling</h4>
                  <p className="text-xs text-blue-700 font-medium">Spell COW, ZEBRA, LION</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm">
                <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* PWA Install Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
