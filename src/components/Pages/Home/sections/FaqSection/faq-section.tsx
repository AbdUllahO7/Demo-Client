"use client"

import React, { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

// Import components
import { FaqHeader } from "./FaqHeader"
import { FaqItem } from "./FaqItem"
import { translationsDataFaq } from "../../ConstData/ConstData"
import { BackgroundEffects } from "./BackgroundEffects"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function FaqSection({ websiteId, sectionId }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const [searchQuery, setSearchQuery] = useState("")
  const { t, direction, language } = useLanguage()
  
  const isRTL = direction === "rtl"

  const {
    content,
    isLoading: sectionLoading,
    error: sectionError,
  } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "faqs", // Updated to "faqs" to match the context
  })

  const featureFilter = (item: { answer: string }) => item.answer && item.answer.trim() !== ""
    
    const ContentItemsMappings = {
      id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`,
      question: "FAQ {index} - Question",
      answer: "FAQ {index} - Answer",
      color: () => "theme-gradient",
      order: (subsection: any, index?: number) => subsection.order || index || 0,
    }

  const {
    contentItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: ContentItemsMappings,
    maxItemsPerSubsection: 13,
    filter: featureFilter,
  })

  // Filter contentItems based on searchQuery
  const filteredFaqs = contentItems.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section 
      className="relative w-full py-32 overflow-hidden bg-wtheme-background " 
      id="faq"
      dir={direction}
    >
      <BackgroundEffects />

      <div className="container relative z-10 px-4 md:px-6" ref={ref}>
        <FaqHeader 
          content={content} 
          isInView={isInView} 
          isRTL={isRTL} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid gap-6">
            {filteredFaqs.map((faq, index) => (
              <FaqItem 
                key={faq.id} // Use faq.id for unique key
                faq={faq} // Add default category if missing
                index={index} 
                isInView={isInView} 
                isRTL={isRTL}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}