import React from 'react';

interface ProviderServicesListHeaderProps {
  filteredCount: number;
  totalCount: number;
}

/**
 * Header component for provider services list
 * Displays title and service count
 */
export const ProviderServicesListHeader = ({ filteredCount, totalCount }: ProviderServicesListHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">My Services</h3>
        <p className="text-sm text-gray-500 mt-1">
          {filteredCount} of {totalCount} {totalCount === 1 ? 'service' : 'services'}
        </p>
      </div>
    </div>
  );
};

