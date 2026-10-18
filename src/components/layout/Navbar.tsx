import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiService } from '../../services/api';
import { Notification } from '../../types';
import {
  Wrench,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Globe,
  Shield,
  Briefcase,
  Calendar,
  Smartphone,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenSimulator: () => void;
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSimulator,
  onOpenDownloadModal,
}) => {
  const { user, workerProfile, logout, quickDemoLogin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      ApiService.getNotifications()
        .then(res => {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        })
        .catch(() => {});
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, currentView]);

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) {
      await ApiService.markNotificationRead(notif.id).catch(() => {});
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    setNotifDropdownOpen(false);
    if (notif.link) {
      if (notif.link.includes('customer/bookings')) onNavigate('customer-dashboard', { tab: 'bookings' });
      else if (notif.link.includes('worker/bookings')) onNavigate('worker-dashboard', { tab: 'bookings' });
      else if (notif.link.includes('worker/dashboard')) onNavigate('worker-dashboard');
      else if (notif.link.includes('admin')) onNavigate('admin-dashboard');
      else onNavigate('home');
    }
  };

  const getDashboardView = () => {
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'worker') return 'worker-dashboard';
    return 'customer-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Pakistani announcement banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
              🇵🇰 100% FREE
            </span>
            <span className="hidden sm:inline">
              Zero Commission • No Booking Fees • Direct Call & WhatsApp with Workers Across Pakistan
            </span>
            <span className="sm:hidden">
              100% Free • Direct Contact with Verified Workers
            </span>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Android APK Download trigger */}
            <button
              onClick={onOpenDownloadModal}
              className="flex items-center space-x-1 rtl:space-x-reverse text-amber-200 hover:text-white transition font-bold text-[11px] bg-emerald-900/50 hover:bg-emerald-900/80 px-2.5 py-0.5 rounded-md border border-amber-300/40 cursor-pointer shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span>📱 Download Android APK</span>
            </button>

            {/* Quick Demo Login Launcher */}
            <button
              onClick={() => setDemoModalOpen(true)}
              className="flex items-center space-x-1 rtl:space-x-reverse text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Switch Role / Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:bg-teal-700 transition">
              <Wrench className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Kaam<span className="text-teal-600">Wala</span>
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.2 bg-teal-50 text-teal-700 rounded border border-teal-200">
                  PK
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 leading-tight">
                Pakistan Ka Hunarmand Network
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => onNavigate('search')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'search'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              {t('findWorkers')}
            </button>

            <button
              onClick={() => onNavigate('categories')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'categories'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              {t('browseServices')}
            </button>

            <button
              onClick={() => onNavigate('how-it-works')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'how-it-works'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              {t('howItWorks')}
            </button>

            {user?.role === 'customer' && (
              <button
                onClick={() => onNavigate('customer-dashboard', { tab: 'favorites' })}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition"
              >
                Saved Workers
              </button>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <select
                aria-label="Select Interface Language"
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg py-1.5 px-2.5 pr-6 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 appearance-none"
              >
                <option value="en">English</option>
                <option value="roman">Roman Urdu</option>
                <option value="ur">اردو (Urdu)</option>
              </select>
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Notifications Bell (if authenticated) */}
            {user && (
              <div className="relative">
                <button
                  aria-label="View notifications"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs text-teal-600 font-semibold">{unreadCount} unread</span>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">No notifications yet</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 text-left rtl:text-right cursor-pointer hover:bg-slate-50 transition ${
                              !n.read ? 'bg-teal-50/50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{n.title}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Session or Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => onNavigate(getDashboardView())}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left rtl:text-right hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-teal-600 block">
                      {user.role}
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition"
                >
                  {t('login')}
                </button>

                <button
                  onClick={() => onNavigate('register-worker')}
                  className="hidden sm:inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg shadow-xs shadow-teal-600/30 transition"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{t('joinAsWorker')}</span>
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigate('search');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-teal-50 text-teal-700 font-bold text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Find Workers</span>
            </button>
            <button
              onClick={() => {
                onNavigate('categories');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-slate-100 text-slate-800 font-bold text-sm"
            >
              <Wrench className="w-4 h-4" />
              <span>Services</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <button
              onClick={() => {
                onNavigate('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left rtl:text-right py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              How Kaam Wala Works
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left rtl:text-right py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              About & Trust
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left rtl:text-right py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              Help & Support Helpline
            </button>
            <button
              onClick={() => {
                onOpenDownloadModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left rtl:text-right py-2 px-3 text-sm font-bold text-teal-700 bg-teal-50/70 hover:bg-teal-50 rounded flex items-center space-x-2"
            >
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>Download Android App (.APK)</span>
            </button>

            {user && (
              <button
                onClick={() => {
                  onNavigate(getDashboardView());
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left rtl:text-right py-2.5 px-3 text-sm font-bold text-teal-700 bg-teal-50 rounded flex items-center justify-between"
              >
                <span>My Dashboard ({user.role.toUpperCase()})</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {!user && (
              <button
                onClick={() => {
                  onNavigate('register-worker');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 px-4 bg-teal-600 text-white font-bold rounded-lg text-sm text-center"
              >
                Register as Worker (Free)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Demo Switcher Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">One-Click Test Roles</h3>
              </div>
              <button
                onClick={() => setDemoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 mb-4">
              Instantly test each role without typing credentials. Each account is pre-seeded with real Pakistani context:
            </p>

            <div className="space-y-2.5">
              {/* Customer */}
              <button
                onClick={async () => {
                  await quickDemoLogin('customer');
                  setDemoModalOpen(false);
                  onNavigate('customer-dashboard');
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left rtl:text-right flex items-center justify-between group transition"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                    <span>Customer (Ahmed Khan - Lahore)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">User</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Search workers, book appointments, cancel, rate & review completed jobs.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-teal-600 -rotate-90" />
              </button>

              {/* Approved Worker */}
              <button
                onClick={async () => {
                  await quickDemoLogin('worker-approved');
                  setDemoModalOpen(false);
                  onNavigate('worker-dashboard');
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left rtl:text-right flex items-center justify-between group transition"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                    <span>Approved Worker (Muhammad Tariq - Electrician)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Live</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Accept/reject requests, mark jobs completed, toggle availability, edit skills.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-teal-600 -rotate-90" />
              </button>

              {/* Pending Worker */}
              <button
                onClick={async () => {
                  await quickDemoLogin('worker-pending');
                  setDemoModalOpen(false);
                  onNavigate('worker-dashboard');
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 text-left rtl:text-right flex items-center justify-between group transition"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                    <span>Pending Worker (Zahid Iqbal - Awaiting Approval)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Pending</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    See pending banner, awaiting admin verification state, profile resubmission.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-teal-600 -rotate-90" />
              </button>

              {/* Admin */}
              <button
                onClick={async () => {
                  await quickDemoLogin('admin');
                  setDemoModalOpen(false);
                  onNavigate('admin-dashboard');
                }}
                className="w-full p-3.5 rounded-xl border border-purple-200 hover:border-purple-500 hover:bg-purple-50/40 text-left rtl:text-right flex items-center justify-between group transition"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                    <span>Platform Admin (Mian Shaukat)</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Admin</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Approve/reject workers, suspend fake profiles, review reports, manage bookings.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-purple-600 -rotate-90" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                Default password for all seed accounts is <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-700">Role@12345</code>
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
