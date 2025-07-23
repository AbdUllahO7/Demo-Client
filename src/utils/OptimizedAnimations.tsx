import { useOptimizedIntersection } from '@/hooks/useIntersectionObserver';
import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { JSX } from 'react';

interface OptimizedFadeInProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  triggerOnce?: boolean
  threshold?: number
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
}



export const OptimizedFadeIn = forwardRef<HTMLElement, OptimizedFadeInProps>(({
  children,
  className = '',
  duration = 600,
  delay = 0,
  direction = 'up',
  distance = 20,
  triggerOnce = true,
  threshold = 0.1,
  style = {},
  as: Component = 'div'
}, forwardedRef) => {
  const { ref, isInView } = useOptimizedIntersection({
    threshold,
    triggerOnce,
    rootMargin: '50px'
  })
  
  const [animationState, setAnimationState] = useState<'enter' | 'enter-active' | 'enter-done'>('enter')
  const elementRef = useRef<HTMLElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout>(null)


  useEffect(() => {
    if (isInView && animationState === 'enter') {
      const timer = setTimeout(() => {
        setAnimationState('enter-active')
        
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationState('enter-done')
        }, duration + delay)
        
      }, 10) 
      
      return () => clearTimeout(timer)
    }
  }, [isInView, animationState, duration, delay])

  // تنظيف التايمرز
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`
      case 'down':
        return `translateY(-${distance}px)`
      case 'left':
        return `translateX(${distance}px)`
      case 'right':
        return `translateX(-${distance}px)`
      case 'none':
      default:
        return 'none'
    }
  }

  // دمج الـ refs
  const combinedRef = (node: HTMLElement | null) => {
    if (node) {
      ref.current = node
      elementRef.current = node
      
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else {
          forwardedRef.current = node
        }
      }
    }
  }

  const animationStyle: React.CSSProperties = {
    '--duration': `${duration}ms`,
    '--delay': `${delay}ms`,
    '--initial-transform': getInitialTransform(),
    ...style
  } as React.CSSProperties

  const combinedClassName = [
    'fade-container',
    `fade-${animationState}`,
    className
  ].filter(Boolean).join(' ')

  return React.createElement(
    Component,
    {
      ref: combinedRef,
      className: combinedClassName,
      style: animationStyle,
      'data-animation-state': animationState
    },
    children
  )
})

OptimizedFadeIn.displayName = 'OptimizedFadeIn'


export const FadeIn: React.FC<OptimizedFadeInProps> = (props) => (
  <OptimizedFadeIn {...props} />
)
