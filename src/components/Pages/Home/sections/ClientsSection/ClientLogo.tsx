"use client"

import Image from "next/image"
import { ClientLogoType } from "./types"
import { FadeIn } from "@/utils/OptimizedAnimations"

interface ClientLogoProps {
  client: ClientLogoType
  index: number
  isInView: boolean
}

export function ClientLogo({ client, index, isInView }: ClientLogoProps) {
  return (
    <FadeIn
   
      className="group flex flex-col items-center justify-center"
    >
      <FadeIn
      
        className="relative p-4 rounded-xl bg-background shadow-sm border border-border/50 transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20"
      >
        <Image
          src={client.logo || "/placeholder.svg"}
          alt={client.name}
          width={150}
          priority={true}
          height={60}
          className="h-12 w-auto object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
        />
        
        <FadeIn
        
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-background rounded-full text-xs font-medium border border-border shadow-sm"
        >
          {client.name}
        </FadeIn>
      </FadeIn>
    </FadeIn>
  )
}
