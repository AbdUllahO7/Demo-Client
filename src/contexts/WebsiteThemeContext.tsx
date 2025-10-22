// src/components/WebsiteThemeProvider.tsx
"use client";

import { WebSiteTheme } from '@/api/types/WebSite/useWebSiteTheme';
import { useWebSiteThemes } from '@/lib/webSite/use-Theme';
import { useWebSite } from '@/lib/webSite/use-WebSite'; // Adjust path as needed
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

// Helper function to safely access localStorage
function getStoredWebsiteId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('websiteId');
  }
  return null;
}

function setStoredWebsiteId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('websiteId', id);
  }
}

// Fixed: This function should ONLY return what's actually in localStorage or default to 'dark'
function getStoredColorMode(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('colorMode') as 'light' | 'dark' | null;
    // If nothing is stored, set 'dark' as default AND store it
    if (!stored) {
      localStorage.setItem('colorMode', 'dark');
      return 'dark';
    }
    return stored;
  }
  return 'dark';
}

function setStoredColorMode(mode: 'light' | 'dark'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('colorMode', mode);
  }
}

export function WebsiteThemeProvider({ children }: WebsiteThemeProviderProps) {
  const { useGetWebsitesByUserId } = useWebSite();
  const { data: websitesResponse, isLoading: websitesLoading, error: websitesError } =
    useGetWebsitesByUserId();
  const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
    setIsMounted(true);
    resetToDefaultTheme(colorMode);
  }, []);
  
  const websites = websitesResponse?.data || [];
  

   const [currentWebsiteId, setCurrentWebsiteId] = useState<string | null>(() => {
    // This function runs ONCE during initialization, before first render
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('websiteId');
      if (stored) return stored;
    }
    return null;
  });
 useEffect(() => {
    const storedWebsiteId = getStoredWebsiteId();
    const firstWebsiteId = websites.length > 0 ? websites[0]._id : null;

    // Only update if we don't have a websiteId yet
    if (!currentWebsiteId && firstWebsiteId) {
      setCurrentWebsiteId(firstWebsiteId);
      setStoredWebsiteId(firstWebsiteId);
    } else if (currentWebsiteId && !storedWebsiteId) {
      setStoredWebsiteId(currentWebsiteId);
    }

    setIsInitialized(true);
  }, [websites, currentWebsiteId]);
  // Initialize states - IMPORTANT: Don't set a default here, let useEffect handle it
  const [isInitialized, setIsInitialized] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    // Initialize with the stored value or default to 'dark' on first render
    if (typeof window !== 'undefined') {
      return getStoredColorMode();
    }
    return 'dark';
  });

  // Initialize websiteId ONLY - colorMode is already set correctly
  useEffect(() => {
    const storedWebsiteId = getStoredWebsiteId();
    const websiteId = websites.length > 0 ? websites[0]._id : null;

    if (storedWebsiteId) {
      setCurrentWebsiteId(storedWebsiteId);
    } else if (websiteId) {
      setCurrentWebsiteId(websiteId);
      setStoredWebsiteId(websiteId);
    }

    setIsInitialized(true);
  }, [websites]);

  // Sync localStorage when colorMode changes
  useEffect(() => {
    if (currentWebsiteId) {
      setStoredWebsiteId(currentWebsiteId);
    }
    setStoredColorMode(colorMode);
  }, [currentWebsiteId, colorMode]);

  const { useGetActiveTheme } = useWebSiteThemes();

  // Fetch active theme
  interface ThemeResponse {
    data: WebSiteTheme;
  }
  const { data: themeData, isLoading, error, refetch } = useGetActiveTheme(currentWebsiteId || '', {
    enabled: !!currentWebsiteId && isInitialized,
    retry: 1,
    onError: (err: any) => {
      console.error('❌ Theme fetch error:', err.message, { websiteId: currentWebsiteId });
    },
  });

  const [activeTheme, setActiveTheme] = useState<WebSiteTheme | null>(null);

  // Extract theme from API response
  useEffect(() => {
    if (themeData?.data) {
      setActiveTheme(themeData.data);
    } else if (!currentWebsiteId) {
      setActiveTheme(null);
    }
  }, [themeData, currentWebsiteId, isLoading, isInitialized]);

  // Apply theme to CSS
  useEffect(() => {
    if (!isInitialized) return;

    if (activeTheme) {
      applyThemeToCSS(activeTheme, colorMode);
    } else {
      resetToDefaultTheme(colorMode);
    }
  }, [activeTheme, isInitialized, colorMode]);

  const refreshTheme = () => {
    if (currentWebsiteId) {
      refetch();
    }
  };

  const handleSetWebsiteId = (id: string) => {
    setCurrentWebsiteId(id);
  };

  const handleSetColorMode = (mode: 'light' | 'dark') => {
    setColorMode(mode);
    // Immediately sync to localStorage
    setStoredColorMode(mode);
  };

  const contextValue: WebsiteThemeContextType = {
    activeTheme,
    isLoading: isLoading || websitesLoading || !isInitialized,
    error: error?.message || websitesError?.message || null,
    refreshTheme,
    setWebsiteId: handleSetWebsiteId,
    currentWebsiteId,
    colorMode,
    setColorMode: handleSetColorMode,
  };
 useEffect(() => {
    if (themeData?.data && isMounted) {
      applyThemeToCSS(themeData.data, colorMode);
    }
  }, [themeData, colorMode, isMounted]);
   if (!isInitialized || (isLoading && !activeTheme)) {
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

  // Update theme class - ensure dark class is applied by default
  document.body.className = document.body.className.replace(/website-theme-\w+/g, '');
  document.body.classList.add(`website-theme-${theme._id}`);
  document.body.classList.toggle('dark', mode === 'dark');
}

// Function to reset to default theme - updated with better dark mode defaults
function resetToDefaultTheme(mode: 'light' | 'dark') {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  
  // Updated default colors - using the Dark Mode preset from your COLOR_PRESETS
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
    // Dark mode defaults using the "Dark Mode" preset
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

  // Apply default fonts (Modern Sans preset)
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

  // Remove theme class and apply dark mode by default
  document.body.className = document.body.className.replace(/website-theme-\w+/g, '');
  document.body.classList.toggle('dark', mode === 'dark');
  
  // Add a default dark class to body if no specific theme is active
  if (mode === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
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