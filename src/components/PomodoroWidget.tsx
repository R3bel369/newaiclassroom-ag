import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Play, Pause, X, RotateCcw, Headphones, Coffee, Target } from 'lucide-react';

export default function PomodoroWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Focus: 25 mins, Break: 5 mins
  const initialTime = mode === 'focus' ? 25 * 60 : 5 * 60;

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'); // Ambient lofi placeholder
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a small ding when done (using web audio api for a simple beep)
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsActive(false);
  }, [mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-72 glass dark:glass shadow-2xl rounded-2xl overflow-hidden animate-slide-up"
          >
            {/* Header */}
            <div className="bg-indigo-600/90 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2 font-semibold">
                {mode === 'focus' ? <Target size={18} /> : <Coffee size={18} />}
                {mode === 'focus' ? 'Focus Session' : 'Short Break'}
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col items-center">
              {/* Timer Display */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="8" fill="none" />
                  <circle cx="80" cy="80" r="70" className="stroke-indigo-500 transition-all duration-1000 ease-linear" strokeWidth="8" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * progress) / 100} strokeLinecap="round" />
                </svg>
                <div className="text-4xl font-bold font-mono text-slate-800 dark:text-white">
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mb-6">
                <button onClick={resetTimer} className="p-3 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors" title="Reset Timer">
                  <RotateCcw size={20} />
                </button>
                <button onClick={toggleTimer} className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:scale-105 active:scale-95" title={isActive ? "Pause" : "Start"}>
                  {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
                <button onClick={toggleMusic} className={`p-3 rounded-full transition-colors ${isPlayingMusic ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800'}`} title="Toggle Ambient LoFi">
                  <Headphones size={20} />
                </button>
              </div>

              {/* Mode Switcher */}
              <div className="flex w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button 
                  onClick={() => setMode('focus')} 
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'focus' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Focus
                </button>
                <button 
                  onClick={() => setMode('break')} 
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'break' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Break
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl shadow-indigo-500/30 flex items-center gap-2 group animate-float"
        >
          <Timer size={24} />
          <span className="font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap">
            Focus Mode
          </span>
        </motion.button>
      )}
    </div>
  );
}
