"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ProcessSteps } from "../ConstData/ConstData"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function ProcessSection({websiteId , sectionId}) {
  const { t,  language } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  

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
      <motion.div 
        style={{ y: yBgShape1, opacity: opacityBg }}
        className="absolute right-0 top-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
      />
      <motion.div 
        style={{ y: yBgShape2, opacity: opacityBg }}
        className="absolute -left-20 bottom-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto"
        >
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
              >
                {content.sectionLabel}
              </motion.span>
          <h2 className="text-4xl font-heading font-bold text-wtheme-text md:text-5xl lg:text-6xl bg-clip-text">
            {content.sectionTitle}
          </h2>
          <p className="text-lg font-body text-wtheme-text md:text-xl">
            {content.sectionDescription}
          </p>
        </motion.div>

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
            <motion.path
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
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
  isInView, 
  isLast, 
  getCurrentText 
}: ProcessStepProps) {
  const stepRef = useRef(null)
  const isStepInView = useInView(stepRef, { once: false, amount: 0.3 })
  const { direction } = useLanguage()
  const isOdd = index % 2 === 1
  
  // Different animations based on screen size
  const mobileVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay: index * 0.2 
      } 
    }
  }
  
  const desktopVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay: 0.3 + index * 0.2 
      } 
    }
  }

  // Use primary colors consistently
  const accentColor = "bg-primary"

  return (
    <motion.div
      ref={stepRef}
      className={`relative lg:flex lg:flex-col lg:h-full lg:justify-center ${isOdd ? 'lg:mt-64' : ''}`}
      initial="hidden"
      animate={isStepInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* Number indicator */}
      <motion.div
        variants={mobileVariants}
        className={`z-20 flex items-center justify-center w-16 h-16 rounded-full ${accentColor} text-white text-xl font-heading font-bold   lg:absolute lg:-top-8 lg:left-1/2 lg:-translate-x-1/2 mb-6 mx-auto lg:mb-0`}
      >
        {step.number}
      </motion.div>
      
      {/* Content Card */}
      <motion.div
        variants={desktopVariants}
        whileHover={{ 
          y: -5, 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.3 }
        }}
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
      </motion.div>
      
      {/* Connecting line for mobile */}
      {!isLast && (
        <motion.div
          initial={{ height: 0 }}
          animate={isStepInView ? { height: 60 } : { height: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`absolute -bottom-16 left-1/2 w-0.5 ${accentColor} -translate-x-1/2 lg:hidden`}
        />
      )}
    </motion.div>
  )
}