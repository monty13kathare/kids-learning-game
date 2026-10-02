'use client';

import React, { useState } from 'react';
import { useApp, Badge } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import Header from './Header';
import PodiumLeaderboard from './PodiumLeaderboard';
import { Flame, Trophy, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, Award, Star, Gamepad2, X } from 'lucide-react';
import Image from 'next/image';

export default function RewardView() {
  const { user, badges } = useApp();
  const [activeTab, setActiveTab] = useState<'streak' | 'leaderboard' | 'badges'>('streak');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'global' | 'friends' | 'class'>('global');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const weekDays = [
    { day: 'Su', done: true },
    { day: 'Mo', done: true },
    { day: 'Tu', done: true },
    { day: 'We', done: true },
    { day: 'Th', done: true },
    { day: 'Fr', done: true, current: true, date: 23 },
    { day: 'Sa', done: false },
  ];

  // Calendar dates for May 2026 (matching mockup)
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const leaderboardUsers = [
    { rank: 1, name: 'Emma', badge: 'Super Learner', xp: 2450, medal: '🥇', isYou: false },
    { rank: 2, name: 'Alex', badge: 'You', xp: user.xp, medal: '🥈', isYou: true },
    { rank: 3, name: 'Liam', badge: 'Math Wizard', xp: 1760, medal: '🥉', isYou: false },
    { rank: 4, name: 'Sophia', badge: 'Word Explorer', xp: 1520, medal: '4', isYou: false },
    { rank: 5, name: 'Noah', badge: 'Animal Expert', xp: 1380, medal: '5', isYou: false },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6ED] pb-24 w-full">
      <Header title="My Streak & Rewards" subtitle="Keep learning every day!" />

      <main className="px-4 py-3 space-y-4">
        {/* Navigation Switcher Pills */}
        <div className="flex bg-amber-100/60 p-1 rounded-2xl border border-amber-200/80">
          <button
            type="button"
            onClick={() => {
              try { soundManager.playPop(); } catch {}
              setActiveTab('streak');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'streak'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔥 Streak
          </button>
          <button
            type="button"
            onClick={() => {
              try { soundManager.playPop(); } catch {}
              setActiveTab('leaderboard');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏆 Ranking
          </button>
          <button
            type="button"
            onClick={() => {
              try { soundManager.playPop(); } catch {}
              setActiveTab('badges');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏅 Badges
          </button>
        </div>

        {/* Tab 1: Streak View (Screen 4 from Image 1 & Screen 3 from Image 2) */}
        {activeTab === 'streak' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Big Flame Banner Card */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-sm text-center relative overflow-hidden">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-orange-50 border border-orange-200/80 mb-2">
                <Flame className="w-10 h-10 text-orange-500 fill-orange-500 animate-bounce" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {user.streak}
              </h1>
              <p className="text-sm font-bold text-orange-600">
                Days in a row! 🔥
              </p>

              {/* Weekly Tracker Row */}
              <div className="flex items-center justify-between gap-1.5 mt-5 px-1">
                {weekDays.map((w, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">{w.day}</span>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        w.done && !w.current
                          ? 'bg-orange-500 text-white shadow-sm'
                          : w.current
                          ? 'bg-orange-50 text-orange-600 border-2 border-orange-500 ring-2 ring-orange-200 font-extrabold'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {w.done && !w.current ? (
                        <CheckCircle className="w-4 h-4 stroke-[3]" />
                      ) : (
                        w.date || ''
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot encouragement Card (Flame character from Image 1 Screen 4) */}
            <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-amber-300 shadow-sm bg-white">
                <Image
                  src="/images/flame.jpg"
                  alt="Learning Flame Mascot"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm">
                  Amazing!
                </h4>
                <p className="text-xs font-semibold text-amber-900 leading-snug mt-0.5">
                  Your learning flame is burning bright! Keep practicing every day.
                </p>
              </div>
            </div>

            {/* Daily Practice Card */}
            <div className="bg-emerald-50/80 border-2 border-emerald-200/80 rounded-3xl p-4 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-xl shadow-sm">
                  📖
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">Daily Practice</h4>
                  <p className="text-xs font-medium text-emerald-800">
                    Great job! You completed 3 activities today.
                  </p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* Longest Streak & Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-sm">
                <Star className="w-5 h-5 text-amber-500 mx-auto mb-1 fill-amber-400" />
                <span className="text-[10px] font-bold text-slate-400 block">Total XP</span>
                <span className="text-sm font-black text-slate-800">{user.xp.toLocaleString()}</span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-sm">
                <Gamepad2 className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-400 block">Games</span>
                <span className="text-sm font-black text-slate-800">{user.gamesPlayed}</span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-sm">
                <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-400 block">Longest</span>
                <span className="text-sm font-black text-slate-800">{user.longestStreak}d</span>
              </div>
            </div>

            {/* Monthly Calendar View (Image 1 Screen 4) */}
            <div className="bg-white rounded-3xl p-4 border-2 border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  May 2026
                </h3>
                <div className="flex items-center gap-1 text-slate-500">
                  <button className="p-1 rounded-lg hover:bg-slate-100">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded-lg hover:bg-slate-100">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d} className="text-[10px] font-bold text-slate-400 mb-1">
                    {d}
                  </span>
                ))}
                {/* 5 empty offset days */}
                <div /> <div /> <div /> <div /> <div />
                {calendarDays.map((day) => {
                  const isPastStreak = day <= 22 && day >= 6;
                  const isToday = day === 23;
                  return (
                    <div
                      key={day}
                      className={`h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isToday
                          ? 'border-2 border-orange-500 text-orange-600 font-black'
                          : isPastStreak
                          ? 'bg-orange-100/70 text-orange-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Leaderboard View (Screen 2 Olympic Podium & Drawer) */}
        {activeTab === 'leaderboard' && (
          <div className="animate-in fade-in duration-200 -mx-4 -mt-1">
            <PodiumLeaderboard />
          </div>
        )}

        {/* Tab 3: Badges View */}
        {activeTab === 'badges' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-4 border-2 border-slate-200/80 shadow-sm">
              <h2 className="text-lg font-black text-slate-800">Your Badges</h2>
              <p className="text-xs text-slate-500 font-medium">
                Tap a badge to view achievement details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedBadge(badge);
                  }}
                  className={`p-4 rounded-3xl border-2 text-center transition-all active:scale-95 shadow-sm ${
                    badge.unlocked
                      ? 'bg-white border-amber-200 hover:border-amber-300'
                      : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-extrabold text-sm text-slate-800">
                    {badge.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {badge.desc}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full mt-2 ${
                      badge.unlocked
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {badge.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center border-4 border-amber-300 shadow-2xl relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-6xl my-3">{selectedBadge.icon}</div>
            <h3 className="text-xl font-black text-slate-800">{selectedBadge.name}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{selectedBadge.desc}</p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${selectedBadge.unlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {selectedBadge.unlocked ? 'Achievement Unlocked 🎉' : 'Keep playing to unlock!'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
