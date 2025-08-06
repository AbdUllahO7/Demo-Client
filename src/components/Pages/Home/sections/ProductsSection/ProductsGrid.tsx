// src/components/Products/ProductsGrid.tsx
"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { ProductCard } from "./ProductCard";
import { FadeIn } from "@/utils/OptimizedAnimations";

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

interface ProductsGridProps {
  products: Product[];
  isInView: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  isRTL: boolean;
}

export function ProductsGrid({ products, isInView, containerRef, isRTL }: ProductsGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Animation variants for grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  return (
    <>
      {/* Centered Flex Container */}
      <div className="flex justify-center w-full">
        <FadeIn
          className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 w-full max-w-screen-2xl"
        >
          {products.map((product, index) => (
            <FadeIn
              key={product.id}
              className="flex justify-center w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] xl:w-[calc(20%-1.5rem)]"
            >
              <ProductCard 
                product={product} 
                index={index} 
                isInView={isInView} 
                isRTL={isRTL}
                onImageClick={openImageModal}
                className="w-full max-w-sm h-full"
              />
            </FadeIn>
          ))}
        </FadeIn>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <FadeIn
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 z-10 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </button>
            <img
              src={selectedImage}
              alt="Product detail"
              className="w-full h-full object-contain rounded-lg"
            />
          </FadeIn>
        </div>
      )}
    </>
  );
}