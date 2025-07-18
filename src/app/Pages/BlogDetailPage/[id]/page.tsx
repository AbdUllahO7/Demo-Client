"use client"

import React, { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useSubSections } from "@/lib/subSections/use-subSections"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"
import { PostHeader } from "@/components/Pages/BlogDetailPage/PostHeader"
import { FeaturedImage } from "@/components/Pages/BlogDetailPage/FeaturedImage"
import { PostContent } from "@/components/Pages/BlogDetailPage/PostContent"
import { ProjectNotFound } from "@/components/Pages/ProjectsDetailPage/data/ProjectNotFound"

export default function BlogDetails({ params }: { params: Promise<{ id: string }> }) {
    const { direction } = useLanguage()  
    const resolvedParams = use(params)
    const blogId = resolvedParams.id
    
    // 🚀 STEP 3: Single optimized API call instead of two separate calls
    const { useGetCompleteById } = useSubSections()
    const { data: blogData, error: blogError, isLoading } = useGetCompleteById(
      blogId,
      true 
    )

    // 🚀 OPTIMIZED: Single error check and loading state
    if (blogError) {
      console.error("Blog Error:", blogError)
      return <ProjectNotFound />
    }
    
    if (isLoading || !blogData) {
      return <SectionSkeleton variant="default" className="py-20"/>
    }

    // 🚀 OPTIMIZED: Extract data from single response
    const blog = blogData.data
    if (!blog) {
      return <ProjectNotFound />
    }

  return (
    <div className="relative w-full py-16 bg-wtheme-background md:py-24 overflow-hidden" dir={direction}>
      <div className="container relative px-4 md:px-6 z-10">
        <div className="max-w-3xl mx-auto bg-wtheme-background">
          <PostHeader blog={blog}/>
          <FeaturedImage blog={blog} />
          <PostContent blog={blog} />
        </div>
      </div>
    </div>
  )
}