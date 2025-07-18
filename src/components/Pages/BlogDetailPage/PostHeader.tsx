  import React from "react"
  import {  Calendar } from "lucide-react"
  import { motion } from "framer-motion"
  import { useLanguage } from "@/contexts/language-context"
  import { formatDate } from "@/lib/utils"
  import { GoBackButton } from "@/components/GoBackButton"
import { FadeIn } from "@/utils/lightweightAnimations"

  interface PostHeaderProps {
    blog: {
      _id: string
      elements: {
        _id: string
        name: string
        type: string
        defaultContent: string
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

  export const PostHeader: React.FC<PostHeaderProps> = ({ blog }) => {

      const { direction, language } = useLanguage()
    
    // Check if project.elements is not found or empty
    if (!blog?.elements || blog.elements.length === 0) {
      return null
    }

    // Helper function to get translated content
    const getTranslatedContent = (element: any, lang: string) => {
      if (!element) {
        return ""
      }
      if (!element.translations || !element.translations?.length) {
        return element.defaultContent || ""
      }

      const translation = element.translations?.find((t: any) => t.language.languageID === lang)
      const content = translation ? translation.content : element.defaultContent
      return content || ""
    }

    // Extract fields from project subsection
    const titleElement = blog.elements.find((e) => e.name === "Title")
    const descriptionElement = blog.elements.find((e) => e.name === "Description")
    const categoryElement = blog.elements.find((e) => e.name === "Category")
    const backLinkTextElement = blog.elements.find((e) => e.name === "Back Link Text")
    const dateElement = blog.elements.find((e) => e.name === "Date")


    // Get translated content based on current language
    const title = getTranslatedContent(titleElement, language)
    const description = getTranslatedContent(descriptionElement, language)
    const category = getTranslatedContent(categoryElement, language)
    const backLinkText = getTranslatedContent(backLinkTextElement, language)
    const date = getTranslatedContent(dateElement, language)



    return (
      <FadeIn
      
        className="mb-8"
      >
        <GoBackButton sectionName="blog" title={backLinkText}  />
      
        <div className={`flex items-center gap-3 mb-2 `}>
          <span className={`inline-block px-3 py-1  rounded-full bg-gradient-to-r ${direction  === "rtl" ? "text-right" : ""} from-violet-600 to-indigo-600 text-white shadow-sm`}>
            {category}
          </span>
        </div>
        
        <h1 className={`font-heading text-wtheme-text mb-6 ${direction  === "rtl" ? "text-right" : ""}`}>
          {title}
        </h1>
        <p className={`font-body text-wtheme-text ${direction  === "rtl" ? "text-right" : ""}`}>{description}</p>
        
        <div className={`flex flex-wrap items-center gap-5 text-sm text-wtheme-text  ${direction  === "rtl" ? "justify-end" : ""}`}>
          <div className={`flex items-center gap-2 ${direction  === "rtl" ? "justify-end" : ""}`}>
            <Calendar className="w-4 h-4" />
                {formatDate(new Date(date.toString()), "MMM d, yyyy") }
          </div>
          
        </div>
      </FadeIn>
    )
  }