"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"

type Direction = "ltr" | "rtl"

interface TranslationItem {
  [key: string]: string | TranslationItem;
}

interface Translations {
  [language: string]: TranslationItem;
}

interface LanguageContextType {
  language: string
  direction: Direction
  setLanguage: (lang: string) => void
  t: (key: string) => string
  isLoaded: boolean
  updateAvailableLanguages: (languages: string[], rtlLangs?: string[]) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  initialLanguage?: string
}

const enTranslations = {
  news: {
    sectionLabel: "News",
    sectionTitle: "Latest Updates",
    sectionDescription: "Stay informed with our latest company news and updates",
    loading: "Loading...",
    noNews: "No news available",
    retry: "Retry",
    previous: "Previous",
    next: "Next"
  }
}

const arTranslations = {
  news: {
    sectionLabel: "الأخبار",
    sectionTitle: "آخر التحديثات",
    sectionDescription: "ابق على اطلاع بآخر أخبار وتحديثات الشركة",
    loading: "جاري التحميل...",
    noNews: "لا توجد أخبار متاحة",
    retry: "إعادة المحاولة",
    previous: "السابق",
    next: "التالي"
  }
}

// Helper function to safely access localStorage
const getStoredLanguage = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem("language")
    return stored || null
  } catch {
    return null
  }
}

const setStoredLanguage = (language: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem("language", language)
  } catch {
    // Handle localStorage errors silently
  }
}

// Default RTL languages
const DEFAULT_RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ku', 'dv']

export function LanguageProvider({ 
  children, 
  initialLanguage = "en"
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<string>(initialLanguage)
  const [direction, setDirection] = useState<Direction>("ltr")
  const [isLoaded, setIsLoaded] = useState(false)
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(["en", "ar"])
  const [rtlLanguages, setRtlLanguages] = useState<string[]>(DEFAULT_RTL_LANGUAGES)
  
  // Use refs to track if we've already initialized
  const hasInitialized = useRef(false)
  const previousLanguage = useRef<string>(initialLanguage)
  
  const [translations] = useState<Translations>({
    en: enTranslations,
    ar: arTranslations
  })

  // Function to update available languages from external components
  const updateAvailableLanguages = useCallback((languages: string[], rtlLangs?: string[]) => {
    console.log('Updating available languages:', languages) // Debug log
    setAvailableLanguages(prev => {
      // Only update if different to prevent unnecessary re-renders
      if (JSON.stringify(prev) !== JSON.stringify(languages)) {
        return languages
      }
      return prev
    })
    if (rtlLangs) {
      setRtlLanguages(prev => {
        // Only update if different to prevent unnecessary re-renders
        if (JSON.stringify(prev) !== JSON.stringify(rtlLangs)) {
          return rtlLangs
        }
        return prev
      })
    }
  }, []) // Empty dependency array since this function doesn't depend on any state

  // Initialize from localStorage only once on mount
  useEffect(() => {
    if (hasInitialized.current) return
    
    const storedLanguage = getStoredLanguage()
    let finalLanguage = initialLanguage
    
    if (storedLanguage) {
      finalLanguage = storedLanguage
      console.log('Found stored language:', storedLanguage) // Debug log
    }
    
    const newDirection = rtlLanguages.includes(finalLanguage) ? "rtl" : "ltr"
    
    // Update states only if different
    if (finalLanguage !== language) {
      setLanguageState(finalLanguage)
    }
    if (newDirection !== direction) {
      setDirection(newDirection)
    }
    
    // Update DOM immediately
    document.documentElement.dir = newDirection
    document.documentElement.lang = finalLanguage
    
    previousLanguage.current = finalLanguage
    hasInitialized.current = true
    setIsLoaded(true)
  }, []) // Empty dependency array - runs only once

  // Handle language changes after initialization
  useEffect(() => {
    if (!hasInitialized.current) return // Skip if not initialized
    if (previousLanguage.current === language) return // Skip if no change
    
    console.log('Language changed from', previousLanguage.current, 'to', language) // Debug log
    console.log('Available languages:', availableLanguages) // Debug log
    
    const newDirection = rtlLanguages.includes(language) ? "rtl" : "ltr"
    
    // Update direction state if needed
    if (newDirection !== direction) {
      setDirection(newDirection)
    }
    
    // Update DOM
    document.documentElement.dir = newDirection
    document.documentElement.lang = language
    
    // Update localStorage
    setStoredLanguage(language)
    
    previousLanguage.current = language
  }, [language, availableLanguages, rtlLanguages]) // Include dependencies

  // Handle direction changes (separate from language changes to avoid loops)
  useEffect(() => {
    if (!hasInitialized.current) return
    document.documentElement.dir = direction
  }, [direction])

  const handleSetLanguage = (lang: string) => {
    console.log('Attempting to set language:', lang) // Debug log
    console.log('Available languages:', availableLanguages) // Debug log
    
    // Always allow setting any language - don't restrict based on availableLanguages
    // The restriction will be handled by components that call updateAvailableLanguages
    if (lang !== language) { // Only update if different
      setLanguageState(lang)
      console.log('Language set to:', lang) // Debug log
    } else {
      console.log('Language unchanged, already:', lang) // Debug log
    }
  }

  const translate = (key: string): string => {
    // Try current language first
    if (translations[language]) {
      const keys = key.split(".")
      let result: any = translations[language]

      for (const k of keys) {
        if (result[k] === undefined) break
        result = result[k]
      }

      if (typeof result === "string") return result
    }

    // Fallback to English if current language doesn't have the translation
    if (language !== "en" && translations["en"]) {
      const keys = key.split(".")
      let result: any = translations["en"]

      for (const k of keys) {
        if (result[k] === undefined) break
        result = result[k]
      }

      if (typeof result === "string") return result
    }

    // Return the key itself if no translation found
    return key
  }

  // Don't render children until language is properly loaded
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage: handleSetLanguage,
        t: translate,
        isLoaded,
        updateAvailableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}