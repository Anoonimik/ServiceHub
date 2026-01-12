import React from 'react';

interface FilterHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
}

/**
 * Header component for filter widgets
 * Displays filter title with icon and optional clear button
 */
export const FilterHeader = ({ 
  title, 
  icon, 
  onClear, 
  showClearButton = false 
}: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-primary-100 rounded-lg">
            {icon}
          </div>
        )}
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {showClearButton && onClear && (
        <button
          onClick={onClear}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

