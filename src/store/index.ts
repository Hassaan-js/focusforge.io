import { create } from 'zustand';
import { Template, FocusSession, BlockedSite } from '../services/api';

interface AppState {
  activeTemplate: Template | null;
  currentSession: FocusSession | null;
  blockedSites: BlockedSite[];
  isLoading: boolean;
  error: string | null;
  setActiveTemplate: (template: Template | null) => void;
  setCurrentSession: (session: FocusSession | null) => void;
  setBlockedSites: (sites: BlockedSite[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTemplate: null,
  currentSession: null,
  blockedSites: [],
  isLoading: false,
  error: null,
  setActiveTemplate: (template) => set({ activeTemplate: template }),
  setCurrentSession: (session) => set({ currentSession: session }),
  setBlockedSites: (sites) => set({ blockedSites: sites }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));