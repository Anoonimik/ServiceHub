import React from 'react';
import { Input } from '../Input/Input';

interface SearchInputProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

/**
 * Search input component with icon
 * Reusable search input with built-in search icon
 */
export const SearchInput = ({ 
  id, 
  placeholder = 'Search...', 
  value, 
  onChange, 
  className = '' 
}: SearchInputProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-10 ${className}`}
      />
    </div>
  );
};

