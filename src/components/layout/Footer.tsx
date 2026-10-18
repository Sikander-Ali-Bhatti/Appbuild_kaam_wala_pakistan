import React from 'react';
import { Wrench, Phone, MessageSquare, ShieldCheck, Heart, Smartphone, MapPin } from 'lucide-react';
import { PLATFORM_CONFIG } from '../../config/features';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  onOpenSimulator: () => void;
  onOpenDownloadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSimulator, onOpenDownloadModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Kaam<span className="text-teal-400">Wala</span> Pakistan
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Pakistan’s premier verified local service marketplace. Connecting homeowners, offices, and businesses with skilled electricians, plumbers, AC mechanics, carpenters, and technicians without middlemen.
            </p>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Free Public Initiative</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                No commissions, no registration fee, and no payment deductions from workers or customers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={onOpenDownloadModal}
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download Android APK (Free)</span>
              </button>

              <button
                onClick={onOpenSimulator}
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                <span>App Simulator</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Popular Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('search', { category: 'Electrician' })} className="hover:text-teal-400 transition">
                  Electricians (Bijli Mistri)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { category: 'Plumber' })} className="hover:text-teal-400 transition">
                  Plumbers (Nal Sazi & Geyser)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { category: 'AC & Fridge Technician' })} className="hover:text-teal-400 transition">
                  AC & Inverter Repair
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { category: 'Solar Panel Technician' })} className="hover:text-teal-400 transition">
                  Solar Panel Technicians
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { category: 'Carpenter' })} className="hover:text-teal-400 transition">
                  Carpenters (Lakri Ka Kaam)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { category: 'Bike Mechanic (Motorcycle)' })} className="hover:text-teal-400 transition">
                  Doorstep Bike Mechanics
                </button>
              </li>
            </ul>
          </div>

          {/* Major Cities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Top Cities</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('search', { city: 'Lahore' })} className="hover:text-teal-400 transition flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Lahore (DHA, Gulberg, Johar)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { city: 'Karachi' })} className="hover:text-teal-400 transition flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Karachi (Clifton, Gulshan, DHA)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { city: 'Islamabad' })} className="hover:text-teal-400 transition flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Islamabad (F-10, PWD, Blue Area)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { city: 'Rawalpindi' })} className="hover:text-teal-400 transition flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Rawalpindi (Bahria Town, Saddar)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { city: 'Faisalabad' })} className="hover:text-teal-400 transition flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Faisalabad & Multan</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { city: 'Peshawar' })} className="hover:text-teal-400 transition flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Peshawar (Hayatabad, Cantt)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Company & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition">
                  About Kaam Wala
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-teal-400 transition">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-teal-400 transition">
                  Help & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition">
                  Contact Support Helpline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-teal-400 transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-teal-400 transition">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left rtl:md:text-right">
          <p>
            © {new Date().getFullYear()} Kaam Wala Pakistan. Built for the artisans and homeowners of Pakistan.
          </p>
          <div className="text-[11px] text-slate-400 max-w-xl">
            Notice: Worker profiles are reviewed by administrators for basic accuracy. Users should exercise standard caution and negotiate job specifics before service.
          </div>
        </div>
      </div>
    </footer>
  );
};
