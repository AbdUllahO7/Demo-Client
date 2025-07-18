// src/utils/lazyLoading.tsx - STEP 4 NEW UTILITY
import dynamic from 'next/dynamic'
import React, { ComponentType } from 'react'

// 🚀 STEP 4: Reusable lazy loading patterns with optimized loading states

interface LazyLoadOptions {
  ssr?: boolean
  loadingComponent?: ComponentType
  errorComponent?: ComponentType
}

// 🚀 Generic lazy loading for detail page components
export const createLazyDetailComponent = <T extends {}>(
  importFn: () => Promise<{ default: ComponentType<T> } | ComponentType<T>>,
  options: LazyLoadOptions = {}
) => {
  const {
    ssr = false,
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent
  } = options

  return dynamic(
    () => importFn().then(mod => ({ 
      default: 'default' in mod ? mod.default : mod 
    })),
    {
      loading: LoadingComponent ? () => <LoadingComponent /> : () => (
        <div className="animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ),
      ssr,
    }
  )
}

// 🚀 Optimized loading states for different component types
export const LoadingStates = {
  // Image loading placeholder
  Image: () => (
    <div className="mb-12 h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
      <div className="text-gray-400">Loading image...</div>
    </div>
  ),

  // Content loading placeholder
  Content: () => (
    <div className="space-y-6 mb-14">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
      </div>
    </div>
  ),

  // Header loading placeholder
  Header: () => (
    <div className="mb-8 space-y-4">
      <div className="h-6 bg-gray-200 animate-pulse rounded w-32"></div>
      <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
    </div>
  ),

  // Features section loading
  Features: () => (
    <div className="mb-16 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
          </div>
        </div>
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  ),

  // Process steps loading
  ProcessSteps: () => (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4 p-6 bg-gray-50 rounded">
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 animate-pulse rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  ),

  // FAQ loading
  FAQ: () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-6 bg-gray-50 rounded">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 animate-pulse rounded w-full"></div>
        </div>
      ))}
    </div>
  ),
}

// 🚀 Component preloading utility
export const preloadComponents = {
  // Preload detail page components
  detailPages: () => {
    Promise.all([
      import("@/components/Pages/ProductDetailPage/FeaturedImage"),
      import("@/components/Pages/ProductDetailPage/ProductContent"),
      import("@/components/Pages/ServiceDetails/FeaturesSection"),
      import("@/components/Pages/ServiceDetails/FAQSection"),
    ]).catch(console.error)
  },

  // Preload home page sections
  homeSections: () => {
    Promise.all([
      import("@/components/Pages/Home/sections/services-section"),
      import("@/components/Pages/Home/sections/news-section"),
      import("@/components/Pages/Home/sections/ContactSection/contact-section"),
    ]).catch(console.error)
  },

  // Preload on user interaction
  onUserInteraction: () => {
    const preload = () => {
      preloadComponents.detailPages()
      preloadComponents.homeSections()
    }

    // Preload on first user interaction
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll']
    const cleanup = () => {
      events.forEach(event => document.removeEventListener(event, preload))
    }

    events.forEach(event => 
      document.addEventListener(event, preload, { once: true, passive: true })
    )

    // Cleanup after 10 seconds
    setTimeout(cleanup, 10000)
  }
}

// 🚀 Hook for intersection-based lazy loading
export const useIntersectionLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    const current = ref.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}