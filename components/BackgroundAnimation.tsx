import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation: React.FC = () => {
  const [elements, setElements] = useState<Array<{ id: number; left: string; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      size: 10 + Math.random() * 30,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-pink-200 via-purple-100 to-red-100">
      {/* Floating Hearts */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute text-pink-400/30"
          initial={{ bottom: -50, left: el.left, opacity: 0 }}
          animate={{
            bottom: '110%',
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear",
          }}
          style={{ fontSize: el.size }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Cute Floating GIFs - Removed the loading cat */}
      <motion.img 
        src="https://media.tenor.com/b2a_l5aK44sAAAAi/mochi-cat.gif" 
        className="absolute bottom-20 right-10 w-28 opacity-60 mix-blend-multiply"
        animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />
      <motion.img 
        src="https://media.tenor.com/pUakPOU6D7YAAAAi/cute-cat.gif" 
        className="absolute top-1/2 left-5 w-20 opacity-50 mix-blend-multiply hidden md:block"
        animate={{ x: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />
      
      {/* Soft glowing orbs for premium feel */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-red-400/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
};

export default BackgroundAnimation;