'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { AdminStats } from '@/types';
import {
  Users,
  Scissors,
  Calendar,
  Clock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.dashboard.getAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardLayout allowedRole="admin" pageTitle="Administrator Dashboard">
      <div className="space-y-8">
        {/* Admin Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-8 overflow-hidden shadow-xl border border-rose-900/40">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Control Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Salon Operations & Booking Management
            </h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Monitor incoming customer requests, review schedule capacity, configure catalog services, and track verified Stripe transactions.
            </p>
          </div>
        </div>

        {/* 6 Statistics Cards (Requirement from doc) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {/* 1. Total Registered Customers */}
          <div className="bg-white p-5 rounded-3xl border border-rose-100 salon-card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Customers</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {loading ? '...' : stats?.totalRegisteredCustomers ?? 0}
            </h3>
          </div>

          {/* 2. Total Active Services */}
          <div className="bg-white p-5 rounded-3xl border border-rose-100 salon-card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-3">
              <Scissors className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Services</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {loading ? '...' : stats?.totalActiveServices ?? 0}
            </h3>
          </div>

          {/* 3. Total Appointment Requests */}
          <div className="bg-white p-5 rounded-3xl border border-rose-100 salon-card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {loading ? '...' : stats?.totalAppointments ?? 0}
            </h3>
          </div>

          {/* 4. Pending Appointments */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 salon-card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Review</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {loading ? '...' : stats?.pendingAppointments ?? 0}
            </h3>
          </div>

          {/* 5. Confirmed Appointments */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 salon-card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {loading ? '...' : stats?.confirmedAppointments ?? 0}
            </h3>
          </div>

          {/* 6. Total Successful Payments */}
          <div className="bg-white p-5 rounded-3xl border border-blue-100 salon-card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Paid Sessions</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {loading ? '...' : stats?.totalSuccessfulPayments ?? 0}
            </h3>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="p-6 rounded-3xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-300">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-300">Total Platform Revenue</p>
              <h4 className="text-3xl font-black">${stats?.totalRevenue ?? 0} USD</h4>
            </div>
          </div>
          <Link
            href="/dashboard/admin/transactions"
            className="px-5 py-2.5 rounded-full bg-white text-emerald-900 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-md"
          >
            View All Stripe Transactions
          </Link>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/admin/services"
            className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow hover:border-rose-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Scissors className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Manage Salon Services</h4>
            <p className="text-xs text-slate-500">
              Add new treatments, edit prices and durations, or toggle service active status.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/appointments"
            className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow hover:border-rose-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Manage Appointments</h4>
            <p className="text-xs text-slate-500">
              Review incoming customer requests, confirm valid time slots, or cancel conflicts.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow hover:border-rose-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Manage Registered Users</h4>
            <p className="text-xs text-slate-500">
              View customer registry, manage account security, and block/unblock users.
            </p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
