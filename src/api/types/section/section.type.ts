import { ContentElement } from "../contentElements/contentElemetn.type";
import { Language } from "../languages/languages.type";
export interface Resource {
    _id?: string;
    isActive?: boolean;
    subSections?: string[] | any[];
    createdAt?: string;
    updatedAt?: string;
  }

  export interface CreateSectionRequest {
  name: MultilingualName;
  subName: string;
  description?: MultilingualDescription;
  image?: string;
  isActive?: boolean;
  order?: number;
  WebSiteId: string;
  sectionType?: string;
  type?: string;
}

export interface UpdateSectionRequest {
  name?: MultilingualName;
  subName?: string;
  description?: MultilingualDescription;
  image?: string;
  isActive?: boolean;
  order?: number;
  sectionType?: string;
  type?: string;
}
export interface MultilingualName {
  en: string;
  ar: string;
  tr: string;
}

export interface MultilingualDescription {
  en?: string;
  ar?: string;
  tr?: string;
}
export interface SectionItem {
  _id: string;
  name: string | MultilingualName;
  description?: string | MultilingualDescription;
  image?: string | null;
  isActive: boolean;
  order: number;
  isMain: boolean;
  section: string | Section;
  WebSiteId: string;
  subsections?: string[] | SubSection[];
  subsectionCount?: number;
  createdAt?: string;
  updatedAt?: string;
  
  displayName?: string; 
  displayDescription?: string; 
  
  isMultilingual?: boolean; 
}

export interface Section extends Resource {
  name: string | MultilingualName;
  description?: string | MultilingualDescription;
  order?: number;
  image?: string;
  sectionItems?: string[] | SectionItem[];
  WebSiteId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  subName?: string;
  sectionType?: string;
  type?: string;
  slug?: string;
  
  displayName?: string; 
  displayDescription?: string; 
  
  isMultilingual?: boolean; 
}

export interface SubSection {
  _id: string;
  name: string | MultilingualName;
  slug: string;
  isActive: boolean;
  order: number;
  sectionItem?: string | SectionItem;
  languages: string[] | Language[];
  metadata?: any;
  defaultContent: string;
  contentElements?: ContentElement[];
  contentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  isMain?: boolean;
  parentSections?: string[];
  section?: SubSection | string;
  elements?: ContentElement[];
  WebSiteId: string;
  displayName?: string; 
  displayDescription?: string;
  isMultilingual?: boolean; 
}


export function isMultilingualName(name: string | MultilingualName): name is MultilingualName {
  return typeof name === 'object' && name !== null && 'en' in name && 'ar' in name && 'tr' in name;
}

export function isMultilingualDescription(description: string | MultilingualDescription): description is MultilingualDescription {
  return typeof description === 'object' && description !== null && 
         ('en' in description || 'ar' in description || 'tr' in description);
}

export type SupportedLanguage = 'en' | 'ar' | 'tr';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

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

export interface MultilingualHelpers {
  /**
   * Get name in specific language with fallback
   */
  getName(item: { name: string | MultilingualName }, language: SupportedLanguage): string;
  
  /**
   * Get description in specific language with fallback
   */
  getDescription(item: { description?: string | MultilingualDescription }, language: SupportedLanguage): string;
  
  /**
   * Check if item has multilingual names
   */
  hasMultilingualName(item: { name: string | MultilingualName }): boolean;
  
  /**
   * Check if item has multilingual descriptions
   */
  hasMultilingualDescription(item: { description?: string | MultilingualDescription }): boolean;
  
  /**
   * Get all available languages for an item
   */
  getAvailableLanguages(item: { 
    name: string | MultilingualName; 
    description?: string | MultilingualDescription 
  }): SupportedLanguage[];
}

export interface SectionResponse {
  success: boolean;
  data: Section | Section[];
  count?: number;
  message?: string;
}

export interface SectionItemResponse {
  success: boolean;
  data: SectionItem | SectionItem[];
  count?: number;
  message?: string;
}

export interface SubSectionResponse {
  success: boolean;
  data: SubSection | SubSection[];
  count?: number;
  message?: string;
}

export interface SectionQueryParams {
  language?: SupportedLanguage;
  includeInactive?: boolean;
  includeItems?: boolean;
  includeSubsections?: boolean;
  includeContent?: boolean;
  websiteId?: string;
  isActive?: boolean;
}

export interface SectionOrderUpdateRequest {
  sections: Array<{
    id: string;
    order: number;
    websiteId: string;
  }>;
}

export interface MultilingualValidationError {
  language: SupportedLanguage;
  field: 'name' | 'description';
  message: string;
}

export interface SectionValidationResult {
  isValid: boolean;
  errors: MultilingualValidationError[];
}

