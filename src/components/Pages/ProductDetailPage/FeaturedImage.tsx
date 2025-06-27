import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface FeaturedImageProps {
  product: {
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

export const FeaturedImage: React.FC<FeaturedImageProps> = ({ product }) => {
  // Check if product.elements is not found or empty
  if (!product?.elements || product.elements.length === 0) {
    return null
  }

  // Extract the Background Image element
  const imageElement = product.elements.find((e) => e.name === "Background Image")
  
  // Use imageUrl if available, otherwise fall back to defaultContent or placeholder
  const image = imageElement?.imageUrl || imageElement?.defaultContent || "/placeholder.svg"
  
  // Use product title or a default for alt text (assuming Title is available in elements)
  const titleElement = product.elements.find((e) => e.name === "Title")
  const altText = titleElement?.defaultContent || "Product Image"

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
        width={900}
        height={500}
        className="w-full h-auto object-cover"
      />
    </motion.div>
  )
}