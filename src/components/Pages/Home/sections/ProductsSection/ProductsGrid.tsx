// src/components/Products/ProductsGrid.tsx
"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { ProductCard } from "./ProductCard";

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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="w-full"
          >
            <ProductCard 
              product={product} 
              index={index} 
              isInView={isInView} 
              isRTL={isRTL}
              onImageClick={openImageModal}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <motion.div
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
          </motion.div>
        </motion.div>
      )}
    </>
  );
}