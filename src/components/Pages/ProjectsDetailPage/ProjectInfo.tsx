"use client"

import type React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"

interface ProjectInfoProps {
  project: {
    _id: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      fileUrl?: string
      fileMimeType?: string
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

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project, clients }) => {
  const { language } = useLanguage()

  // Check if project.elements is not found or empty
  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Helper function to get translated content
  const getTranslatedContent = (element: any, lang: string): string => {
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

  // Extract fields for other info
  const clientElement = clients?.elements?.find((e) => e.name === "Client")
  const industryElement = clients?.elements?.find((e) => e.name === "Industry")
  const yearElement = clients?.elements?.find((e) => e.name === "Year")
  const technologiesElement = clients?.elements?.find((e) => e.name === "Technologies")

  const clientElementName = clients?.elements?.find((e) => e.name === "ClientName")
  const industryElementName = clients?.elements?.find((e) => e.name === "IndustryName")
  const yearElementName = clients?.elements?.find((e) => e.name === "YearName")
  const technologiesElementName = clients?.elements?.find((e) => e.name === "TechnologiesName")

  // Get translated content
  const client = getTranslatedContent(clientElement, language)
  const industry = getTranslatedContent(industryElement, language)
  const year = getTranslatedContent(yearElement, language)
  const technologiesString = getTranslatedContent(technologiesElement, language)

  const ClientName = getTranslatedContent(clientElementName, language)
  const IndustryName = getTranslatedContent(industryElementName, language)
  const YearName = getTranslatedContent(yearElementName, language)
  const TechnologiesName = getTranslatedContent(technologiesElementName, language)

  // Convert technologies string to array
  const technologies = technologiesString ? technologiesString.split(",").map((tech) => tech.trim()) : []

  // Don't render if no data
  if (!project || !clients || (!client && !industry && !year && !technologies.length)) {
    return null
  }

  return (
    <section className="container px-4 md:px-6 mb-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Project Info Grid */}
        <Card className="shadow-none border-0">
          <CardContent className="shadow-0 border-0 bg-wtheme-background">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {client && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide">{ClientName}</h3>
                  <p className="text-lg font-semibold text-wtheme-text">{client}</p>
                </div>
              )}
              {industry && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide">{IndustryName}</h3>
                  <p className="text-lg font-semibold text-wtheme-text">{industry}</p>
                </div>
              )}
              {year && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide">{YearName}</h3>
                  <p className="text-lg font-semibold text-wtheme-text">{year}</p>
                </div>
              )}
              {technologies.length > 0 && (
                <div className="space-y-2 bg-wtheme-background">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide bg-wtheme-background">{TechnologiesName}</h3>
                  <div className="flex flex-wrap gap-1 bg-wtheme-background">
                    {technologies.map((tech, i) => (
                        <>
                        <span className="bg-wtheme-background text-wtheme-text">{tech}</span>
                        </>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}