// src/components/Blog/BlogSection.tsx
"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/contexts/language-context";
import { useSectionLogic } from "@/hooks/useSectionLogic";
import { useSectionContent } from "@/hooks/useSectionContent";
import { BlogCarousel } from "./BlogCarousel";
import { FadeIn } from "@/utils/lightweightAnimations";

export default function BlogSection({ websiteId, sectionId }: { websiteId: string; sectionId: string }) {
  const {  isInView } = useScrollAnimation();
  const { direction } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    content,
  } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "blogs",
  });

  const {
    contentItems,
  } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",
      title: "Title",
      excerpt: "Description",
      content: "Content",
      category: "Category",
      date: "Date",
      color: () => "theme-gradient",
    },
  });

  const isRTL = direction === "rtl";

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 bg-wtheme-background" id="blog" dir={direction}>
      {/* Modern layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-wtheme-background via-wtheme-background/95 to-wtheme-background/90 z-0" />

      {/* Animated dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--website-theme-primary),0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] opacity-70" />

      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-[10%] w-64 h-64 md:w-96 md:h-96 lg:w-[35rem] lg:h-[35rem] bg-secondary/10 rounded-full blur-3xl md:blur-[8rem] -z-10" />
      <div className="absolute bottom-40 right-[5%] w-48 h-48 md:w-72 md:h-72 lg:w-[25rem] lg:h-[25rem] bg-accent/10 rounded-full blur-2xl md:blur-[7rem] -z-10" />

      <div className="container relative px-4 md:px-6 mx-auto z-10" ref={containerRef}>
        <FadeIn
       
        
          className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center mb-12 md:mb-20"
        >
          <span
            
              className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
            >
              {content.sectionLabel}
          </span>
          <div className="space-y-3 md:space-y-5 max-w-4xl">
            <h2
            
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold tracking-tight text-wtheme-text"
            >
              {content.sectionTitle}
            </h2>

            <p
           
              className="text-base md:text-xl lg:text-2xl font-body text-wtheme-text max-w-3xl mx-auto"
            >
              {content.sectionDescription}
            </p>
          </div>
        </FadeIn>

        {/* Blog Posts Carousel */}
        <div className="mt-8 md:mt-12">
          <BlogCarousel
            posts={contentItems}
            isInView={isInView}
            containerRef={containerRef}
            isRTL={isRTL}
          />
        </div>
      </div>
    </section>
  );
}