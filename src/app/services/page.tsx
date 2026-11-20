'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Service } from '@/types';
import ServiceCard from '@/components/services/ServiceCard';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  ArrowUpDown,
  Scissors,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
];

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortOption, setSortOption] = useState<string>('default');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.services.getAll({
        search: searchTerm,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        sort: sortOption === 'default' ? undefined : sortOption,
      });
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [searchTerm, selectedCategory, sortOption]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortOption('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
            alt="Salon styling"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Browse Salon Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Discover precision haircuts, radiant balayage, relaxing facials, and luxury nail care.
            Filter by your desired treatment and sort by price with ease.
          </p>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 salon-card-shadow space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input (Challenge Requirement) */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm font-medium text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown (Challenge Requirement) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-rose-500" />
              <span>Sort By:</span>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-semibold text-slate-700 bg-white shadow-sm cursor-pointer"
            >
              <option value="default">Newest Added</option>
              <option value="price-asc">Price: Low to High ($)</option>
              <option value="price-desc">Price: High to Low ($$)</option>
            </select>

            {(searchTerm || selectedCategory !== 'All' || sortOption !== 'default') && (
              <button
                onClick={handleClearFilters}
                className="px-3.5 py-3 rounded-2xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors shrink-0"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 shrink-0 mr-2">
              <Filter className="w-3.5 h-3.5 text-rose-500" />
              <span>Category:</span>
            </div>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                      : 'bg-rose-50/60 text-slate-600 hover:bg-rose-100/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-sm text-slate-500 px-1">
        <p>
          Showing <span className="font-bold text-slate-800">{services.length}</span> active salon services
        </p>
        {selectedCategory !== 'All' && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-600">
            Filtered by: {selectedCategory}
          </span>
        )}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center max-w-lg mx-auto salon-card-shadow">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 rotate-45" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Services Found</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            We couldn't find any salon services matching your current filter criteria.
            Try searching for something else or reset your filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading SalonBook catalog...</p>
        </div>
      }
    >
      <BrowseServicesContent />
    </Suspense>
  );
}
