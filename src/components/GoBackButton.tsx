'use client'

import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";

interface GoBackButtonProps {
  sectionName: string;
  textDirection?: string;
  className?: string;
  title?: string;
}

export function GoBackButton({ 
  sectionName, 
  textDirection = "ltr",
  className = "",
  title 
}: GoBackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { direction } = useLanguage()

  const handleGoBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Get the current path and the home path
    const homePath = '/'
    const currentPath = pathname
    
    if (currentPath === homePath) {
      // If already on home page, just scroll to the section
      scrollToSection(sectionName)
    } else {
      // If on another page, navigate to home page with hash
      router.push(`/${sectionName !== 'home' ? `#${sectionName}` : ''}`)
    }
  };

  // Helper function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <Button 
      onClick={handleGoBack} 
      className={`bg-primary text-white mb-5 ${className}`}
    >
      {direction === 'rtl' ? <ArrowRight className="mr-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
      {title ? title : "Back"}
    </Button>
  );
}