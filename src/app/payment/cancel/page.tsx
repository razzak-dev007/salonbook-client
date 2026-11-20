'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Calendar, ArrowRight, RefreshCcw } from 'lucide-react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment_id');

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-amber-100 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            Payment Postponed
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Checkout Was Not Completed
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            You exited the Stripe Checkout session. Don't worry — your appointment booking remains confirmed! You can complete payment at any time before your salon visit.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Return to My Appointments</span>
          </Link>
          <Link
            href="/services"
            className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
          >
            Browse Salon Services
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
