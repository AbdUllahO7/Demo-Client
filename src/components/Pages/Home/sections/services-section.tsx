"use client"

import type React from "react"
import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart, Car, Code, Loader2 } from "lucide-react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { ButtonSectionLink } from "@/components/SectionLinks"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

// Define interfaces for type safety
interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  slug?: string;
  BackButton?: string;
  readMore?: string;
  date?: string;
  color?: string;
}

interface ServicesSectionProps {
  sectionId: string;
  websiteId?: string;
}

interface DynamicIconProps {
  name: string;
  className?: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  direction: string;
  serviceDetails: string;
}

// Component to render specific icons based on name
const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "" }) => {
  switch (name) {
    case 'ShoppingCart':
      return <ShoppingCart className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Code':
      return <Code className={className} />;
    default:
      return <Code className={className} />;
  }
};

export default function ServicesSection({ sectionId, websiteId }: ServicesSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const { content, isLoading: sectionLoading, error: sectionError, refetch, direction } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "news",
  });

  // Type the filter function properly
  const serviceFilter = (item: { title?: string }): item is { title: string } & typeof item => {
    return !!(item.title && item.title.trim() !== "");
  };

  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    filter: serviceFilter,
    fieldMappings: {
      id: "_id",
      image: "Background Image",
      title: "Title",
      description: "Description",
      BackButton: "Back Link Text",
      readMore: "service Details",
      date: "createdAt",
      color: () => "theme-gradient"
    }
  });

  const isLoading = sectionLoading || itemsLoading;
  const error = sectionError || itemsError;

  // Type guard for contentItems
  const typedContentItems = contentItems as ServiceItem[];

  return (
    <section 
      id="services" 
      className="w-full pb-10 pt-10 text-wtheme-text overflow-hidden relative"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-wtheme-background"></div>
      
      <div className="container px-4 md:px-6 relative">
        <div ref={ref} className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2 text-body text-primary tracking-wider uppercase"
          >
            {content.sectionLabel || "Services"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-4 text-wtheme-text"
          >
            {content.sectionTitle || "Our Services"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-wtheme-text/70 text-lg font-body"
          >
            {content.sectionDescription || "Discover our comprehensive range of services"}
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-wtheme-text/70 font-body">{content.loading || "Loading..."}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4"></p>
            <Button onClick={() => refetch?.()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-12">
            {typedContentItems.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index} 
                direction={direction || "ltr"}
                serviceDetails={content.readMore || "Learn More"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service, index, direction, serviceDetails }: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const isEven = index % 2 === 0;
  const isRTL = direction === "rtl";
  
  // Adjust flex direction based on both index and language direction
  const getFlexDirection = (): string => {
    if (isRTL) {
      return isEven ? "lg:flex-row-reverse" : "lg:flex-row";
    } else {
      return isEven ? "lg:flex-row" : "lg:flex-row-reverse";
    }
  };

  // Adjust animation direction based on both index and language direction
  const getAnimationDirection = (isLeft: boolean): number => {
    if (isRTL) {
      if (isEven) {
        return isLeft ? 50 : -50;
      } else {
        return isLeft ? -50 : 50;
      }
    } else {
      if (isEven) {
        return isLeft ? -50 : 50;
      } else {
        return isLeft ? 50 : -50;
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
      }}
      className="relative group"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-theme-gradient opacity-5 rounded-2xl blur-xl group-hover:opacity-10 transition-opacity duration-500"></div>
      
      <div className={`flex flex-col ${getFlexDirection()} gap-8 items-center relative`}>
        <motion.div
          initial={{ opacity: 0, x: getAnimationDirection(true) }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: getAnimationDirection(true) }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full lg:w-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-theme-lg aspect-video border border-wtheme-border/20">
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.title || "Service image"}
              fill
              priority={true}
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-accent/20 opacity-70"></div>
            
            {/* Overlay gradient using theme colors */}
            <div className="absolute inset-0 bg-theme-gradient-radial opacity-20 mix-blend-overlay"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: getAnimationDirection(false) }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: getAnimationDirection(false) }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shadow-primary/20 shadow-lg backdrop-blur-sm">
              <DynamicIcon name={service.icon || "Code"} className="h-8 w-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-wtheme-text">
              {service.title || "Service Title"}
            </h3>
          </div>

          <p className="text-wtheme-text/80 text-lg mb-6 font-body leading-relaxed">
            {service.description || "Service description"}
          </p>
          
          <ButtonSectionLink
            href={`/Pages/ServiceDetailsPage/${service.id}`}
            className="group border-2 border-primary hover:text-wtheme-hover shadow-sm transition-all duration-200"
          >
            {serviceDetails}
            <ArrowRight 
              className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} 
            />
          </ButtonSectionLink>
        </motion.div>
      </div>
    </motion.div>
  );
}