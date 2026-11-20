'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Service } from '@/types';
import ServiceCard from '@/components/services/ServiceCard';
import {
  Scissors,
  Sparkles,
  Calendar,
  ShieldCheck,
  Star,
  ArrowRight,
  Award,
  HeartHandshake,
  Clock,
  CheckCircle,
} from 'lucide-react';

const CATEGORIES_DATA = [
  {
    name: 'Haircut & Styling',
    description: 'Precision cuts, blowouts, and signature looks',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    icon: Scissors,
  },
  {
    name: 'Hair Coloring',
    description: 'Balayage, highlights, gloss, and tint touch-ups',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    icon: Sparkles,
  },
  {
    name: 'Hair Treatment',
    description: 'Keratin smoothing, deep moisture, and scalp therapy',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    icon: ShieldCheck,
  },
  {
    name: 'Facial & Skincare',
    description: 'Hydra-cleansing, anti-aging, and radiant peels',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    icon: Star,
  },
  {
    name: 'Makeup',
    description: 'Bridal, photoshoot, and red-carpet evening glamour',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    icon: Award,
  },
  {
    name: 'Manicure & Pedicure',
    description: 'Luxury organic gel nail enhancements and spas',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    icon: HeartHandshake,
  },
  {
    name: 'Spa & Massage',
    description: 'Aromatherapy hot stone rituals and holistic relaxation',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    icon: Clock,
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.services.getFeatured();
        if (res.success && res.data) {
          setFeaturedServices(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured services', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO / BANNER SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Atmospheric Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=2000&q=85"
            alt="Salon Interior"
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fffdfc] via-transparent to-black/40" />
          <div className="absolute inset-0 bg-rose-950/20 mix-blend-multiply" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-rose-200 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>Elevate Your Personal Elegance</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Luxury Hair & Beauty <br />
            <span className="bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 bg-clip-text text-transparent">
              Appointments Simplified
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-200 font-light leading-relaxed mb-10">
            Immerse yourself in bespoke salon care. Reserve time with acclaimed master stylists,
            discover trending signature treatments, and enjoy seamless Stripe checkout.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white font-bold text-base shadow-xl shadow-rose-900/40 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 group"
            >
              <span>Explore Salon Services</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5 text-rose-300" />
              <span>Book as a Client</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 pt-10 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-white">15k+</p>
              <p className="text-xs uppercase tracking-wider text-rose-200 mt-1">Appointments Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9 / 5</p>
              <p className="text-xs uppercase tracking-wider text-rose-200 mt-1">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">25+</p>
              <p className="text-xs uppercase tracking-wider text-rose-200 mt-1">Master Stylists</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-xs uppercase tracking-wider text-rose-200 mt-1">Verified Stripe Flow</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED SALON SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-widest mb-2">
              <Scissors className="w-4 h-4" />
              <span>Artistry & Expertise</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Salon Services
            </h2>
            <p className="text-slate-500 text-base mt-2 max-w-xl">
              Curated luxury treatments performed by master colorists and certified skincare therapists.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Services Grid or Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 3. DYNAMIC SECTION 2: SALON SERVICE CATEGORIES */}
      <section className="bg-gradient-to-b from-[#fbf5f2] to-[#fffdfc] py-20 border-y border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-rose-600 text-xs font-bold uppercase tracking-widest">
              Explore Our Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Salon Service Categories
            </h2>
            <p className="text-slate-500 text-base mt-2">
              Click on any discipline to filter specialized treatments designed for your personalized aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORIES_DATA.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-rose-100 p-6 salon-card-shadow salon-card-shadow-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ADDITIONAL SECTION: WHY CHOOSE SALONBOOK & REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Guarantees */}
          <div className="space-y-8">
            <div>
              <span className="text-rose-600 text-xs font-bold uppercase tracking-widest">
                The SalonBook Promise
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Why Discerning Clients Choose Our Booking Platform
              </h2>
              <p className="text-slate-500 text-base mt-3 leading-relaxed">
                We believe your salon journey should be effortless from discovery to styling chair.
                Here is how we maintain perfection across every single appointment.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-rose-100 salon-card-shadow">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">Master-Certified Stylists</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Every service provider holds rigorous industry certifications and stays ahead with current European and American beauty trends.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-rose-100 salon-card-shadow">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">Premium Organic Botanical Formulas</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Cruelty-free, paraben-free, and dermatologically tested hair colors and spa products that nourish while they transform.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-rose-100 salon-card-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">Frictionless Stripe Protection</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Encrypted Stripe Checkout integration. Appointments are only paid once officially confirmed by the salon administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Testimonial */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80"
                alt="Styling in action"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-base font-medium italic mb-3">
                  “The best salon booking experience I have ever used. Booking was seamless, confirmation took minutes, and my balayage has never looked more vibrant!”
                </p>
                <div>
                  <p className="text-sm font-bold text-white">Sophia Montgomery</p>
                  <p className="text-xs text-rose-300">Verified Client — Beverly Hills Studio</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Voted #1 Salon</p>
                <p className="text-[10px] text-slate-400">Excellence in Beauty 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
