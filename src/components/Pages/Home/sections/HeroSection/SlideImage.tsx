"use client"

import { memo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface SlideImageProps {
  image: string
  title?: string
  color?: string
  isActive?: boolean
  priority?: boolean
}

const SlideImage = memo(function SlideImage({ 
  image, 
  title = "", 
  color = "from-blue-500 to-purple-600", 
  priority = false 
}: SlideImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  // Detect orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Use matchMedia for more reliable orientation detection
      const isLandscape = window.matchMedia('(orientation: landscape)').matches
      setOrientation(isLandscape ? 'landscape' : 'portrait')
    }

    // Initial check
    handleOrientationChange()

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [])

  // Fallback image if original fails
  const fallbackImage = "/placeholder.svg"
  
  // Use the provided image or fallback
  const displayImage = imageError ? fallbackImage : image

  const handleImageError = () => {
    console.warn('Failed to load image:', image)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    if (priority) {
      // Mark LCP as ready
      if (typeof performance !== 'undefined') {
        performance.mark('lcp-ready')
      }
    }
  }

  // Dynamic aspect ratio based on orientation and screen size
  const getAspectRatio = () => {
    if (typeof window === 'undefined') return 'aspect-[4/3]'
    
    const isSmallScreen = window.innerWidth < 640
    const isMediumScreen = window.innerWidth < 1024
    
    if (isSmallScreen) {
      return orientation === 'landscape' ? 'aspect-[16/9]' : 'aspect-[4/3]'
    } else if (isMediumScreen) {
      return orientation === 'landscape' ? 'aspect-[16/10]' : 'aspect-[5/4]'
    } else {
      return 'aspect-[16/10]'
    }
  }

  // Dynamic container sizing based on orientation
  const getContainerClass = () => {
    const baseClass = "relative bg-gradient-to-br p-[2px] sm:p-[3px] rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl mx-auto"
    
    if (orientation === 'landscape' && window.innerWidth < 1024) {
      return `${baseClass} w-full max-w-md sm:max-w-lg ${color}`
    } else {
      return `${baseClass} w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${color}`
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
      {/* Background effect - fixed positioning without mb-20 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
        animate={{ scale: 1.05, opacity: 0.15, rotate: 2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`
          absolute inset-2 sm:inset-4 bg-gradient-to-br ${color} 
          rounded-xl sm:rounded-2xl lg:rounded-3xl 
          blur-sm sm:blur-md lg:blur-lg 
          transform origin-center
        `}
      />

      {/* Main image container with responsive design */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={getContainerClass()}
      >
        <div className="bg-background rounded-[10px] sm:rounded-[14px] lg:rounded-[22px] overflow-hidden h-full">
          <div className={`relative w-full ${getAspectRatio()}`}>
            {/* Loading placeholder - responsive sizing */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[8px] sm:rounded-[12px] lg:rounded-[20px] flex items-center justify-center">
                <div className="relative">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border-2 sm:border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border-2 sm:border-3 border-transparent border-r-primary/60 rounded-full animate-spin-reverse" />
                </div>
              </div>
            )}
            
            <Image
              src={displayImage}
              fill
              alt={title || "Hero slide image"}
              className={`
                object-cover rounded-[8px] sm:rounded-[12px] lg:rounded-[20px] 
                transition-all duration-500 hover:scale-105 
                ${imageLoading ? 'opacity-0' : 'opacity-100'}
              `}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes={
                orientation === 'landscape' && window.innerWidth < 1024
                  ? "(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 50vw"
                  : "(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 40vw"
              }
              priority={priority}
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </div>
      </motion.div>

      {/* Floating elements for visual interest - adjusted positioning */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`
          absolute w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 
          bg-white/20 rounded-full backdrop-blur-sm border border-white/30
          ${orientation === 'landscape' ? 'top-2 right-2 sm:top-4 sm:right-4' : '-top-3 -right-3 sm:-top-4 sm:-right-4'}
        `}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className={`
          absolute w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 
          bg-white/10 rounded-full backdrop-blur-sm
          ${orientation === 'landscape' ? 'bottom-2 left-2 sm:bottom-4 sm:left-4' : '-bottom-2 -left-2 sm:-bottom-3 sm:-left-3'}
        `}
      />
    </div>
  )
})

export default SlideImage