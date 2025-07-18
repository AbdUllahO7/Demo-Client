// src/components/CaseStudies/CaseStudiesSection.tsx
"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { caseStudiesData, sectionTranslations } from "./data"
import { CaseStudyCard } from "./CaseStudyCard"
import { FadeIn } from "@/utils/lightweightAnimations"


export default function CaseStudiesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { language, direction } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Get case studies for current language
  const caseStudies = caseStudiesData[language] || caseStudiesData.en
  
  // Get section translations for current language
  const sectionText = sectionTranslations[language] || sectionTranslations?.en

  const nextCase = () => {
    setActiveIndex((prev) => (prev === caseStudies.length - 1 ? 0 : prev + 1))
  }

  const prevCase = () => {
    setActiveIndex((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1))
  }

  return (
    <section id="caseStudies" className="relative w-full overflow-hidden" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30"></div>

      <div className="absolute top-0 left-0 w-full h-40 bg-grid-pattern opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-full h-40 bg-grid-pattern opacity-5"></div>

      <FadeIn
       
        className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-digitek-pink blur-3xl"
      />
      <FadeIn
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <FadeIn
      
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
             {sectionText.badge}
          </FadeIn>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl"
          >
            <span className="bg-clip-text bg-gradient-to-r dark:text-white text-black">
              {sectionText.title}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-muted-foreground text-lg"
          >
            {sectionText.description}
          </motion.p>
        </div>

        {/* Desktop view: Featured case study */}
        <div className="hidden md:block">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            {caseStudies.slice(0, 2).map((study, index) => (
              <CaseStudyCard key={index} study={study} index={index} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* Mobile view: Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <FadeIn

              className="flex"
            >
              {caseStudies.map((study, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <CaseStudyCard study={study} index={index} isInView={true} />
                </div>
              ))}
            </FadeIn>
          </div>

          {/* Navigation controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={prevCase}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous case study</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={nextCase}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next case study</span>
            </Button>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index ? "bg-primary w-8" : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to case study ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}