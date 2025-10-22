// app/layout.tsx
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import QueryProvider from "@/providers/QueryProvider"
import RootLayoutClient from "./RootLayoutClient"
import { WebsiteThemeProvider } from "@/contexts/WebsiteThemeContext"
import CookieConsentProvider from "@/providers/cookie-consent-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeLoader } from "@/components/ThemeLoader"

const inter = Inter({ 
  subsets: ["latin"],
  preload: true,
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "Idigitek Solutions - POS, Drive-Through & Software Development",
  description: "Innovative technology solutions for POS systems, drive-through operations, and custom software development.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://vercel-scripts.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'} />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* ✅ Add inline script to apply theme BEFORE hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const colorMode = localStorage.getItem('colorMode') || 'dark';
                  document.documentElement.classList.toggle('dark', colorMode === 'dark');
                  document.body.classList.toggle('dark', colorMode === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
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