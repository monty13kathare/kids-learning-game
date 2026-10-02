'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import OnboardingView from '@/components/OnboardingView';
import HomeView from '@/components/HomeView';
import GamesHubView from '@/components/GamesHubView';
import RewardView from '@/components/RewardView';
import ProfileView from '@/components/ProfileView';
import BottomNav from '@/components/BottomNav';
import TraceLetterGame from '@/components/games/TraceLetterGame';
import WordBuilderGame from '@/components/games/WordBuilderGame';
import MatchItGame from '@/components/games/MatchItGame';
import MatchLettersGame from '@/components/games/MatchLettersGame';
import NumbersCountingGame from '@/components/games/NumbersCountingGame';
import AnimalsQuizGame from '@/components/games/AnimalsQuizGame';
import MathsGame from '@/components/games/MathsGame';
import MemoryPuzzleGame from '@/components/games/MemoryPuzzleGame';
import GkQuizGame from '@/components/games/GkQuizGame';
import IndianCultureGame from '@/components/games/IndianCultureGame';
import NatureGame from '@/components/games/NatureGame';
import CountriesGame from '@/components/games/CountriesGame';
import ColorsShapesGame from '@/components/games/ColorsShapesGame';
import ComputerGkGame from '@/components/games/ComputerGkGame';
import PoliticsGkGame from '@/components/games/PoliticsGkGame';
import EnglishLearningGame from '@/components/games/EnglishLearningGame';
import ShortStoriesGame from '@/components/games/ShortStoriesGame';
import ClockGame from '@/components/games/ClockGame';
import BodyPartsGame from '@/components/games/BodyPartsGame';
import GoodHabitsGame from '@/components/games/GoodHabitsGame';
import LogicalPatternsGame from '@/components/games/LogicalPatternsGame';

export default function MainPage() {
  const { activeTab, setActiveTab, activeGame, setActiveGame, showOnboarding, setShowOnboarding } = useApp();

  // Render current in-game experience if a game is active
  const renderGame = () => {
    switch (activeGame) {
      case 'trace':
        return <TraceLetterGame onClose={() => setActiveGame(null)} />;
      case 'word-builder':
        return <WordBuilderGame onClose={() => setActiveGame(null)} />;
      case 'match-animals':
        return <MatchItGame onClose={() => setActiveGame(null)} />;
      case 'match-letters':
        return <MatchLettersGame onClose={() => setActiveGame(null)} />;
      case 'number-count':
        return <NumbersCountingGame onClose={() => setActiveGame(null)} />;
      case 'animals-quiz':
        return <AnimalsQuizGame onClose={() => setActiveGame(null)} />;
      case 'maths':
        return <MathsGame onClose={() => setActiveGame(null)} />;
      case 'puzzle':
        return <MemoryPuzzleGame onClose={() => setActiveGame(null)} />;
      case 'gk':
        return <GkQuizGame onClose={() => setActiveGame(null)} />;
      case 'culture':
        return <IndianCultureGame onClose={() => setActiveGame(null)} />;
      case 'nature':
        return <NatureGame onClose={() => setActiveGame(null)} />;
      case 'countries':
        return <CountriesGame onClose={() => setActiveGame(null)} />;
      case 'colors':
        return <ColorsShapesGame onClose={() => setActiveGame(null)} />;
      case 'computer':
        return <ComputerGkGame onClose={() => setActiveGame(null)} />;
      case 'politics':
        return <PoliticsGkGame onClose={() => setActiveGame(null)} />;
      case 'english':
        return <EnglishLearningGame onClose={() => setActiveGame(null)} />;
      case 'stories':
        return <ShortStoriesGame onClose={() => setActiveGame(null)} />;
      case 'clock':
        return <ClockGame onClose={() => setActiveGame(null)} />;
      case 'body':
        return <BodyPartsGame onClose={() => setActiveGame(null)} />;
      case 'habits':
        return <GoodHabitsGame onClose={() => setActiveGame(null)} />;
      case 'logic':
        return <LogicalPatternsGame onClose={() => setActiveGame(null)} />;
      default:
        return null;
    }
  };

  // Render active main tab
  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'games':
        return <GamesHubView />;
      case 'reward':
        return <RewardView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  // If user is on the initial Welcome / Bento Onboarding screen
  if (showOnboarding) {
    return (
      <OnboardingView
        onGetStarted={() => {
          setShowOnboarding(false);
          setActiveTab('home');
        }}
        onExplore={() => {
          setShowOnboarding(false);
          setActiveTab('games');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6ED] text-slate-800 flex flex-col w-full">
      {/* Responsive container: 100% on phones, elegantly centered on tablets/desktop */}
      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col">
        {activeGame ? renderGame() : renderTab()}
      </div>

      {/* Bottom Navigation Bar */}
      {!activeGame && <BottomNav />}
    </div>
  );
}
