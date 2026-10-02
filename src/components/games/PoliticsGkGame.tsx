'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Check } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';

interface PoliticsGkGameProps {
  onClose: () => void;
}

interface CivicsQuestion {
  title: string;
  icon: string;
  answer: string;
  options: string[];
  civicNote: string;
}

const QUESTIONS: CivicsQuestion[] = [
  {
    title: 'What do citizens do on election day to choose their leaders?',
    icon: '🗳️',
    answer: 'Vote',
    options: ['Sleep', 'Vote', 'Sing', 'Race'],
    civicNote: 'Voting is a very important democratic power and right of every citizen!',
  },
  {
    title: 'What building in the capital is where leaders discuss and make laws?',
    icon: '🏛️',
    answer: 'Parliament',
    options: ['Museum', 'Stadium', 'Parliament', 'Airport'],
    civicNote: 'The Parliament of India (Sansad Bhavan) represents the voice of the people!',
  },
  {
    title: 'What is the sacred supreme book of laws and rights of the country?',
    icon: '📜',
    answer: 'Constitution',
    options: ['Comic Book', 'Dictionary', 'Constitution', 'Novel'],
    civicNote: 'Dr. B. R. Ambedkar helped write the Constitution of India which protects everyone!',
  },
  {
    title: 'What respectful action should we take when the National Anthem plays?',
    icon: '🧍',
    answer: 'Stand with respect',
    options: ['Run around', 'Stand with respect', 'Shout loudly', 'Lie down'],
    civicNote: 'Standing with pride shows respect to our nation and freedom fighters!',
  },
  {
    title: 'Who is known as the First Citizen and constitutional head of the nation?',
    icon: '🇮🇳',
    answer: 'President',
    options: ['Mayor', 'President', 'Governor', 'Captain'],
    civicNote: 'The President represents the unity, integrity, and solidarity of the country.',
  },
];

import AnswerFeedback from '@/components/AnswerFeedback';
import { Heart, Volume2, Lightbulb } from 'lucide-react';

export default function PoliticsGkGame({ onClose }: PoliticsGkGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const current = QUESTIONS[qIndex];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Logical Feedback States
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTip, setFeedbackTip] = useState('');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setFeedbackStatus('idle');
    setEliminatedOptions([]);
    setHintUsed(false);
    soundManager.speak(current.title);
  }, [qIndex, current]);

  const handleSelect = (opt: string) => {
    if (eliminatedOptions.includes(opt)) return;
    try { soundManager.playPop(480); } catch {}
    setSelectedOption(opt);
    setFeedbackStatus('idle');
    soundManager.speak(opt);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === current.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFeedbackStatus('correct');
      setFeedbackMessage(`Super citizen! "${current.answer}" is correct!`);
      setFeedbackTip(current.civicNote);

      try {
        soundManager.playChime();
        soundManager.speak(`Super citizen! ${current.civicNote}`);
      } catch {}

      addXP(25 + nextStreak * 5, 5);
      unlockBadge('book-1');

      setTimeout(() => {
        setShowCelebration(true);
      }, 1200);
    } else {
      setStreak(0);
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      setFeedbackStatus('wrong');
      setFeedbackMessage(`"${selectedOption}" is not correct.`);
      setFeedbackTip(
        current.answer === 'Vote'
          ? 'Citizens cast their secret ballot paper or button to elect representatives!'
          : current.answer === 'Parliament'
          ? 'Look for the circular assembly building where laws are passed!'
          : current.answer === 'Constitution'
          ? 'It is the fundamental law book framed with justice and equality for all!'
          : current.answer === 'Stand with respect'
          ? 'We stand tall and silent with devotion when the song of the nation plays!'
          : 'The highest constitutional leader of the republic!'
      );

      try {
        soundManager.playError();
        soundManager.speak(`Not quite. Think about good citizenship and try again!`);
      } catch {}

      if (nextLives === 0) {
        setTimeout(() => setLives(3), 2000);
      }
    }
  };

  const handleUseHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const wrongOptions = current.options.filter((o) => o !== current.answer);
    const toEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(toEliminate);

    try {
      soundManager.playSparkle();
      soundManager.speak(`50-50 Hint! Two wrong choices removed.`);
    } catch {}
  };

  const handleNext = () => {
    setShowCelebration(false);
    setFeedbackStatus('idle');
    setQIndex((prev) => (prev + 1) % QUESTIONS.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6ED] px-4 py-3 w-full max-w-xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          type="button"
          onClick={() => {
            try { soundManager.playPop(); } catch {}
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-pink-100 rounded-full h-3.5 overflow-hidden p-0.5 max-w-[130px]">
          <div
            className="bg-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Lives Counter & Streak Badge */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-white border border-rose-200 px-2 py-1 rounded-full shadow-xs">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          {streak > 1 && (
            <div className="bg-orange-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full animate-bounce shadow-xs">
              🔥 {streak}x
            </div>
          )}
        </div>
      </div>

      {/* Screen Title & Audio Button */}
      <div className="flex items-center justify-between mt-1 mb-2">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Civics & Democracy • {qIndex + 1}/{QUESTIONS.length}
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Politics & Civics GK
          </h1>
        </div>

        <button
          type="button"
          onClick={() => soundManager.speak(current.title)}
          className="w-9 h-9 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs hover:bg-amber-50 active:scale-90 transition-transform cursor-pointer"
          title="Read Question"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl border-2 border-amber-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[190px] my-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-white border border-amber-200 shadow-sm flex items-center justify-center text-5xl mb-3 animate-wiggle">
          {current.icon}
        </div>
        <h3 className="text-xl font-black text-slate-800 leading-snug">
          {current.title}
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="space-y-2 my-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Select the democratic answer:
          </span>
          {!hintUsed && (
            <button
              type="button"
              onClick={handleUseHint}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>50:50 Hint</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt) => {
            const isEliminated = eliminatedOptions.includes(opt);
            const isSelected = selectedOption === opt;
            const isWrong = isSelected && feedbackStatus === 'wrong';
            const isRight = isSelected && feedbackStatus === 'correct';

            return (
              <button
                key={opt}
                type="button"
                disabled={isEliminated}
                onClick={() => handleSelect(opt)}
                className={`h-16 rounded-2xl font-black text-base border-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
                  isEliminated
                    ? 'opacity-20 line-through bg-slate-100 border-slate-200 cursor-not-allowed'
                    : isRight
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-300 scale-105'
                    : isWrong
                    ? 'bg-rose-100 border-rose-500 text-rose-800 animate-wiggle'
                    : isSelected
                    ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-200 scale-102'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner (Wrong / Correct Message) */}
      <AnswerFeedback
        status={feedbackStatus}
        message={feedbackMessage}
        explanation={feedbackTip}
        lives={lives}
        streak={streak}
        onTryAgain={() => {
          setSelectedOption(null);
          setFeedbackStatus('idle');
        }}
        onNext={handleNext}
        onUseHint={handleUseHint}
        hintUsed={hintUsed}
      />

      {/* Bottom Button */}
      {feedbackStatus === 'idle' && (
        <div className="mt-auto mb-2">
          <button
            type="button"
            onClick={handleCheck}
            disabled={selectedOption === null}
            className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              selectedOption !== null
                ? 'btn-chunky-green text-white shadow-md cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Confirm Answer</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Civics Champion!"
        subtitle={current.civicNote}
        xpEarned={25 + streak * 5}
        gemsEarned={5}
        onPlayAgain={() => {
          setSelectedOption(null);
          setShowCelebration(false);
          setFeedbackStatus('idle');
        }}
        onContinue={handleNext}
      />
    </div>
  );
}
