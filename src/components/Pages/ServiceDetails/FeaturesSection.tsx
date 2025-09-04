"use client"

import React from 'react'
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { Check } from "lucide-react"

interface FeatureContent {
  heading: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  imagePosition: string;
}

interface Feature {
  id: string;
  title: string;
  content: FeatureContent;
}

interface FeaturesSectionProps {
  features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features = [] }) => {
  const { language, direction } = useLanguage();
  
  const noFeaturesText = language === 'ar' ? 'لا توجد ميزات متاحة' : 'No features available';

  if (features.length === 0) {
    return (
      <div className="mb-8 sm:mb-12 lg:mb-16 py-8 sm:py-12 lg:py-16 text-center px-4">
        <p className="text-wtheme-text font-body text-base sm:text-lg">{noFeaturesText}</p>
      </div>
    );
  }

  return (
    <div className="mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8" dir={direction}>
      <Tabs defaultValue={features[0].id} className="w-full">
        {/* Mobile: Scrollable tabs with better spacing, Desktop: Grid layout */}
        <div className="overflow-x-auto pb-2 mb-6 -mx-2 px-2">
          <TabsList 
            className={`
              flex md:grid w-max md:w-full h-auto
              ${features.length <= 3 ? 'md:grid-cols-' + features.length : 'md:grid-cols-3'}
              gap-1 sm:gap-2
              bg-muted p-1
            `}
            style={{ 
              gridTemplateColumns: features.length <= 3 ? `repeat(${features.length}, 1fr)` : 'repeat(3, 1fr)'
            }}
          >
            {features.map((feature, index) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id} 
                className="
                  py-2 sm:py-2.5 md:py-3 
                  px-3 sm:px-4 md:px-6
                  text-xs sm:text-sm md:text-base 
                  font-body font-medium
                  whitespace-nowrap 
                  min-w-0 
                  flex-shrink-0
                  rounded-md
                  data-[state=active]:text-primary-foreground 
                  data-[state=active]:bg-primary
                  data-[state=inactive]:text-muted-foreground
                  data-[state=inactive]:hover:text-foreground
                  transition-all duration-200 ease-in-out
                  focus-visible:outline-none 
                  focus-visible:ring-2 
                  focus-visible:ring-ring
                "
                style={{
                  minWidth: 'fit-content'
                }}
              >
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {feature.title}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {features.map((feature) => (
          <TabsContent 
            key={feature.id} 
            value={feature.id} 
            className="mt-4 sm:mt-6 p-4 sm:p-6 border rounded-lg sm:rounded-xl shadow-sm bg-card"
          >
            <FeatureContent content={feature.content} direction={direction} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface FeatureContentProps {
  content: FeatureContent;
  direction: string;
}

const FeatureContent: React.FC<FeatureContentProps> = ({ content, direction }) => {
  const { heading, description, features, image, imageAlt, imagePosition } = content;
  
  const ContentSection = () => (
    <div className="space-y-4">
      <h3 className={`
        text-xl sm:text-2xl lg:text-3xl font-heading font-bold mb-3 sm:mb-4 
        text-wtheme-text leading-tight
        ${direction === 'rtl' ? 'text-end' : 'text-start'}
      `}>
        {heading}
      </h3>
      
      <p className={`
        text-wtheme-text font-body text-sm sm:text-base lg:text-lg 
        mb-4 sm:mb-6 leading-relaxed
        ${direction === 'rtl' ? 'text-end' : 'text-start'}
      `}>
        {description}
      </p>
      
      {features && features.length > 0 && (
        <ul className="space-y-2 sm:space-y-3">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className={`
                flex items-start
                ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}
              `}
            >
              <div className={`
                flex-shrink-0 mt-0.5 sm:mt-1 text-primary
                ${direction === 'rtl' ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'}
              `}>
                <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-wtheme-text font-body text-sm sm:text-base leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
  
  const ImageSection = () => (
    <div className="relative h-48 sm:h-64 lg:h-80 w-full rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
      <Image
        src={image || "/placeholder.svg"}
        alt={imageAlt || "Feature image"}
        fill
        priority={true}
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg"
        }}
      />
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
      {imagePosition === "left" ? (
        <>
          {/* Mobile: Image first, Desktop: Image left */}
          <div className="order-1 lg:order-1">
            <ImageSection />
          </div>
          <div className="order-2 lg:order-2">
            <ContentSection />
          </div>
        </>
      ) : (
        <>
          {/* Mobile: Image first, Desktop: Content left */}
          <div className="order-2 lg:order-1">
            <ContentSection />
          </div>
          <div className="order-1 lg:order-2">
            <ImageSection />
          </div>
        </>
      )}
    </div>
  )
}

export default FeaturesSection