// src/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // Optimized QueryClient configuration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 🚀 OPTIMIZATION: Longer stale time = fewer API calls
            staleTime: 5 * 60 * 1000, // 5 minutes (was 1 minute)
            
            // 🚀 OPTIMIZATION: Longer cache time = better performance
            gcTime: 10 * 60 * 1000, // 10 minutes (was default)
            
            // 🚀 OPTIMIZATION: Reduce retries for faster failures
            retry: 1, // (was default 3)
            
            // 🚀 OPTIMIZATION: Smart retry delays
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // 🚀 OPTIMIZATION: Disable unnecessary refetches
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true, // Keep this for connection issues
            
            // 🚀 OPTIMIZATION: Background refetching for fresh data
            refetchInterval: false, // Disable automatic intervals
            refetchIntervalInBackground: false,
            
            // 🚀 OPTIMIZATION: Structural sharing for performance
            structuralSharing: true,
            
            // 🚀 OPTIMIZATION: Keep previous data while fetching new
            placeholderData: (previousData) => previousData,
          },
          mutations: {
            // 🚀 OPTIMIZATION: Reduce mutation retries
            retry: 1, // (was default 3)
            
            // 🚀 OPTIMIZATION: Faster mutation error handling
            retryDelay: 1000,
          },
        },
        
        // 🚀 OPTIMIZATION: Enhanced error handling
        errorHandler: (error) => {
          console.error('🔴 Query Error:', error);
          // Could add error reporting service here
        },
        
        // 🚀 OPTIMIZATION: Enhanced mutation error handling  
        mutationErrorHandler: (error) => {
          console.error('🔴 Mutation Error:', error);
          // Could add error reporting service here
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}