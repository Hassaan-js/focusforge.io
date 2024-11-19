import React, { useState } from 'react';
import { Plus, X, Shield } from 'lucide-react';

export function SiteBlocker() {
  const [blockedSites, setBlockedSites] = useState<string[]>([
    'facebook.com',
    'twitter.com',
    'instagram.com',
  ]);
  const [newSite, setNewSite] = useState('');

  const addSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSite && !blockedSites.includes(newSite)) {
      setBlockedSites([...blockedSites, newSite]);
      setNewSite('');
    }
  };

  const removeSite = (site: string) => {
    setBlockedSites(blockedSites.filter((s) => s !== site));
  };

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-medium astral-text">Ethereal Shield</h2>
      </div>
      <form onSubmit={addSite} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="Enter realm to block..."
          className="flex-1 px-4 py-3 glass rounded-xl text-purple-200 placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          type="submit"
          className="px-4 py-3 cosmic-border astral-gradient text-white rounded-xl hover:opacity-90 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
      <div className="space-y-3">
        {blockedSites.map((site) => (
          <div
            key={site}
            className="flex items-center justify-between px-4 py-3 glass rounded-xl group hover:bg-purple-500/10 transition-colors"
          >
            <span className="text-purple-200">{site}</span>
            <button
              onClick={() => removeSite(site)}
              className="text-purple-400/50 hover:text-pink-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}