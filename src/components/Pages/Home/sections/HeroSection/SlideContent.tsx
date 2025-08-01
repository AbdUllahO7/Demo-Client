"use client"

import { memo } from "react"
import type React from "react"

interface SlideContentProps {
  title: string
  description: string
  color?: string
  direction?: 'ltr' | 'rtl'
  children: React.ReactNode
  isActive?: boolean
}

const SlideContent = memo(function SlideContent({
  title,
  description,
  color = "from-primary via-accent to-secondary",
  children,
}: SlideContentProps) {
  
  return (
    <div className="flex flex-col bg-transparent justify-center space-y-6 z-10 relative">
      {/* Simplified decorative line - no animation */}
      <div className="flex items-center gap-2 bg-transparent">
        <div className={`w-16 h-1.5 rounded-full bg-gradient-to-r ${color} shadow-lg/20`} />
      </div>

      {/* Main title - remove complex animations for LCP */}
      <h1 className="font-heading text-wtheme-text text-heading text-4xl sm:text-5xl bg-clip-text">
        {title}
      </h1>

      {/* Description text - simplified */}
      <p className="font-body text-body text-lg leading-relaxed text-wtheme-text max-w-[600px] hover:text-wtheme-hover transition-colors duration-300">
        {description}
      </p>

      {/* Children container - no animation for critical path */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {children}
      </div>
    </div>
  )
})

export default SlideContent