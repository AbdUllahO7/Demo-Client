import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface FeaturedImageProps {
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

export const FeaturedImage: React.FC<FeaturedImageProps> = ({ blog }) => {


   // Check if project.elements is not found or empty
  if (!blog?.elements || blog.elements.length === 0) {
    return null
  }

  // Extract the Background Image element
  const imageElement = blog.elements.find((e) => e.name === "Background Image")
  
  // Use imageUrl if available, otherwise fall back to defaultContent or placeholder
  const image = imageElement?.imageUrl || imageElement?.defaultContent || "/placeholder.svg"
  
  // Use project title or a default for alt text (assuming Title is available in elements)
  const titleElement = blog.elements.find((e) => e.name === "Title")
  const altText = titleElement?.defaultContent || "Project Image"

  // Don't render if no valid image
  if (!imageElement || !image) {
    return null
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mb-12 rounded-2xl overflow-hidden shadow-xl shadow-primary/5"
    >
      <Image
        src={image || "/placeholder.svg"}
        alt={altText}
        width={800}
        height={600}
        className="w-full h-auto object-cover"
        priority={true}
      />
    </motion.div>
  )
}