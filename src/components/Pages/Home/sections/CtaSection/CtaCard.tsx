"use client"

import { forwardRef } from "react"
import { CtaHeader } from "./CtaHeader"
import { CtaForm } from "./CtaForm"
import { FadeIn } from "@/utils/OptimizedAnimations"


interface CtaCardProps {
    content: any
    isInView: boolean
    direction: string
}

export const CtaCard = forwardRef<HTMLDivElement, CtaCardProps>(
    ({ content, isInView, direction }, ref) => {
        const isRTL = direction === "rtl"

        return (
        <FadeIn
           
            className="mx-auto max-w-3xl rounded-2xl border bg-background p-6 shadow-xl md:p-10 lg:p-12"
        >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CtaHeader content={content} />
            <CtaForm content={content} direction={direction} isRTL={isRTL} />
            </div>
        </FadeIn>
        )
    }
)

CtaCard.displayName = "CtaCard"