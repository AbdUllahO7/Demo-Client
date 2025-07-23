import { Separator } from "@/components/ui/separator"
import { NewsCard } from "./NewsCard"

export function RelatedArticles({ relatedNews}) {
  if (relatedNews.length === 0) return null

  return (
    <section className="container px-4 md:px-6  bg-wtheme-background">
      <div className="max-w-4xl mx-auto">
        <Separator className="mb-12" />
        <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {relatedNews.map((news, index) => (
            <NewsCard key={news.id} news={news}  />
          ))}
        </div>
      </div>
    </section>
  )
}