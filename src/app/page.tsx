"use client";

import { JSX, useEffect } from "react";
import ServicesSection from "@/components/Pages/Home/sections/services-section";
import ProcessSection from "@/components/Pages/Home/sections/process-section";
import TestimonialsSection from "@/components/Pages/Home/sections/testimonials-section";
import PartnersSectionComponent from "@/components/Pages/Home/sections/partners-section";
import TeamSection from "@/components/Pages/Home/sections/team-section";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import NewsSection from "@/components/Pages/Home/sections/news-section";
import ProjectsSection from "@/components/Pages/Home/sections/projects-section";
import ContactSection from "@/components/Pages/Home/sections/ContactSection/contact-section";
import FaqSection from "@/components/Pages/Home/sections/FaqSection/faq-section";
import HeroSection from "@/components/Pages/Home/sections/HeroSection/hero-section";
import IndustrySolutionsSection from "@/components/Pages/Home/sections/IndustrySolutionsSection/industry-solutions-section";
import FeaturesSection from "@/components/Pages/Home/sections/FeaturesSection/features-section";
import { useWebSite } from "@/lib/webSite/use-WebSite";
import { useSections } from "@/lib/section/use-Section";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton";
import ProductsSection from "@/components/Pages/Home/sections/ProductsSection/ProductsSection";
import BlogSection from '@/components/Pages/Home/sections/BlogSection/blog-section';



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
  const { useGetByWebsiteId } = useSections();
  const scrollToSection = useScrollToSection();

  const { data: websites, isLoading: websitesLoading, error: websitesError } = useGetWebsitesByUserId();
  const websiteId = websites && websites.length > 0 ? websites[0].id : undefined;
  const { data: sectionsData, isLoading: sectionsIsLoading, error: sectionsError } = useGetByWebsiteId(
    websiteId || "",
    false,
  );

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