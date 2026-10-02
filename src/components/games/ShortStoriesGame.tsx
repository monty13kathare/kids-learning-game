'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/utils/audio';
import { X, Volume2, ChevronRight, ChevronLeft, Sparkles, BookOpen, Heart, Check } from 'lucide-react';
import CelebrationModal from '@/components/CelebrationModal';
import AnswerFeedback from '@/components/AnswerFeedback';

interface ShortStoriesGameProps {
  onClose: () => void;
}

interface Story {
  id: string;
  title: string;
  emoji: string;
  pages: {
    illustration: string;
    text: string;
  }[];
  moral: string;
  quiz: {
    question: string;
    answer: string;
    options: string[];
    hint: string;
  };
}

const STORIES: Story[] = [
  {
    id: 'tortoise-hare',
    title: 'The Tortoise & The Hare',
    emoji: '🐢',
    pages: [
      {
        illustration: '🐇 💨 🐢',
        text: 'Once upon a time, a speedy Hare laughed at a slow Tortoise. "I can run ten times faster than you!" bragged the Hare. The gentle Tortoise smiled and challenged the Hare to a race.',
      },
      {
        illustration: '🐇 💤 🌳 🐢 🚶',
        text: 'The race began! The Hare zoomed far ahead. Seeing the finish line in sight, he thought, "I have plenty of time. I will take a quick nap under this shady tree." While the Hare slept, the Tortoise kept walking step by step.',
      },
      {
        illustration: '🏁 🐢 🏆 🐇 😲',
        text: 'The Hare woke up and dashed to the finish line, but it was too late! The steady Tortoise had already crossed and won! All the woodland animals cheered for the patient Tortoise.',
      },
    ],
    moral: 'Slow and steady wins the race! Never give up, no matter how small your steps are.',
    quiz: {
      question: 'What is the wonderful moral of The Tortoise & The Hare?',
      answer: 'Slow and steady wins the race!',
      options: [
        'Always take long naps during a race',
        'Slow and steady wins the race!',
        'Only fast runners should enter races',
      ],
      hint: 'Remember how the patient Tortoise kept moving step by step without stopping!',
    },
  },
  {
    id: 'thirsty-crow',
    title: 'The Clever Thirsty Crow',
    emoji: '🐦‍⬛',
    pages: [
      {
        illustration: '☀️ 🥵 🐦‍⬛',
        text: 'On a hot summer afternoon, a thirsty Crow flew all over the forest looking for water. Just when he felt exhausted, he spotted a clay water pitcher in a garden!',
      },
      {
        illustration: '🐦‍⬛ 🏺 💧',
        text: 'The Crow perched on the pitcher, but the water level was too low for his beak to reach. He looked around and saw small shiny pebbles on the ground. An idea sparked in his clever mind!',
      },
      {
        illustration: '🐦‍⬛ 🪨 🏺 💦 😋',
        text: 'One by one, the Crow picked up pebbles and dropped them into the pitcher. Plop! Plop! Plop! The water rose higher and higher until the happy Crow could drink refreshing water to his heart’s content.',
      },
    ],
    moral: 'Where there is a will and thoughtful effort, there is always a way!',
    quiz: {
      question: 'How did the clever Crow manage to drink the deep water?',
      answer: 'By dropping pebbles to make the water level rise',
      options: [
        'By breaking the clay pitcher with a stone',
        'By dropping pebbles to make the water level rise',
        'By crying and flying away sadly',
      ],
      hint: 'Think about what happened when each pebble went plop, plop, plop into the pitcher!',
    },
  },
  {
    id: 'lion-mouse',
    title: 'The Lion & The Mouse',
    emoji: '🦁',
    pages: [
      {
        illustration: '🦁 😴 🐭',
        text: 'A mighty Lion was sleeping under a big tree when a tiny Mouse accidentally ran across his paw. The Lion woke up with a roar and trapped the little mouse under his heavy paw!',
      },
      {
        illustration: '🐭 🥺 🦁 😊',
        text: '"Please spare my life!" begged the Mouse. "Someday I might help you in return!" The Lion laughed at the idea of a tiny mouse helping the king of beasts, but kindly let him go free.',
      },
      {
        illustration: '🦁 🕸️ 🐭 ✂️ 🤝',
        text: 'A few days later, hunters captured the Lion in a strong rope net. Hearing the roar, the little Mouse rushed over and chewed through the thick ropes with his sharp teeth. The Lion was free, and they became best friends forever!',
      },
    ],
    moral: 'No act of kindness, no matter how small, is ever wasted. Even the smallest friend can be of great help!',
    quiz: {
      question: 'What valuable lesson does the story of the Lion and Mouse teach us?',
      answer: 'Even the smallest friend can be of great help!',
      options: [
        'Never make friends with little mice',
        'Only big animals can be brave heroes',
        'Even the smallest friend can be of great help!',
      ],
      hint: 'The tiny mouse had sharp teeth that chewed the net to rescue the mighty lion!',
    },
  },
];

