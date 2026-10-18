import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { Booking, WorkerProfile } from '../types';
import { formatPKR, PAKISTAN_PROVINCES } from '../data/pakistanData';
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Heart,
  User as UserIcon,
  MapPin,
  X,
  Search,
} from 'lucide-react';

interface CustomerDashboardProps {
  initialTab?: 'bookings' | 'favorites' | 'profile';
  onNavigateSearch: () => void;
  onSelectWorker: (workerId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = 'bookings',
  onNavigateSearch,
  onSelectWorker,
}) => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'profile'>(initialTab);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('All');

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Cancel booking modal
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Profile update form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Lahore');
  const [province, setProvince] = useState(user?.province || 'Punjab');
  const [area, setArea] = useState(user?.area || '');
  const [profileMsg, setProfileMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [bData, fData] = await Promise.all([
        ApiService.getBookings(),
        ApiService.getFavorites(),
      ]);
      setBookings(bData);
      setFavorites(fData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelBooking) return;
    try {
      await ApiService.updateBookingStatus(cancelBooking.id, 'cancelled', cancelReason);
      setCancelBooking(null);
      setCancelReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error cancelling booking');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setReviewSubmitting(true);
    try {
      await ApiService.submitReview(reviewBooking.id, rating, reviewComment, selectedTags);
      setReviewBooking(null);
      setReviewComment('');
      setSelectedTags([]);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.updateProfile({ name, phone, city, province, area });
      await refreshUser();
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err: any) {
      setProfileMsg(err.message || 'Error updating profile');
    }
  };

  const filteredBookings = bookingFilter === 'All'
    ? bookings
    : bookings.filter(b => b.status === bookingFilter.toLowerCase());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'accepted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Accepted</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Awaiting Worker</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Cancelled</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Declined</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-slate-500">
              Customer Portal • {user?.city}, {user?.province}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateSearch}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Book a New Worker</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-3 rtl:space-x-reverse">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'bookings'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'favorites'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Workers ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'profile'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Status filter bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setBookingFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                  bookingFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No bookings found</h3>
              <p className="text-xs text-slate-500">
                You haven't requested any workers in this category yet.
              </p>
              <button
                onClick={onNavigateSearch}
                className="mt-2 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
              >
                Find a Worker Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map(b => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-900 text-base">{b.workerName}</span>
                        <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
                          {b.serviceCategory}
                        </span>
                        {b.isEmergency && (
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                            Urgent
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">Booking ID: #{b.id}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(b.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] block uppercase">Scheduled Date & Time</span>
                      <span className="font-semibold text-slate-800">{b.preferredDate} ({b.preferredTimeSlot})</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] block uppercase">Service Address</span>
                      <span className="font-semibold text-slate-800">{b.address}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] block uppercase">Estimated Visit Fee</span>
                      <span className="font-semibold text-slate-800">{formatPKR(b.estimatedFee || 500)}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">Problem Details:</span>
                    {b.description}
                  </div>

                  {b.rejectionReason && (
                    <div className="bg-red-50 p-2.5 rounded-xl text-xs text-red-800">
                      <strong>Worker Reason:</strong> {b.rejectionReason}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex space-x-2">
                      <a
                        href={`tel:${b.workerPhone}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>Call Worker</span>
                      </a>
                      <a
                        href={`https://wa.me/${b.workerWhatsapp}?text=${encodeURIComponent(`Assalam o Alaikum, regarding booking #${b.id}...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Cancel button if pending or accepted */}
                      {['pending', 'accepted'].includes(b.status) && (
                        <button
                          onClick={() => setCancelBooking(b)}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg transition"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {/* Review button if completed and not reviewed */}
                      {b.status === 'completed' && !b.hasReview && (
                        <button
                          onClick={() => setReviewBooking(b)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-xs transition"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Leave Review & Rating</span>
                        </button>
                      )}

                      {b.status === 'completed' && b.hasReview && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reviewed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Favorites Tab */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No saved workers</h3>
              <p className="text-xs text-slate-500">
                Click the heart icon on any worker profile to save them here for quick access.
              </p>
              <button
                onClick={onNavigateSearch}
                className="mt-2 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
              >
                Browse Workers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map(w => (
                <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{w.name}</h4>
                      <span className="text-xs text-teal-700 font-semibold">{w.serviceCategory}</span>
                      <div className="text-[11px] text-slate-400">{w.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-black text-slate-800">{formatPKR(w.visitingFee)} Visit</span>
                    <button
                      onClick={() => onSelectWorker(w.id)}
                      className="px-3 py-1 bg-teal-600 text-white rounded-lg font-bold"
                    >
                      View & Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Customer Account Information</h2>

          {profileMsg && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pakistani Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Province</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {PAKISTAN_PROVINCES.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Neighborhood / Area</label>
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. DHA Phase 5, Gulberg III..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Rate {reviewBooking.workerName}
              </h3>
              <button onClick={() => setReviewBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
                  How satisfied were you with the service?
                </label>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Highlights
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Punctual & On Time', 'Fair Price', 'Expert Work', 'Polite Behavior', 'Cleaned Up After Work', 'Brought Proper Tools'].map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition ${
                        selectedTags.includes(tag)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share details of the experience to help other homeowners in Pakistan..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="flex-1 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {cancelBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base mb-2">Cancel Booking Request?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Please let {cancelBooking.workerName} know why you are cancelling this appointment.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <textarea
                rows={2}
                required
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="e.g. Issue resolved by another technician, scheduling conflict..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelBooking(null)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
