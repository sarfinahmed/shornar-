import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GIFS, REJECTION_TEXTS, SUCCESS_MESSAGES } from '../constants';

const ValentinePage: React.FC = () => {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: number | string; left: number | string; position: 'relative' | 'absolute' }>({ top: 'auto', left: 'auto', position: 'relative' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload images for smoother transitions
  useEffect(() => {
    Object.values(GIFS).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getRejectionState = () => {
    if (yesPressed) return { text: "Yes", gif: GIFS.success };
    if (noCount === 0) return { text: "No", gif: GIFS.idle };
    if (noCount === 1) return { text: REJECTION_TEXTS[1], gif: GIFS.shocked };
    if (noCount === 2) return { text: REJECTION_TEXTS[2], gif: GIFS.shocked };
    if (noCount >= 3 && noCount <= 5) return { text: REJECTION_TEXTS[Math.min(noCount, REJECTION_TEXTS.length - 1)], gif: GIFS.pleading };
    if (noCount > 5 && noCount <= 8) return { text: REJECTION_TEXTS[Math.min(noCount, REJECTION_TEXTS.length - 1)], gif: GIFS.desperate };
    return { text: REJECTION_TEXTS[Math.min(noCount, REJECTION_TEXTS.length - 1)], gif: GIFS.crying };
  };

  const { text: noText, gif } = getRejectionState();

  const handleNoInteraction = (e?: React.TouchEvent | React.MouseEvent) => {
    setNoCount((prev) => prev + 1);
    moveNoButton();
  };

  const moveNoButton = () => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    
    // Dimensions
    const estimatedBtnWidth = 120; // Avg width
    const estimatedBtnHeight = 45; 
    const padding = 16;

    // COORDINATE SYSTEM: 
    // The button is absolute relative to the 'glass-card' container.
    // We reserve the top 55% for content. 
    // Button moves strictly in the bottom 45%.
    const safeZoneStartY = height * 0.55; 
    
    const maxLeft = width - estimatedBtnWidth - padding;
    const maxTop = height - estimatedBtnHeight - padding;

    // MinTop must be at least the safe zone start
    const minTop = Math.max(safeZoneStartY, height / 2);

    // Randomize
    let newLeft = Math.random() * maxLeft;
    let newTop = minTop + Math.random() * (maxTop - minTop);

    // Clamp to ensure it stays inside
    newLeft = Math.max(padding, Math.min(newLeft, maxLeft));
    newTop = Math.max(minTop, Math.min(newTop, maxTop));

    setNoButtonPosition({
      position: 'absolute',
      left: newLeft,
      top: newTop,
    });
  };

  const handleYesClick = () => {
    setYesPressed(true);
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#ff1493', '#ff0000']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#ff1493', '#ff0000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div 
      ref={containerRef}
      className="glass-card aspect-square w-full max-w-[360px] p-4 flex flex-col items-center justify-center text-center relative transition-all duration-500 overflow-hidden z-20 mx-auto border-white/50 border-2 shadow-2xl rounded-[2rem]"
    >
      <AnimatePresence mode="wait">
        {!yesPressed ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="flex flex-col w-full h-full z-20 relative"
          >
            {/* 
              TOP SECTION: Static Content
              Height fixed to 55% to match safe zone logic.
              pointer-events-none ensures clicks pass through if button somehow goes under (unlikely).
            */}
            <div className="flex flex-col items-center justify-start pt-4 h-[55%] pointer-events-none w-full">
              <motion.div
                 key={noCount}
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ type: "spring", stiffness: 200, damping: 15 }}
                 className="relative z-10"
              >
                <div className="bg-white/40 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/60 relative">
                  {/* Added key={gif} to force re-render on change */}
                   <img 
                    key={gif}
                    src={gif} 
                    alt="Cute reaction" 
                    onError={(e) => {
                      e.currentTarget.src = "https://media.tenor.com/M6Ldx1mRvb8AAAAi/cat-peach.gif"; // Reliable fallback
                    }}
                    className="h-24 w-24 md:h-28 md:w-28 object-contain rounded-lg drop-shadow-sm bg-transparent"
                  />
                  <span className="absolute -top-2 -right-2 text-2xl animate-bounce drop-shadow-md">💝</span>
                </div>
              </motion.div>

              <div className="flex items-center justify-center px-2 z-10 mt-4 w-full">
                <motion.h1
                  className="text-xl md:text-2xl font-black drop-shadow-sm leading-tight tracking-tight px-1"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    color: ["#db2777", "#e11d48", "#db2777"], // pink-600 -> rose-600 -> pink-600
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  Shorna, will you be my Valentine? 🌹
                </motion.h1>
              </div>
            </div>

            {/* 
              BOTTOM SECTION: Buttons
            */}
            <div className="h-[45%] w-full flex items-start justify-center pt-4">
              <div className="flex flex-row items-start justify-center gap-3 w-full z-30">
                {/* YES Button - Static */}
                <motion.button
                  onClick={handleYesClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg hover:shadow-pink-500/40 transition-all duration-300 flex items-center justify-center border-2 border-transparent"
                  style={{
                    fontSize: `${Math.min(1 + noCount * 0.05, 1.3)}rem`, 
                    padding: `${Math.min(10 + noCount * 1, 16)}px ${Math.min(20 + noCount * 2, 32)}px`,
                    zIndex: 40 
                  }}
                >
                  Yes <span className="ml-1 emoji-font">💖</span>
                </motion.button>

                {/* NO Button - Dynamic Position */}
                <motion.button
                  onMouseEnter={handleNoInteraction} 
                  onTouchStart={handleNoInteraction} 
                  onClick={handleNoInteraction}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.4 }
                  }}
                  animate={noButtonPosition.position === 'absolute' ? { left: noButtonPosition.left, top: noButtonPosition.top } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{
                    position: noButtonPosition.position,
                    left: noButtonPosition.position === 'relative' ? 'auto' : noButtonPosition.left,
                    top: noButtonPosition.position === 'relative' ? 'auto' : noButtonPosition.top,
                    zIndex: 50,
                    touchAction: 'none'
                  }}
                  className="bg-white text-pink-500 font-bold py-2 px-5 rounded-full shadow-md hover:bg-gray-100 border-2 border-pink-100 whitespace-nowrap text-sm"
                >
                  {noText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full z-20"
          >
            <motion.img 
              key="success-img"
              src={GIFS.success} 
              alt="Celebration" 
              onError={(e) => {
                 e.currentTarget.src = "https://media.tenor.com/M6Ldx1mRvb8AAAAi/cat-peach.gif";
              }}
              className="h-36 w-36 object-contain mb-4 drop-shadow-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 mb-3 text-center leading-tight">
              {SUCCESS_MESSAGES[0]}
            </h1>
            <p className="text-lg md:text-xl text-pink-700 font-medium text-center px-2 mb-4">
              {SUCCESS_MESSAGES[1]} <br/> 
              {SUCCESS_MESSAGES[2]} <br/>
              <span className="block mt-2 font-bold text-2xl text-rose-500">{SUCCESS_MESSAGES[3]}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValentinePage;