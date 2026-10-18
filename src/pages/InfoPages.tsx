import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { ServiceCategory } from '../types';
import { PLATFORM_CONFIG } from '../config/features';
import {
  Wrench,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  HelpCircle,
  FileText,
  Lock,
  CheckCircle2,
  MapPin,
  Sparkles,
  Zap,
  Snowflake,
  Sun,
  Hammer,
  Paintbrush,
  Sparkle,
  Smartphone,
  Monitor,
  Bike,
  Tv,
  Layers,
} from 'lucide-react';

interface InfoPagesProps {
  page: 'categories' | 'how-it-works' | 'about' | 'contact' | 'faq' | 'terms' | 'privacy';
  onNavigateSearch: (params?: any) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const InfoPages: React.FC<InfoPagesProps> = ({
  page,
  onNavigateSearch,
  onNavigate,
}) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    if (page === 'categories') {
      ApiService.getCategories().then(setCategories).catch(() => {});
    }
  }, [page]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-blue-500" />;
      case 'Snowflake': return <Snowflake className="w-6 h-6 text-cyan-500" />;
      case 'Sun': return <Sun className="w-6 h-6 text-orange-500" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-700" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6 text-emerald-500" />;
      case 'Sparkles': return <Sparkle className="w-6 h-6 text-pink-500" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-indigo-500" />;
      case 'Monitor': return <Monitor className="w-6 h-6 text-purple-500" />;
      case 'Bike': return <Bike className="w-6 h-6 text-red-500" />;
      case 'Tv': return <Tv className="w-6 h-6 text-teal-500" />;
      default: return <Layers className="w-6 h-6 text-slate-600" />;
    }
  };

  if (page === 'categories') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase text-teal-600 tracking-wider">
            All Skilled Services
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Browse Services Available in Pakistan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Select any category below to find vetted local technicians in your city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(c => (
            <div
              key={c.id}
              onClick={() => onNavigateSearch({ category: c.name })}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                  {getCategoryIcon(c.icon)}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-lg">{c.name}</h3>
                  <span className="text-xs font-urdu text-teal-700" dir="rtl">{c.nameUrdu}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{c.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>{c.samplePriceRange}</span>
                <span>Search Pros →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === 'how-it-works') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">How Kaam Wala Pakistan Works</h1>
          <p className="text-sm text-slate-500">A transparent, free platform designed for real Pakistani trust.</p>
        </div>

        {/* Customer Steps */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
          <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
            For Customers & Homeowners
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start space-x-3">
              <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-slate-900 block text-sm">Search by City and Area</strong>
                Filter electricians, plumbers, AC technicians, and more by province, city (Karachi, Lahore, Islamabad, etc.), and local area.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-slate-900 block text-sm">Direct Contact or Free Booking</strong>
                Call the worker directly, message on WhatsApp, or send an official booking request with preferred date and time.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-slate-900 block text-sm">Pay Directly & Leave a Review</strong>
                Pay the worker directly in PKR Cash or EasyPaisa/JazzCash upon job completion. No platform commission is charged. Rate the service to help others!
              </div>
            </div>
          </div>
        </div>

        {/* Worker Steps */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
          <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
            For Skilled Workers & Technicians
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start space-x-3">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-slate-900 block text-sm">Register for Free</strong>
                Provide your name, phone number, WhatsApp, city, skills, and visiting charges. Registration is 100% free with no monthly fee.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-slate-900 block text-sm">Admin Verification</strong>
                Our team reviews worker profiles to safeguard community trust. Once approved, your profile appears live in searches.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-slate-900 block text-sm">Keep 100% of Your Earnings</strong>
                You keep every single rupee you earn. No percentage deductions, no payment gateway fees.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">About Kaam Wala Pakistan</h1>
          <p className="text-sm text-slate-500">Connecting Pakistani craftsmanship with everyday households.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Kaam Wala Pakistan</strong> was founded to bridge the gap between skilled, hardworking local artisans (electricians, plumbers, carpenters, AC technicians, bike mechanics) and homeowners who need trustworthy, prompt services.
          </p>
          <p>
            In many cities across Pakistan, finding a reliable mistri or technician means asking neighbors or wandering local markets. Meanwhile, skilled technicians often pay exorbitant commissions to commercial contractor middle-men.
          </p>
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900">
            <strong>Our Free Business Promise:</strong> Kaam Wala Pakistan is completely free for all users. We do not charge registration fees, we do not deduct commissions, and we do not insert paywalls. All transactions remain direct between the customer and the worker.
          </div>
        </div>
      </div>
    );
  }

  if (page === 'faq') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Frequently Asked Questions (FAQ)</h1>
          <p className="text-sm text-slate-500">Answers to common questions from Pakistani customers and workers.</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {[
            {
              q: 'Is Kaam Wala Pakistan really 100% free?',
              a: 'Yes! Neither the customer nor the worker pays any platform fee or commission. You only pay the worker their agreed visiting fee or service charge directly in PKR.',
            },
            {
              q: 'How do I pay the technician?',
              a: 'You settle payment directly with the technician after they inspect or finish the job. Most technicians in Pakistan accept Cash, EasyPaisa, or JazzCash.',
            },
            {
              q: 'What should I do if a worker does not arrive?',
              a: 'You can cancel the pending or accepted booking from your Customer Portal. You can also report the worker if they were unresponsive.',
            },
            {
              q: 'How does worker profile approval work?',
              a: 'When a technician registers, our admin team reviews their contact number, CNIC format, and listed skills. This prevents spam, fake numbers, and inactive listings.',
            },
            {
              q: 'Does admin approval mean the worker is government verified?',
              a: 'No. Admin approval simply confirms that the profile details, phone number, and skills meet our listing guidelines. Customers should exercise standard precautions as when hiring any local service provider.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === 'contact') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Contact & Support Helpline</h1>
          <p className="text-sm text-slate-500">We are here to assist customers and technicians across Pakistan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <Phone className="w-6 h-6 text-teal-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Helpline</h4>
            <p className="text-xs text-slate-500">{PLATFORM_CONFIG.supportPhone}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <MessageSquare className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">WhatsApp</h4>
            <a
              href={`https://wa.me/${PLATFORM_CONFIG.supportWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              Direct Chat
            </a>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <Mail className="w-6 h-6 text-blue-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Email</h4>
            <p className="text-xs text-slate-500">{PLATFORM_CONFIG.supportEmail}</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'terms' || page === 'privacy') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {page === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        </h1>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to Kaam Wala Pakistan. By accessing or using our platform, you agree to comply with our community rules and safety guidelines.
          </p>
          <h3 className="font-bold text-slate-900 text-base pt-2">Direct Relationship</h3>
          <p>
            Kaam Wala Pakistan is a directory and marketplace that connects independent service workers with customers. Workers are independent technicians and not employees or subcontractors of Kaam Wala Pakistan.
          </p>
          <h3 className="font-bold text-slate-900 text-base pt-2">No Commission & Direct Payments</h3>
          <p>
            We do not collect payments on behalf of workers. Any payment for services or materials must be settled directly between customer and worker.
          </p>
          <h3 className="font-bold text-slate-900 text-base pt-2">Data Protection & Privacy</h3>
          <p>
            We respect your privacy. Contact details provided are shared only to facilitate communication between booked parties. We never sell user data to advertising third parties.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
