"use client"

import { ReactNode } from "react"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import NavigationTracker from "@/components/NavigationTracker"
import { useLanguage } from "@/contexts/language-context"
import { useWebSite } from "@/lib/webSite/use-WebSite"
import { useSections } from "@/lib/section/use-Section"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"
import { PreloadInitializer } from "@/components/PreloadInitializer"

// Define TypeScript interfaces for data
interface Website {
  id: string;
  logo?: string;
  // Add other website properties as needed
}

interface ContentElement {
  _id: string;
  name: string;
  type: string;
  value: string | null;
  // Add other element properties as needed
}

interface Subsection {
  _id: string;
  name: string;
  elements: ContentElement[];
  // Add other subsection properties as needed
}

interface SectionItem {
  _id: string;
  name: string;
  subsections: Subsection[];
  // Add other section item properties as needed
}

interface Section {
  _id: string;
  name: string;
  subName: string;
  sectionItems: SectionItem[];
  // Add other section properties as needed
}

interface RootLayoutClientProps {
  children: ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { direction } = useLanguage();
  const { useGetWebsitesByUserId } = useWebSite();
  const { useGetByWebsiteId } = useSections();

  const { data: websites, isLoading: websitesLoading, error: websitesError } = useGetWebsitesByUserId();
  const websiteId = websites && websites.length > 0 ? websites[0].id : undefined;
  const { data: sectionsData, isLoading: sectionsIsLoading, error: sectionsError } = useGetByWebsiteId(
    websiteId || "",
    false, // includeInactive
  );

  // Get all section IDs

  // Find specific sections (Header and Footer)
  const headerSection = sectionsData?.data.find((section: Section) => section.subName === "Header");
  const headerSectionId = headerSection?._id;

  const footerSection = sectionsData?.data.find((section: Section) => section.subName === "Footer");
  const footerSectionId = footerSection?._id;

  // Handle loading and error states
  if (websitesLoading || sectionsIsLoading) {
    return <SectionSkeleton variant="default" className="py-20" />;
  }

  if (websitesError) {
    return <div>Error: {(websitesError as Error).message}</div>;
  }

  if (sectionsError) {
    return <div>Error: {(sectionsError as Error).message}</div>;
  }

  if (!websites || websites.length === 0) {
    return <div>No websites found.</div>;
  }

return (
  <div dir={direction}>
    <PreloadInitializer />
    <NavigationTracker />
    
    {headerSectionId && (
      <Header 
        sectionId={headerSectionId}
        websiteId={websiteId} 
        logo={websites[0].logo} 
        sectionsData={sectionsData?.data || []} 
      />
    )}
        
    {children}
    
    <Footer 
      websiteId={websiteId} 
      logo={websites[0].logo} 
      sectionId={footerSectionId} 
    />
  </div>
);
}