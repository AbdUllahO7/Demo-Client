import React, { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { Project } from "./Projects"
import { FadeIn } from "@/utils/lightweightAnimations"

interface ProjectCardProps {
  project: Project
  index: number
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: true, amount: 0.1 })

  return (
    <FadeIn
     
      className="group relative overflow-hidden rounded-xl bg-background border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${project.color}`}></div>

      <div className="relative overflow-hidden aspect-video">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          priority={true}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 z-10">
          <span 
            className={`px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${project.color}`}
          >
            {project.category}
          </span>
        </div>
      </div>

      <div className="flex-grow p-5">
        <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-wtheme-hover transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{project.description}</p>

        <Link
          href={`/Pages/ProjectsPage/${project.id}`}
          className="inline-flex items-center text-sm text-primary font-medium hover:underline"
        >
          View Case Study
          <ChevronRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </FadeIn>
  )
}