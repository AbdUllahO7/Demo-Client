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
    <section id="partners" className="w-full py-20 bg-wtheme-background overflow-hidden" dir={direction}>
      <div className="container px-4 md:px-6" ref={containerRef}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            },
          }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2 text-body text-primary tracking-wider uppercase"
          >
            {content.sectionLabel}
          </motion.span>
          <div className="space-y-2">
            <motion.h2
              className="text-3xl font-heading font-bold tracking-tighter text-wtheme-text sm:text-5xl"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                background: "linear-gradient(90deg, currentColor 0%, rgba(var(--primary), 0.8) 50%, currentColor 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {content.sectionTitle}
            </motion.h2>
            <p className="max-w-[900px] text-wtheme-text font-body">{content.sectionDescription}</p>
          </div>
        </motion.div>

        {/* Partners Carousel */}
        <div className="mt-12">
          <PartnersCarousel partners={contentItems} isInView={isInView} isRTL={isRTL} containerRef={containerRef} />
        </div>
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
          logoWidth: "w-24 sm:w-28",
          logoHeight: "h-12",
          padding: "px-1",
          duration: Math.max(partners.length * 5, 30),
          gradientWidth: "w-6",
        }
      case "sm":
        return {
          logoWidth: "w-28 sm:w-32",
          logoHeight: "h-14",
          padding: "px-2",
          duration: Math.max(partners.length * 4, 25),
          gradientWidth: "w-8",
        }
      case "md":
        return {
          logoWidth: "w-32 md:w-36",
          logoHeight: "h-16",
          padding: "px-3",
          duration: Math.max(partners.length * 3.5, 22),
          gradientWidth: "w-10",
        }
      case "lg":
        return {
          logoWidth: "w-36 lg:w-40",
          logoHeight: "h-18",
          padding: "px-4",
          duration: Math.max(partners.length * 3, 20),
          gradientWidth: "w-12",
        }
      default:
        return {
          logoWidth: "w-40 xl:w-44",
          logoHeight: "h-20",
          padding: "px-5",
          duration: Math.max(partners.length * 2.5, 18),
          gradientWidth: "w-16",
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
        
        .marquee-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          mask-image: ${isRTL 
            ? `linear-gradient(
                to left,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
              )`
            : `linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
              )`
          };
          -webkit-mask-image: ${isRTL 
            ? `linear-gradient(
                to left,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
              )`
            : `linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
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

        @media (prefers-reduced-motion: reduce) {
          .marquee-content {
            animation-duration: ${config.duration * 2}s;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="marquee-container relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="marquee-content">
          {duplicatedPartners.map((partner, index) => (
            <div key={`partner-${index}`} className={`flex-shrink-0 ${config.padding} ${config.logoWidth}`}>
              <PartnerLogo partner={partner} index={index} heightClass={config.logoHeight} screenSize={screenSize} isRTL={isRTL} />
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
        return { width: 80, height: 40, maxHeight: "max-h-6" }
      case "sm":
        return { width: 100, height: 50, maxHeight: "max-h-7" }
      case "md":
        return { width: 120, height: 60, maxHeight: "max-h-8" }
      case "lg":
        return { width: 140, height: 70, maxHeight: "max-h-10" }
      default:
        return { width: 160, height: 80, maxHeight: "max-h-12" }
    }
  }

  const imageConfig = getImageSize()

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -2,
        scale: 1.03,
        boxShadow: "0 8px 25px -10px rgba(0, 0, 0, 0.15)",
        borderColor: "var(--website-theme-primary)",
      }}
      className={`flex items-center justify-center rounded-md lg:rounded-lg border border-wtheme-border/50 bg-wtheme-background p-2 sm:p-3 md:p-4 lg:p-5 shadow-sm ${heightClass} w-full transition-all duration-300 hover:shadow-md`}
    >
      <Image
        src={partner.image || "/placeholder.svg"}
        alt={partner.image || `Partner ${index + 1}`}
        width={imageConfig.width}
        height={imageConfig.height}
        className={`h-auto ${imageConfig.maxHeight} w-auto max-w-full object-contain shadow-sm shadow-primary transition-all duration-500 hover:grayscale-0 ${
          isRTL ? 'transform scale-x-[-1]' : ''
        }`}
        loading="lazy"
      />
    </motion.div>
  )
}