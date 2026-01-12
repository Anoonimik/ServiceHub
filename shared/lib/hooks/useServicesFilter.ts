import { useState, useMemo } from 'react';
import { Service } from '@/entities/service/model/types';

interface UseServicesFilterOptions {
  services: Service[];
}

/**
 * Custom hook for filtering services
 * Provides filtering logic by search query, price range, provider, and active status
 */
export function useServicesFilter({ services }: UseServicesFilterOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);

  const providers = useMemo(() => {
    const uniqueProviders = new Set<string>();
    services.forEach(service => {
      if (service.provider?.business_name) {
        uniqueProviders.add(service.provider.business_name);
      } else if (service.provider?.user) {
        uniqueProviders.add(`${service.provider.user.first_name} ${service.provider.user.last_name}`);
      }
    });
    return Array.from(uniqueProviders).sort();
  }, [services]);

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter(service => service.price >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter(service => service.price <= max);
      }
    }

    if (providerFilter) {
      filtered = filtered.filter(service => {
        const providerName = service.provider?.business_name ||
          (service.provider?.user
            ? `${service.provider.user.first_name} ${service.provider.user.last_name}`
            : '');
        return providerName === providerFilter;
      });
    }

    if (activeOnly) {
      filtered = filtered.filter(service => service.is_active);
    }

    return filtered;
  }, [services, searchQuery, minPrice, maxPrice, providerFilter, activeOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setProviderFilter('');
    setActiveOnly(false);
  };

  const hasActiveFilters = !!(searchQuery || minPrice || maxPrice || providerFilter || activeOnly);

  return {
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
  };
}

