"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Calendar } from "lucide-react"
import { GoBackButton } from "@/components/GoBackButton"
import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { FadeIn } from "@/utils/lightweightAnimations"

export function NewsHero({ news, t }) {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  const { language } = useLanguage()

  // Default color if not provided
  const color = news.color || "theme-gradient"

  // Handle missing news or data
  if (!news || !news.data) {
    return (
      <section className="relative w-full py-20 overflow-hidden bg-wtheme-background">
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <GoBackButton sectionName="news" title=""/>
            <p className="text-red-600 font-body">Error: News data is missing</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full py-20 overflow-hidden bg-wtheme-background">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-wtheme-background"></div>

      <FadeIn
     
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl"
      />
      <FadeIn
      
        className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full bg-accent blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Go back button */}
          <GoBackButton sectionName="news" title={news.backLinkText}/>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-accent font-medium text-white bg-primary">
              {news.category}
            </span>
            <div className="flex items-center text-sm text-wtheme-text font-body">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(news.data, language)}
            </div>
          </div>

          <motion.h1
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-6 text-wtheme-text"
          >
            {news.title}
          </motion.h1>
        </div>
      </div>
    </section>
  )
}