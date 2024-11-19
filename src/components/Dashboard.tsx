import React from 'react';
import { FocusTimer } from './FocusTimer';
import { SiteBlocker } from './SiteBlocker';

export function Dashboard() {
  return (
    <div className="p-8 flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 astral-text flex items-center gap-3">
          <span className="text-3xl">✧</span> Astral Dashboard
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FocusTimer />
          <SiteBlocker />
        </div>
      </div>
    </div>
  );
}