'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { Transaction } from '@/types';
import { toast } from 'sonner';
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Hash,
} from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.payments.getTransactions();
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch transaction logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalVolume = transactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      (t.customerName?.toLowerCase() || '').includes(q) ||
      (t.customerEmail?.toLowerCase() || '').includes(q) ||
      (t.serviceName?.toLowerCase() || '').includes(q) ||
      t.stripeSessionId.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout allowedRole="admin" pageTitle="Payment Transactions">
      <div className="space-y-6">
        {/* Total Ledger Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Volume</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">${totalVolume} USD</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Paid Transactions</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">
                  {transactions.filter((t) => t.status === 'paid').length}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security Guard</p>
                <h3 className="text-base font-bold text-slate-800 mt-1">Immutable Ledger</h3>
                <p className="text-[10px] text-slate-400">Stripe Webhook Verified</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, session ID, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredTransactions.length}</strong> recorded transactions
          </span>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl border border-rose-100 salon-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50/60 border-b border-rose-100 uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Appointment Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Stripe Reference</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading Stripe ledger...
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-800">{tx.customerName || 'Customer'}</p>
                        <p className="text-[10px] text-slate-400">{tx.customerEmail || 'N/A'}</p>
                      </td>

                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {tx.serviceName || 'Salon Service'}
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-600">
                        {tx.appointmentDate || 'N/A'}
                      </td>

                      <td className="py-4 px-6 font-black text-slate-900 text-sm">
                        ${tx.amount} <span className="text-[10px] font-bold uppercase text-slate-400">{tx.currency}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md" title={tx.stripeSessionId}>
                          {tx.stripeSessionId.length > 18
                            ? `${tx.stripeSessionId.substring(0, 10)}...${tx.stripeSessionId.slice(-6)}`
                            : tx.stripeSessionId}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            tx.status === 'paid'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{tx.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right text-slate-500 font-medium">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No payment transaction records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
