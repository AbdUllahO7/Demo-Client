"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import HeroSlide from "./HeroSlide"
import DotsNavigation from "./DotsNavigation"
import { useSectionContent } from "@/hooks/useSectionContent"

interface HeroSectionProps {
  sectionId: string
  websiteId: string
}

export default function HeroSection({ sectionId, websiteId }: HeroSectionProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

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

  // Filter valid slides
  const slideFilter = (item: { image: string; title: string }) => item.image && item.title && item.title.trim() !== ""

  const { contentItems: slides } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: heroFieldMappings,
    maxItemsPerSubsection: 10,
    filter: slideFilter,
  })

  // Touch handlers for swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null) // Reset end position
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && slides.length > 1) {
      nextSlide()
    }
    if (isRightSwipe && slides.length > 1) {
      prevSlide()
    }
  }

  // Preload critical images
  useEffect(() => {
    if (slides.length > 0) {
      const preloadImages = async () => {
        // Preload first slide image (LCP candidate)
        if (slides[0]?.image) {
          const link = document.createElement("link")
          link.rel = "preload"
          link.as = "image"
          link.href = slides[0].image
          link.fetchPriority = "high"
          document.head.appendChild(link)
        }

        // Preload next few images in background
        const imagesToPreload = slides.slice(0, 3) // First 3 slides
        const promises = imagesToPreload.map((slide) => {
          return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = resolve
            img.onerror = reject
            img.src = slide.image
          })
        })

        try {
          await Promise.allSettled(promises)
          setImagesLoaded(true)
        } catch (error) {
          console.warn("Some images failed to preload:", error)
          setImagesLoaded(true) // Continue anyway
        }
      }

      preloadImages()
    }
  }, [slides])

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

  // Optimized autoplay with better cleanup
  useEffect(() => {
    if (autoplay && slides.length > 1 && imagesLoaded) {
      autoplayRef.current = setTimeout(nextSlide, 5000)
    }
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [currentSlide, autoplay, slides.length, nextSlide, imagesLoaded])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full bg-wtheme-background overflow-hidden min-h-[100dvh] h-[100dvh]"
      id="hero"
      dir={direction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide Content - Optimized container layout */}
      <div className="absolute inset-0 z-10">
        <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" initial={false}>
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
                ),
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls Overlay */}
      {slides.length > 1 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Mobile Navigation - Optimized for touch */}
          <div className="md:hidden h-full flex items-center justify-between px-3 sm:px-4">
            <button
              onClick={prevSlide}
              className="pointer-events-auto flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/60 active:bg-black/70 transition-all duration-200 shadow-lg active:scale-95 touch-manipulation"
              aria-label="Previous slide"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={direction === 'rtl' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="pointer-events-auto flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/60 active:bg-black/70 transition-all duration-200 shadow-lg active:scale-95 touch-manipulation"
              aria-label="Next slide"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={direction === 'rtl' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation - Outside content area */}
          <div className="hidden md:block">
            {/* Left Arrow */}
            <div className="absolute left-4 lg:left-6 xl:left-8 top-1/2 -translate-y-1/2">
              <button
                onClick={prevSlide}
                className="pointer-events-auto flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'rtl' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                </svg>
              </button>
            </div>

            {/* Right Arrow */}
            <div className="absolute right-4 lg:right-6 xl:right-8 top-1/2 -translate-y-1/2">
              <button
                onClick={nextSlide}
                className="pointer-events-auto flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'rtl' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Dots Navigation - Bottom center with safe area */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 pb-safe">
            <div className="pointer-events-auto">
              <DotsNavigation slidesCount={slides.length} currentSlide={currentSlide} goToSlide={goToSlide} />
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar - Mobile optimized */}
      {slides.length > 1 && (
        <div className="absolute top-0 left-0 right-0 z-30">
          <div className="h-1 bg-black/20">
            <motion.div
              className="h-full bg-white/80"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Mobile Slide Counter - Better positioning */}
      {slides.length > 1 && (
        <div className="md:hidden absolute top-4 sm:top-6 right-4 sm:right-6 z-30 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
          <span className="text-white text-xs sm:text-sm font-medium tabular-nums">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      )}

      {/* Swipe indicator for mobile */}
      <div className="md:hidden absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 opacity-70">
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Swipe</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.section>
  )
}