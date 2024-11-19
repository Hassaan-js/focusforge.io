import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell, Loader2, AlertCircle } from 'lucide-react';
import api, { Template } from '../../services/api';

export function FocusTimer() {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<number | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadActiveTemplate = useCallback(async () => {
    try {
      const template = await api.getActiveTemplate();
      setActiveTemplate(template);
      if (template) {
        setTime(template.settings.focusDuration * 60);
      }
    } catch (err) {
      setError('Failed to load template settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveTemplate();
  }, [loadActiveTemplate]);

  useEffect(() => {
    let interval: number;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0 && currentSession) {
      handleEndSession();
      if (activeTemplate?.settings.notifications) {
        new Notification('Focus Session Complete!', {
          body: 'Time to take a break.',
          icon: '/favicon.ico'
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, currentSession]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleStartSession = async () => {
    try {
      const session = await api.startFocusSession();
      setCurrentSession(session.id);
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to start session');
      setIsActive(false);
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      await api.endFocusSession(currentSession);
      setCurrentSession(null);
      setIsActive(false);
      setError(null);
    } catch (err) {
      setError('Failed to end session');
    }
  };

  const toggleTimer = async () => {
    if (!isActive) {
      await handleStartSession();
    } else {
      await handleEndSession();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(activeTemplate ? activeTemplate.settings.focusDuration * 60 : 25 * 60);
    setCurrentSession(null);
    setError(null);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 astral-text">Focus Timer</h1>
      <div className="max-w-md mx-auto glass-card p-8">
        {error && (
          <div className="mb-6 p-4 glass rounded-xl bg-red-500/10 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}
        
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
                style={{ 
                  width: `${(time / ((activeTemplate?.settings.focusDuration || 25) * 60)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {activeTemplate && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-200/70">Focus Duration:</span>
              <span className="text-purple-200">{activeTemplate.settings.focusDuration} min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-200/70">Break Duration:</span>
              <span className="text-purple-200">{activeTemplate.settings.breakDuration} min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-200/70">Notifications:</span>
              <span className="text-purple-200">
                {activeTemplate.settings.notifications ? (
                  <Bell className="w-4 h-4 text-purple-400" />
                ) : (
                  'Disabled'
                )}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-6">
          <button
            onClick={toggleTimer}
            disabled={error !== null}
            className="p-4 cosmic-border astral-gradient text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 disabled:opacity-50"
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={resetTimer}
            disabled={error !== null}
            className="p-4 glass glass-hover rounded-xl group disabled:opacity-50"
          >
            <RotateCcw className="w-6 h-6 group-hover:text-purple-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}