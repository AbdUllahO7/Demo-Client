"use client"

import { motion } from "@/components/ui/framer-motion"
import { FadeIn } from "@/utils/OptimizedAnimations"

interface FormFieldProps {
  id: string
  label: string
  placeholder: string
  type?: string
  direction: string
  isRTL: boolean
}

export function FormField({ 
  id, 
  label, 
  placeholder, 
  type = "text",
  direction,
  isRTL
}: FormFieldProps) {
  return (
    <FadeIn
    
      className="grid gap-2"
    >
      <label
        htmlFor={id}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isRTL ? "text-right" : "text-left"}`}
      >
        {label}
      </label>
      <motion.input
        whileFocus={{ scale: 1.01, borderColor: "var(--primary)" }}
        id={id}
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isRTL ? "text-right" : "text-left"}`}
        placeholder={placeholder}
        dir={direction}
      />
    </FadeIn>
  )
}