// src/components/WebsiteThemeProvider.tsx
"use client";

import { WebSiteTheme } from '@/api/types/WebSite/useWebSiteTheme';
import { useWebSiteThemes } from '@/lib/webSite/use-Theme';
import { useWebSite } from '@/lib/webSite/use-WebSite';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebsiteThemeContextType {
  activeTheme: WebSiteTheme | null;
  isLoading: boolean;
  error: string | null;
  refreshTheme: () => void;
  setWebsiteId: (id: string) => void;
  currentWebsiteId: string | null;
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
}

const WebsiteThemeContext = createContext<WebsiteThemeContextType | undefined>(undefined);

interface WebsiteThemeProviderProps {
  children: React.ReactNode;
}

export function WebsiteThemeProvider({ children }: WebsiteThemeProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Initialize states as null - will be set in useEffect
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');
  const webSiteIdLocal = '683b2432d6fa6b23f0af80ae'; // Temporary placeholder
  const [currentWebsiteId, setCurrentWebsiteId] = useState<string | null>(webSiteIdLocal);

  // Fetch websites
  const { useGetWebsitesByUserId } = useWebSite();
  const { data: websitesResponse, isLoading: websitesLoading } = useGetWebsitesByUserId();
  const websites = websitesResponse?.data || [];

  // ✅ CRITICAL FIX: Read from localStorage AFTER component mounts
  useEffect(() => {
    setIsMounted(true);
    
    // Read from localStorage only on client-side after mount
    const storedColorMode = localStorage.getItem('colorMode') as 'light' | 'dark' | null;
    if (storedColorMode) {
      setColorMode(storedColorMode);
    } else {
      localStorage.setItem('colorMode', 'dark');
    }

    const storedWebsiteId = localStorage.getItem('websiteId');
    console.log('📦 Read from localStorage on mount:', storedWebsiteId);
    
    if (storedWebsiteId) {
      setCurrentWebsiteId(storedWebsiteId);
    }
  }, []);

  // ✅ Initialize websiteId after websites are loaded
  useEffect(() => {
    if (!isMounted || websitesLoading) return;

    const storedWebsiteId = localStorage.getItem('websiteId');
    const firstWebsiteId = websites.length > 0 ? websites[0]._id : null;

    console.log('🔍 Initialization check:', {
      storedWebsiteId,
      firstWebsiteId,
      currentWebsiteId,
      websitesCount: websites.length
    });

    // Priority: current state > stored ID > first website ID
    if (currentWebsiteId) {
      // Already have a websiteId, verify it's valid
      const isValid = websites.some(w => w._id === currentWebsiteId);
      if (isValid) {
        localStorage.setItem('websiteId', currentWebsiteId);
        setIsInitialized(true);
        return;
      }
    }

    if (storedWebsiteId && websites.some(w => w._id === storedWebsiteId)) {
      // Stored ID is valid
      console.log('✅ Using stored websiteId:', storedWebsiteId);
      setCurrentWebsiteId(storedWebsiteId);
    } else if (firstWebsiteId) {
      // No valid stored ID, use first website
      console.log('✅ Using first website:', firstWebsiteId);
      setCurrentWebsiteId(firstWebsiteId);
      localStorage.setItem('websiteId', firstWebsiteId);
    }

    setIsInitialized(true);
  }, [websites, websitesLoading, isMounted, currentWebsiteId]);

  // Fetch active theme - only when websiteId is available
  const { useGetActiveTheme } = useWebSiteThemes();
  const { 
    data: themeData, 
    isLoading: themeLoading, 
    error, 
    refetch 
  } = useGetActiveTheme(
    currentWebsiteId || '', 
    {
      enabled: !!currentWebsiteId && isInitialized && isMounted,
      retry: 2,
    }
  );

  console.log('🎨 Theme Debug:', { 
    currentWebsiteId, 
    isInitialized, 
    isMounted,
    themeLoading,
    hasThemeData: !!themeData?.data,
    queryEnabled: !!currentWebsiteId && isInitialized && isMounted
  });

  // ✅ Apply theme when data changes
  useEffect(() => {
    if (!isMounted || !isInitialized) {
      console.log('⏳ Waiting for initialization...');
      return;
    }

    if (themeData?.data) {
      console.log('✅ Applying theme:', themeData.data._id);
      applyThemeToCSS(themeData.data, colorMode);
    } else if (!themeLoading) {
      console.log('⚠️ No theme data, using defaults');
      resetToDefaultTheme(colorMode);
    }
  }, [themeData, colorMode, isMounted, isInitialized, themeLoading]);

  // Sync color mode to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('colorMode', colorMode);
    }
  }, [colorMode, isMounted]);

  // Sync websiteId to localStorage
  useEffect(() => {
    if (currentWebsiteId && isMounted) {
      console.log('💾 Saving to localStorage:', currentWebsiteId);
      localStorage.setItem('websiteId', currentWebsiteId);
    }
  }, [currentWebsiteId, isMounted]);

  const refreshTheme = () => {
    if (currentWebsiteId) {
      console.log('🔄 Refreshing theme for:', currentWebsiteId);
      refetch();
    }
  };

  const handleSetWebsiteId = (id: string) => {
    console.log('🔧 Setting new websiteId:', id);
    setCurrentWebsiteId(id);
    localStorage.setItem('websiteId', id);
  };

  const handleSetColorMode = (mode: 'light' | 'dark') => {
    console.log('🌓 Setting color mode:', mode);
    setColorMode(mode);
    localStorage.setItem('colorMode', mode);
  };

  const contextValue: WebsiteThemeContextType = {
    activeTheme: themeData?.data || null,
    isLoading: websitesLoading || themeLoading || !isInitialized || !isMounted,
    error: error?.message || null,
    refreshTheme,
    setWebsiteId: handleSetWebsiteId,
    currentWebsiteId,
    colorMode,
    setColorMode: handleSetColorMode,
  };

  // Show loading state only on initial load
  if (!isMounted || !isInitialized) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading theme...
        </div>
      </div>
    );
  }

  return (
    <WebsiteThemeContext.Provider value={contextValue}>
      {children}
    </WebsiteThemeContext.Provider>
  );
}

