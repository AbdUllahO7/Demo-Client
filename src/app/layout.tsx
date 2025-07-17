// app/layout.tsx (Your existing file - UPDATED)
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider" // Your existing next-themes provider
import { LanguageProvider } from "@/contexts/language-context"
import QueryProvider from "@/providers/QueryProvider"
import RootLayoutClient from "./RootLayoutClient"
import { WebsiteThemeProvider } from "@/contexts/WebsiteThemeContext"
import CookieConsentProvider from "@/providers/cookie-consent-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Idigitek Solutions - POS, Drive-Through & Software Development",
  description:
    "Innovative technology solutions for POS systems, drive-through operations, and custom software development.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Keep your existing ThemeProvider for dark/light mode */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <LanguageProvider>
              {/* NEW: Add WebsiteThemeProvider for dynamic themes */}
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
