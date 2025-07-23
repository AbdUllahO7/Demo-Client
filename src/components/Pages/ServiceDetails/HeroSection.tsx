'use client'

import Image from "next/image"
import { GoBackButton } from "@/components/GoBackButton"

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
        sectionId = "services"
    } = heroData


    // Fallback values in case data is missing
    const fallbackImage = "/placeholder.svg"
    const displayImage = backgroundImage || fallbackImage
    const displayTitle = title || "Service Details"
    const displayDescription = description || "Learn more about our services"

    return (
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
            <Image
                src={displayImage}
                alt={displayTitle}
                fill
                className="object-cover"
                priority={true}
                sizes="100vw"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                }}
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end">
                <div className="container mx-auto px-4 pb-12">
                    <GoBackButton 
                        sectionName={sectionId}
                        className="mb-4"
                        title={backLinkText} 
                    />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
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