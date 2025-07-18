"use client"

import { FadeIn } from "@/utils/lightweightAnimations"
import { motion } from "framer-motion"
import type React from "react"

interface FeatureHighlightProps {
  position: string
  delay: number
  isInView: boolean
  color: string
  icon: React.ReactNode
  text: string
}

export default function FeatureHighlight({ 
  position, 
  delay, 
  isInView, 
  color, 
  icon, 
  text 
}: FeatureHighlightProps) {
  return (
    <FadeIn
    
      className={`absolute ${position} hidden lg:flex items-center gap-2`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r ${color} text-white shadow-lg`}
      >
        {icon}
      </div>
      <div className="bg-background rounded-lg px-3 py-1 text-xs font-medium shadow-md border border-border/50">
        {text}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 blur-sm -z-10"></div>
    </FadeIn>
  )
}