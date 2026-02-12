import React from 'react';
import ValentinePage from './components/ValentinePage';
import BackgroundAnimation from './components/BackgroundAnimation';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <BackgroundAnimation />
      <div className="z-10 w-full max-w-md px-4">
        <ValentinePage />
      </div>
    </div>
  );
};

export default App;