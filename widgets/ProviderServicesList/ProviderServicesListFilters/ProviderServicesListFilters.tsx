import React from 'react';
import { SearchInput, ActiveOnlyCheckbox } from '@/shared/ui';

interface ProviderServicesListFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeOnly: boolean;
  onActiveOnlyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

/**
 * Filter controls component for provider services list
 * Contains search input and active only checkbox
 */
export const ProviderServicesListFilters = ({
  searchQuery,
  onSearchChange,
  activeOnly,
  onActiveOnlyChange,
  onClear,
  hasActiveFilters,
}: ProviderServicesListFiltersProps) => {
  return (
    <div className="mb-6 space-y-3">
      <SearchInput
        placeholder="Search services..."
        value={searchQuery}
        onChange={onSearchChange}
      />
      <div className="flex items-center gap-3">
        <ActiveOnlyCheckbox
          id="activeOnly"
          checked={activeOnly}
          onChange={onActiveOnlyChange}
          label="Show only active services"
        />
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="ml-auto text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

