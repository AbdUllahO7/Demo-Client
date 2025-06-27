"use client"

import React, { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"
import { useSubSections } from "@/lib/subSections/use-subSections"
import { ProductHeader } from "@/components/Pages/ProductDetailPage/ProductHeader"
import { ProductContent } from "@/components/Pages/ProductDetailPage/ProductContent"
import { ProductNotFound } from "@/components/Pages/ProductDetailPage/ProductNotFound"
import { FeaturedImage } from "@/components/Pages/ProductDetailPage/FeaturedImage"

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
    const { direction } = useLanguage()  
    const resolvedParams = use(params)
    const productId = resolvedParams.id
    const { useGetBySectionItemIds, useGetCompleteById } = useSubSections()
    const { data: productData, error: productError } = useGetCompleteById(productId)
    const { data: sectionData, error: sectionError } = useGetBySectionItemIds([productData?.data?.sectionItem?._id])

    // Handle errors or loading states
    if (productError || sectionError) {
      console.error("Errors:", productError, sectionError)
      return <ProductNotFound />
    }
    if (!productData || !sectionData) {
      return <SectionSkeleton variant="default" className="py-20"/>
    }
    console.log("Product Data:", productData.data)

  return (
    <div className="relative w-full py-16 bg-wtheme-background md:py-24 overflow-hidden" dir={direction}>
      <div className="container relative px-4 md:px-6 z-10">
        <div className="max-w-3xl mx-auto bg-wtheme-background">
          <ProductHeader product={productData.data}/>
          <FeaturedImage product={productData.data} />
          <ProductContent product={productData.data} />
        </div>
      </div>
    </div>
  )
}