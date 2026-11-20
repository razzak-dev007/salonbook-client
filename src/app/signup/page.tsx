'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Scissors,
  Mail,
  Lock,
  User,
  Phone,
  Image as ImageIcon,
  Check,
  X,
  ArrowRight,
  Upload,
} from 'lucide-react';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
];

export default function SignUpPage() {
  const router = useRouter();
  const { register, googleLogin, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_AVATARS[0]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Validation Rules Check
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.upload.uploadImage(base64Data);
          if (res.success && res.url) {
            setImageUrl(res.url);
            toast.success('Avatar image uploaded successfully!');
          }
        } catch (uploadErr) {
          setImageUrl(base64Data); // fallback to local data URL
          toast.success('Avatar loaded successfully.');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingImage(false);
      toast.error('Could not process image file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Please fulfill all password requirements before signing up.');
      return;
    }

    setIsSubmitting(true);
    await register({
      name,
      email,
      password,
      image: imageUrl,
      phone,
    });
    setIsSubmitting(false);
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    await googleLogin({
      email: 'jessica.reynolds@gmail.com',
      name: 'Jessica Reynolds',
      image: SAMPLE_AVATARS[0],
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-rose-100 salon-card-shadow">
        {/* Brand & Heading */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-md shadow-rose-200 mb-3">
            <Scissors className="w-6 h-6 rotate-45" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Client Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join SalonBook to schedule appointments, track beauty sessions, and pay with Stripe.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jessica Reynolds"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jessica@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800"
              />
            </div>

            {/* Password Rules Checklist */}
            <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  Minimum 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasUppercase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLowercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasLowercase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          {/* Profile Image (Upload Image / Image URL) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Profile Avatar
            </label>
            <div className="flex items-center gap-4">
              <img
                src={imageUrl}
                alt="Avatar Preview"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-400 shadow-sm shrink-0"
              />
              <div className="flex-1 space-y-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Preset Avatars */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 uppercase">Or select:</span>
                  {SAMPLE_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(av)}
                      className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${
                        imageUrl === av ? 'border-rose-600 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading || !isPasswordValid}
            className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 disabled:opacity-50 shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">Or register with</span>
          </div>
        </div>

        {/* Google Authentication */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isSubmitting || loading}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 shadow-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/signin" className="font-bold text-rose-600 hover:text-rose-700 underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
