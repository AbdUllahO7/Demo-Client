// FaqItem.jsx
"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { FadeIn } from "@/utils/OptimizedAnimations"

export const FaqItem = ({ faq, index, isInView, isRTL }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <FadeIn
     
      className="group relative"
    >
      {/* Enhanced glass card effect with theme gradient */}
      <div
        className={`absolute inset-0 rounded-2xl bg-primary/5 opacity-0 ${
          isOpen ? "opacity-100" : "group-hover:opacity-80"
        } transition-opacity duration-300`}
      />

      <FadeIn
        className={`relative rounded-2xl ${
          isOpen 
            ? "border-primary  border-2" 
            : "border-primary "
        } backdrop-blur-sm shadow-sm overflow-hidden transition-all border-primary duration-300 border bg-wtheme-background`}
   
      
      >
        <button
          onClick={toggleOpen}
          className={`flex items-center justify-between w-full p-6 text-left ${isRTL ? "flex-row-reverse" : ""}`}
          aria-expanded={isOpen}
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`
              flex items-center justify-center min-w-10 h-10 rounded-full 
              ${isOpen 
                ? "bg-primary text-white" 
                : "bg-primary/10 text-primary"
              } transition-colors duration-300
            `}>
              <span className="font-body ">{index + 1}</span>
            </div>
            <h3
              className={`text-lg font-heading font-medium ${
                isOpen ? "text-primary" : "text-wtheme-text"
              } transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}
            >
              {faq.question}
            </h3>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="text-xs font-accent px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {faq.category }
            </span>
            <FadeIn
            
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isOpen ? "bg-primary/10 text-primary" : "bg-wtheme-text/10 text-wtheme-text/60"
              } transition-colors duration-300`}
            >
              <ChevronDown className="w-4 h-4" />
            </FadeIn>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <FadeIn
            
              className="overflow-hidden"
            >
              <div className={`p-6 pt-0 border-t border-primary ${isRTL ? "pr-20 text-right" : "pl-20 text-left"} text-wtheme-text`}>
                <p className="leading-relaxed font-body">{faq.answer}</p>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>
      </FadeIn>
    </FadeIn>
  )
}