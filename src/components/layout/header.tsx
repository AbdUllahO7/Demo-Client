"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "../theme-toggle"
import { useSubSections } from "@/lib/subSections/use-subSections"

// Define interfaces for type safety
interface SubNavItem {
  id: string
  label: string
  href: string
  source: "navigation" | "section"
  isDynamicUrl?: boolean
  isInternal?: boolean
  sectionId?: string
}

interface NavItem {
  id: string
  href: string
  label: string
  order: number
  subNavItems: SubNavItem[]
  sectionName?: string
}

interface HeaderProps {
  sectionId: string
  websiteId?: string
  logo?: string
  subName?: string
  sectionsData?: any[]
}

export default function Header({
  sectionId,
  websiteId,
  logo = "/assets/iDIGITEK.webp",
  subName,
  sectionsData,
}: HeaderProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const router = useRouter()
  const pathname = usePathname()

  // Check if current language is RTL
  const isRTL = direction === 'rtl' || language === 'ar'

  // Get websiteId from props or localStorage
  const actualWebsiteId = websiteId || (typeof window !== "undefined" ? localStorage.getItem("websiteId") : null)

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { useGetNavigationByWebSiteId, useGetCompleteByWebSiteId } = useSubSections()
  const { data: sections } = useGetNavigationByWebSiteId(actualWebsiteId)
  const { data: allSections } = useGetCompleteByWebSiteId(actualWebsiteId)

  // Helper function to get translated content
  const getTranslatedContent = (element: any, language: string) => {
    const translation = element?.translations?.find((t: any) => t.language.languageID === language)
    const content = translation?.content || element?.defaultContent || ""
    
    if (typeof content === "object" && content !== null) {
      return content[language] || content["en"] || Object.values(content)[0] || ""
    }
    
    return content || ""
  }

  // Helper function to get multilingual section name
  const getMultilingualSectionName = (section: any, language: string) => {
    if (typeof section?.name === "object" && section?.name !== null) {
      return section?.name[language] || section?.name["en"] || Object.values(section?.name)[0] || ""
    }
    return section?.name || ""
  }

  // Helper function to check if navigation is visible
  const isNavigationVisible = (navigationData: any) => {
    if (!navigationData) return true

    const allElements = [...(navigationData.elements || []), ...(navigationData.contentElements || [])]
    
    const visibilityElement = allElements.find(
      (el: any) => el.name === "Navigation Visibility" && el.type === "boolean"
    )

    return visibilityElement ? visibilityElement.defaultContent === "true" || visibilityElement.defaultContent === true : true
  }

  // Helper function to check if a section has addSubNavigation enabled
  const hasAddSubNavigation = (section: any) => {
    const allElements = [...(section.elements || []), ...(section.contentElements || [])]
    const addSubNavElement = allElements.find(
      (el: any) => el.name === "Add SubNavigation" && el.type === "boolean"
    )
    return addSubNavElement?.defaultContent === "true" || addSubNavElement?.defaultContent === true
  }

  // Helper function to get section title
  const getSectionTitle = (section: any, language: string) => {
    const allElements = [...(section.elements || []), ...(section.contentElements || [])]
    const titleElement = allElements.find((el: any) => el.name === "Title" && el.type === "text")
    const title = titleElement ? getTranslatedContent(titleElement, language) : ""
    
    if (typeof title === "object" && title !== null) {
      return title[language] || title["en"] || Object.values(title)[0] || ""
    }
    
    return title || ""
  }

  // Helper function to get dynamic URL from section
  const getDynamicUrl = (section: any) => {
    const allElements = [...(section.elements || []), ...(section.contentElements || [])]
    const dynamicUrlElement = allElements.find((el: any) => el.name === "Dynamic URL" && el.type === "text")
    return dynamicUrlElement?.defaultContent || null
  }

  // Helper function to generate fallback URL from section
  const generateFallbackSectionUrl = (section: any) => {
    const sectionName = getMultilingualSectionName(section, language)
    return section.slug ? `#${section.slug}` : `#${sectionName.toLowerCase().replace(/\s+/g, "-")}`
  }

  // Helper function to determine if a link is internal
  const isInternalLink = (href: string) => {
    return href.startsWith("#") || href === "#"
  }

  // Helper function to extract sectionId from href
  const extractSectionId = (href: string) => {
    if (href.startsWith("#")) {
      return href.substring(1)
    }
    return null
  }

  // Function to find sections with addSubNavigation enabled
  const getAdditionalSubNavItems = (parentSectionName: string, language: string): SubNavItem[] => {
    if (!allSections?.data) return []

    const filteredSections = allSections.data.filter((section: any) => {
      const hasSubNav = hasAddSubNavigation(section)
      if (!hasSubNav) return false
      
      const parentName = getMultilingualSectionName(section.sectionItem?.section, language)
      return parentName === parentSectionName
    })

    return filteredSections
      .map((section: any) => {
        const dynamicUrl = getDynamicUrl(section)
        const fallbackUrl = generateFallbackSectionUrl(section)
        const finalUrl = dynamicUrl || fallbackUrl
        const title = getSectionTitle(section, language)
        const isInternal = isInternalLink(finalUrl)

        return {
          id: section._id,
          label: title,
          href: finalUrl,
          source: "section" as const,
          isDynamicUrl: !!dynamicUrl,
          isInternal: isInternal,
          sectionId: isInternal ? extractSectionId(finalUrl) : undefined,
        }
      })
      .filter((item: SubNavItem) => item.label)
  }

  // Process navigation items with visibility check
  const navItems: NavItem[] = sectionsData
    ?.filter((section: any) => {
      if (section.subName === "Header" || section.subName === "Footer") {
        return false
      }

      const navigationData = sections?.data?.find(
        (navSection: any) => navSection.section?.name === section.name || navSection.section?.subName === section.subName
      )

      return navigationData ? isNavigationVisible(navigationData) : true
    })
    ?.map((section: any) => {
      const navigationData = sections?.data?.find(
        (navSection: any) => navSection.section?.name === section.name || navSection.section?.subName === section.subName
      )

      let navLabel = getMultilingualSectionName(section, language)
      let navHref = `#${section.subName || navLabel.toLowerCase().replace(/\s+/g, "-")}`

      if (navigationData) {
        const nameElement = navigationData.elements?.find((el: any) => el.name === "name")
        const urlElement = navigationData.elements?.find((el: any) => el.name === "url")
        
        if (nameElement) {
          const customLabel = getTranslatedContent(nameElement, language)
          if (customLabel) navLabel = customLabel
        }
        
        if (urlElement) {
          const customUrl = getTranslatedContent(urlElement, language)
          if (customUrl && customUrl !== "#") navHref = customUrl
        }
      }

      const existingSubNavItems = navigationData?.elements
        ?.filter((el: any) => el.metadata?.isSubNavigation && el.metadata?.fieldType === "title")
        ?.map((titleEl: any) => {
          const urlEl = navigationData.elements.find(
            (el: any) =>
              el.metadata?.isSubNavigation &&
              el.metadata?.subNavId === titleEl.metadata?.subNavId &&
              el.metadata?.fieldType === "url"
          )
          
          const subNavLabel = getTranslatedContent(titleEl, language)
          const subNavHref = getTranslatedContent(urlEl, language) || "#"
          const isInternal = isInternalLink(subNavHref)
          
          return {
            id: titleEl._id,
            label: subNavLabel,
            href: subNavHref,
            source: "navigation" as const,
            isDynamicUrl: false,
            isInternal: isInternal,
            sectionId: isInternal ? extractSectionId(subNavHref) : undefined,
          }
        })
        ?.filter((item: any) => item.label) || []

      const additionalSubNavItems = getAdditionalSubNavItems(getMultilingualSectionName(section, language), language)
      const allSubNavItems = [...existingSubNavItems, ...additionalSubNavItems]

      return {
        id: section._id,
        href: navHref,
        label: navLabel,
        order: section.order || 0,
        subNavItems: allSubNavItems,
        sectionName: getMultilingualSectionName(section, language),
      }
    })
    ?.filter((item: NavItem | null) => item !== null && item.label)
    ?.sort((a, b) => a.order - b.order) || []

  // Hover handlers
  const handleMouseEnter = (navId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setHoveredNavId(navId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNavId(null)
    }, 150)
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNavId(null)
    }, 150)
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mobile menu body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle initial scroll to section
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash || (subName ? `#${subName}` : "")
      if (hash) {
        const sectionId = hash.substring(1)
        setTimeout(() => {
          scrollToSection(sectionId)
        }, 500)
      }
    }
  }, [pathname, scrollToSection, subName])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Find section ID by section name
  const findSectionIdBySectionName = (sectionName: string): string | null => {
    if (sectionsData && sectionsData.length > 0) {
      const matchingSection = sectionsData.find(
        (section: any) => {
          const sectionNameStr = getMultilingualSectionName(section, language)
          return sectionNameStr === sectionName || section.subName === sectionName
        }
      )
      if (matchingSection) return matchingSection._id
    }

    if (sections?.data) {
      const matchingNavSection = sections.data.find(
        (section: any) => {
          const sectionNameStr = getMultilingualSectionName(section.section, language)
          return sectionNameStr === sectionName || section.section?.subName === sectionName
        }
      )
      if (matchingNavSection) return matchingNavSection.section?._id
    }

    return null
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isDynamicUrl?: boolean,
    navItem?: NavItem
  ) => {
    e.preventDefault()

    if (href.startsWith("#") || href === "#") {
      const sectionIdentifier = href === "#" && navItem?.sectionName 
        ? navItem.sectionName 
        : href.substring(1)

      const sectionId = findSectionIdBySectionName(sectionIdentifier)

      if (sectionId) {
        if (pathname === "/") {
          scrollToSection(sectionId)
        } else {
          router.push(`/#${sectionIdentifier.toLowerCase()}`)
        }
      } else {
        if (pathname === "/") {
          scrollToSection(sectionIdentifier)
        } else {
          router.push(`/#${sectionIdentifier.toLowerCase()}`)
        }
      }
      setIsOpen(false)
      return
    }

    if (isDynamicUrl) {
      window.open(href, "_self")
    } else {
      router.push(href)
    }
    
    setIsOpen(false)
  }

  // Enhanced subnav link handler like footer
  const handleSubNavClick = (subItem: SubNavItem) => {
    if (subItem.isInternal && subItem.sectionId) {
      // Use scrollToSection for internal links
      scrollToSection(subItem.sectionId)
      setIsOpen(false)
    }
    // For external links, let the Link component handle it normally
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-wtheme-border transition-all duration-300 ${
        isOpen
          ? "bg-primary shadow-xl"
          : scrolled
            ? "bg-wtheme-background/95 backdrop-blur-md shadow-lg"
            : "bg-wtheme-background/80 backdrop-blur-sm"
      }`}
      dir={direction}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex h-16 items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src={logo || "/placeholder.svg"}
                alt="Logo"
                priority={true}
                width={120}
                height={40}
                className={`h-8 w-auto transition-all duration-300 ${isOpen ? "brightness-0 invert" : ""}`}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, false, item)}
                  className={`flex items-center gap-1 px-1 py-1 text-wtheme-text font-bold hover:text-wtheme-hover transition-colors duration-200 ${
                    isRTL ? '' : ''
                  }`}
                >
                  <span className={isRTL ? 'font-arabic' : ''}>{item.label}</span>
                  {item.subNavItems.length > 0 && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        hoveredNavId === item.id ? "rotate-180" : ""
                      } ${isRTL ? 'ml-1' : 'mr-1'}`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                {item.subNavItems.length > 0 && (
                  <AnimatePresence>
                    {hoveredNavId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute mt-2 w-72 bg-wtheme-background shadow-xl rounded-lg border border-wtheme-border overflow-hidden ${
                          isRTL ? 'right-0' : 'left-0'
                        }`}
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <div className="py-2">
                          {item.subNavItems.map((subItem, index) => (
                            <motion.div
                              key={subItem.id}
                              initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              {subItem.isInternal ? (
                                <button
                                  onClick={() => handleSubNavClick(subItem)}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-wtheme-text hover:bg-wtheme-hover/10 transition-colors duration-200 ${
                                    subItem.source === "section" ? `${isRTL ? 'border-r-2 border-accent mr-2' : 'border-l-2 border-accent ml-2'}` : ""
                                  } ${isRTL ? 'text-right' : 'text-left'}`}
                                >
                                  <span className={`flex-1 ${isRTL ? 'font-arabic text-right' : ''}`}>{subItem.label}</span>
                                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    {subItem.source === "section" && <div className="w-2 h-2 rounded-full bg-accent" />}
                                  </div>
                                </button>
                              ) : (
                                <Link
                                  href={subItem.href}
                                  target={subItem.isDynamicUrl ? "_self" : "_self"}
                                  className={`flex items-center justify-between px-4 py-3 text-sm text-wtheme-text hover:bg-wtheme-hover/10 transition-colors duration-200 ${
                                    subItem.source === "section" ? `${isRTL ? 'border-r-2 border-accent mr-2' : 'border-l-2 border-accent ml-2'}` : ""
                                  } ${isRTL ? 'text-right' : 'text-left'}`}
                                >
                                  <span className={`flex-1 ${isRTL ? 'font-arabic text-right' : ''}`}>{subItem.label}</span>
                                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    {subItem.source === "section" && <div className="w-2 h-2 rounded-full bg-accent" />}
                                  </div>
                                </Link>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Desktop Controls */}
          <div className={`hidden lg:flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-200 ${
                isOpen
                  ? "text-white hover:text-accent hover:bg-white/10"
                  : "text-wtheme-text hover:text-wtheme-hover hover:bg-wtheme-hover/10"
              }`}
            >
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navItems={navItems}
        handleNavClick={handleNavClick}
        handleSubNavClick={handleSubNavClick}
        direction={direction}
        isRTL={isRTL}
      />
    </motion.header>
  )
}

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  navItems: NavItem[]
  handleNavClick: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isDynamicUrl?: boolean,
    navItem?: NavItem
  ) => void
  handleSubNavClick: (subItem: SubNavItem) => void
  direction: string
  isRTL: boolean
}

