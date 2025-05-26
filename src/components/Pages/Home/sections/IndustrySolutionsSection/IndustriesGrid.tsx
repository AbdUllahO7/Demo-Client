"use client"

import { motion } from "framer-motion"
import IndustryCard from "./IndustryCard"

interface Industry {
  id: string
  title: string
  excerpt: string
  image: string
  color: string
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
            key={industry.id || index}  // Use id for better React keys
            industry={industry} 
            index={index} 
            isInView={isInView} 
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 text-center"
      >
        {/* This space can be used for a CTA button or additional content */}
      </motion.div>
    </>
  )
}
