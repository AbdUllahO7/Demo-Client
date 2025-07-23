"use client"

import { use } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { FeaturedImage } from "@/components/Pages/NewsDetailPage/FeaturedImage"
import { ArticleContent } from "@/components/Pages/NewsDetailPage/ArticleContent"
import { Sidebar } from "@/components/Pages/NewsDetailPage/Sidebar"
import { RelatedArticles } from "@/components/Pages/NewsDetailPage/RelatedArticles"
import { NewsHero } from "@/components/Pages/NewsDetailPage/NewsHero"
import { useSectionContent } from "@/hooks/useSectionContent"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"

// Define the shape of a news item
interface NewsItem {
  id: string
  title: string
  excerpt: string
  image: string
  backLinkText: string
  category: string
}

// Define field mappings for the news data, aligned with NewsSection
const fieldMappings = {
  id: "_id",
  title: "Title",
  excerpt: "Description",
  image: "Background Image",
  backLinkText: "Back Link Text",
  category: "sectionItem.name",
  data : "createdAt",
}

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { language, direction } = useLanguage()
  const searchParams = useSearchParams()

  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const newsId = resolvedParams.id
  const sectionId = searchParams.get("sectionId") 
  const websiteId = searchParams.get("websiteId") 

  // Call useSectionContent at the top level
  const { contentItems, isLoading, error } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings,
  })



  // Get translations for the current language

  // Validate params after hook calls
  if (!newsId || !sectionId || !websiteId) {
    console.error("Missing required params:", { newsId, sectionId, websiteId })
    return null
  }

  // Find the current news article
  const currentNews = contentItems.find((item) => item.id === newsId) as unknown as NewsItem | undefined

  // Find related news (same category, excluding current)
  const relatedNews = currentNews
    ? contentItems
      .filter((item) => item["sectionItem.name"] === currentNews.category && item.id !== currentNews.id)
      .slice(0, 3) as unknown as NewsItem[]
    : []

  // Handle loading state
  if (isLoading) {
    return <SectionSkeleton variant="default" className="py-20" />
  }

  // Handle error state
  if (error) {
    console.error("Error fetching news data:", error)
    return (
      <div className="min-h-screen bg-background" dir={direction}>
        <div className="container px-4 md:px-6 py-8">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p>{error.message || "Failed to load news article. Please try again later."}</p>
        </div>
      </div>
    )
  }

  // Handle not found state
  if (!currentNews) {
    console.warn("No news article found for ID:", newsId)
    return null
  }

  return (
    <div className="min-h-screen bg-wtheme-background " dir={direction}>
      {/* Hero section with title and category */}
      <NewsHero news={currentNews}  />

      {/* Featured image */}
      <FeaturedImage image={currentNews.image} title={currentNews.title} />

      {/* Article content and sidebar */}
      <section className="container px-4 md:px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8">
          {/* Main content */}
          <ArticleContent content={currentNews.excerpt} />
          
          {/* Sidebar with related articles */}
          <Sidebar currentNews={currentNews} allNews={contentItems} />
        </div>
      </section>

      {/* Related articles section */}
      <RelatedArticles relatedNews={relatedNews}  />
    </div>
  )
}