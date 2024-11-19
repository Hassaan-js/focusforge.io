import React from 'react';
import { Sparkles, Menu } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 blur-sm bg-purple-400/30 animate-pulse" />
            </div>
            <span className="text-xl font-bold astral-text">FocusForge</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <button key={item} className="text-gray-300 hover:text-white transition-colors">
                {item}
              </button>
            ))}
            <button className="px-4 py-2 rounded-xl astral-gradient text-white hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 glass-hover rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}