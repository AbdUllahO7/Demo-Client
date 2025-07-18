"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './cookie-consent.module.css';
import { CookieCategory, CookieCategoryInfo, CookieConsentData, CookiePreferences } from '@/api/types/cookie-consent';
import { FadeIn } from '@/utils/lightweightAnimations';

const CONSENT_VERSION = '1.0.0';
const CONSENT_STORAGE_KEY = 'cookieConsent';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const cookieCategories: CookieCategoryInfo[] = [
    {
      key: 'necessary',
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cookies ensure basic functionalities and security features.',
      required: true
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      required: false
    },
    {
      key: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track ad performance across websites.',
      required: false
    },
    {
      key: 'functional',
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization, such as remembering your preferences.',
      required: false
    }
  ];

  // Check for existing consent on mount
  useEffect(() => {
    const checkExistingConsent = () => {
      try {
        const existingConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (existingConsent) {
          const parsed: CookieConsentData = JSON.parse(existingConsent);
          
          // Check if consent is still valid (you can add expiration logic here)
          if (parsed.version === CONSENT_VERSION) {
            setPreferences(parsed.preferences);
            setIsLoaded(true);
            return;
          }
        }
      } catch (error) {
        console.error('Error reading cookie consent:', error);
        localStorage.removeItem(CONSENT_STORAGE_KEY);
      }
      
      // Show banner if no valid consent found
      setShowBanner(true);
      setIsLoaded(true);
    };

    // Small delay to ensure page is loaded
    const timer = setTimeout(checkExistingConsent, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = useCallback((): void => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    savePreferences(allAccepted);
    setShowBanner(false);
    setShowDetails(false);
  }, []);

  const handleRejectAll = useCallback((): void => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    savePreferences(onlyNecessary);
    setShowBanner(false);
    setShowDetails(false);
  }, []);

  const handleSavePreferences = useCallback((): void => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowDetails(false);
  }, [preferences]);

  const savePreferences = useCallback((prefs: CookiePreferences): void => {
    const consentData: CookieConsentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      
      // Trigger custom event for other parts of your app
      const event = new CustomEvent('cookieConsentUpdated', {
        detail: prefs
      }) as CustomEvent<CookiePreferences>;
      
      window.dispatchEvent(event);

      // Handle cookie cleanup
      handleCookieActions(prefs);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }, []);

  const handleCookieActions = useCallback((prefs: CookiePreferences): void => {
    // Remove cookies if user rejected them
    if (!prefs.analytics) {
      removeCookie('_ga');
      removeCookie('_ga_*');
      removeCookie('_gid');
      removeCookie('_gat');
    }

    if (!prefs.marketing) {
      removeCookie('_fbp');
      removeCookie('_fbc');
      removeCookie('fr');
    }

    if (!prefs.functional) {
      // Add your functional cookies here
      removeCookie('preferences');
    }
  }, []);

  const removeCookie = useCallback((name: string): void => {
    const domains = [window.location.hostname, `.${window.location.hostname}`];
    const paths = ['/', ''];
    
    domains.forEach(domain => {
      paths.forEach(path => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
      });
    });
  }, []);

  const handlePreferenceChange = useCallback((category: CookieCategory): void => {
    if (category === 'necessary') return;
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  // Don't render anything until loaded
  if (!isLoaded) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <FadeIn 
          className={styles.overlay}
       
        >
          <FadeIn 
            className={styles.banner}
           
          >
            <div className={styles.content}>
              <div className={styles.header}>
                <h3 className={styles.title}>🍪 We value your privacy</h3>
                <p className={styles.description}>
                  We use cookies to enhance your browsing experience, serve personalized content, 
                  and analyze our traffic. Choose your preferences below.
                </p>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <FadeIn 
                    className={styles.details}

                  >
                    <h4 className={styles.detailsTitle}>Cookie Preferences</h4>
                    <div className={styles.cookieCategories}>
                      {cookieCategories.map((category) => (
                        <FadeIn 
                          key={category.key} 
                          className={styles.category}
                       
                        >
                          <label className={styles.categoryLabel}>
                            <input 
                              type="checkbox" 
                              checked={preferences[category.key]}
                              disabled={category.required}
                              onChange={() => handlePreferenceChange(category.key)}
                              className={styles.checkbox}
                              aria-describedby={`${category.key}-description`}
                            />
                            <div className={styles.categoryInfo}>
                              <strong className={styles.categoryTitle}>
                                {category.title}
                                {category.required && <span className={styles.required}> (Required)</span>}
                              </strong>
                              <p id={`${category.key}-description`} className={styles.categoryDescription}>
                                {category.description}
                              </p>
                            </div>
                          </label>
                        </FadeIn>
                      ))}
                    </div>
                  </FadeIn>
                )}
              </AnimatePresence>

              <div className={styles.actions}>
                {!showDetails ? (
                  <>
                    <button 
                      onClick={handleAcceptAll}
                      className={`${styles.button} ${styles.accept}`}
                      type="button"
                    >
                      Accept All
                    </button>
                    <button 
                      onClick={handleRejectAll}
                      className={`${styles.button} ${styles.reject}`}
                      type="button"
                    >
                      Reject All
                    </button>
                    <button 
                      onClick={toggleDetails}
                      className={`${styles.button} ${styles.customize}`}
                      type="button"
                    >
                      Customize
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleSavePreferences}
                      className={`${styles.button} ${styles.save}`}
                      type="button"
                    >
                      Save Preferences
                    </button>
                    <button 
                      onClick={toggleDetails}
                      className={`${styles.button} ${styles.back}`}
                      type="button"
                    >
                      Back
                    </button>
                  </>
                )}
              </div>
            </div>
          </FadeIn>
        </FadeIn>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;