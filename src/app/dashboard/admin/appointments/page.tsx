'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Search,
  Filter,
  User,
  MessageSquare,
} from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.appointments.getAllAdmin();
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

  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      setUpdatingId(id);
      const res = await api.appointments.updateStatus(id, newStatus);
      if (res.success) {
        toast.success(`Appointment status updated to ${newStatus}.`);
        fetchAppointments();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesFilter =
      statusFilter === 'all' || appt.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (appt.customer?.name?.toLowerCase() || '').includes(q) ||
      (appt.customer?.email?.toLowerCase() || '').includes(q) ||
      (appt.service?.serviceName?.toLowerCase() || '').includes(q) ||
      appt.appointmentDate.includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout allowedRole="admin" pageTitle="Manage Appointments">
      <div className="space-y-6">
        {/* Filter and Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, service, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="all">All Appointments ({appointments.length})</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl border border-rose-100 salon-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50/60 border-b border-rose-100 uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => {
                    const isPending = appt.status === 'pending';
                    const isConfirmed = appt.status === 'confirmed';
                    const isCancelled = appt.status === 'cancelled';

                    return (
                      <tr key={appt._id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={appt.customer?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                              alt="Customer"
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-800">{appt.customer?.name || 'Customer'}</p>
                              <p className="text-[10px] text-slate-400">{appt.customer?.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800 line-clamp-1">{appt.service?.serviceName}</p>
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm">
                            {appt.service?.category}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-semibold text-slate-600">
                          <div className="flex flex-col">
                            <span>{appt.appointmentDate}</span>
                            <span className="text-slate-400 font-normal">{appt.timeSlot}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-black text-slate-900">${appt.servicePrice}</td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isCancelled
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              appt.paymentStatus === 'paid'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {appt.paymentStatus}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedAppointment(appt)}
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Rule: Only pending appointments can be confirmed */}
                          {isPending && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                              disabled={updatingId === appt._id}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Rule: Admin can cancel pending or confirmed appointments */}
                          {(isPending || isConfirmed) && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                              disabled={updatingId === appt._id}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No appointment requests found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View Full Details */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-rose-200">Request Record</span>
                  <h3 className="text-lg font-bold">{selectedAppointment.service?.serviceName}</h3>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-bold text-slate-800">{selectedAppointment.customer?.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Customer Email:</span>
                  <span className="font-medium text-slate-700">{selectedAppointment.customer?.email}</span>
                </div>
                {selectedAppointment.customer?.phone && (
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Customer Phone:</span>
                    <span className="font-medium text-slate-700">{selectedAppointment.customer?.phone}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-bold text-slate-800">
                    {selectedAppointment.appointmentDate} at {selectedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Booking Request Date:</span>
                  <span className="font-medium text-slate-600">
                    {new Date(selectedAppointment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Service Fee:</span>
                  <span className="font-black text-slate-900">${selectedAppointment.servicePrice}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Appointment Status:</span>
                  <span className="font-bold capitalize text-rose-600">{selectedAppointment.status}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold uppercase text-blue-600">{selectedAppointment.paymentStatus}</span>
                </div>

                {selectedAppointment.message && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-700 mb-1">Customer Note:</p>
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
