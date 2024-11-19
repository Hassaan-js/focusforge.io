import React from 'react';
import { Settings, Bell, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="glass border-b border-white/10">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <div className="absolute inset-0 blur-sm bg-purple-400/30 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold astral-text">
            FocusForge
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 glass-hover rounded-xl group">
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
          </button>
          <button className="p-2 glass-hover rounded-xl group">
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
          </button>
          <div className="w-10 h-10 rounded-xl cosmic-border glass flex items-center justify-center">
            <span className="text-purple-300">✧</span>
          </div>
        </div>
      </div>
    </header>
  );
}