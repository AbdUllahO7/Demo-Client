// FaqHeader.jsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { MessageCircleQuestion, Search } from "lucide-react"
import { FadeIn } from "@/utils/lightweightAnimations"

export const FaqHeader = ({ content, isInView, isRTL, searchQuery, setSearchQuery }) => {
    return (
        <FadeIn
          
            className="relative max-w-3xl mx-auto mb-20 text-center"
        >
         <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
        >
            {content.sectionLabel}
        </motion.span>

        <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            className="text-4xl font-heading font-bold tracking-tight text-wtheme-text sm:text-5xl md:text-6xl"
        >
            <span className="relative inline-block">
            <span className="relative bg-clip-text text-wtheme-text">
                {content.sectionTitle}
            </span>
            </span>
        </motion.h2>

        <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
            className="mt-6  font-body text-wtheme-text"
        >
            {content.sectionDescription}
        </motion.p>
        </FadeIn>
    )
}