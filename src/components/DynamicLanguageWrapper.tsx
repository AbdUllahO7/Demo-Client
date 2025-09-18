"use client"
import { LanguageProvider } from "@/contexts/language-context"
import { useLanguages } from "@/lib/languages/use-language"
import { useWebSite } from "@/lib/webSite/use-WebSite"
import { useEffect, useState, type ReactNode } from "react"

interface DynamicLanguageWrapperProps {
  children: ReactNode
}

export function DynamicLanguageWrapper({ children }: DynamicLanguageWrapperProps) {
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(["en", "ar"])
  const [rtlLanguages, setRtlLanguages] = useState<string[]>(["ar"])
  const [isLanguagesLoaded, setIsLanguagesLoaded] = useState(false)
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  
  // Get website data first
  const { useGetWebsitesByUserId } = useWebSite()
  const { data: websites, isLoading: websitesLoading } = useGetWebsitesByUserId()
  
  // Get languages for the website
  const { useGetByWebsite: useGetWebsiteLanguages } = useLanguages()
  const { data: languages, isLoading: languagesLoading } = useGetWebsiteLanguages(
    websiteId || "", 
    { isActive: true }
  )

  // Set websiteId when websites are loaded
  useEffect(() => {
    if (websites && websites.length > 0 && !websitesLoading) {
      const id = websites[0].id
      setWebsiteId(id)
      // Set in localStorage for other components
      localStorage.setItem("websiteId", id)
      console.log('Website ID set:', id) // Debug log
    }
  }, [websites, websitesLoading])

  // Process languages when they're loaded
  useEffect(() => {
    if (languages?.data && !languagesLoading && websiteId) {
      const activeLanguages = languages.data
        .filter((lang: any) => lang.isActive)
        .map((lang: any) => lang.languageID)
      
      // Common RTL languages - you can extend this or add RTL info to your API
      const commonRTLLanguages = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ku', 'dv']
      const rtl = activeLanguages.filter((langId: string) => 
        commonRTLLanguages.includes(langId.toLowerCase())
      )
      
      console.log('Available languages from API:', activeLanguages) // Debug log
      console.log('RTL languages detected:', rtl) // Debug log
      console.log('Full language data:', languages.data) // Debug log
      
      if (activeLanguages.length > 0) {
        setAvailableLanguages(activeLanguages)
        setRtlLanguages(rtl.length > 0 ? rtl : ["ar"])
      }
      setIsLanguagesLoaded(true)
    } else if (!languagesLoading && websiteId && (!languages?.data || languages?.data.length === 0)) {
      // Fallback if no languages found
      console.log('No languages found, using fallback') // Debug log
      setAvailableLanguages(["en", "ar"])
      setRtlLanguages(["ar"])
      setIsLanguagesLoaded(true)
    }
  }, [languages, languagesLoading, websiteId])

  // Show loading until everything is ready
  if (websitesLoading || !websiteId || !isLanguagesLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading languages...</div>
  }

  return (
    <LanguageProvider 
      initialLanguage="en"
      availableLanguages={availableLanguages}
      rtlLanguages={rtlLanguages}
    >
      {children}
    </LanguageProvider>
  )
}