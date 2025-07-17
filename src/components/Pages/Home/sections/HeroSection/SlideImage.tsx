"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface SlideImageProps {
  image: string
  title: string
  color: string
}

export default function SlideImage({ image, title, color }: SlideImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="relative mx-auto lg:ml-auto h-full flex items-center"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-2xl blur-xl transform rotate-3 scale-105`}
      ></div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
      </motion.div>
    </motion.div>
  )
}