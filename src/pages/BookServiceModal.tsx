import React, { useState } from 'react';
import { WorkerProfile } from '../types';
import { ApiService } from '../services/api';
import { formatPKR } from '../data/pakistanData';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

interface BookServiceModalProps {
  worker: WorkerProfile;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const BookServiceModal: React.FC<BookServiceModalProps> = ({
  worker,
  onClose,
  onSuccess,
  onNavigateLogin,
}) => {
  const { user } = useAuth();

  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [address, setAddress] = useState(user?.area ? `${user.area}, ${user.city}` : '');
  const [isEmergency, setIsEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sign In to Book {worker.name}</h3>
          <p className="text-xs text-slate-600">
            You need a free customer account on Kaam Wala Pakistan to send booking requests and track jobs.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateLogin();
              }}
              className="flex-1 py-2 text-xs font-bold text-white bg-teal-600 rounded-xl"
            >
              Log In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Please provide a brief description of the job or problem.');
      return;
    }

    if (!address.trim()) {
      setError('Please provide your complete address/location.');
      return;
    }

    setLoading(true);
    try {
      await ApiService.createBooking({
        workerId: worker.id,
        description,
        preferredDate,
        preferredTimeSlot,
        address,
        city: worker.city,
        area: worker.area,
        isEmergency,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Error submitting booking request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-slate-900">Booking Request Sent!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              {worker.name} has received your request. You can check the status and contact them from your Customer Portal.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse pb-4 border-b border-slate-100">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Book {worker.name}
                </h3>
                <p className="text-xs text-teal-700 font-semibold">
                  {worker.serviceCategory} • {worker.city}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe Problem / Required Work *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Inverter AC not cooling, fan working. Please bring multimeter and gas gauges..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={e => setPreferredTimeSlot(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="morning">Morning (9:00 AM - 1:00 PM)</option>
                    <option value="afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                    <option value="evening">Evening (5:00 PM - 9:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complete Address / House No. / Area *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Block C, Phase 4, DHA..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={e => setIsEmergency(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">
                      Mark as Urgent / Emergency Job
                    </span>
                    <span className="text-[10px] text-amber-700 block">
                      Notifies the worker that water leakage, short circuit, or critical fix is required immediately.
                    </span>
                  </div>
                </label>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Estimated Visiting Charges:</span>
                  <span className="text-teal-700 font-extrabold">{formatPKR(worker.visitingFee)}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Payment is made directly to the worker in cash or EasyPaisa after inspection.
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Send Booking Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
