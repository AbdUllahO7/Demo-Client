"use client"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useLanguages } from "@/lib/languages/use-language"
import { useWebSite } from "@/lib/webSite/use-WebSite"
import { useEffect, useState } from "react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  
  // Get website data
  const { useGetWebsitesByUserId } = useWebSite()
  const { data: websites, isLoading: websitesLoading } = useGetWebsitesByUserId()
  
  // Get languages for the website
  const { useGetByWebsite: useGetWebsiteLanguages } = useLanguages()
  const { data: languages, isLoading: isLoadingLanguages } = useGetWebsiteLanguages(
    websiteId || "",
    { isActive: true }
  )

  // Set websiteId when websites are loaded
  useEffect(() => {
    if (websites && websites.length > 0 && !websitesLoading) {
      const id = websites[0].id
      setWebsiteId(id)
    } else {
      // Fallback to localStorage if available
      const storedWebsiteId = localStorage.getItem("websiteId")
      if (storedWebsiteId) {
        setWebsiteId(storedWebsiteId)
      }
    }
  }, [websites, websitesLoading])
  
  const handleLanguageChange = (languageID: string) => {
    console.log('LanguageToggle: Changing language to:', languageID) // Debug log
    console.log('LanguageToggle: Current language:', language) // Debug log
    setLanguage(languageID)
  }

  // Debug: Log what's happening
  useEffect(() => {
    if (languages?.data) {
      console.log('LanguageToggle: Languages loaded:', languages.data)
      const activeLanguages = languages.data.filter((lang: any) => lang.isActive)
      console.log('LanguageToggle: Active languages:', activeLanguages)
    }
  }, [languages])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isLoadingLanguages || websitesLoading ? (
          <DropdownMenuItem disabled>
            Loading languages...
          </DropdownMenuItem>
        ) : languages?.data?.length > 0 ? (
          languages.data
            .filter((lang: any) => lang.isActive)
            .map((lang: any) => (
              <DropdownMenuItem 
                key={lang._id}
                onClick={() => handleLanguageChange(lang.languageID)} 
                className={language === lang.languageID ? "bg-muted" : ""}
              >
                <span className="flex items-center justify-between w-full">
                  {lang.language}
                  {language === lang.languageID && <span className="ml-2">✓</span>}
                </span>
              </DropdownMenuItem>
            ))
        ) : (
          <DropdownMenuItem disabled>
            No languages available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu> 
  )
}