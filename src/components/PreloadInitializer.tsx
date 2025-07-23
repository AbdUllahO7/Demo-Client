import { useEffect } from "react"


export function PreloadInitializer() {
  useEffect(() => {
    // 🚀 STEP 4: Preload critical components on user interaction
    let hasPreloaded = false

    const preloadCriticalComponents = () => {
      if (hasPreloaded) return
      hasPreloaded = true

      // Preload detail page components
      Promise.all([
        import("@/components/Pages/ProductDetailPage/FeaturedImage"),
        import("@/components/Pages/ProductDetailPage/ProductContent"),
        import("@/components/Pages/ServiceDetails/FeaturesSection"),
        import("@/components/Pages/ServiceDetails/HowItWorksSection"),
        import("@/components/Pages/ServiceDetails/FAQSection"),
      ]).catch(console.error)

      // Preload home sections that aren't immediately visible
      Promise.all([
        import("@/components/Pages/Home/sections/testimonials-section"),
        import("@/components/Pages/Home/sections/partners-section"),
        import("@/components/Pages/Home/sections/team-section"),
        import("@/components/Pages/Home/sections/FaqSection/faq-section"),
      ]).catch(console.error)
    }

    // 🚀 STEP 4: Trigger preloading on first user interaction
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll']
    const cleanup = () => {
      events.forEach(event => 
        document.removeEventListener(event, preloadCriticalComponents)
      )
    }

    events.forEach(event => 
      document.addEventListener(event, preloadCriticalComponents, { 
        once: true, 
        passive: true 
      })
    )

    // 🚀 STEP 4: Fallback - preload after 3 seconds if no interaction
    const fallbackTimer = setTimeout(preloadCriticalComponents, 3000)

    return () => {
      cleanup()
      clearTimeout(fallbackTimer)
    }
  }, [])

  return null // This component doesn't render anything
}



