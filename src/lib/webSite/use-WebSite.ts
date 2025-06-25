import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';

// Base WebSite hook
export function useWebSite() {
  const queryClient = useQueryClient();
  const endpoint = '/websites';
  
  // Get current user ID from context or wherever it's stored
  const userId = "6844b3d1ffb148655206581c";
  
  // Query keys now include user ID to prevent cross-user cache conflicts
  const websitesKey = ['websites', userId];

  // Get all websites for a specific user ID with sections and languages (public access)
  const useGetWebsitesByUserId = () => {
    return useQuery({
      queryKey: websitesKey,
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/client/user/${userId}`);
        return data?.data?.websites || [];
      },
      // Always refetch when component mounts
      refetchOnMount: true,
      // Short stale time for user data
      staleTime: 10 * 1000, // 10 seconds
    });
  };

  const resetWebsiteCache = () => {
    queryClient.invalidateQueries({ queryKey: ['websites'] });
  };

  return {
    useGetWebsitesByUserId,
    resetWebsiteCache,
  };
}