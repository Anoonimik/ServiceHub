import React from 'react';

interface ActiveOnlyCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

/**
 * Checkbox component for filtering active items
 * Reusable checkbox with consistent styling
 */
export const ActiveOnlyCheckbox = ({ id, checked, onChange, label }: ActiveOnlyCheckboxProps) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
      />
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
      </label>
    </div>
  );
};

