import React from "react";
import { Calendar, Clock } from "lucide-react";

interface DateTimeSelectionProps {
  t: (key: string) => string;
  form: {
    date: string;
    timeSlot: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function DateTimeSelection({
  t,
  form,
  handleInputChange,
}: DateTimeSelectionProps) {
  return (
    <div id="date-time-section" className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
      <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">4</span>
        <h3 className="font-bold text-base sm:text-lg text-[#F48B7D] uppercase tracking-wider">{t('secTime')}</h3>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#F48B7D]" /> {t('delDate')}
          </label>
          <input 
            type="date" 
            id="fdate"
            name="date"
            required
            value={form.date}
            onChange={handleInputChange}
            className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#F48B7D]" /> {t('timeWindow')}
          </label>
          <select 
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleInputChange}
            className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
          >
            <option value="any">{t('anyTime')}</option>
            <option value="morning">{t('slotMorning')}</option>
            <option value="noon">{t('slotNoon')}</option>
            <option value="afternoon">{t('slotAfternoon')}</option>
            <option value="evening">{t('slotEvening')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
