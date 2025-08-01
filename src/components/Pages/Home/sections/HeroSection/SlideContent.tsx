"use client"

import { FadeIn } from "@/utils/OptimizedAnimations"
import { motion } from "framer-motion"
import type React from "react"

interface SlideContentProps {
  title: string
  description: string
  colorScheme?: 'primary' | 'secondary' | 'accent' | 'theme'
  direction?: 'ltr' | 'rtl'
  children: React.ReactNode
}

export default function SlideContent({
  title,
  description,
  colorScheme = 'primary',
  direction = 'ltr',
  children
}: SlideContentProps) {
  // Define gradient classes based on color scheme
  const gradientClasses = {
    primary: 'from-primary via-primary-600 to-primary-800',
    secondary: 'from-secondary via-secondary to-primary',
    accent: 'from-accent via-accent to-secondary',
    theme: 'from-primary via-accent to-secondary'
  }

  // Define shadow classes
  const shadowClasses = {
    primary: 'shadow-primary',
    secondary: 'shadow-secondary',
    accent: 'shadow-accent',
    theme: 'shadow-theme'
  }

  const selectedGradient = gradientClasses[colorScheme]
  const selectedShadow = shadowClasses[colorScheme]

  return (
    <FadeIn
   
      className="flex flex-col bg-transparent justify-center space-y-6 z-10 relative "
    >
      {/* Decorative line with gradient */}
      <div className="flex items-center gap-2 bg-transparent">
        <FadeIn 
         
          className={`h-1.5 rounded-full bg-gradient-to-r ${selectedGradient} ${selectedShadow}/20`}
        />
      </div>

      {/* Main title with theme fonts and colors */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="font-heading text-wtheme-text  text-heading text-4xl sm:text-5xl  bg-clip-text"
      >
        {title}
      </motion.h1>

      {/* Description text */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="font-body font-body text-body
                    text-lg leading-relaxed text-wtheme-text
                    max-w-[600px] 
                    hover:text-wtheme-hover transition-colors duration-300"
      >
        {description}
      </motion.p>

      {/* Children container with animation */}
      <FadeIn
       
        className="flex flex-col sm:flex-row gap-4 items-start"
      >
        {children}
      </FadeIn>

    
    </FadeIn>
  )
}