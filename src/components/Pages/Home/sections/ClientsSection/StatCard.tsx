"use client"

import { motion } from "framer-motion"
import { StatType } from "./types"

interface StatCardProps {
  stat: StatType
  index: number
  isInView: boolean
}

export function StatCard({ stat, index, isInView }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
      className="flex flex-col items-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm"
    >
      <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-digitek-pink to-digitek-orange">
        {stat.value}
      </span>
      <span className="text-sm text-muted-foreground mt-2">{stat.label}</span>
    </motion.div>
  )
}
