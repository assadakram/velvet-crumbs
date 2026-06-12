import React from "react";
import { Plus, Minus } from "lucide-react";
import { COOKIES } from "../../constants/cookies";
import SafeImage from "../SafeImage";

interface CookieSelectionProps {
  lang: string;
  t: (key: string) => string;
  cart: Record<string, number>;
  updateQuantity: (id: string, change: number) => void;
  totalCookiesCount: number;
  funfettiBonusCount: number;
}

export default function CookieSelection({
  lang,
  t,
  cart,
  updateQuantity,
  totalCookiesCount,
  funfettiBonusCount,
}: CookieSelectionProps) {
  return (
    <div id="cookie-selection-section" className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
      <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">1</span>
        <h3 className="font-bold text-base sm:text-lg text-[#F48B7D] uppercase tracking-wider">{t('secPick')}</h3>
      </div>
      <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
        {t('stepperSub')}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {COOKIES.filter(c => !c.special).map(c => (
          <div 
            key={c.id}
            className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-orange-50 shadow-sm"
          >
            <div className="size-16 rounded-xl overflow-hidden bg-orange-100 shrink-0">
              <SafeImage 
                src={c.img} 
                alt={c.name[lang]} 
                width={64}
                height={64}
                className="w-full h-full object-cover"
                fallbackSrc="/images/1.Chochlate_Indulgence.jpg"
              />
            </div>
            
            <div className="min-w-0 flex-1 flex flex-col justify-between min-h-14">
              <div>
                <h4 className="font-bold text-xs min-[360px]:text-sm sm:text-base text-[#2D2D2D] leading-tight whitespace-normal">
                  {c.name[lang]}
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold block">
                  {lang === 'en' ? 'around 140g' : 'n. 140g'}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-orange-50/50">
                <span className="text-xs sm:text-sm text-[#F48B7D] font-bold">
                  {c.price.toFixed(2).replace('.', ',')} €
                </span>
                
                <div className="flex items-center gap-0.5 shrink-0 -mt-1">
                  <button 
                    type="button" 
                    onClick={() => updateQuantity(c.id, -1)}
                    className="cursor-pointer h-7 w-7 rounded-full border border-rose-200 text-[#F48B7D] flex items-center justify-center font-bold hover:bg-[#F48B7D] hover:text-white transition-colors duration-150 text-xs"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-gray-800">
                    {cart[c.id]}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => updateQuantity(c.id, 1)}
                    className="cursor-pointer h-7 w-7 rounded-full border border-rose-200 text-[#F48B7D] flex items-center justify-center font-bold hover:bg-[#F48B7D] hover:text-white transition-colors duration-150 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4.5 flex items-start gap-3.5">
        <span className="text-xl shrink-0">🎁</span>
        <div>
          <h5 className="font-bold text-sm sm:text-base text-purple-950 uppercase tracking-wide">{t('bonusTitle')}</h5>
          <p className="text-xs sm:text-sm text-purple-850 leading-relaxed mt-0.5">{t('bonusDesc')}</p>
        </div>
      </div>

      {totalCookiesCount > 0 && (
        <div className="pt-5 border-t border-orange-100/70 mt-5 space-y-4">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
            {t('currentBox')}
          </h5>
          <div className="bg-white rounded-2xl border border-orange-100/50 p-5 shadow-sm overflow-hidden">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider text-[10px] sm:text-xs border-b border-orange-50/50">
                  <th className="pb-3 font-bold">{t('colCookie')}</th>
                  <th className="pb-3 font-bold text-center">{t('colQty')}</th>
                  <th className="pb-3 font-bold text-right">{t('colPrice')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50/30">
                {Object.keys(cart).map(id => {
                  const qty = cart[id];
                  if (qty === 0) return null;
                  const cookieObj = COOKIES.find(c => c.id === id);
                  if (!cookieObj) return null;
                  return (
                    <tr key={id} className="text-gray-700">
                      <td className="py-2.5 font-medium">{cookieObj.name[lang]}</td>
                      <td className="py-2.5 text-center font-bold">{qty}</td>
                      <td className="py-2.5 text-right font-bold text-[#F48B7D]">
                        {(qty * cookieObj.price).toFixed(2).replace('.', ',')} €
                      </td>
                    </tr>
                  );
                })}

                {funfettiBonusCount > 0 && (
                  <tr className="text-purple-700 bg-purple-50/40">
                    <td className="py-2.5 px-1.5 italic font-medium">🎁 {COOKIES.find(c => c.id === 'funfetti')?.name[lang]}</td>
                    <td className="py-2.5 text-center font-bold">{funfettiBonusCount}</td>
                    <td className="py-2.5 pr-1.5 text-right font-bold">0,00 €</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
