'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, MoreVertical, Crown, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';

interface PodiumLeaderboardProps {
  onClose?: () => void;
}

export default function PodiumLeaderboard({ onClose }: PodiumLeaderboardProps) {
  const { user } = useApp();

  const topThree = [
    {
      rank: 2,
      name: 'Elijah',
      coins: '3248 coins',
      avatar: '/images/thinking_boy.jpg',
      pedestalColor: 'from-[#93C5FD] to-[#3B82F6]',
      pedestalHeight: 'h-36',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      rank: 1,
      name: 'S.Kobayashi',
      coins: '4250 coins',
      avatar: '/images/champion_girl.jpg',
      pedestalColor: 'from-[#FDBA74] via-[#FB923C] to-[#F97316]',
      pedestalHeight: 'h-48',
      badgeColor: 'bg-amber-100 text-amber-800',
      hasCrown: true,
    },
    {
      rank: 3,
      name: 'Chihiro.Y',
      coins: '1480 coins',
      avatar: '/images/challenge_girl.jpg',
      pedestalColor: 'from-[#FDE047] to-[#EAB308]',
      pedestalHeight: 'h-28',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
  ];

  const rankingList = [
    { rank: 4, name: 'Ellison Carroll', coins: '3780 coins', change: 20, isUp: true, avatar: '👧' },
    { rank: 5, name: 'Elaine Cramer', coins: '980 coins', change: 10, isUp: false, avatar: '👩' },
    { rank: 6, name: 'A Lonely Night', coins: '3418 coins', change: 17, isUp: true, avatar: '👦' },
    { rank: 7, name: 'Yuka.U', coins: '2490 coins', change: 14, isUp: true, avatar: '🧒' },
    { rank: 8, name: `${user.name} (You)`, coins: `${user.xp} coins`, change: 25, isUp: true, avatar: '⭐', isYou: true },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between max-w-xl mx-auto w-full relative">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => {
            soundManager.playPop();
            if (onClose) onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-black text-slate-900 leading-tight">
            Leaderboard
          </h1>
          <span className="text-xs font-semibold text-slate-400">
            January 2026
          </span>
        </div>

        <button
          onClick={() => soundManager.playPop()}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 3D Olympic Podium Section */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-end justify-center gap-2">
          {topThree.map((player) => (
            <div
              key={player.rank}
              className={`flex-1 flex flex-col items-center relative ${
                player.rank === 1 ? 'z-20 -mx-1' : 'z-10'
              }`}
            >
              {/* Crown for #1 */}
              {player.hasCrown && (
                <div className="text-3xl mb-1 text-amber-500 animate-bounce">
                  👑
                </div>
              )}

              {/* Avatar */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-slate-100 mb-2">
                <Image
                  src={player.avatar}
                  alt={player.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name & Coins */}
              <span className="text-xs font-black text-slate-800 text-center truncate max-w-[90px]">
                {player.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mb-2">
                {player.coins}
              </span>

              {/* 3D Pedestal Pillar */}
              <div
                className={`w-full ${player.pedestalHeight} rounded-t-3xl bg-gradient-to-b ${player.pedestalColor} shadow-md flex items-center justify-center relative`}
              >
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl shadow-inner border border-white/40">
                  {player.rank}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curved Bottom Drawer Ranking List */}
      <div className="bg-white rounded-t-[40px] px-5 pt-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] border-t border-slate-100 flex-1 mt-auto">
        {/* Subtle handle */}
        <div className="w-10 h-1.5 rounded-full bg-slate-200 mx-auto mb-4" />

        <div className="space-y-3">
          {rankingList.map((item) => (
            <div
              key={item.rank}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                item.isYou
                  ? 'bg-emerald-50 border-2 border-emerald-400 shadow-sm ring-2 ring-emerald-100'
                  : 'bg-slate-50/80 border border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm">
                  {item.avatar}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-tight">
                    {item.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.coins}
                  </span>
                </div>
              </div>

              {/* Rank Change Badge */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                  item.isUp
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <span>{item.change}</span>
                {item.isUp ? (
                  <ArrowUp className="w-3 h-3 stroke-[3]" />
                ) : (
                  <ArrowDown className="w-3 h-3 stroke-[3]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
