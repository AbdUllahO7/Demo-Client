"use client"

import type React from "react"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useState, useRef, useEffect } from "react"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { motion } from 'framer-motion';
import { FadeIn } from "@/utils/OptimizedAnimations"

export default function PartnersSection({ websiteId, sectionId }) {
  const { ref, isInView } = useScrollAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  const { content } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "partners",
  })

  const featureFilter = (item: { image: string }) => item.image && item.image.trim() !== ""

  const ContentItemsMappings = {
    id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`,
    date: "createdAt",
    image: "Image {index}",
    excerpt: "ClientComments {index} - Description",
    color: () => "theme-gradient",
    order: (subsection: any, index?: number) => subsection.order || index || 0,
  }

  const { contentItems } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: ContentItemsMappings,
    maxItemsPerSubsection: 50,
    filter: featureFilter,
  })

  console.log("Partners Section Content Items:", contentItems)

  return (
    <section 
      id="partners" 
      className="relative w-full py-20 overflow-hidden"
      dir="ltr"
      style={{ direction: 'ltr' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wtheme-background via-wtheme-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.05)_0%,transparent_50%)]"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <FadeIn
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
          />
        ))}
      </div>

      <div className="relative container px-4 md:px-6" ref={containerRef}>
        <FadeIn
          ref={ref}
          className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
        >
          {/* Enhanced Label */}
          <FadeIn className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
            <span className="inline-block mb-2 text-body text-primary tracking-wider uppercase">
              {content.sectionLabel}
            </span>
          </FadeIn>

          {/* Enhanced Title */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-wtheme-text relative">
              <span className="relative inline-block">
                {content.sectionTitle}
                <motion.div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
              </span>
            </h2>
            <p className="max-w-3xl text-lg text-wtheme-text/70 leading-relaxed">
              {content.sectionDescription}
            </p>
          </div>
        </FadeIn>

        {/* Enhanced Partners Carousel */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl"></div>
          <PartnersCarousel 
            partners={contentItems} 
            isInView={isInView} 
            containerRef={containerRef} 
          />
        </div>

        {/* Trust Indicator */}
        <FadeIn className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-wtheme-text/60">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-primary/60 rounded-full"
                />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

interface PartnersCarouselProps {
  partners: {
    logo?: string
    jobAr?: string
    job?: string
    excerpt?: string
    excerptAr?: any
    color?: string
    image: string
    accent?: string
    titleAr?: string
    title?: string
    id?: any
    order?: number
    isMain?: boolean
  }[]
  isInView: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

function PartnersCarousel({ partners, isInView, containerRef }: PartnersCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")

  // Duplicate partners array to create seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners]

  // Handle responsive screen detection
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return
      if (window.innerWidth < 640) setScreenSize("mobile")
      else if (window.innerWidth < 768) setScreenSize("sm")
      else if (window.innerWidth < 1024) setScreenSize("md")
      else if (window.innerWidth < 1280) setScreenSize("lg")
      else setScreenSize("xl")
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Responsive configuration
  const getResponsiveConfig = () => {
  switch (screenSize) {
        case "mobile":
          return {
            logoWidth: "w-36 sm:w-40",  // زيادة من 28/32
            logoHeight: "h-24",          // زيادة من 16
            padding: "px-2",
            duration: Math.max(partners.length * 5, 30),
            gradientWidth: "w-8",
          }
        case "sm":
          return {
            logoWidth: "w-40 sm:w-44",  // زيادة من 32/36
            logoHeight: "h-28",          // زيادة من 18
            padding: "px-3",
            duration: Math.max(partners.length * 4, 25),
            gradientWidth: "w-10",
          }
        case "md":
          return {
            logoWidth: "w-44 md:w-48",  // زيادة من 36/40
            logoHeight: "h-32",          // زيادة من 20
            padding: "px-4",
            duration: Math.max(partners.length * 3.5, 22),
            gradientWidth: "w-12",
          }
        case "lg":
          return {
            logoWidth: "w-48 lg:w-52",  // زيادة من 40/44
            logoHeight: "h-36",          // زيادة من 22
            padding: "px-5",
            duration: Math.max(partners.length * 3, 20),
            gradientWidth: "w-16",
          }
        default:
          return {
            logoWidth: "w-52 xl:w-56",  // زيادة من 44/48
            logoHeight: "h-40",          // زيادة من 24
            padding: "px-6",
            duration: Math.max(partners.length * 2.5, 18),
            gradientWidth: "w-20",
          }
      }
    }

  const config = getResponsiveConfig()

  return (
    <>
      <style jsx>{`
  @keyframes scroll-ltr {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-33.333%); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(var(--primary), 0.1); }
    50% { box-shadow: 0 0 40px rgba(var(--primary), 0.2); }
  }

  .marquee-container {
    overflow: hidden;
    position: relative;
    width: 100%;
    background: linear-gradient(135deg, rgba(var(--primary), 0.02) 0%, transparent 50%, rgba(var(--primary), 0.02) 100%);
    border-radius: 24px;
    padding: 32px 0;
    direction: ltr !important;
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
  }

  .marquee-content {
    display: flex;
    width: fit-content;
    will-change: transform;
    animation: scroll-ltr ${config.duration}s linear infinite;
    animation-play-state: ${isPaused ? "paused" : "running"};
    direction: ltr !important;
  }

  .marquee-content:hover {
    animation-play-state: paused;
  }

  .partner-logo:hover {
    animation: glow 2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-content {
      animation-duration: ${config.duration * 2}s;
    }
  }
