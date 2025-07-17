"use client";

import { CookiePreferences } from "@/api/types/cookie-consent";


declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class CookieAnalytics {
  private static instance: CookieAnalytics;
  
  private constructor() {}
  
  public static getInstance(): CookieAnalytics {
    if (!CookieAnalytics.instance) {
      CookieAnalytics.instance = new CookieAnalytics();
    }
    return CookieAnalytics.instance;
  }

  public initializeAnalytics(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return;

    // Initialize Google Analytics
    if (preferences.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': preferences.marketing ? 'granted' : 'denied'
      });
    }

    // Initialize Facebook Pixel
    if (preferences.marketing && window.fbq) {
      window.fbq('consent', 'grant');
    }

    // Initialize other analytics tools here
  }

  public updateConsent(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return;

    // Update Google Analytics consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'functionality_storage': preferences.functional ? 'granted' : 'denied'
      });
    }

    // Update Facebook Pixel consent
    if (window.fbq) {
      if (preferences.marketing) {
        window.fbq('consent', 'grant');
      } else {
        window.fbq('consent', 'revoke');
      }
    }

  }

}
