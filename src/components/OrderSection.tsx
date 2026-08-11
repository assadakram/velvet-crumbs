"use client";

import { useState, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';

import CookieSelection from './checkout/CookieSelection';
import SpecialRequests from './checkout/SpecialRequests';
import ContactDetails from './checkout/ContactDetails';
import DateTimeSelection from './checkout/DateTimeSelection';
import DeliveryMethod from './checkout/DeliveryMethod';
import CheckoutCTA from './checkout/CheckoutCTA';

import { COOKIES } from '../constants/cookies';
import type { PreorderSettings } from '../lib/preorderQueries';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '358413170359';

/**
 * Helper to parse a date and time string in the Europe/Helsinki timezone
 * and return a standard JavaScript Date object.
 */
function parseHelsinkiTime(dateStr: string, timeStr: string): Date {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Helsinki',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(utcDate);
    const partVal = (type: string) => Number(parts.find(p => p.type === type)?.value);

    const hYear = partVal('year');
    const hMonth = partVal('month');
    const hDay = partVal('day');
    const hHour = partVal('hour');
    const hMinute = partVal('minute');

    const helsinkiLocalAsUtc = Date.UTC(hYear, hMonth - 1, hDay, hHour, hMinute);
    const offset = helsinkiLocalAsUtc - utcDate.getTime();

    return new Date(utcDate.getTime() - offset);
  } catch (e) {
    console.error("Failed to parse Helsinki timezone date", e);
    return new Date(`${dateStr}T${timeStr}:00`);
  }
}

interface OrderSectionProps {
  lang: string;
  t: (key: string) => string;
}

export default function OrderSection({ lang, t }: OrderSectionProps) {
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
    deliveryMethod: 'delivery'
  });

  const [validationError, setValidationError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentAcknowledge, setPaymentAcknowledge] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  const [preorderSettings, setPreorderSettings] = useState<PreorderSettings | null>(null);
  const [serverOffset, setServerOffset] = useState<number>(0);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(true);

  const resumeDateObj = useMemo(() => {
    if (!preorderSettings || !preorderSettings.resumeDate) return null;
    const timeStr = preorderSettings.resumeTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(preorderSettings.resumeTime.trim())
      ? preorderSettings.resumeTime.trim()
      : '00:00';
    return parseHelsinkiTime(preorderSettings.resumeDate, timeStr);
  }, [preorderSettings]);

  const isCurrentlyPaused = useMemo(() => {
    if (!preorderSettings) return false;
    if (!preorderSettings.isPaused) return false;
    if (resumeDateObj) {
      const now = new Date(Date.now() + serverOffset);
      if (now >= resumeDateObj) return false;
    }
    return true;
  }, [preorderSettings, resumeDateObj, serverOffset]);

  const resumeStr = useMemo(() => {
    if (!resumeDateObj) return '';
    const datePart = resumeDateObj.toLocaleDateString(lang === 'fi' ? 'fi-FI' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const timePart = resumeDateObj.toLocaleTimeString(lang === 'fi' ? 'fi-FI' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: lang !== 'fi'
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
    setTimeout(() => setToast({ message: '', type: null }), 4000);
  };

  // Fetch pre-order settings
  useEffect(() => {
    fetch('/api/preorder-settings')
      .then(res => {
        if (!res.ok) throw new Error(`Settings API returned ${res.status}`);
        return res.json();
      })
      .then((data: PreorderSettings) => {
        if (data) {
          setPreorderSettings(data);
          if (data.isDeliveryEnabled === false) {
            setIsDeliveryEnabled(false);
            setForm(prev => ({ ...prev, deliveryMethod: 'pickup' }));
          }
        }
      })
      .catch(err => console.error('Failed to fetch pre-order settings:', err))
      .finally(() => setIsSettingsLoading(false));
  }, []);

  // Fetch server time offset
  useEffect(() => {
    fetch('/api/time')
      .then(res => {
        if (!res.ok) throw new Error(`Time API returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.serverTime) {
          const clientNow = Date.now();
          const serverNow = new Date(data.serverTime).getTime();
          setServerOffset(serverNow - clientNow);
        }
      })
      .catch(err => console.error("Failed to fetch server time:", err));
  }, []);

  // Sync date input min attribute
  useEffect(() => {
    const today = new Date(Date.now() + serverOffset);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const minDate = `${yyyy}-${mm}-${dd}`;
    const dateInput = document.getElementById('fdate');
    if (dateInput) dateInput.setAttribute('min', minDate);
  }, [serverOffset]);

  const { totalCookiesCount, isFreeDelivery, finalTotal, funfettiBonusCount } = useMemo(() => {
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
    } catch {
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
    <>
      {/* PRE-ORDER FORM SECTION */}
      <section id="order" className="py-12 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
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
            {isSettingsLoading ? (
              /* Loading skeleton — prevents form flashing before pause banner appears */
              <div className="space-y-5 animate-pulse max-w-3xl mx-auto">
                <div className="h-10 bg-orange-50 rounded-2xl w-3/4 mx-auto" />
                <div className="h-48 bg-orange-50 rounded-3xl" />
                <div className="h-32 bg-orange-50 rounded-3xl" />
                <div className="h-24 bg-orange-50 rounded-3xl" />
              </div>
            ) : isCurrentlyPaused ? (
              <div className="bg-[#FFF9F5] rounded-3xl border border-orange-100 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 border-4 border-gray-200 text-gray-400">
                  <Clock className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F48B7D] block">
                    Velvet Crumbs
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#2D2D2D] leading-snug">
                    {lang === 'fi' ? 'Tilaukset ovat tauolla' : 'Pre-Orders Are Paused'}
                  </h3>
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
                {isSettingsLoading ? (
                  <div className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5 animate-pulse">
                    <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
                      <div className="h-7 w-7 rounded-full bg-rose-100/50"></div>
                      <div className="h-6 w-32 bg-rose-100/50 rounded"></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="h-32 bg-white rounded-2xl border border-orange-100"></div>
                      <div className="h-32 bg-white rounded-2xl border border-orange-100"></div>
                    </div>
                  </div>
                ) : (
                  <DeliveryMethod
                    t={t}
                    isFreeDelivery={isFreeDelivery}
                    deliveryMethod={form.deliveryMethod}
                    setForm={setForm}
                    isDeliveryEnabled={isDeliveryEnabled}
                  />
                )}

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
    </>
  );
}
