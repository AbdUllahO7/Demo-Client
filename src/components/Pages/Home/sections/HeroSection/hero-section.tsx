"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import HeroSlide from "./HeroSlide"
import HeroNavigation from "./HeroNavigation"
import DotsNavigation from "./DotsNavigation"
import CurvedDivider from "./CurvedDivider"
import { useSectionContent } from "@/hooks/useSectionContent"
import { ThemeDebugger } from "@/contexts/ThemeContext"

interface Slide {
  id: string
  image: string
  title: string
  excerpt: string
  exploreButton: string
  requestButton: string
  exploreButtonType: string
  requestButtonType: string
  exploreButtonUrl: string
  requestButtonUrl: string
  color: string
  order: number
}

interface HeroSectionProps {
  sectionId: string
  websiteId: string
}

export default function HeroSection({ sectionId, websiteId }: HeroSectionProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Define field mappings for Hero section with dynamic {index}
  const heroFieldMappings = {
    id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`, 
    image: "section {index} - Image",
    title: "section {index} - Title",
    excerpt: "section {index} - Description",
    exploreButton:"section {index} - ExploreButton",  
    requestButton: "section {index} - RequestButton",
    
    // URL fields should always use primary language content
    exploreButtonType: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(el => el.name === `Hero ${index !== undefined ? index + 1 : 1} - ExploreButtonType`);
      if (!element) return "default";
      
      // Always use the first translation (primary language) for URL fields
      const primaryTranslation = element.translations?.[0];
      return primaryTranslation?.content || "default";
    },
    
    requestButtonType: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(el => el.name === `Hero ${index !== undefined ? index + 1 : 1} - RequestButtonType`);
      if (!element) return "default";
      
      // Always use the first translation (primary language) for URL fields
      const primaryTranslation = element.translations?.[0];
      return primaryTranslation?.content || "default";
    },
    
    exploreButtonUrl: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(el => el.name === `Hero ${index !== undefined ? index + 1 : 1} - ExploreButtonUrl`);
      if (!element) return "";
      
      // Always use the first translation (primary language) for URL fields
      const primaryTranslation = element.translations?.[0];
      return primaryTranslation?.content || "";
    },
    
    requestButtonUrl: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(el => el.name === `Hero ${index !== undefined ? index + 1 : 1} - RequestButtonUrl`);
      if (!element) return "";
      
      // Always use the first translation (primary language) for URL fields
      const primaryTranslation = element.translations?.[0];
      return primaryTranslation?.content || "";
    },
    
    color: (subsection: any, index?: number) =>
      subsection.elements?.find(el => el.name === `Hero ${index !== undefined ? index + 1 : 1} - Color`)?.defaultContent ||
      "from-primary to-accent",
    order: (subsection: any, index?: number) => subsection.order || index || 0
  }

  // Filter valid slides
  const slideFilter = (item: { image: string; title: string }) => item.image && item.title && item.title.trim() !== ""

  const { contentItems: slides, isLoading, error } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: heroFieldMappings,
    maxItemsPerSubsection: 10, 
    filter: slideFilter
  })


  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }, [scrollToSection])

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const handleMouseEnter = useCallback(() => setAutoplay(false), [])
  const handleMouseLeave = useCallback(() => setAutoplay(true), [])

  useEffect(() => {
    if (autoplay && slides.length > 1) {
      autoplayRef.current = setTimeout(nextSlide, 5000)
    }
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
      }
    }
  }, [currentSlide, autoplay, slides.length, nextSlide])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full bg-wtheme-background overflow-hidden "
      id="hero"
      dir={direction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container relative z-10 px-4 py-16 md:py-24 lg:py-10 h-[100vh]">
        <div className="relative h-[500px] md:h-[600px] lg:h-[650px] w-full">
          <AnimatePresence mode="wait">
            {slides.map(
              (slide, index) =>
                currentSlide === index && (
                  <HeroSlide
                    key={slide.id}
                    slide={slide}
                    index={index}
                    direction={direction}
                    language={language}
                    handleNavClick={handleNavClick}
                  />
                )
            )}
          </AnimatePresence>

          <HeroNavigation
            direction={direction}
            nextSlide={nextSlide}
            prevSlide={prevSlide}
          />

          <DotsNavigation
            slidesCount={slides.length}
            currentSlide={currentSlide}
            goToSlide={goToSlide}
          />
        </div>
      </div>
    </motion.section>
  )
}