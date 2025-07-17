import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface RelatedPostCardProps {
  post: {
    title: string
    excerpt: string
    date: string
    image: string
    author: string
    category: string
    readTime: string
  }
  isRTL: boolean
  postIndex: number
  content: {
    readMore: string
  }
}

export const RelatedPostCard: React.FC<RelatedPostCardProps> = ({ 
  post, 
  isRTL, 
  postIndex, 
  content 
}) => {
  // Create a URL-friendly slug from the post title
  const createSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .trim();
  };

  // Use both the index and the title slug for better navigation
  const postUrl = `/blog/${postIndex}-${createSlug(post.title)}`;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group flex flex-col rounded-xl border border-border/40 bg-background/80 backdrop-blur-sm shadow-md overflow-hidden transition-all duration-300 h-full hover:border-primary/30 hover:shadow-lg"
    >
      <Link href={postUrl} className="block h-full">
        <div className="relative h-40 overflow-hidden">
          <div className="transition-transform duration-500 group-hover:scale-105">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              width={300}
              height={160}
              priority={true}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className={`mb-2 ${isRTL ? "text-right" : ""}`}>
              <span className="text-xs font-medium text-primary">{post.category}</span>
            </div>
            <h4 className={`font-medium line-clamp-2 group-hover:text-wtheme-hover transition-colors duration-300 ${isRTL ? "text-right" : ""}`}>
              {post.title}
            </h4> 
          </div>
          
          <div className={`mt-4 ${isRTL ? "text-right" : ""}`}>
            <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
              {content.readMore}
              <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}