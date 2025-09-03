import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Keep your existing next-themes colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // UPDATED: Website theme colors now map to primary, secondary, accent
        primary: {
          DEFAULT: "var(--website-theme-primary)", 
          50: "var(--website-theme-primary-50)",
          100: "var(--website-theme-primary-100)",
          200: "var(--website-theme-primary-200)",
          300: "var(--website-theme-primary-300)",
          400: "var(--website-theme-primary-400)",
          500: "var(--website-theme-primary)",
          600: "var(--website-theme-primary-600)",
          700: "var(--website-theme-primary-700)",
          800: "var(--website-theme-primary-800)",
          900: "var(--website-theme-primary-900)",
          foreground: "var(--website-theme-background)", 
        },
        secondary: {
          DEFAULT: "var(--website-theme-secondary)", // Second color from theme
          foreground: "var(--website-theme-background)",
        },
        accent: {
          DEFAULT: "var(--website-theme-accent)", // Third color from theme
          foreground: "var(--website-theme-background)",
        },
        
        // Keep destructive and muted with fallbacks
        destructive: {
          DEFAULT: "var(--website-theme-error, hsl(var(--destructive)))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Keep your iDIGITEK brand colors for admin/fixed elements
        digitek: {
          pink: "#E91E63",
          purple: "#6A1B9A",
          orange: "#FF6D00",
        },
        
        // Additional website theme colors (for specific use cases)
        wtheme: {
          background: "var(--website-theme-background)",
          text: "var(--website-theme-text)",
          border: "var(--website-theme-border)",
          hover: "var(--website-theme-hover)",
          success: "var(--website-theme-success)",
          warning: "var(--website-theme-warning)",
        },
      },
      fontFamily: {
        // Dynamic website theme fonts
        'heading': "var(--website-theme-font-heading)", // Now just 'heading'
        'body': "var(--website-theme-font-body)", // Now just 'body'  
        'accent': "var(--website-theme-font-accent)", // Now just 'accent'
      },
      fontSize: {
        'heading': "var(--website-theme-font-heading-size)",
        'body': "var(--website-theme-font-body-size)",
        'accent': "var(--website-theme-font-accent-size)",
      },
      fontWeight: {
        'heading': "var(--website-theme-font-heading-weight)",
        'body': "var(--website-theme-font-body-weight)",
        'accent': "var(--website-theme-font-accent-weight)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "theme-pulse": {
          "0%, 100%": { 
            backgroundColor: "var(--website-theme-primary)",
            opacity: "1"
          },
          "50%": { 
            backgroundColor: "var(--website-theme-accent)",
            opacity: "0.8"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "theme-pulse": "theme-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        // Keep your existing gradients
        "digitek-gradient": "linear-gradient(90deg, #E91E63 0%, #6A1B9A 50%, #FF6D00 100%)",
        
        // Website theme gradients using primary, secondary, accent
        "theme-gradient": "linear-gradient(90deg, var(--website-theme-primary) 0%, var(--website-theme-accent) 50%, var(--website-theme-secondary) 100%)",
        "theme-gradient-radial": "radial-gradient(circle, var(--website-theme-primary) 0%, var(--website-theme-accent) 100%)",
        "primary-gradient": "linear-gradient(135deg, var(--website-theme-primary) 0%, var(--website-theme-secondary) 100%)",
      },
      boxShadow: {
        'theme': `0 4px 14px 0 var(--website-theme-primary)`,
        'theme-lg': `0 10px 25px -3px var(--website-theme-primary), 0 4px 6px -2px var(--website-theme-primary)`,
        'primary': `0 4px 14px 0 var(--website-theme-primary)`,
        'secondary': `0 4px 14px 0 var(--website-theme-secondary)`,
        'accent': `0 4px 14px 0 var(--website-theme-accent)`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config