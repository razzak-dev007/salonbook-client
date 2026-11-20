'use client';

import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { Clock, Tag, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-rose-100/80 salon-card-shadow salon-card-shadow-hover transition-all duration-300 flex flex-col h-full">
      {/* Service Image with Category Badge */}
      <div className="relative h-56 w-full overflow-hidden bg-rose-50">
        <img
          src={service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
          alt={service.serviceName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-rose-700 shadow-sm backdrop-blur-md">
            <Tag className="w-3 h-3 text-rose-500" />
            {service.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="px-3.5 py-1.5 rounded-2xl text-base font-bold bg-slate-900/90 text-white shadow-md backdrop-blur-sm">
            ${service.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>{service.duration} mins</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1 mb-2">
            {service.serviceName}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">
            {service.description}
          </p>
        </div>

        {/* View Details Button */}
        <div>
          <Link
            href={`/services/${service._id}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all duration-200 group-hover:shadow-md"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
