"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Truck, 
  Calendar, 
  Clock, 
  Globe, 
  Plus, 
  Minus, 
  User, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

// Unified Cookie list with your exact descriptions and specified ingredients
const COOKIES = [
  { 
    id: 'choc',
    img: '/images/1.Chochlate_Indulgence.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-amber-800 to-amber-950',
    name: { en: 'Chocolate Indulgence', fi: 'Suklaaunelma' },
    desc: { 
      en: 'A rich chocolate cookie with plenty of chocolate chunks and a gooey hazelnut cocoa center.',
      fi: 'Täyteläinen suklaakeksi, jossa on runsaasti suklaalohkoja ja pehmeä hasselpähkinäsuklaasydän.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk'],
      fi: ['Kananmuna', 'Vehnä', 'Maito'] 
    }
  },
  { 
    id: 'nutella',
    img: '/images/1.Nutella_choch_chip.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-amber-600 to-amber-800',
    name: { en: 'Hazelnut Chocolate Chip', fi: 'Hasselpähkinä Suklaahippu' },
    desc: { 
      en: 'Classic cookie dough with chocolate chips and a soft hazelnut spread filling.',
      fi: 'Klassinen keksitaikina suklaahipuilla ja pehmeällä hasselpähkinälevitetäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Hazelnut'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Hasselpähkinä'] 
    }
  },
  { 
    id: 'lotus',
    img: '/images/1.Lotus_Gold.png', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-yellow-700 to-amber-800',
    name: { en: 'Caramel Gold', fi: 'Karamelli Kulta' },
    desc: { 
      en: 'A caramelized biscuit cookie with white chocolate chips and a soft, gooey caramel filling.',
      fi: 'Karamellisoitu keksi valkosuklaahipuilla ja pehmeällä, valuvalla karamellitäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk'],
      fi: ['Kananmuna', 'Vehnä', 'Maito'] 
    }
  },
  { 
    id: 'ruby',
    img: '/images/1.Ruby_Velvet_Bliss.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-rose-400 to-rose-600',
    name: { en: 'Ruby Velvet Bliss', fi: 'Ruby Velvet Bliss' },
    desc: { 
      en: 'Soft red cookie dough with white chocolate chips and a rich cream cheese filling in the center.',
      fi: 'Pehmeä punainen keksitaikina valkosuklaahipuilla ja täyteläisellä tuorejuustotäytteellä keskellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Food color'],
      fi: ['Kananmuna', 'Vehnä', 'Elintarvikeväri'] 
    }
  },
  { 
    id: 'carrot',
    img: '/images/1.Carrot_Cake_cookie.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-orange-500 to-amber-600',
    name: { en: 'Carrot Cake Cookie', fi: 'Porkkanakakku' },
    desc: { 
      en: 'A carrot cake-inspired cookie with toasted walnuts and a mildly spiced cream cheese filling.',
      fi: 'Porkkanakakusta inspiroitunut keksi paahdetuilla saksanpähkinöillä ja miedosti maustetulla tuorejuustotäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Walnut', 'Carrot'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Saksanpähkinä', 'Porkkana'] 
    }
  },
  { 
    id: 'peanut',
    img: '/images/1.Peanut_Dusk.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-amber-700 to-amber-900',
    name: { en: 'Peanut Dusk', fi: 'Pähkinähämärä' },
    desc: { 
      en: 'A cookie with roasted peanuts, white and dark chocolate, and a rich peanut butter filling.',
      fi: 'Keksi paahdetuilla maapähkinöillä, valko- ja tummasuklaalla sekä täyteläisellä maapähkinävoitäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Peanut'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Maapähkinä'] 
    }
  },
  { 
    id: 'jam',
    img: '/images/1.Jam_swirl.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-red-600 to-pink-700',
    name: { en: 'Jam Swirl', fi: 'Hillokierre' },
    desc: { 
      en: 'A chocolate cookie filled with a soft cream cheese and jam filling, finished with raspberry jam.',
      fi: 'Suklaakeksi, jossa pehmeä tuorejuusto- ja hillotäyte, viimeistelty vadelmahillolla.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Jam'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Hillo'] 
    }
  },
  { 
    id: 'funfetti',
    img: '/images/1.Funfetti_surprise.jpg', 
    price: 0, 
    origPrice: 0, 
    special: true,
    color: 'from-purple-400 to-pink-500',
    name: { en: 'Funfetti Surprise', fi: 'Funfetti-yllätys' },
    desc: { 
      en: 'A colorful birthday-cake treat with crisp Smarties and a molten milk chocolate core. Auto-added on orders of 8+ cookies!',
      fi: 'Värikäs herkkukeksi täynnä Smarties-suklaarakeita ja maitosuklaasydän. Lisätään lahjaksi 8+ keksin laatikoihin!' 
    },
    ingredients: { 
      en: ['Smarties', 'Milk chocolate chunks', 'Colorful sprinkles', 'Sweet butter dough'],
      fi: ['Smarties-rakeet', 'Maitosuklaapalat', 'Värikkäät strösselit', 'Voi-sokeritaikina'] 
    }
  }
];

