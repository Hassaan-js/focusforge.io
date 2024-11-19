import React, { useState, useEffect, useCallback } from 'react';
import { Code, Book, Briefcase, Palette, Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import api, { Template } from '../../services/api';

const iconMap = {
  Code,
  Book,
  Briefcase,
  Palette,
} as const;

export function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activating, setActivating] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTemplates = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [templatesData, activeTemplateData] = await Promise.all([
        api.getTemplates(),
        api.getActiveTemplate(),
      ]);
      setTemplates(templatesData);
      setActiveTemplate(activeTemplateData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleActivateTemplate = async (template: Template) => {
    if (activating !== null) return;
    
    setActivating(template.id);
    try {
      const activated = await api.activateTemplate(template.id);
      setActiveTemplate(activated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate template');
    } finally {
      setActivating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold astral-text">Workspace Templates</h1>
        <button
          onClick={() => loadTemplates()}
          disabled={isRefreshing}
          className="p-2 glass glass-hover rounded-xl group disabled:opacity-50"
          title="Refresh templates"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 glass rounded-xl bg-red-500/10 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const Icon = iconMap[template.icon as keyof typeof iconMap] || Palette;
          const isActive = activeTemplate?.id === template.id;
          const isActivating = activating === template.id;

          return (
            <div 
              key={template.id} 
              className={`glass-card p-6 group transition-transform duration-300 ${
                isActive ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${isActive ? 'astral-gradient' : 'glass'}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold astral-text truncate">
                    {template.name}
                  </h2>
                  <p className="text-sm text-purple-200/70 truncate">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-200/70">Focus Duration:</span>
                  <span className="text-purple-200">{template.settings.focusDuration} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-200/70">Break Duration:</span>
                  <span className="text-purple-200">{template.settings.breakDuration} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-200/70">Notifications:</span>
                  <span className="text-purple-200">
                    {template.settings.notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {template.settings.blockedSites.length > 0 && (
                  <div className="text-sm">
                    <span className="text-purple-200/70">Blocked Sites:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {template.settings.blockedSites.map((site) => (
                        <span
                          key={site}
                          className="px-2 py-1 text-xs rounded-full glass text-purple-200"
                        >
                          {site}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleActivateTemplate(template)}
                disabled={isActive || isActivating}
                className={`w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                  isActive
                    ? 'astral-gradient text-white cursor-default'
                    : 'glass glass-hover text-purple-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isActivating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isActive ? (
                  <>
                    <Check className="w-5 h-5" />
                    Active
                  </>
                ) : (
                  'Activate Template'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}