`}
  </style>

      <FadeIn 
        className="marquee-container relative w-full"
        style={{ direction: 'ltr' }}
        dir="ltr"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1)_0%,transparent_50%)]"></div>
        </div>

        <div 
          className="marquee-content"
          style={{ direction: 'ltr' }}
          dir="ltr"
        >
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={`partner-${index}`} 
              className={`flex-shrink-0 ${config.padding} ${config.logoWidth}`}
            >
              <PartnerLogo 
                partner={partner} 
                index={index} 
                heightClass={config.logoHeight} 
                screenSize={screenSize} 
              />
            </div>
          ))}
        </div>
      </FadeIn>
    </>
  )
}

interface PartnerLogoProps {
  partner: {
    image: string
  }
  index: number
  heightClass: string
  screenSize: string
}

function PartnerLogo({ partner, index, heightClass, screenSize }: PartnerLogoProps) {
  const [imageOrientation, setImageOrientation] = useState<'landscape' | 'portrait' | 'loading'>('loading')

  const getImageSize = () => {
    switch (screenSize) {
      case "mobile":
        return { width: 100, height: 50, maxHeight: "max-h-8" }
      case "sm":
        return { width: 120, height: 60, maxHeight: "max-h-10" }
      case "md":
        return { width: 140, height: 70, maxHeight: "max-h-12" }
      case "lg":
        return { width: 160, height: 80, maxHeight: "max-h-14" }
      default:
        return { width: 180, height: 90, maxHeight: "max-h-16" }
    }
  }

 const imageConfig = getImageSize()

 // Handle image load to determine orientation
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const isLandscape = img.naturalWidth > img.naturalHeight
    setImageOrientation(isLandscape ? 'landscape' : 'portrait')
  }


return (
    <div
      className={`
        partner-logo flex items-center justify-center 
        rounded-2xl 
      
        backdrop-blur-sm
        p-4 sm:p-5 md:p-6 lg:p-7
        shadow-lg hover:shadow-2xl
        ${heightClass} w-full 
        transition-all duration-500 ease-out
        group cursor-pointer
        relative overflow-hidden
      `}
      style={{ direction: 'ltr' }}
      dir="ltr"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <Image
        src={partner.image || "/placeholder.svg"}
        alt={partner.image || `Partner ${index + 1}`}
        width={imageConfig.width}
        height={imageConfig.height}
        onLoad={handleImageLoad}
        className={`
          ${imageOrientation === 'landscape' ? 'w-full h-auto' : imageOrientation === 'portrait' ? 'h-full w-auto' : 'w-auto h-auto'}
          ${imageConfig.maxHeight} max-w-full 
          object-contain filter
          transition-all duration-700 ease-out
          group-hover:scale-110 relative z-10 bg-white
        `}
        loading="lazy"
      />

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
    </div>
  )
}