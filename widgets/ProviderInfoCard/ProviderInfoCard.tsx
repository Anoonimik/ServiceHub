import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProvider } from '@/entities/provider/model/types';
import { Button, ErrorMessage } from '@/shared/ui';
import { useToggleProviderStatus } from '@/shared/lib/hooks/useToggleProviderStatus';

interface ProviderInfoCardProps {
  provider: ServiceProvider;
  onUpdate?: () => void;
}

export const ProviderInfoCard = ({ provider, onUpdate }: ProviderInfoCardProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { isToggling, toggleStatus } = useToggleProviderStatus({
    currentStatus: provider.is_active,
    onSuccess: () => {
      setError(null);
      onUpdate?.();
    },
    onError: (errorMessage) => {
      setError(errorMessage);
    },
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Provider Information</h3>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
      <div className="space-y-4">
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
          />
        )}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Business Name</span>
          <span className={`text-sm font-semibold ${provider.business_name ? 'text-gray-900' : 'text-gray-400'}`}>
            {provider.business_name || 'Not set'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Status</span>
          <button
            onClick={toggleStatus}
            disabled={isToggling}
            className={`badge ${provider.is_active ? 'badge-completed' : 'badge-cancelled'} uppercase text-xs font-bold px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50`}
            title={provider.is_active ? 'Click to deactivate' : 'Click to activate'}
          >
            {isToggling ? '...' : provider.is_active ? 'Active' : 'Inactive'}
          </button>
        </div>
        {provider.description && (
          <div className="py-2">
            <span className="text-sm font-medium text-gray-600 block mb-2">Description</span>
            <p className="text-sm text-gray-900 leading-relaxed">{provider.description}</p>
          </div>
        )}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => router.push('/providers/edit')}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

