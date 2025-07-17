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

function getStoredColorMode(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('colorMode') as 'light' | 'dark') || 'light';
  }
  return 'light';
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

  const websites = websitesResponse?.data || [];

  // Initialize states
  const [currentWebsiteId, setCurrentWebsiteId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(getStoredColorMode());

  // Initialize websiteId and colorMode
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

  // Sync localStorage
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

  // Update theme class
  document.body.className = document.body.className.replace(/website-theme-\w+/g, '');
  document.body.classList.add(`website-theme-${theme._id}`);
  document.body.classList.toggle('dark', mode === 'dark');

}

// Function to reset to default theme
function resetToDefaultTheme(mode: 'light' | 'dark') {
  if (typeof window === 'undefined') return;


  const root = document.documentElement;
  const defaultColors = mode === 'light' ? {
    primary: '#E91E63',
    secondary: '#6A1B9A',
    accent: '#FF6D00',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#000000',
    textSecondary: '#6c757d',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    hover: '#000000',
    error: '#ef4444',
    info: '#17a2b8',
  } : {
    primary: '#F06292',
    secondary: '#BA68C8',
    accent: '#FF8A65',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#adb5bd',
    border: '#333333',
    success: '#34d399',
    warning: '#fbbf24',
    hover: '#000000',
    error: '#f87171',
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

  // Remove theme class
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

// Component to show current theme info (for debugging)
export function WebsiteThemeDebugger() {
  const { activeTheme, isLoading, error, currentWebsiteId, colorMode } = useWebsiteTheme();

  if (!currentWebsiteId) {
    return (
      <div className="fixed bottom-4 right-4 p-2 bg-yellow-100 rounded text-xs">
        No website selected
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 p-2 bg-gray-100 rounded text-xs">
        Loading website theme...
      </div>
    );
  }
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 p-2 bg-red-100 rounded text-xs">
        Website theme error: {error}
      </div>
    );
  }
  if (!activeTheme) {
    return (
      <div className="fixed bottom-4 right-4 p-2 bg-yellow-100 rounded text-xs">
        No active website theme
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-white shadow-lg rounded-lg text-xs max-w-xs">
      <h4 className="font-semibold mb-1">Active Website Theme</h4>
      <p>
        <strong>Name:</strong> {activeTheme.themeName}
      </p>
      <p>
        <strong>Website:</strong> {currentWebsiteId}
      </p>
      <p>
        <strong>Mode:</strong> {colorMode}
      </p>
      <p>
        <strong>Primary:</strong>{' '}
        <span
          className="inline-block w-3 h-3 rounded ml-1"
          style={{ backgroundColor: activeTheme.colors[colorMode].primary }}
        ></span>{' '}
        {activeTheme.colors[colorMode].primary}
      </p>
      <p>
        <strong>Font:</strong> {activeTheme.fonts.heading.family.split(',')[0]}
      </p>
    </div>
  );
}