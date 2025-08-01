"use client"

import { FadeIn } from "@/utils/OptimizedAnimations"
import { memo } from "react"

interface ContactHeaderProps {
  isInView: boolean
  content: {
    sectionLabel: string
    sectionTitle: string
    sectionDescription: string
  }
}

export const ContactHeader = memo(
  ({ content }: ContactHeaderProps) => {
    if (!content) {
      return null;
    }

    return (
      <FadeIn
        className="flex flex-col items-center justify-center space-y-4 text-center"
      >
        {content.sectionLabel && (
          <span className="inline-block mb-2 text-body text-primary tracking-wider uppercase">
            {content.sectionLabel}
          </span>
        )}
        
        <div className="space-y-2">
          {content.sectionTitle && (
            <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl text-wtheme-text">
              {content.sectionTitle}
            </h2>
          )}
          
          {content.sectionDescription && (
            <p className="max-w-[900px] text-wtheme-text font-body md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {content.sectionDescription}
            </p>
          )}
        </div>
      </FadeIn>
    )
  }
)

ContactHeader.displayName = "ContactHeader"