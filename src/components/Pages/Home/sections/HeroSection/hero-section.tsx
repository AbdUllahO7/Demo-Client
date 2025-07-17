"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
// 🚀 OPTIMIZATION: Import only what we need from framer-motion
import { AnimatePresence, motion, LazyMotion, domAnimation } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import HeroSlide from "./HeroSlide"
import DotsNavigation from "./DotsNavigation"
import { useSectionContent } from "@/hooks/useSectionContent"

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

// 🚀 OPTIMIZATION: Lightweight animation variants
const optimizedVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" } // Faster, simpler transition
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" } // Faster exit
  }
}

// 🚀 OPTIMIZATION: Static animation for section (no complex animations)
const sectionVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 } // Very fast
  }
}

export default function HeroSection({ sectionId, websiteId }: HeroSectionProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false) // 🚀 Respect user preferences
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // 🚀 OPTIMIZATION: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Define field mappings for Hero section with dynamic {index}
  const heroFieldMappings = {
    id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`,
    image: "section {index} - Image",
    title: "section {index} - Title",
    excerpt: "section {index} - Description",
    exploreButton: "section {index} - ExploreButton",
    requestButton: "section {index} - RequestButton",
    exploreButtonType: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - ExploreButtonType`,
      )
      if (!element) return "default"
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || "default"
    },
    requestButtonType: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - RequestButtonType`,
      )
      if (!element) return "default"
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || "default"
    },
    exploreButtonUrl: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - ExploreButtonUrl`,
      )
      if (!element) return ""
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || ""
    },
    requestButtonUrl: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - RequestButtonUrl`,
      )
      if (!element) return ""
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || ""
    },
    color: (subsection: any, index?: number) =>
      subsection.elements?.find((el) => el.name === `Hero ${index !== undefined ? index + 1 : 1} - Color`)
        ?.defaultContent || "from-primary to-accent",
    order: (subsection: any, index?: number) => subsection.order || index || 0,
  }

  const slideFilter = (item: { image: string; title: string }) => item.image && item.title && item.title.trim() !== ""

  const {
    contentItems: slides,
    isLoading,
    error,
  } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: heroFieldMappings,
    maxItemsPerSubsection: 10,
    filter: slideFilter,
  })

  // 🚀 OPTIMIZATION: Mark component as loaded when slides are ready
  useEffect(() => {
    if (slides.length > 0 && !isLoading) {
      setIsLoaded(true)
      if (typeof window !== 'undefined') {
        performance.mark('hero-section-ready')
      }
    }
  }, [slides, isLoading])

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault()
      scrollToSection(sectionId)
    },
    [scrollToSection],
  )

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
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

  // 🚀 OPTIMIZATION: Simple loading state without complex animations
  if (isLoading || !isLoaded) {
    return (
      <div className="relative w-full bg-wtheme-background overflow-hidden h-[100vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    )
  }

  // 🚀 OPTIMIZATION: Return simple version if reduced motion is preferred
  if (reducedMotion) {
    return (
      <section
        className="relative w-full bg-wtheme-background overflow-hidden"
        id="hero"
        dir={direction}
      >
        <div className="container relative z-10 px-4 py-16 md:py-24 lg:py-10 h-[100vh]">
          <div className="relative flex items-center justify-center h-[500px] md:h-[600px] lg:h-[650px] w-full">
            {/* Navigation arrows */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-4 md:-ml-8">
              <button
                onClick={prevSlide}
                className="flex items-center text-wtheme-text justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors duration-200 shadow-lg"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Slide Content - No animations */}
            <div className="relative h-full w-full max-w-6xl mx-auto px-8 md:px-16">
              {slides[currentSlide] && (
                <HeroSlide
                  key={slides[currentSlide].id}
                  slide={slides[currentSlide]}
                  index={currentSlide}
                  direction={direction}
                  language={language}
                  handleNavClick={handleNavClick}
                />
              )}
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-4 md:-mr-8">
              <button
                onClick={nextSlide}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-wtheme-text hover:bg-white/20 transition-colors duration-200 shadow-lg"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <DotsNavigation slidesCount={slides.length} currentSlide={currentSlide} goToSlide={goToSlide} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      
      {/* 🚀 OPTIMIZATION: Use LazyMotion for smaller bundle */}
      <LazyMotion features={domAnimation}>
        <motion.section
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          className="relative w-full bg-wtheme-background overflow-hidden"
          id="hero"
          dir={direction}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="container relative z-10 px-4 py-16 md:py-24 lg:py-10 h-[100vh]">
            <div className="relative flex items-center justify-center h-[500px] md:h-[600px] lg:h-[650px] w-full">
              {/* Left Arrow */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-4 md:-ml-8">
                <button
                  onClick={prevSlide}
                  className="flex items-center text-wtheme-text justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors duration-200 shadow-lg"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* 🚀 OPTIMIZATION: Simplified slide content with faster animations */}
              <div className="relative h-full w-full max-w-6xl mx-auto px-8 md:px-16">
                <AnimatePresence mode="wait">
                  {slides.map(
                    (slide, index) =>
                      currentSlide === index && (
                        <motion.div
                          key={slide.id}
                          variants={optimizedVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="absolute inset-0"
                        >
                          <HeroSlide
                            slide={slide}
                            index={index}
                            direction={direction}
                            language={language}
                            handleNavClick={handleNavClick}
                          />
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>

              {/* Right Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-4 md:-mr-8">
                <button
                  onClick={nextSlide}
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-wtheme-text hover:bg-white/20 transition-colors duration-200 shadow-lg"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <DotsNavigation slidesCount={slides.length} currentSlide={currentSlide} goToSlide={goToSlide} />
            </div>
          </div>
        </motion.section>
      </LazyMotion>
    </>
  )
}