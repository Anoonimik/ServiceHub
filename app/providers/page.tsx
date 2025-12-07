'use client';

import React from 'react';
import { useProviders } from '@/shared/lib/hooks/useProviders';
import { ProviderCard } from '@/widgets/ProviderCard/ProviderCard';
import { LoadingSpinner, EmptyState } from '@/shared/ui';

export default function ProvidersPage() {
  const { providers, loading } = useProviders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="section-header">
            <h1>Service Providers</h1>
            <p className="text-lg text-gray-600">Discover professionals offering their services</p>
          </div>

          {loading ? (
            <LoadingSpinner size="md" className="py-12" />
          ) : providers.length === 0 ? (
            <EmptyState description="No providers available yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
