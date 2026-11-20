'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { Appointment } from '@/types';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Tag,
  CreditCard,
  Ban,
  Eye,
  X,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.appointments.getMy();
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Cancel Pending Request
  const handleCancel = async (id: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this pending appointment request?');
    if (!confirmCancel) return;

    try {
      setCancellingId(id);
      const res = await api.appointments.cancel(id);
      if (res.success) {
        toast.success('Appointment cancelled successfully.');
        fetchAppointments();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  // Pay for Confirmed Appointment via Stripe
  const handlePayNow = async (appt: Appointment) => {
    try {
      setPayingId(appt._id);
      const res = await api.payments.createCheckoutSession(appt._id);

      if (res.success && res.url) {
        toast.info('Redirecting to Stripe Checkout...');
        window.location.href = res.url;
      } else {
        toast.error('Unable to create payment session. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <DashboardLayout allowedRole="customer" pageTitle="My Appointments">
      <div className="space-y-6">
        {/* Header Description */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Appointment Management</h2>
            <p className="text-xs text-slate-500 mt-1">
              Review your requested bookings, cancel pending slots, or pay for confirmed salon sessions with Stripe.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 shrink-0">
            Total Bookings: {appointments.length}
          </span>
        </div>

        {/* Appointments List / Table */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appt) => {
              const isPending = appt.status === 'pending';
              const isConfirmed = appt.status === 'confirmed';
              const isCancelled = appt.status === 'cancelled';
              const isUnpaid = appt.paymentStatus === 'unpaid';
              const isPaid = appt.paymentStatus === 'paid';

              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-3xl p-6 border border-rose-100 salon-card-shadow hover:border-rose-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Service & Booking Details */}
                  <div className="flex items-start gap-5">
                    <img
                      src={appt.service?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80'}
                      alt={appt.service?.serviceName}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-1 ring-rose-100"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700">
                          {appt.service?.category || 'Salon Service'}
                        </span>
                        <span className="text-xs text-slate-400">
                          Req: {new Date(appt.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {appt.service?.serviceName || 'Salon Service'}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          {appt.appointmentDate}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-rose-500" />
                          {appt.timeSlot}
                        </span>
                        <span className="font-black text-slate-900 text-sm">
                          ${appt.servicePrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Statuses & Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Appointment Status */}
                    <div className="text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isCancelled
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    {/* Payment Status */}
                    <div className="text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isPaid
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {appt.paymentStatus}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* View Details Modal Trigger */}
                      <button
                        onClick={() => setSelectedAppointment(appt)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Pay Now Button (Only for Confirmed + Unpaid) */}
                      {isConfirmed && isUnpaid && (
                        <button
                          onClick={() => handlePayNow(appt)}
                          disabled={payingId === appt._id}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all flex items-center gap-1.5"
                        >
                          {payingId === appt._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5" />
                          )}
                          <span>Pay Now</span>
                        </button>
                      )}

                      {/* Cancel Pending Button (Only for Pending) */}
                      {isPending && (
                        <button
                          onClick={() => handleCancel(appt._id)}
                          disabled={cancellingId === appt._id}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center salon-card-shadow max-w-lg mx-auto">
            <Calendar className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              You haven't booked any salon appointments yet. Explore our treatments and reserve your preferred time slot.
            </p>
            <a
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
            >
              Browse Salon Services
            </a>
          </div>
        )}

        {/* View Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-rose-200">Appointment Details</span>
                  <h3 className="text-lg font-bold">{selectedAppointment.service?.serviceName}</h3>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-slate-800">{selectedAppointment.service?.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-bold text-slate-800">
                    {selectedAppointment.appointmentDate} at {selectedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Service Fee:</span>
                  <span className="font-black text-slate-900 text-sm">${selectedAppointment.servicePrice}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Booking Status:</span>
                  <span className="font-bold capitalize text-rose-600">{selectedAppointment.status}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold uppercase text-blue-600">{selectedAppointment.paymentStatus}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Requested On:</span>
                  <span className="font-medium text-slate-600">
                    {new Date(selectedAppointment.createdAt).toLocaleString()}
                  </span>
                </div>

                {selectedAppointment.message && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-700 mb-1">Your Special Note:</p>
                    <p className="text-slate-600 italic">{selectedAppointment.message}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
