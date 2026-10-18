import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { WorkerProfile, Review } from '../types';
import { formatPKR } from '../data/pakistanData';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Heart,
  Share2,
  Check,
  Flag,
  X,
  ThumbsUp,
} from 'lucide-react';

interface WorkerDetailPageProps {
  workerId: string;
  onBack: () => void;
  onOpenBooking: (worker: WorkerProfile) => void;
}

export const WorkerDetailPage: React.FC<WorkerDetailPageProps> = ({
  workerId,
  onBack,
  onOpenBooking,
}) => {
  const { user } = useAuth();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Report modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiService.getWorkerById(workerId)
      .then(res => {
        setWorker(res.worker);
        setReviews(res.reviews);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    if (user) {
      ApiService.getFavorites()
        .then(favs => setIsFavorite(favs.some(f => f.id === workerId)))
        .catch(() => {});
    }
  }, [workerId, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please log in to save favorite workers.');
      return;
    }
    const res = await ApiService.toggleFavorite(workerId);
    setIsFavorite(res.isFavorite);
  };

  const handleCopyPhone = () => {
    if (worker) {
      navigator.clipboard.writeText(worker.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    try {
      await ApiService.reportWorker(workerId, reportReason, reportDetails);
      setReportSubmitted(true);
      setTimeout(() => {
        setReportSubmitted(false);
        setReportModalOpen(false);
        setReportReason('');
        setReportDetails('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Error submitting report');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-500 animate-pulse">
        Loading worker profile details...
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Worker profile not found</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search results</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:space-x-reverse">
            <div className="relative">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
              />
              {worker.isAvailable ? (
                <span className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                  Available
                </span>
              ) : (
                <span className="absolute bottom-1 right-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                  Busy
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {worker.name}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg">
                  {worker.serviceCategory}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-semibold flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.area ? `${worker.area}, ` : ''}{worker.city}, {worker.province}</span>
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs pt-1">
                <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-slate-800 text-sm">
                    {worker.ratingAverage > 0 ? worker.ratingAverage : '5.0'}
                  </span>
                  <span className="text-slate-500">
                    ({worker.totalReviews} reviews)
                  </span>
                </div>

                <span className="text-slate-500 font-medium">
                  {worker.totalCompletedJobs} jobs completed
                </span>
              </div>
            </div>
          </div>

          {/* Top Right Save & Report */}
          <div className="flex items-center space-x-2 self-end sm:self-start">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-xl border transition ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-500'
              }`}
              title={isFavorite ? 'Saved to favorites' : 'Save to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-red-600 transition"
              title="Report Profile"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pricing & Working Hours Banner */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Visiting Fee</span>
            <span className="text-lg font-black text-slate-900">{formatPKR(worker.visitingFee)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
            <span className="text-lg font-black text-slate-900">{worker.experienceYears} Years</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Working Hours</span>
            <span className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">{worker.workingHours}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Status</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Reviewed</span>
            </span>
          </div>
        </div>

        {/* Direct Contact & Booking Call-to-Actions */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={`tel:${worker.phone}`}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition shadow-sm"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call: {worker.phone}</span>
          </a>

          <a
            href={`https://wa.me/${worker.whatsapp}?text=${encodeURIComponent(`Assalam o Alaikum ${worker.name}, I found your profile on Kaam Wala Pakistan. Are you available for a visit in ${worker.city}?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            onClick={() => onOpenBooking(worker)}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Service Request</span>
          </button>
        </div>
      </div>

      {/* Profile Details & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About Bio */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">About the Worker</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {worker.bio}
            </p>

            <h4 className="text-sm font-bold text-slate-900 mt-6 mb-3">Specializations & Sub-Skills</h4>
            <div className="flex flex-wrap gap-2">
              {worker.subSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 font-semibold text-xs border border-teal-100 flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h3>
                <p className="text-xs text-slate-500">Reviews submitted by verified completed booking customers.</p>
              </div>

              <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-black text-slate-900 text-base">
                  {worker.ratingAverage > 0 ? worker.ratingAverage : '5.0'}
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No reviews yet for this worker.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map(rev => (
                  <div key={rev.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-700">
                          {rev.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{rev.customerName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rev.tags.map(t => (
                          <span key={t} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info & Safety */}
        <div className="space-y-6">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Free Marketplace Guarantee</span>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Kaam Wala Pakistan charges <strong>Rs. 0 commission</strong>. You pay the worker directly according to your agreed job terms via Cash, EasyPaisa, or JazzCash.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Safety & Hiring Tips</h4>
            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Confirm visiting charges and part estimates over phone or WhatsApp before the visit.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Ask for a receipt when purchasing electrical or plumbing replacement materials.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Always submit a review after the job to support hard-working artisans.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Report Worker Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Report {worker.name}</h3>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Report Received</h4>
                <p className="text-xs text-slate-500">
                  Our admin moderation team will investigate this profile promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for report *
                  </label>
                  <select
                    required
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="">Select a reason</option>
                    <option value="Incorrect or Fake Phone Number">Incorrect or Fake Phone Number</option>
                    <option value="Unprofessional or Rude Behavior">Unprofessional or Rude Behavior</option>
                    <option value="Overcharging or Changing Agreed Fee">Overcharging or Changing Agreed Fee</option>
                    <option value="Did Not Show Up For Appointment">Did Not Show Up For Appointment</option>
                    <option value="Suspicious Profile / Fraud Concern">Suspicious Profile / Fraud Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Provide any specific details or incident notes..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
