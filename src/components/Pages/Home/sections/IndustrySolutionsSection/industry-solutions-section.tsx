"use client"

import { useLanguage } from "@/contexts/language-context"
import SectionBackground from "./SectionBackground"
import SectionHeader from "./SectionHeader"
import IndustriesGrid from "./IndustriesGrid"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver"

interface Industry {
  id: string
  title: string
  excerpt: string
  image: string
  color: string
  order: number
}

export default function IndustrySolutionsSection({ sectionId, websiteId }) {
  const { ref, isInView } = useOptimizedIntersection({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '100px'
  })
  const {  direction } = useLanguage()

  const { content, isLoading: sectionLoading, error: sectionError, refetch, formatDate } = useSectionLogic({
      sectionId,
      websiteId,
      itemsKey: "industries",
    })

  // For SINGLE items (each subsection has one industry)
  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent<Industry>({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",    // or "Industry - Image" 
      title: "Title",               // or "Industry - Title"
      excerpt: "Description",       // or "Industry - Description"
      color: () => "theme-gradient",
      order: (subsection: any) => subsection.order || 0
    },
  })

  return (
    <section id="industry" className="relative w-full py-12 overflow-hidden bg-wtheme-background" dir={direction}>
      {/* Background elements */}
      <SectionBackground />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <SectionHeader
            isInView={isInView}
            sectionTitle={content.sectionLabel}
            mainTitle={content.sectionTitle}
            mainDescription={content.sectionDescription}
          />
        </div>

        <IndustriesGrid 
          industries={contentItems} 
          isInView={isInView} 
        />
      </div>
    </section>
  )
}