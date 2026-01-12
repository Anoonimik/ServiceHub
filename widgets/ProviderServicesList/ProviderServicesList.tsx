'use client';

import React from 'react';
import Link from 'next/link';
import { Service } from '@/entities/service/model/types';
import { useProviderServicesFilter } from '@/shared/lib/hooks/useProviderServicesFilter';
import { EmptyState, Button } from '@/shared/ui';
import { ProviderServiceCard } from '../ProviderServiceCard/ProviderServiceCard';
import { ProviderServicesListHeader } from './ProviderServicesListHeader/ProviderServicesListHeader';
import { ProviderServicesListFilters } from './ProviderServicesListFilters/ProviderServicesListFilters';

interface ProviderServicesListProps {
  services: Service[];
  onServiceUpdate?: () => void;
}

/**
 * List widget for provider's services with built-in search and filter
 */
export const ProviderServicesList = ({ services, onServiceUpdate }: ProviderServicesListProps) => {
  const {
    searchQuery,
    setSearchQuery,
    activeOnly,
    setActiveOnly,
    filteredServices,
    clearFilters,
    hasActiveFilters,
  } = useProviderServicesFilter({ services });

  const totalServices = services.length;

  return (
    <div className="card shadow-md hover:shadow-lg transition-shadow">
      <ProviderServicesListHeader 
        filteredCount={filteredServices.length} 
        totalCount={totalServices} 
      />

      {services.length > 0 && (
        <ProviderServicesListFilters
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          activeOnly={activeOnly}
          onActiveOnlyChange={(e) => setActiveOnly(e.target.checked)}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {services.length === 0 ? (
        <EmptyState 
          description="No services yet. Create your first service to get started!"
          action={
            <Link href="/providers/services/new">
              <Button variant="primary" className="shadow-md hover:shadow-lg transition-all">
                Create Service
              </Button>
            </Link>
          }
        />
      ) : filteredServices.length === 0 ? (
        <EmptyState description="No services match your search criteria." />
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <ProviderServiceCard key={service.id} service={service} onUpdate={onServiceUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