const TRANSLATIONS = {
  en: {
    allergenWarn: "Allergen notice: Most cookies contain wheat, eggs, nuts, and dairy. Lactose-free options are gladly made to order — just describe your needs in the special requests block.",
    brandName: "Velvet Crumbs",
    navStory: "Our Story",
    navMenu: "Flavors",
    navOrder: "Order",
    heroTitle: "Hand-made with love",
    heroSubtitle: "Kotoisia pehmeitä herkkuja",
    heroDesc: "The delightful science of flavors meets dedicated home baking. Discover cookies with soft, flavorful centers, baked fresh and delivered in Turku, Raisio, & Kaarina.",
    promoFreeDel: "FREE DELIVERY when ordering 6 or more cookies in local service areas!",
    promoBonusGift: "FREE SURPRISE COOKIE added with every batch of 8 cookies!",
    btnBuild: "Order Your Box →",
    btnExplore: "Explore Flavors",
    badgeFresh: "Only pre-orders",
    storyTag: "Sara's Vision",
    storyTitle: "The Chemistry of Cozy Sweets",
    storyBody1: "Velvet Crumbs was dreamed up by Sara, a food science expert who curates an exquisite palette of comforting flavors. By pairing precise baking science with premium ingredients from rich caramelized cookie butter and classic Red Velvet to sweet swirls of artisan jam we craft cozy treats designed to bring absolute joy to your table.",
    storyBody2: "We believe a cookie should be crunchy on the edge, cloud-soft throughout, and hide a luscious surprise inside. Every single dough batch is rolled individually, monitored meticulously, and delivered directly to you.",
    menuTag: "The Bakery Menu",
    menuTitle: "Our tempting flavours",
    menuPromo: "🎉 Launch Special: All gourmet cookies only 3,99 € (Standard 4,50 €)",
    keyIngredients: "Ingredients",
    orderTag: "Request Fresh Baking",
    orderTitle: "Pre-order Request",
    orderPromo: "🎁 Order 6+ cookies → FREE delivery in Turku, Raisio & Kaarina!",
    secContact: "1. Contact Information",
    fullName: "Full Name *",
    phone: "Phone / WhatsApp *",
    email: "Email Address (Optional)",
    address: "Delivery Address *",
    addressPlaceholder: "Street, postal code, city",
    secPick: "2. Build Your Box Selection",
    stepperSub: "Adjust quantities of your desired flavors. Launch Price: 3,99 € each.",
    bonusTitle: "Bonus Surprise Cookie:",
    bonusDesc: "We will include 1 extra Surprise Cookie totally free with every order of 8 or more cookies!",
    currentBox: "Your Selected Box",
    colCookie: "Cookie Type",
    colQty: "Qty",
    colPrice: "Price",
    secTime: "3. Delivery Date & Time",
    delDate: "Delivery / Pickup Date *",
    timeWindow: "Preferred Time Window",
    anyTime: "Any time of day",
    slotMorning: "Morning (10:00 – 12:00)",
    slotNoon: "Noon (12:00 – 14:00)",
    slotAfternoon: "Afternoon (14:00 – 17:00)",
    slotEvening: "Evening (17:00 – 20:00)",
    secDiet: "4. Special Requests & Dietaries",
    dietSub: "List any dietary reservations such lactose-free, or any particulars for gift box",
    secDel: "5. Delivery Method Selection",
    delSweet: "Sweet Deal: You unlocked free local delivery!",
    delDirect: "Home Delivery",
    delPickup: "Self-Pickup",
    delRegion: "Turku · Raisio · Kaarina",
    delCenter: "Kunnallissairaalantie 52A 48, 20810 Turku",
    estTotal: "Estimated Total Price",
    waWarning: "Final prices are explicitly reviewed and confirmed before baking.",
    btnSendWA: "Submit Order Request",
    waNote: "Your order will be securely transmitted. We will contact you shortly to confirm.",
    alertValidCart: "⚠️ Please add at least 1 delicious cookie to your selection box!",
    alertValidFields: "⚠️ Please complete all required fields (Name, Phone, and Delivery Date).",
    alertValidAddress: "⚠️ Please provide your delivery address for Home Delivery.",
    waRedirectTitle: "Processing Your Order Request",
    waRedirectDesc: "Your order details have been securely recorded. We are preparing to coordinate delivery window options.",
    payTitle: "Payment & Confirmation Policy",
    payDesc: "No payment is collected during checkout. Once we receive your request, we will contact you privately (via WhatsApp or Email) to confirm availability and share payment details (MobilePay or Bank Transfer). In most cases, orders are confirmed once a payment screenshot is shared. Cash on pickup/delivery is accepted in select cases.",
    payAck: "I understand that my order is baked fresh and only confirmed once payment is made in advance (MobilePay/Bank Transfer) and a screenshot of the payment is shared.",
    alertPayAck: "⚠️ Please confirm that you understand the payment policy by checking the acknowledgment box."
  },
  fi: {
    allergenWarn: "Allergeenit: Suurin osa tuotteistamme sisältää vehnää, kananmunia, pähkinöitä ja maitotuotteita. Laktoosittomat vaihtoehdot tilattavissa — kirjoita toiveesi lisätietokenttään.",
    brandName: "Velvet Crumbs",
    navStory: "Tarinamme",
    navMenu: "Maut",
    navOrder: "Tilaus",
    heroTitle: "Kotoisia pehmeitä herkkuja",
    heroSubtitle: "Kotoisia pehmeitä herkkuja",
    heroDesc: "Koe täydellisen pehmeät ja täyteläiset maut kekseissämme. Leivotaan tilauksesta ja toimitetaan kotiisi Turun, Raision ja Kaarinan alueella.",
    promoFreeDel: "ILMAINEN TOIMITUS yli 6 keksin tilauksille lähialueillamme!",
    promoBonusGift: "ILMAINEN YLLÄTYSKEKSI lahjaksi jokaiseen 8 keksin laatikkoon!",
    btnBuild: "Tilaa Oma Laatikkosi →",
    btnExplore: "Selaa Makuja",
    badgeFresh: "Only pre-orders",
    storyTag: "Saran Tarina",
    storyTitle: "Kun Tiede Kohtaa Makeat Herkut",
    storyBody1: "Velvet Crumbs on Saran, elintarviketieteen asiantuntijan, luomus. Yhdistämällä tarkan leivontatieteen ja ensiluokkaiset raaka-aineet – täyteläisestä karamellisoidusta keksivoista ja klassisesta Red Velvetistä käsintehtyjen hillojen makeisiin kierteisiin – leivomme kotoisia herkkuja, jotka tuovat aitoa iloa pöytääsi.",
    storyBody2: "Uskomme, että täydellisen keksin tulee olla reunoilta rapea, sisältä pilvenpehmeä ja täynnä suussa sulavaa täytettä. Jokainen taikinapallo muotoillaan ja paistetaan suurella sydämellä.",
    menuTag: "Valikoima",
    menuTitle: "Houkuttelevat makumme",
    menuPromo: "🎉 Avajaistarjous: Kaikki herkkukeksit vain 3,99 € (Normaalisti 4,50 €)",
    keyIngredients: "Ingredients",
    orderTag: "Tee Tilaus",
    orderTitle: "Tilauskysely",
    orderPromo: "🎁 Tilaa 6+ keksiä → ILMAINEN kotiinkuljetus Turussa, Raisiossa & Kaarinassa!",
    secContact: "1. Yhteystiedot",
    fullName: "Nimi *",
    phone: "Puhelin / WhatsApp *",
    email: "Sähköposti (Valinnainen)",
    address: "Toimitusosoite *",
    addressPlaceholder: "Katuosoite, postinumero, kaupunki",
    secPick: "2. Valitse Makusi ja Määrät",
    stepperSub: "Lisää haluamiesi makujen määriä laatikoosi. Avajaishinta vain 3,99 € / kpl.",
    bonusTitle: "Automaattinen lahja:",
    bonusDesc: "Lisäämme lahjaksi 1 ylimääräisen yllätyskeksin ilmaiseksi aina, kun tilaat vähintään 8 herkkukeksiä!",
    currentBox: "Valittu Sisältö",
    colCookie: "Keksityyppi",
    colQty: "Kpl",
    colPrice: "Hinta",
    secTime: "3. Toivottu Toimituspäivä & Aika",
    delDate: "Toimituksen Päivämäärä *",
    timeWindow: "Toivottu Aikaikkuna",
    anyTime: "Sopii mikä vain aika",
    slotMorning: "Aamupäivä (10:00 – 12:00)",
    slotNoon: "Keskipäivä (12:00 – 14:00)",
    slotAfternoon: "Iltapäivä (14:00 – 17:00)",
    slotEvening: "Ilta (17:00 – 20:00)",
    secDiet: "4. Erityistoiveet & Allergiat",
    dietSub: "Kerro tässä ruokavaliorajoitteista (kuten laktoositon) tai lahjalaatikkoon liittyvistä toiveista",
    secDel: "5. Toimitustapa",
    delSweet: "Loistavaa: Olet oikeutettu ilmaiseen kuljetukseen!",
    delDirect: "Kotiinkuljetus",
    delPickup: "Nouto",
    delRegion: "Turku · Raisio · Kaarina",
    delCenter: "Turun keskusta",
    estTotal: "Arvioitu Kokonaissumma",
    waWarning: "Lopullinen hinta tarkastetaan ja vahvistetaan kanssasi.",
    btnSendWA: "Lähetä tilauskysely",
    waNote: "Tilaustietosi lähetetään eteenpäin suojatusti. Otamme sinuun pian yhteyttä.",
    alertValidCart: "⚠️ Valitsethan vähintään yhden herkkukeksin tilaukseesi!",
    alertValidFields: "⚠️ Täytäthän kaikki pakolliset kentät (Nimi, Puhelin ja Toimituspäivä).",
    alertValidAddress: "⚠️ Ilmoitathan toimitusosoitteen kotiinkuljetusta varten.",
    waRedirectTitle: "Käsitellään tilaustasi",
    waRedirectDesc: "Tilaustietosi on kirjattu suojatusti ylös. Valmistelemme toimitusaikojen vahvistamista.",
    bonusItem: "Lahjakeksi",
    payTitle: "Maksutiedot & Vahvistuskäytäntö",
    payDesc: "Sivustolla ei vastaanoteta maksuja. Saatuamme pyyntösi otamme sinuun yhteyttä (WhatsApp tai sähköposti) vahvistaaksemme saatavuuden ja lähetämme maksutiedot (MobilePay tai tilisiirto). Tilaus vahvistetaan, kun lähetät meille maksukuitin/-kuvakaappauksen. Käteinen noudettaessa/toimitettaessa sopimuksen mukaan.",
    payAck: "Ymmärrän, että tilaukseni leivotaan tuoreena ja vahvistetaan vasta, kun ennakkomaksu (MobilePay/tilisiirto) on suoritettu ja maksukuitti/-kuvakaappaus on jaettu.",
    alertPayAck: "⚠️ Vahvistathan lukeneesi maksuehdot valitsemalla vahvistusruudun."
  }
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '358413170359';

function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function Instagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Facebook({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [cart, setCart] = useState({
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

  const t = (key) => TRANSLATIONS[lang][key] || key;

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

  const updateQuantity = (id, change) => {
    setCart(prev => {
      const updatedVal = Math.max(0, Math.min(50, prev[id] + change));
      return { ...prev, [id]: updatedVal };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (totalCookiesCount === 0) {
      setValidationError(t('alertValidCart'));
      document.getElementById('order-builder-section').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!form.name.trim() || !form.phone.trim() || !form.date) {
      setValidationError(t('alertValidFields'));
      return;
    }

    if (form.deliveryMethod === 'delivery' && !form.address.trim()) {
      setValidationError(t('alertValidAddress'));
      return;
    }

    if (!paymentAcknowledge) {
      setValidationError(t('alertPayAck'));
      return;
    }

    let cookieLines = '';
    Object.keys(cart).forEach(id => {
      const qty = cart[id];
      if (qty > 0) {
        const cookieObj = COOKIES.find(c => c.id === id);
        cookieLines += `• ${cookieObj.name[lang]} x ${qty} (${(qty * cookieObj.price).toFixed(2)} €)\n`;
      }
    });

    if (funfettiBonusCount > 0) {
      const funfettiObj = COOKIES.find(c => c.id === 'funfetti');
      cookieLines += `🎁 ${funfettiObj.name[lang]} x ${funfettiBonusCount} (${t('bonusItem')})\n`;
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
              <img 
                src="/images/Logo.jpg" 
                alt="Velvet Crumbs Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as any;
                  target.style.display = 'none';
                  target.parentNode.innerHTML = '<span class="text-xs font-serif font-bold text-[#F48B7D]">VC</span>';
                }}
              />
            </div>
            <span className="text-sm sm:text-xl font-bold tracking-tight text-[#F48B7D] font-serif leading-tight whitespace-normal">
              {t('brandName')}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#story" className="text-sm font-medium hover:text-[#F48B7D] transition-colors duration-200">
              {t('navStory')}
            </a>
            <a href="#cookies" className="text-sm font-medium hover:text-[#F48B7D] transition-colors duration-200">
              {t('navMenu')}
            </a>
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
      {}
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
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-orange-100 flex items-center justify-center">
                <img 
                  src="/images/Main.jpg" 
                  alt="Velvet Crumbs Baking Showcase" 
                  className="w-full h-full object-cover transform hover:scale-105 duration-700 transition-transform" 
                  onError={(e) => {
                    (e.target as any).src = "/images/Logo.jpg";
                  }}
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

      {/* OUR STORY SECTION */}
      {}
      <section id="story" className="py-20 bg-white border-y border-orange-100/50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-[#F48B7D] text-xs font-bold uppercase tracking-widest block">
            {t('storyTag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2D2D2D]">
            {t('storyTitle')}
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-gray-600 italic font-serif max-w-3xl mx-auto">
            "{t('storyBody1')}"
          </p>
          <div className="w-12 h-1 bg-rose-200 mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base leading-relaxed text-gray-500 max-w-2xl mx-auto">
            {t('storyBody2')}
          </p>
        </div>
      </section>

      {/* SIGNATURE COOKIE MENU SECTION */}
      {}
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
                  <img 
                    src={c.img} 
                    alt={c.name[lang]} 
                    className="w-full h-full object-cover hover:scale-105 duration-500 transition-transform" 
                    onError={(e) => {
                      (e.target as any).src = "/images/1.Chochlate_Indulgence.jpg";
                    }}
                  />
                  {c.special && (
                    <span className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      Bonus
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
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
                    <p className="text-sm text-gray-600 leading-relaxed min-h-[5rem]">
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
              
              {}
              {/* Step 1: Contact details */}
              <div className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
                <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">1</span>
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

              {}
              {/* Step 2: Cookie selection stepper */}
              <div className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
                <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">2</span>
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
                        <img src={c.img} alt="" className="w-full h-full object-cover" />
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
                              <td className="py-2.5 px-1.5 italic font-medium">🎁 {COOKIES.find(c => c.id === 'funfetti').name[lang]}</td>
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

              {}
              {/* Step 3: Date, time slots & delivery methods */}
              <div className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
                <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">3</span>
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

              {}
              {/* Step 4: Special dietary requests */}
              <div className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
                <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">4</span>
                  <h3 className="font-bold text-base sm:text-lg text-[#F48B7D] uppercase tracking-wider">{t('secDiet')}</h3>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-[#F48B7D]" /> {t('dietSub')}
                  </label>
                  <textarea 
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g. Please make the Chocolate Indulgence cookies lactose-free, or this is a birthday surprise gift box!"
                    className="w-full px-4 py-3.5 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/20 focus:border-[#F48B7D] bg-white text-sm sm:text-base text-gray-800"
                  />
                </div>
              </div>

              {}
              {/* Step 5: Deliver configurations */}
              <div className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
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
                    onClick={() => setForm(prev => ({ ...prev, deliveryMethod: 'delivery' }))}
                    className={`cursor-pointer flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-200 ${
                      form.deliveryMethod === 'delivery' 
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
                    onClick={() => setForm(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
                    className={`cursor-pointer flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-200 ${
                      form.deliveryMethod === 'pickup' 
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

              {/* Checkout CTA block */}
              <div className="bg-[#F48B7D] text-white p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-lg">
                <div className="space-y-1">
                  <p className="text-xs uppercase font-bold tracking-widest opacity-80">
                    {t('estTotal')}
                  </p>
                  <div className="text-4xl sm:text-5xl font-extrabold font-serif">
                    {finalTotal.toFixed(2).replace('.', ',')} €
                  </div>
                  <p className="text-xs opacity-75">
                    {t('waWarning')}
                  </p>
                </div>

                <div className="bg-white border border-rose-100 rounded-2xl p-4.5 text-left space-y-2 max-w-md mx-auto text-[11px] sm:text-xs shadow-md">
                  <h4 className="font-bold flex items-center gap-1.5 text-amber-700">
                    <span>💡</span> {t('payTitle')}
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {t('payDesc')}
                  </p>
                </div>

                <label className="cursor-pointer flex items-start gap-3 max-w-md mx-auto text-left text-white/95 text-[11px] sm:text-xs font-semibold select-none mt-3.5 group">
                  <div className="relative shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={paymentAcknowledge} 
                      onChange={(e) => setPaymentAcknowledge(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      paymentAcknowledge 
                        ? 'bg-white border-white text-[#F48B7D] scale-105 shadow-md' 
                        : 'border-white/50 bg-white/10 group-hover:border-white group-hover:bg-white/20'
                    }`}>
                      {paymentAcknowledge && (
                        <svg className="w-3.5 h-3.5 stroke-current stroke-[3.5] fill-none" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="leading-relaxed">
                    {t('payAck')}
                  </span>
                </label>

                {validationError && (
                  <div className="bg-white/15 border border-white/25 text-rose-50 text-xs sm:text-sm font-bold p-3 rounded-xl max-w-md mx-auto">
                    {validationError}
                  </div>
                )}

                <button 
                  type="submit" 
                  onClick={handleOrderSubmit}
                  disabled={isRedirecting}
                  className="cursor-pointer w-full max-w-md mx-auto bg-white text-[#F48B7D] hover:bg-rose-50 px-6 py-4 rounded-xl font-bold text-base sm:text-lg shadow-md active:scale-95 duration-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>📲</span>
                  <span>{t('btnSendWA')}</span>
                </button>

                <p className="text-xs opacity-75 italic">
                  {t('waNote')}
                </p>
              </div>

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
      {}
      <footer className="bg-white border-t border-orange-100/50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-sm">
                <img 
                  src="/images/Logo.jpg" 
                  alt="Velvet Crumbs Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as any;
                    target.style.display = 'none';
                    target.parentNode.innerHTML = '<span class="text-xs font-serif font-bold text-white">VC</span>';
                  }}
                />
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