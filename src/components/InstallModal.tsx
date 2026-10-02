'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Smartphone, ArrowDownToLine, Share, PlusSquare, WifiOff, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallModal({ isOpen, onClose }: InstallModalProps) {
  const { isInstallable, promptInstall } = useApp();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-emerald-400 shadow-2xl relative text-center">
        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 mx-auto mb-3 shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-3xl">
            🌟
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-800">
          Install KidsPlay
        </h3>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Play anytime, anywhere — even without internet!
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 my-4 text-left">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold text-emerald-800 leading-tight">
              100% Offline Play
            </span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="text-[11px] font-bold text-purple-800 leading-tight">
              Fast Fullscreen
            </span>
          </div>
        </div>

        {/* Platform-Specific Step Guide */}
        {isIOS ? (
          /* iOS Safari Guide */
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left text-xs space-y-2 mb-4">
            <p className="font-extrabold text-slate-700">How to install on iPhone / iPad:</p>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
              <span>Tap the <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> <strong>Share</strong> button in Safari</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
              <span>Scroll down & tap <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" /> <strong>Add to Home Screen</strong></span>
            </div>
          </div>
        ) : (
          /* Android / Chrome One-Tap Install */
          <div className="space-y-3 mb-4">
            <p className="text-xs text-slate-600 font-medium">
              Tap the button below to install the native app icon directly to your home screen!
            </p>
            <button
              onClick={() => {
                soundManager.playSuccess();
                promptInstall();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl btn-chunky-green font-black text-base flex items-center justify-center gap-2 shadow-md"
            >
              <ArrowDownToLine className="w-5 h-5 stroke-[2.5]" />
              <span>Install App on Phone</span>
            </button>
          </div>
        )}

        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 py-1"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
