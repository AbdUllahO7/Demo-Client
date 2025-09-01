// const/personProfiles.ts

export interface PersonProfile {
  id: string;
  name: {
    en: string;
    ar: string;
    tr: string;
  };
  title: {
    en: string;
    ar: string;
    tr: string;
  };
  phone: string;
  email: string;
  address: {
    en: string;
    ar: string;
    tr: string;
  };
  whatsapp?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  avatar?: string;
  bio?: {
    en: string;
    ar: string;
    tr: string;
  };
  skills?: {
    en: string[];
    ar: string[];
    tr: string[];
  };
  experience?: {
    en: string;
    ar: string;
    tr: string;
  };
}

export const PERSON_PROFILES: Record<string, PersonProfile> = {
  ceo: {
    id: "ceo",
    name: {
      en: "Mr. Ahmad Hamdan",
      ar: "السيد أحمد حمدان",
      tr: "Mr. Ahmad Hamdan"
    },
    title: {
      en: "Co-Founder and CEO",
      ar: "المؤسس المشارك والرئيس التنفيذي",
      tr: "Kurucu Ortak ve CEO"
    },
    phone: "+90 534 332 74 43",
    email: "ahmad@idigitek.com",
    address: {
      en: "Istanbul, Başakşehir Kayabaşı Mh, 75.Yıl Cad, Merkez Kayaşehir Plaza, Dış kapı No:09, iç kapı No: 69",
      ar: "اسطنبول، حي كاياباشي باشاك شهير، شارع السنة الـ75، مركز كاياشهير بلازا، باب خارجي رقم: 09، باب داخلي رقم: 69",
      tr: "İstanbul, Başakşehir Kayabaşı Mh, 75.Yıl Cad, Merkez Kayaşehir Plaza, Dış kapı No:09, iç kapı No: 69"
    },
    whatsapp: "https://api.whatsapp.com/message/HVYYPHUPNKYID1?autoload=1&app_absent=0",
    linkedin: "https://www.linkedin.com/company/idigitek2020/",
    facebook: "https://www.facebook.com/iDIGITEK2020",
    instagram: "https://www.instagram.com/idigitek2020/",
    tiktok: "https://www.tiktok.com/@idigitek2020",
  
  },
  isa: {
    id: "isa",
    name: {
      en: "Mr. İsa Alomer",
      ar: "السيد عيسى الومر",
      tr: "Mr. İsa Alomer"
    },
    title: {
      en: "Sales & Operations Manager",
      ar: "مدير المبيعات والعمليات",
      tr: "Satış ve Operasyon Müdürü"
    },
    phone: "+90 531 732 47 31",
    email: "services@idigitek.com",
    address: {
      en: "Istanbul, Başakşehir Kayabaşı Mh, 75.Yıl Cad, Merkez Kayaşehir Plaza, Dış kapı No:09, iç kapı No: 69",
      ar: "اسطنبول، حي كاياباشي باشاك شهير، شارع السنة الـ75، مركز كاياشهير بلازا، باب خارجي رقم: 09، باب داخلي رقم: 69",
      tr: "İstanbul, Başakşehir Kayabaşı Mh, 75.Yıl Cad, Merkez Kayaşehir Plaza, Dış kapı No:09, iç kapı No: 69"
    },
    whatsapp: "https://api.whatsapp.com/message/HVYYPHUPNKYID1?autoload=1&app_absent=0",
    linkedin: "https://www.linkedin.com/company/idigitek2020/",
    facebook: "https://www.facebook.com/iDIGITEK2020",
    instagram: "https://www.instagram.com/idigitek2020/",
    tiktok: "https://www.tiktok.com/@idigitek2020",
 
  }
};

// Helper function to get person profile by slug
export const getPersonProfile = (slug: string): PersonProfile | null => {
  return PERSON_PROFILES[slug.toLowerCase()] || null;
};

// Helper function to get all available person slugs
export const getAvailablePersonSlugs = (): string[] => {
  return Object.keys(PERSON_PROFILES);
};