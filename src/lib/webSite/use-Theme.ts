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
  const userId =  '6844b3d1ffb148655206581c';

  // Query keys include user ID to prevent cross-user cache conflicts
  const themesKey = ['themes', userId];
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


const useGetActiveTheme = (
  websiteId: string,
  options: {
    enabled?: boolean;
    retry?: number;
    onError?: (err: any) => void;
  } = {}
) => {
  return useQuery({
    queryKey: activeThemeKey(websiteId),
    queryFn: async () => {
      const { data } = await apiClient.get(`${endpoint}/active/${websiteId}`);
      return data;
    },
    enabled: options.enabled ?? !!websiteId,
    staleTime: 5 * 60 * 1000, // ✅ Increase from 30s to 5 minutes
    refetchOnMount: true, // ✅ Always refetch when component mounts
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: options.retry ?? 2,
    retryDelay: 1000,
  });
};


  return {
    useGetByWebsite,
    useGetActiveTheme,

  };
}
