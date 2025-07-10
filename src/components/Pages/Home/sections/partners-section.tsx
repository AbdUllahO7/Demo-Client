"use client"

import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { useState, useRef, useEffect } from "react"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function PartnersSection({ websiteId, sectionId }) {
  const { ref, isInView } = useScrollAnimation()
  const { t, direction, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    content,
    isLoading: sectionLoading,
    error: sectionError,
    refetch,
    formatDate,
  } = useSectionLogic({
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

  const isRTL = direction === "rtl"

  return (
    <section id="partners" className="relative w-full py-20 overflow-hidden" dir={direction}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wtheme-background via-wtheme-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.05)_0%,transparent_50%)]"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative container px-4 md:px-6" ref={containerRef}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { 
                duration: 0.8,
                ease: "easeOut"
              },
            },
          }}
          className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
        >
          {/* Enhanced Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
            <span className="relative inline-flex items-center px-6 py-2 text-sm font-semibold text-primary bg-primary/5 border border-primary/20 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              {content.sectionLabel}
            </span>
          </motion.div>

          {/* Enhanced Title */}
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-wtheme-text relative"
            >
              <span className="relative inline-block">
                {content.sectionTitle}
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-3xl text-lg text-wtheme-text/70 leading-relaxed"
            >
              {content.sectionDescription}
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced Partners Carousel */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl"></div>
          
          <PartnersCarousel 
            partners={contentItems} 
            isInView={isInView} 
            isRTL={isRTL} 
            containerRef={containerRef} 
          />
        </div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center space-x-2 text-wtheme-text/60">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-primary/60 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
        
          </div>
        </motion.div>
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
  isRTL: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

function PartnersCarousel({ partners, isInView, isRTL, containerRef }: PartnersCarouselProps) {
  const { direction } = useLanguage()
  const [isPaused, setIsPaused] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")

  // Duplicate partners array to create seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners]

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
          logoWidth: "w-28 sm:w-32",
          logoHeight: "h-16",
          padding: "px-2",
          duration: Math.max(partners.length * 5, 30),
          gradientWidth: "w-8",
        }
      case "sm":
        return {
          logoWidth: "w-32 sm:w-36",
          logoHeight: "h-18",
          padding: "px-3",
          duration: Math.max(partners.length * 4, 25),
          gradientWidth: "w-10",
        }
      case "md":
        return {
          logoWidth: "w-36 md:w-40",
          logoHeight: "h-20",
          padding: "px-4",
          duration: Math.max(partners.length * 3.5, 22),
          gradientWidth: "w-12",
        }
      case "lg":
        return {
          logoWidth: "w-40 lg:w-44",
          logoHeight: "h-22",
          padding: "px-5",
          duration: Math.max(partners.length * 3, 20),
          gradientWidth: "w-16",
        }
      default:
        return {
          logoWidth: "w-44 xl:w-48",
          logoHeight: "h-24",
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
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-rtl {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(var(--primary), 0.1); }
          50% { box-shadow: 0 0 40px rgba(var(--primary), 0.2); }
        }
        .marquee-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          background: linear-gradient(135deg, 
            rgba(var(--primary), 0.02) 0%, 
            transparent 50%, 
            rgba(var(--primary), 0.02) 100%);
          border-radius: 24px;
          padding: 32px 0;
          mask-image: ${isRTL 
            ? `linear-gradient(
                to left,
                transparent 0%,
                black 8%,
                black 92%,
                transparent 100%
              )`
            : `linear-gradient(
                to right,
                transparent 0%,
                black 8%,
                black 92%,
                transparent 100%
              )`
          };
          -webkit-mask-image: ${isRTL 
            ? `linear-gradient(
                to left,
                transparent 0%,
                black 8%,
                black 92%,
                transparent 100%
              )`
            : `linear-gradient(
                to right,
                transparent 0%,
                black 8%,
                black 92%,
                transparent 100%
              )`
          };
        }
        .marquee-content {
          display: flex;
          animation: ${isRTL ? "scroll-rtl" : "scroll-ltr"} ${config.duration}s linear infinite;
          animation-play-state: ${isPaused ? "paused" : "running"};
          width: fit-content;
          will-change: transform;
          ${isRTL ? 'flex-direction: row;' : ''}
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
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="marquee-container relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1)_0%,transparent_50%)]"></div>
        </div>

        <div className="marquee-content">
          {duplicatedPartners.map((partner, index) => (
            <div key={`partner-${index}`} className={`flex-shrink-0 ${config.padding} ${config.logoWidth}`}>
              <PartnerLogo 
                partner={partner} 
                index={index} 
                heightClass={config.logoHeight} 
                screenSize={screenSize} 
                isRTL={isRTL} 
              />
            </div>
          ))}
        </div>
      </motion.div>
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
  isRTL: boolean
}

function PartnerLogo({ partner, index, heightClass, screenSize, isRTL }: PartnerLogoProps) {
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

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.8 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            duration: 0.5,
            delay: (index % 10) * 0.1 
          }
        },
      }}
      whileHover={{
        y: -8,
        scale: 1.08,
        rotateY: 5,
        boxShadow: "0 20px 40px -15px rgba(var(--primary), 0.3)",
        borderColor: "rgba(var(--primary), 0.4)",
      }}
      className={`
        partner-logo flex items-center justify-center 
        rounded-2xl border border-white/10 
        bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-sm
        p-4 sm:p-5 md:p-6 lg:p-7
        shadow-lg hover:shadow-2xl
        ${heightClass} w-full 
        transition-all duration-500 ease-out
        group cursor-pointer
        relative overflow-hidden
      `}
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
        className={`
          h-auto ${imageConfig.maxHeight} w-auto max-w-full 
          object-contain filter
          transition-all duration-700 ease-out
          group-hover:scale-110 relative z-10
          ${isRTL ? '' : ''}
        `}
        loading="lazy"
      />

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
    </motion.div>
  )
}