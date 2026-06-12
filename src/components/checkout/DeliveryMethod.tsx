import React from "react";
import { Truck } from "lucide-react";

interface DeliveryMethodProps {
  t: (key: string) => string;
  isFreeDelivery: boolean;
  deliveryMethod: string;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function DeliveryMethod({
  t,
  isFreeDelivery,
  deliveryMethod,
  setForm,
}: DeliveryMethodProps) {
  return (
    <div id="delivery-config-section" className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
      <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">5</span>
        <h3 className="font-bold text-base sm:text-lg text-[#F48B7D] uppercase tracking-wider">{t('secDel')}</h3>
      </div>

      {isFreeDelivery && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-3">
          <Truck className="h-4.5 w-4.5 text-emerald-600 animate-drive" />
          <span>{t('delSweet')}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={() => setForm((prev: any) => ({ ...prev, deliveryMethod: 'delivery' }))}
          className={`cursor-pointer flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-200 ${
            deliveryMethod === 'delivery' 
              ? 'border-[#F48B7D] bg-rose-50/40 shadow-sm' 
              : 'border-orange-100 bg-white hover:border-orange-200'
          }`}
        >
          <span className="text-2xl">🚚</span>
          <span className="font-bold text-base sm:text-lg mt-2 text-gray-800">{t('delDirect')}</span>
          <span className="text-sm sm:text-base text-[#F48B7D] font-bold mt-1">
            {isFreeDelivery ? '0,00 €' : '5,00 €'}
          </span>
          <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">{t('delRegion')}</span>
        </button>

        <button 
          type="button"
          onClick={() => setForm((prev: any) => ({ ...prev, deliveryMethod: 'pickup' }))}
          className={`cursor-pointer flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-200 ${
            deliveryMethod === 'pickup' 
              ? 'border-[#F48B7D] bg-rose-50/40 shadow-sm' 
              : 'border-orange-100 bg-white hover:border-orange-200'
          }`}
        >
          <span className="text-2xl">🏪</span>
          <span className="font-bold text-base sm:text-lg mt-2 text-gray-800">{t('delPickup')}</span>
          <span className="text-sm sm:text-base text-[#F48B7D] font-bold mt-1">0,00 €</span>
          <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">{t('delCenter')}</span>
        </button>
      </div>
    </div>
  );
}
