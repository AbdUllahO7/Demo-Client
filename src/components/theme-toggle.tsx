"use client"

import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useWebsiteTheme } from "@/contexts/WebsiteThemeContext"

export function ThemeToggle() {
  const { colorMode, setColorMode } = useWebsiteTheme()
  const { t, language } = useLanguage()

  const getTranslation = (key: 'light' | 'dark') => {
    const translations = {
      light: {
        en: 'Light',
        ar: 'فاتح',
        tr: 'Açık'
      },
      dark: {
        en: 'Dark',
        ar: 'داكن',
        tr: 'Koyu'
      }
    }
    return translations[key][language as 'en' | 'ar' | 'tr'] || translations[key].en
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setColorMode("light")}>
          {getTranslation('light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorMode("dark")}>
          {getTranslation('dark')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}