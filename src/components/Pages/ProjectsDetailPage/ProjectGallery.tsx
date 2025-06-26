"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectGalleryProps {
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
      imageUrl?: string
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

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project, clients }) => {
  const { language, direction } = useLanguage()
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Helper function to get translated content (for title)
  const getTranslatedContent = (element: any, lang: string): string => {
    if (!element) {
      return ""
    }
    if (!element?.translations || !element?.translations?.length) {
      return element?.defaultContent || ""
    }

    const translation = element?.translations?.find((t: any) => t.language.languageID === lang)
    const content = translation ? translation?.content : element?.defaultContent
    return content || ""
  }

  const titleElement = project.elements.find((e) => e.name === "Title")
  const galleryTextElement = project.elements.find((e) => e.name === "Gallery Text")

  const title = getTranslatedContent(titleElement, language) || "Project"
  const galleryText = getTranslatedContent(galleryTextElement, language) || "Project"

  const imageElements = clients?.elements?.filter((e) => e.type === "image") || []
  const images = imageElements.map((e) => ({
    url: e.imageUrl || e.defaultContent || "/placeholder.svg",
    name: e.name,
  }))

  // Don't render if no images
  if (!images.length) {
    return null
  }

  // Modal handlers
  const openModal = (index: number) => {
    setSelectedImageIndex(index)
    document.body.style.overflow = 'hidden' // Prevent background scroll
  }

  const closeModal = () => {
    setSelectedImageIndex(null)
    document.body.style.overflow = 'unset' // Restore scroll
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  return (
    <>
      <section className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto pb-12">
          <h3 className="text-2xl font-bold mb-6">{galleryText}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openModal(index)}
              >
                <Image
                  src={image.url}
                  alt={`${title} gallery image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                  priority={index < 2}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                    Click to view
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-60 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Modal image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImageIndex].url}
              alt={`${title} gallery image ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}