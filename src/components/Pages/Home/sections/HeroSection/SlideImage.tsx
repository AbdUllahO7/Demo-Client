"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/utils/OptimizedAnimations"

interface SlideImageProps {
  image: string
  title: string
  color: string
}

export default function SlideImage({ image, title, color }: SlideImageProps) {
  return (
    <FadeIn
    
      className="relative mx-auto lg:ml-auto h-full flex items-center"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-2xl blur-xl transform rotate-3 scale-105`}
      ></div>

      <FadeIn
     
        className={`relative bg-gradient-to-r p-1 ${color} rounded-2xl shadow-xl`}
      >
        <div className="bg-background rounded-xl overflow-hidden">
       
             <motion.img
                    src={image}
                    alt={title}
                    whileHover={{ scale: 1.05 }}
                       className="w-full h-auto rounded-xl"
                  />
        </div>
      </FadeIn>
    </FadeIn>
  )
}