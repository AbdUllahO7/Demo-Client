// app/layout.tsx - FIXED: Add preconnect for Vercel scripts
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import QueryProvider from "@/providers/QueryProvider"
import RootLayoutClient from "./RootLayoutClient"
import { WebsiteThemeProvider } from "@/contexts/WebsiteThemeContext"
import CookieConsentProvider from "@/providers/cookie-consent-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"

// 🚀 OPTIMIZATION: Font optimization with preload and display swap
const inter = Inter({ 
  subsets: ["latin"],
  preload: true,
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "Idigitek Solutions - POS, Drive-Through & Software Development",
  description: "Innovative technology solutions for POS systems, drive-through operations, and custom software development.",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* 🚀 FIXED: Preconnect to Vercel scripts (saves 180ms) */}
        <link rel="preconnect" href="https://vercel-scripts.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        
        {/* 🚀 OPTIMIZATION: Preconnect to other external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'} />
        
        {/* 🚀 OPTIMIZATION: DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        
        {/* 🚀 OPTIMIZATION: Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* 🚀 OPTIMIZATION: Font preload for critical text */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <LanguageProvider>
              <WebsiteThemeProvider>
                <CookieConsentProvider>
                  <SpeedInsights/>
                  <RootLayoutClient>{children}</RootLayoutClient>
                </CookieConsentProvider>
              </WebsiteThemeProvider>
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}