"use client";

import React from "react";
import { iconMap } from "@/utils/IconMap";
import { FadeIn } from "@/utils/OptimizedAnimations";

interface FeatureCardProps {
  feature: {
    title: string;
    excerpt: string;
    icon?: React.ReactNode | string; 
    color?: string;
  };
  isInView: boolean;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  
  const renderIcon = () => {
    if (React.isValidElement(feature.icon)) {
      return feature.icon; 
    }
    return iconMap[feature.icon as string] || null; 
  };

  return (
    <FadeIn

      className="group flex items-start gap-4 rounded-xl p-1 transition-all duration-300 hover:bg-primary/5 "
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-primary  shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        {renderIcon()}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-heading  text-wtheme-text group-hover:text-wtheme-hover transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="font-body text-wtheme-text">{feature.excerpt}</p>
      </div>
    </FadeIn>
  );
}