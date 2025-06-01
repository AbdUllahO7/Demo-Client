"use client"

import { useState } from "react"
import { motion } from "@/components/ui/framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { ContactHeader } from "./ContactHeader"
import { translationsDataContact } from "../../ConstData/ConstData"
import { ContactInfo } from "./ContactInfo"
import { ContactForm } from "./ContactForm"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function ContactSection({ websiteId, sectionId }: { websiteId: string; sectionId: string }) {
  const { ref, isInView } = useScrollAnimation()
  const { direction, language } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    content,
    isLoading: sectionLoading,
    error: sectionError,
  } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "blogs",
  })

  // Fetch all subsections once with generic field mappings
  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
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
    <section id="contact" className="w-full py-12 bg-wtheme-background" dir={direction}>
      <div className="container px-4 md:px-6">
        <ContactHeader ref={ref} isInView={isInView} content={content} />

        <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: isRTL ? 30 : -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <ContactInfo content={InfoItemsSection[0]} isRTL={isRTL} />
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: isRTL ? -30 : 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="rounded-xl border border-wtheme-border/50 bg-wtheme-background p-6 shadow-sm"
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}