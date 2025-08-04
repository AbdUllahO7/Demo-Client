"use client"

import { FadeIn } from "@/utils/OptimizedAnimations"
import IndustryCard from "./IndustryCard"

interface Industry {
  id?: string
  title?: string
  excerpt?: string
  image?: string
  color?: string
  order?: number
}

interface IndustriesGridProps {
  industries: Industry[]
  isInView: boolean
}

export default function IndustriesGrid({ industries, isInView }: IndustriesGridProps) {
  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {industries.map((industry, index) => (
          <IndustryCard 
            key={industry.id || index} 
            industry={industry} 
            index={index} 
            isInView={isInView} 
          />
        ))}
      </div>

      <FadeIn
      
        className="mt-16 text-center"
      >
      </FadeIn>
    </>
  )
}
