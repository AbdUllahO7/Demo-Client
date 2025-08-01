// src/hooks/webConfiguration/use-WebSiteTheme.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api-client';
import {
  WebSiteTheme,
} from '@/api/types/WebSite/useWebSiteTheme';

// WebSite Theme hook
export function useWebSiteThemes() {
  const endpoint = '/themes';

  // Get user ID from auth context, fallback to hardcoded ID for compatibility
  const userId =  '683b23edd6fa6b23f0af8099';

  // Query keys include user ID to prevent cross-user cache conflicts
  const themesKey = ['themes', userId];
  const themeKey = (id: string) => [...themesKey, id];
  const websiteThemesKey = (websiteId: string) => [...themesKey, 'website', websiteId];
  const activeThemeKey = (websiteId: string) => [...themesKey, 'website', websiteId, 'active'];



  // Get all themes for a specific website
  const useGetByWebsite = (websiteId: string) => {
    return useQuery({
      queryKey: websiteThemesKey(websiteId),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/website/${websiteId}`);
        return data; // Returns { success, message, data: WebSiteTheme[] }
      },
      enabled: !!websiteId,
      staleTime: 30 * 1000,
      retry: 2,
      retryDelay: 1000,
    });
  };

  // Get active theme for a specific website
  const useGetActiveTheme = (
    websiteId: string,
    options: {
      enabled?: boolean;
      retry?: number;
      onError?: (err: any) => void;
      onSuccess?: (data: { success: boolean; message: string; data: WebSiteTheme }) => void;
    } = {}
  ) => {
    return useQuery({
      queryKey: activeThemeKey(websiteId),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/active/${websiteId}`);
        return data; // Returns { success, message, data: WebSiteTheme }
      },
      enabled: options.enabled ?? !!websiteId,
      staleTime: 30 * 1000,
      retry: options.retry ?? 2,
      retryDelay: 1000,
      onError: options.onError,
      onSuccess: options.onSuccess,
    });
  };


  return {
    useGetByWebsite,
    useGetActiveTheme,

  };
}