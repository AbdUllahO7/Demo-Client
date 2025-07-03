"use client"

import { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { ProjectNotFound } from "@/components/Pages/ProjectsDetailPage/data/ProjectNotFound"
import { ProjectHero } from "@/components/Pages/ProjectsDetailPage/ProjectHero"
import { ProjectImage } from "@/components/Pages/ProjectsDetailPage/ProjectImage"
import { useSubSections } from "@/lib/subSections/use-subSections"
import { ProjectInfo } from "@/components/Pages/ProjectsDetailPage/ProjectInfo"
import { ProjectFiles } from "@/components/Pages/ProjectsDetailPage/ProjectFiles"
import { ProjectGallery } from "@/components/Pages/ProjectsDetailPage/ProjectGallery"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const projectId = resolvedParams.id

  const { direction, language } = useLanguage()
  const { useGetBySectionItemIds, useGetCompleteById } = useSubSections()

  const { data: projectData, error: projectError } = useGetCompleteById(projectId)
  const { data: sectionData, error: sectionError } = useGetBySectionItemIds([projectData?.data?.sectionItem?._id])

  // Handle errors or loading states
  if (projectError || sectionError) {
    console.error("Errors:", projectError, sectionError)
    return <ProjectNotFound />
  }
  if (!projectData || !sectionData) {
    return <SectionSkeleton variant="default" className="py-20"/>
  }

  console.log("ProjectDetailPage rendered with projectData:", sectionData)

  // Find the main project section (contains Background Image, Title, Description, etc.)
  const projectSection = sectionData?.data.find((section: any) =>
    section.elements.some((element: any) => element.name === "Background Image")
  )

  // Find the clients/info section (contains Technologies, Client, Industry, Year)
  const clientsSection = sectionData?.data.find((section: any) =>
    section.elements.some((element: any) => element.name === "Technologies")
  )

  // Find the gallery section (contains multiple images)
  const gallerySection = sectionData?.data.find((section: any) =>
    section.name === "Multi Image Section" || 
    section.elements.some((element: any) => element.type === "image" && element.name.startsWith("Image"))
  )

  // Find the files section
  const filesSection = sectionData?.data.find((section: any) =>
    section.elements.some((element: any) => element.type === "file")
  )

  console.log("projectSection", projectSection)
  console.log("clientsSection", clientsSection)
  console.log("gallerySection", gallerySection)

  return (
    <div className="min-h-screen bg-wtheme-background" dir={direction}>
      <ProjectHero project={projectSection} clients={clientsSection || { elements: [] }} />
      <ProjectImage project={projectSection} />
      <ProjectInfo project={projectSection} clients={clientsSection || { elements: [] }} />
      <ProjectFiles project={filesSection}  />
      <ProjectGallery project={projectSection} clients={gallerySection || { elements: [] }} />
    </div>
  )
}