"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
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
    <nav
      key={index}
      className="absolute inset-0 grid lg:grid-cols-2 gap-8 items-center"
    >
      <SlideContent
        title={slide.title}
        description={slide.excerpt}
        color={slide.color}
        direction={direction}
      >
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {slide.exploreButton && (
            <Button
              asChild
              size="lg"
              variant="default"
              className={`${isExternalUrl(slide.exploreButtonUrl) ? ' border-2 border-primary' : 'border-2 border-primary'} dark:bg-primary text-wtheme-text`}
            >
              {isExternalUrl(slide.exploreButtonUrl) ? (
                <a 
                  href={slide.exploreButtonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
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

      <SlideImage
        image={slide.image || "/placeholder.svg"}
        title={slide.title}
        color={slide.color}
      />
    </nav>
  )
}