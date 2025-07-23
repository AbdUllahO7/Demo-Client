"use client"

import { StatType } from "./types"
import { FadeIn } from "@/utils/lightweightAnimations"

interface StatCardProps {
  stat: StatType
  index: number
  isInView: boolean
}

export function StatCard({ stat, index, isInView }: StatCardProps) {
  return (
    <FadeIn
   
      className="flex flex-col items-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm"
    >
      <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-digitek-pink to-digitek-orange">
        {stat.value}
      </span>
      <span className="text-sm text-muted-foreground mt-2">{stat.label}</span>
    </FadeIn>
  )
}