// Hook to use website theme context
export function useWebsiteTheme() {
  const context = useContext(WebsiteThemeContext);
  if (context === undefined) {
    throw new Error('useWebsiteTheme must be used within a WebsiteThemeProvider');
  }
  return context;
}

// Function to apply theme to CSS custom properties
function applyThemeToCSS(theme: WebSiteTheme, mode: 'light' | 'dark') {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const colors = theme.colors[mode];

  console.log('🎨 Applying CSS variables for mode:', mode);

  // Apply color variables
  root.style.setProperty('--website-theme-primary', colors.primary);
  root.style.setProperty('--website-theme-secondary', colors.secondary);
  root.style.setProperty('--website-theme-accent', colors.accent);
  root.style.setProperty('--website-theme-background', colors.background);
  root.style.setProperty('--website-theme-surface', colors.surface);
  root.style.setProperty('--website-theme-text', colors.text);
  root.style.setProperty('--website-theme-text-secondary', colors.textSecondary);
  root.style.setProperty('--website-theme-border', colors.border);
  root.style.setProperty('--website-theme-success', colors.success);
  root.style.setProperty('--website-theme-warning', colors.warning);
  root.style.setProperty('--website-theme-hover', colors.hover);
  root.style.setProperty('--website-theme-error', colors.error);
  root.style.setProperty('--website-theme-info', colors.info);

  // Apply font variables
  root.style.setProperty('--website-theme-font-heading', theme.fonts.heading.family);
  root.style.setProperty('--website-theme-font-heading-weight', theme.fonts.heading.weight);
  root.style.setProperty('--website-theme-font-heading-size', theme.fonts.heading.size);
  root.style.setProperty('--website-theme-font-body', theme.fonts.body.family);
  root.style.setProperty('--website-theme-font-body-weight', theme.fonts.body.weight);
  root.style.setProperty('--website-theme-font-body-size', theme.fonts.body.size);
  root.style.setProperty('--website-theme-font-accent', theme.fonts.accent.family);
  root.style.setProperty('--website-theme-font-accent-weight', theme.fonts.accent.weight);
  root.style.setProperty('--website-theme-font-accent-size', theme.fonts.accent.size);

  // Generate color variants
  const primaryRGB = hexToRGB(colors.primary);
  if (primaryRGB) {
    root.style.setProperty('--website-theme-primary-50', `rgb(${lighten(primaryRGB, 0.9)})`);
    root.style.setProperty('--website-theme-primary-100', `rgb(${lighten(primaryRGB, 0.8)})`);
    root.style.setProperty('--website-theme-primary-200', `rgb(${lighten(primaryRGB, 0.6)})`);
    root.style.setProperty('--website-theme-primary-300', `rgb(${lighten(primaryRGB, 0.4)})`);
    root.style.setProperty('--website-theme-primary-400', `rgb(${lighten(primaryRGB, 0.2)})`);
    root.style.setProperty('--website-theme-primary-500', colors.primary);
    root.style.setProperty('--website-theme-primary-600', `rgb(${darken(primaryRGB, 0.1)})`);
    root.style.setProperty('--website-theme-primary-700', `rgb(${darken(primaryRGB, 0.2)})`);
    root.style.setProperty('--website-theme-primary-800', `rgb(${darken(primaryRGB, 0.3)})`);
    root.style.setProperty('--website-theme-primary-900', `rgb(${darken(primaryRGB, 0.4)})`);
  }

  // Update theme class
  document.body.className = document.body.className.replace(/website-theme-\w+/g, '');
  document.body.classList.add(`website-theme-${theme._id}`);
  document.body.classList.toggle('dark', mode === 'dark');
  
  console.log('✅ Theme applied successfully');
}

