import React from 'react';
import { FilterHeader } from '@/shared/ui';

interface ServicesFilterHeaderProps {
  onClear: () => void;
  showClearButton: boolean;
}

/**
 * Header component for services filter widget
 */
export const ServicesFilterHeader = ({ onClear, showClearButton }: ServicesFilterHeaderProps) => {
  const icon = (
    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );

  return (
    <FilterHeader
      title="Filter Services"
      icon={icon}
      onClear={onClear}
      showClearButton={showClearButton}
    />
  );
};

