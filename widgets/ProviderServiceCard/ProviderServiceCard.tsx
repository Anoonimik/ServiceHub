import React, { useState } from 'react';
import { Service } from '@/entities/service/model/types';
import { useToggleServiceStatus } from '@/shared/lib/hooks/useToggleServiceStatus';
import { ErrorMessage } from '@/shared/ui';

interface ProviderServiceCardProps {
  service: Service;
  onUpdate?: () => void;
}

export const ProviderServiceCard = ({ service, onUpdate }: ProviderServiceCardProps) => {
  const [error, setError] = useState<string | null>(null);
  const { isToggling, toggleStatus } = useToggleServiceStatus({
    serviceId: service.id,
    currentStatus: service.is_active,
    onSuccess: () => {
      setError(null);
      onUpdate?.();
    },
    onError: (errorMessage) => {
      setError(errorMessage);
    },
  });

  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group">
      {error && (
        <div className="mb-3">
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
          />
        </div>
      )}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
              {service.name}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleStatus}
                disabled={isToggling}
                className={`badge ${service.is_active ? 'badge-completed' : 'badge-cancelled'} uppercase text-xs font-bold px-3 py-1 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50`}
                title={service.is_active ? 'Click to deactivate' : 'Click to activate'}
              >
                {isToggling ? '...' : service.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
          {service.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {service.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-700">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-primary-700">${service.price}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{service.duration} min</span>
            </div>
            <div className="text-xs text-gray-500">
              ID: {service.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

