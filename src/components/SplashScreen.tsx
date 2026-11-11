'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

const SPLASH_DURATIONS = [300, 600, 900] as const;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const randomDuration =
      SPLASH_DURATIONS[Math.floor(Math.random() * SPLASH_DURATIONS.length)];

    const timer = setTimeout(() => {
      setVisible(false);
    }, randomDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="brainstorming-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 px-6 select-none"
          aria-label="Loading The Brainstorming"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[110px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-950/60 shadow-[0_0_30px_rgba(147,51,234,0.35)]">
              <BookOpen className="h-7 w-7 text-purple-400" />
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              The Brainstorming
            </h1>
            <p className="mt-1.5 text-xs tracking-wide text-slate-400">
              MP D.El.Ed 1st &amp; 2nd Year Smart Notes Hub
            </p>

            {/* Animated Purple Loader */}
            <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-900 border border-slate-800">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                }}
                className="h-full w-full rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
