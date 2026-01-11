import React, { useState } from 'react';
import Game from './components/Game';
import LandingPage from './components/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'game'>('landing');

  return (
    <ErrorBoundary>
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('game')} />
      ) : (
        <Game onBack={() => setView('landing')} />
      )}
    </ErrorBoundary>
  );
};

export default App;