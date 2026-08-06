import React, { useState, useEffect } from "react";
import { COOKIES } from "../constants/cookies";
import { BROWNIES, BOXES } from "../constants/brownies";
import SafeImage from "./SafeImage";

interface ProductMenuProps {
  lang: string;
  t: (key: string) => string;
}

export default function ProductMenu({ lang, t }: ProductMenuProps) {
  const [activeTab, setActiveTab] = useState<'cookies' | 'brownies' | 'boxes'>('cookies');

  const handleTabClick = (tab: 'cookies' | 'brownies' | 'boxes') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#${tab}`);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['cookies', 'brownies', 'boxes'].includes(hash)) {
        setActiveTab(hash as any);
        
        // Smoothly scroll to the menu, accounting for sticky navbar
        setTimeout(() => {
          const menuEl = document.getElementById('menu');
          if (menuEl) {
            const yOffset = 50; // Scroll a little more below (matches original page.tsx)
            const y = menuEl.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 300);
      }
    };

    handleHashChange(); // Check on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let currentItems: any[] = [];
  if (activeTab === 'cookies') currentItems = COOKIES;
  if (activeTab === 'brownies') currentItems = BROWNIES;
  if (activeTab === 'boxes') currentItems = BOXES;

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-[#FFF9F5] to-white scroll-mt-24 relative">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[#F48B7D] text-xs font-bold uppercase tracking-widest block">
            {t('menuTag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2D2D2D]">
            {t('menuTitle')}
          </h2>
          <div className="inline-block bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-6 py-2.5 rounded-full shadow-sm mt-4">
            {t('menuPromo')}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-12">
          <button
            onClick={() => handleTabClick('cookies')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'cookies' ? 'bg-[#F48B7D] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-orange-50 border border-orange-100'}`}
          >
            {t('tabCookies')}
          </button>
          <button
            onClick={() => handleTabClick('brownies')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'brownies' ? 'bg-[#F48B7D] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-orange-50 border border-orange-100'}`}
          >
            {t('tabBrownies')}
          </button>
          <button
            onClick={() => handleTabClick('boxes')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'boxes' ? 'bg-[#F48B7D] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-orange-50 border border-orange-100'}`}
          >
            {t('tabBoxes')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-orange-100/60 overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-[#F48B7D]/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-orange-50">
                <SafeImage 
                  src={item.img} 
                  alt={item.name[lang as 'en' | 'fi']} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full object-cover hover:scale-105 duration-500 transition-transform" 
                  fallbackSrc="/images/1.Chochlate_Indulgence.jpg"
                />
                {item.special && (
                  <span className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Bonus
                  </span>
                )}
                {item.vegan && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {t('badgeVegan')}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-[#2D2D2D] truncate leading-tight">
                        {item.name[lang as 'en' | 'fi']}
                      </h3>
                      {activeTab === 'cookies' && (
                        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold block">
                          {lang === 'en' ? 'around 140g' : 'n. 140g'}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc[lang as 'en' | 'fi']}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-orange-50 mt-4">
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1.5">
                      {t('keyIngredients')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.ingredients[lang as 'en' | 'fi'].map((ing: string, idx: number) => (
                        <span 
                          key={idx}
                          className="bg-rose-50 text-[#c0533e] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    {item.special ? (
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                        {t('bonusItem')}
                      </span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-[#F48B7D]">
                          {item.price.toFixed(2).replace('.', ',')} €
                        </span>
                        {item.origPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {item.origPrice.toFixed(2).replace('.', ',')} €
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
