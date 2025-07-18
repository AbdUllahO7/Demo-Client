"use client"

import { forwardRef } from "react"
import { motion } from "@/components/ui/framer-motion"
import { BookOpen, PhoneCall } from "lucide-react"
import { FadeIn } from "@/utils/lightweightAnimations"

interface ContactHeaderProps {
  isInView: boolean
  content: {
    sectionLabel: string
    sectionTitle: string
    sectionDescription: string
  }
}

export const ContactHeader = forwardRef<HTMLDivElement, ContactHeaderProps>(
  ({ isInView, content }, ref) => {
    return (
      <FadeIn
     
        className="flex flex-col items-center justify-center space-y-4 text-center"
      >
        <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
                >
                  {content.sectionLabel}
        </motion.span>
        <div className="space-y-2">
          <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl text-wtheme-text">{content.sectionTitle}</h2>
          <p className="max-w-[900px] text-wtheme-text font-body md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {content.sectionDescription}
          </p>
        </div>
      </FadeIn>
    )
  }
)

ContactHeader.displayName = "ContactHeader"