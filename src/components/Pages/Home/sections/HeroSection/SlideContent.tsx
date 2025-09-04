"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import type React from "react"

interface SlideContentProps {
  title?: string
  description?: string
  color?: string
  direction?: 'ltr' | 'rtl'
  children: React.ReactNode
  isActive?: boolean
}

const SlideContent = memo(function SlideContent({
  title,
  description,
  color = "from-primary via-accent to-secondary",
  direction = 'ltr',
  children,
}: SlideContentProps) {
  
  return (
    <div className="flex flex-col justify-center space-y-4 sm:space-y-6 z-10 relative">
      {/* Decorative gradient bar */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "4rem", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-center gap-2"
      >
        <div className={`h-1 sm:h-1.5 rounded-full bg-gradient-to-r ${color} shadow-lg/20`} />
      </motion.div>

      {/* Title with responsive typography */}
      <motion.h1 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`
          font-heading text-wtheme-text font-bold leading-tight
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
          max-w-2xl 
          ${direction === 'rtl' ? 'text-right' : 'text-left'}
        `}
      >
        {title}
      </motion.h1>

      {/* Description with improved readability */}
      <motion.p 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`
          font-body text-wtheme-text leading-relaxed
          text-base sm:text-lg lg:text-xl
          max-w-xl lg:max-w-2xl
          ${direction === 'rtl' ? 'text-right' : 'text-left'}
          opacity-90 hover:opacity-100 transition-opacity duration-300
        `}
      >
        {description}
      </motion.p>

      {/* Button container */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start"
      >
        {children}
      </motion.div>
    </div>
  )
})

export default SlideContent