import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur' | 'roman';

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
    roman: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & Nav
  appName: {
    en: 'Kaam Wala Pakistan',
    ur: 'کام والا پاکستان',
    roman: 'Kaam Wala Pakistan',
  },
  findWorkers: {
    en: 'Find Workers',
    ur: 'مستری / ورکر تلاش کریں',
    roman: 'Workers Dhundiye',
  },
  browseServices: {
    en: 'Services',
    ur: 'خدمات',
    roman: 'Khidmaat / Services',
  },
  howItWorks: {
    en: 'How It Works',
    ur: 'یہ کیسے کام کرتا ہے',
    roman: 'Yeh Kaise Kaam Karta Hai',
  },
  joinAsWorker: {
    en: 'Join as Worker',
    ur: 'ورکر کے طور پر شامل ہوں',
    roman: 'Worker Banein',
  },
  login: {
    en: 'Log In',
    ur: 'لاگ اِن',
    roman: 'Login Karein',
  },
  logout: {
    en: 'Log Out',
    ur: 'لاگ آؤٹ',
    roman: 'Logout Karein',
  },
  myBookings: {
    en: 'My Bookings',
    ur: 'میری بکنگز',
    roman: 'Meri Bookings',
  },
  customerDashboard: {
    en: 'Customer Portal',
    ur: 'کسٹمر پورٹل',
    roman: 'Customer Dashboard',
  },
  workerDashboard: {
    en: 'Worker Portal',
    ur: 'ورکر پورٹل',
    roman: 'Worker Dashboard',
  },
  adminDashboard: {
    en: 'Admin Panel',
    ur: 'ایڈمن پینل',
    roman: 'Admin Panel',
  },
  // Hero
  heroTitle: {
    en: "Pakistan's Trusted Network for Skilled Local Workers",
    ur: 'پاکستان کا سب سے بااعتماد ہنرمند ورکرز نیٹ ورک',
    roman: "Pakistan Ka Sab Se Ba-Aitmad Hunarmand Workers Network",
  },
  heroSubtitle: {
    en: 'Connect directly with verified electricians, plumbers, AC technicians, carpenters, solar technicians and more. 100% Free — No commission, no hidden charges.',
    ur: 'الیکٹریشن، پلمبر، اے سی مکینک، بڑھئی اور سولر ٹیکنیشن سے براہِ راست رابطہ کریں۔ بالکل مفت — کوئی کمیشن نہیں، کوئی فیس نہیں۔',
    roman: 'Bijli, Nal, AC, Lakri aur Solar mistriyon se seedha rabta karein. 100% Muft — Zero commission, zero charges.',
  },
  searchPlaceholder: {
    en: 'Search service e.g. Electrician, AC Repair, Plumber...',
    ur: 'سروس تلاش کریں جیسے الیکٹریشن، اے سی، پلمبر...',
    roman: 'Service search karein mislan Electrician, Plumber...',
  },
  selectProvince: {
    en: 'Select Province',
    ur: 'صوبہ منتخب کریں',
    roman: 'Suba Muntakhab Karein',
  },
  selectCity: {
    en: 'Select City',
    ur: 'شہر منتخب کریں',
    roman: 'Shehar Muntakhab Karein',
  },
  searchButton: {
    en: 'Find Skilled Worker',
    ur: 'ہنرمند ورکر تلاش کریں',
    roman: 'Worker Dhundein',
  },
  // Features
  zeroCommission: {
    en: '100% Free Platform',
    ur: '100% مفت پلیٹ فارم',
    roman: '100% Muft Platform',
  },
  zeroCommissionDesc: {
    en: 'No middleman cut. Customers and workers arrange payment directly in PKR (Cash / EasyPaisa / JazzCash).',
    ur: 'درمیان میں کوئی کمیشن نہیں۔ گاہک اور ورکر آپس میں نقد یا ایزی پیسہ/جاز کیش طے کرتے ہیں۔',
    roman: 'Koi commission nahi. Payment seedhi worker aur customer ke darmiyan cash ya EasyPaisa se.',
  },
  directContact: {
    en: 'Direct Call & WhatsApp',
    ur: 'ڈائریکٹ فون اور واٹس ایپ',
    roman: 'Seedha Phone & WhatsApp',
  },
  directContactDesc: {
    en: 'Instant click-to-call or WhatsApp messaging directly with the technician without delays.',
    ur: 'ٹیکنیشن سے فوراً کال یا واٹس ایپ پر بات چیت کریں۔',
    roman: 'Baghair rukawat mistri se foran call ya WhatsApp par rabta karein.',
  },
  adminApproved: {
    en: 'Admin-Reviewed Profiles',
    ur: 'ایڈمن سے تصدیق شدہ پروفائلز',
    roman: 'Admin Checked Profiles',
  },
  adminApprovedDesc: {
    en: 'Worker credentials, contact numbers, and experience details are reviewed before listing.',
    ur: 'ورکر کا تجربہ اور رابطہ تفصیلات جانچنے کے بعد لسٹ کیے جاتے ہیں۔',
    roman: 'Worker ki maloomat check karne ke baad platform par shamil ki jati hain.',
  },
  // Common Buttons
  bookNow: {
    en: 'Book Service',
    ur: 'سروس بک کریں',
    roman: 'Service Book Karein',
  },
  callWorker: {
    en: 'Call Now',
    ur: 'ابھی کال کریں',
    roman: 'Abhi Call Karein',
  },
  chatWhatsapp: {
    en: 'Chat on WhatsApp',
    ur: 'واٹس ایپ پر رابطہ',
    roman: 'WhatsApp Par Rabta',
  },
  visitingCharges: {
    en: 'Visit Charges',
    ur: 'وزٹ فیس',
    roman: 'Visit Charges',
  },
  experience: {
    en: 'Experience',
    ur: 'تجربہ',
    roman: 'Tajurba',
  },
  reviews: {
    en: 'Reviews',
    ur: 'رائے اور ریٹنگ',
    roman: 'Reviews',
  },
  completedJobs: {
    en: 'Completed Jobs',
    ur: 'مکمل شدہ کام',
    roman: 'Mukammal Kaam',
  },
  quickDemoLogin: {
    en: 'Quick Demo Login',
    ur: 'فوری ڈیمو لاگ اِن',
    roman: 'Quick Demo Login',
  },
  switchLanguage: {
    en: 'Language',
    ur: 'زبان',
    roman: 'Zuban',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kwp_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kwp_language', lang);
    if (lang === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  };

  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
