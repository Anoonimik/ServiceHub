'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Service } from '@/entities/service/model/types';
import { ServiceCard } from '@/widgets/ServiceCard/ServiceCard';
import { LoadingSpinner, EmptyState, ErrorMessage, Button } from '@/shared/ui';
import { useProviders } from '@/shared/lib/hooks/useProviders';

export default function ProviderServicesPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id ? parseInt(params.id as string, 10) : null;
  const { providers } = useProviders();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = providers.find(p => p.id === providerId);

  useEffect(() => {
    if (providerId) {
      fetchProviderServices();
    }
  }, [providerId]);

  const fetchProviderServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/providers/${providerId}/services`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch services');
      }

      const data = result.success !== undefined ? result.data : result;
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching provider services:', err);
      setError(err.message || 'Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const displayName = provider?.business_name || 
    (provider?.user ? `${provider.user.firstName} ${provider.user.lastName}` : 'Provider');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-6xl mx-auto">
            <LoadingSpinner size="md" className="py-12" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-6xl mx-auto">
            <ErrorMessage message={error} />
            <Button variant="secondary" onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="section-header">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1>{displayName}'s Services</h1>
                <p className="text-lg text-gray-600">Browse all available services from this provider</p>
              </div>
            </div>
          </div>

          {services.length === 0 ? (
            <EmptyState description="This provider doesn't have any active services yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

