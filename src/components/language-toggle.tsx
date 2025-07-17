"use client"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useLanguages } from "@/lib/languages/use-language"

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  const websiteId = localStorage.getItem("websiteId") 
  const { useGetByWebsite: useGetWebsiteLanguages } = useLanguages()
  const { data: languages, isLoading: isLoadingLanguages } = useGetWebsiteLanguages(websiteId)
  


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isLoadingLanguages ? (
          <DropdownMenuItem disabled>
            Loading languages...
          </DropdownMenuItem>
        ) : (
          languages?.data?.filter((lang: any) => lang.isActive).map((lang: any) => (
            <DropdownMenuItem 
              key={lang._id}
              onClick={() => setLanguage(lang.languageID)} 
              className={language === lang.languageID ? "bg-muted" : ""}
            >
              {lang.language}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu> 
  )
}