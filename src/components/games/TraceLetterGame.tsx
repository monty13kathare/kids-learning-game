'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

interface TraceLetterGameProps {
  onClose: () => void;
}

const LETTERS = ['B', 'A', 'C', 'D', 'E', 'S'];

export default function TraceLetterGame({ onClose }: TraceLetterGameProps) {
  const { addXP, unlockBadge } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentLetter = LETTERS[currentLetterIndex];

  // Letter Phonics guide
  useEffect(() => {
    soundManager.speak(`Letter ${currentLetter}. Trace the letter.`);
  }, [currentLetterIndex, currentLetter]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    soundManager.playPop(350);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(139, 92, 246, 0.4)';
    ctx.shadowBlur = 8;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    soundManager.playPop(300);
  };

  const handleDone = () => {
    addXP(25, 5);
    unlockBadge('trace-1');
    setShowCelebration(true);
  };

  const handleNextLetter = () => {
    clearCanvas();
    setShowCelebration(false);
    setCurrentLetterIndex((prev) => (prev + 1) % LETTERS.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6ED] px-4 py-3 w-full max-w-xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90 transition-transform"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Pink Progress Bar Pill */}
        <div className="flex-1 bg-pink-100 rounded-full h-3.5 overflow-hidden p-0.5 max-w-[140px]">
          <div
            className="bg-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentLetterIndex + 1) / LETTERS.length) * 100}%` }}
          />
        </div>

        {/* Gems Badge */}
        <div className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full shadow-sm">
          <div className="w-3.5 h-3.5 rounded-sm bg-pink-500 flex items-center justify-center text-[9px] text-white font-bold">
            ★
          </div>
          <span className="font-extrabold text-xs text-pink-600">25</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-left mt-2 mb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Trace the Letter
        </h1>
        <p className="text-sm font-semibold text-slate-500">
          Follow the dots to write
        </p>
      </div>

      {/* Main Tracing Card Area */}
      <div className="relative flex-1 bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-4 flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
        {/* Background Letter Guide Outline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-black text-[280px] leading-none select-none text-purple-100 tracking-tighter"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              WebkitTextStroke: '4px #DDD6FE',
              strokeDasharray: '8 8',
            }}
          >
            {currentLetter}
          </span>
        </div>

        {/* Interactive Tracing Canvas */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="canvas-trace relative z-10 w-full h-[320px] max-w-[320px] cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Tracing Start Step Badge (1) */}
        <div className="absolute top-12 left-14 z-20 w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md animate-bounce">
          1
        </div>
      </div>

      {/* Pencil Tip Banner */}
      <div className="mt-4 bg-purple-50 border border-purple-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-base">⭐</span>
          <p className="text-xs font-bold text-slate-700">
            Start at the top and drag your finger.
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-lg animate-wiggle">
          ✏️
        </div>
      </div>

      {/* Action Buttons: Reset & Done */}
      <div className="flex items-center gap-3 mt-4 mb-2">
        <button
          onClick={clearCanvas}
          className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-800 active:scale-95 transition-all"
          title="Clear & Redo"
        >
          <RotateCcw className="w-6 h-6 stroke-[2.2]" />
        </button>

        <button
          onClick={handleDone}
          className="flex-1 h-14 rounded-2xl btn-chunky-purple font-black text-lg flex items-center justify-center gap-2"
        >
          <span>Done</span>
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Terrific Tracing!"
        subtitle={`You wrote the letter ${currentLetter} perfectly!`}
        xpEarned={25}
        gemsEarned={5}
        onPlayAgain={clearCanvas}
        onContinue={handleNextLetter}
      />
    </div>
  );
}
