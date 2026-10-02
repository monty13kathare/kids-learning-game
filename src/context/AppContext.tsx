'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '@/utils/audio';

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  unlocked: boolean;
  category: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  streak: number;
  longestStreak: number;
  gems: number;
  xp: number;
  gamesPlayed: number;
  dailyGoal: { current: number; total: number };
  soundEnabled: boolean;
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  todayMinutes: number;
  maxMinutes: number;
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeTab: 'home' | 'games' | 'reward' | 'profile';
  setActiveTab: (tab: 'home' | 'games' | 'reward' | 'profile') => void;
  activeGame: string | null;
  setActiveGame: (game: string | null) => void;
  categoryProgress: Record<string, { current: number; total: number }>;
  badges: Badge[];
  unlockBadge: (id: string) => void;
  addXP: (amount: number, gems?: number) => void;
  recordActivity: () => void;
  toggleSound: () => void;
  toggleVoice: () => void;
  isInstallable: boolean;
  promptInstall: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
}

const initialBadges: Badge[] = [
  { id: 'streak-1', name: 'Streak Hero', desc: 'Maintained 7+ days streak', icon: '🔥', color: 'bg-orange-500', unlocked: true, category: 'streak' },
  { id: 'star-1', name: 'Star Learner', desc: 'Earned 1000+ XP', icon: '⭐', color: 'bg-yellow-500', unlocked: true, category: 'xp' },
  { id: 'book-1', name: 'Book Explorer', desc: 'Completed 10 alphabet games', icon: '📖', color: 'bg-emerald-500', unlocked: true, category: 'games' },
  { id: 'gem-1', name: 'Ruby Collector', desc: 'Collected 25 gems', icon: '💎', color: 'bg-pink-500', unlocked: true, category: 'gems' },
  { id: 'animal-1', name: 'Safari Friend', desc: 'Identified all animal cards', icon: '🦁', color: 'bg-amber-600', unlocked: true, category: 'animals' },
  { id: 'builder-1', name: 'Word Master', desc: 'Built 5 animal words', icon: '🔤', color: 'bg-blue-500', unlocked: true, category: 'words' },
  { id: 'trace-1', name: 'Pen Wizard', desc: 'Traced 5 letters accurately', icon: '✏️', color: 'bg-purple-500', unlocked: false, category: 'tracing' },
  { id: 'math-1', name: 'Counting Champ', desc: 'Counted 10 fruits correctly', icon: '🍎', color: 'bg-red-500', unlocked: false, category: 'numbers' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'games' | 'reward' | 'profile'>('home');
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Johnson',
    handle: '@alex.j',
    avatar: '/images/avatar_alex.jpg',
    streak: 18,
    longestStreak: 32,
    gems: 25,
    xp: 1980,
    gamesPlayed: 24,
    dailyGoal: { current: 2, total: 3 },
    soundEnabled: true,
    voiceEnabled: true,
    notificationsEnabled: true,
    todayMinutes: 24,
    maxMinutes: 45,
  });

  const [categoryProgress, setCategoryProgress] = useState({
    alphabet: { current: 8, total: 26 },
    numbers: { current: 12, total: 20 },
    animals: { current: 16, total: 20 },
    fruits: { current: 18, total: 20 },
    shapes: { current: 6, total: 20 },
    knowledge: { current: 0, total: 20 },
  });

  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Sync sounds
  useEffect(() => {
    soundManager.soundEnabled = user.soundEnabled;
    soundManager.voiceEnabled = user.voiceEnabled;
  }, [user.soundEnabled, user.voiceEnabled]);

  // Register PWA service worker and listen to beforeinstallprompt
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration error:', err);
      });

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }
  }, []);

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      // Show instructional alert if on iOS or desktop where prompt event wasn't fired
      alert("To install on mobile: Tap your browser's share or menu icon (⋮ or Share) and select 'Add to Home Screen'!");
    }
  };

  const addXP = (amount: number, gemsGain: number = 5) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + amount,
      gems: prev.gems + gemsGain,
      gamesPlayed: prev.gamesPlayed + 1,
      dailyGoal: {
        ...prev.dailyGoal,
        current: Math.min(prev.dailyGoal.total, prev.dailyGoal.current + 1)
      }
    }));
  };

  const recordActivity = () => {
    setUser(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      dailyGoal: {
        ...prev.dailyGoal,
        current: Math.min(prev.dailyGoal.total, prev.dailyGoal.current + 1)
      }
    }));
  };

  const unlockBadge = (id: string) => {
    setBadges(prev => prev.map(b => b.id === id ? { ...b, unlocked: true } : b));
  };

  const toggleSound = () => {
    setUser(prev => {
      const next = !prev.soundEnabled;
      soundManager.soundEnabled = next;
      if (next) soundManager.playPop();
      return { ...prev, soundEnabled: next };
    });
  };

  const toggleVoice = () => {
    setUser(prev => {
      const next = !prev.voiceEnabled;
      soundManager.voiceEnabled = next;
      if (next) soundManager.speak("Sound narration enabled!");
      return { ...prev, voiceEnabled: next };
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      activeTab,
      setActiveTab,
      activeGame,
      setActiveGame,
      categoryProgress,
      badges,
      unlockBadge,
      addXP,
      recordActivity,
      toggleSound,
      toggleVoice,
      isInstallable,
      promptInstall,
      showOnboarding,
      setShowOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
