"use client"

import { memo } from "react"
import { useLanguage } from "@/contexts/language-context"

interface DotsNavigationProps {
  slidesCount: number
  currentSlide: number
  goToSlide: (index: number) => void
}

const DotsNavigation = memo(function DotsNavigation({ 
  slidesCount, 
  currentSlide, 
  goToSlide 
}: DotsNavigationProps) {
  const { t } = useLanguage()

  // Don't render if only one slide
  if (slidesCount <= 1) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4 z-20">
      {Array.from({ length: slidesCount }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => goToSlide(index)}
          className={`h-3 rounded-full transition-all duration-200 ${
            currentSlide === index 
              ? "bg-primary w-8" 
              : "bg-primary/60 w-3 hover:bg-primary/80"
          }`}
          aria-label={`${t("hero.goToSlide")} ${index + 1}`}
          aria-current={currentSlide === index ? "true" : "false"}
        />
      ))}
    </div>
  )
})

export default DotsNavigation