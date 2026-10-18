import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { WorkerProfile, ServiceCategory } from '../types';
import { PAKISTAN_PROVINCES, formatPKR } from '../data/pakistanData';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  MessageSquare,
  Filter,
  SlidersHorizontal,
  Heart,
  Calendar,
  X,
  AlertCircle,
} from 'lucide-react';

interface SearchPageProps {
  initialFilters?: {
    query?: string;
    province?: string;
    city?: string;
    category?: string;
  };
  onSelectWorker: (workerId: string) => void;
  onOpenBooking: (worker: WorkerProfile) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialFilters,
  onSelectWorker,
  onOpenBooking,
}) => {
  const { user } = useAuth();
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [query, setQuery] = useState(initialFilters?.query || '');
  const [province, setProvince] = useState(initialFilters?.province || '');
  const [city, setCity] = useState(initialFilters?.city || '');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState(initialFilters?.category || '');
  const [minRating, setMinRating] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'priceAsc'>('rating');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    ApiService.getCategories().then(setCategories).catch(() => {});
    if (user) {
      ApiService.getFavorites()
        .then(favs => setFavorites(favs.map(f => f.id)))
        .catch(() => {});
    }
  }, [user]);

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getWorkers({
        query: query.trim() || undefined,
        province: province || undefined,
        city: city || undefined,
        area: area.trim() || undefined,
        category: category || undefined,
        isAvailable: availableOnly ? true : undefined,
        minRating: minRating > 0 ? minRating : undefined,
      });

      // Client-side sort
      data.sort((a, b) => {
        if (sortBy === 'rating') return b.ratingAverage - a.ratingAverage;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        if (sortBy === 'priceAsc') return a.visitingFee - b.visitingFee;
        return 0;
      });

      setWorkers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, [province, city, area, category, minRating, availableOnly, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadWorkers();
  };

  const handleToggleFavorite = async (workerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save favorite workers.');
      return;
    }
    try {
      const res = await ApiService.toggleFavorite(workerId);
      if (res.isFavorite) {
        setFavorites(prev => [...prev, workerId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== workerId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllFilters = () => {
    setQuery('');
    setProvince('');
    setCity('');
    setArea('');
    setCategory('');
    setMinRating(0);
    setAvailableOnly(false);
    setSortBy('rating');
  };

  const availableCities = province
    ? PAKISTAN_PROVINCES.find(p => p.name === province)?.cities || []
    : PAKISTAN_PROVINCES.flatMap(p => p.cities);

  const availableAreas = city
    ? availableCities.find(c => c.name === city)?.areas || []
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Search bar */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Skilled Workers in Pakistan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Direct contact with verified technicians. Zero booking fees.
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by worker name, skill, or area (e.g. Inverter, Wiring, DHA)..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-xs"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700"
          >
            <Filter className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>Filter Results</span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-teal-600 hover:underline font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Service Category */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Service Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full text-xs font-medium p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Services</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Province / Region
            </label>
            <select
              value={province}
              onChange={e => {
                setProvince(e.target.value);
                setCity('');
                setArea('');
              }}
              className="w-full text-xs font-medium p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Pakistan</option>
              {PAKISTAN_PROVINCES.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              City
            </label>
            <select
              value={city}
              onChange={e => {
                setCity(e.target.value);
                setArea('');
              }}
              className="w-full text-xs font-medium p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Cities</option>
              {availableCities.map((c, i) => (
                <option key={`${c.name}-${i}`} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Area / Neighborhood */}
          {availableAreas.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Area / Town
              </label>
              <select
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full text-xs font-medium p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Areas in {city}</option>
                {availableAreas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Minimum Rating
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Any Rating', val: 0 },
                { label: '4.8 & Above', val: 4.8 },
                { label: '4.5 & Above', val: 4.5 },
                { label: '4.0 & Above', val: 4.0 },
              ].map(opt => (
                <label key={opt.val} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === opt.val}
                    onChange={() => setMinRating(opt.val)}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-slate-700 font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={e => setAvailableOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs font-bold text-slate-800">Available Today Only</span>
            </label>
          </div>
        </aside>

        {/* Results Main Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Sort and Counter bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="font-semibold text-slate-700">
              Showing <span className="font-bold text-teal-700">{workers.length}</span> verified workers
              {city && ` in ${city}`}
              {category && ` for ${category}`}
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                aria-label="Sort search results"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-bold text-slate-800 focus:ring-2 focus:ring-teal-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="priceAsc">Visiting Fee: Low to High</option>
              </select>
            </div>
          </div>

          {/* Worker Cards List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse flex space-x-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : workers.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Workers Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn’t find any approved workers matching your selected location and filters. Try clearing some filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {workers.map(worker => {
                const isFav = favorites.includes(worker.id);
                return (
                  <div
                    key={worker.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/80 shadow-2xs hover:shadow-md transition p-5 flex flex-col md:flex-row justify-between gap-5"
                  >
                    <div className="flex items-start space-x-4 rtl:space-x-reverse flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200"
                        />
                        {worker.isAvailable ? (
                          <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" title="Available now" />
                        ) : (
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 w-4 h-4 rounded-full border-2 border-white" title="Busy" />
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <h3
                              onClick={() => onSelectWorker(worker.id)}
                              className="font-extrabold text-slate-900 text-lg hover:text-teal-600 cursor-pointer transition"
                            >
                              {worker.name}
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                          </div>

                          <button
                            onClick={e => handleToggleFavorite(worker.id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                            title={isFav ? 'Remove from favorites' : 'Save worker'}
                          >
                            <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                            {worker.serviceCategory}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-medium flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{worker.area ? `${worker.area}, ` : ''}{worker.city}</span>
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-medium">
                            {worker.experienceYears} Years Exp.
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pt-1">
                          {worker.bio}
                        </p>

                        {/* Sub skills pills */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {worker.subSkills.map((skill, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right action & price col */}
                    <div className="md:w-56 shrink-0 md:border-l rtl:md:border-r rtl:md:border-l-0 md:border-slate-100 md:pl-5 rtl:md:pr-5 flex flex-col justify-between pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div>
                        <div className="flex items-center justify-between md:justify-start space-x-2 mb-2">
                          <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-800">
                              {worker.ratingAverage > 0 ? worker.ratingAverage : '5.0'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {worker.totalReviews} reviews ({worker.totalCompletedJobs || 0} jobs)
                          </span>
                        </div>

                        <div className="text-xs space-y-0.5">
                          <span className="text-slate-400 uppercase font-bold text-[10px] block">Visiting Fee</span>
                          <span className="text-base font-black text-slate-900">
                            {formatPKR(worker.visitingFee)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Direct cash / Easypaisa
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="grid grid-cols-2 gap-1.5">
                          <a
                            href={`tel:${worker.phone}`}
                            className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-teal-600" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`https://wa.me/${worker.whatsapp}?text=${encodeURIComponent(`Assalam o Alaikum ${worker.name}, I found you on Kaam Wala Pakistan. Are you available for service in ${worker.city}?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        <button
                          onClick={() => onOpenBooking(worker)}
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition shadow-2xs"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Service</span>
                        </button>

                        <button
                          onClick={() => onSelectWorker(worker.id)}
                          className="w-full py-1 text-center text-[11px] font-semibold text-slate-500 hover:text-teal-700 hover:underline"
                        >
                          View Full Profile & Reviews →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
