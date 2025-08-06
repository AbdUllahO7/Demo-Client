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
    
    const homePath = '/'
    const currentPath = pathname
    
    if (currentPath === homePath) {
      // If already on home page, scroll to section and immediately clear hash
      if (sectionName && sectionName !== 'home') {
        // Set hash temporarily for the scroll logic to work
        window.history.replaceState(null, '', `${homePath}#${sectionName}`);
        // Clear it immediately after
        setTimeout(() => {
          window.history.replaceState(null, '', homePath);
        }, 100);
      }
    } else {
      // If on another page, navigate to home page
      if (sectionName && sectionName !== 'home') {
        router.push(`/#${sectionName}`);
        // Clear hash after navigation and scroll
        setTimeout(() => {
          window.history.replaceState(null, '', homePath);
        }, 2000);
      } else {
        router.push('/');
      }
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