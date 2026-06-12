import React from "react";
import { User, Phone, MapPin } from "lucide-react";

interface ContactDetailsProps {
  t: (key: string) => string;
  form: {
    name: string;
    phone: string;
    email: string;
    address: string;
    deliveryMethod: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactDetails({
  t,
  form,
  handleInputChange,
}: ContactDetailsProps) {
  return (
    <div id="contact-details-section" className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
      <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">3</span>
        <h3 className="font-bold text-base sm:text-lg text-[#F48B7D] uppercase tracking-wider">{t('secContact')}</h3>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-4 w-4 text-[#F48B7D]" /> {t('fullName')}
          </label>
          <input 
            type="text" 
            name="name" 
            required 
            value={form.name}
            onChange={handleInputChange}
            placeholder="Sara Virtanen"
            className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-[#F48B7D]" /> {t('phone')}
          </label>
          <input 
            type="tel" 
            name="phone" 
            required 
            value={form.phone}
            onChange={handleInputChange}
            placeholder="+358 40 123 4567"
            className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
          />
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <span className="text-[#F48B7D] text-lg">✉️</span> {t('email')}
        </label>
        <input 
          type="email" 
          name="email" 
          value={form.email}
          onChange={handleInputChange}
          placeholder="sara.virtanen@example.com (optional)"
          className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
        />
      </div>

      <div className={`transition-all duration-300 overflow-hidden ${form.deliveryMethod === 'delivery' ? 'max-h-36 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="space-y-1.5 pt-1">
          <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#F48B7D]" /> {t('address')}
          </label>
          <input 
            type="text" 
            name="address" 
            required={form.deliveryMethod === 'delivery'}
            value={form.address}
            onChange={handleInputChange}
            placeholder={t('addressPlaceholder')}
            className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
