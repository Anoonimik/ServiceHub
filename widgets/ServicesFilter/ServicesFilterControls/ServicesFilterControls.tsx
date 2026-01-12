import React from 'react';
import { Input, SearchInput, ActiveOnlyCheckbox } from '@/shared/ui';

interface ServicesFilterControlsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minPrice: string;
  onMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxPrice: string;
  onMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  providerFilter: string;
  onProviderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  providers: string[];
  activeOnly: boolean;
  onActiveOnlyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Filter controls component for services filter
 * Contains all filter input fields
 */
export const ServicesFilterControls = ({
  searchQuery,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  providerFilter,
  onProviderChange,
  providers,
  activeOnly,
  onActiveOnlyChange,
}: ServicesFilterControlsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
          Search
        </label>
        <SearchInput
          id="search"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-semibold text-gray-700 mb-2">
            Min Price ($)
          </label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={onMinPriceChange}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-semibold text-gray-700 mb-2">
            Max Price ($)
          </label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="1000"
            value={maxPrice}
            onChange={onMaxPriceChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {providers.length > 0 && (
        <div>
          <label htmlFor="provider" className="block text-sm font-semibold text-gray-700 mb-2">
            Provider
          </label>
          <select
            id="provider"
            value={providerFilter}
            onChange={onProviderChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">All Providers</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>
      )}

      <ActiveOnlyCheckbox
        id="activeOnly"
        checked={activeOnly}
        onChange={onActiveOnlyChange}
        label="Show only active services"
      />
    </div>
  );
};

