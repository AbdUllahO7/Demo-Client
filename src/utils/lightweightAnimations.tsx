// src/utils/lightweightAnimations.tsx - STEP 5: Replace Framer Motion
"use client";

import { useEffect, useRef, useState } from 'react';

// 🚀 STEP 5: Lightweight alternative to framer-motion (saves 100KB+)

interface FadeInProps {
  children?: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// 🚀 Lightweight FadeIn component (replaces motion.div)
export function FadeIn({ children, delay = 0, duration = 600, className = "" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

// 🚀 Lightweight SlideIn component
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 600, 
  className = "" 
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    
    switch (direction) {
      case 'left': return 'translateX(-30px)';
      case 'right': return 'translateX(30px)';
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      default: return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

// 🚀 Lightweight Stagger component (for list animations)
interface StaggerProps {
  children: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({ children, delay = 0, staggerDelay = 100, className = "" }: StaggerProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate items one by one
          children.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, index]);
            }, delay + (index * staggerDelay));
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [children, delay, staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: visibleItems.includes(index) ? 1 : 0,
            transform: visibleItems.includes(index) 
              ? 'translateY(0)' 
              : 'translateY(20px)',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// 🚀 Lightweight Scale component (for hover effects)
interface ScaleProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function Scale({ children, scale = 1.05, duration = 200, className = "" }: ScaleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`transition-transform ${className}`}
      style={{
        transform: isHovered ? `scale(${scale})` : 'scale(1)',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

// 🚀 CSS-only animation classes for even better performance
export const animationClasses = {
  fadeIn: `
    opacity-0 translate-y-4 transition-all duration-700 ease-out
    [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0
  `,
  slideInLeft: `
    opacity-0 -translate-x-4 transition-all duration-500 ease-out
    [&.animate-in]:opacity-100 [&.animate-in]:translate-x-0
  `,
  slideInRight: `
    opacity-0 translate-x-4 transition-all duration-500 ease-out
    [&.animate-in]:opacity-100 [&.animate-in]:translate-x-0
  `,
  scaleIn: `
    opacity-0 scale-95 transition-all duration-400 ease-out
    [&.animate-in]:opacity-100 [&.animate-in]:scale-100
  `,
};

// 🚀 Hook for triggering CSS animations
export function useInViewAnimation(className: string = 'animate-in') {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          entry.target.classList.add(className);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [className, hasAnimated]);

  return ref;
}