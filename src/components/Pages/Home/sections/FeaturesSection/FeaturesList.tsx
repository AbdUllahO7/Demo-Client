"use client"

import type React from "react"
import FeatureCard from "./FeatureCard"
import { FadeIn } from "@/utils/OptimizedAnimations"

interface FeaturesListProps {
    features?: Array<{
        title?: string
        excerpt: string
        icon?: React.ReactNode
        colo?: string
    }>
    isInView?: boolean
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
        </FadeIn>
        </>
    )
}