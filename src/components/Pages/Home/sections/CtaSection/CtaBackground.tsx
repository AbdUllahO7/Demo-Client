"use client"

import { FadeIn } from "@/utils/OptimizedAnimations"


interface CtaBackgroundProps {
  isInView: boolean
}

export function CtaBackground({ isInView }: CtaBackgroundProps) {
  return (
    <>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 z-0"></div>

      {/* Animated orbs */}
      <FadeIn
      
        className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
      />
      
      <FadeIn
   
        className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
      />
    </>
  )
}
