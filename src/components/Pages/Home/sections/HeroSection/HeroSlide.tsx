"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import SlideContent from "./SlideContent"
import SlideImage from "./SlideImage"

interface HeroSlideProps {
  slide: {
    id?: string
    image?: string
    title?: string
    excerpt?: string
    exploreButton?: string
    requestButton?: string
    exploreButtonType?: string
    requestButtonType?: string
    exploreButtonUrl?: string
    requestButtonUrl?: string
    color?: string
  }
  index: number
  direction?: 'ltr' | 'rtl'
  language: string
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

export default function HeroSlide({
  slide,
  index,
  direction,
  handleNavClick
}: HeroSlideProps) {
  
  const isExternalUrl = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'))
  }

  return (
    <motion.div
      key={`${slide.id}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
      {/* Mobile-first responsive layout */}
      <div className="w-full h-full container flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 items-center justify-center">
        
        {/* Content Section - Mobile optimized */}
        <div className="w-full order-2 lg:order-1 px-4 sm:px-6 lg:px-0">
          <div className="max-w-lg mx-auto lg:max-w-none lg:mx-0 ">
            <SlideContent
              title={slide.title}
              description={slide.excerpt}
              color={slide.color}
              direction={direction}
            >
            
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 w-full">
                {slide.exploreButton && (
                  <Button
                    asChild
                    size="lg"
                    variant="default"
                    className="w-full sm:w-auto sm:min-w-[140px] border-2 border-primary dark:bg-primary text-wtheme-text min-h-[48px] sm:min-h-[44px] text-base sm:text-sm font-medium rounded-lg touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {isExternalUrl(slide.exploreButtonUrl) ? (
                      <a 
                        href={slide.exploreButtonUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <span>{slide.exploreButton}</span>
                        <ArrowRight 
                          className={`h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0 ${
                            direction === "rtl" ? "rotate-180" : ""
                          }`} 
                        />
                      </a>
                    ) : (
                      <Link 
                        href={slide.exploreButtonUrl || "#"} 
                        onClick={slide.exploreButtonUrl && !isExternalUrl(slide.exploreButtonUrl) 
                          ? (e) => handleNavClick(e, slide.exploreButtonUrl.replace('#', '')) 
                          : undefined
                        }
                        className="flex items-center justify-center gap-2"
                      >
                        <span>{slide.exploreButton}</span>
                        <ArrowRight 
                          className={`h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0 ${
                            direction === "rtl" ? "rotate-180" : ""
                          }`} 
                        />
                      </Link>
                    )}
                  </Button>
                )}
                
                {slide.requestButton && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto sm:min-w-[140px] border-2 border-white/30 text-white bg-transparent hover:bg-white/10 min-h-[48px] sm:min-h-[44px] text-base sm:text-sm font-medium rounded-lg touch-manipulation backdrop-blur-sm"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {isExternalUrl(slide.requestButtonUrl) ? (
                      <a 
                        href={slide.requestButtonUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <span>{slide.requestButton}</span>
                        <ArrowRight 
                          className={`h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0 ${
                            direction === "rtl" ? "rotate-180" : ""
                          }`} 
                        />
                      </a>
                    ) : (
                      <Link 
                        href={slide.requestButtonUrl || "#"} 
                        onClick={slide.requestButtonUrl && !isExternalUrl(slide.requestButtonUrl) 
                          ? (e) => handleNavClick(e, slide.requestButtonUrl.replace('#', '')) 
                          : undefined
                        }
                        className="flex items-center justify-center gap-2"
                      >
                        <span>{slide.requestButton}</span>
                        <ArrowRight 
                          className={`h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0 ${
                            direction === "rtl" ? "rotate-180" : ""
                          }`} 
                        />
                      </Link>
                    )}
                  </Button>
                )}
              </div>
            </SlideContent>
          </div>
        </div>

        {/* Image Section - Mobile optimized */}
        <div className="w-full order-1 lg:order-2 flex-1 lg:flex-initial min-h-[40vh] sm:min-h-[65vh] lg:min-h-0 lg:h-full px-4 sm:px-6 lg:px-0">
          <SlideImage
            image={slide.image || "/placeholder.svg"}
            title={slide.title}
            color={slide.color}
            priority={index === 0}
          />
        </div>
      </div>
    </motion.div>
  )
}