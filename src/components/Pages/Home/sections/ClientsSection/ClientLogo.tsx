"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ClientLogoType } from "./types"

interface ClientLogoProps {
  client: ClientLogoType
  index: number
  isInView: boolean
}

export function ClientLogo({ client, index, isInView }: ClientLogoProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, delay: index * 0.05 }
        },
      }}
      className="group flex flex-col items-center justify-center"
    >
      <motion.div
        whileHover={{ 
          scale: 1.05,
          rotate: [-1, 1, 0],
          transition: { duration: 0.3 }
        }}
        className="relative p-4 rounded-xl bg-background shadow-sm border border-border/50 transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20"
      >
        <Image
          src={client.logo || "/placeholder.svg"}
          alt={client.name}
          width={150}
          priority={true}
          height={60}
          className="h-12 w-auto object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-background rounded-full text-xs font-medium border border-border shadow-sm"
        >
          {client.name}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
