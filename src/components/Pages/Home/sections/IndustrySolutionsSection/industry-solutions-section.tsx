"use client"

import { useLanguage } from "@/contexts/language-context"
import SectionBackground from "./SectionBackground"
import SectionHeader from "./SectionHeader"
import IndustriesGrid from "./IndustriesGrid"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver"


export default function IndustrySolutionsSection({ sectionId, websiteId }) {
  const { isInView } = useOptimizedIntersection({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '100px'
  })
  const {  direction } = useLanguage()

  const { content} = useSectionLogic({
      sectionId,
      websiteId,
      itemsKey: "industries",
    })

  const { contentItems } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",    
      title: "Title",               
      excerpt: "Description",      
      color: () => "theme-gradient",
      order: (subsection: any) => subsection.order || 0
    },
  })

  return (
    <section id="industry" className="relative w-full py-12 overflow-hidden bg-wtheme-background" dir={direction}>
      <SectionBackground />

      <div className="container relative z-10 px-4 md:px-6">
        <div  className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
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