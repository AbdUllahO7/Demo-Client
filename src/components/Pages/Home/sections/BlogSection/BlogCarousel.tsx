// src/components/Blog/BlogCarousel.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogCard } from "./BlogCard"
import { FadeIn } from "@/utils/lightweightAnimations"



export function BlogCarousel({ posts, isInView, containerRef, isRTL }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Calculate posts per view and maximum slides based on screen size
  // Initial state with SSR-safe default value
  const [postsPerView, setPostsPerView] = useState(3)
  const maxSlides = Math.max(0, posts.length - postsPerView)

  
  // Correct usage of useEffect for client-side operations
  useEffect(() => {
    // Function to determine posts per view based on screen width
    const getPostsPerView = () => {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    };
    
    // Update state based on window size
    const handleResize = () => {
      setPostsPerView(getPostsPerView());
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    if (isRTL) {
      setCurrentSlide((prev) => Math.min(prev + 1, maxSlides));
    } else {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  }

  const handleNext = () => {
    if (isRTL) {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    } else {
      setCurrentSlide((prev) => Math.min(prev + 1, maxSlides));
    }
  }

  // Mouse parallax effect for navigation buttons
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setMousePosition({ x, y })
  }

  // Calculate slide width percentage based on posts per view
  const slideWidth = 100 / postsPerView

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      {/* Unified Carousel for All Screen Sizes */}
      <div className="relative">
        <div className="overflow-hidden" ref={carouselRef}>
          <FadeIn
        
            className="flex transition-transform duration-500 ease-in-out"
       
          >
            {posts.map((post, index) => (
              <div 
                key={index} 
                className="px-2 md:px-4" 
                style={{ 
                  minWidth: `${slideWidth}%`,
                  flex: `0 0 ${slideWidth}%` 
                }}
              >
                <BlogCard post={post} index={index} isInView={isInView} isRTL={isRTL} />
              </div>
            ))}
          </FadeIn>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-8 md:mt-12 gap-4 md:gap-6">
          <FadeIn
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-wtheme-hover transition-all duration-300 w-10 h-10 md:w-12 md:h-12 shadow-md hover:shadow-lg"
              onClick={handlePrev}
              disabled={isRTL ? currentSlide >= maxSlides : currentSlide <= 0}
            >
              <ChevronLeft className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? "rotate-180" : ""}`} />
              <span className="sr-only">Previous</span>
            </Button>
          </FadeIn>

          <FadeIn
          
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-wtheme-hover transition-all duration-300 w-10 h-10 md:w-12 md:h-12 shadow-md hover:shadow-lg"
              onClick={handleNext}
              disabled={isRTL ? currentSlide <= 0 : currentSlide >= maxSlides}
            >
              <ChevronRight className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? "rotate-180" : ""}`} />
              <span className="sr-only">Next</span>
            </Button>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
