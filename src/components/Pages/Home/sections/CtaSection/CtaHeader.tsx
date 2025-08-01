"use client"

import { motion } from "@/components/ui/framer-motion"
import { FadeIn } from "@/utils/OptimizedAnimations"

interface CtaHeaderProps {
  content: {
    badge: string
    heading: string
    subheading: string
  }
}

export function CtaHeader({ content }: CtaHeaderProps) {
  return (
    <>
      <FadeIn
    
        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
      >
        {content.badge}
      </FadeIn>
      <div className="space-y-2">
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
        >
          {content.heading}
        </motion.h2>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="max-w-[600px] text-muted-foreground md:text-xl/relaxed"
        >
          {content.subheading}
        </motion.p>
      </div>
    </>
  )
}
