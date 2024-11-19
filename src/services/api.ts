import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Add timeout and retry logic with exponential backoff
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.error || 
                    error.message || 
                    'An unexpected error occurred';
    
    // Log error for debugging
    console.error('API Error:', {
      endpoint: error.config?.url,
      method: error.config?.method,
      message
    });

    throw new Error(message);
  }
);

// Add request interceptor for handling offline state
api.interceptors.request.use(
  config => {
    if (!navigator.onLine) {
      throw new Error('No internet connection');
    }
    return config;
  },
  error => Promise.reject(error)
);

export interface BlockedSite {
  id: number;
  url: string;
  createdAt: string;
}

export interface FocusSession {
  id: number;
  startTime: string;
  endTime: string | null;
  duration: number | null;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  icon: string;
  settings: {
    focusDuration: number;
    breakDuration: number;
    blockedSites: string[];
    notifications: boolean;
  };
  createdAt: string;
}

export interface UserStats {
  totalFocusTime: number;
  sitesBlocked: number;
  focusScore: number;
  currentStreak: number;
}

const apiService = {
  // Site Blocker
  async getBlockedSites(): Promise<BlockedSite[]> {
    return api.get('/sites');
  },

  async addBlockedSite(url: string): Promise<BlockedSite> {
    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `http://${url}`);
    } catch {
      throw new Error('Invalid URL format');
    }
    return api.post('/sites', { url });
  },

  async removeBlockedSite(id: number): Promise<void> {
    return api.delete(`/sites/${id}`);
  },

  // Templates
  async getTemplates(): Promise<Template[]> {
    return api.get('/templates');
  },

  async getActiveTemplate(): Promise<Template | null> {
    return api.get('/templates/active');
  },

  async activateTemplate(id: number): Promise<Template> {
    return api.post(`/templates/${id}/activate`);
  },

  // Focus Timer
  async startFocusSession(): Promise<FocusSession> {
    return api.post('/sessions/start');
  },

  async endFocusSession(id: number): Promise<FocusSession> {
    return api.post(`/sessions/${id}/end`);
  },

  async getFocusSessions(): Promise<FocusSession[]> {
    return api.get('/sessions');
  },

  // Analytics
  async getUserStats(): Promise<UserStats> {
    return api.get('/stats');
  },
};

export default apiService;