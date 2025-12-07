'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { useMyProvider } from '@/shared/lib/hooks/useProviders';
import { useMyServices } from '@/shared/lib/hooks/useServices';
import { useProviderStats } from '@/shared/lib/hooks/useProviderStats';
import { Button, LoadingSpinner } from '@/shared/ui';
import { ProviderStats } from '@/widgets/ProviderStats/ProviderStats';
import { ProviderInfoCard } from '@/widgets/ProviderInfoCard/ProviderInfoCard';
import { ProviderServicesList } from '@/widgets/ProviderServicesList/ProviderServicesList';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth('provider');
  const { provider, loading: providerLoading, refetch: refetchProvider } = useMyProvider();
  const { services, loading: servicesLoading, refetch: refetchServices } = useMyServices();
  const stats = useProviderStats(services);
  
  const loading = authLoading || providerLoading || servicesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-7xl mx-auto">
          <div className="section-header">
            <div className="flex items-center justify-between">
              <div>
                <h1>Provider Dashboard</h1>
                <p className="text-lg text-gray-600 mt-1">Manage your services and appointments</p>
              </div>
              <Link href="/providers/services/new">
                <Button variant="primary" className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Service
                </Button>
              </Link>
            </div>
          </div>

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
