import React from "react";
import { Sparkles } from "lucide-react";
import SafeImage from "./SafeImage";

interface HeroProps {
  lang: string;
  t: (key: string) => string;
}

export default function Hero({ lang, t }: HeroProps) {
  return (
    <header className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-orange-50/40 to-[#FFF9F5]">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-[#F48B7D] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="h-3 w-3" />
            {t('heroSubtitle')}
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif leading-tight">
            {lang === 'en' ? (
              <>Hand-made <span className="text-[#F48B7D]">with love.</span></>
            ) : (
              <>Kotoisia pehmeitä <span className="text-[#F48B7D]">herkkuja.</span></>
            )}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="space-y-3 max-w-lg">
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm">
              <span className="text-xl">🚚</span>
              <div>
                <h4 className="font-bold text-xs text-orange-950 uppercase tracking-wide">Free Local Shipping</h4>
                <p className="text-xs text-gray-500 mt-0.5">{t('promoFreeDel')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-purple-100 shadow-sm">
              <span className="text-xl">🎁</span>
              <div>
                <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wide">Surprise Cookie Bonus</h4>
                <p className="text-xs text-gray-500 mt-0.5">{t('promoBonusGift')}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="#order" 
              className="cursor-pointer bg-[#F48B7D] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-sm sm:text-base"
            >
              {t('btnBuild')}
            </a>
            <a 
              href="#cookies" 
              className="cursor-pointer border-2 border-[#F48B7D] text-[#F48B7D] px-8 py-4 rounded-full font-bold hover:bg-[#F48B7D] hover:text-white transition-all duration-200 text-sm sm:text-base"
            >
              {t('btnExplore')}
            </a>
          </div>
        </div>

        <div className="md:col-span-5 flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-amber-200 blur-3xl opacity-40 rounded-full"></div>
          <div className="relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-orange-100 relative flex items-center justify-center">
              <SafeImage 
                src="/images/Main.jpg" 
                alt="Velvet Crumbs Baking Showcase" 
                fill
                sizes="(max-width: 640px) 256px, 320px"
                className="w-full h-full object-cover transform hover:scale-105 duration-700 transition-transform" 
                fallbackSrc="/images/Logo.jpg"
              />
            </div>
            <div className="absolute -bottom-4 -right-2 bg-white border border-orange-100 rounded-2xl p-4 shadow-lg flex items-center gap-3">
              <span className="text-2xl animate-bounce">🍪</span>
              <div>
                <span className="block text-[10px] text-[#F48B7D] font-bold uppercase tracking-wider">{t('badgeFresh')}</span>
                <span className="text-xs font-bold text-gray-500">100% home baked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
