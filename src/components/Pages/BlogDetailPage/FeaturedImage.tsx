import React from "react"
import Image from "next/image"
import { FadeIn } from "@/utils/lightweightAnimations"

interface FeaturedImageProps {
  product: {
    _id: string
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

export const FeaturedImage: React.FC<FeaturedImageProps> = ({ product }) => {
  // Check if product.elements is not found or empty
  if (!product?.elements || product.elements.length === 0) {
    return null
  }

  // Extract the Background Image element
  const imageElement = product.elements.find((e) => e.name === "Background Image")
  
  // Use imageUrl if available, otherwise fall back to defaultContent or placeholder
  const image = imageElement?.imageUrl || imageElement?.defaultContent || "/placeholder.svg"
  
  // Use product title or a default for alt text
  const titleElement = product.elements.find((e) => e.name === "Title")
  const altText = titleElement?.defaultContent || "Product Image"

  // Don't render if no valid image
  if (!imageElement || !image) {
    return null
  }

  return (
    <FadeIn
   
      className="mb-12 rounded-2xl overflow-hidden shadow-xl shadow-primary/5"
    >
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={image}
          alt={altText}
          fill
          priority={true}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
    </FadeIn>
  )
}