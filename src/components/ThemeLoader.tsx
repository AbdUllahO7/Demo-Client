// src/components/theme-loader.tsx
"use client";

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeLoaderProps {
  children: ReactNode;
}

export function ThemeLoader({ children }: ThemeLoaderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const colorMode = (localStorage.getItem('colorMode') as 'light' | 'dark') || 'dark';
      document.body.classList.toggle('dark', colorMode === 'dark');
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}