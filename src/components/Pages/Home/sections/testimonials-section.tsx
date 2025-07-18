"use client"

import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Quote, Star, User } from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { iconMap } from "@/utils/IconMap"
import { FadeIn } from "@/utils/lightweightAnimations"

export default function TestimonialsSection({ websiteId, sectionId }) {
  const ref = useRef(null)
  const carouselRef = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { language, direction } = useLanguage()

  const {
    content,
    isLoading: sectionLoading,
    error: sectionError,
    refetch,
    formatDate,
  } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "clientComments",
  })

  const featureFilter = (item: { title: string }) => item.title && item.title.trim() !== ""

  const ContentItemsMappings = {
    id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`,
    date: "createdAt",
    icon: (subsection: any, index?: number) =>
      subsection.elements?.find((el) => el.name === `ClientComments ${index !== undefined ? index + 1 : 1} - Icon`)
        ?.defaultContent || null,
    title: "ClientComments {index} - Title",
    excerpt: "ClientComments {index} - Description",
    image: "Background Image",
    color: () => "",
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

  // Reset active index on language change
  useEffect(() => {
    setActiveIndex(0)
  }, [language])

  // Auto-play carousel
  useEffect(() => {
    let interval
    if (isAutoPlaying && contentItems.length > 1) {
      interval = setInterval(() => {
        nextTestimonial()
      }, 5000)
    }
    return () => interval && clearInterval(interval)
  }, [isAutoPlaying, activeIndex, contentItems])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const nextTestimonial = () => setActiveIndex((prev) => (prev === contentItems.length - 1 ? 0 : prev + 1))
  const prevTestimonial = () => setActiveIndex((prev) => (prev === 0 ? contentItems.length - 1 : prev - 1))

  const getVisibleItems = () => {
    const items = contentItems
    if (items.length <= 3) return items
    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    return [items[prevIndex], items[activeIndex], items[nextIndex]]
  }

  const isLoading = sectionLoading || itemsLoading
  const error = sectionError || itemsError

  return (
    <section className="relative w-full py-20 overflow-hidden bg-wtheme-background" id="testimonials" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2 text-body text-primary tracking-wider uppercase"
          >
            {content.sectionLabel}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight max-w-3xl text-wtheme-text"
          >
            {content.sectionTitle || "What Our Clients Say"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-wtheme-text font-body leading-relaxed"
          >
            {content.sectionDescription ||
              "Discover what our satisfied clients have to say about their experience working with us."}
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-wtheme-text font-body mt-4">{content.loading || "Loading testimonials..."}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-wtheme-text/70 font-body">{content.error || "Failed to load testimonials"}</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              {content.retry || "Try Again"}
            </Button>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-wtheme-text/70 font-body">{content.error || "No testimonials available"}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              {content.retry || "Refresh"}
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop view: Grid layout with external arrows */}
            <div className="hidden md:block">
              {contentItems.length > 3 ? (
                <div className="flex items-center gap-8" dir="rtl">
                  {/* Left Arrow */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 rounded-full bg-wtheme-background/90 backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background hover:scale-110 transition-all duration-200"
                    onClick={direction === "rtl" ? nextTestimonial : prevTestimonial}
                  >
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">{content.previous || "Previous"}</span>
                  </Button>

                  {/* Testimonials Container */}
                  <div
                    ref={carouselRef}
                    className="flex-1"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <AnimatePresence mode="wait">
                      <FadeIn
                        key={`desktop-${activeIndex}`}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"

                      >
                        {getVisibleItems().map((testimonial, index) => (
                          <TestimonialCard
                            key={`${testimonial.id}-${index}`}
                            testimonial={testimonial}
                            index={index}
                            isInView={isInView}
                            direction={direction}
                            formatDate={formatDate}
                          />
                        ))}
                      </FadeIn>
                    </AnimatePresence>
                  </div>

                  {/* Right Arrow */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 rounded-full bg-wtheme-background/90 backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background hover:scale-110 transition-all duration-200"
                    onClick={direction === "rtl" ? prevTestimonial : nextTestimonial}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">{content.next || "Next"}</span>
                  </Button>
                </div>
              ) : (
                <div ref={carouselRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {contentItems.map((testimonial, index) => (
                      <TestimonialCard
                        key={`${testimonial.id}-${index}`}
                        testimonial={testimonial}
                        index={index}
                        isInView={isInView}
                        direction={direction}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile view: Carousel with external arrows */}
            <div className="md:hidden">
              {contentItems.length > 1 ? (
                <div className="space-y-6">
                  {/* Arrows Row */}
                  <div className="flex justify-between items-center px-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-wtheme-background/90 backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background"
                      onClick={direction === "rtl" ? nextTestimonial : prevTestimonial}
                    >
                      {direction === "rtl" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                      <span className="sr-only">{content.previous || "Previous"}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-wtheme-background/90 backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background"
                      onClick={direction === "rtl" ? prevTestimonial : nextTestimonial}
                    >
                      <ChevronRight className="h-5 w-5" />
                      <span className="sr-only">{content.next || "Next"}</span>
                    </Button>
                  </div>

                  {/* Testimonial Container */}
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className="overflow-hidden">
                      <AnimatePresence mode="wait">
                        <FadeIn
                          key={`mobile-${activeIndex}`}
                    
                          className="w-full"
                        >
                          <TestimonialCard
                            testimonial={contentItems[activeIndex]}
                            index={0}
                            isInView={true}
                            direction={direction}
                            formatDate={formatDate}
                          />
                        </FadeIn>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Dots navigation */}
                  <div className="flex justify-center gap-2">
                    {contentItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeIndex === index ? "bg-primary w-8" : "bg-wtheme-text/30 w-2 hover:bg-wtheme-text/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <TestimonialCard
                    testimonial={contentItems[0]}
                    index={0}
                    isInView={true}
                    direction={direction}
                    formatDate={formatDate}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial, index, isInView, direction, formatDate }) {
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: false, amount: 0.3 })
  const isRTL = direction === "rtl"

  const renderIcon = () => {
    if (React.isValidElement(testimonial.icon)) {
      return testimonial.icon // If it's already a React element, use it
    }
    return iconMap[testimonial.icon as string] || null // Map string to component, fallback to null
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
  }

  return (
    <FadeIn
    
    
      className="group relative overflow-hidden rounded-2xl bg-wtheme-background border border-wtheme-border/50 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col"
    >
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

      <div className="p-8 flex-grow flex flex-col">
        {/* Header with icon and stars */}
        <div className="flex items-center justify-between mb-6">
          <FadeIn
            className="w-12 h-12 rounded-full flex items-center justify-center text-wtheme-text shadow-lg"
          
          >
            {renderIcon()}
          </FadeIn>

          <FadeIn
            className="flex items-center gap-1"

          >
            {renderStars()}
          </FadeIn>
        </div>

        {/* Quote */}
        <FadeIn
          className="flex-grow mb-6"
       
        >
          <Quote className={`h-8 w-8 text-wtheme-text mb-4 ${isRTL ? "ml-auto" : ""}`} />
          <p className={`text-wtheme-text font-body leading-relaxed ${isRTL ? "text-right" : ""} text-lg`}>
            {testimonial.excerpt}
          </p>
        </FadeIn>

        {/* Client info */}
        <FadeIn
          className="pt-6 border-t border-wtheme-border/30 flex items-center"
         
        >
          <div className={`relative ${isRTL ? "ml-4" : "mr-4"}`}>
            <div className="w-12 h-12 rounded-full bg-wtheme-text/20 flex items-center justify-center">
              <User className="w-6 h-6 text-wtheme-text/60" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-theme-gradient border-2 border-wtheme-background"></div>
          </div>

          <div className={`flex-grow ${isRTL ? "text-right" : ""}`}>
            <h4 className="font-heading font-semibold text-wtheme-text group-hover:text-wtheme-hover transition-colors duration-300">
              {testimonial.title || "Client Name"}
            </h4>
          
          </div>
        </FadeIn>
      </div>

      {/* Hover effect */}
      <FadeIn
        className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-theme-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500"
 
      ></FadeIn>
    </FadeIn>
  )
}