function MobileNav({ isOpen, setIsOpen, navItems, handleNavClick, handleSubNavClick, direction, isRTL }: MobileNavProps) {
  const [openSubNav, setOpenSubNav] = useState<string | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-primary overflow-y-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          dir={direction}
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div
                    className={`flex items-center justify-between py-3 text-lg font-medium text-white hover:text-accent transition-colors duration-200 cursor-pointer ${
                      isRTL ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                    onClick={(e) => {
                      if (item.subNavItems.length > 0) {
                        setOpenSubNav(openSubNav === item.id ? null : item.id)
                      } else {
                        handleNavClick(e as any, item.href, false, item)
                      }
                    }}
                  >
                    <span className={isRTL ? 'font-arabic' : ''}>{item.label}</span>
                    {item.subNavItems.length > 0 && (
                      <motion.div 
                        animate={{ rotate: openSubNav === item.id ? 180 : 0 }} 
                        transition={{ duration: 0.2 }}
                        className={isRTL ? 'ml-2' : 'mr-2'}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </motion.div>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  <AnimatePresence>
                    {item.subNavItems.length > 0 && openSubNav === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`space-y-2 ${
                          isRTL 
                            ? 'mr-4 border-r-2 border-accent/30 pr-4' 
                            : 'ml-4 border-l-2 border-accent/30 pl-4'
                        }`}
                      >
                        {item.subNavItems.map((subItem, subIndex) => (
                          <motion.div
                            key={subItem.id}
                            initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                          >
                            {subItem.isInternal ? (
                              <button
                                onClick={() => handleSubNavClick(subItem)}
                                className={`w-full flex items-center justify-between py-2 text-white/80 hover:text-accent transition-colors duration-200 ${
                                  isRTL ? 'flex-row-reverse text-right' : 'text-left'
                                }`}
                              >
                                <span className={`text-base ${isRTL ? 'font-arabic' : ''}`}>{subItem.label}</span>
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  {subItem.source === "section" && <div className="w-2 h-2 rounded-full bg-accent" />}
                                </div>
                              </button>
                            ) : (
                              <Link
                                href={subItem.href}
                                target={subItem.isDynamicUrl ? "_self" : "_self"}
                                className={`flex items-center justify-between py-2 text-white/80 hover:text-accent transition-colors duration-200 ${
                                  isRTL ? 'flex-row-reverse text-right' : 'text-left'
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                <span className={`text-base ${isRTL ? 'font-arabic' : ''}`}>{subItem.label}</span>
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  {subItem.source === "section" && <div className="w-2 h-2 rounded-full bg-accent" />}
                                </div>
                              </Link>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Mobile Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 + 0.2 }}
                className={`flex items-center gap-4 pt-6 border-t border-white/20 ${
                  isRTL ? 'flex-row-reverse justify-end' : 'justify-start'
                }`}
              >
                <ThemeToggle />
                <LanguageToggle />
              </motion.div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}