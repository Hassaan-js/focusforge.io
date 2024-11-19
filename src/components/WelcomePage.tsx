import React from 'react';
import { ArrowRight, Sparkles, Moon, Star, Shield } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.1
            }}
          >
            {i % 2 === 0 ? (
              <Star className="w-3 h-3 text-purple-300" />
            ) : (
              <span className="text-lg">✧</span>
            )}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2">
            <div className="relative">
              <Moon className="w-16 h-16 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-purple-400/30 animate-pulse rounded-full" />
            </div>
          </div>

          <h1 className="text-6xl font-bold mb-6 astral-text">
            Welcome to FocusForge
          </h1>
          
          <p className="text-xl text-purple-200/80 mb-12 leading-relaxed">
            Harness the power of cosmic focus and elevate your productivity to new dimensions. 
            Journey through a realm of deep concentration and achievement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Sparkles,
                title: 'Ethereal Focus',
                description: 'Immerse yourself in distraction-free productivity zones'
              },
              {
                icon: Shield,
                title: 'Astral Shield',
                description: 'Block digital distractions with cosmic protection'
              },
              {
                icon: Star,
                title: 'Celestial Progress',
                description: 'Track your journey through interactive constellations'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 group hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4 relative">
                  <feature.icon className="w-8 h-8 text-purple-400 mx-auto" />
                  <div className="absolute inset-0 blur-lg bg-purple-400/20 rounded-full" />
                </div>
                <h3 className="text-lg font-semibold mb-2 astral-text">{feature.title}</h3>
                <p className="text-purple-200/70">{feature.description}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={onStart}
            className="group relative px-8 py-4 overflow-hidden rounded-xl astral-gradient"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-pink-500/50 to-purple-600/50 blur-xl group-hover:opacity-75 transition-opacity" />
            <span className="relative flex items-center gap-2 text-white font-medium">
              Begin Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <p className="text-purple-200/60">Forge your focus, shape your destiny</p>
          <div className="flex items-center gap-2">
            <span className="text-purple-300">✧</span>
            <span className="astral-text">FocusForge</span>
            <span className="text-purple-300">✧</span>
          </div>
        </div>
      </footer>
    </div>
  );
}