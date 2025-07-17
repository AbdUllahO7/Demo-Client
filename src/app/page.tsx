"use client";

import { JSX, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { useWebSite } from "@/lib/webSite/use-WebSite";
import { useSections } from "@/lib/section/use-Section";
import { useBatchedSectionData } from "@/hooks/useBatchedSectionData";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton";
import dynamic from 'next/dynamic';

// Keep HeroSection static (above the fold)
import HeroSection from "@/components/Pages/Home/sections/HeroSection/hero-section";

// Dynamic imports with loading states
const ServicesSection = dynamic(() => import("@/components/Pages/Home/sections/services-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const ProcessSection = dynamic(() => import("@/components/Pages/Home/sections/process-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const TestimonialsSection = dynamic(() => import("@/components/Pages/Home/sections/testimonials-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const PartnersSectionComponent = dynamic(() => import("@/components/Pages/Home/sections/partners-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const TeamSection = dynamic(() => import("@/components/Pages/Home/sections/team-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const NewsSection = dynamic(() => import("@/components/Pages/Home/sections/news-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const ProjectsSection = dynamic(() => import("@/components/Pages/Home/sections/projects-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const BlogSection = dynamic(() => import("@/components/Pages/Home/sections/BlogSection/blog-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const ContactSection = dynamic(() => import("@/components/Pages/Home/sections/ContactSection/contact-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const FaqSection = dynamic(() => import("@/components/Pages/Home/sections/FaqSection/faq-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const IndustrySolutionsSection = dynamic(() => import("@/components/Pages/Home/sections/IndustrySolutionsSection/industry-solutions-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const FeaturesSection = dynamic(() => import("@/components/Pages/Home/sections/FeaturesSection/features-section"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

const ProductsSection = dynamic(() => import("@/components/Pages/Home/sections/ProductsSection/ProductsSection"), {
  loading: () => <SectionSkeleton variant="default" className="py-20" />
});

// Define TypeScript interfaces for data
interface Website {
  id: string;
}

interface ContentElement {
  _id: string;
  name: string;
  type: string;
  value: string | null;
}

interface Subsection {
  _id: string;
  name: string;
  elements: ContentElement[];
}

interface SectionItem {
  _id: string;
  name: string;
  subName: string;
  subsections: Subsection[];
}

interface Section {
  _id: string;
  name: string;
  subName: string;
  order: number;
  isActive: boolean;
  sectionItems: SectionItem[];
  // Properties for duplicated sections
  originalSectionId?: string;
  duplicateIndex?: number;
  isDuplicate?: boolean;
  duplicateOf?: string;
  uniqueIdentifier?: string;
}

// Helper function to get the original component key for duplicated sections
const getOriginalSubName = (subName: string): string => {
  // Remove duplicate suffix like "-duplicate-1", "-duplicate-2", etc.
  return subName.replace(/-duplicate-\d+.*$/, '');
};

export default function LandingPage() {
  const { direction } = useLanguage();
  const { useGetWebsitesByUserId } = useWebSite();
  const scrollToSection = useScrollToSection();

  // 🚀 OPTIMIZATION: Get website data
  const { data: websites, isLoading: websitesLoading, error: websitesError } = useGetWebsitesByUserId();
  const websiteId = websites && websites.length > 0 ? websites[0].id : undefined;
  
  // 🚀 OPTIMIZATION: Use batched data instead of individual calls
  const { 
    sectionsData, 
    isLoading: sectionsIsLoading, 
    error: sectionsError 
  } = useBatchedSectionData({ 
    websiteId: websiteId || "",
    enabled: !!websiteId 
  });

  if (websiteId) {
    localStorage.setItem("websiteId", websiteId);
  }

  // Set smooth scrolling globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Scroll to section based on URL hash (subName) on page load
  useEffect(() => {
    if (typeof window !== "undefined" && sectionsData?.data) {
      const hash = window.location.hash;
      if (hash) {
        const subName = hash.substring(1);
        const targetSection = sectionsData.data.find(
          (section: Section) => {
            const originalSubName = getOriginalSubName(section.subName);
            return (
              (section.subName.toLowerCase() === subName.toLowerCase() || 
               originalSubName.toLowerCase() === subName.toLowerCase()) && 
              section.isActive
            );
          }
        );
        if (targetSection) {
          setTimeout(() => {
            scrollToSection(targetSection._id);
          }, 500);
        }
      }
    }
  }, [sectionsData, scrollToSection]);

  // Map section names to components with section ID
  const sectionComponents: { [key: string]: (id: string, websiteId?: string) => JSX.Element } = {
    Hero: (id: string, websiteId?: string) => <HeroSection websiteId={websiteId} sectionId={id} />,
    News: (id: string, websiteId?: string) => <NewsSection websiteId={websiteId} sectionId={id} />,
    IndustrySolutions: (id: string, websiteId?: string) => (
      <IndustrySolutionsSection websiteId={websiteId} sectionId={id} />
    ),
    Services: (id: string, websiteId?: string) => <ServicesSection websiteId={websiteId} sectionId={id} />,
    whyChooseUs: (id: string, websiteId?: string) => <FeaturesSection websiteId={websiteId} sectionId={id} />,
    Projects: (id: string, websiteId?: string) => <ProjectsSection websiteId={websiteId} sectionId={id} />,
    OurProcess: (id: string, websiteId?: string) => <ProcessSection websiteId={websiteId} sectionId={id} />,
    Team: (id: string, websiteId?: string) => <TeamSection websiteId={websiteId} sectionId={id} />,
    ClientComments: (id: string, websiteId?: string) => (
      <TestimonialsSection websiteId={websiteId} sectionId={id} />
    ),
    Partners: (id: string, websiteId?: string) => <PartnersSectionComponent websiteId={websiteId} sectionId={id} />,
    FAQ: (id: string, websiteId?: string) => <FaqSection websiteId={websiteId} sectionId={id} />,
    Blog: (id: string, websiteId?: string) => <BlogSection websiteId={websiteId} sectionId={id} />,
    Products: (id: string, websiteId?: string) => <ProductsSection websiteId={websiteId} sectionId={id} />,
    Contact: (id: string, websiteId?: string) => <ContactSection websiteId={websiteId} sectionId={id} />,
  };

  // Handle loading and error states
  if (websitesLoading || sectionsIsLoading) {
    return (
      <div className="flex min-h-screen flex-col" dir={direction}>
        <SectionSkeleton variant="default" className="py-20" />
      </div>
    );
  }

  if (websitesError) {
    return (
      <div className="flex min-h-screen flex-col" dir={direction}>
        <div>Error: {(websitesError as Error).message}</div>
      </div>
    );
  }

  if (sectionsError) {
    return (
      <div className="flex min-h-screen flex-col" dir={direction}>
        <div>Error: {(sectionsError as Error).message}</div>
      </div>
    );
  }

  if (!sectionsData.data || sectionsData.data.length === 0) {
    return (
      <div className="flex min-h-screen flex-col" dir={direction}>
        <div>No sections found for the website.</div>
      </div>
    );
  }

  // Filter active sections only (including duplicates)
  const activeSections = sectionsData.data.filter((section: Section) => section.isActive);
  
  // Sort by order - this will show original and duplicated sections in the correct order
  const sortedSections = activeSections.sort((a: Section, b: Section) => a.order - b.order);
  
  // Separate footer sections from other sections
  const footerSections = sortedSections.filter((section: Section) => {
    const originalSubName = getOriginalSubName(section.subName);
    return originalSubName.toLowerCase() === 'footer';
  });
  
  const otherSections = sortedSections.filter((section: Section) => {
    const originalSubName = getOriginalSubName(section.subName);
    return originalSubName.toLowerCase() !== 'footer';
  });

  return (
    <AnimatePresence>
      <div className="flex min-h-screen flex-col" dir={direction}>
        <main>
          {/* Render all sections except footer */}
          {otherSections.map((section: Section) => {
            const originalSubName = getOriginalSubName(section.subName);
            
            return (
              <div key={section._id} id={section._id}>
                {sectionComponents[originalSubName]?.(section._id, websiteId) || null}
              </div>
            );
          })}
        </main>
        
        {/* Render footer sections if any */}
        {footerSections.map((section: Section) => {
          const originalSubName = getOriginalSubName(section.subName);
          return (
            <div key={section._id} id={section._id}>
              {sectionComponents[originalSubName]?.(section._id, websiteId) || null}
            </div>
          );
        })}
      </div>
    </AnimatePresence>
  );
}