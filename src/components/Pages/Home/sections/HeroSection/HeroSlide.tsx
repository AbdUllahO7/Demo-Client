"use client"

import Link from "next/link"
// 🚀 OPTIMIZATION: Import only specific motion components
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import SlideContent from "./SlideContent"
import SlideImage from "./SlideImage"

interface HeroSlideProps {
  slide: {
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
  }
  index: number
  direction: string
  language: string
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

// 🚀 OPTIMIZATION: Simplified, faster animation variants
const slideVariants = {
  initial: { 
    opacity: 0,
    // Remove complex transforms for better performance
  },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.4, // Shorter duration
      ease: "easeOut" // Simpler easing
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2, // Very fast exit
      ease: "easeIn"
    }
  }
}

export default function HeroSlide({
  slide,
  index,
  direction,
  language,
  handleNavClick
}: HeroSlideProps) {
  
  // Helper function to determine if URL is external
  const isExternalUrl = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
      {/* Content - Remove motion wrapper for better performance */}
      <SlideContent
        title={slide.title}
        description={slide.excerpt}
        color={slide.color}
        direction={direction}
      >
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* Explore Button */}
          {slide.exploreButton && (
            <Button
              asChild
              size="lg"
              variant="default"
              className={`${isExternalUrl(slide.exploreButtonUrl) ? ' border-2 border-primary' : 'border-2 border-primary'} dark:bg-primary text-wtheme-text transition-colors duration-200`}
            >
              {isExternalUrl(slide.exploreButtonUrl) ? (
                <a 
                  href={slide.exploreButtonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  {slide.exploreButton}
                  {direction === "ltr" && <ArrowRight className="ml-2 h-4 w-4" />}
                  {direction === "rtl" && <ArrowRight className="mr-2 h-4 w-4 transform scale-x-[-1]" />}
                </a>
              ) : (
                <Link 
                  href={slide.exploreButtonUrl || "#"} 
                  onClick={slide.exploreButtonUrl && !isExternalUrl(slide.exploreButtonUrl) 
                    ? (e) => handleNavClick(e, slide.exploreButtonUrl.replace('#', '')) 
                    : undefined
                  }
                  className="inline-flex items-center"
                >
                  {slide.exploreButton}
                  {direction === "ltr" && <ArrowRight className="ml-2 h-4 w-4" />}
                  {direction === "rtl" && <ArrowRight className="mr-2 h-4 w-4 transform scale-x-[-1]" />}
                </Link>
              )}
            </Button>
          )}
        </div>
      </SlideContent>

      {/* Image - Pass isFirst prop for LCP optimization */}
      <SlideImage
        image={slide.image || "/placeholder.svg"}
        title={slide.title}
        color={slide.color}
        isFirst={index === 0}
      />
    </div>
  )
}