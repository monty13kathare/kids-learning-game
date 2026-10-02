'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { Gamepad2, Award, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface OnboardingViewProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export default function OnboardingView({ onGetStarted, onExplore }: OnboardingViewProps) {
  return (
    <div className="min-h-screen bg-[#FAF6ED] px-4 py-4 flex flex-col justify-between max-w-xl mx-auto w-full">
      {/* Top Mobile Status Bar Indicator */}
      <div className="flex items-center justify-between text-xs font-black text-slate-700 px-3 pt-1 pb-3">
        <span>12:41</span>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="text-[10px]">📶</span>
          <span className="text-[10px]">🔋</span>
        </div>
      </div>

      {/* 3D Bento Grid Section (Exact layout from Screen 1) */}
      <div className="grid grid-cols-2 gap-3 flex-1 max-h-[480px] my-auto">
        {/* Left Column: Big Blue PLAY EARN WIN Card */}
        <div className="relative bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#0369A1] rounded-[32px] p-4 text-white flex flex-col justify-between overflow-hidden shadow-md">
          {/* Gamepad Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-sm z-10">
            <Gamepad2 className="w-5 h-5 fill-white/80" />
          </div>

          {/* Typography */}
          <div className="mt-3 z-10">
            <h2 className="text-2xl font-black tracking-tight leading-none text-white drop-shadow-sm">
              PLAY<br />
              EARN<br />
              WIN
            </h2>
          </div>

          {/* 3D Thinking Boy Illustration */}
          <div className="relative w-full aspect-square mt-2 z-10">
            <Image
              src="/images/thinking_boy.jpg"
              alt="Thinking Kid"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Dark "Fun games!" Pill Badge */}
          <div className="mt-2 z-10 self-start">
            <div className="inline-flex items-center gap-2 bg-[#1E293B] text-white px-3 py-1.5 rounded-full shadow-md border border-slate-700/60">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-[10px] text-white">
                ★
              </div>
              <span className="text-xs font-extrabold tracking-tight">Fun games!</span>
            </div>
          </div>
        </div>

        {/* Right Column: Two Stacked Bento Cards */}
        <div className="flex flex-col gap-3">
          {/* Top Right Card: Purple Challenge Friends */}
          <div className="relative bg-gradient-to-b from-[#C084FC] via-[#A855F7] to-[#9333EA] rounded-[32px] p-3 text-white flex flex-col justify-between overflow-hidden shadow-md flex-1">
            <div className="relative w-full h-28">
              <Image
                src="/images/challenge_girl.jpg"
                alt="Challenge Friends"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-1">
              <p className="text-[11px] font-black leading-tight text-purple-100">
                Challenge Friends in Real Time
              </p>
            </div>
          </div>

          {/* Bottom Right Card: Warm Orange Champion Girl */}
          <div className="relative bg-gradient-to-b from-[#FB923C] via-[#F97316] to-[#EA580C] rounded-[32px] p-3 text-white flex flex-col justify-between overflow-hidden shadow-md flex-1">
            <div className="relative w-full h-32">
              <Image
                src="/images/champion_girl.jpg"
                alt="Trophy Champion"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-100">
              <span>Win Trophies</span>
              <span>🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="text-center pt-5 pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          Play to Gain<br />Knowledge and Skills
        </h1>
        <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
          Master Alphabets, Maths, Stories, GK, Computers & Logic with 21 fun interactive games!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-5">
          {/* Primary Orange Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onGetStarted();
            }}
            className="w-full py-4 rounded-full bg-[#FF6B35] hover:bg-[#F25A24] text-white font-black text-base shadow-[0_6px_0_0_#C2410C] active:translate-y-1 active:shadow-[0_2px_0_0_#C2410C] transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Secondary White Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onExplore();
            }}
            className="w-full py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border-2 border-slate-200/90 shadow-sm active:scale-95 transition-all"
          >
            Explore All 21 Games
          </button>
        </div>
      </div>
    </div>
  );
}
