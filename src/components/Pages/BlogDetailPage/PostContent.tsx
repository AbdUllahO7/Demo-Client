import React from "react"
import { motion } from "framer-motion"
import { getTranslatedContent } from "@/utils/getTranslatedContent"
import { useLanguage } from "@/contexts/language-context"
import { FadeIn } from "@/utils/lightweightAnimations"

interface PostContentProps {
blog: {
    _id: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      imageUrl?: string // Add imageUrl to the type
      translations: {
        _id: string
        content: string
        language: {
          languageID: string
        }
      }[]
    }[]
  }
}

export const PostContent: React.FC<PostContentProps> = ({ blog }) => {
    const { direction, language } = useLanguage()

  
    const contentElement = blog.elements.find((e) => e.name === "Content")

    const content = getTranslatedContent(contentElement, language)


  return (
    <FadeIn
    
      className={`prose max-w-none dark:prose-invert mb-14 ${direction === "rtl" ? "text-right" : ""}`}
    >

        <p className="text-lg leading-relaxed text-muted-foreground">
        {content}
      </p>
    </FadeIn>
  )
}