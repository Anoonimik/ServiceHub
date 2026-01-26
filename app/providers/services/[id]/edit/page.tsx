'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, ErrorMessage, LoadingSpinner } from '@/shared/ui';
import { useEditService } from '@/shared/lib/hooks/useEditService';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { serviceApi } from '@/entities/service/api/serviceApi';
import { Service } from '@/entities/service/model/types';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useRequireAuth('provider');
  const [service, setService] = useState<Service | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  } = useEditService({
    service,
    onSuccess: () => {
      fetchService();
      router.push('/providers/dashboard');
    },
  });

  useEffect(() => {
    if (params.id && user && user.role === 'provider') {
      fetchService();
    }
  }, [params.id, user]);

  const fetchService = async () => {
    try {
      setLoadingService(true);
      setServiceError(null);
      const id = parseInt(params.id as string, 10);
      if (isNaN(id)) {
        throw new Error('Invalid service ID');
      }
      const data = await serviceApi.getService(id);
      setService(data);
    } catch (err: any) {
      console.error('Error fetching service:', err);
      setServiceError(err.message || 'Failed to fetch service');
    } finally {
      setLoadingService(false);
    }
  };

  if (authLoading || loadingService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.role !== 'provider') {
    router.push('/dashboard');
    return null;
  }

  if (serviceError || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-2xl mx-auto">
            <div className="section-header">
              <h1>Edit Service</h1>
            </div>
            <div className="card">
              <ErrorMessage message={serviceError || 'Service not found'} />
              <Button variant="secondary" onClick={() => router.push('/providers/dashboard')} className="mt-4">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          <div className="section-header">
            <h1>Edit Service</h1>
            <p className="text-lg text-gray-600">Update your service information</p>
          </div>

          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Service Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Haircut, Massage, Consultation"
              />

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input resize-none"
                  placeholder="Describe your service..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Duration (minutes)"
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="30"
                />

                <Input
                  label="Price ($)"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="allow_custom_time"
                  name="allow_custom_time"
                  checked={formData.allow_custom_time}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="allow_custom_time" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-gray-900">Allow custom time booking</div>
                  <div className="text-sm text-gray-600 mt-1">
                    When enabled, clients can enter a custom date and time instead of selecting from available time slots
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Service'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/providers/dashboard')}
                  className="flex-1 md:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

