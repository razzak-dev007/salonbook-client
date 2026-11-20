'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { CustomerStats } from '@/types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  ArrowRight,
  Sparkles,
  Scissors,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.dashboard.getCustomerStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load customer stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardLayout allowedRole="customer" pageTitle="Customer Overview">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white p-8 overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Ready for your next signature look?
            </h2>
            <p className="text-rose-100 text-sm leading-relaxed mb-6">
              Track your upcoming beauty sessions, complete payments on confirmed slots, or discover new seasonal treatments.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="px-5 py-2.5 rounded-full bg-white text-rose-700 text-xs font-bold hover:bg-rose-50 shadow-md transition-all flex items-center gap-1.5"
              >
                <Scissors className="w-4 h-4" />
                <span>Explore Salon Services</span>
              </Link>
              <Link
                href="/dashboard/customer/appointments"
                className="px-5 py-2.5 rounded-full bg-white/20 text-white text-xs font-semibold hover:bg-white/30 backdrop-blur-sm transition-all"
              >
                <span>View My Appointments</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Statistics Cards (Requirement from doc) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Total Requests */}
          <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Requests</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loading ? '...' : stats?.totalRequests ?? 0}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">All time bookings</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* 2. Pending Appointments */}
          <div className="bg-white p-6 rounded-3xl border border-amber-100 salon-card-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loading ? '...' : stats?.pendingAppointments ?? 0}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Awaiting salon review</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* 3. Confirmed Appointments */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 salon-card-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loading ? '...' : stats?.confirmedAppointments ?? 0}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Ready for appointment / payment</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* 4. Cancelled Appointments */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 salon-card-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Cancelled</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loading ? '...' : stats?.cancelledAppointments ?? 0}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Cancelled requests</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Recent Appointments Preview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 salon-card-shadow space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Appointment Requests</h3>
            <Link
              href="/dashboard/customer/appointments"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 rounded-2xl bg-slate-50 animate-pulse" />
              ))}
            </div>
          ) : stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentAppointments.map((appt) => (
                <div key={appt._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={appt.service?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'}
                      alt={appt.service?.serviceName}
                      className="w-12 h-12 rounded-2xl object-cover shrink-0 ring-1 ring-rose-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{appt.service?.serviceName || 'Salon Service'}</h4>
                      <p className="text-xs text-slate-400">
                        Date: <span className="font-semibold text-slate-600">{appt.appointmentDate}</span> at{' '}
                        <span className="font-semibold text-slate-600">{appt.timeSlot}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        appt.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : appt.status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {appt.status}
                    </span>

                    {/* Payment Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        appt.paymentStatus === 'paid'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {appt.paymentStatus}
                    </span>

                    <span className="text-sm font-black text-slate-900">${appt.servicePrice}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p>No appointment requests yet.</p>
              <Link href="/services" className="text-rose-600 font-bold hover:underline mt-2 inline-block">
                Browse our salon menu
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
