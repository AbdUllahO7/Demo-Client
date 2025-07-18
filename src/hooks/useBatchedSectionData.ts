// src/hooks/useBatchedSectionData.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from "@/contexts/language-context";
import apiClient from '@/lib/api-client';

interface BatchedSectionDataProps {
  websiteId: string;
  enabled?: boolean;
}

interface BatchedSectionResponse {
  sectionsData: any;
  allSubSections: any;
  allSectionItems: any;
}

export function useBatchedSectionData({ websiteId, enabled = true }: BatchedSectionDataProps) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  // 🚀 OPTIMIZATION: Single API call for all website data
  const batchedQuery = useQuery({
    queryKey: ['website-complete-data', websiteId, language],
    queryFn: async (): Promise<BatchedSectionResponse> => {
      // Batch multiple API calls into one
      const [sectionsResponse, subSectionsResponse, sectionItemsResponse] = await Promise.all([
        apiClient.get(`/sections/website/${websiteId}`, {
          params: { 
            includeInactive: false,
            language: language
          }
        }),
        apiClient.get(`/subsections/website/${websiteId}`, {
          params: { 
            activeOnly: true,
            limit: 100,
            includeContentCount: false
          }
        }),
        apiClient.get(`/section-items/website/${websiteId}`, {
          params: { 
            activeOnly: true,
            limit: 100,
            includeSubSectionCount: true
          }
        })
      ]);

      return {
        sectionsData: sectionsResponse.data,
        allSubSections: subSectionsResponse.data,
        allSectionItems: sectionItemsResponse.data
      };
    },
    enabled: !!websiteId && enabled,
    
    // 🚀 OPTIMIZATION: Aggressive caching for website data
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    
    // 🚀 OPTIMIZATION: Populate individual caches
    onSuccess: (data) => {
      // Cache sections data
      if (data.sectionsData) {
        queryClient.setQueryData(
          ['sections', 'website', websiteId, { includeInactive: false, language }], 
          data.sectionsData
        );
      }
      
      // Cache subsections data  
      if (data.allSubSections) {
        queryClient.setQueryData(
          ['subsections', 'website', websiteId, { activeOnly: true, limit: 100, skip: 0, includeContentCount: false }],
          data.allSubSections
        );
      }
      
      // Cache section items data
      if (data.allSectionItems) {
        queryClient.setQueryData(
          ['sectionItems', 'website', websiteId, { activeOnly: true, limit: 100, skip: 0, includeSubSectionCount: true }],
          data.allSectionItems
        );
      }
    }
  });

  // 🚀 OPTIMIZATION: Helper functions to extract specific data
  const getSectionById = (sectionId: string) => {
    return batchedQuery.data?.sectionsData?.data?.find((section: any) => section._id === sectionId);
  };

  const getSubSectionsBySectionId = (sectionId: string) => {
    return batchedQuery.data?.allSubSections?.data?.filter((subSection: any) => 
      subSection.sectionItem?.section === sectionId
    ) || [];
  };

  const getSectionItemsBySectionId = (sectionId: string) => {
    return batchedQuery.data?.allSectionItems?.data?.filter((item: any) => 
      item.section === sectionId
    ) || [];
  };

  return {
    // Main query state
    isLoading: batchedQuery.isLoading,
    error: batchedQuery.error,
    data: batchedQuery.data,
    
    // Helper functions
    getSectionById,
    getSubSectionsBySectionId, 
    getSectionItemsBySectionId,
    
    // Individual data accessors
    sectionsData: batchedQuery.data?.sectionsData,
    allSubSections: batchedQuery.data?.allSubSections,
    allSectionItems: batchedQuery.data?.allSectionItems,
    
    // Query controls
    refetch: batchedQuery.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['website-complete-data', websiteId] 
      });
    }
  };
}