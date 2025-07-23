"use client"

import { ReactNode } from "react"
import { FadeIn } from "@/utils/lightweightAnimations"

interface ContactInfoItemProps {
  icon: ReactNode
  title: string
  content: ReactNode
  isRTL: boolean
}

export function ContactInfoItem({ icon, title, content, isRTL }: ContactInfoItemProps) {
  return (
    <FadeIn  className={`flex items-start gap-4 ${isRTL ? "" : ""}`}>
      <div className="rounded-full bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h4 className="font-heading  text-wtheme-text">{title}</h4>
        <p className="text-wtheme-text font-body">{content}</p>
      </div>
    </FadeIn>
  )
}