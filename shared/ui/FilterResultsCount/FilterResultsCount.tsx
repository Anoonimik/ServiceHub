import React from 'react';

interface FilterResultsCountProps {
  filtered: number;
  total: number;
  itemName: string;
}

/**
 * Component displaying filter results count
 * Shows how many items match the current filters
 */
export const FilterResultsCount = ({ filtered, total, itemName }: FilterResultsCountProps) => {
  return (
    <div className="pt-3 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{filtered}</span> of{' '}
        <span className="font-semibold text-gray-900">{total}</span> {itemName}
      </p>
    </div>
  );
};

