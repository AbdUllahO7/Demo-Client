"use client"

import { memo, useState } from "react"
import Image from "next/image"

interface SlideImageProps {
  image: string
  title: string
  color: string
  isActive?: boolean
  priority?: boolean
}

const SlideImage = memo(function SlideImage({ 
  image, 
  title, 
  color, 
  priority = false 
}: SlideImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

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

  return (
    <div className="relative mx-auto lg:ml-auto h-full flex items-center">
      {/* Simplified background effect - only render for active slide */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-2xl blur-xl transform rotate-3 scale-105 slide-image-bg-effect`}
        />

      <div className={`relative bg-gradient-to-r p-1 ${color} rounded-2xl shadow-xl`}>
        <div className="bg-background rounded-xl overflow-hidden">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
            {/* Loading placeholder */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <Image
              src={displayImage}
              width={100}
              height={100}
              alt={title}
              className={`w-full h-auto max-w-full aspect-[16/10] object-cover rounded-xl transition-all duration-300 hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default SlideImage