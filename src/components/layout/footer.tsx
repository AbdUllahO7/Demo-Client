"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useSectionContent } from "@/hooks/useSectionContent"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { FadeIn } from "@/utils/lightweightAnimations"
import { OptimizedFadeIn } from "@/utils/OptimizedAnimations"
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver"

// Types
interface ContentItem {
  id: string
  description: string
  [key: string]: string
}

interface SpecialItem {
  id: string
  description: string
  [key: string]: string
}

interface FooterProps {
  sectionId: string
  logo?: string
  subName?: string
  websiteId: string
}

interface SocialLink {
  socialLink: string
  image?: string
  label: string
}

interface FooterColumnProps {
  title: string
  links: { 
    label: string; 
    href: string; 
    image?: string;
    isInternal?: boolean;
    sectionId?: string;
  }[]
}

/**
 * Generates field mappings for content items or special items
 * @param isSpecial Whether to generate special mappings
 * @returns Record of field mappings
 */
const generateFieldMappings = (isSpecial: boolean): Record<string, string> => {
  const mappings: Record<string, string> = {
    id: "_id",
    description: isSpecial ? "Section Title" : "Footer 1 - Description",
  }

  if (isSpecial) {
    for (let x = 1; x <= 8; x++) {
      mappings[`socialLink${x}}`] = `Special Footer ${x} - Title`
      for (let y = 1; y <= 8; y++) {
        mappings[`socialLink${x}_${y}`] = `Special Footer ${x} - SocialLink ${y} - Url`
        mappings[`sectionId${x}_${y}`] = `Special Footer ${x} - SocialLink ${y} - SectionId`
        mappings[`image${x}_${y}`] = `Special Footer ${x} - SocialLink ${y} - Image`
        mappings[`LinkName${x}_${y}`] = `Special Footer ${x} - SocialLink ${y} - LinkName`
      }
    }
  } else {
    for (let i = 1; i <= 8; i++) {
      mappings[`socialLink${i}`] = `Footer 1 - SocialLink ${i} - Url`
      mappings[`image${i}`] = `Footer 1 - SocialLink ${i} - Image`
    }
  }

  return mappings
}

/**
 * Main Footer component
 */