export default function ShortStoriesGame({ onClose }: ShortStoriesGameProps) {
  const { addXP, unlockBadge } = useApp();
  const [storyIndex, setStoryIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Logical Feedback States
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackExplanation, setFeedbackExplanation] = useState('');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const currentStory = STORIES[storyIndex];
  const currentPage = currentStory.pages[pageIndex];
  const isLastPage = pageIndex === currentStory.pages.length - 1;

  const handleReadAloud = () => {
    soundManager.playPop(520);
    if (showQuiz) {
      soundManager.speak(currentStory.quiz.question);
    } else {
      soundManager.speak(currentPage.text);
    }
  };

  const handleNextPage = () => {
    soundManager.playPop(480);
    if (!isLastPage) {
      setPageIndex((p) => p + 1);
    } else {
      // Enter Moral Quiz stage
      setShowQuiz(true);
      setSelectedQuizOption(null);
      setFeedbackStatus('idle');
      soundManager.speak(`Let's check what you learned! ${currentStory.quiz.question}`);
    }
  };

  const handlePrevPage = () => {
    soundManager.playPop(360);
    if (showQuiz) {
      setShowQuiz(false);
    } else if (pageIndex > 0) {
      setPageIndex((p) => p - 1);
    }
  };

  const handleSelectStory = (idx: number) => {
    soundManager.playPop();
    setStoryIndex(idx);
    setPageIndex(0);
    setShowQuiz(false);
    setSelectedQuizOption(null);
    setFeedbackStatus('idle');
  };

  const handleSelectQuizOpt = (opt: string) => {
    if (feedbackStatus === 'correct') return;
    soundManager.playPop(480);
    setSelectedQuizOption(opt);
    soundManager.speak(opt);
  };

  const handleCheckQuiz = () => {
    if (!selectedQuizOption) return;

    if (selectedQuizOption === currentStory.quiz.answer) {
      soundManager.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedbackStatus('correct');
      setFeedbackMsg(`Brilliant comprehension! You understood the story perfectly!`);
      setFeedbackExplanation(currentStory.moral);
      soundManager.speak(`Brilliant! The moral of the story is: ${currentStory.moral}`);
      addXP(35, 5);
      unlockBadge('book-1');
      setShowCelebration(true);
    } else {
      soundManager.playError();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      setFeedbackStatus('wrong');
      setFeedbackMsg(`Not quite! Think about the characters and what happened.`);
      setFeedbackExplanation(`Story hint: ${currentStory.quiz.hint}`);
      soundManager.speak(`Not quite. Story hint: ${currentStory.quiz.hint}`);
    }
  };

  const handleTryAgain = () => {
    setSelectedQuizOption(null);
    setFeedbackStatus('idle');
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
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Story Selector Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {STORIES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSelectStory(idx)}
              className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                storyIndex === idx
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <span>{s.emoji}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-extrabold text-xs text-amber-700">Story</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-left mt-1 mb-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Bedtime & Moral Stories
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          {currentStory.title}
        </h1>
      </div>

      {!showQuiz ? (
        /* Story Book Reader View */
        <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-5 shadow-sm my-auto flex flex-col justify-between min-h-[320px] relative">
          {/* Animated Scene Illustration */}
          <div className="w-full h-24 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-center text-4xl sm:text-5xl shadow-inner mb-3">
            <span className="animate-gentle-bounce">{currentPage.illustration}</span>
          </div>

          {/* Story Text */}
          <div className="flex-1 px-1">
            <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
              {currentPage.text}
            </p>
          </div>

          {/* Moral Banner on Last Page */}
          {isLastPage && (
            <div className="mt-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 text-left animate-in zoom-in-95">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                <span>🌟 Moral of the Story:</span>
              </span>
              <p className="text-xs font-bold text-emerald-900 leading-snug">
                {currentStory.moral}
              </p>
            </div>
          )}

          {/* Read Aloud Button & Page Counter */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
            <button
              onClick={handleReadAloud}
              className="flex items-center gap-1.5 bg-amber-100/80 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Read to Me</span>
            </button>

            <span className="text-xs font-black text-slate-400">
              Page {pageIndex + 1} of {currentStory.pages.length}
            </span>
          </div>
        </div>
      ) : (
        /* Interactive Moral Comprehension Quiz View */
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-5 shadow-sm my-auto flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full">
                Moral Comprehension Check
              </span>
              <button
                onClick={handleReadAloud}
                className="p-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 active:scale-90 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 mb-3 leading-snug">
              {currentStory.quiz.question}
            </h3>

            {/* Quiz Options */}
            <div className="space-y-2.5">
              {currentStory.quiz.options.map((opt) => {
                const isSelected = selectedQuizOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectQuizOpt(opt)}
                    className={`w-full p-3 rounded-2xl text-left font-bold text-xs sm:text-sm border-2 transition-all shadow-xs active:scale-98 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AnswerFeedback Component for Story Quiz */}
          <AnswerFeedback
            status={feedbackStatus}
            message={feedbackMsg}
            explanation={feedbackExplanation}
            correctAnswerText={currentStory.quiz.answer}
            lives={lives}
            streak={streak}
            onTryAgain={handleTryAgain}
            onNext={() => {
              setShowCelebration(false);
              setStoryIndex((prev) => (prev + 1) % STORIES.length);
              setPageIndex(0);
              setShowQuiz(false);
            }}
          />

          {feedbackStatus === 'idle' && (
            <div className="mt-3 pt-2">
              <button
                onClick={handleCheckQuiz}
                disabled={!selectedQuizOption}
                className={`w-full h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedQuizOption
                    ? 'btn-chunky-green text-white shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Verify Understanding</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons: Prev & Next Page */}
      <div className="flex items-center gap-3 mt-auto mb-2 pt-2">
        <button
          onClick={handlePrevPage}
          disabled={pageIndex === 0 && !showQuiz}
          className="h-14 px-5 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 flex items-center justify-center gap-1 disabled:opacity-40 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs">Back</span>
        </button>

        {!showQuiz && (
          <button
            onClick={handleNextPage}
            className="flex-1 h-14 rounded-2xl btn-chunky-green font-black text-base flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>{isLastPage ? 'Moral Quiz 🌟' : 'Next Page'}</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        title="Wise Story Reader!"
        subtitle={currentStory.moral}
        xpEarned={35}
        gemsEarned={5}
        onPlayAgain={() => {
          setPageIndex(0);
          setShowQuiz(false);
          setShowCelebration(false);
        }}
        onContinue={() => {
          setShowCelebration(false);
          setStoryIndex((prev) => (prev + 1) % STORIES.length);
          setPageIndex(0);
          setShowQuiz(false);
        }}
      />
    </div>
  );
}
