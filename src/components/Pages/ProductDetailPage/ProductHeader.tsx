// src/components/Pages/ProductDetailPage/ProductHeader.tsx - STEP 5 OPTIMIZED
import React from "react"
import { Calendar, DollarSign } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { GoBackButton } from "@/components/GoBackButton"
import { FadeIn } from "@/utils/lightweightAnimations" // 🚀 STEP 5: Lightweight alternative

interface ProductHeaderProps {
  product: {
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

export const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  const { direction, language } = useLanguage()

  // Check if product.elements is not found or empty
  if (!product?.elements || product.elements.length === 0) {
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

  // Extract fields from product subsection
  const titleElement = product.elements.find((e) => e.name === "Title")
  const descriptionElement = product.elements.find((e) => e.name === "Description")
  const categoryElement = product.elements.find((e) => e.name === "Category")
  const backLinkTextElement = product.elements.find((e) => e.name === "Back Link Text")
  const dateElement = product.elements.find((e) => e.name === "Date")
  const priceElement = product.elements.find((e) => e.name === "Price")

  // Get translated content based on current language
  const title = getTranslatedContent(titleElement, language)
  const description = getTranslatedContent(descriptionElement, language)
  const category = getTranslatedContent(categoryElement, language)
  const backLinkText = getTranslatedContent(backLinkTextElement, language)
  const date = getTranslatedContent(dateElement, language)
  const price = getTranslatedContent(priceElement, language)

  // Check if price should be displayed (not empty, not "0", and not 0)
  const shouldShowPrice = price && 
    price !== "0" && 
    price !== "0.00" && 
    parseFloat(price) !== 0;

  return (
    // 🚀 STEP 5: Replace motion.div with lightweight FadeIn
    <FadeIn duration={600} className="mb-8">
      <GoBackButton sectionName="products" title={backLinkText} />
    
      <div className={`flex items-center gap-3 mb-2`}>
        <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${direction === "rtl" ? "text-right" : ""} from-violet-600 to-indigo-600 text-white shadow-sm`}>
          {category}
        </span>
      </div>
      
      <h1 className={`font-heading text-wtheme-text mb-6 ${direction === "rtl" ? "text-right" : ""}`}>
        {title}
      </h1>
      <p className={`font-body text-wtheme-text mb-6 ${direction === "rtl" ? "text-right" : ""}`}>
        {description}
      </p>
      
      {/* Price Display */}
      {shouldShowPrice && (
        <div className={`mb-6 ${direction === "rtl" ? "text-right" : ""}`}>
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <DollarSign className="w-6 h-6" />
            <span>{price}</span>
          </div>
        </div>
      )}
      
      {date && (
        <div className={`flex flex-wrap items-center gap-5 text-sm text-wtheme-text ${direction === "rtl" ? "justify-end" : ""}`}>
          <div className={`flex items-center gap-2 ${direction === "rtl" ? "justify-end" : ""}`}>
            <Calendar className="w-4 h-4" />
            {formatDate(new Date(date.toString()), "MMM d, yyyy")}
          </div>
        </div>
      )}
    </FadeIn>
  )
}