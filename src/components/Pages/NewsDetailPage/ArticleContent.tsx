"use client"

import { useRef } from "react"
import { motion
 } from "framer-motion"
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver"

export function ArticleContent({ content }) {
    const contentRef = useRef(null)
const {  isInView } = useOptimizedIntersection({
  threshold: 0.2,
  triggerOnce: true,
  rootMargin: '100px'
})

    return (
        <div ref={contentRef} className="bg-wtheme-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none font-body text-wtheme-text prose-headings:font-heading prose-headings:text-wtheme-text prose-p:text-wtheme-text prose-li:text-wtheme-text prose-strong:text-wtheme-text prose-a:text-primary prose-blockquote:text-wtheme-text/80 prose-blockquote:border-primary/30"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}