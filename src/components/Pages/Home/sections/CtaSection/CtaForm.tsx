"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "@/components/ui/framer-motion"
import { FormField } from "./FormField"
import { FadeIn } from "@/utils/OptimizedAnimations"

interface CtaFormProps {
  content: {
    fullName: string
    fullNamePlaceholder: string
    email: string
    emailPlaceholder: string
    company: string
    companyPlaceholder: string
    requestDemo: string
    terms: string
    termsLink: string
    and: string
    privacyLink: string
    period: string
  }
  direction: string
  isRTL: boolean
}

export function CtaForm({ content, direction, isRTL }: CtaFormProps) {
  return (
    <FadeIn
   
      className="w-full max-w-md mt-6"
    >
      <form className="grid gap-4">
        <FormField
          id="name"
          label={content.fullName}
          placeholder={content.fullNamePlaceholder}
          direction={direction}
          isRTL={isRTL}
        />
        
        <FormField
          id="email"
          label={content.email}
          placeholder={content.emailPlaceholder}
          type="email"
          direction={direction}
          isRTL={isRTL}
        />
        
        <FormField
          id="company"
          label={content.company}
          placeholder={content.companyPlaceholder}
          direction={direction}
          isRTL={isRTL}
        />
        
        <FadeIn
      
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            {content.requestDemo}
          </Button>
        </FadeIn>
      </form>
      <motion.p
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        className="mt-2 text-xs text-muted-foreground text-center"
      >
        {content.terms}{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-wtheme-hover">
          {content.termsLink}
        </Link>{" "}
        {content.and}{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-wtheme-hover">
          {content.privacyLink}
        </Link>
        {content.period}
      </motion.p>
    </FadeIn>
  )
}