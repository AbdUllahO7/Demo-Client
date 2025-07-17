"use client"

import { useState, useEffect, use } from 'react'
import HeroSection from "@/components/Pages/ServiceDetails/HeroSection"
import OverviewSection from "@/components/Pages/ServiceDetails/OverviewSection"
import FeaturesSection from "@/components/Pages/ServiceDetails/FeaturesSection"
import HowItWorksSection from "@/components/Pages/ServiceDetails/HowItWorksSection"
import FAQSection from "@/components/Pages/ServiceDetails/FAQSection"

import { useLanguage } from "@/contexts/language-context"
import { Loader2 } from "lucide-react"
import { useSubSections } from '@/lib/subSections/use-subSections'
import { ProjectNotFound } from '@/components/Pages/ProjectsDetailPage/data/ProjectNotFound'
import { SectionSkeleton } from '@/components/Skeleton/SectionSkeleton'

// Translations for loading and error states
const translations = {  
    en: {
        loading: "Loading content...",
        error: "Error loading content. Please try again later.",
        retry: "Retry",
        backToService: "Back To Services"
    },
    ar: {
        loading: "جاري تحميل المحتوى...",
        error: "خطأ في تحميل المحتوى. يرجى المحاولة مرة أخرى لاحقًا.",
        retry: "إعادة المحاولة",
        backToService: "العودة إلى الخدمات"
    }
};

// Helper function to get content by language
const getContentByLanguage = (element: any, language: string) => {
    if (!element) {
        return "";
    }
    
    if (!element.translations || element?.translations?.length === 0) {
        return element.defaultContent || "";
    }

    const translation = element?.translations?.find((trans: any) => 
        trans.language?.languageID === language
    );
    
    return translation?.content || element.defaultContent || "";
};

// Helper function to extract overview data from section
const extractOverviewData = (overviewSection: any, language: string) => {
    if (!overviewSection || !overviewSection.elements) {
        return null;
    }

    const elements = overviewSection.elements;
    
    // Find title and description elements
    const titleElement = elements.find((el: any) => el.name === "Title");
    const descriptionElement = elements.find((el: any) => el.name === "Description");

    // Only return data if we have at least a description (title is optional)
    if (!descriptionElement && !titleElement) {
        return null;
    }

    return {
        title: titleElement ? getContentByLanguage(titleElement, language) : "",
        description: descriptionElement ? getContentByLanguage(descriptionElement, language) : ""
    };
};

// Helper function to extract hero data from section
const extractHeroData = (heroSection: any, language: string) => {
    if (!heroSection || !heroSection.elements) {
        return null;
    }

    const elements = heroSection.elements;
    
    // Find each element by name
    const backgroundImageElement = elements.find((el: any) => el.name === "Background Image");
    const titleElement = elements.find((el: any) => el.name === "Title");
    const descriptionElement = elements.find((el: any) => el.name === "Description");
    const backLinkTextElement = elements.find((el: any) => el.name === "Back Link Text");

    return {
        backgroundImage: backgroundImageElement?.imageUrl || backgroundImageElement?.defaultContent || "/placeholder.svg",
        title: titleElement ? getContentByLanguage(titleElement, language) : "",
        description: descriptionElement ? getContentByLanguage(descriptionElement, language) : "",
        backLinkText: backLinkTextElement ? getContentByLanguage(backLinkTextElement, language) : "",
        sectionId: "services" // Default section to return to
    };
};

