'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import Header from './Header';
import {
  User,
  Settings,
  ShieldCheck,
  Target,
  Volume2,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Flame,
  Star,
  Award,
  Crown,
  X,
  Sparkles,
  Smartphone,
  Check,
  RotateCcw,
} from 'lucide-react';
import Image from 'next/image';

import InstallModal from './InstallModal';

export default function ProfileView() {
  const { user, setUser, toggleSound, isInstallable, promptInstall, setShowOnboarding } = useApp();

  // Modals state
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showParentZone, setShowParentZone] = useState(false);
  const [parentGateAnswer, setParentGateAnswer] = useState('');
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [parentGateError, setParentGateError] = useState(false);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Parent Gate Challenge: 7 x 8 = 56
  const handleVerifyParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentGateAnswer.trim() === '56' || parentGateAnswer.trim() === '1234') {
      soundManager.playChime();
      setIsParentUnlocked(true);
      setParentGateError(false);
    } else {
      soundManager.playError();
      setParentGateError(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playPop();
    setUser((prev) => ({ ...prev, name: editName.trim() || prev.name }));
    setShowEditProfile(false);
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all game progress?')) {
      soundManager.playPop();
      setUser((prev) => ({
        ...prev,
        xp: 0,
        streak: 1,
        gamesPlayed: 0,
        gems: 10,
        dailyGoal: { current: 0, total: 3 },
      }));
      alert('Progress has been reset.');
      setShowParentZone(false);
      setIsParentUnlocked(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] pb-24 w-full">
      <Header title="Child Profile" subtitle="Safe & Fun learning space" />

      <main className="px-4 py-3 space-y-4">
        {/* Child Profile Card (from Image 3 Screen 3) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-sm text-center relative">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-amber-300 shadow-md ring-4 ring-amber-100 mb-3">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-xl font-black text-slate-800">{user.name}</h2>
          <p className="text-xs font-semibold text-slate-400">{user.handle}</p>
          <span className="inline-block text-[11px] font-bold text-slate-400 mt-0.5">
            Joined since 2024
          </span>

          {/* 3 Stats in Row (Image 3 Screen 3) */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
            <div className="flex flex-col items-center">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 mb-1" />
              <span className="text-base font-black text-slate-800">
                {user.streak}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Day Streak
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 mb-1" />
              <span className="text-base font-black text-slate-800">
                {user.xp}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Total XP
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Award className="w-5 h-5 text-purple-500 mb-1" />
              <span className="text-base font-black text-slate-800">18</span>
              <span className="text-[10px] font-bold text-slate-400">Badges</span>
            </div>
          </div>
        </div>

        {/* Go Premium Card (Image 5 Screen 3) */}
        <button
          onClick={() => {
            soundManager.playPop();
            setShowPremiumModal(true);
          }}
          className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/90 rounded-3xl p-4 flex items-center justify-between gap-3 text-left shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm text-xl">
              👑
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <span>Go Premium</span>
                <span className="bg-amber-400 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  FREE DEMO
                </span>
              </h4>
              <p className="text-xs text-amber-900 font-medium">
                Unlock all categories, offline packs & games
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-600" />
        </button>

        {/* Profile Action Menu Items (Image 3 Screen 3 & Image 5 Screen 3) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Edit Profile */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowEditProfile(true);
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold text-slate-700">Edit Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Learning Goals */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowGoalsModal(true);
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold text-slate-700">
                Learning Goals
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Parent Zone (PIN Protected) */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowParentZone(true);
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold text-slate-700">Parent Zone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                Protected
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* Sound Toggle */}
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold text-slate-700">Sound & Voice</span>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                user.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* PWA Install Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowInstallModal(true);
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">
                  Install App on Phone
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Add KidsPlay to Home Screen (PWA)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* View Welcome Bento Screen */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowOnboarding(true);
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">
                  Welcome Screen (Bento 3D)
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  View Play, Earn, Win 3D Cards
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Help & Support */}
          <button
            onClick={() => {
              soundManager.playPop();
              alert('KidsPlay Support: Safe, ad-free educational games for children. Contact support@kidsplay.app');
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold text-slate-700">
                Help & Support
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* About Us */}
          <button
            onClick={() => {
              soundManager.playPop();
              alert('KidsPlay v1.0.0 - Built with Next.js, TailwindCSS, and PWA capabilities.');
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold text-slate-700">About Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Log Out Button (from Image 3 Screen 3) */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              soundManager.playPop();
              alert('Signed out safely.');
            }}
            className="text-red-500 font-extrabold text-sm py-2 px-4 rounded-xl hover:bg-red-50 active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </main>

      {/* Parent Zone Modal */}
      {showParentZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-emerald-400 shadow-2xl relative">
            <button
              onClick={() => {
                setShowParentZone(false);
                setIsParentUnlocked(false);
                setParentGateAnswer('');
                setParentGateError(false);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            {!isParentUnlocked ? (
              /* Parent Verification Challenge */
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                  🛡️
                </div>
                <h3 className="text-xl font-black text-slate-800">Parent Gate</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ask a grown-up to answer this question to enter:
                </p>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 my-4">
                  <span className="text-2xl font-black text-emerald-800">
                    7 × 8 = ?
                  </span>
                  <span className="block text-[11px] text-emerald-600 mt-1">
                    (or enter PIN: 1234)
                  </span>
                </div>

                <form onSubmit={handleVerifyParent} className="space-y-3">
                  <input
                    type="number"
                    value={parentGateAnswer}
                    onChange={(e) => setParentGateAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full text-center text-xl font-bold p-3 border-2 rounded-2xl border-slate-300 focus:border-emerald-500 focus:outline-none"
                    autoFocus
                  />
                  {parentGateError && (
                    <p className="text-xs font-bold text-red-500">
                      Incorrect answer. Please try again!
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl btn-chunky-green font-black text-sm"
                  >
                    Enter Parent Zone
                  </button>
                </form>
              </div>
            ) : (
              /* Unlocked Parent Dashboard */
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">Parent Zone</h3>
                    <p className="text-[11px] text-slate-500">Supervision & Safety controls</p>
                  </div>
                </div>

                {/* Screen Time Usage */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Screen Time Today</span>
                    <span>{user.todayMinutes}m / {user.maxMinutes}m</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${(user.todayMinutes / user.maxMinutes) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Learning Progress Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Skills Progress
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Alphabets & Phonics</span>
                      <span className="font-bold text-emerald-600">8 / 26 (31%)</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Numbers & Counting</span>
                      <span className="font-bold text-blue-600">12 / 20 (60%)</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Animals Recognition</span>
                      <span className="font-bold text-orange-600">16 / 20 (80%)</span>
                    </div>
                  </div>
                </div>

                {/* Reset Progress Action */}
                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={handleResetProgress}
                    className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Kid Progress</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center border-4 border-amber-300 shadow-2xl relative">
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-black text-slate-800 mb-3">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Child Name"
                className="w-full text-center font-bold p-3 border-2 rounded-2xl border-slate-300 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-2xl btn-chunky-blue font-bold text-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border-4 border-amber-400 shadow-2xl relative">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-5xl mb-2">👑</div>
            <h3 className="text-xl font-black text-slate-800">KidsPlay Premium</h3>
            <p className="text-xs text-slate-500 mt-1">
              All games and educational features in this app are 100% unlocked and free for your learning journey!
            </p>
            <ul className="text-left text-xs font-bold text-slate-700 space-y-2 my-4 bg-amber-50 p-4 rounded-2xl">
              <li className="flex items-center gap-2">✅ Unlimited Phonics & Tracing</li>
              <li className="flex items-center gap-2">✅ Complete Animal & Fruit packs</li>
              <li className="flex items-center gap-2">✅ 100% Safe & Ad-free experience</li>
              <li className="flex items-center gap-2">✅ Offline PWA Mobile Mode</li>
            </ul>
            <button
              onClick={() => {
                soundManager.playSuccess();
                setShowPremiumModal(false);
              }}
              className="w-full py-3 rounded-2xl btn-chunky-purple font-black text-sm"
            >
              Enjoy Learning!
            </button>
          </div>
        </div>
      )}

      {/* Learning Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center border-4 border-purple-300 shadow-2xl relative">
            <button
              onClick={() => setShowGoalsModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-black text-slate-800 mb-2">Daily Goal</h3>
            <p className="text-xs text-slate-500 mb-4">Set target activities per day</p>
            <div className="flex justify-center gap-3 mb-5">
              {[2, 3, 5].map((target) => (
                <button
                  key={target}
                  onClick={() => {
                    soundManager.playPop();
                    setUser((prev) => ({
                      ...prev,
                      dailyGoal: { ...prev.dailyGoal, total: target },
                    }));
                    setShowGoalsModal(false);
                  }}
                  className={`w-14 h-14 rounded-2xl font-black text-xl border-2 ${
                    user.dailyGoal.total === target
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {target}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Install Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