export default function Footer({ sectionId, logo = "/assets/iDIGITEK.webp", subName, websiteId }: FooterProps) {
const { ref } = useOptimizedIntersection({
  threshold: 0.2,
  triggerOnce: true,
  rootMargin: '100px'
})
  const scrollToSection = useScrollToSection()

  // Field mappings
  const fieldMappings = useMemo(() => generateFieldMappings(false), [])
  const SpecialFieldMappings = useMemo(() => generateFieldMappings(true), [])

  // Filters
  const featureFilter = (item: ContentItem) =>
    [1, 2, 3, 4].some((i) => item[`socialLink${i}`]?.trim())

  const SpecialFeatureFilter = (item: SpecialItem) =>
    [1, 2, 3, 4, 5, 6, 7, 8].some((x) => 
      [1, 2, 3, 4, 5, 6, 7, 8].some((y) => 
        item[`socialLink${x}_${y}`]?.trim() || item[`sectionId${x}_${y}`]?.trim()
      )
    )

  // Fetch content
  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings,
    filter: featureFilter,
  })

  const { contentItems: Special, isLoading: SpecialLoading, error: SpecialError } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: SpecialFieldMappings,
    filter: SpecialFeatureFilter,
  })

  const dynamicFallbackSocialMedia = useMemo(
    () =>
      contentItems.flatMap((item) =>
        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
          socialLink: item[`socialLink${i}`] || "",
          image: item[`image${i}`],
          label: `Social ${i}`,
        }))
      ).filter(social => social.socialLink),
    [contentItems]
  )

  // Enhanced dynamic columns generation with section support
  const dynamicColumns = useMemo(() => {
    if (!Special[0]) return []
    
    const columns = []
    for (let x = 1; x <= 8; x++) {
      const title = Special[0][`socialLink${x}}`]
      if (title) {
        const links = [1, 2, 3, 4, 5, 6, 7, 8]
          .map((y) => {
            const linkName = Special[0][`LinkName${x}_${y}`]
            const url = Special[0][`socialLink${x}_${y}`]
            const sectionId = Special[0][`sectionId${x}_${y}`]
            const image = Special[0][`image${x}_${y}`]

            if (!linkName) return null

            // Determine if this is an internal link (has sectionId) or external link (has URL)
            const isInternal = Boolean(sectionId && sectionId.trim())
            const href = isInternal 
              ? `#${sectionId}`
              : url?.startsWith("http") 
                ? url 
                : url ? `https://${url}` : "#"

            return {
              label: linkName,
              href: href,
              image: image || "",
              isInternal: isInternal,
              sectionId: sectionId || undefined
            }
          })
          .filter((link) => link !== null && link.label && link.href !== "#")
        
        if (links.length > 0) {
          columns.push({ title, links })
        }
      }
    }
    return columns
  }, [Special])

  return (
    <div
      className="w-full opacity-1 border-t border-wtheme-border/50 bg-wtheme-background py-12 md:py-16"
    >
      <div className="container px-4 md:px-6">
        <div className={`grid gap-8 ${dynamicColumns.length > 0 ? `md:grid-cols-2 lg:grid-cols-${Math.min(dynamicColumns.length + 1, 4)}` : 'md:grid-cols-1'}`}>
          <FadeIn
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Image src={logo} alt="Idigitek Solutions Logo" priority={true} width={100} height={100} className="rounded" />
            </div>
            <p className="text-sm font-body text-wtheme-text">{contentItems[0]?.description || "No description available"}</p>
            <div className="flex space-x-4">
              {SpecialLoading || itemsLoading ? (
                <span className="text-sm font-body text-wtheme-text">Loading...</span>
              ) : SpecialError || itemsError ? (
                <span className="text-sm font-body text-destructive"></span>
              ) : dynamicFallbackSocialMedia.length > 0 ? (
                dynamicFallbackSocialMedia.map((social, index) => (
                  <FadeIn
                    key={`${social.label}-${index}`}
                  >
                    <Link 
                      href={social.socialLink} 
                      className="text-wtheme-text hover:text-wtheme-hover"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.image ? 
                        <Image 
                          src={social.image} 
                          alt={social.label} 
                          width={20} 
                          priority={true}
                          height={20} 
                          className="w-5 h-5 object-contain m-1 "
                        /> : null
                      }                      
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  </FadeIn>
                ))
              ) : (
                <span className="text-sm font-body text-wtheme-text"></span>
              )}
            </div>
          </FadeIn>

          {/* Dynamic columns rendering with enhanced props */}
          {dynamicColumns.map((column, index) => (
            <FooterColumn 
              key={`${column.title}-${index}`} 
              title={column.title} 
              links={column.links}
              scrollToSection={scrollToSection}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Enhanced Footer column component with section scrolling support
 */
function FooterColumn({ title, links, scrollToSection }: FooterColumnProps & { scrollToSection: (sectionId: string) => void }) {
  const handleLinkClick = (link: FooterColumnProps['links'][0], e: React.MouseEvent) => {
    if (link.isInternal && link.sectionId) {
      // Prevent default link behavior for internal links
      e.preventDefault()
      scrollToSection(link.sectionId)
    }
  }

  return (
    <FadeIn
      className="space-y-4"
    >
      <h3 className="text-lg font-heading text-primary">{title}</h3>
      <ul className="space-y-2">
        {links.length > 0 ? (
          links.map((link) => (
            <li
              key={link.label}
            >
              {link.isInternal ? (
                <button
                  onClick={(e) => handleLinkClick(link, e)}
                  className="font-body text-wtheme-text hover:text-wtheme-hover flex items-center gap-2 text-left"
                >
                  {link.image && (
                    <Image 
                      src={link.image} 
                      alt={link.label} 
                      width={16} 
                      height={16}
                      priority={true} 
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  {link.label}
                </button>
              ) : (
                <Link 
                  href={link.href} 
                  className="font-body text-wtheme-text hover:text-wtheme-hover flex items-center gap-2"
                  target="_self"
                  rel="noopener noreferrer"
                >
                  {link.image && (
                    <Image 
                      src={link.image} 
                      alt={link.label} 
                      width={16} 
                      height={16}
                      priority={true} 
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  {link.label}
                </Link>
              )}
            </li>
          ))
        ) : (
          <li className="text-sm font-body text-wtheme-text"></li>
        )}
      </ul>
    </FadeIn>
  )
}