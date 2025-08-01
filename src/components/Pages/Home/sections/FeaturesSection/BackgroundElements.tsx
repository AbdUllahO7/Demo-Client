"use client"

import { FadeIn } from "@/utils/OptimizedAnimations"


export default function BackgroundElements() {
  return (
    <>
      

      <FadeIn
      
        className="absolute top-1/3 left-0 w-10 h-96 rounded-full bg-digitek-pink blur-3xl"
      />
     
      <FadeIn
      
        className="absolute bottom-1/3 right-0 w-10 h-96 rounded-full bg-digitek-orange blur-3xl"
      />
    </>
  )
}