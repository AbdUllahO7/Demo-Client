"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { BarChart, Clock, Shield, Zap } from "lucide-react"
import FeatureHighlight from "./FeatureHighlight"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"

interface FeatureImageProps {
    isInView: boolean
    image: string;
    }

export default function FeatureImage({ isInView, image }: FeatureImageProps) {

    
  if(!image) {
      return <SectionSkeleton variant="grid" className="py-20" />
    }

    return (
        <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative mx-auto lg:ml-auto"
        >
        <div className="absolute inset-0 bg-theme-gradient from-primary/20 to-secondary/20 rounded-1xl blur-xl transform rotate-3 scale-100"></div>

        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative bg-gradient-to-r p-1 from-primary to-secondary rounded-2xl shadow-xl"
        >
            <div className="bg-background rounded-xl overflow-hidden">
            <Image
                src={image}
                width={600}
                height={600}
                priority={true}
                alt="Product Features"
                className="w-full h-auto"
            />
            </div>

          
        </motion.div>
        </motion.div>
    )
}