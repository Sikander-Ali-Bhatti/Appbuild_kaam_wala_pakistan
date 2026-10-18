import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { Booking, WorkerProfile } from '../types';
import { formatPKR, PAKISTAN_PROVINCES } from '../data/pakistanData';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  Star,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  Edit,
  Save,
  MapPin,
  X,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user, workerProfile, refreshUser, updateWorkerProfileState } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'reviews'>('bookings');

  // Reject booking modal
  const [rejectBooking, setRejectBooking] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(workerProfile?.bio || '');
  const [visitingFee, setVisitingFee] = useState(workerProfile?.visitingFee || 500);
  const [workingHours, setWorkingHours] = useState(workerProfile?.workingHours || '');
  const [subSkillsText, setSubSkillsText] = useState(workerProfile?.subSkills?.join(', ') || '');
  const [area, setArea] = useState(workerProfile?.area || '');
  const [whatsapp, setWhatsapp] = useState(workerProfile?.whatsapp || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (workerProfile) {
      setBio(workerProfile.bio);
      setVisitingFee(workerProfile.visitingFee);
      setWorkingHours(workerProfile.workingHours);
      setSubSkillsText(workerProfile.subSkills.join(', '));
      setArea(workerProfile.area);
      setWhatsapp(workerProfile.whatsapp);
    }
  }, [workerProfile]);

  const handleToggleAvailability = async () => {
    if (!workerProfile) return;
    try {
      const res = await ApiService.updateWorkerAvailability(!workerProfile.isAvailable);
      updateWorkerProfileState(res.worker);
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Error updating availability');
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await ApiService.updateBookingStatus(bookingId, 'accepted');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error accepting booking');
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectBooking) return;
    try {
      await ApiService.updateBookingStatus(rejectBooking.id, 'rejected', rejectReason);
      setRejectBooking(null);
      setRejectReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error rejecting booking');
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    if (!confirm('Mark this job as completed? This will allow the customer to leave an official review.')) {
      return;
    }
    try {
      await ApiService.updateBookingStatus(bookingId, 'completed');
      loadData();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Error completing booking');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = subSkillsText.split(',').map(s => s.trim()).filter(Boolean);
      const res = await ApiService.updateWorkerProfile({
        bio,
        visitingFee: Number(visitingFee),
        workingHours,
        subSkills: skillsArray,
        area,
        whatsapp,
      });
      updateWorkerProfileState(res.worker);
      setIsEditing(false);
      setProfileSaveSuccess('Worker profile updated successfully!');
      setTimeout(() => setProfileSaveSuccess(''), 3000);
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Error saving profile');
    }
  };

  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const activeJobs = bookings.filter(b => b.status === 'accepted');
  const pastJobs = bookings.filter(b => ['completed', 'cancelled', 'rejected'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Approval Status Banners */}
      {workerProfile?.approvalStatus === 'pending' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex items-start space-x-4 rtl:space-x-reverse">
          <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-amber-900 text-base">
              Verification in Progress (Pending Admin Review)
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Assalam o Alaikum {workerProfile.name}! Your profile was submitted to the Kaam Wala moderation team. We check technician details to maintain marketplace quality. You will be notified as soon as your listing is approved and visible to customers.
            </p>
          </div>
        </div>
      )}

      {workerProfile?.approvalStatus === 'rejected' && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 flex items-start space-x-4 rtl:space-x-reverse">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h3 className="font-extrabold text-rose-900 text-base">
              Profile Verification Not Approved
            </h3>
            <p className="text-xs text-rose-800">
              Reason: {workerProfile.rejectionReason || 'Incomplete service details or unverified phone number.'}
            </p>
            <p className="text-xs text-rose-700 pt-1">
              Please update your profile details below with accurate contact information to resubmit for review.
            </p>
          </div>
        </div>
      )}

      {workerProfile?.approvalStatus === 'suspended' && (
        <div className="bg-red-50 border-2 border-red-400 rounded-3xl p-5 flex items-start space-x-4 rtl:space-x-reverse">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-red-900 text-base">
              Account Suspended
            </h3>
            <p className="text-xs text-red-800">
              Your profile has been suspended following customer reports or policy review. Please contact support@kaamwala.pk for assistance.
            </p>
          </div>
        </div>
      )}

      {/* Header Profile Summary & Availability Toggle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <img
            src={workerProfile?.avatar || user?.avatar}
            alt={workerProfile?.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">{workerProfile?.name}</h1>
              {workerProfile?.approvalStatus === 'approved' && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Approved Live Pro</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {workerProfile?.serviceCategory} • {workerProfile?.area ? `${workerProfile.area}, ` : ''}{workerProfile?.city} • {workerProfile?.experienceYears} Yrs Exp.
            </p>
          </div>
        </div>

        {/* Availability Switch */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="text-right rtl:text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
            <span className={`text-xs font-black ${workerProfile?.isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
              {workerProfile?.isAvailable ? 'Available for Jobs' : 'Busy / On Leave'}
            </span>
          </div>

          <button
            onClick={handleToggleAvailability}
            className="p-1 text-slate-700 hover:text-teal-600 transition"
            title="Toggle your availability"
          >
            {workerProfile?.isAvailable ? (
              <ToggleRight className="w-10 h-10 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Worker Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Completed Jobs</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {workerProfile?.totalCompletedJobs || 0}
          </span>
          <span className="text-[10px] text-teal-600 font-bold">100% Free / Direct Pay</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Average Star Rating</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-black text-slate-900">
              {workerProfile?.ratingAverage && workerProfile.ratingAverage > 0 ? workerProfile.ratingAverage : '5.0'}
            </span>
            <span className="text-xs text-slate-400">({workerProfile?.totalReviews || 0} reviews)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Visiting Charges</span>
          <span className="text-2xl font-black text-teal-700 mt-1 block">
            {formatPKR(workerProfile?.visitingFee || 500)}
          </span>
          <span className="text-[10px] text-slate-500">Per inspection visit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Commission Taken</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            Rs. 0
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">Zero deductions always</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 rtl:space-x-reverse">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'bookings'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Job Requests ({pendingRequests.length} pending, {activeJobs.length} active)</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>My Profile & Skills</span>
        </button>
      </div>

      {/* TAB: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-8">
          {/* 1. Pending Requests (Needs worker decision) */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900">Incoming Requests Awaiting Your Response</h2>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  {pendingRequests.length} New
                </span>
              )}
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No pending requests right now. Ensure your status is set to "Available for Jobs".
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map(b => (
                  <div key={b.id} className="bg-amber-50/50 border-2 border-amber-200 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                      <div>
                        <span className="font-extrabold text-slate-900 text-base">{b.customerName}</span>
                        <span className="text-xs text-slate-500 block">Requested {new Date(b.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                        Action Required
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-400 text-[10px] uppercase block">Visit Date</span>
                        <span className="font-semibold text-slate-800">{b.preferredDate} ({b.preferredTimeSlot})</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 text-[10px] uppercase block">Location</span>
                        <span className="font-semibold text-slate-800">{b.address}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 text-[10px] uppercase block">Phone / WhatsApp</span>
                        <span className="font-semibold text-slate-800">{b.customerPhone}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl text-xs text-slate-700 border border-slate-200">
                      <strong className="block text-slate-900 mb-0.5">Problem Details:</strong>
                      {b.description}
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setRejectBooking(b)}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptBooking(b.id)}
                        className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        Accept Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Active Accepted Jobs */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Active Jobs in Progress ({activeJobs.length})</h2>

            {activeJobs.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No active jobs currently in progress.
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map(b => (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-black text-slate-900 text-base">{b.customerName}</span>
                        <span className="text-xs text-slate-400 block">Booking #{b.id}</span>
                      </div>
                      <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                        Confirmed & Scheduled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-400 text-[10px] uppercase block">Scheduled Date</span>
                        <span className="font-semibold text-slate-800">{b.preferredDate} ({b.preferredTimeSlot})</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 text-[10px] uppercase block">Customer Address</span>
                        <span className="font-semibold text-slate-800">{b.address}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 text-[10px] uppercase block">Visit Fee</span>
                        <span className="font-semibold text-slate-800">{formatPKR(b.estimatedFee || 500)}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                      {b.description}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <div className="flex space-x-2">
                        <a
                          href={`tel:${b.customerPhone}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                        >
                          <Phone className="w-3.5 h-3.5 text-teal-600" />
                          <span>Call: {b.customerPhone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/[\s+-]/g, '')}?text=${encodeURIComponent(`Assalam o Alaikum ${b.customerName}, this is ${workerProfile?.name} regarding your booking on Kaam Wala Pakistan.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <button
                        onClick={() => handleCompleteBooking(b.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        ✓ Mark Job as Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Past Completed / History */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Job History ({pastJobs.length})</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <div className="divide-y divide-slate-100">
                {pastJobs.slice(0, 5).map(b => (
                  <div key={b.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{b.customerName}</span>
                      <span className="text-slate-400 block text-[11px]">{b.preferredDate} • {b.address}</span>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        b.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Profile & Skills Editor */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Edit Worker Profile & Rates</h2>
            <span className="text-xs text-slate-400">Updates reflect live immediately</span>
          </div>

          {profileSaveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
              {profileSaveSuccess}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Visiting Charges (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  step={50}
                  value={visitingFee}
                  onChange={e => setVisitingFee(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="923001234567"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sub-Skills & Specializations (Comma Separated)
              </label>
              <input
                type="text"
                value={subSkillsText}
                onChange={e => setSubSkillsText(e.target.value)}
                placeholder="Wiring, Inverter Setup, Fault Finding, Circuit Breakers..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Helps customers find you when they search for specific repairs.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Working Days & Hours
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={e => setWorkingHours(e.target.value)}
                placeholder="e.g. 9:00 AM - 8:00 PM (Mon-Sat)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Local Town / Neighborhood Service Area
              </label>
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Gulberg, DHA, Model Town"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Professional Bio & Experience Description
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Describe your expertise, past projects, warranties offered..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
            >
              Save Profile Updates
            </button>
          </form>
        </div>
      )}

      {/* Reject Booking Modal */}
      {rejectBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">Decline Booking</h3>
            <p className="text-xs text-slate-600 mb-4">
              Please provide a quick reason so {rejectBooking.customerName} can look for another worker.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <select
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="">Select reason</option>
                <option value="Already booked during this time window">Already booked during this time window</option>
                <option value="Location is outside my daily service range">Location is outside my daily service range</option>
                <option value="Required tools/parts unavailable today">Required tools/parts unavailable today</option>
                <option value="Emergency family commitment">Emergency family commitment</option>
              </select>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectBooking(null)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
