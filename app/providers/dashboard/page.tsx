'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { useMyProvider } from '@/shared/lib/hooks/useProviders';
import { useMyServices } from '@/shared/lib/hooks/useServices';
import { useProviderStats } from '@/shared/lib/hooks/useProviderStats';
import { LoadingSpinner } from '@/shared/ui';
import { ProviderDashboardHeader } from '@/widgets/ProviderDashboardHeader/ProviderDashboardHeader';
import { ProviderStats } from '@/widgets/ProviderStats/ProviderStats';
import { ProviderInfoCard } from '@/widgets/ProviderInfoCard/ProviderInfoCard';
import { ProviderServicesList } from '@/widgets/ProviderServicesList/ProviderServicesList';

/**
 * Provider Dashboard Page
 * Main page for service providers to manage their services and view statistics
 */
export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth('provider');
  const { provider, loading: providerLoading, refetch: refetchProvider } = useMyProvider();
  const { services, loading: servicesLoading, refetch: refetchServices } = useMyServices();
  const stats = useProviderStats(services);
  
  const loading = authLoading || providerLoading || servicesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'provider') {
    router.push('/dashboard');
    return null;
  }

  if (!provider) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-7xl mx-auto py-8">
          <ProviderDashboardHeader />

          <ProviderStats 
            totalServices={stats.totalServices}
            activeServices={stats.activeServices}
            totalRevenue={stats.totalRevenue}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProviderInfoCard 
                provider={provider} 
                onUpdate={() => {
                  refetchProvider();
                  refetchServices();
                }}
              />
            </div>

            <div className="lg:col-span-2">
              <ProviderServicesList 
                services={services}
                onServiceUpdate={refetchServices}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
