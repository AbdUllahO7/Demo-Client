/**
 * Multilingual utility functions for sections
 */

import { LanguageInfo, MultilingualDescription, MultilingualName, SupportedLanguage } from "@/api/types/section/section.type";



// 🎯 ADDED: Missing SUPPORTED_LANGUAGES constant
export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl'
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    direction: 'ltr'
  }
};

// 🎯 ADDED: Missing type guard functions
/**
 * Type guard to check if name is multilingual
 */
export function isMultilingualName(name: string | MultilingualName): name is MultilingualName {
  return typeof name === 'object' && name !== null && 
         'en' in name && 'ar' in name && 'tr' in name;
}

/**
 * Type guard to check if description is multilingual
 */
export function isMultilingualDescription(description: string | MultilingualDescription): description is MultilingualDescription {
  return typeof description === 'object' && description !== null && 
         ('en' in description || 'ar' in description || 'tr' in description);
}

/**
 * Get name in specific language with intelligent fallback
 */
export function getMultilingualName(
  item: { name: string | MultilingualName; subName?: string },
  language: SupportedLanguage = 'en'
): string {
  // Handle multilingual names
  if (isMultilingualName(item.name)) {
    // Try requested language first
    if (item.name[language] && item.name[language].trim()) {
      return item.name[language].trim();
    }
    
    // Fallback to English
    if (item.name.en && item.name.en.trim()) {
      return item.name.en.trim();
    }
    
    // Fallback to any available language
    const availableLanguages: SupportedLanguage[] = ['ar', 'tr'];
    for (const lang of availableLanguages) {
      if (item.name[lang] && item.name[lang].trim()) {
        return item.name[lang].trim();
      }
    }
  }
  
  // Handle legacy string names
  if (typeof item.name === 'string' && item.name.trim()) {
    return item.name.trim();
  }
  
  // Final fallback to subName
  return item.subName || 'Unknown Section';
}

/**
 * Get description in specific language with intelligent fallback
 */
export function getMultilingualDescription(
  item: { description?: string | MultilingualDescription },
  language: SupportedLanguage = 'en'
): string {
  if (!item.description) return '';
  
  // Handle multilingual descriptions
  if (isMultilingualDescription(item.description)) {
    // Try requested language first
    if (item.description[language] && item.description[language]?.trim()) {
      return item.description[language]!.trim();
    }
    
    // Fallback to English
    if (item.description.en && item.description.en.trim()) {
      return item.description.en.trim();
    }
    
    // Fallback to any available language
    const availableLanguages: SupportedLanguage[] = ['ar', 'tr'];
    for (const lang of availableLanguages) {
      if (item.description[lang] && item.description[lang]?.trim()) {
        return item.description[lang]!.trim();
      }
    }
  }
  
  // Handle legacy string descriptions
  if (typeof item.description === 'string') {
    return item.description.trim();
  }
  
  return '';
}



// Export all utility functions as a bundle
export const multilingualUtils = {
  getMultilingualName,
  getMultilingualDescription,
  isMultilingualName,
  isMultilingualDescription,
};