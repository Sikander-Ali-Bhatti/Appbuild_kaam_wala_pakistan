import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { WorkerProfile, ServiceCategory } from '../types';
import { PAKISTAN_PROVINCES, formatPKR } from '../data/pakistanData';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Wrench,
  Snowflake,
  Sun,
  Hammer,
  Paintbrush,
  Sparkle,
  Smartphone,
  Monitor,
  Bike,
  Layers,
  Tv,
  Check,
  Users,
  Award,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, params?: any) => void;
  onSelectWorker: (workerId: string) => void;
  onOpenDownloadModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectWorker,
  onOpenDownloadModal,
}) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [featuredWorkers, setFeaturedWorkers] = useState<WorkerProfile[]>([]);
  const [publicStats, setPublicStats] = useState({
    approvedWorkers: 7,
    completedJobs: 339,
    totalReviews: 116,
    totalCities: 15,
  });

  // Search form state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    ApiService.getCategories().then(setCategories).catch(() => {});
    ApiService.getWorkers({ approvalStatus: 'approved' })
      .then(workers => setFeaturedWorkers(workers.slice(0, 6)))
      .catch(() => {});
    ApiService.getPublicStats().then(setPublicStats).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search', {
      query: searchQuery,
      province: selectedProvince,
      city: selectedCity,
      category: selectedCategory,
    });
  };

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

  const availableCities = selectedProvince
    ? PAKISTAN_PROVINCES.find(p => p.name === selectedProvince)?.cities || []
    : PAKISTAN_PROVINCES.flatMap(p => p.cities);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white overflow-hidden py-16 lg:py-24">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Free Service Marketplace Across Pakistan</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Search Box Card */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200/80 text-slate-900">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Keyword / Service */}
              <div className="relative">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Service / Skill
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Electrician, Plumber, AC..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Province Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={e => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="">All Provinces (Pakistan)</option>
                  {PAKISTAN_PROVINCES.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* City Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="">All Cities</option>
                  {availableCities.map((c, i) => (
                    <option key={`${c.name}-${i}`} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[42px] bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/30 flex items-center justify-center space-x-2 transition"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('searchButton')}</span>
                </button>
              </div>
            </form>

            {/* Popular quick tags */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold text-[11px]">Popular:</span>
              {['Electrician', 'Plumber', 'AC & Fridge', 'Solar Panel', 'Carpenter', 'Bike Mechanic'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onNavigate('search', { category: tag })}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-[11px] font-medium transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">100% Free</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Zero Commission Always</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {publicStats.approvedWorkers}+
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Admin-Reviewed Workers</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {publicStats.completedJobs}+
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Successful Jobs Done</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {publicStats.totalCities}+
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Pakistani Cities Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Available Across Pakistan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Browse Skilled Service Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Experienced technicians ready for doorstep repairs, home maintenance, and commercial work.
            </p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-teal-600 hover:text-teal-700"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate('search', { category: cat.name })}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-teal-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center transition mb-3">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition text-base">
                  {cat.name}
                </h3>
                <p className="text-xs font-urdu text-teal-700 mt-0.5" dir="rtl">
                  {cat.nameUrdu}
                </p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-500">
                  {cat.samplePriceRange.split('(')[0]}
                </span>
                <span className="text-teal-600 font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Pillars (Why Kaam Wala) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Pakistanis Trust Kaam Wala
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically for Pakistani homeowners, tenants, shop owners, and skilled local technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Free Platform */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                {t('zeroCommission')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('zeroCommissionDesc')} No hidden cuts, keeping rates fair and transparent for everyone.
              </p>
            </div>

            {/* 2. Direct Call & WhatsApp */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                {t('directContact')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('directContactDesc')} No waiting for customer support. Speak directly with the electrician or plumber and share photos of the issue.
              </p>
            </div>

            {/* 3. Admin-Reviewed */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                {t('adminApproved')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('adminApprovedDesc')} We screen worker profiles, experience claims, and service areas to maintain reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Workers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Top Rated Pros</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Verified Workers Ready for Hire
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top rated electricians, AC mechanics, plumbers, and solar experts with genuine reviews.
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-teal-600 hover:text-teal-700"
          >
            <span>Explore All Workers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorkers.map(worker => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-extrabold text-slate-900 text-base">
                          {worker.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      </div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {worker.serviceCategory}
                      </span>
                      <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{worker.area ? `${worker.area}, ` : ''}{worker.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-extrabold text-slate-800">
                      {worker.ratingAverage > 0 ? worker.ratingAverage : '5.0'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({worker.totalReviews})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {worker.bio}
                </p>

                {/* Sub skills pills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {worker.subSkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                  {worker.subSkills.length > 3 && (
                    <span className="text-[10px] text-slate-500 px-1 py-0.5">
                      +{worker.subSkills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Pricing / visiting fee */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Visit Fee
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatPKR(worker.visitingFee)}
                    </span>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Experience
                    </span>
                    <span className="font-semibold text-slate-800 text-xs">
                      {worker.experienceYears} Years
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-50 p-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                <a
                  href={`tel:${worker.phone}`}
                  className="flex items-center justify-center space-x-1 py-2 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${worker.whatsapp}?text=${encodeURIComponent(`Assalam o Alaikum ${worker.name}, I found your profile on Kaam Wala Pakistan. Are you available for work?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1 py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => onSelectWorker(worker.id)}
                  className="flex items-center justify-center space-x-1 py-2 px-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition"
                >
                  <span>Book / View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How Kaam Wala Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Simple, honest 3-step process for both customers and workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Search by City & Skill
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your province, city, and neighborhood to find available technicians in your immediate locality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Connect Directly or Book
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Call the worker directly, chat via WhatsApp, or submit an official booking request with your preferred date.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Pay Directly & Review
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pay the worker directly in Cash or EasyPaisa upon job completion. Leave an honest review to help others.
            </p>
          </div>
        </div>
      </section>

      {/* Android Mobile App Download Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-teal-500/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Official Android App Available</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Download Kaam Wala Pakistan for Android
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Find electricians, plumbers, and mechanics anytime from your phone. Ultra-lightweight APK (33 KB), direct calling, and instant WhatsApp chat.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="/api/download/apk"
                download="kaam-wala-pakistan.apk"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-teal-500/20"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download Android APK (Free)</span>
              </a>

              {onOpenDownloadModal && (
                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="inline-flex items-center space-x-1.5 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
                >
                  <span>Installation Steps & Info</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] text-slate-400 pt-1">
              <span>✓ Package: <code>com.kaamwalapakistan.app</code></span>
              <span>✓ Size: 33 KB</span>
              <span>✓ Android 5.0 to 14+</span>
            </div>
          </div>

          <div className="shrink-0 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 max-w-sm w-full space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              3-Step Installation on Phone:
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span>Tap <strong>Download Android APK</strong></span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span>Tap <strong>"Download anyway"</strong> in Chrome</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span>Open downloaded file & tap <strong>"Install"</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA For Workers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold">
              <span>🇵🇰 Artisans & Mistris Welcome</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Are You a Skilled Electrician, Plumber, or Mechanic in Pakistan?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
              Grow your local client base without paying agency cuts. Registration is 100% free with zero commission on any of your jobs.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('register-worker')}
                className="px-6 py-3 rounded-xl bg-white text-teal-900 font-extrabold text-sm hover:bg-emerald-50 transition shadow-lg"
              >
                Register as a Worker Today
              </button>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="px-6 py-3 rounded-xl bg-teal-700/60 hover:bg-teal-700 text-white font-bold text-sm border border-white/20 transition"
              >
                Learn How It Works
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
