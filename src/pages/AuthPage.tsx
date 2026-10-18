import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { PAKISTAN_PROVINCES, SERVICE_CATEGORIES } from '../data/pakistanData';
import {
  Wrench,
  ShieldCheck,
  User as UserIcon,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Sparkles,
  MapPin,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register-customer' | 'register-worker';
  onSuccess: (role: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
}) => {
  const { login, quickDemoLogin } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(
    initialMode === 'login' ? 'login' : 'register'
  );
  const [role, setRole] = useState<'customer' | 'worker'>(
    initialMode === 'register-worker' ? 'worker' : 'customer'
  );

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cnic, setCnic] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Electrician');
  const [subSkills, setSubSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [visitingFee, setVisitingFee] = useState(500);
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        const stored = ApiService.getStoredUser();
        onSuccess(stored?.role || 'customer');
      } else {
        if (role === 'customer') {
          await ApiService.registerCustomer({
            name,
            email,
            password,
            phone,
            province,
            city,
            area,
          });
          onSuccess('customer');
        } else {
          const skillsList = subSkills
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

          await ApiService.registerWorker({
            name,
            email,
            password,
            phone,
            whatsapp: whatsapp || phone,
            cnic,
            province,
            city,
            area,
            serviceCategory,
            subSkills: skillsList.length ? skillsList : [serviceCategory],
            experienceYears,
            visitingFee,
            bio,
          });
          onSuccess('worker');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const availableCities = PAKISTAN_PROVINCES.find(p => p.name === province)?.cities || [];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Sign in to Kaam Wala Pakistan' : 'Create Free Account'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            100% Free • No commissions or hidden registration fees
          </p>
        </div>

        {/* Mode Selector (Login vs Register) */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* If registering, choose Customer or Worker */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-xl border flex flex-col items-center space-y-1 transition ${
                role === 'customer'
                  ? 'border-teal-600 bg-teal-50/50 text-teal-900 font-bold ring-2 ring-teal-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserIcon className="w-5 h-5 text-teal-600" />
              <span>I am a Customer</span>
              <span className="text-[10px] text-slate-400 font-normal">Hire skilled workers</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`p-3 rounded-xl border flex flex-col items-center space-y-1 transition ${
                role === 'worker'
                  ? 'border-teal-600 bg-teal-50/50 text-teal-900 font-bold ring-2 ring-teal-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-5 h-5 text-teal-600" />
              <span>I am a Worker</span>
              <span className="text-[10px] text-slate-400 font-normal">Electrician, Plumber, etc.</span>
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Muhammad Tariq"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pakistani Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Province *</label>
                  <select
                    value={province}
                    onChange={e => {
                      setProvince(e.target.value);
                      const firstCity = PAKISTAN_PROVINCES.find(p => p.name === e.target.value)?.cities[0]?.name || '';
                      setCity(firstCity);
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {PAKISTAN_PROVINCES.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {availableCities.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Area / Neighborhood</label>
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="e.g. DHA, Gulberg, Saddar..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Specific fields for WORKER */}
              {role === 'worker' && (
                <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-3 pt-3">
                  <h4 className="font-bold text-teal-900 text-xs">Worker Professional Details</h4>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Skill / Service Category *</label>
                    <select
                      value={serviceCategory}
                      onChange={e => setServiceCategory(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                    >
                      {SERVICE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name} ({cat.nameUrdu})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CNIC Number (Verification)</label>
                      <input
                        type="text"
                        value={cnic}
                        onChange={e => setCnic(e.target.value)}
                        placeholder="35201-1234567-1"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        placeholder="03001234567"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Years of Experience</label>
                      <input
                        type="number"
                        min={1}
                        max={40}
                        value={experienceYears}
                        onChange={e => setExperienceYears(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Standard Visit Fee (PKR)</label>
                      <input
                        type="number"
                        step={50}
                        min={100}
                        value={visitingFee}
                        onChange={e => setVisitingFee(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Specialized Sub-skills (Comma separated)</label>
                    <input
                      type="text"
                      value={subSkills}
                      onChange={e => setSubSkills(e.target.value)}
                      placeholder="e.g. Wiring, Inverter AC, Circuit Breakers, Pipe Fitting..."
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-xs"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Log In to Account'
              : role === 'worker'
              ? 'Submit Worker Profile for Approval'
              : 'Complete Customer Registration'}
          </button>
        </form>

        {/* Fast Demo One-Click Fillers */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <span className="text-[11px] font-bold text-slate-400 block mb-2">
            Instant Test Logins (Click to pre-fill & login):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={async () => {
                await quickDemoLogin('customer');
                onSuccess('customer');
              }}
              className="p-1.5 rounded-lg bg-blue-50 text-blue-800 font-bold hover:bg-blue-100"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={async () => {
                await quickDemoLogin('worker-approved');
                onSuccess('worker');
              }}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100"
            >
              Approved Pro
            </button>
            <button
              type="button"
              onClick={async () => {
                await quickDemoLogin('worker-pending');
                onSuccess('worker');
              }}
              className="p-1.5 rounded-lg bg-amber-50 text-amber-800 font-bold hover:bg-amber-100"
            >
              Pending Pro
            </button>
            <button
              type="button"
              onClick={async () => {
                await quickDemoLogin('admin');
                onSuccess('admin');
              }}
              className="p-1.5 rounded-lg bg-purple-50 text-purple-800 font-bold hover:bg-purple-100"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
