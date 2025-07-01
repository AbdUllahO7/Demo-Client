// src/components/Products/ProductCard.tsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils" // Adjust import path as needed

interface Product {
  id: string;
  image: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  price: string;
  color: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
  isInView: boolean;
  isRTL: boolean;
  onImageClick: (imageUrl: string) => void;
  className?: string; // Added className prop
}

export function ProductCard({ 
  product, 
  index, 
  isInView, 
  isRTL, 
  onImageClick,
  className 
}: ProductCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700",
        "flex flex-col h-full", // Key: flex flex-col h-full for equal heights
        className
      )}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
          onClick={() => onImageClick(product.image)}
        />
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 text-xs font-medium bg-primary/90 text-white rounded-full backdrop-blur-sm">
              {product.category}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section - This will expand to fill remaining space */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.title}
        </h3>
        
        {/* Description - This will expand to fill available space */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
          {product.excerpt}
        </p>
        
        {/* Footer Section - This stays at the bottom */}
        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-primary">
              {product.price}
            </span>
            {product.date && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(product.date).toLocaleDateString()}
              </span>
            )}
          </div>
          
          {/* Action Button */}
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}