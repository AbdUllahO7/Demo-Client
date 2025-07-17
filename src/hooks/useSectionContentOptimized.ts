import { useLanguage } from "@/contexts/language-context"
import { useMemo } from "react"
import { useQuery } from '@tanstack/react-query'

interface UseSectionContentOptimizedProps<T extends { order?: number }> {
  sectionId: string
  websiteId: string
  fieldMappings: Record<string, string | ((subsection: any, index?: number) => any)>
  contentType?: string
  maxItemsPerSubsection?: number
  filter?: (item: T) => boolean
  enabled?: boolean
  limit?: number
}

export function useSectionContentOptimized<T extends Record<string, any>>({
  sectionId,
  websiteId,
  fieldMappings,
  contentType,
  maxItemsPerSubsection = 1,
  filter,
  enabled = true,
  limit = 20
}: UseSectionContentOptimizedProps<T>) {
  const { language } = useLanguage()
  
  // Single optimized query that fetches all needed data
  return useQuery({
    queryKey: ['section-content-optimized', sectionId, websiteId, language, contentType, limit],
    queryFn: async () => {
      // Batch API call to get all related data
      const response = await fetch(`/api/sections/${sectionId}/content?websiteId=${websiteId}&limit=${limit}&contentType=${contentType || ''}`)
      return response.json()
    },
    enabled: enabled && !!sectionId && !!websiteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Process data on the client side
      return useMemo(() => {
        if (!data?.subSections) return []

        const items: T[] = []
        
        data.subSections.forEach((subsection, subsectionIndex) => {
          if (contentType && subsection.contentType !== contentType) return

          const iterations = maxItemsPerSubsection > 1 ? maxItemsPerSubsection : 1

          for (let i = 0; i < iterations; i++) {
            const item: Record<string, any> = {}
            let hasValidFields = false

            Object.entries(fieldMappings).forEach(([key, mapping]) => {
              if (typeof mapping === "function") {
                item[key] = mapping(subsection, i)
                if (item[key]) hasValidFields = true
                return
              }

              const fieldName = maxItemsPerSubsection > 1 ? mapping.replace("{index}", String(i + 1)) : mapping
              
              // Process field based on type
              if (fieldName === "_id") {
                item[key] = subsection._id
                hasValidFields = true
              } else if (fieldName === "createdAt") {
                item[key] = new Date(subsection.createdAt)
                hasValidFields = true
              } else {
                const element = subsection.elements?.find(el => el.name === fieldName)
                if (element) {
                  const getTranslation = (el, lang) =>
                    el?.translations?.find(t => t.language?.languageID === lang)?.content || el?.defaultContent || ""
                  item[key] = element.type === "image" ? element.imageUrl || element.defaultContent || "" : getTranslation(element, language)
                  if (item[key]) hasValidFields = true
                }
              }
            })

            if (!("order" in item) && subsection.order !== undefined) {
              item.order = subsection.order ?? (subsectionIndex * iterations + i)
            }

            if (hasValidFields && (!filter || filter(item as T))) {
              items.push(item as T)
            }
          }
        })

        return items.sort((a, b) => {
          const aOrder = "order" in a ? a.order ?? 0 : 0
          const bOrder = "order" in b ? b.order ?? 0 : 0
          return aOrder - bOrder
        })
      }, [data, language, fieldMappings, maxItemsPerSubsection, filter, contentType])
    }
  })
}