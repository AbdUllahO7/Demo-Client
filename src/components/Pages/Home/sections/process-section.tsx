"use client"

import { useRef } from "react"
import Image from "next/image"
import {  useScroll, useTransform } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver"
import { FadeIn } from "@/utils/OptimizedAnimations"

export default function ProcessSection({websiteId , sectionId}) {
  const { t,  language } = useLanguage()
  const sectionRef = useRef(null)
  
  const { isInView } = useOptimizedIntersection({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '100px'
  })
    const { content, isLoading: sectionLoading, error: sectionError, refetch, direction, formatDate } = useSectionLogic({
      sectionId,
      websiteId,
      itemsKey: "process",
    })


      const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
        sectionId,
        websiteId,
        fieldMappings: {
          id: "_id",
          image: "Background Image",
          title: "Title",
          excerpt: "Description",
          date: "createdAt",
          color: () => "theme-gradient"
        }
      })
    

  

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const yBgShape1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const yBgShape2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacityBg = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])


  // Function to get current language text
  const getCurrentText = (step: any, field: 'title' | 'description') => {
    return language === 'ar' ? step[`${field}Ar`] : step[`${field}En`]
  }

  return (
    <section 
      className="relative w-full py-20 overflow-hidden bg-wtheme-background" 
      ref={sectionRef}
      dir={direction}
    >
      {/* Background elements */}
      <div className="absolute inset-0" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
      
      {/* Background decorative shapes */}
      <FadeIn
        className="absolute right-0 top-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
      />
      <FadeIn 
        className="absolute -left-20 bottom-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <FadeIn
       
          className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto"
        >
            <span
            
                className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
              >
                {content.sectionLabel}
              </span>
          <h2 className="text-4xl font-heading font-bold text-wtheme-text md:text-5xl lg:text-6xl bg-clip-text">
            {content.sectionTitle}
          </h2>
          <p className="text-lg font-body text-wtheme-text md:text-xl">
            {content.sectionDescription}
          </p>
        </FadeIn>

        <div className="mt-24 space-y-32 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-16 xl:gap-24">
                  <div className="mt-24 space-y-32 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
            {contentItems.map((item, index) => (
              <ProcessStep 
                key={item.id} 
                step={{
                  number: `${index + 1}`, // Generate step number (e.g., 1, 2, 3)
                  titleEn: item.title, // Assuming title is in English
                  titleAr: item.titleAr || item.title, // Fallback to English if no Arabic title
                  descriptionEn: item.excerpt, // Map excerpt to description
                  descriptionAr: item.excerptAr || item.excerpt, // Fallback to English if no Arabic description
                  color: item.color,
                  image: item.image,
                  accent: "primary" // Use primary consistently
                }} 
                index={index} 
                isInView={isInView} 
                isLast={index === contentItems.length - 1}
                getCurrentText={getCurrentText}
              />
            ))}
          </div>
        </div>

        {/* Connection lines for desktop - visible only on lg+ screens */}
        <div className="hidden lg:block absolute top-0 left-0 right-0 h-full pointer-events-none">
          <svg className="absolute top-[28%] left-0 w-full h-[60%]" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Main zigzag path */}
            <path
            
              d="M0,20 L50,0 L50,33 L100,20 M0,80 L50,60 L50,100 L100,80"
              fill="none"
              stroke="url(#themeGradient)"
              strokeWidth="0.5"
              strokeDasharray="1,3"
              className="opacity-40"
            />
            
            {/* Gradient definition using theme colors */}
            <defs>
              <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--website-theme-primary)" />
                <stop offset="33%" stopColor="var(--website-theme-secondary)" />
                <stop offset="66%" stopColor="var(--website-theme-accent)" />
                <stop offset="100%" stopColor="var(--website-theme-primary)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}

interface ProcessStepProps {
  step: {
    number: string
    titleEn: string
    titleAr: string
    descriptionEn: string
    descriptionAr: string
    color: string
    image: string
    accent: string
  }
  index: number
  isInView: boolean
  isLast: boolean
  getCurrentText: (step: any, field: 'title' | 'description') => string
}

function ProcessStep({ 
  step, 
  index, 
  isLast, 
  getCurrentText 
}: ProcessStepProps) {
  const isOdd = index % 2 === 1
  

  // Use primary colors consistently
  const accentColor = "bg-primary"

  return (
    <FadeIn
      className={`relative lg:flex lg:flex-col lg:h-full lg:justify-center ${isOdd ? 'lg:mt-64' : ''}`}
     
    >
      {/* Number indicator */}
      <FadeIn
        className={`z-20 flex items-center justify-center w-16 h-16 rounded-full ${accentColor} text-white text-xl font-heading font-bold   lg:absolute lg:-top-8 lg:left-1/2 lg:-translate-x-1/2 mb-6 mx-auto lg:mb-0`}
      >
        {step.number}
      </FadeIn>
      
      {/* Content Card */}
      <FadeIn
  
        className="relative z-10 backdrop-blur-sm rounded-2xl border border-wtheme-border/50 bg-wtheme-background overflow-hidden shadow-xl"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className={`absolute inset-0 ${accentColor} mix-blend-multiply opacity-20`}></div>
          <Image
            src={step.image}
            alt={getCurrentText(step, 'title')}
            width={600}
            height={400}
            priority={true}
            className="object-cover w-full h-full"
          />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-wtheme-background/80 to-transparent opacity-60"></div>
          <div className={`absolute bottom-0 left-0 w-full h-1 ${accentColor}`}></div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-heading  mb-3 text-wtheme-text">
            {getCurrentText(step, 'title')}
          </h3>
          <p className="font-body text-wtheme-text">
            {getCurrentText(step, 'description')}
          </p>
          
          {/* Feature dots - purely decorative */}
          <div className="flex space-x-1 mt-6">
            <div className={`h-1.5 w-1.5 rounded-full `}></div>
            <div className={`h-1.5 w-1.5 rounded-full bg-wtheme-text/30`}></div>
            <div className={`h-1.5 w-1.5 rounded-full bg-wtheme-text/30`}></div>
          </div>
        </div>
      </FadeIn>
      
      {/* Connecting line for mobile */}
      {!isLast && (
        <FadeIn
      
          className={`absolute -bottom-16 left-1/2 w-0.5 ${accentColor} -translate-x-1/2 lg:hidden`}
        />
      )}
    </FadeIn>
  )
}