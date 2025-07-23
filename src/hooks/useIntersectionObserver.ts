import { useEffect, useRef, useState, useMemo } from 'react'

interface UseOptimizedIntersectionOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  enabled?: boolean
}

interface UseOptimizedIntersectionReturn {
  ref: React.RefObject<HTMLElement>
  isInView: boolean
  hasBeenInView: boolean
}

const observerPool = new Map<string, IntersectionObserver>()

const createObserverKey = (threshold: number, rootMargin: string): string => {
  return `${threshold}-${rootMargin}`
}

export const useOptimizedIntersection = (
  options: UseOptimizedIntersectionOptions = {}
): UseOptimizedIntersectionReturn => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    enabled = true
  } = options

  const elementRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)

  // إنشاء مفتاح فريد للـ Observer
  const observerKey = useMemo(() => createObserverKey(threshold, rootMargin), [threshold, rootMargin])

  useEffect(() => {
    const element = elementRef.current
    if (!element || !enabled) return

    // استخدام Observer موجود أو إنشاء واحد جديد
    let observer = observerPool.get(observerKey)
    
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement
            const callback = target.dataset.intersectionCallback
            
            if (callback && window[callback]) {
              window[callback](entry.isIntersecting, entry)
            }
          })
        },
        {
          threshold,
          rootMargin,
          // تحسين الأداء بتقليل التحديثات
          trackVisibility: false,
          delay: 100
        }
      )
      observerPool.set(observerKey, observer)
    }

    // إنشاء callback فريد لهذا العنصر
    const callbackName = `intersectionCallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    window[callbackName] = (isVisible: boolean, entry: IntersectionObserverEntry) => {
      setIsInView(isVisible)
      
      if (isVisible && !hasBeenInView) {
        setHasBeenInView(true)
        
        // إيقاف المراقبة إذا كان triggerOnce مفعّل
        if (triggerOnce) {
          observer?.unobserve(element)
          delete window[callbackName]
          element.removeAttribute('data-intersection-callback')
        }
      }
    }

    // ربط الـ callback بالعنصر
    element.dataset.intersectionCallback = callbackName
    observer.observe(element)

    // تنظيف الذاكرة
    return () => {
      if (observer && element) {
        observer.unobserve(element)
        delete window[callbackName]
        element.removeAttribute('data-intersection-callback')
      }
    }
  }, [threshold, rootMargin, triggerOnce, enabled, hasBeenInView, observerKey])

  // تنظيف عام عند إلغاء تحميل الصفحة
  useEffect(() => {
    const cleanup = () => {
      observerPool.forEach((observer) => {
        observer.disconnect()
      })
      observerPool.clear()
    }

    window.addEventListener('beforeunload', cleanup)
    return () => {
      window.removeEventListener('beforeunload', cleanup)
      cleanup()
    }
  }, [])

  return {
    ref: elementRef,
    isInView: triggerOnce ? hasBeenInView : isInView,
    hasBeenInView
  }
}

// Hook مبسّط للاستخدام الأساسي
export const useInView = (options?: UseOptimizedIntersectionOptions) => {
  return useOptimizedIntersection(options)
}

// Hook للتحكم في التحريك
export const useScrollAnimation = (options?: UseOptimizedIntersectionOptions) => {
  const { ref, isInView, hasBeenInView } = useOptimizedIntersection({
    threshold: 0.1,
    triggerOnce: true,
    ...options
  })

  return {
    ref,
    isInView,
    hasBeenInView,
    // للتوافق مع الكود الحالي
    controls: {
      start: () => {},
      stop: () => {}
    }
  }
}