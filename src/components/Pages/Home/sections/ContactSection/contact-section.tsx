"use client"

import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { ContactHeader } from "./ContactHeader"
import { ContactInfo } from "./ContactInfo"
import { ContactForm } from "./ContactForm"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { FadeIn } from "@/utils/OptimizedAnimations"

export default function ContactSection({ websiteId, sectionId }: { websiteId: string; sectionId: string }) {
  const { ref, isInView } = useScrollAnimation()
  const { direction } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    content,
  } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "blogs",
  })

  // Fetch all subsections once with generic field mappings
  const { contentItems } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      title: "Title",
      fullName: "Fullname",
      fullNamePlaceHolder: "FullnamePlaceHolder",
      email: "Email",
      emailPlaceHolder: "EmailPlaceHolder",
      message: "Message",
      messagePlaceHolder: "MessagePlaceHolder",
      subjects: "Subjects",
      subjectTitle : "SubjectTitle",
      buttonText: "ButtonText",
      description: "Description",
      location: "Location",
      emailValue: "EmailValue",
      phone: "PhoneText",
      phoneValue: "PhoneTextValue",
      officeText: "Office",
      officeValue: "OfficeValue",
      color: () => "theme-gradient",
    },
  })

  // Split contentItems into SendMessageSection and InfoItemsSection
  const SendMessageSection = contentItems.filter(item => !!item.subjects) // Items with 'subjects' are for the form
  const InfoItemsSection = contentItems.filter(item => !!item.phoneValue) // Items with 'phoneValue' are for contact info
  const isRTL = direction === "rtl"

  return (
    <section id="ContactSection" className="w-full py-12 bg-wtheme-background" dir={direction}>
      <div className="container px-4 md:px-6">
        <ContactHeader ref={ref} isInView={isInView} content={content} />

        <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-2">
          {/* Contact Information */}
          <FadeIn
          
            className="space-y-8"
          >
            <ContactInfo content={InfoItemsSection[0]} isRTL={isRTL} />
          </FadeIn>

          {/* Contact Form */}
          <FadeIn
       
            className="rounded-xl border border-wtheme-border bg-wtheme-background p-6 shadow-sm"
          >
            <ContactForm
              content={SendMessageSection[0]}
              isRTL={isRTL}
              direction={direction}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              handleSubmit={() => {
              }}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}