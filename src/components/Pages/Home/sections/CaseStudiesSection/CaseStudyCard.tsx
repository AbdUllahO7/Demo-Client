"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { CaseStudy } from "./types"

interface CaseStudyCardProps {
    study: CaseStudy
    index: number
    isInView: boolean
}

export function CaseStudyCard({ study, index, isInView }: CaseStudyCardProps) {
    const { t } = useLanguage()
    const cardRef = useRef(null)
    const cardInView = useInView(cardRef, { once: false, amount: 0.3 })

    return (
        <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
        className="group relative overflow-hidden rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500"
        >
        {/* Top gradient bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${study.color}`}></div>

        <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-wtheme-hover transition-colors duration-300">
                {study.title}
                </h3>

                <p className="text-muted-foreground mb-6">{study.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                {study.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                    <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${study.color}`}>
                        {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                ))}
                </div>

                <div className="mt-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full group-hover:bg-gradient-to-r ${study.color} group-hover:text-white transition-all duration-300 px-4 py-2`}
                >
                    {t("caseStudies.readFullCase")}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                </div>
            </div>

            <div className="md:w-1/2">
                <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`relative p-1 bg-gradient-to-r ${study.color} rounded-xl shadow-md overflow-hidden`}
                >
                <div className="bg-background rounded-lg overflow-hidden">
                    <Image
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    width={600}
                    priority={true}
                    height={400}
                    className="w-full h-64 object-cover"
                    />
                </div>
                </motion.div>
            </div>
            </div>
        </div>

        {/* Corner accent */}
        <div
            className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${study.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
        ></div>
        </motion.div>
    )
}