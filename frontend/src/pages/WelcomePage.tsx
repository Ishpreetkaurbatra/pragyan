import React, { useState } from 'react';

interface WelcomePageProps {
  onStart: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStartClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onStart();
    }, 240);
  };

  return (
    <div
      className={`min-h-screen ambient-bg flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 selection:bg-growth-100 selection:text-growth-800 transition-all duration-300 ${
        isExiting ? 'welcome-exit' : ''
      }`}
    >
      {/* Main Hero: Centered vertically and horizontally in the viewport */}
      <main className="w-full max-w-4xl mx-auto text-center space-y-7 sm:space-y-9 my-auto">
        
        {/* Primary Headline: Complete headline uses consistent blue -> teal/green gradient */}
        <h1 className="anim-welcome-1 font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.15] max-w-4xl mx-auto bg-gradient-to-r from-primaryblue via-teal to-growthgreen bg-clip-text text-transparent pb-1">
          From scattered trends to{' '}
          <span className="block sm:inline">clear business growth ideas.</span>
        </h1>

        {/* Supporting Text */}
        <p className="anim-welcome-2 text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed font-normal">
          Transform scattered market signals into clear, actionable business growth opportunities.
        </p>

        {/* Prominent Glassmorphism CTA Box */}
        <div className="anim-welcome-3 pt-2">
          <div className="glass-panel p-6 sm:p-8 rounded-[28px] border border-white/85 shadow-soft-glass max-w-md w-full mx-auto space-y-5 text-center">
            <p className="text-sm sm:text-base text-secondary font-medium">
              Turn trends into your next growth opportunity.
            </p>

            {/* Primary CTA Button: Contains ONLY "Let's Start" with no arrow */}
            <div className="anim-welcome-4 pt-1">
              <button
                type="button"
                onClick={handleStartClick}
                className="btn-primary w-full py-4 px-6 text-sm sm:text-base font-bold shadow-soft-glass flex items-center justify-center cursor-pointer text-white"
              >
                <span>Let's Start</span>
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
