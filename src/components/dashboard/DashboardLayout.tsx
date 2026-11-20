'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  CreditCard,
  User,
  LogOut,
  Scissors,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRole: UserRole;
  pageTitle: string;
}

export default function DashboardLayout({
  children,
  allowedRole,
  pageTitle,
}: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Strict Client-Side Role Guard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/signin?redirect=${pathname}`);
        return;
      }

      if (user.isBlocked) {
        logout();
        return;
      }

      if (user.role !== allowedRole) {
        // Prevent accessing another role's dashboard by changing URL
        if (user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/customer');
        }
      }
    }
  }, [user, loading, allowedRole, pathname, router, logout]);

  if (loading || !user || user.role !== allowedRole) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Checking authentication permissions...</p>
      </div>
    );
  }

  // Customer Navigation Links
  const customerNav = [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Appointments', href: '/dashboard/customer/appointments', icon: Calendar },
    { label: 'My Profile', href: '/dashboard/customer/profile', icon: User },
  ];

  // Admin Navigation Links
  const adminNav = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Services', href: '/dashboard/admin/services', icon: Sparkles },
    { label: 'Manage Appointments', href: '/dashboard/admin/appointments', icon: Calendar },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
    { label: 'My Profile', href: '/dashboard/admin/profile', icon: User },
  ];

  const currentNav = allowedRole === 'admin' ? adminNav : customerNav;

  return (
    <div className="min-h-[90vh] bg-[#fdfbf9] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-rose-100 p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl text-slate-700 bg-rose-50"
        >
          <Menu className="w-5 h-5 text-rose-600" />
        </button>
        <span className="text-sm font-bold text-slate-800">{pageTitle}</span>
        <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase bg-rose-100 text-rose-700">
          {allowedRole}
        </span>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-72 bg-white border-r border-rose-100/80 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-rose-100">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
                <Scissors className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent">
                  SalonBook
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-bold text-rose-500">
                  {allowedRole} Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-400 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                {user.role}
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-md shadow-rose-200'
                      : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-rose-100">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl">
        {/* Breadcrumb / Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
              <span>SalonBook</span>
              <span>/</span>
              <span>{allowedRole}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Child Pages */}
        {children}
      </main>
    </div>
  );
}
