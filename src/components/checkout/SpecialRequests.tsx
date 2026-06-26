import React from "react";
import { MessageSquare, AlertTriangle } from "lucide-react";

interface SpecialRequestsProps {
  t: (key: string) => string;
  specialRequests: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function SpecialRequests({
  t,
  specialRequests,
  handleInputChange,
}: SpecialRequestsProps) {
  return (
    <div id="special-requests-section" className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
      <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">2</span>
        <h3 className="font-bold text-base sm:text-lg text-[#F48B7D] uppercase tracking-wider">{t('secDiet')}</h3>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-[#F48B7D]" /> {t('dietSub')}
        </label>
        <div className="flex items-center gap-3 bg-[#FFF9F5] border border-orange-100 px-4 py-3 rounded-xl">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#F48B7D]" />
          <p className="text-xs sm:text-sm text-orange-950/70 font-semibold leading-snug">{t('nutWarning')}</p>
        </div>
        <textarea 
          name="specialRequests"
          value={specialRequests}
          onChange={handleInputChange}
          rows={3}
          placeholder="e.g. Please make the Chocolate Indulgence cookies lactose-free, or this is a birthday surprise gift box!"
          className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
        />
      </div>
    </div>
  );
}
