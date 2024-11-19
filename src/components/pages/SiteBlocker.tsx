import React, { useState, useEffect } from 'react';
import { Plus, X, Shield, AlertCircle, Loader2 } from 'lucide-react';
import api, { BlockedSite, Template } from '../../services/api';

export function SiteBlocker() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [newSite, setNewSite] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sites, template] = await Promise.all([
        api.getBlockedSites(),
        api.getActiveTemplate()
      ]);
      setBlockedSites(sites);
      setActiveTemplate(template);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }

  async function addSite(e: React.FormEvent) {
    e.preventDefault();
    if (!newSite) return;

    try {
      const site = await api.addBlockedSite(newSite);
      setBlockedSites([site, ...blockedSites]);
      setNewSite('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add site');
    }
  }

  async function removeSite(id: number) {
    try {
      await api.removeBlockedSite(id);
      setBlockedSites(blockedSites.filter(site => site.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove site');
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 astral-text">Site Blocker</h1>
      <div className="max-w-2xl">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">
              Sites added here will be blocked during your focus sessions.
              {activeTemplate && (
                <span className="block mt-1 text-purple-200/70">
                  Current template: {activeTemplate.name}
                </span>
              )}
            </p>
          </div>
          <form onSubmit={addSite} className="flex gap-3">
            <input
              type="text"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              placeholder="Enter website to block... (e.g., example.com)"
              className="flex-1 px-4 py-3 glass rounded-xl text-purple-200 placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              type="submit"
              disabled={!newSite}
              className="px-4 py-3 cosmic-border astral-gradient text-white rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-4 p-4 glass rounded-xl bg-red-500/10 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {activeTemplate?.settings.blockedSites.length > 0 && (
          <div className="mb-6 glass-card p-4">
            <h2 className="text-sm font-medium text-purple-200/70 mb-2">
              Template Blocked Sites:
            </h2>
            <div className="flex flex-wrap gap-2">
              {activeTemplate.settings.blockedSites.map((site) => (
                <span
                  key={site}
                  className="px-3 py-1 text-sm rounded-full glass text-purple-300"
                >
                  {site}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {blockedSites.length === 0 ? (
            <div className="text-center p-8 text-purple-200/50">
              No additional sites blocked
            </div>
          ) : (
            blockedSites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between px-4 py-3 glass rounded-xl group hover:bg-purple-500/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-200">{site.url}</span>
                </div>
                <button
                  onClick={() => removeSite(site.id)}
                  className="text-purple-400/50 hover:text-pink-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}