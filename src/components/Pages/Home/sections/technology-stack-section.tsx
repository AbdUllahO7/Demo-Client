"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"
import { technologies } from "../ConstData/ConstData"
import { FadeIn } from "@/utils/lightweightAnimations"

export default function TechnologyStackSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const { t, direction, language } = useLanguage()


  // Function to get current language text
  const getCurrentText = (tech: any, field: 'name') => {
    return language === 'ar' ? tech[`${field}En`] : tech[`${field}En`]
  }

  return (
    <section 
      className="relative w-full py-20 overflow-hidden" 
      dir={direction}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 z-0" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f6,transparent)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_500px_at_80%_80%,#8b5cf6,transparent)]" />
      </div>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container relative z-10 px-4 md:px-6" ref={ref}>
        <FadeIn 
      
          className="relative max-w-3xl mx-auto mb-20 text-center"
        >
          <FadeIn
          
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'en' ? "Cutting-Edge Stack" : 'مجموعة متطورة'}</span>
          </FadeIn>
          
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-black dark:text-white"
          >
            {language === 'en' ? " Powered by Innovation" : ' مدعوم بالابتكار'}
          </motion.h2>
          
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
            className="mt-6 text-xl text-muted-foreground"
          >
            {language === 'en' ? ' We leverage the most advanced technologies to build solutions that are fast, scalable, and future-proof.' : 'نحن نستفيد من أحدث التقنيات لبناء حلول سريعة وقابلة للتطوير ومقاومة للمستقبل.'}
          </motion.p>
        </FadeIn>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
          {technologies.map((tech, index) => (
            <FadeIn
              key={index}
          
              className="group relative flex flex-col items-center"
            >
              {/* Card with gradient border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 blur-xl group-hover:opacity-30 transition-opacity duration-700`} />
              
              <div className="relative w-full h-full p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm group-hover:border-primary/30 group-hover:bg-card/50 transition-all duration-300">
                <div className="flex flex-col items-center">
                  {/* Icon with gradient background */}
                  <div className="relative flex items-center justify-center w-16 h-16 mb-4 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                    <Image 
                      src={tech.icon || "/placeholder.svg"} 
                      alt={getCurrentText(tech, 'name')} 
                      width={40} 
                      priority={true}
                      height={40} 
                      className="relative z-10 drop-shadow-sm" 
                    />
                  </div>
                  
                  <h3 className="text-base font-medium text-center group-hover:text-wtheme-hover transition-colors duration-300">
                    {getCurrentText(tech, 'name')}
                  </h3>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn
     
          className="mt-24 max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated gradient border */}  
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-blue-500 p-[2px] rounded-3xl animate-[gradient_4s_ease_infinite]" style={{ backgroundSize: "200% 200%" }} />
            
            <div className="relative rounded-[calc(1.5rem-2px)] bg-black/80 backdrop-blur-xl p-10 overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    {language === 'en' ? "Transform Your Digital Presence" : 'حوّل حضورك الرقمي'}
                  </h3>
                  <p className="text-white/70 text-lg">
                    {language === 'en' ? ' Our team of experts will help you leverage these technologies to build solutions that drive real business results.' : 'سيساعدك فريق الخبراء لدينا على الاستفادة من هذه التقنيات لبناء حلول تؤدي إلى نتائج أعمال حقيقية.'}
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-white text-black hover:bg-white/90 hover:text-black px-8 h-14 rounded-full shadow-lg shadow-primary/20"
                >
                  <Link 
                    href="#contact" 
                    className="flex items-center gap-2 font-medium"
                  >
                    {language === 'en' ? "Get Started" : 'ابدأ الآن'}
                    {direction === 'ltr' ? (
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    ) : (
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1 transform scale-x-[-1]" />
                    )}
                  </Link>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}