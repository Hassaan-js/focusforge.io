import React, { useState, useEffect } from 'react';
import { Clock, Shield, Brain, Calendar, Loader2 } from 'lucide-react';
import api, { UserStats } from '../../services/api';

export function Analytics() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await api.getUserStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="glass-card p-6 text-red-400 bg-red-500/10">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      icon: Clock,
      label: 'Focus Time',
      value: `${Math.round(stats.totalFocusTime / 3600)}h`,
      change: '+23%',
      positive: true
    },
    {
      icon: Shield,
      label: 'Sites Blocked',
      value: stats.sitesBlocked.toString(),
      change: '+15%',
      positive: true
    },
    {
      icon: Brain,
      label: 'Focus Score',
      value: stats.focusScore.toString(),
      change: '+8%',
      positive: true
    },
    {
      icon: Calendar,
      label: 'Streak',
      value: stats.currentStreak.toString(),
      change: '-2',
      positive: false
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 astral-text">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg astral-gradient">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-purple-200/70">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className={`text-sm ${
                stat.positive ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 astral-text">Focus Distribution</h2>
        <div className="h-64 flex items-end gap-2">
          {[60, 45, 75, 30, 90, 55, 70].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full astral-gradient rounded-t-lg transition-all duration-300"
                style={{ height: `${height}%` }}
              />
              <span className="text-sm text-purple-200/70">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}