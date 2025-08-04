"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import BackgroundElements from "./BackgroundElements"
import SectionHeader from "./SectionHeader"
import FeaturesList from "./FeaturesList"
import FeatureImage from "./FeatureImage"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"


export default function FeaturesSection({ sectionId, websiteId }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const {  direction } = useLanguage()
  const { content} = useSectionLogic({
      sectionId,
      websiteId,
      itemsKey: "Features",
    })
  const featureFilter = (item: { title: string }) => item.title && item.title.trim() !== ""

  
  const heroFieldMappings = {
      id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`, 
      icon: (subsection: any, index?: number) => 
        subsection.elements?.find(el => el.name === `ChoseUs ${index !== undefined ? index + 1 : 1} - Icon`)?.defaultContent ||
        null,
      title: "ChoseUs {index} - Title",
      excerpt: "ChoseUs {index} - Description",
      image: "Background Image",
      color: (subsection: any, index?: number) =>
        subsection.elements?.find(el => el.name === `Hero ${index !== undefined ? index + 1 : 1} - Color`)?.defaultContent ||
        "from-digitek-orange to-digitek-pink",
      order: (subsection: any, index?: number) => subsection.order || index || 0
  }

  const { contentItems,  } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: heroFieldMappings,
    maxItemsPerSubsection: 13, // Adjust as needed
    filter: featureFilter
  })

  return (
    <section id="features" className="relative w-full py-20 overflow-hidden bg-wtheme-background" dir={direction}>
      <BackgroundElements />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div ref={ref} className="flex flex-col">
            <SectionHeader 
              isInView={isInView} 
              sectionTitle={content.sectionLabel}
              mainTitle={content.sectionTitle}
              mainDescription={content.sectionDescription}
            />

            <FeaturesList 
              features={contentItems} 
              isInView={isInView} 
            />
          </div>

           <FeatureImage 
            isInView={isInView} 
            image={contentItems[0]?.image} 
          /> 
        </div>
      </div>
    </section>
  )
}