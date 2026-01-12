'use client';

import React, { useEffect } from 'react';
import { Service } from '@/entities/service/model/types';
import { useServicesFilter } from '@/shared/lib/hooks/useServicesFilter';
import { FilterResultsCount } from '@/shared/ui';
import { ServicesFilterHeader } from './ServicesFilterHeader/ServicesFilterHeader';
import { ServicesFilterControls } from './ServicesFilterControls/ServicesFilterControls';

interface ServicesFilterProps {
  services: Service[];
  onFiltered: (filtered: Service[]) => void;
}

/**
 * Filter widget for services list
 * Provides search by name, price range, and provider filtering
 */
export const ServicesFilter = ({ services, onFiltered }: ServicesFilterProps) => {
  const {
    searchQuery,
    setSearchQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    providerFilter,
    setProviderFilter,
    activeOnly,
    setActiveOnly,
    providers,
    filteredServices,
    clearFilters,
    hasActiveFilters,
  } = useServicesFilter({ services });

  useEffect(() => {
    onFiltered(filteredServices);
  }, [filteredServices, onFiltered]);

  return (
    <div className="card bg-white shadow-md mb-6">
      <ServicesFilterHeader 
        onClear={clearFilters} 
        showClearButton={hasActiveFilters} 
      />

      <ServicesFilterControls
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        minPrice={minPrice}
        onMinPriceChange={(e) => setMinPrice(e.target.value)}
        maxPrice={maxPrice}
        onMaxPriceChange={(e) => setMaxPrice(e.target.value)}
        providerFilter={providerFilter}
        onProviderChange={(e) => setProviderFilter(e.target.value)}
        providers={providers}
        activeOnly={activeOnly}
        onActiveOnlyChange={(e) => setActiveOnly(e.target.checked)}
      />

      <FilterResultsCount 
        filtered={filteredServices.length} 
        total={services.length} 
        itemName="services" 
      />
    </div>
  );
};

