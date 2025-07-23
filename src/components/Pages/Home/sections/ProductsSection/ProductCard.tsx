// src/components/Products/ProductCard.tsx
"use client"

import React from "react"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

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
}

export function ProductCard({ product, index, isInView, isRTL, onImageClick }: ProductCardProps) {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/Pages/ProductDetailPage/${product.id}`);
  };

  // Check if price should be displayed (not empty, not "0", and not 0)
  const shouldShowPrice = product.price && 
    product.price !== "0" && 
    product.price !== "0.00" && 
    parseFloat(product.price) !== 0;

  return (
    <div
      className="group relative  backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onImageClick(product.image)}
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            className="bg-white/90 backdrop-blur-sm  p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onImageClick(product.image);
            }}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <Badge 
              variant="secondary" 
              className="bg-wtheme-background backdrop-blur-sm text-gray-800 border-0 text-xs font-medium"
            >
              {product.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3 bg-none">
        {/* Title */}
        <h3 className="font-heading font-semibold text-lg leading-tight text-wtheme-text group-hover:text-primary transition-colors line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-wtheme-text line-clamp-2 leading-relaxed">
          {product.excerpt}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          {shouldShowPrice && (
            <span className="text-xl font-bold text-primary">
              {product.price}
            </span>
          )}
        </div>

        {/* Date */}
        {product.date && (
          <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
            {new Date(product.date).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}