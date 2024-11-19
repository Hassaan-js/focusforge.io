import React from 'react';
import { ArrowRight, Sparkles, Shield, Brain } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-8 astral-text leading-tight">
            Master Your Focus,
            <br />
            Forge Your Future
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-purple-200/80 mb-12 leading-relaxed">
            Transform your productivity with our innovative focus-enhancing tools. 
            Block distractions, track progress, and achieve your goals with cosmic efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group px-8 py-4 rounded-xl astral-gradient inline-flex items-center justify-center">
              <span className="flex items-center gap-2 text-white font-medium">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-4 rounded-xl glass glass-hover inline-flex items-center justify-center">
              <span className="text-purple-200">Watch Demo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Sparkles, label: '10k+ Active Users' },
              { icon: Shield, label: '99.9% Uptime' },
              { icon: Brain, label: '45% Focus Increase' },
            ].map((stat, index) => (
              <div key={index} className="glass rounded-xl p-4 flex items-center justify-center gap-3">
                <stat.icon className="w-5 h-5 text-purple-400" />
                <span className="text-purple-200">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}