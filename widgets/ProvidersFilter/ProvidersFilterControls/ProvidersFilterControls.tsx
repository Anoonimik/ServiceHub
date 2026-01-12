import React from 'react';
import { SearchInput, ActiveOnlyCheckbox } from '@/shared/ui';

interface ProvidersFilterControlsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeOnly: boolean;
  onActiveOnlyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Filter controls component for providers filter
 * Contains all filter input fields
 */
export const ProvidersFilterControls = ({
  searchQuery,
  onSearchChange,
  activeOnly,
  onActiveOnlyChange,
}: ProvidersFilterControlsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
          Search
        </label>
        <SearchInput
          id="search"
          placeholder="Search by name, business, or description..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      <ActiveOnlyCheckbox
        id="activeOnly"
        checked={activeOnly}
        onChange={onActiveOnlyChange}
        label="Show only active providers"
      />
    </div>
  );
};

