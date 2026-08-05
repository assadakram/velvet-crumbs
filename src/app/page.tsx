"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  Globe, 
  AlertTriangle
} from 'lucide-react';

import { TikTokIcon, Instagram, Facebook } from '../components/Icons';
import Hero from '../components/Hero';
import Story from '../components/Story';
import ProductMenu from '../components/ProductMenu';
import ProductSelection from '../components/checkout/ProductSelection';
import SpecialRequests from '../components/checkout/SpecialRequests';
import ContactDetails from '../components/checkout/ContactDetails';
import DateTimeSelection from '../components/checkout/DateTimeSelection';
import DeliveryMethod from '../components/checkout/DeliveryMethod';
import CheckoutCTA from '../components/checkout/CheckoutCTA';

import { COOKIES } from '../constants/cookies';
import { BROWNIES, BOXES } from '../constants/brownies';
import { TRANSLATIONS } from '../constants/translations';

const ALL_PRODUCTS = [...COOKIES, ...BROWNIES, ...BOXES];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '358413170359';

export default function App() {
  const [lang, setLang] = useState('en');
  const [navLogoError, setNavLogoError] = useState(false);
  const [footerLogoError, setFooterLogoError] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    timeSlot: 'any',
    specialRequests: '',
    deliveryMethod: 'delivery' // 'delivery' or 'pickup'
  });

  const [validationError, setValidationError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentAcknowledge, setPaymentAcknowledge] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

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

  // Auto-scroll to menu on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      setTimeout(() => {
        const menuEl = document.getElementById('menu');
        if (menuEl) {
          const yOffset = 100; // Scroll a little more below
          const y = menuEl.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300); // slight delay to allow layout to settle
    }
  }, []);

  // Sync date selection min attribute dynamically
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const minDate = `${yyyy}-${mm}-${dd}`;
    
    const dateInput = document.getElementById('fdate');
    if (dateInput) {
      dateInput.setAttribute('min', minDate);
    }
  }, []);

  const { totalCookiesCount, cookiesCost, isFreeDelivery, deliveryFee, finalTotal, funfettiBonusCount } = useMemo(() => {
    let count = 0;
    let cost = 0;
    
    Object.keys(cart).forEach(id => {
      const q = cart[id];
      const productObj = ALL_PRODUCTS.find(c => c.id === id);
      count += q;
      cost += q * (productObj ? productObj.price : 0);
    });

    const freeDeliveryQualified = cost >= 25;
    let delFee = 0;
    
    if (form.deliveryMethod === 'delivery') {
      delFee = freeDeliveryQualified ? 0 : 5.00;
    }

    const funfettiCount = Math.floor(count / 8);

    return {
      totalCookiesCount: count,
      cookiesCost: cost,
      isFreeDelivery: freeDeliveryQualified,
      deliveryFee: delFee,
      finalTotal: cost + delFee,
      funfettiBonusCount: funfettiCount
    };
  }, [cart, form.deliveryMethod]);

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const updatedVal = Math.max(0, Math.min(50, current + change));
      return { ...prev, [id]: updatedVal };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (totalCookiesCount === 0) {
      setValidationError(t('alertValidCart'));
      document.getElementById('cookie-selection-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!form.name.trim() || !form.phone.trim()) {
      setValidationError(t('alertValidFields'));
      document.getElementById('contact-details-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!form.date) {
      setValidationError(t('alertValidFields'));
      document.getElementById('date-time-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (form.deliveryMethod === 'delivery' && !form.address.trim()) {
      setValidationError(t('alertValidAddress'));
      document.getElementById('contact-details-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!paymentAcknowledge) {
      setValidationError(t('alertPayAck'));
      document.getElementById('checkout-cta-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    let cookieLines = '';
    Object.keys(cart).forEach(id => {
      const qty = cart[id];
      if (qty > 0) {
        const productObj = ALL_PRODUCTS.find(c => c.id === id);
        if (productObj) {
          cookieLines += `• ${productObj.name[lang as 'en' | 'fi']} x ${qty} (${(qty * productObj.price).toFixed(2)} €)\n`;
        }
      }
    });

    if (funfettiBonusCount > 0) {
      const funfettiObj = ALL_PRODUCTS.find(c => c.id === 'funfetti');
      if (funfettiObj) {
        cookieLines += `🎁 ${funfettiObj.name[lang as 'en' | 'fi']} x ${funfettiBonusCount} (${t('bonusItem')})\n`;
      }
    }

    const deliveryMethodLabel = form.deliveryMethod === 'delivery' 
      ? `${t('delDirect')} (${t('delRegion')})` 
      : `${t('delPickup')} (${t('delCenter')})`;

    let timeSlotText = t('anyTime');
    if (form.timeSlot === 'morning') timeSlotText = t('slotMorning');
    if (form.timeSlot === 'noon') timeSlotText = t('slotNoon');
    if (form.timeSlot === 'afternoon') timeSlotText = t('slotAfternoon');
    if (form.timeSlot === 'evening') timeSlotText = t('slotEvening');

    const title = lang === 'en' ? '🍪 *Velvet Crumbs Order Inquiry* 🍪' : '🍪 *Velvet Crumbs - Tilauskysely* 🍪';
    const bottomGreet = lang === 'en' 
      ? 'Hi Velvet Crumbs team! I have submitted this order. Please find my details and confirm availability. ✨'
      : 'Hei Velvet Crumbs tiimi! Olen lähettänyt tilaukseni. Vahvistatteko saatavuuden ja toimitusajan. ✨';

    const orderPayloadText = `${title}\n\n` +
      `*${lang === 'en' ? 'Customer' : 'Asiakas'}:* ${form.name}\n` +
      `*${lang === 'en' ? 'Phone' : 'Puhelin'}:* ${form.phone}\n` +
      (form.deliveryMethod === 'delivery' ? `*${lang === 'en' ? 'Delivery Address' : 'Toimitusosoite'}:* ${form.address}\n` : '') +
      `*${lang === 'en' ? 'Date' : 'Päivämäärä'}:* ${form.date}\n` +
      `*${lang === 'en' ? 'Time slot' : 'Toivottu aika'}:* ${timeSlotText}\n` +
      `*${lang === 'en' ? 'Delivery' : 'Toimitustapa'}:* ${deliveryMethodLabel}\n\n` +
      `*${lang === 'en' ? 'Box Selection' : 'Laatikon sisältö'}:*\n${cookieLines}\n` +
      (form.specialRequests ? `*${lang === 'en' ? 'Special wishes' : 'Toiveet'}:* ${form.specialRequests}\n\n` : '') +
      `*${lang === 'en' ? 'Estimated Total' : 'Arvioitu summa'}:* ${finalTotal.toFixed(2).replace('.', ',')} €\n\n` +
      `${bottomGreet}`;

    const triggerWhatsAppRedirect = () => {
      setTimeout(() => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderPayloadText)}`;
        window.open(url, '_blank');
        setIsRedirecting(false);
      }, 1500);
    };

    setIsRedirecting(true);

    try {
      fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: 'velvetcrumbs.fi@gmail.com',
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          deliveryMethod: form.deliveryMethod,
          date: form.date,
          timeSlot: timeSlotText,
          orderLines: cookieLines,
          specialRequests: form.specialRequests,
          estimatedTotal: finalTotal
        })
      })
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        showToast(
          lang === 'en' ? "Order request logged! Redirecting to WhatsApp..." : "Tilauskysely kirjattu! Siirrytään WhatsAppiin...", 
          'success'
        );
        triggerWhatsAppRedirect();
      })
      .catch(err => {
        console.log('Order logging failed, fallback to WhatsApp only.', err);
        showToast(
          lang === 'en' ? "Email notice skipped, redirecting to WhatsApp..." : "Sähköposti-ilmoitus ohitettu, siirrytään WhatsAppiin...", 
          'error'
        );
        triggerWhatsAppRedirect();
      });
    } catch (err) {
      showToast(
        lang === 'en' ? "Connecting to WhatsApp..." : "Yhdistetään WhatsAppiin...", 
        'error'
      );
      triggerWhatsAppRedirect();
    }
  };

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
            <div className="relative group">
              <button className="text-sm font-medium hover:text-[#F48B7D] transition-colors duration-200 flex items-center gap-1">
                {t('navMenu')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-orange-100 py-2 w-48 flex flex-col">
                  <a href="#menu" className="px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-[#F48B7D] transition-colors whitespace-nowrap text-center">
                    {t('navStuffedCookies')}
                  </a>
                  <a href="#menu" className="px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-[#F48B7D] transition-colors whitespace-nowrap text-center border-t border-gray-50">
                    {t('navBrownies')}
                  </a>
                </div>
              </div>
            </div>
            <a href="#order" className="text-sm font-medium hover:text-[#F48B7D] transition-colors duration-200">
              {t('navOrder')}
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
      <ProductMenu lang={lang} t={t} />

      {/* PRE-ORDER FORM SECTION */}
      <section id="order" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#F48B7D] text-xs font-bold uppercase tracking-widest block">
              {t('orderTag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2D2D2D]">
              {t('orderTitle')}
            </h2>
            <div className="inline-block bg-gradient-to-r from-rose-400 to-[#F48B7D] text-white px-6 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md">
              {t('orderPromo')}
            </div>
          </div>

          <div id="order-builder-section" className="max-w-3xl mx-auto">
            <form onSubmit={handleOrderSubmit} className="space-y-8">
              
              {/* Step 1: Cookie selection stepper */}
              <ProductSelection 
                lang={lang} 
                t={t} 
                cart={cart} 
                updateQuantity={updateQuantity} 
                funfettiBonusCount={funfettiBonusCount} 
              />

              {/* Step 2: Special dietary requests */}
              <SpecialRequests
                t={t}
                specialRequests={form.specialRequests}
                handleInputChange={handleInputChange}
              />

              {/* Step 3: Contact details */}
              <ContactDetails
                t={t}
                form={form}
                handleInputChange={handleInputChange}
              />

              {/* Step 4: Date, time slots & delivery methods */}
              <DateTimeSelection
                t={t}
                form={form}
                handleInputChange={handleInputChange}
              />

              {/* Step 5: Deliver configurations */}
              <DeliveryMethod
                t={t}
                isFreeDelivery={isFreeDelivery}
                deliveryMethod={form.deliveryMethod}
                setForm={setForm}
              />

              {/* Checkout CTA block */}
              <CheckoutCTA
                t={t}
                finalTotal={finalTotal}
                paymentAcknowledge={paymentAcknowledge}
                setPaymentAcknowledge={setPaymentAcknowledge}
                validationError={validationError}
                isRedirecting={isRedirecting}
                handleOrderSubmit={handleOrderSubmit}
              />

              {isRedirecting && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center space-y-3 animate-pulse max-w-md mx-auto">
                  <span className="text-3xl block">🍪✨</span>
                  <h4 className="font-bold text-emerald-800 text-lg">{t('waRedirectTitle')}</h4>
                  <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                    {t('waRedirectDesc')}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

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
              © 2026 Velvet Crumbs. Handmade with love.
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

      {/* Toast Notification */}
      {toast.type && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          <span>{toast.type === 'success' ? '✨' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}