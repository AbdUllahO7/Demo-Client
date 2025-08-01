// src/components/Pages/Testimonials/TestimonialCard.jsx
"use client"

import Image from "next/image"
import { Quote } from "lucide-react"
import { FadeIn } from "@/utils/OptimizedAnimations"

export const TestimonialCard = ({ testimonial, index, direction }) => {

    return (
        <FadeIn
       
        className="group relative overflow-hidden rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col"
        >
        {/* Top gradient bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${testimonial.color}`}></div>

        <div className="p-6 md:p-8 flex flex-col h-full">
            {/* Category badge */}
            <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-muted">
                {testimonial.category}
            </span>
            </div>

            {/* Rating */}
            <div className="flex mb-4" dir="ltr">
            {[...Array(5)].map((_, i) => (
                <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={i < testimonial.rating ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={i < testimonial.rating ? "text-yellow-500" : "text-muted"}
                >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
            </div>

            {/* Quote icon */}
            <div
            className={`w-12 h-12 mb-6 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white`}
            >
            <Quote className="h-6 w-6" />
            </div>

            <p className="italic text-muted-foreground mb-8 flex-grow">"{testimonial.quote}"</p>

            <div className="mt-auto pt-6 border-t border-border/50 flex items-center">
            <div className={`relative ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}>
                <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${testimonial.color} blur-sm opacity-70 scale-110`}
                ></div>
                <div
                className={`relative overflow-hidden rounded-full border-2 border-white h-12 w-12 bg-gradient-to-r ${testimonial.color} p-0.5`}
                >
                <div className="rounded-full overflow-hidden h-full w-full bg-background">
                    <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    priority={true}
                    className="h-full w-full object-cover"
                    />
                </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold group-hover:text-wtheme-hover transition-colors duration-300">
                {testimonial.author}
                </h4>
                <p className={`text-sm bg-clip-text text-transparent bg-gradient-to-r ${testimonial.color}`}>
                {testimonial.role}
                </p>
            </div>
            </div>
        </div>
        
        {/* Corner accent */}
        <div
            className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${testimonial.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
        ></div>
        </FadeIn>
    )
}