// Function to reset to default theme
function resetToDefaultTheme(mode: 'light' | 'dark') {
  if (typeof window === 'undefined') return;

  console.log('🔄 Resetting to default theme, mode:', mode);

  const root = document.documentElement;
  
  const defaultColors = mode === 'light' ? {
    primary: '#bb86fc',
    secondary: '#03dac6',
    accent: '#cf6679',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#121212',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    success: '#03dac6',
    warning: '#ffb74d',
    hover: '#000000',
    error: '#cf6679',
    info: '#17a2b8',
  } : {
    primary: '#bb86fc',
    secondary: '#03dac6',
    accent: '#cf6679',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#adb5bd',
    border: '#333333',
    success: '#03dac6',
    warning: '#ffb74d',
    hover: '#000000',
    error: '#cf6679',
    info: '#22b8cf',
  };

  // Apply default colors
  Object.entries(defaultColors).forEach(([key, value]) => {
    root.style.setProperty(`--website-theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
  });

  // Apply default fonts
  root.style.setProperty('--website-theme-font-heading', 'Inter, sans-serif');
  root.style.setProperty('--website-theme-font-heading-weight', '700');
  root.style.setProperty('--website-theme-font-heading-size', '2rem');
  root.style.setProperty('--website-theme-font-body', 'Inter, sans-serif');
  root.style.setProperty('--website-theme-font-body-weight', '400');
  root.style.setProperty('--website-theme-font-body-size', '1rem');
  root.style.setProperty('--website-theme-font-accent', 'Inter, sans-serif');
  root.style.setProperty('--website-theme-font-accent-weight', '600');
  root.style.setProperty('--website-theme-font-accent-size', '1.125rem');

  // Generate color variants
  const primaryRGB = hexToRGB(defaultColors.primary);
  if (primaryRGB) {
    root.style.setProperty('--website-theme-primary-50', `rgb(${lighten(primaryRGB, 0.9)})`);
    root.style.setProperty('--website-theme-primary-100', `rgb(${lighten(primaryRGB, 0.8)})`);
    root.style.setProperty('--website-theme-primary-200', `rgb(${lighten(primaryRGB, 0.6)})`);
    root.style.setProperty('--website-theme-primary-300', `rgb(${lighten(primaryRGB, 0.4)})`);
    root.style.setProperty('--website-theme-primary-400', `rgb(${lighten(primaryRGB, 0.2)})`);
    root.style.setProperty('--website-theme-primary-500', defaultColors.primary);
    root.style.setProperty('--website-theme-primary-600', `rgb(${darken(primaryRGB, 0.1)})`);
    root.style.setProperty('--website-theme-primary-700', `rgb(${darken(primaryRGB, 0.2)})`);
    root.style.setProperty('--website-theme-primary-800', `rgb(${darken(primaryRGB, 0.3)})`);
    root.style.setProperty('--website-theme-primary-900', `rgb(${darken(primaryRGB, 0.4)})`);
  }

  // Remove theme class and apply dark mode
  document.body.className = document.body.className.replace(/website-theme-\w+/g, '');
  document.body.classList.toggle('dark', mode === 'dark');
}

// Utility functions for color manipulation
function hexToRGB(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}

function lighten(rgb: [number, number, number], factor: number): string {
  return rgb.map((c) => Math.round(c + (255 - c) * factor)).join(', ');
}

function darken(rgb: [number, number, number], factor: number): string {
  return rgb.map((c) => Math.round(c * (1 - factor))).join(', ');
}