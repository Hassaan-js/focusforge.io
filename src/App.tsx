import React, { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { MainApp } from './components/MainApp';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return showWelcome ? (
    <WelcomePage onStart={() => setShowWelcome(false)} />
  ) : (
    <MainApp />
  );
}

export default App;