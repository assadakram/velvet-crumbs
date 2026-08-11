"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Globe, 
  AlertTriangle
} from 'lucide-react';

import { TikTokIcon, Instagram, Facebook } from '../components/Icons';
import Hero from '../components/Hero';
import Story from '../components/Story';
import CookieMenu from '../components/CookieMenu';
import OrderSection from '../components/OrderSection';

import { TRANSLATIONS } from '../constants/translations';

export default function App() {
  const [lang, setLang] = useState('en');
  const [navLogoError, setNavLogoError] = useState(false);
  const [footerLogoError, setFooterLogoError] = useState(false);

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || key;

  // Set language from query parameter if present (?lang=fi or ?lang=en)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryLang = params.get('lang');
      if (queryLang === 'fi' || queryLang === 'en') {
        setLang(queryLang);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2D2D] selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      
      {/* ALLERGEN BANNER */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] sm:text-xs py-2 px-4 flex items-center justify-center gap-2 font-sans">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
        <span className="text-center font-medium leading-relaxed max-w-4xl">
          {t('allergenWarn')}
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="sticky top-0 w-full bg-[#FFF9F5]/90 backdrop-blur-md border-b border-orange-100/50 z-40 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 sm:gap-6">
          <a href="#" className="flex items-center gap-2 sm:gap-3 group">
            <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-sm transition-transform group-hover:rotate-6 duration-300">
              {navLogoError ? (
                <span className="text-xs font-serif font-bold text-[#F48B7D]">VC</span>
              ) : (
                <Image 
                  src="/images/Logo.jpg" 
                  alt="Velvet Crumbs Logo" 
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={() => setNavLogoError(true)}
                />
              )}
            </div>
            <span className="text-sm sm:text-xl font-bold tracking-tight text-[#F48B7D] font-serif leading-tight whitespace-normal">
              {t('brandName')}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#story" className="text-sm font-medium hover:text-[#F48B7D] transition-colors duration-200">
              {t('navStory')}
            </a>
            <a href="#cookies" className="text-sm font-medium hover:text-[#F48B7D] transition-colors duration-200">
              {t('navMenu')}
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => setLang(lang === 'en' ? 'fi' : 'en')}
              className="cursor-pointer text-xs font-bold border-2 border-[#F48B7D] text-[#F48B7D] hover:bg-[#F48B7D] hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 uppercase tracking-wider"
              aria-label="Toggle language"
            >
              <Globe className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Suomi' : 'English'}</span>
              <span className="sm:hidden">{lang === 'en' ? 'FI' : 'EN'}</span>
            </button>
            <a 
              href="#order"
              className="cursor-pointer bg-[#F48B7D] text-white px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md hover:bg-rose-400 active:scale-95 transition-all duration-200"
            >
              {t('navOrder')}
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <Hero lang={lang} t={t} />

      {/* OUR STORY SECTION */}
      <Story t={t} />

      {/* SIGNATURE COOKIE MENU SECTION */}
      <CookieMenu lang={lang} t={t} />

      {/* ORDER SECTION */}
      <OrderSection lang={lang} t={t} />

      {/* FOOTER SECTION */}
      <footer className="bg-white border-t border-orange-100/50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-sm">
                {footerLogoError ? (
                  <span className="text-xs font-serif font-bold text-[#F48B7D]">VC</span>
                ) : (
                  <Image 
                    src="/images/Logo.jpg" 
                    alt="Velvet Crumbs Logo" 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    onError={() => setFooterLogoError(true)}
                  />
                )}
              </div>
              <span className="text-lg font-bold text-[#F48B7D] font-serif">
                {t('brandName')}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              ┬® 2026 Velvet Crumbs. Handmade with love.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Contact &amp; Baking HQ
            </h5>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>Kunnallissairaalantie 52A, 20810 Turku</li>
              <li>Phone / WhatsApp: +358 41 317 0359</li>
              <li>
                <a href="mailto:velvetcrumbs.fi@gmail.com" className="text-[#F48B7D] hover:underline font-bold">
                  velvetcrumbs.fi@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Follow Our Baking
            </h5>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/velvet.crumbs.fi?igsh=MWRlanN5cDF3Z3NwNA==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 hover:text-[#F48B7D] transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram className="h-5 w-5" />
              </a>
              
              <a 
                href="https://www.tiktok.com/@velvet.crumbs.fi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 hover:text-[#F48B7D] transition-colors"
                aria-label="TikTok Account"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              
              <a 
                href="https://www.facebook.com/share/1Cy5qw9J25/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 hover:text-[#F48B7D] transition-colors"
                aria-label="Facebook Page"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
