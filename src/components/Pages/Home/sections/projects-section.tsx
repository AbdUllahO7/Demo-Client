"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function ProjectsSection({ sectionId, websiteId }) {
  const { language, direction } = useLanguage()

  const isRTL = direction === "rtl"
  const [currentIndex, setCurrentIndex] = useState(1) // Start at 1 (middle set)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const intervalRef = useRef(null)

  const currentLang = language as "en" | "ar" | "tr"
  const { content, error: sectionError } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "projects",
  })

  const { contentItems, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",
      title: "Title",
      excerpt: "Description",
      readMore: "Back Link Text",
      category: "Category",
      date: "createdAt",
      section: "section",
    },
  })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Filter valid projects
  const validProjects = (contentItems || []).filter(
    (project) => project.id && project.image && project.title && project.excerpt,
  )

  // Create triple array for infinite loop
  const projects = validProjects.length > 0 ? [...validProjects, ...validProjects, ...validProjects] : []

  // Get items per view based on screen size
  const getItemsPerView = () => {
    if (isMobile) return 1
    return 3
  }

  // Auto-play functionality
  const startAutoPlay = () => {
    if (validProjects.length === 0) return
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 4000)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [validProjects.length])

  // Simplified navigation functions
  const nextSlide = () => {
    if (isTransitioning || validProjects.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning || validProjects.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Handle infinite loop reset
  useEffect(() => {
    if (validProjects.length === 0) return
    if (currentIndex <= 0) {
      setTimeout(() => {
        setCurrentIndex(validProjects.length * 2)
      }, 500)
    } else if (currentIndex >= validProjects.length * 2 + 1) {
      setTimeout(() => {
        setCurrentIndex(1)
      }, 500)
    }
  }, [currentIndex, validProjects.length])

  // Get current slide for dots - Fixed calculation
  const getCurrentSlide = () => {
    if (validProjects.length === 0) return 0
    // Ensure we always get a valid index between 0 and validProjects.length - 1
    let adjustedIndex = (currentIndex - 1) % validProjects.length
    if (adjustedIndex < 0) adjustedIndex = validProjects.length + adjustedIndex
    return adjustedIndex
  }

  // Calculate transform for responsive design
  const getTransform = () => {
    const itemsPerView = getItemsPerView()
    const percentage = 100 / itemsPerView
    const gap = isMobile ? 0 : 24 // No gap on mobile to ensure single card display
    const gapOffset = isMobile ? 0 : (currentIndex * gap) / itemsPerView

    // Always use standard LTR transform, but reverse in RTL
    if (isRTL) {
      return `translateX(calc(${currentIndex * percentage}% - ${gapOffset}px))`
    } else {
      return `translateX(calc(-${currentIndex * percentage}% + ${gapOffset}px))`
    }
  }

  // Handle dot navigation
  const handleDotClick = (index) => {
    if (isTransitioning) return
    stopAutoPlay()
    setCurrentIndex(validProjects.length + index + 1)
    setTimeout(startAutoPlay, 5000)
  }

  // Handle errors
  if (sectionError || itemsError) {
    return (
      <section className="py-12 md:py-20 bg-wtheme-background" dir={direction}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load projects</p>
        </div>
      </section>
    )
  }

  // Handle empty state
  if (validProjects.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-wtheme-background" dir={direction}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-wtheme-text/60">No projects available</p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="py-12 md:py-20 bg-wtheme-background overflow-hidden"
      dir={direction}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <p className="text-primary text-sm uppercase tracking-wider mb-2 md:mb-4">
            {content.sectionLabel || "Portfolio"}
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-wtheme-text mb-4 md:mb-6">
            {content.sectionTitle || "Our Projects"}
          </h2>
          <p className="text-base md:text-lg text-wtheme-text/70 max-w-2xl mx-auto px-4">
            {content.sectionDescription || "Explore our latest work"}
          </p>
        </div>

        {/* Carousel Container with External Navigation */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Left Arrow - Always Previous */}
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={prevSlide}
                disabled={isTransitioning}
                className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} rounded-full bg-white/90 backdrop-blur border shadow-lg hover:bg-white transition-all duration-200 hover:scale-105`}
              >
                {isRTL ? (
                  <ChevronRight className={`${isMobile ? "w-4 h-4" : "w-6 h-6"}`} />
                ) : (
                  <ChevronLeft className={`${isMobile ? "w-4 h-4" : "w-6 h-6"}`} />
                )}
              </Button>
            </div>

            {/* Carousel Track */}
            <div className="flex-1 overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: getTransform(),
                }}
              >
                {projects.map((project, index) => (
                  <div
                    key={`${project.id}-${Math.floor(index / validProjects.length)}`}
                    className={`flex-shrink-0 ${
                      isMobile
                        ? "w-full" // Full width on mobile - only 1 card visible
                        : "w-1/3" // 1/3 width on desktop - 3 cards visible
                    }`}
                  >
                    <div className={isMobile ? "" : "px-3"}>
                      <ProjectCard
                        project={project}
                        viewCaseStudyText={content.readMore || "View Project"}
                        isMobile={isMobile}
                        isRTL={isRTL}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow - Always Next */}
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={nextSlide}
                disabled={isTransitioning}
                className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} rounded-full bg-white/90 backdrop-blur border shadow-lg hover:bg-white transition-all duration-200 hover:scale-105`}
              >
                {isRTL ? (
                  <ChevronLeft className={`${isMobile ? "w-4 h-4" : "w-6 h-6"}`} />
                ) : (
                  <ChevronRight className={`${isMobile ? "w-4 h-4" : "w-6 h-6"}`} />
                )}
              </Button>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-6 md:mt-8 gap-2">
            {validProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`${isMobile ? "w-2 h-2" : "w-3 h-3"} rounded-full transition-all duration-300 ${
                  getCurrentSlide() === index
                    ? `bg-primary ${isMobile ? "w-6" : "w-8"}`
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          {/* Counter - Fixed to always start from 1 */}
          <div className="text-center mt-2 md:mt-4">
            <span className="text-xs md:text-sm text-wtheme-text/60">
              {(() => {
                const current = getCurrentSlide() + 1 // This will now be 1, 2, 3, 4, 5
                const total = validProjects.length

                if (currentLang === "ar") {
                  return `${total} من ${current}`
                } else if (currentLang === "tr") {
                  return `${total} tanesinden ${current}`
                } else {
                  return `${current} of ${total}`
                }
              })()}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, viewCaseStudyText, isMobile, isRTL }) {
  return (
    <Link
      href={`/Pages/ProjectsDetailPage/${project.id}`}
      className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group relative"
    >
      {/* Arrow Button - Positioned correctly for RTL */}
      <div
        className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${isRTL ? "translate-x-2" : "-translate-x-2"} group-hover:translate-x-0`}
      >
        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
          <ArrowRight
            className={`w-5 h-5 transition-transform group-hover:${isRTL ? "-translate-x-1" : "translate-x-1"} ${isRTL ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Image */}
      <div className={`relative ${isMobile ? "h-40" : "h-48"} overflow-hidden`}>
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          priority={true}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {project.category && (
          <div className={`absolute top-3 ${isRTL ? "right-3 md:right-4" : "left-3 md:left-4"}`}>
            <span
              className={`bg-primary text-white ${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-xs"} rounded-full font-medium`}
            >
              {project.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className={`${isMobile ? "p-4" : "p-6"}`}>
        <h3
          className={`${isMobile ? "text-lg" : "text-xl"} font-body text-wtheme-text mb-2 md:mb-3 line-clamp-2 group-hover:text-wtheme-hover transition-colors`}
        >
          {project.title}
        </h3>
        <p className={`text-body text-wtheme-text ${isMobile ? "mb-3 text-sm" : "mb-4 text-base"} line-clamp-3`}>
          {project.excerpt}
        </p>
        {project.technologies && (
          <div className={`flex flex-wrap gap-1 ${isMobile ? "mb-3" : "mb-4"}`}>
            {project.technologies.slice(0, 3).map((tech, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        )}
        <div
          className={`text-primary font-medium ${isMobile ? "text-sm" : "text-sm"} group-hover:underline transition-all`}
        >
          {viewCaseStudyText}
        </div>
      </CardContent>
    </Link>
  )
}
