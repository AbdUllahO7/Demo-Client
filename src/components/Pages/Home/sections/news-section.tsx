"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {  AnimatePresence } from "framer-motion"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { useLanguage } from "@/contexts/language-context"
import { FadeIn } from "@/utils/lightweightAnimations"
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver"

export default function NewsSection({ sectionId, websiteId }) {
  const carouselRef = useRef(null)
  const { ref, isInView } = useOptimizedIntersection({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '100px'
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { language } = useLanguage()


  const { content, isLoading: sectionLoading, error: sectionError, refetch, direction, formatDate } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "news",
  })

  
  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",
      title: "Title",
      excerpt: "Description",
      readMore: "news Details",
      AddSubNavigation : "Add SubNavigation",
      date: "createdAt",
      color: () => ""
    }
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
        nextNews()
      }, 5000)
    }
    return () => interval && clearInterval(interval)
  }, [isAutoPlaying, activeIndex, contentItems])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const nextNews = () =>
    setActiveIndex((prev) => (prev === contentItems.length - 1 ? 0 : prev + 1))

  const prevNews = () =>
    setActiveIndex((prev) => (prev === 0 ? contentItems.length - 1 : prev - 1))

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
    <section id="news" className="relative w-full py-20 overflow-hidden bg-wtheme-background" dir={direction}>
    
      <FadeIn
   
        className="absolute top-1/3 left-0 w-96 h-96 rounded-full bg-accent blur-3xl"
      />
      <FadeIn
       
        className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <span
              className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
            >
              {content.sectionLabel}
            </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight max-w-3xl text-wtheme-text"
          >
            {content.sectionTitle}
          </h2>

          <p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-wtheme-text font-body text-lg"
          >
            {content.sectionDescription}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-wtheme-text/70 font-body">{content.loading || "Loading..."}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-wtheme-text/70 font-body">{content.error}</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              {content.retry}
            </Button>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-wtheme-text/70 font-body">{content.error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              {content.retry}
            </Button>
          </div>
        ) : (
          <>
            <div
              ref={carouselRef}
              className="hidden md:block relative overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative">
                <AnimatePresence mode="popLayout">
                  <FadeIn
                    key={`desktop-${activeIndex}`}
                
                  >
                    {getVisibleItems().map((news, index) => (
                      <NewsCard
                        key={`${news.id}-${index}`}
                        news={news}
                        index={index}
                        isInView={isInView}
                        direction={direction}
                        formatDate={formatDate}
                        readMoreText={content.readMore}
                        sectionId={sectionId}
                        websiteId={websiteId}
                      />
                    ))}
                  </FadeIn>
                </AnimatePresence>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full  backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background"
                  onClick={direction === "rtl" ? nextNews : prevNews}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">{content.previous}</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-wtheme-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background"
                  onClick={direction === "rtl" ? prevNews : nextNews}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">{content.next}</span>
                </Button>
              </div>
            </div>

            <div className="md:hidden relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="overflow-hidden rounded-2xl">
                <AnimatePresence mode="popLayout">
                  <FadeIn
                    key={`mobile-${activeIndex}`}
                
                    className="w-full"
                  >
                    <NewsCard
                      news={contentItems[activeIndex]}
                      index={0}
                      isInView={true}
                      direction={direction}
                      formatDate={formatDate}
                      readMoreText={content.readMore}
                      sectionId={sectionId}
                      websiteId={websiteId}
                    />
                  </FadeIn>
                </AnimatePresence>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-wtheme-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background"
                  onClick={direction === "rtl" ? nextNews : prevNews}
                >
                  {direction === "rtl" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  <span className="sr-only">{content.previous}</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-wtheme-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-wtheme-background"
                  onClick={direction === "rtl" ? prevNews : nextNews}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">{content.next}</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function NewsCard({ news, index, direction, formatDate, readMoreText, sectionId, websiteId }) {
  const isRTL = direction === "rtl"

  return (
    <FadeIn
    
      className="group relative overflow-hidden rounded-2xl  border border-wtheme-border/50 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col"
    >
      <FadeIn
        className="h-1.5 w-full bg-primary"
     
      ></FadeIn>

      <div className="relative overflow-hidden aspect-video">
        <FadeIn >
          <Image
            src={news.image || "/placeholder.svg"}
            alt={news.title}
            fill
            priority={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </FadeIn>
        <FadeIn
          className="absolute top-4 left-4 z-10"
       
        >
          <span className="px-3 py-1 rounded-full text-xs font-accent font-medium text-white bg-primary">
            {news.category}
          </span>
        </FadeIn>
      </div>

      <CardContent className="flex-grow p-6">
        <FadeIn
          className="flex items-center text-sm text-wtheme-text/70 font-body mb-3"

        >
          <Calendar className={` text-wtheme-text font-body h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          <span className="text-wtheme-text font-bold">{formatDate(news.date)}</span>
        </FadeIn>

        <h3
          className="text-xl font-heading  mb-3 line-clamp-2 text-wtheme-text group-hover:text-wtheme-hover transition-colors"
      
        >
          {news.title}
        </h3>

        <p
          className="text-wtheme-text font-body line-clamp-3"
         
        >
          {news.excerpt}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <FadeIn
     
        >
          <Link
            href={`/Pages/NewsDetailPage/${news.id}?sectionId=${sectionId}&websiteId=${websiteId}`}
            className="inline-flex items-center text-primary font-accent font-medium hover:underline"
          >
            {readMoreText}
            <ArrowRight
              className={`${isRTL ? "mr-2 rotate-180" : "ml-2"} h-4 w-4 transition-transform duration-300 ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
            />
          </Link>
        </FadeIn>
      </CardFooter>

      <FadeIn
        className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-theme-gradient opacity-10 group-hover:opacity-20 transition-opacity duration-500"
     
      ></FadeIn>
    </FadeIn>
  )
}