"use client"

import { FadeIn } from "@/utils/OptimizedAnimations"

interface SectionHeaderProps {
  isInView: boolean
  sectionTitle: string
  mainTitle: string
  mainDescription: string
  centered?: boolean
}

export default function SectionHeader({ 
  sectionTitle, 
  mainTitle, 
  mainDescription,
  centered = true
}: SectionHeaderProps) {
  return (
    <>
    <FadeIn
      className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
    >
      {sectionTitle}
    </FadeIn>

      <FadeIn
    
        className={`text-3xl md:text-4xl lg:text-5xl font-heading tracking-tight text-wtheme-text ${centered ? 'max-w-3xl mx-auto' : 'max-w-[600px]'}`}
      >
        {mainTitle}
      </FadeIn>

      <FadeIn    
        className={`text-lg font-body text-wtheme-text ${centered ? 'max-w-2xl mx-auto' : 'max-w-[600px]'}`}
      >
        {mainDescription}
      </FadeIn>
    </>
  )
}