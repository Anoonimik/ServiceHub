import { useState, useMemo } from 'react';
import { ServiceProvider } from '@/entities/provider/model/types';

interface UseProvidersFilterOptions {
  providers: ServiceProvider[];
}

/**
 * Custom hook for filtering providers
 * Provides filtering logic by search query and active status
 */
export function useProvidersFilter({ providers }: UseProvidersFilterOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);

  const filteredProviders = useMemo(() => {
    let filtered = [...providers];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(provider => {
        const businessName = provider.business_name?.toLowerCase() || '';
        const userName = provider.user
          ? `${provider.user.firstName} ${provider.user.lastName}`.toLowerCase()
          : '';
        const description = provider.description?.toLowerCase() || '';
        
        return (
          businessName.includes(query) ||
          userName.includes(query) ||
          description.includes(query)
        );
      });
    }

    if (activeOnly) {
      filtered = filtered.filter(provider => provider.is_active);
    }

    return filtered;
  }, [providers, searchQuery, activeOnly]);

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
    filteredProviders,
    clearFilters,
    hasActiveFilters,
  };
}

