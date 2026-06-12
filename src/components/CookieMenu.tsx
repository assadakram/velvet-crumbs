import React from "react";
import { COOKIES } from "../constants/cookies";
import SafeImage from "./SafeImage";

interface CookieMenuProps {
  lang: string;
  t: (key: string) => string;
}

export default function CookieMenu({ lang, t }: CookieMenuProps) {
  return (
    <section id="cookies" className="py-20 bg-gradient-to-b from-[#FFF9F5] to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[#F48B7D] text-xs font-bold uppercase tracking-widest block">
            {t('menuTag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2D2D2D]">
            {t('menuTitle')}
          </h2>
          <div className="inline-block bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-6 py-2.5 rounded-full shadow-sm">
            {t('menuPromo')}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {COOKIES.map(c => (
            <div 
              key={c.id}
              className="bg-white rounded-3xl border border-orange-100/60 overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-[#F48B7D]/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-orange-50">
                <SafeImage 
                  src={c.img} 
                  alt={c.name[lang]} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full object-cover hover:scale-105 duration-500 transition-transform" 
                  fallbackSrc="/images/1.Chochlate_Indulgence.jpg"
                />
                {c.special && (
                  <span className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Bonus
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-[#2D2D2D] truncate leading-tight">
                        {c.name[lang]}
                      </h3>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-semibold block">
                        {lang === 'en' ? 'around 140g' : 'n. 140g'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {c.desc[lang]}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-orange-50 mt-4">
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1.5">
                      {t('keyIngredients')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.ingredients[lang].map((ing, idx) => (
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
                    {c.special ? (
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                        {t('bonusItem')}
                      </span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-[#F48B7D]">
                          {c.price.toFixed(2).replace('.', ',')} €
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {c.origPrice.toFixed(2).replace('.', ',')} €
                        </span>
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
