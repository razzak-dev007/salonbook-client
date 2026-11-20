'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { User } from '@/types';
import { toast } from 'sonner';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Lock,
  Unlock,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.users.getAll();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch registered customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (user: User) => {
    if (user.role === 'admin') {
      toast.error('Administrator accounts cannot be blocked.');
      return;
    }

    const nextState = !user.isBlocked;
    const confirmAction = window.confirm(
      `Are you sure you want to ${nextState ? 'BLOCK' : 'UNBLOCK'} ${user.name}? ${
        nextState ? 'This user will be barred from booking or logging in.' : ''
      }`
    );
    if (!confirmAction) return;

    try {
      setTogglingId(user._id);
      const res = await api.users.toggleBlock(user._id, nextState);
      if (res.success) {
        toast.success(`User has been ${nextState ? 'blocked' : 'unblocked'} successfully.`);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update account status.');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <DashboardLayout allowedRole="admin" pageTitle="Manage Registered Customers">
      <div className="space-y-6">
        {/* Search & Stats Bar */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-700">
              Total Accounts: {users.length}
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-rose-100 salon-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50/60 border-b border-rose-100 uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6">Registered On</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading customer directory...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const isBlocked = u.isBlocked;
                    const isAdmin = u.role === 'admin';

                    return (
                      <tr key={u._id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                              {isAdmin && (
                                <span className="text-[10px] text-rose-600 font-bold">Administrator</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-600 font-medium">{u.email}</td>

                        <td className="py-4 px-6 text-slate-500 font-medium">{u.phone || '—'}</td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              isAdmin
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isBlocked
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isBlocked ? (
                              <>
                                <ShieldAlert className="w-3 h-3 text-red-600" />
                                <span>Suspended</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Active</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-500 font-medium">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-4 px-6 text-right">
                          {isAdmin ? (
                            <span className="text-[10px] text-slate-400 italic">Protected</span>
                          ) : (
                            <button
                              onClick={() => handleToggleBlock(u)}
                              disabled={togglingId === u._id}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto ${
                                isBlocked
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              }`}
                            >
                              {isBlocked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Unblock</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Block User</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No registered customers match your search criteria.
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
