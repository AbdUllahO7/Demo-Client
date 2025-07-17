"use client"

import React from "react"
import Image from "next/image"

interface ProjectImageProps {
  project: {
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

export const ProjectImage: React.FC<ProjectImageProps> = ({ project }) => {
  // Check if project.elements is not found or empty
  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Extract the Background Image element
  const imageElement = project.elements.find((e) => e.name === "Background Image")
  
  // Use imageUrl if available, otherwise fall back to defaultContent or placeholder
  const image = imageElement?.imageUrl || imageElement?.defaultContent || "/placeholder.svg"
  
  // Use project title or a default for alt text (assuming Title is available in elements)
  const titleElement = project.elements.find((e) => e.name === "Title")
  const altText = titleElement?.defaultContent || "Project Image"

  // Don't render if no valid image
  if (!imageElement || !image) {
    return null
  }

  return (
    <section className="container px-4 md:px-6 mb-12">
      <div className="max-w-5xl mx-auto">
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={altText}
            fill
            
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority={true}          
/>
        </div>
      </div>
    </section>
  )
}