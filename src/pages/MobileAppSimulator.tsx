import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { WorkerProfile, ServiceCategory, Booking } from '../types';
import { formatPKR } from '../data/pakistanData';
import { useAuth } from '../context/AuthContext';
import {
  Smartphone,
  Wrench,
  Search,
  Calendar,
  User as UserIcon,
  Bell,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Heart,
  X,
  Zap,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface MobileAppSimulatorProps {
  onClose: () => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [deviceModel, setDeviceModel] = useState<'pixel' | 'galaxy' | 'budget'>('pixel');

  // Mobile navigation state
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'home' | 'search' | 'detail' | 'bookings' | 'profile'>('home');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [workerDetail, setWorkerDetail] = useState<WorkerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [bookingSent, setBookingSent] = useState(false);

  useEffect(() => {
    ApiService.getCategories().then(setCategories).catch(() => {});
    ApiService.getWorkers({ approvalStatus: 'approved' }).then(setWorkers).catch(() => {});
    if (user) {
      ApiService.getBookings().then(setBookings).catch(() => {});
    }
  }, [user]);

  const openWorkerDetail = async (workerId: string) => {
    setSelectedWorkerId(workerId);
    try {
      const res = await ApiService.getWorkerById(workerId);
      setWorkerDetail(res.worker);
      setCurrentScreen('detail');
    } catch (err) {
      console.error(err);
    }
  };

  const getDimensions = () => {
    switch (deviceModel) {
      case 'galaxy':
        return 'w-[380px] h-[780px]';
      case 'budget':
        return 'w-[340px] h-[680px]';
      case 'pixel':
      default:
        return 'w-[390px] h-[790px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Top Device Bar */}
      <div className="w-full max-w-xl flex items-center justify-between text-white pb-3 px-2">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-teal-400" />
          <span className="font-extrabold text-sm sm:text-base">
            Kaam Wala Pakistan — Android Mobile App Simulator
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={deviceModel}
            onChange={e => setDeviceModel(e.target.value as any)}
            className="bg-slate-800 text-xs text-white border border-slate-700 rounded-lg px-2 py-1"
          >
            <option value="pixel">Google Pixel 8 (390px)</option>
            <option value="galaxy">Samsung Galaxy S23 (380px)</option>
            <option value="budget">Budget Android (340px)</option>
          </select>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Phone Frame */}
      <div className={`relative ${getDimensions()} bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col transition-all duration-300`}>
        {/* Android Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Screen Bezel */}
        <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative select-none">
          {/* Status Bar */}
          <div className="h-7 bg-teal-800 text-white text-[10px] px-6 flex items-center justify-between font-bold z-20 shrink-0">
            <span>09:41</span>
            <div className="flex items-center space-x-1">
              <span>🇵🇰 4G LTE</span>
              <span>100%</span>
            </div>
          </div>

          {/* SCREEN: HOME */}
          {currentScreen === 'home' && (
            <div className="flex-1 overflow-y-auto pb-16">
              {/* App Header */}
              <div className="bg-gradient-to-b from-teal-800 to-teal-700 text-white p-4 pt-2 rounded-b-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm block leading-tight">Kaam Wala PK</span>
                      <span className="text-[9px] text-teal-200">Pakistan Ka Hunarmand Network</span>
                    </div>
                  </div>
                  <div className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded font-bold border border-emerald-400/30">
                    100% Free
                  </div>
                </div>

                {/* Quick Search */}
                <div
                  onClick={() => setCurrentScreen('search')}
                  className="bg-white text-slate-400 rounded-xl px-3 py-2 text-xs flex items-center space-x-2 cursor-pointer shadow-inner"
                >
                  <Search className="w-3.5 h-3.5 text-teal-600" />
                  <span>Search electrician, plumber in Lahore, Karachi...</span>
                </div>
              </div>

              {/* Service Categories Grid */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-xs">Categories (خدمات)</h3>
                  <button onClick={() => setCurrentScreen('search')} className="text-[10px] font-bold text-teal-600">
                    See All
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  {categories.slice(0, 8).map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCurrentScreen('search');
                      }}
                      className="bg-white p-2 rounded-xl border border-slate-200 hover:border-teal-500 cursor-pointer flex flex-col items-center justify-center space-y-1 shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-800 line-clamp-1 leading-tight">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Featured Workers */}
                <div className="pt-2 space-y-2.5">
                  <h3 className="font-black text-slate-900 text-xs">Verified Workers Nearby</h3>
                  <div className="space-y-2">
                    {workers.slice(0, 4).map(w => (
                      <div
                        key={w.id}
                        onClick={() => openWorkerDetail(w.id)}
                        className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:border-teal-500 shadow-2xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <img src={w.avatar} alt={w.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <div className="flex items-center space-x-1">
                              <span className="font-bold text-slate-900 text-xs">{w.name}</span>
                              <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            </div>
                            <span className="text-[10px] text-teal-700 font-semibold">{w.serviceCategory}</span>
                            <span className="text-[9px] text-slate-400 block">{w.city} ({w.area})</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-0.5 justify-end">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-bold text-slate-800">
                              {w.ratingAverage > 0 ? w.ratingAverage : '5.0'}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-slate-900 block mt-0.5">
                            {formatPKR(w.visitingFee)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: SEARCH */}
          {currentScreen === 'search' && (
            <div className="flex-1 overflow-y-auto pb-16 p-3 space-y-3">
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentScreen('home')} className="p-1 text-slate-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search name, electrician..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex space-x-1.5 overflow-x-auto text-[10px]">
                {['All', 'Electrician', 'Plumber', 'AC & Fridge', 'Solar Panel', 'Carpenter'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap font-bold ${
                      (cat === 'All' && !selectedCategory) || selectedCategory === cat
                        ? 'bg-teal-700 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-1">
                {workers
                  .filter(w => !selectedCategory || w.serviceCategory.toLowerCase().includes(selectedCategory.toLowerCase()))
                  .filter(w => !searchQuery || w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(w => (
                    <div
                      key={w.id}
                      onClick={() => openWorkerDetail(w.id)}
                      className="bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-teal-500 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center space-x-2.5">
                        <img src={w.avatar} alt={w.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 text-xs block">{w.name}</span>
                          <span className="text-[10px] text-teal-700 font-semibold">{w.serviceCategory} • {w.city}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900">{formatPKR(w.visitingFee)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] border-t border-slate-100 pt-1.5">
                        <span className="text-slate-500">{w.experienceYears} Yrs Exp.</span>
                        <span className="text-teal-600 font-bold">View Profile & Book →</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SCREEN: WORKER DETAIL */}
          {currentScreen === 'detail' && workerDetail && (
            <div className="flex-1 overflow-y-auto pb-16">
              <div className="p-3 bg-white border-b border-slate-200 flex items-center space-x-2">
                <button onClick={() => setCurrentScreen('search')} className="p-1">
                  <ArrowLeft className="w-4 h-4 text-slate-700" />
                </button>
                <span className="font-bold text-xs text-slate-900">Worker Profile</span>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={workerDetail.avatar} alt={workerDetail.name} className="w-14 h-14 rounded-2xl object-cover border" />
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{workerDetail.name}</h3>
                    <span className="text-xs text-teal-700 font-bold">{workerDetail.serviceCategory}</span>
                    <p className="text-[10px] text-slate-500">{workerDetail.city}, {workerDetail.province}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[9px] text-slate-400 block font-bold">VISIT CHARGES</span>
                    <span className="font-black text-slate-900">{formatPKR(workerDetail.visitingFee)}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[9px] text-slate-400 block font-bold">RATING</span>
                    <span className="font-black text-amber-500">⭐ {workerDetail.ratingAverage || '5.0'}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  <strong className="block text-slate-900 mb-0.5">About:</strong>
                  {workerDetail.bio}
                </div>

                {bookingSent ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
                    ✓ Booking Request Sent to {workerDetail.name}!
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${workerDetail.phone}`}
                        className="py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center space-x-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Direct Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${workerDetail.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        setBookingSent(true);
                        setTimeout(() => {
                          setBookingSent(false);
                          setCurrentScreen('bookings');
                        }, 1500);
                      }}
                      className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs flex items-center justify-center space-x-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Send Quick Booking Request</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN: BOOKINGS */}
          {currentScreen === 'bookings' && (
            <div className="flex-1 overflow-y-auto pb-16 p-3 space-y-3">
              <h3 className="font-black text-slate-900 text-sm">My Bookings</h3>
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No bookings yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {bookings.map(b => (
                    <div key={b.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{b.workerName}</span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">{b.serviceCategory} • {b.preferredDate}</div>
                      <div className="text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded">{b.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN: PROFILE */}
          {currentScreen === 'profile' && (
            <div className="flex-1 overflow-y-auto pb-16 p-4 space-y-4">
              <h3 className="font-black text-slate-900 text-sm">Mobile Account</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">NAME</span>
                  <span className="font-bold text-slate-900">{user?.name || 'Guest User'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">ROLE</span>
                  <span className="font-bold text-teal-700 uppercase">{user?.role || 'Guest'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">LOCATION</span>
                  <span className="font-medium text-slate-700">{user?.city || 'Pakistan'}</span>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-900 space-y-1">
                <strong>Android APK Ready</strong>
                <p>Built with React Native & Expo in the `/mobile` directory. Ready to export to Android APK with EAS Build.</p>
              </div>
            </div>
          )}

          {/* Bottom App Navigation Bar */}
          <div className="absolute bottom-0 inset-x-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around z-20 text-[10px] font-semibold text-slate-500">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center space-y-0.5 ${currentScreen === 'home' ? 'text-teal-600 font-bold' : ''}`}
            >
              <Wrench className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentScreen('search')}
              className={`flex flex-col items-center space-y-0.5 ${currentScreen === 'search' ? 'text-teal-600 font-bold' : ''}`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setCurrentScreen('bookings')}
              className={`flex flex-col items-center space-y-0.5 ${currentScreen === 'bookings' ? 'text-teal-600 font-bold' : ''}`}
            >
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center space-y-0.5 ${currentScreen === 'profile' ? 'text-teal-600 font-bold' : ''}`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
