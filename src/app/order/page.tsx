"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  Globe, 
  AlertTriangle,
  ArrowLeft,
  Clock
} from 'lucide-react';

import { TikTokIcon, Instagram, Facebook } from '../../components/Icons';
import CookieSelection from '../../components/checkout/CookieSelection';
import SpecialRequests from '../../components/checkout/SpecialRequests';
import ContactDetails from '../../components/checkout/ContactDetails';
import DateTimeSelection from '../../components/checkout/DateTimeSelection';
import DeliveryMethod from '../../components/checkout/DeliveryMethod';
import CheckoutCTA from '../../components/checkout/CheckoutCTA';

import { COOKIES } from '../../constants/cookies';
import { TRANSLATIONS } from '../../constants/translations';
import { sanityClient } from '../../lib/sanityClient';
import { PREORDER_SETTINGS_QUERY, type PreorderSettings } from '../../lib/preorderQueries';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '358413170359';

export default function OrderPage() {
  const [lang, setLang] = useState('en');
  const [navLogoError, setNavLogoError] = useState(false);
  const [footerLogoError, setFooterLogoError] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({
    ruby: 0,
    nutella: 0,
    choc: 0,
    carrot: 0,
    lotus: 0,
    peanut: 0,
    jam: 0
  });

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
  const [preorderSettings, setPreorderSettings] = useState<PreorderSettings | null>(null);

  const resumeDateObj = useMemo(() => {
    if (!preorderSettings || !preorderSettings.resumeDate) return null;
    const timeStr = preorderSettings.resumeTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(preorderSettings.resumeTime.trim())
      ? preorderSettings.resumeTime.trim()
      : '00:00';
    return new Date(`${preorderSettings.resumeDate}T${timeStr}:00`);
  }, [preorderSettings]);

  const isCurrentlyPaused = useMemo(() => {
    if (!preorderSettings) return false;
    if (!preorderSettings.isPaused) return false;
    
    if (resumeDateObj) {
      const now = new Date();
      if (now >= resumeDateObj) {
        return false;
      }
    }
    return true;
  }, [preorderSettings, resumeDateObj]);

  const resumeStr = useMemo(() => {
    if (!resumeDateObj) return '';
    const datePart = resumeDateObj.toLocaleDateString(lang === 'fi' ? 'fi-FI' : 'en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
    const timePart = resumeDateObj.toLocaleTimeString(lang === 'fi' ? 'fi-FI' : 'en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const capitalizedDate = datePart.charAt(0).toUpperCase() + datePart.slice(1);
    if (lang === 'fi') {
      return `Jatkuu: ${capitalizedDate} klo ${timePart}`;
    }
    return `Resuming: ${capitalizedDate} at ${timePart}`;
  }, [resumeDateObj, lang]);

  const pausedMessage = useMemo(() => {
    if (!preorderSettings) return '';
    const customMsg = lang === 'fi' ? preorderSettings.pausedMessageFi : preorderSettings.pausedMessageEn;
    if (customMsg) return customMsg;
    
    // Default fallback messages
    if (lang === 'fi') {
      return resumeStr 
        ? `Olemme tällä hetkellä täynnä. Ennakkotilaukset jatkuvat ${resumeStr.replace('Jatkuu: ', '')}. Seuraa meitä Instagramissa saadaksesi päivityksiä!`
        : `Olemme tällä hetkellä täynnä emmekä ota uusia tilauksia. Seuraa meitä Instagramissa saadaksesi tiedon, kun tilaukset avautuvat uudelleen!`;
    } else {
      return resumeStr
        ? `We are currently fully booked. Pre-orders will resume on ${resumeStr.replace('Resuming: ', '')}. Follow us on Instagram for updates!`
        : `We're currently fully booked and not accepting new orders. Follow us on Instagram for updates on when pre-orders reopen!`;
    }
  }, [preorderSettings, resumeStr, lang]);

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

  // Fetch pre-order settings from Sanity (graceful — fails silently if not configured)
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return;
    console.log("Fetching pre-order settings from Sanity...");
    sanityClient
      .fetch(PREORDER_SETTINGS_QUERY)
      .then((data: PreorderSettings) => {
        console.log("Sanity pre-order settings fetched successfully:", data);
        if (data) setPreorderSettings(data);
      })
      .catch((err) => {
        console.error("Failed to fetch pre-order settings from Sanity:", err);
      });
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
      const cookieObj = COOKIES.find(c => c.id === id);
      count += q;
      cost += q * (cookieObj ? cookieObj.price : 0);
    });

    const freeDeliveryQualified = count >= 6;
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
      const updatedVal = Math.max(0, Math.min(50, prev[id] + change));
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

    if (isCurrentlyPaused) {
      setValidationError(lang === 'fi' ? '⚠️ Ennakkotilaukset ovat tällä hetkellä tauolla!' : '⚠️ Pre-orders are currently paused!');
      return;
    }

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
        const cookieObj = COOKIES.find(c => c.id === id);
        if (cookieObj) {
          cookieLines += `• ${cookieObj.name[lang]} x ${qty} (${(qty * cookieObj.price).toFixed(2)} €)\n`;
        }
      }
    });

    if (funfettiBonusCount > 0) {
      const funfettiObj = COOKIES.find(c => c.id === 'funfetti');
      if (funfettiObj) {
        cookieLines += `🎁 ${funfettiObj.name[lang]} x ${funfettiBonusCount} (${t('bonusItem')})\n`;
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

    try {
      setIsRedirecting(true);
      const triggerWhatsAppRedirect = () => {
        setTimeout(() => {
          const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderPayloadText)}`;
          window.open(url, '_blank');
          setIsRedirecting(false);
        }, 1200);
      };
      
      fetch('/api/order-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          date: form.date,
          deliveryMethod: form.deliveryMethod,
          totalCost: finalTotal,
          items: cart
        })
      }).then(() => {
        triggerWhatsAppRedirect();
      }).catch(() => {
        triggerWhatsAppRedirect();
      });
    } catch (err) {
      showToast(
        lang === 'en' ? "Connecting to WhatsApp..." : "Yhdistetään WhatsAppiin...", 
        'error'
      );
      setTimeout(() => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderPayloadText)}`;
        window.open(url, '_blank');
        setIsRedirecting(false);
      }, 1200);
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
          <a href={`/?lang=${lang}`} className="flex items-center gap-2 sm:gap-3 group">
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

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a 
              href={`/?lang=${lang}`}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#F48B7D] transition-colors py-2 px-4 rounded-full border border-orange-100 bg-white shadow-sm mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === 'fi' ? 'Takaisin etusivulle' : 'Back to Home'}
            </a>
            <button 
              onClick={() => setLang(lang === 'en' ? 'fi' : 'en')}
              className="cursor-pointer text-xs font-bold border-2 border-[#F48B7D] text-[#F48B7D] hover:bg-[#F48B7D] hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 uppercase tracking-wider"
              aria-label="Toggle language"
            >
              <Globe className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Suomi' : 'English'}</span>
              <span className="sm:hidden">{lang === 'en' ? 'FI' : 'EN'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* BACK NAVIGATION FOR MOBILE */}
      <div className="md:hidden max-w-4xl mx-auto px-4 pt-6">
        <a 
          href={`/?lang=${lang}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#F48B7D] transition-colors py-2 px-4 rounded-full border border-orange-100 bg-white shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {lang === 'fi' ? 'Takaisin etusivulle' : 'Back to Home'}
        </a>
      </div>

      {/* PRE-ORDER FORM SECTION */}
      <section className="py-12 bg-white mt-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[#F48B7D] text-xs font-bold uppercase tracking-widest block">
              {t('orderTag')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2D2D2D]">
              {t('orderTitle')}
            </h1>
            <div className="inline-block bg-gradient-to-r from-rose-400 to-[#F48B7D] text-white px-6 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md">
              {t('orderPromo')}
            </div>
          </div>

          <div id="order-builder-section" className="max-w-3xl mx-auto">
            {isCurrentlyPaused ? (
              <div className="bg-[#FFF9F5] rounded-3xl border border-orange-100 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 border-4 border-gray-200 text-gray-400">
                  <Clock className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F48B7D] block">
                    Velvet Crumbs
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#2D2D2D] leading-snug">
                    {lang === 'fi' ? 'Tilaukset ovat tauolla' : 'Pre-Orders Are Paused'}
                  </h2>
                </div>
                {resumeStr && (
                  <div className="inline-flex items-center gap-2 bg-gray-150 border border-gray-200 text-gray-500 text-xs sm:text-sm font-bold px-4 py-2 rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{resumeStr}</span>
                  </div>
                )}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                  {pausedMessage}
                </p>
                <div className="pt-2">
                  <a
                    href="https://www.instagram.com/velvet.crumbs.fi?igsh=MWRlanN5cDF3Z3NwNA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F48B7D] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-sm sm:text-base"
                  >
                    {lang === 'fi' ? 'Seuraa Instagramissa' : 'Follow on Instagram'}
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-8">
                
                {/* Step 1: Cookie selection stepper */}
                <CookieSelection
                  lang={lang}
                  t={t}
                  cart={cart}
                  updateQuantity={updateQuantity}
                  totalCookiesCount={totalCookiesCount}
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
                  isCurrentlyPaused={isCurrentlyPaused}
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
            )}
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
