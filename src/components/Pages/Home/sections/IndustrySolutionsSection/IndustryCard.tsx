"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { FadeIn } from "@/utils/OptimizedAnimations"

interface IndustryCardProps {
  industry: {
    id?: string
    title?: string
    excerpt?: string
    image?: string
    color?: string
    order?: number
  }
  index: number
  isInView: boolean
}

export default function IndustryCard({ industry, index, isInView }: IndustryCardProps) {
  return (
    <FadeIn
      
      className="group relative overflow-hidden rounded-2xl  border border-wtheme-border/50 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 z-0"></div>

      <div className={`h-2 w-full bg-gradient-to-r ${industry.color}`}></div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <IndustryIcon 
            icon={industry.image} 
            name={industry.title} 
          />

          <h3 className="text-xl font-heading mb-3 text-wtheme-text group-hover:text-wtheme-hover transition-colors duration-300">
            {industry.title}
          </h3>

          <p className="text-wtheme-text font-body mb-6">{industry.excerpt}</p>
        </div>
      </div>

      <div className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${industry.color} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}></div>
    </FadeIn>
  )
}

interface IndustryIconProps {
  icon: string
  name: string
}

function IndustryIcon({ icon, name }: IndustryIconProps) {
  return (
    <div
      className={`relative w-16 h-16 mb-6 rounded-2xl p-3 group-hover:scale-110 transition-transform duration-500`}
    >
      <Image
        src={icon || "/placeholder.svg"}
        alt={name}
        width={94}
        height={94}
        className="w-full h-full object-contain"
        priority={true}
      />

      <FadeIn
      
        className="absolute -inset-1 rounded-3xl border-2 border-dashed border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  )
}