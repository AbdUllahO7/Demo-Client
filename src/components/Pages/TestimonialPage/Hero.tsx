// src/components/Pages/Testimonials/Hero.jsx
"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FadeIn } from "@/utils/lightweightAnimations"
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver"

    export const TestimonialsHero = ({ t, direction }) => {
    const { ref, isInView } = useOptimizedIntersection({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '100px',
    })
    
    return (
        <section className="relative w-full py-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background"></div>
        <div className="absolute top-0 right-0 w-full h-40 bg-grid-pattern opacity-5 transform -rotate-3"></div>

        <FadeIn
         
            className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-digitek-pink blur-3xl"
        />
        <FadeIn
         
            className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
        />

        <div className="container relative z-10 px-4 md:px-6">
            <div ref={ref} className="max-w-4xl mx-auto">
            <Link
                href="/#testimonials"
                className="inline-flex items-center text-muted-foreground hover:text-wtheme-hover mb-6 transition-colors"
            >
                <ArrowLeft className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t.backToHome}
            </Link>

            <h1
              
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
                {t.pageTitle}
            </h1>

            <p
        
                className="text-xl text-muted-foreground mb-12"
            >
                {t.pageDescription}
            </p>
            </div>
        </div>
        </section>
    )
}
