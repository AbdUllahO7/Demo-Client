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
      <div className="mb-16 py-16 text-center">
        <p className="text-wtheme-text font-body">{noFeaturesText}</p>
      </div>
    );
  }

  return (
    <div className="mb-16" dir={direction}>
      <Tabs defaultValue={features[0].id} className="w-full">
        <TabsList className="grid w-full h-auto" style={{ gridTemplateColumns: `repeat(${features.length}, 1fr)` }}>
          {features.map((feature) => (
            <TabsTrigger key={feature.id} value={feature.id} className="py-3  text-sm font-body">
              {feature.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {features.map((feature) => (
          <TabsContent key={feature.id} value={feature.id} className="mt-6 p-6 border rounded-lg">
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
    <div>
      <h3 className={`text-2xl font-heading  mb-4 text-wtheme-text ${direction === 'rtl' ? 'text-end' : ''}`}>{heading}</h3>
      <p className={`text-wtheme-text font-body mb-4 leading-relaxed ${direction === 'rtl' ? 'text-end' : ''}`}>
        {description}
      </p>
      {features && features.length > 0 && (
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className={`${direction === 'rtl' ? 'flex-row-reverse' : ''} flex`}>
              <div className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} mt-1 text-primary`}>
                <Check className="h-5 w-5" />
              </div>
              <span className="text-wtheme-text font-body">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
  
  const ImageSection = () => (
    <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-lg">
      <Image
        src={image || "/placeholder.svg"}
        alt={imageAlt || "Feature image"}
        fill
        priority={true}
        className="object-cover transition-transform duration-300 hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg"
        }}
      />
    </div>
  )

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {imagePosition === "left" ? (
        <>
          <div className="order-2 md:order-1">
            <ImageSection />
          </div>
          <div className="order-1 md:order-2">
            <ContentSection />
          </div>
        </>
      ) : (
        <>
          <ContentSection />
          <ImageSection />
        </>
      )}
    </div>
  )
}

export default FeaturesSection