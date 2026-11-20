/**
 * api.ts — Centralized API Client for SalonBook
 * Handles requests, JWT Bearer headers, error handling, and typed responses.
 */

import {
  User,
  Service,
  Appointment,
  Transaction,
  CustomerStats,
  AdminStats,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Retrieve auth token from localStorage if available
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('salonbook_token');
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
  count?: number;
  [key: string]: any;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({
      success: false,
      message: 'Failed to parse server response.',
    }));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    register: (payload: { name: string; email: string; password: string; image?: string; phone?: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

    login: (credentials: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

    googleLogin: (payload: { email: string; name?: string; image?: string }) =>
      request('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),

    getMe: () => request<{ user: User }>('/auth/me'),

    updateProfile: (updates: { name?: string; image?: string; phone?: string }) =>
      request('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),

    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // Services
  services: {
    getAll: (params?: { search?: string; category?: string; sort?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.sort) query.append('sort', params.sort);
      const qs = query.toString();
      return request<Service[]>(`/services${qs ? `?${qs}` : ''}`);
    },

    getFeatured: () => request<Service[]>('/services/featured'),

    getCategories: () => request<{ category: string; count: number }[]>('/services/categories'),

    getById: (id: string) => request<Service>(`/services/${id}`),

    getAllAdmin: () => request<Service[]>('/services/admin/all'),

    create: (service: Partial<Service>) =>
      request<Service>('/services', { method: 'POST', body: JSON.stringify(service) }),

    update: (id: string, updates: Partial<Service>) =>
      request<Service>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

    delete: (id: string) =>
      request(`/services/${id}`, { method: 'DELETE' }),

    toggleStatus: (id: string, status: 'active' | 'inactive') =>
      request(`/services/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // Appointments
  appointments: {
    create: (payload: { serviceId: string; appointmentDate: string; timeSlot: string; message?: string }) =>
      request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(payload) }),

    getMy: () => request<Appointment[]>('/appointments/my'),

    cancel: (id: string) =>
      request<Appointment>(`/appointments/${id}/cancel`, { method: 'PATCH' }),

    getAllAdmin: () => request<Appointment[]>('/appointments/all'),

    updateStatus: (id: string, status: 'confirmed' | 'cancelled') =>
      request<Appointment>(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // Payments
  payments: {
    createCheckoutSession: (appointmentId: string) =>
      request<{ sessionId: string; url: string; mode?: string }>('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ appointmentId }),
      }),

    verifySession: (sessionId: string, appointmentId: string) =>
      request<{ transaction: Transaction; appointment: Appointment }>('/payments/verify-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId, appointmentId }),
      }),

    getTransactions: () => request<Transaction[]>('/payments/transactions'),
  },

  // Users (Admin)
  users: {
    getAll: () => request<User[]>('/users'),

    toggleBlock: (id: string, isBlocked: boolean) =>
      request(`/users/${id}/block`, { method: 'PATCH', body: JSON.stringify({ isBlocked }) }),
  },

  // Dashboards
  dashboard: {
    getCustomerStats: () => request<CustomerStats>('/dashboard/customer'),

    getAdminStats: () => request<AdminStats>('/dashboard/admin'),
  },

  // Image Upload Proxy
  upload: {
    uploadImage: (image: string) =>
      request<{ url: string }>('/upload', { method: 'POST', body: JSON.stringify({ image }) }),
  },
};
