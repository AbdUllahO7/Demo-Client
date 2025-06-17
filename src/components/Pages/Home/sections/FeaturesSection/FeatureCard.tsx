"use client";

import { motion } from "framer-motion";
import React from "react";
import { useLanguage } from "@/contexts/language-context";
import { iconMap } from "@/utils/IconMap";

interface FeatureCardProps {
  feature: {
    title: string;
    excerpt: string;
    icon?: React.ReactNode | string; // Allow string or ReactNode
    color: string;
  };
  isInView: boolean;
}

export default function FeatureCard({ feature, isInView }: FeatureCardProps) {
  // Determine the icon to render
  const renderIcon = () => {
    if (React.isValidElement(feature.icon)) {
      return feature.icon; // If it's already a React element, use it
    }
    return iconMap[feature.icon as string] || null; // Map string to component, fallback to null
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
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
    </motion.div>
  );
}