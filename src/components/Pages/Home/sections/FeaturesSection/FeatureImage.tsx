"use client"

import Image from "next/image"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"
import { FadeIn } from "@/utils/lightweightAnimations"

interface FeatureImageProps {
    isInView: boolean
    image: string;
    }

export default function FeatureImage({ isInView, image }: FeatureImageProps) {

    
  if(!image) {
      return <SectionSkeleton variant="grid" className="py-20" />
    }

    return (
        <FadeIn
      
        className="relative mx-auto lg:ml-auto"
        >
        <div className="absolute inset-0 bg-theme-gradient from-primary/20 to-secondary/20 rounded-1xl blur-xl transform rotate-3 scale-100"></div>

        <FadeIn
          
            className="relative bg-gradient-to-r p-1 from-primary to-secondary rounded-2xl shadow-xl"
        >
            <div className="bg-background rounded-xl overflow-hidden">
            <Image
                src={image}
                width={600}
                height={600}
                priority={true}
                alt="Product Features"
                className="w-full h-auto"
            />
            </div>

          
        </FadeIn>
        </FadeIn>
    )
}