"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GoBackButton } from "@/components/GoBackButton"
import { useLanguage } from "@/contexts/language-context"
import { FadeIn } from "@/utils/lightweightAnimations"

interface ProjectHeroProps {
  project: {
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
  clients: {
    _id?: string
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

export const ProjectHero = ({ project, clients }: ProjectHeroProps) => {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  const { language, direction } = useLanguage()

  // Check if project.elements is not found or empty
  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Helper function to get translated content
  const getTranslatedContent = (element: any, lang: string) => {
    if (!element) {
      return ""
    }
    if (!element.translations || !element?.translations?.length) {
      return element.defaultContent || ""
    }

    const translation = element?.translations?.find((t: any) => t.language.languageID === lang)
    const content = translation ? translation.content : element.defaultContent
    return content || ""
  }

  // Extract fields from project subsection
  const titleElement = project.elements.find((e) => e.name === "Title")
  const descriptionElement = project.elements.find((e) => e.name === "Description")
  const categoryElement = project.elements.find((e) => e.name === "Category")
  const backLinkTextElement = project.elements.find((e) => e.name === "Back Link Text")

  // Extract fields from clients subsection
  const technologiesElement = clients?.elements?.find((e) => e.name === "Technologies")

  // Get translated content based on current language
  const title = getTranslatedContent(titleElement, language)
  const description = getTranslatedContent(descriptionElement, language)
  const category = getTranslatedContent(categoryElement, language)
  const backLinkText = getTranslatedContent(backLinkTextElement, language)
  const technologies = getTranslatedContent(technologiesElement, language)

  return (
    <section className="relative w-full py-20 overflow-hidden bg-wtheme-background">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-wtheme-background"></div>

      <FadeIn
    
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl"
      />
      <FadeIn
      
        className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full bg-accent blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={headerRef} className="max-w-4xl mx-auto">
          <GoBackButton sectionName="projects" title={backLinkText} />

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-accent font-body text-white bg-primary">
              {category}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-6 text-wtheme-text"
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-wtheme-text font-body mb-6 whitespace-pre-line"
            >
              {description}
            </motion.p>
          )}

          {technologies && (
            <FadeIn
             
              className="flex flex-wrap gap-2 mb-6"
            >
              <span className="px-3 py-1 rounded-full text-xs font-body font-medium text-wtheme-text ">{technologies}</span>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}