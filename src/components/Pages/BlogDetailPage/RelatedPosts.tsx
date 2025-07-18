import React from "react"
import { motion } from "framer-motion"
import { RelatedPostCard } from "./RelatedPostCard"
import { FadeIn } from "@/utils/lightweightAnimations"

interface RelatedPostsProps {
  relatedPosts: any[]
  content: {
    relatedPosts: string
    readMore: string
  }
  blogPosts: any[]
  isRTL: boolean
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ 
  relatedPosts, 
  content, 
  blogPosts, 
  isRTL 
}) => {
  if (relatedPosts.length === 0) return null;
  
  return (
    <FadeIn
    
    >
      <h3 className={`text-2xl font-bold mb-8 ${isRTL ? "text-right" : ""}`}>{content.relatedPosts}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((relatedPost, index) => (
          <RelatedPostCard 
            key={index} 
            post={relatedPost} 
            isRTL={isRTL} 
            postIndex={blogPosts.indexOf(relatedPost) + 1}
            content={content}
          />
        ))}
      </div>
    </FadeIn>
  );
}