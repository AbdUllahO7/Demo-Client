"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ClientLogo } from "./ClientLogo"
import { StatCard } from "./StatCard"
import { clientsData } from "./data"
import { FadeIn } from "@/utils/lightweightAnimations"


export default function ClientsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { direction } = useLanguage()

  const clients = clientsData.clients
  const stats = clientsData.stats

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-8 text-center mb-12">
          <FadeIn
          
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {direction === "ltr" ? "Our Clients" : "عملاؤنا"}
          </FadeIn>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            {direction === "ltr" ? "Trusted by Industry Leaders" : "قادة الصناعة الموثوق بهم"}
          </motion.h2>
          
          <FadeIn
         
            className="h-1 bg-gradient-to-r from-digitek-pink to-digitek-orange rounded-full"
          />
        </div>

        {/* Marquee effect for smaller screens */}
        <div className="md:hidden overflow-hidden mb-8">
          <FadeIn

            className="flex gap-8 min-w-max"
          >
            {[...clients, ...clients].map((client, index) => (
              <ClientLogo key={`scroll-${index}`} client={client} index={index} isInView={isInView} />
            ))}
          </FadeIn>
        </div>

        {/* Static grid for larger screens */}
        <FadeIn
        
          className="hidden md:grid grid-cols-4 gap-x-12 gap-y-16"
        >
          {clients.map((client, index) => (
            <ClientLogo key={index} client={client} index={index} isInView={isInView} />
          ))}
        </FadeIn>
        
        {/* Stats */}
        <FadeIn
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isInView={isInView} />
          ))}
        </FadeIn>
      </div>
    </section>
  )
}