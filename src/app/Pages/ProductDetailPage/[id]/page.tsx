// src/app/Pages/ProductDetailPage/[id]/page.tsx - STEP 4 OPTIMIZED
"use client"

import React, { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"
import { useSubSections } from "@/lib/subSections/use-subSections"
import { ProductNotFound } from "@/components/Pages/ProductDetailPage/ProductNotFound"
import dynamic from 'next/dynamic'

// 🚀 STEP 4: Keep critical above-the-fold components static
import { ProductHeader } from "@/components/Pages/ProductDetailPage/ProductHeader"

// 🚀 STEP 4: Lazy load below-the-fold components
const FeaturedImage = dynamic(() => import("@/components/Pages/ProductDetailPage/FeaturedImage").then(mod => ({ default: mod.FeaturedImage })), {
  loading: () => <div className="mb-12 h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-2xl" />,
  ssr: false, // Images don't need SSR
});

const ProductContent = dynamic(() => import("@/components/Pages/ProductDetailPage/ProductContent").then(mod => ({ default: mod.ProductContent })), {
  loading: () => <div className="space-y-4"><div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div><div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div></div>,
  ssr: false,
});

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
    const { direction } = useLanguage()  
    const resolvedParams = use(params)
    const productId = resolvedParams.id
    
    // 🚀 STEP 3 + 4: Single optimized API call
    const { useGetCompleteById } = useSubSections()
    const { data: productData, error: productError, isLoading } = useGetCompleteById(
      productId, 
      true // populateSectionItem
    )

    // 🚀 OPTIMIZED: Single error check and loading state
    if (productError) {
      console.error("Product Error:", productError)
      return <ProductNotFound />
    }
    
    if (isLoading || !productData) {
      return <SectionSkeleton variant="default" className="py-20"/>
    }

    const product = productData.data
    if (!product) {
      return <ProductNotFound />
    }

  return (
    <div className="relative w-full py-16 bg-wtheme-background md:py-24 overflow-hidden" dir={direction}>
      <div className="container relative px-4 md:px-6 z-10">
        <div className="max-w-3xl mx-auto bg-wtheme-background">
          {/* 🚀 STEP 4: Critical content loads immediately */}
          <ProductHeader product={product}/>
          
          {/* 🚀 STEP 4: Non-critical content loads lazily */}
          <FeaturedImage product={product} />
          <ProductContent product={product} />
        </div>
      </div>
    </div>
  )
}