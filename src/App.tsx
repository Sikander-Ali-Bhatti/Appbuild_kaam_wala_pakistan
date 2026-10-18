/**
 * Kaam Wala Pakistan — Complete Service Marketplace Web & Mobile App
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { WorkerDetailPage } from './pages/WorkerDetailPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { InfoPages } from './pages/InfoPages';
import { BookServiceModal } from './pages/BookServiceModal';
import { MobileAppSimulator } from './pages/MobileAppSimulator';
import { ApkDownloadModal } from './components/modals/ApkDownloadModal';
import { WorkerProfile } from './types';

function MainApp() {
  const { user } = useAuth();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [bookingWorker, setBookingWorker] = useState<WorkerProfile | null>(null);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [customerTab, setCustomerTab] = useState<'bookings' | 'favorites' | 'profile'>('bookings');
  const [simulatorOpen, setSimulatorOpen] = useState<boolean>(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);

  const handleNavigate = (view: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'search') {
      if (params) setSearchFilters(params);
      else setSearchFilters({});
    }

    if (view === 'customer-dashboard' && params?.tab) {
      setCustomerTab(params.tab);
    }

    setCurrentView(view);
  };

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkerId(workerId);
    setCurrentView('worker-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (worker: WorkerProfile) => {
    setBookingWorker(worker);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSimulator={() => setSimulatorOpen(true)}
        onOpenDownloadModal={() => setDownloadModalOpen(true)}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectWorker={handleSelectWorker}
            onOpenDownloadModal={() => setDownloadModalOpen(true)}
          />
        )}

        {currentView === 'search' && (
          <SearchPage
            initialFilters={searchFilters}
            onSelectWorker={handleSelectWorker}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'worker-detail' && selectedWorkerId && (
          <WorkerDetailPage
            workerId={selectedWorkerId}
            onBack={() => handleNavigate('search')}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboard
            initialTab={customerTab}
            onNavigateSearch={() => handleNavigate('search')}
            onSelectWorker={handleSelectWorker}
          />
        )}

        {currentView === 'worker-dashboard' && <WorkerDashboard />}

        {currentView === 'admin-dashboard' && <AdminDashboard />}

        {['login', 'register-customer', 'register-worker'].includes(currentView) && (
          <AuthPage
            initialMode={currentView as any}
            onSuccess={role => {
              if (role === 'admin') handleNavigate('admin-dashboard');
              else if (role === 'worker') handleNavigate('worker-dashboard');
              else handleNavigate('customer-dashboard');
            }}
          />
        )}

        {['categories', 'how-it-works', 'about', 'faq', 'contact', 'terms', 'privacy'].includes(currentView) && (
          <InfoPages
            page={currentView as any}
            onNavigateSearch={params => handleNavigate('search', params)}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Booking Modal */}
      {bookingWorker && (
        <BookServiceModal
          worker={bookingWorker}
          onClose={() => setBookingWorker(null)}
          onSuccess={() => {
            setBookingWorker(null);
            handleNavigate('customer-dashboard', { tab: 'bookings' });
          }}
          onNavigateLogin={() => {
            setBookingWorker(null);
            handleNavigate('login');
          }}
        />
      )}

      {/* Interactive Mobile App Simulator */}
      {simulatorOpen && (
        <MobileAppSimulator onClose={() => setSimulatorOpen(false)} />
      )}

      {/* Direct APK Download Modal */}
      {downloadModalOpen && (
        <ApkDownloadModal
          onClose={() => setDownloadModalOpen(false)}
          onOpenSimulator={() => setSimulatorOpen(true)}
        />
      )}

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSimulator={() => setSimulatorOpen(true)}
        onOpenDownloadModal={() => setDownloadModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