// Helper function to extract benefits data from section
const extractBenefitsData = (benefitsSection: any, language: string) => {
    if (!benefitsSection || !benefitsSection.elements) {
        return [];
    }

    const elements = benefitsSection.elements;
    const benefits = [];

    // Group elements by benefit number
    const benefitGroups = {};
    
    elements.forEach((element: any) => {
        const match = element.name.match(/Benefit (\d+) - (\w+)/);
        if (match) {
            const benefitNumber = match[1];
            const elementType = match[2].toLowerCase();
            
            if (!benefitGroups[benefitNumber]) {
                benefitGroups[benefitNumber] = {};
            }
            
            benefitGroups[benefitNumber][elementType] = element;
        }
    });

    // Convert grouped elements to benefit objects
    Object.keys(benefitGroups).forEach(benefitNumber => {
        const group = benefitGroups[benefitNumber];
        
        const benefit = {
            id: benefitNumber,
            icon: group.icon?.defaultContent || "Tag",
            title: group.title ? getContentByLanguage(group.title, language) : "",
            description: group.description ? getContentByLanguage(group.description, language) : ""
        };
        
        // Only add benefit if it has at least a title
        if (benefit.title) {
            benefits.push(benefit);
        }
    });

    return benefits.sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

// Helper function to extract features data from section
const extractFeaturesData = (featuresSection: any, language: string) => {
    if (!featuresSection || !featuresSection.elements) {
        return [];
    }

    const elements = featuresSection.elements;
    const features = [];

    // Group elements by feature number
    const featureGroups = {};
    
    elements.forEach((element: any) => {
        const match = element.name.match(/Feature (\d+) - (.+)/);
        if (match) {
            const featureNumber = match[1];
            const elementType = match[2].toLowerCase().replace(/\s+/g, '');
            
            if (!featureGroups[featureNumber]) {
                featureGroups[featureNumber] = { items: [] };
            }
            
            // Handle different element types
            if (elementType.includes('featureitem')) {
                featureGroups[featureNumber].items.push(element);
            } else if (elementType === 'image') {
                featureGroups[featureNumber].image = element;
            } else if (elementType === 'title') {
                featureGroups[featureNumber].title = element;
            } else if (elementType === 'heading') {
                featureGroups[featureNumber].heading = element;
            } else if (elementType === 'description') {
                featureGroups[featureNumber].description = element;
            }
        }
    });

    // Convert grouped elements to feature objects
    Object.keys(featureGroups).forEach(featureNumber => {
        const group = featureGroups[featureNumber];
        
        const feature = {
            id: featureNumber,
            title: group.title ? getContentByLanguage(group.title, language) : (group.heading ? getContentByLanguage(group.heading, language) : ""),
            content: {
                heading: group.heading ? getContentByLanguage(group.heading, language) : (group.title ? getContentByLanguage(group.title, language) : ""),
                description: group.description ? getContentByLanguage(group.description, language) : "",
                image: group.image?.imageUrl || group.image?.defaultContent || "/placeholder.svg",
                imageAlt: group.title ? getContentByLanguage(group.title, language) : "Feature image",
                imagePosition: "right", // Default position
                features: group.items 
                    ? group.items
                        .sort((a, b) => a.order - b.order)
                        .map((item: any) => getContentByLanguage(item, language))
                        .filter(Boolean)
                    : []
            }
        };
        
        // Only add feature if it has content
        if (feature.title || feature.content.description) {
            features.push(feature);
        }
    });

    return features.sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

// Helper function to extract process steps data from section
const extractProcessStepsData = (processStepsSection: any, language: string) => {
    if (!processStepsSection || !processStepsSection.elements) {
        return [];
    }

    const elements = processStepsSection.elements;
    const steps = [];

    // Group elements by step number
    const stepGroups = {};
    
    elements.forEach((element: any) => {
        const match = element.name.match(/Step (\d+) - (\w+)/);
        if (match) {
            const stepNumber = match[1];
            const elementType = match[2].toLowerCase();
            
            if (!stepGroups[stepNumber]) {
                stepGroups[stepNumber] = {};
            }
            
            stepGroups[stepNumber][elementType] = element;
        }
    });

    // Convert grouped elements to step objects
    Object.keys(stepGroups).forEach(stepNumber => {
        const group = stepGroups[stepNumber];
        
        const step = {
            id: stepNumber,
            icon: group.icon?.defaultContent || "Car",
            title: group.title ? getContentByLanguage(group.title, language) : "",
            description: group.description ? getContentByLanguage(group.description, language) : ""
        };
        
        // Only add step if it has at least a title
        if (step.title) {
            steps.push(step);
        }
    });

    return steps.sort((a, b) => parseInt(a.id) - parseInt(b.id));
};



// Helper function to extract FAQ data from section
const extractFaqData = (faqSection: any, language: string) => {
    if (!faqSection || !faqSection.elements) {
        return [];
    }

    const elements = faqSection.elements;
    const faqs = [];

    // Group elements by FAQ number
    const faqGroups = {};
    
    elements.forEach((element: any) => {
        const match = element.name.match(/FAQ (\d+) - (\w+)/);
        if (match) {
            const faqNumber = match[1];
            const elementType = match[2].toLowerCase();
            
            if (!faqGroups[faqNumber]) {
                faqGroups[faqNumber] = {};
            }
            
            faqGroups[faqNumber][elementType] = element;
        }
    });

    // Convert grouped elements to FAQ objects
    Object.keys(faqGroups).forEach(faqNumber => {
        const group = faqGroups[faqNumber];
        
        const faq = {
            id: faqNumber,
            question: group.question ? getContentByLanguage(group.question, language) : "",
            answer: group.answer ? getContentByLanguage(group.answer, language) : ""
        };
        
        // Only add FAQ if it has both question and answer
        if (faq.question && faq.answer) {
            faqs.push(faq);
        }
    });

    return faqs.sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

export default function SmartDriveThroughPage({ params }: { params: Promise<{ id: string }> }) {
    const { language, direction } = useLanguage();
    const t = translations[language] || translations?.en;
    const resolvedParams = use(params)
    const projectId = resolvedParams.id

    const { useGetBySectionItemIds, useGetCompleteById } = useSubSections()

    const { data: serviceData, error: serviceError } = useGetCompleteById(projectId)
    const { data: sectionData, error: sectionError } = useGetBySectionItemIds([serviceData?.data?.sectionItem?._id])


    // Find sections by name
    const overviewSection = sectionData?.data?.find((section: any) =>
        section.name === "Overview Section"
    )
    const heroSection = sectionData?.data?.find((section: any) =>
        section.elements?.some((element: any) => element.name === "Back Link Text")
    )
    const benefitsSection = sectionData?.data?.find((section: any) =>
        section.name === "Benefits Section"
    )
    const featuresSection = sectionData?.data?.find((section: any) =>
        section.name === "Features Section"
    )
    const processStepsSection = sectionData?.data?.find((section: any) =>
        section.name === "Process Steps Section"
    )
    const faqSection = sectionData?.data?.find((section: any) =>
        section.name === "FAQ Section"
    )



    // Extract data from sections
    const pageOverviewData = overviewSection ? extractOverviewData(overviewSection, language) : null;
    const pageHeroData = heroSection ? extractHeroData(heroSection, language) : null;
    const pageBenefitsData = benefitsSection ? extractBenefitsData(benefitsSection, language) : [];
    const pageFeaturesData = featuresSection ? extractFeaturesData(featuresSection, language) : [];
    const pageProcessStepsData = processStepsSection ? extractProcessStepsData(processStepsSection, language) : [];
    const pageFaqData = faqSection ? extractFaqData(faqSection, language) : [];

   

    // Handle errors or loading states
    if (serviceError || sectionError) {
        console.error("Errors:", serviceError, sectionError)
        return <ProjectNotFound />
    }
    if (!serviceData || !sectionData) {
        return <SectionSkeleton variant="default" className="py-20"/>
    }

    return (
        <div className="min-h-screen  bg-wtheme-background" dir={direction}>
            {pageHeroData && <HeroSection heroData={pageHeroData} />}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <OverviewSection 
                    benefits={pageBenefitsData} 
                    overviewData={pageOverviewData}
                />
                <FeaturesSection features={pageFeaturesData} />
                <HowItWorksSection steps={pageProcessStepsData} />
            </div>

            <FAQSection faqs={pageFaqData} />
        </div>
    );
}