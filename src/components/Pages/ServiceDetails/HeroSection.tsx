'use client'

import Image from "next/image"
import { GoBackButton } from "@/components/GoBackButton"
import { useLanguage } from "@/contexts/language-context"

interface HeroSectionProps {
    heroData: {
        backgroundImage: string;
        title: string;
        description: string;
        backLinkText: string;
        sectionId?: string;
    }
}

const HeroSection = ({ heroData }: HeroSectionProps) => {
    const {
        backgroundImage,
        title,
        description,
        backLinkText,
        sectionId = "services" // Default section to return to
    } = heroData

    const { direction } = useLanguage?.() || { direction: 'ltr' }

    // Fallback values in case data is missing
    const fallbackImage = "/placeholder.svg"
    const displayImage = backgroundImage || fallbackImage
    const displayTitle = title || "Service Details"
    const displayDescription = description || "Learn more about our services"

    return (
        <div className="relative h-[50vh] md:h-[60vh] w-full">
            <Image
                src={displayImage}
                alt={displayTitle}
                fill
                className="object-cover"
                priority={true}
                onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = fallbackImage
                }}
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end">
                <div className="container mx-auto px-4 pb-12">
                    {/* Go back button */}
                    <GoBackButton 
                        sectionName={sectionId}
                        className="mb-4"
                        title={backLinkText} 
                    />
                    <h1 className="text-4xl md:text-5xl  lg:text-6xl font-bold text-white mb-4">
                        {displayTitle}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl">
                        {displayDescription}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeroSection