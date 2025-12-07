import React from 'react';
import Link from 'next/link';
import { ServiceProvider } from '@/entities/provider/model/types';

interface ProviderCardProps {
  provider: ServiceProvider;
}

export const ProviderCard = ({ provider }: ProviderCardProps) => {
  const displayName = provider.business_name || 
    (provider.user ? `${provider.user.firstName} ${provider.user.lastName}` : 'Unknown');

  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {displayName}
          </h3>
          {provider.business_name && provider.user && (
            <p className="text-sm text-gray-500 mt-1">
              {provider.user.firstName} {provider.user.lastName}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      
      {provider.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {provider.description}
        </p>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="badge badge-completed">Active</span>
        <Link 
          href={`/providers/${provider.id}/services`} 
          className="btn btn-primary text-xs px-4 py-2"
        >
          View Services
        </Link>
      </div>
    </div>
  );
};

