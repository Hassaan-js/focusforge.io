import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function FocusTimer() {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="glass-card p-8">
      <h2 className="text-xl font-medium astral-text mb-8 flex items-center gap-2">
        <span className="text-2xl">✧</span> Astral Timer
      </h2>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
        <div className="relative">
          <div className="text-8xl font-bold text-center mb-4 font-mono tracking-wider bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 text-transparent bg-clip-text">
            {String(minutes).padStart(2, '0')}
            <span className="text-purple-400">:</span>
            {String(seconds).padStart(2, '0')}
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full astral-gradient transition-all duration-300"
              style={{ width: `${(time / (25 * 60)) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-6">
        <button
          onClick={toggleTimer}
          className="p-4 cosmic-border astral-gradient text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 glass glass-hover rounded-xl group"
        >
          <RotateCcw className="w-6 h-6 group-hover:text-purple-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}