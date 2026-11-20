'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Service } from '@/types';
import { toast } from 'sonner';
import { Calendar, Clock, MessageSquare, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

const PREDEFINED_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
];

export default function BookingModal({ service, isOpen, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Get tomorrow's date formatted as YYYY-MM-DD for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const [appointmentDate, setAppointmentDate] = useState<string>(minDateString);
  const [timeSlot, setTimeSlot] = useState<string>(PREDEFINED_SLOTS[0]);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in as a customer to book an appointment.');
      router.push(`/signin?redirect=/services/${service._id}`);
      return;
    }

    if (user.role === 'admin') {
      toast.error('Administrators cannot submit customer appointment bookings.');
      return;
    }

    if (!appointmentDate || !timeSlot) {
      toast.error('Please select both appointment date and time slot.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.appointments.create({
        serviceId: service._id,
        appointmentDate,
        timeSlot,
        message,
      });

      if (res.success) {
        toast.success('Appointment request submitted successfully!');
        onClose();
        router.push('/dashboard/customer/appointments');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit appointment request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </div>
          <h2 className="text-xl font-bold">{service.serviceName}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/90">
            <span>${service.price}</span>
            <span>•</span>
            <span>{service.duration} mins</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Appointment Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Select Appointment Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                min={minDateString}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-800 text-sm font-medium"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Bookings open starting from tomorrow.</p>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Available Time Slots <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PREDEFINED_SLOTS.map((slot) => {
                const isSelected = timeSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-rose-50/50 text-slate-700 border-rose-100 hover:border-rose-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message / Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Special Requests or Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Any specific stylist preference, hair texture details, or sensitivity concerns..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-800 text-sm"
            />
          </div>

          {/* Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Appointment requests are submitted as <strong>Pending</strong>. Once reviewed and confirmed by our salon concierge, you can complete payment online through Stripe.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 px-4 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 px-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 disabled:opacity-50 shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
