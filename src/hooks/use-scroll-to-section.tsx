"use client"

import { useCallback, useEffect } from "react"

export function useScrollToSection() {
  const scrollToSection = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      // Add offset for the fixed header
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }, [])

  // Handle hash navigation on page load
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        // Multiple attempts with increasing delays
        const attempts = [100, 500, 1000, 2000]
        
        attempts.forEach((delay) => {
          setTimeout(() => {
            const element = document.getElementById(hash)
            if (element && window.pageYOffset === 0) {
              // Only scroll if we haven't scrolled yet
              scrollToSection(hash)
            }
          }, delay)
        })
      }
    }

    // Run on mount
    handleInitialHash()
  }, [scrollToSection])

  return scrollToSection
}