'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { Service, ServiceStatus } from '@/types';
import { toast } from 'sonner';
import {
  Scissors,
  Plus,
  Edit,
  Trash2,
  Clock,
  Tag,
  Upload,
  CheckCircle2,
  XCircle,
  X,
  Search,
} from 'lucide-react';

const CATEGORIES = [
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form Fields
  const [serviceName, setServiceName] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [image, setImage] = useState<string>('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80');
  const [status, setStatus] = useState<ServiceStatus>('active');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.services.getAllAdmin();
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setServiceName('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setPrice('');
    setDuration('');
    setImage('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (svc: Service) => {
    setEditingService(svc);
    setServiceName(svc.serviceName);
    setCategory(svc.category);
    setDescription(svc.description);
    setPrice(svc.price.toString());
    setDuration(svc.duration.toString());
    setImage(svc.image);
    setStatus(svc.status);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const res = await api.upload.uploadImage(base64);
          if (res.success && res.url) {
            setImage(res.url);
            toast.success('Service image uploaded successfully!');
          }
        } catch {
          setImage(base64);
          toast.success('Image attached locally.');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingImage(false);
      toast.error('Failed to read image file.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numPrice = Number(price);
    const numDuration = Number(duration);

    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Price must be a valid positive number.');
      return;
    }

    if (isNaN(numDuration) || numDuration <= 0) {
      toast.error('Duration must be a valid positive number in minutes.');
      return;
    }

    try {
      setIsSaving(true);
      if (editingService) {
        // Update
        const res = await api.services.update(editingService._id, {
          serviceName,
          category,
          description,
          price: numPrice,
          duration: numDuration,
          image,
          status,
        });
        if (res.success) {
          toast.success('Salon service updated successfully!');
          setIsModalOpen(false);
          fetchServices();
        }
      } else {
        // Create
        const res = await api.services.create({
          serviceName,
          category,
          description,
          price: numPrice,
          duration: numDuration,
          image,
          status,
        });
        if (res.success) {
          toast.success('New salon service created successfully!');
          setIsModalOpen(false);
          fetchServices();
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: ServiceStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.services.toggleStatus(id, newStatus);
      if (res.success) {
        toast.success(`Service is now ${newStatus}.`);
        fetchServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service status.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await api.services.delete(id);
      if (res.success) {
        toast.success('Salon service deleted successfully.');
        fetchServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    }
  };

  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout allowedRole="admin" pageTitle="Manage Services">
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 salon-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-3xl border border-rose-100 salon-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50/60 border-b border-rose-100 uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading salon services...
                    </td>
                  </tr>
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((svc) => (
                    <tr key={svc._id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={svc.image}
                          alt={svc.serviceName}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-rose-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{svc.serviceName}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{svc.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-600">{svc.category}</td>
                      <td className="py-4 px-6 font-black text-slate-900">${svc.price}</td>
                      <td className="py-4 px-6 font-medium text-slate-500">{svc.duration} mins</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(svc._id, svc.status)}
                          className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider transition-colors ${
                            svc.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {svc.status}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(svc)}
                          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(svc._id, svc.serviceName)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No services match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Service Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-rose-200">Catalog Editor</span>
                  <h3 className="text-lg font-bold">
                    {editingService ? 'Update Salon Service' : 'Add New Salon Service'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
                {/* Service Name */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Service Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. Signature Precision Haircut"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Service Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ServiceStatus)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Price & Duration (Positive numbers) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Price ($ USD) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 75"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Duration (Minutes) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 60"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details about the treatment steps and results..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Service Image (Image Upload)
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Choose Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || uploadingImage}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 shadow-md shadow-rose-200 transition-all flex items-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{editingService ? 'Save Updates' : 'Add Service'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
