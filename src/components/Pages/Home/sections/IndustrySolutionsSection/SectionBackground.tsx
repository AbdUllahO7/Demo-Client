"use client"

import { FadeIn } from "@/utils/lightweightAnimations"
import { motion } from "framer-motion"

export default function SectionBackground() {
  return (
    <>
   

      <FadeIn
   
        className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-digitek-pink blur-3xl"
      />
      <FadeIn
     
        className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />
    </>
  )
}