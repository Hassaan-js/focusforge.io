import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { useAppStore } from '../store';

export function useTemplates() {
  const { setError, setLoading } = useAppStore();
  
  return useQuery('templates', api.getTemplates, {
    onError: (error: Error) => setError(error.message),
    onSettled: () => setLoading(false),
  });
}

export function useActiveTemplate() {
  const { setActiveTemplate, setError } = useAppStore();
  
  return useQuery('activeTemplate', api.getActiveTemplate, {
    onSuccess: (template) => setActiveTemplate(template),
    onError: (error: Error) => setError(error.message),
  });
}

export function useActivateTemplate() {
  const queryClient = useQueryClient();
  const { setError } = useAppStore();
  
  return useMutation(api.activateTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries('activeTemplate');
      queryClient.invalidateQueries('templates');
    },
    onError: (error: Error) => setError(error.message),
  });
}

export function useBlockedSites() {
  const { setBlockedSites, setError } = useAppStore();
  
  return useQuery('blockedSites', api.getBlockedSites, {
    onSuccess: (sites) => setBlockedSites(sites),
    onError: (error: Error) => setError(error.message),
  });
}

export function useAddBlockedSite() {
  const queryClient = useQueryClient();
  const { setError } = useAppStore();
  
  return useMutation(api.addBlockedSite, {
    onSuccess: () => queryClient.invalidateQueries('blockedSites'),
    onError: (error: Error) => setError(error.message),
  });
}

export function useRemoveBlockedSite() {
  const queryClient = useQueryClient();
  const { setError } = useAppStore();
  
  return useMutation(api.removeBlockedSite, {
    onSuccess: () => queryClient.invalidateQueries('blockedSites'),
    onError: (error: Error) => setError(error.message),
  });
}

export function useFocusSession() {
  const { setCurrentSession, setError } = useAppStore();
  const queryClient = useQueryClient();
  
  const startSession = useMutation(api.startFocusSession, {
    onSuccess: (session) => setCurrentSession(session),
    onError: (error: Error) => setError(error.message),
  });
  
  const endSession = useMutation(api.endFocusSession, {
    onSuccess: () => {
      setCurrentSession(null);
      queryClient.invalidateQueries('focusSessions');
    },
    onError: (error: Error) => setError(error.message),
  });
  
  return { startSession, endSession };
}

export function useUserStats() {
  const { setError } = useAppStore();
  
  return useQuery('userStats', api.getUserStats, {
    onError: (error: Error) => setError(error.message),
    refetchInterval: 60000, // Refresh every minute
  });
}