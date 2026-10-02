'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { Volume2, VolumeX, Flame, Gem, ArrowDownToLine, Menu } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
}

export default function Header({ title, subtitle, showBack, onBack, showMenu = true }: HeaderProps) {
  const { user, toggleSound, isInstallable, promptInstall, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF6ED]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-amber-100/60">
      <div className="flex items-center justify-between gap-2 max-w-xl mx-auto w-full">
        {/* Left: Avatar / Back / Title */}
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              type="button"
              onClick={() => {
                try { soundManager.playPop(); } catch {}
                if (onBack) onBack();
              }}
              className="w-10 h-10 rounded-full bg-white border border-amber-200 shadow-sm flex items-center justify-center text-slate-700 active:scale-95 transition-transform cursor-pointer"
              aria-label="Back"
            >
              <span className="text-xl font-bold">‹</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                try { soundManager.playPop(); } catch {}
                setActiveTab('profile');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm ring-2 ring-white">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                    {title || `Hi, ${user.name.split(' ')[0]}! 👋`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">
                  {subtitle || "Let's learn something new!"}
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button (if available) */}
          {isInstallable && (
            <button
              type="button"
              onClick={() => {
                try { soundManager.playPop(); } catch {}
                promptInstall();
              }}
              className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-2 py-1.5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Install App"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Install</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-white border border-amber-200/80 flex items-center justify-center text-slate-600 hover:text-purple-600 shadow-sm active:scale-90 transition-transform cursor-pointer"
            aria-label="Toggle Sound"
          >
            {user.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Streak Badge */}
          <button
            type="button"
            onClick={() => {
              try { soundManager.playPop(); } catch {}
              setActiveTab('reward');
            }}
            className="flex items-center gap-1 bg-white border border-orange-200 px-2.5 py-1 rounded-full shadow-sm hover:border-orange-300 active:scale-95 transition-transform cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-extrabold text-xs text-orange-600">{user.streak}</span>
          </button>

          {/* Gems Badge */}
          <div className="flex items-center gap-1 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-full shadow-sm">
            <div className="w-3.5 h-3.5 rounded-sm bg-pink-500 flex items-center justify-center text-[9px] text-white font-bold">
              ★
            </div>
            <span className="font-extrabold text-xs text-pink-600">{user.gems}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
