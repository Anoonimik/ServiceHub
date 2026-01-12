'use client';

import React, { useEffect } from 'react';
import { ServiceProvider } from '@/entities/provider/model/types';
import { useProvidersFilter } from '@/shared/lib/hooks/useProvidersFilter';
import { FilterResultsCount } from '@/shared/ui';
import { ProvidersFilterHeader } from './ProvidersFilterHeader/ProvidersFilterHeader';
import { ProvidersFilterControls } from './ProvidersFilterControls/ProvidersFilterControls';

interface ProvidersFilterProps {
  providers: ServiceProvider[];
  onFiltered: (filtered: ServiceProvider[]) => void;
}

/**
 * Filter widget for providers list
 * Provides search by name, business name, and description
 */
export const ProvidersFilter = ({ providers, onFiltered }: ProvidersFilterProps) => {
  const {
    searchQuery,
    setSearchQuery,
    activeOnly,
    setActiveOnly,
    filteredProviders,
    clearFilters,
    hasActiveFilters,
  } = useProvidersFilter({ providers });

  useEffect(() => {
    onFiltered(filteredProviders);
  }, [filteredProviders, onFiltered]);

  return (
    <div className="card bg-white shadow-md mb-6">
      <ProvidersFilterHeader 
        onClear={clearFilters} 
        showClearButton={hasActiveFilters} 
      />

      <ProvidersFilterControls
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        activeOnly={activeOnly}
        onActiveOnlyChange={(e) => setActiveOnly(e.target.checked)}
      />

      <FilterResultsCount 
        filtered={filteredProviders.length} 
        total={providers.length} 
        itemName="providers" 
      />
    </div>
  );
};

