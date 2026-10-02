'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { Home, Gamepad2, Trophy, User } from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'text-purple-600', activeBg: 'bg-purple-100 text-purple-600' },
    { id: 'games', label: 'Games', icon: Gamepad2, color: 'text-blue-600', activeBg: 'bg-blue-100 text-blue-600' },
    { id: 'reward', label: 'Reward', icon: Trophy, color: 'text-amber-500', activeBg: 'bg-amber-100 text-amber-600' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-emerald-600', activeBg: 'bg-emerald-100 text-emerald-600' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-xl mx-auto px-4 py-2 flex items-center justify-around w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                try {
                  soundManager.playPop(isActive ? 500 : 420);
                } catch {}
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
                isActive ? 'scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? item.activeBg : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? '' : 'stroke-[2.2]'}`} />
              </div>
              <span
                className={`text-[11px] font-bold mt-0.5 tracking-tight ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
