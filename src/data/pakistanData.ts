import { ServiceCategory, ProvinceLocation } from '../types';

export const PAKISTAN_PROVINCES: ProvinceLocation[] = [
  {
    name: 'Punjab',
    cities: [
      {
        name: 'Lahore',
        areas: ['Gulberg', 'DHA', 'Johar Town', 'Model Town', 'Bahria Town', 'Cantt', 'Iqbal Town', 'Faisal Town', 'Wapda Town', 'Samanabad', 'Shadman', 'Township', 'Allama Iqbal Town']
      },
      {
        name: 'Rawalpindi',
        areas: ['Saddar', 'Satellite Town', 'Westridge', 'Bahria Town', 'Chaklala Scheme', 'Peshawar Road', 'Adyala Road', 'Shamsabad', 'Commercial Market']
      },
      {
        name: 'Faisalabad',
        areas: ['D Ground', 'Madina Town', 'Civil Lines', 'Ghulam Muhammad Abad', 'Gulberg', 'Jinnah Colony', 'Samanabad', 'Millat Town']
      },
      {
        name: 'Multan',
        areas: ['Gulgasht Colony', 'Cantt', 'Bosan Road', 'Shamsabad', 'Shah Rukn-e-Alam', 'Mumtazabad', 'New Multan']
      },
      {
        name: 'Gujranwala',
        areas: ['DC Colony', 'Model Town', 'Civil Lines', 'Wapda Town', 'Satellite Town', 'People’s Colony']
      },
      {
        name: 'Sialkot',
        areas: ['Cantt', 'Model Town', 'Saddar', 'Kashmir Road', 'Ugoki', 'Paris Road']
      },
      {
        name: 'Bahawalpur',
        areas: ['Model Town', 'Cantt', 'Satellite Town', 'Cheema Town', 'Shahdrah']
      },
      {
        name: 'Sargodha',
        areas: ['Satellite Town', 'University Town', 'Civil Lines', 'Fatima Jinnah Colony']
      }
    ]
  },
  {
    name: 'Sindh',
    cities: [
      {
        name: 'Karachi',
        areas: ['Gulshan-e-Iqbal', 'Clifton', 'DHA', 'North Nazimabad', 'PECHS', 'Saddar', 'Malir', 'Korangi', 'Gulistan-e-Johar', 'Federal B Area', 'Bahria Town Karachi', 'Shah Faisal Colony', 'Nazimabad']
      },
      {
        name: 'Hyderabad',
        areas: ['Latifabad', 'Qasimabad', 'Cantt', 'Saddar', 'Citizen Colony', 'Auto Bhan']
      },
      {
        name: 'Sukkur',
        areas: ['Military Road', 'Barrage Colony', 'Civil Lines', 'Old Sukkur']
      },
      {
        name: 'Larkana',
        areas: ['VIP Road', 'Civil Lines', 'Resham Gali', 'Lahori Mohalla']
      }
    ]
  },
  {
    name: 'Islamabad Capital Territory',
    cities: [
      {
        name: 'Islamabad',
        areas: ['F-6', 'F-7', 'F-8', 'F-10', 'F-11', 'G-8', 'G-9', 'G-10', 'G-11', 'G-13', 'I-8', 'I-9', 'I-10', 'E-11', 'Bahria Town', 'DHA Phase 2', 'PWD Housing Society', 'Bani Gala', 'Blue Area']
      }
    ]
  },
  {
    name: 'Khyber Pakhtunkhwa',
    cities: [
      {
        name: 'Peshawar',
        areas: ['Hayatabad', 'University Town', 'Cantt', 'Gulbahar', 'Saddar', 'Warsak Road', 'Ring Road', 'Kohat Road']
      },
      {
        name: 'Abbottabad',
        areas: ['Mandian', 'Supply', 'Cantt', 'Kakul Road', 'Murree Road']
      },
      {
        name: 'Mardan',
        areas: ['Sheikh Maltoon Town', 'Cantt', 'Baghdada', 'Bank Road']
      },
      {
        name: 'Swat',
        areas: ['Mingora', 'Saidu Sharif', 'Barikot', 'Matta']
      }
    ]
  },
  {
    name: 'Balochistan',
    cities: [
      {
        name: 'Quetta',
        areas: ['Jinnah Town', 'Cantt', 'Samungli Road', 'Zarghoon Road', 'Shahbaz Town', 'Satellite Town']
      },
      {
        name: 'Gwadar',
        areas: ['Airport Road', 'Marine Drive', 'New Town', 'Singhar']
      }
    ]
  },
  {
    name: 'Gilgit-Baltistan',
    cities: [
      {
        name: 'Gilgit',
        areas: ['Jutial', 'Nagaral', 'Kashrote', 'Airport Road']
      },
      {
        name: 'Skardu',
        areas: ['Hussainabad', 'Main Bazar', 'Airport Road']
      }
    ]
  },
  {
    name: 'Azad Jammu and Kashmir',
    cities: [
      {
        name: 'Muzaffarabad',
        areas: ['Chehla Bandi', 'Upper Chatter', 'Lower Plate', 'Madina Market']
      },
      {
        name: 'Mirpur',
        areas: ['Sector F-1', 'Sector F-2', 'Chowk Shaheedan', 'Allama Iqbal Road']
      }
    ]
  }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    nameUrdu: 'الیکٹریشن (بجلی کا کام)',
    nameRomanUrdu: 'Bijli Ka Mistri / Electrician',
    description: 'House wiring, circuit breakers, UPS and generator setup, ceiling fans, switchboards, short circuit fixing.',
    icon: 'Zap',
    popular: true,
    samplePriceRange: 'Rs. 400 - 1,200 (Visit & basic fix)'
  },
  {
    id: 'plumber',
    name: 'Plumber',
    nameUrdu: 'پلمبر (نل اور سینیٹری کا کام)',
    nameRomanUrdu: 'Nal Sazi & Sanitary Plumber',
    description: 'Water leakages, pipe fitting, sanitary installation, geyser repair & installation, water motor installation.',
    icon: 'Wrench',
    popular: true,
    samplePriceRange: 'Rs. 500 - 1,500'
  },
  {
    id: 'ac-technician',
    name: 'AC & Fridge Technician',
    nameUrdu: 'اے سی اور فریج مکینک',
    nameRomanUrdu: 'AC aur Fridge Mechanic',
    description: 'Inverter AC repair, gas charging, master chemical servicing, split unit installation, deep freezer repair.',
    icon: 'Snowflake',
    popular: true,
    samplePriceRange: 'Rs. 800 - 2,500'
  },
  {
    id: 'solar-technician',
    name: 'Solar Panel Technician',
    nameUrdu: 'سولر پینل ٹیکنیشن',
    nameRomanUrdu: 'Solar Panel & Inverter Expert',
    description: 'Solar panel installation, hybrid & on-grid inverters, battery bank wiring, net-metering guidance.',
    icon: 'Sun',
    popular: true,
    samplePriceRange: 'Rs. 1,500 - 5,000'
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    nameUrdu: 'بڑھئی / کارپینٹر (لکڑی کا کام)',
    nameRomanUrdu: 'Badhai / Carpenter (Lakri Ka Kaam)',
    description: 'Custom furniture, door lock repair, wardrobe making, kitchen cabinets repair, wooden polishing.',
    icon: 'Hammer',
    popular: true,
    samplePriceRange: 'Rs. 600 - 2,000'
  },
  {
    id: 'painter',
    name: 'Painter & Polish',
    nameUrdu: 'پینٹر اور پالش والا',
    nameRomanUrdu: 'Painter aur Polish Mistri',
    description: 'House painting, distemper, weather sheet, wall putty, wood polish, water seepage protection.',
    icon: 'Paintbrush',
    popular: true,
    samplePriceRange: 'Rs. 500 - 1,500 / room'
  },
  {
    id: 'cleaner',
    name: 'Home & Office Cleaner',
    nameUrdu: 'صفائی والے (گھر اور دفتر)',
    nameRomanUrdu: 'Ghar & Office Safai',
    description: 'Deep house cleaning, water tank cleaning, sofa & carpet shampoo wash, kitchen degreasing.',
    icon: 'Sparkles',
    popular: false,
    samplePriceRange: 'Rs. 1,000 - 3,500'
  },
  {
    id: 'mobile-repair',
    name: 'Mobile Phone Repair',
    nameUrdu: 'موبائل ریپئرنگ ٹیکنیشن',
    nameRomanUrdu: 'Mobile Phone Repair Technician',
    description: 'Broken display replacement, battery replacement, water damage, charging port repair, software flashing.',
    icon: 'Smartphone',
    popular: true,
    samplePriceRange: 'Rs. 400 - 2,000 + parts'
  },
  {
    id: 'computer-repair',
    name: 'Computer & Laptop Repair',
    nameUrdu: 'کمپیوٹر اور لیپ ٹاپ مکینک',
    nameRomanUrdu: 'Computer & Laptop Mistri',
    description: 'Laptop hardware repair, SSD upgrade, Windows installation, virus cleanup, printer setup, Wi-Fi networking.',
    icon: 'Monitor',
    popular: false,
    samplePriceRange: 'Rs. 600 - 2,500'
  },
  {
    id: 'bike-mechanic',
    name: 'Bike Mechanic (Motorcycle)',
    nameUrdu: 'موٹر سائیکل مکینک',
    nameRomanUrdu: 'Motorcycle & Bike Mechanic',
    description: 'Engine tuning, oil change, tyre puncture, brake shoe replacement, wiring and doorstep assistance.',
    icon: 'Bike',
    popular: true,
    samplePriceRange: 'Rs. 300 - 1,200'
  },
  {
    id: 'appliance-repair',
    name: 'Washing Machine & Appliances',
    nameUrdu: 'واشنگ مشین اور ہوم اپلائنسز',
    nameRomanUrdu: 'Washing Machine & Oven Repair',
    description: 'Automatic & semi-automatic washing machine repair, microwave oven, water dispenser, kitchen hood.',
    icon: 'Tv',
    popular: false,
    samplePriceRange: 'Rs. 500 - 1,800'
  },
  {
    id: 'mason',
    name: 'Mason / Mistri',
    nameUrdu: 'راج مستری (تعمیراتی کام)',
    nameRomanUrdu: 'Raj Mistri / Mason (Taameerat)',
    description: 'Brickwork, cement plaster, ceramic tiles fixing, marble cutting & grinding, bathroom renovation.',
    icon: 'Layers',
    popular: false,
    samplePriceRange: 'Rs. 1,200 - 2,500 / day'
  }
];

export const PAKISTAN_PHONE_REGEX = /^(\+92|0|0092)?(3\d{2})[- ]?(\d{7})$/;

export function formatPakistaniPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+92')) return cleaned;
  if (cleaned.startsWith('0092')) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith('0')) return `+92${cleaned.slice(1)}`;
  if (cleaned.startsWith('3')) return `+92${cleaned}`;
  return phone;
}

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
