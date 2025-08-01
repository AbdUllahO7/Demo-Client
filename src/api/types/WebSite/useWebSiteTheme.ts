// src/api/types/hooks/website-theme.types.ts

export interface WebSiteTheme {
  _id: string;
  websiteId: string;
  themeName: string;
  colors: {
    light: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      success: string;
      warning: string;
      hover:string;
      error: string;
      info: string;
    };
    dark: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      hover:string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  fonts: {
    heading: {
      family: string;
      weight: string;
      size: string;
    };
    body: {
      family: string;
      weight: string;
      size: string;
    };
    accent: {
      family: string;
      weight: string;
      size: string;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  website?: {
    _id: string;
    name: string;
    description: string;
    phoneNumber: string;
    address: string;
    email: string;
    sector: string;
    createdAt: string;
    updatedAt: string;
    logo?: string;
    id: string;
  };
  id: string;
}




export interface WebSiteThemeResponse {
  success: boolean;
  message: string;
  data: WebSiteTheme;
}

export interface WebSiteThemesResponse {
  success: boolean;
  message: string;
  data: WebSiteTheme[];
}

export interface PaginatedWebSiteThemesResponse {
  success: boolean;
  message: string;
  data: {
    themes: WebSiteTheme[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

// Color preset types for easy theme creation
export interface ColorPreset {
  name: string;
  colors: WebSiteTheme['colors'];
}

export interface FontPreset {
  name: string;
  fonts: WebSiteTheme['fonts'];
}

// Common color palettes
export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'Corporate Blue',
    colors: {
      light: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#17a2b8',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#212529',
        textSecondary: '#6c757d',
        border: '#dee2e6',
        success: '#28a745',
        hover:'#000000',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
      },
      dark: {
        primary: '#0d6efd',
        secondary: '#adb5bd',
        accent: '#22b8cf',
        background: '#212529',
        surface: '#343a40',
        text: '#f8f9fa',
        textSecondary: '#ced4da',
        border: '#495057',
        hover:'#000000',
        success: '#2ecc71',
        warning: '#ffca2c',
        error: '#f03e3e',
        info: '#22b8cf',
      },
    },
  },
  {
    name: 'Dark Mode',
    colors: {
      light: {
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
        error: '#cf6679',
        info: '#17a2b8',
        hover:'#000000',
      },
      dark: {
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
        error: '#cf6679',
        info: '#22b8cf',
        hover:'#000000',
      },
    },
  },
  {
    name: 'Emerald',
    colors: {
      light: {
        primary: '#10b981',
        secondary: '#6b7280',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#111827',
        textSecondary: '#6c757d',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#17a2b8',
        hover:'#000000',
      },
      dark: {
        primary: '#34d399',
        secondary: '#9ca3af',
        accent: '#fbbf24',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        textSecondary: '#d1d5db',
        border: '#374151',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#22b8cf',
        hover:'#000000',
      },
    },
  },
  {
    name: 'Purple',
    colors: {
      light: {
        primary: '#8b5cf6',
        secondary: '#6b7280',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#111827',
        textSecondary: '#6c757d',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#17a2b8',
        hover:'#000000',
      },
      dark: {
        primary: '#a78bfa',
        secondary: '#9ca3af',
        accent: '#fbbf24',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        textSecondary: '#d1d5db',
        border: '#374151',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#22b8cf',
        hover:'#000000',
      },
    },
  },
];

// Common font combinations
export const FONT_PRESETS: FontPreset[] = [
  {
    name: 'Modern Sans',
    fonts: {
      heading: {
        family: 'Inter, sans-serif',
        weight: '700',
        size: '2rem',
      },
      body: {
        family: 'Inter, sans-serif',
        weight: '400',
        size: '1rem',
      },
      accent: {
        family: 'Inter, sans-serif',
        weight: '600',
        size: '1.125rem',
      },
    },
  },
  {
    name: 'Classic Serif',
    fonts: {
      heading: {
        family: 'Playfair Display, serif',
        weight: '700',
        size: '2rem',
      },
      body: {
        family: 'Source Serif Pro, serif',
        weight: '400',
        size: '1rem',
      },
      accent: {
        family: 'Playfair Display, serif',
        weight: '600',
        size: '1.125rem',
      },
    },
  },
  {
    name: 'Tech Stack',
    fonts: {
      heading: {
        family: 'Roboto, sans-serif',
        weight: '700',
        size: '2rem',
      },
      body: {
        family: 'Open Sans, sans-serif',
        weight: '400',
        size: '1rem',
      },
      accent: {
        family: 'Roboto Mono, monospace',
        weight: '500',
        size: '1rem',
      },
    },
  },
  {
    name: 'Editorial',
    fonts: {
      heading: {
        family: 'Merriweather, serif',
        weight: '700',
        size: '2rem',
      },
      body: {
        family: 'Lato, sans-serif',
        weight: '400',
        size: '1rem',
      },
      accent: {
        family: 'Merriweather, serif',
        weight: '600',
        size: '1.125rem',
      },
    },
  },
];

// Color labels for UI
export const COLOR_LABELS: Record<
  keyof WebSiteTheme['colors']['light'],
  { label: string; description: string; icon: string }
> = {
  primary: {
    label: 'Primary',
    description: 'Main brand color for buttons and highlights',
    icon: '🎨',
  },
  secondary: {
    label: 'Secondary',
    description: 'Secondary color for supporting elements',
    icon: '🖌️',
  },
  hover: {
    label: 'Hover',
    description: 'Hover color for supporting elements',
    icon: '🖌️',
  },
  accent: {
    label: 'Accent',
    description: 'Color for emphasis and interactive elements',
    icon: '✨',
  },
  background: {
    label: 'Background',
    description: 'Main background color of the website',
    icon: '🎴',
  },
  surface: {
    label: 'Surface',
    description: 'Background for cards and elevated elements',
    icon: '📃',
  },
  text: {
    label: 'Text',
    description: 'Primary text color',
    icon: '🔤',
  },
  textSecondary: {
    label: 'Secondary Text',
    description: 'Secondary text color for less emphasis',
    icon: '🔡',
  },
  border: {
    label: 'Border',
    description: 'Color for borders and dividers',
    icon: '🖼️',
  },
  success: {
    label: 'Success',
    description: 'Color for success states and messages',
    icon: '✅',
  },
  warning: {
    label: 'Warning',
    description: 'Color for warning states and alerts',
    icon: '⚠️',
  },
  error: {
    label: 'Error',
    description: 'Color for error states and messages',
    icon: '❌',
  },
  info: {
    label: 'Info',
    description: 'Color for informational messages',
    icon: 'ℹ️',
  },
};

// Font type labels for UI
export const FONT_TYPE_LABELS: Record<
  keyof WebSiteTheme['fonts'],
  { label: string; description: string; icon: string }
> = {
  heading: {
    label: 'Heading',
    description: 'Font for titles and headings',
    icon: '📰',
  },
  body: {
    label: 'Body',
    description: 'Font for main content text',
    icon: '📖',
  },
  accent: {
    label: 'Accent',
    description: 'Font for emphasis and special text',
    icon: '💬',
  },
};

// Theme validation helpers
export const validateColors = (colors: Partial<WebSiteTheme['colors']>): boolean => {
  const required = ['primary', 'background', 'text', 'surface', 'secondary'];
  return (
    colors.light &&
    colors.dark &&
    required.every((key) => colors.light![key as keyof typeof colors.light]) &&
    required.every((key) => colors.dark![key as keyof typeof colors.dark])
  );
};

export const validateFonts = (fonts: Partial<WebSiteTheme['fonts']>): boolean => {
  return !!(fonts.heading?.family && fonts.body?.family && fonts.accent?.family);
};

// Theme utility functions
export const getContrastColor = (color: string): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? '#000000' : '#ffffff';
};

export const generateThemeCSS = (theme: WebSiteTheme, mode: 'light' | 'dark' = 'light'): string => {
  const colors = theme.colors[mode];
  return `
    :root {
      --primary-color: ${colors.primary};
      --secondary-color: ${colors.secondary};
      --accent-color: ${colors.accent};
      --background-color: ${colors.background};
      --surface-color: ${colors.surface};
      --text-color: ${colors.text};
      --text-secondary-color: ${colors.textSecondary};
      --border-color: ${colors.border};
      --success-color: ${colors.success};
      --warning-color: ${colors.warning};
      --hover-color: ${colors.hover};
      --error-color: ${colors.error};
      --info-color: ${colors.info};
      --heading-font: ${theme.fonts.heading.family};
      --heading-weight: ${theme.fonts.heading.weight};
      --heading-size: ${theme.fonts.heading.size};
      
      --body-font: ${theme.fonts.body.family};
      --body-weight: ${theme.fonts.body.weight};
      --body-size: ${theme.fonts.body.size};
      
      --accent-font: ${theme.fonts.accent.family};
      --accent-weight: ${theme.fonts.accent.weight};
      --accent-size: ${theme.fonts.accent.size};
    }
  `;
};