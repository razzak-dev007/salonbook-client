'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Service } from '@/types';
import BookingModal from '@/components/services/BookingModal';
import {
  Clock,
  Tag,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  // Authentication check: redirect to sign in if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/services/${id}`);
    }
  }, [user, authLoading, id, router]);

  useEffect(() => {
    async function loadService() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await api.services.getById(id);
        if (res.success && res.data) {
          setService(res.data);
        } else {
          setError(res.message || 'Service details could not be found.');
        }
      } catch (err: any) {
        setError(err.message || 'The requested salon service does not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadService();
    }
  }, [id, user]);

  if (authLoading || (loading && !error)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600">Verifying access and loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Service Not Available</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {error || 'The requested service was not found in our database.'}
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Browse Services</span>
        </Link>
      </div>
    );
  }

  const isInactive = service.status === 'inactive';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse Services</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-rose-100 salon-card-shadow overflow-hidden">
        {/* Left Column: Big Image & Badges */}
        <div className="lg:col-span-7 relative h-80 sm:h-[480px] w-full overflow-hidden bg-rose-50">
          <img
            src={service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'}
            alt={service.serviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-rose-700 shadow-md backdrop-blur-md">
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              {service.category}
            </span>
            {isInactive && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-md">
                Currently Inactive
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Service Information & Booking Action */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  {service.duration} Minutes
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">Guaranteed Artistry</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {service.serviceName}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Service Fee</p>
                <p className="text-3xl font-black text-slate-900">${service.price}</p>
              </div>
              <span className="text-xs text-rose-700 font-semibold px-3 py-1 rounded-full bg-white shadow-sm border border-rose-100">
                Taxes Included
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Service Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>One-on-one consultation with master stylist included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Complimentary organic hair & scalp wash treatment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero charge until appointment is reviewed and confirmed</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8 border-t border-slate-100 mt-6">
            {isInactive ? (
              <div className="p-4 rounded-2xl bg-slate-100 text-center text-sm font-medium text-slate-500">
                This service is temporarily inactive and not accepting new appointment requests.
              </div>
            ) : isAdmin ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-800">
                You are currently logged in as an <strong>Administrator</strong>. Administrators cannot submit customer booking requests.
              </div>
            ) : (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 shadow-lg shadow-rose-200 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Book This Appointment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {service && (
        <BookingModal
          service={service}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
