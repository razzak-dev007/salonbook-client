'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; password: string; image?: string; phone?: string }) => Promise<boolean>;
  googleLogin: (payload: { email: string; name?: string; image?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; image?: string; phone?: string }) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load session from localStorage on startup
  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = localStorage.getItem('salonbook_token');
        if (storedToken) {
          setToken(storedToken);
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            // Token invalid or expired
            localStorage.removeItem('salonbook_token');
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        localStorage.removeItem('salonbook_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.auth.login({ email, password });
      if (res.success && res.token && res.user) {
        localStorage.setItem('salonbook_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}!`);

        // Redirect according to user role
        if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/customer');
        }
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in. Please verify your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    image?: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.auth.register(payload);
      if (res.success && res.token && res.user) {
        localStorage.setItem('salonbook_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success('Registration successful! Welcome to SalonBook.');
        router.push('/dashboard/customer');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (payload: { email: string; name?: string; image?: string }): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.auth.googleLogin(payload);
      if (res.success && res.token && res.user) {
        localStorage.setItem('salonbook_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome, ${res.user.name}!`);

        if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/customer');
        }
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('salonbook_token');
      setToken(null);
      setUser(null);
      toast.success('Signed out successfully.');
      router.push('/signin');
    }
  };

  const updateProfile = async (updates: { name?: string; image?: string; phone?: string }): Promise<boolean> => {
    try {
      const res = await api.auth.updateProfile(updates);
      if (res.success && res.user) {
        setUser(res.user);
        toast.success('Profile updated successfully!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
