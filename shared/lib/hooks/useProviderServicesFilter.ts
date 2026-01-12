import { useState, useMemo } from 'react';
import { Service } from '@/entities/service/model/types';

interface UseProviderServicesFilterOptions {
  services: Service[];
}

/**
 * Custom hook for filtering provider's services
 * Provides filtering logic by search query and active status
 */
export function useProviderServicesFilter({ services }: UseProviderServicesFilterOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    }

    if (activeOnly) {
      filtered = filtered.filter(service => service.is_active);
    }

    return filtered;
  }, [services, searchQuery, activeOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveOnly(false);
  };

  const hasActiveFilters = !!(searchQuery || activeOnly);

  return {
    searchQuery,
    setSearchQuery,
    activeOnly,
    setActiveOnly,
    filteredServices,
    clearFilters,
    hasActiveFilters,
  };
}

