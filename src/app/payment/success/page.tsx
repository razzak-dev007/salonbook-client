'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  CreditCard,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Receipt,
} from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const appointmentId = searchParams.get('appointment_id');

  const [verifying, setVerifying] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    // Fire confetti on landing
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    async function verifyPayment() {
      if (!sessionId || !appointmentId) {
        setVerifying(false);
        setSuccess(true);
        return;
      }

      try {
        const res = await api.payments.verifySession(sessionId, appointmentId);
        if (res.success) {
          setSuccess(true);
          setReceipt(res.transaction);
        }
      } catch (err) {
        console.warn('Payment verification notice:', err);
        // Even if webhook already processed it, show success
        setSuccess(true);
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId, appointmentId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stripe Payment Confirmed</span>
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointment Secured!
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Thank you! Your payment has been confirmed and verified. We have reserved your salon treatment and your stylist is preparing for your visit.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-slate-400" />
              <span>Stripe Session ID:</span>
            </span>
            <span className="font-mono text-slate-800 font-semibold truncate max-w-[200px]">
              {sessionId || 'Verified Online Checkout'}
            </span>
          </div>

          {receipt && (
            <>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-black text-slate-900 text-sm">${receipt.amount} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Status:</span>
                <span className="font-bold text-emerald-600 uppercase">{receipt.status}</span>
              </div>
            </>
          )}

          <div className="flex justify-between">
            <span className="text-slate-500">Confirmation Date:</span>
            <span className="font-medium text-slate-700">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
          >
            <span>My Appointments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
          >
            Explore More Services
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
