import React from 'react';
import { Trophy, Target, Flame, Calendar } from 'lucide-react';

const achievements = [
  {
    icon: Trophy,
    title: '30-Day Streak',
    description: 'Maintained consistent focus sessions for a month',
    progress: 80
  },
  {
    icon: Target,
    title: 'Focus Master',
    description: 'Completed 100 focused work sessions',
    progress: 65
  },
  {
    icon: Flame,
    title: 'Productivity Warrior',
    description: 'Blocked 1000+ distracting websites',
    progress: 45
  },
  {
    icon: Calendar,
    title: 'Time Champion',
    description: 'Logged 100+ hours of focused work',
    progress: 90
  }
];

export function Progress() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 astral-text">Your Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl astral-gradient">
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold astral-text">{achievement.title}</h2>
                <p className="text-purple-200/70">{achievement.description}</p>
              </div>
            </div>
            <div className="relative pt-4">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full astral-gradient transition-all duration-300"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
              <span className="absolute right-0 top-0 text-sm text-purple-300">
                {achievement.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}