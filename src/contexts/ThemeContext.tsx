"use client"
import { WebSiteTheme } from '@/api/types/WebSite/useWebSiteTheme'
import { useWebSiteThemes } from '@/lib/webSite/use-Theme'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  activeTheme: WebSiteTheme | null
  isLoading: boolean
  error: string | null
  refreshTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  websiteId: string
}

export function ThemeProvider({ children, websiteId }: ThemeProviderProps) {
  const { useGetActiveTheme } = useWebSiteThemes()
  const { data: themeData, isLoading, error, refetch } = useGetActiveTheme(websiteId)
  const [activeTheme, setActiveTheme] = useState<WebSiteTheme | null>(null)
  // Extract theme from API response
  useEffect(() => {
    if (themeData?.data) {
      setActiveTheme(themeData.data)
    }
  }, [themeData])

  // Apply theme to CSS custom properties
  useEffect(() => {
    if (activeTheme) {
      applyThemeToCSS(activeTheme)
    }
  }, [activeTheme])

  const refreshTheme = () => {
    refetch()
  }

  const contextValue: ThemeContextType = {
    activeTheme,
    isLoading,
    error: error?.message || null,
    refreshTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Function to apply theme to CSS custom properties
function applyThemeToCSS(theme: WebSiteTheme) {
  const root = document.documentElement

  // Apply color variables
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-secondary', theme.colors.secondary || theme.colors.primary)
  root.style.setProperty('--theme-background', theme.colors.background)
  root.style.setProperty('--theme-text', theme.colors.text)
  root.style.setProperty('--theme-accent', theme.colors.accent || theme.colors.primary)
  root.style.setProperty('--theme-border', theme.colors.border || '#e5e7eb')
  root.style.setProperty('--theme-hover', theme.colors.hover || "#000000")
  root.style.setProperty('--theme-error', theme.colors.error || '#ef4444')
  root.style.setProperty('--theme-success', theme.colors.success || '#10b981')
  root.style.setProperty('--theme-warning', theme.colors.warning || '#f59e0b')

  // Apply font variables
  root.style.setProperty('--theme-font-heading', theme.fonts.heading.family)
  root.style.setProperty('--theme-font-heading-weight', theme.fonts.heading.weight || '700')
  root.style.setProperty('--theme-font-heading-size', theme.fonts.heading.size || '2rem')
  
  root.style.setProperty('--theme-font-body', theme.fonts.body.family)
  root.style.setProperty('--theme-font-body-weight', theme.fonts.body.weight || '400')
  root.style.setProperty('--theme-font-body-size', theme.fonts.body.size || '1rem')
  
  if (theme.fonts.accent) {
    root.style.setProperty('--theme-font-accent', theme.fonts.accent.family)
    root.style.setProperty('--theme-font-accent-weight', theme.fonts.accent.weight || '600')
    root.style.setProperty('--theme-font-accent-size', theme.fonts.accent.size || '1.125rem')
  }

  // Generate lighter and darker variants for primary color
  const primaryRGB = hexToRGB(theme.colors.primary)
  if (primaryRGB) {
    root.style.setProperty('--theme-primary-50', `rgb(${lighten(primaryRGB, 0.9)})`)
    root.style.setProperty('--theme-primary-100', `rgb(${lighten(primaryRGB, 0.8)})`)
    root.style.setProperty('--theme-primary-200', `rgb(${lighten(primaryRGB, 0.6)})`)
    root.style.setProperty('--theme-primary-300', `rgb(${lighten(primaryRGB, 0.4)})`)
    root.style.setProperty('--theme-primary-400', `rgb(${lighten(primaryRGB, 0.2)})`)
    root.style.setProperty('--theme-primary-500', theme.colors.primary)
    root.style.setProperty('--theme-primary-600', `rgb(${darken(primaryRGB, 0.1)})`)
    root.style.setProperty('--theme-primary-700', `rgb(${darken(primaryRGB, 0.2)})`)
    root.style.setProperty('--theme-primary-800', `rgb(${darken(primaryRGB, 0.3)})`)
    root.style.setProperty('--theme-primary-900', `rgb(${darken(primaryRGB, 0.4)})`)
  }

  // Add theme class to body for additional styling
  document.body.className = document.body.className.replace(/theme-\w+/g, '')
  document.body.classList.add(`theme-${theme._id}`)
  
}

// Utility functions for color manipulation
function hexToRGB(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null
}

function lighten(rgb: [number, number, number], factor: number): string {
  return rgb.map(c => Math.round(c + (255 - c) * factor)).join(', ')
}

function darken(rgb: [number, number, number], factor: number): string {
  return rgb.map(c => Math.round(c * (1 - factor))).join(', ')
}

