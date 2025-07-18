"use client"

import { motion } from "framer-motion"
import type React from "react"
import FeatureCard from "./FeatureCard"
import { FadeIn } from "@/utils/lightweightAnimations"

interface FeaturesListProps {
    features: Array<{
        title: string
        excerpt: string
        icon?: React.ReactNode
        color: string
    }>
    isInView: boolean
}

export default function FeaturesList({ features, isInView }: FeaturesListProps) {
    return (
        <>
        <div className="mt-10 grid gap-6">
            {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} isInView={isInView} />
            ))}
        </div>

        <FadeIn
          
            className="mt-10"
        >
            {/* Content can be added here in the future */}
        </FadeIn>
        </>
    )
}