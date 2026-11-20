'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scissors,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Logo & Short Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Scissors className="w-5 h-5 rotate-45" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent">
                SalonBook
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience ultimate pampering and world-class beauty transformations.
              Book personalized appointments with master stylists, colorists, and skincare artisans.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Important Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-rose-400 transition-colors">
                  Browse Salon Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Haircut+%26+Styling" className="hover:text-rose-400 transition-colors">
                  Haircut & Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Hair+Coloring" className="hover:text-rose-400 transition-colors">
                  Hair Coloring
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial+%26+Skincare" className="hover:text-rose-400 transition-colors">
                  Facial & Skincare
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-rose-400 transition-colors">
                  Client Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Salon Contact Information */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>452 Luxury Boulevard, Suite 300, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+1 (800) 555-SALON (7256)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>concierge@salonbook.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Salon Address and Opening Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Salon Opening Hours
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2 text-rose-400 font-medium">
                <Clock className="w-4 h-4" />
                <span>Weekly Schedule</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>Monday – Friday:</span>
                <span className="text-white font-medium">09:00 AM – 08:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>Saturday:</span>
                <span className="text-white font-medium">09:00 AM – 06:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-rose-400 font-medium">10:00 AM – 04:00 PM</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60">
                  Appointments Recommended
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SalonBook Platform. All rights reserved. Built with precision for Assignment 9 (Category: 002).</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by
            <a
              href="https://github.com/razzak-dev007"
              target="_blank"
              rel="noreferrer"
              className="text-rose-400 hover:underline font-semibold"
            >
              Abdur Razzak (razzak-dev007)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
