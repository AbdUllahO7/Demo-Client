// src/components/HeroImagePreloader.tsx
"use client"

import { useEffect } from 'react'

interface HeroImagePreloaderProps {
  slides: Array<{ image: string; title: string }>
  currentSlide: number
}

export default function HeroImagePreloader({ slides, currentSlide }: HeroImagePreloaderProps) {
  useEffect(() => {
    // 🚀 OPTIMIZATION: Preload the first slide image immediately
    if (slides.length > 0 && slides[0]?.image) {
      const firstImage = slides[0].image
      
      // Create link element for preloading
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = firstImage
      link.fetchPriority = 'high'
      
      // Add to head if not already present
      if (!document.querySelector(`link[href="${firstImage}"]`)) {
        document.head.appendChild(link)
      }
    }

    // 🚀 OPTIMIZATION: Preload next slide image for smoother transitions
    const nextSlideIndex = currentSlide + 1 >= slides.length ? 0 : currentSlide + 1
    const nextSlide = slides[nextSlideIndex]
    
    if (nextSlide?.image && currentSlide !== nextSlideIndex) {
      const img = new Image()
      img.src = nextSlide.image
      img.decoding = 'async'
      img.loading = 'eager'
    }
  }, [slides, currentSlide])

  // 🚀 OPTIMIZATION: Also preload the previous slide for backward navigation
  useEffect(() => {
    const prevSlideIndex = currentSlide - 1 < 0 ? slides.length - 1 : currentSlide - 1
    const prevSlide = slides[prevSlideIndex]
    
    if (prevSlide?.image && currentSlide !== prevSlideIndex) {
      const img = new Image()
      img.src = prevSlide.image
      img.decoding = 'async'
      img.loading = 'eager'
    }
  }, [slides, currentSlide])

  return null // This component doesn't render anything
}