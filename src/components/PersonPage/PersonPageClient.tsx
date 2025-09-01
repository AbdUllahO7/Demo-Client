// components/PersonPage/PersonPageClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { PersonProfile } from "@/const/personProfiles";
import { Phone, Mail, MapPin, MessageCircle, Linkedin, Facebook, Instagram, Music, ArrowLeft } from "lucide-react";

interface PersonPageClientProps {
  slug: string;
  personData: PersonProfile;
}

export default function PersonPageClient({ slug, personData }: PersonPageClientProps) {
  const router = useRouter();
  const { language, direction } = useLanguage();

  const currentLang = language as 'en' | 'ar' | 'tr';

  return (
    <div className="bg-gradient-to-br mt-20 from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir={direction}>
      {/* Header */}
      <motion.div 
        className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-700/20 pt-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Avatar */}
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-40 h-40 lg:w-48 lg:h-48 bg-gray-600 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-2xl dark:shadow-gray-900/50">
                {personData.avatar ? (
                  <img 
                    src={personData.avatar} 
                    alt={personData.name[currentLang]}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-24 h-24 lg:w-28 lg:h-28 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
            </motion.div>

            {/* Basic Info */}
            <motion.div 
              className="text-start  flex-1"
              initial={{ opacity: 0, x: direction === 'rtl' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {personData.name[currentLang]}
              </h1>
              <p className="text-2xl lg:text-3xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
                {personData.title[currentLang]}
              </p>
              {personData.experience && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium">
                  {personData.experience[currentLang]}
                </p>
              )}
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div className="flex items-center justify-center lg:justify-start gap-3 group">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <a 
                    href={`tel:${personData.phone}`} 
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group-hover:underline"
                  >
                    {personData.phone}
                  </a>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 group">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <a 
                    href={`mailto:${personData.email}`} 
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group-hover:underline"
                  >
                    {personData.email}
                  </a>
                </div>
                <div className="md:col-span-2 flex items-start justify-center lg:justify-start gap-3">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{personData.address[currentLang]}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="w-full">
          {/* Social Links Sidebar */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: direction === 'rtl' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {/* Social Media */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-gray-900/20 border border-transparent dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {currentLang === 'ar' ? 'تواصل معي' : 
                 currentLang === 'tr' ? 'Benimle İletişim' : 
                 'Connect with Me'}
              </h3>
              <div className="space-y-4">
                {personData.whatsapp && (
                  <motion.a 
                    href={`https://wa.me/${personData.whatsapp.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group border-2 border-transparent hover:border-green-200 dark:hover:border-green-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">WhatsApp</span>
                  </motion.a>
                )}

                {personData.linkedin && (
                  <motion.a 
                    href={personData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Linkedin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">LinkedIn</span>
                  </motion.a>
                )}

                {personData.facebook && (
                  <motion.a 
                    href={personData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Facebook className="w-8 h-8 text-blue-800 dark:text-blue-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">Facebook</span>
                  </motion.a>
                )}

                {personData.instagram && (
                  <motion.a 
                    href={personData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300 group border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Instagram className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Instagram</span>
                  </motion.a>
                )}

                {personData.tiktok && (
                  <motion.a 
                    href={personData.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Music className="w-8 h-8 text-gray-800 dark:text-gray-300" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">TikTok</span>
                  </motion.a>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 text-white shadow-xl dark:shadow-gray-900/20 border border-transparent dark:border-blue-600/20">
              <h3 className="text-xl font-bold mb-4">
                {currentLang === 'ar' ? 'تواصل مباشر' : 
                 currentLang === 'tr' ? 'Doğrudan İletişim' : 
                 'Direct Contact'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-100" />
                  <a href={`tel:${personData.phone}`} className="text-blue-100 hover:text-white hover:underline transition-colors">
                    {personData.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-100" />
                  <a href={`mailto:${personData.email}`} className="text-blue-100 hover:text-white hover:underline break-all transition-colors">
                    {personData.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}