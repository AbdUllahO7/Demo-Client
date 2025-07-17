"use client"

import Image from "next/image"
// 🚀 OPTIMIZATION: Only import motion if needed, prefer CSS transitions
import { motion } from "framer-motion"

interface SlideImageProps {
  image: string
  title: string
  color: string
  isFirst?: boolean
}

// 🚀 OPTIMIZATION: Simplified animation variants
const imageVariants = {
  initial: { 
    opacity: 0,
    scale: 0.98 // Very subtle scale for performance
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.3, // Faster duration
      ease: "easeOut",
      // 🚀 OPTIMIZATION: Stagger animations for better performance
      delay: 0.1
    }
  }
}

// 🚀 OPTIMIZATION: Simple hover variant (less complex than whileHover)
const hoverVariants = {
  scale: 1.02,
  transition: { 
    type: "tween", // Use tween instead of spring for better performance
    duration: 0.2
  }
}

export default function SlideImage({ image, title, color, isFirst = false }: SlideImageProps) {
  // 🚀 OPTIMIZATION: Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 🚀 OPTIMIZATION: Return static version if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <div className="relative mx-auto lg:ml-auto h-full flex items-center">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-2xl blur-xl transform rotate-3 scale-105`}
        ></div>

        <div className={`relative bg-gradient-to-r p-1 ${color} rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
          <div className="bg-background rounded-xl overflow-hidden">
            <Image
              src={image}
              width={600}
              height={400}
              quality={50}
              priority={isFirst}
              fetchPriority={isFirst ? "high" : "low"}
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 480px, 600px"
              alt={title}
              className="w-full h-auto rounded-xl"
              loading={isFirst ? "eager" : "lazy"}
              decoding="async"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onError={(e) => {
                console.error('Hero image failed to load:', image);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
              onLoad={() => {
                if (isFirst && typeof window !== 'undefined') {
                  performance.mark('hero-image-loaded');
                }
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={imageVariants}
      initial="initial"
      animate="animate"
      className="relative mx-auto lg:ml-auto h-full flex items-center"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-2xl blur-xl transform rotate-3 scale-105`}
      ></div>

      <motion.div
        whileHover={hoverVariants}
        className={`relative bg-gradient-to-r p-1 ${color} rounded-2xl shadow-xl`}
      >
        <div className="bg-background rounded-xl overflow-hidden">
          <Image
            src={image}
            width={600}
            height={400}
            quality={50}
            priority={isFirst}
            fetchPriority={isFirst ? "high" : "low"}
            sizes="(max-width: 640px) 320px, (max-width: 1024px) 480px, 600px"
            alt={title}
            className="w-full h-auto rounded-xl"
            loading={isFirst ? "eager" : "lazy"}
            decoding="async"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            onError={(e) => {
              console.error('Hero image failed to load:', image);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
            onLoad={() => {
              if (isFirst && typeof window !== 'undefined') {
                performance.mark('hero-image-loaded');
              }
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}