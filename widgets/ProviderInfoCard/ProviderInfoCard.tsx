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
    <div className="card shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Provider Information</h3>
      </div>
      
      <div className="space-y-5">
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
          />
        )}
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Business Name</span>
            <span className={`text-base font-bold ${provider.business_name ? 'text-gray-900' : 'text-gray-400'}`}>
              {provider.business_name || 'Not set'}
            </span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</span>
            <button
              onClick={toggleStatus}
              disabled={isToggling}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                provider.is_active 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-gray-200'
              } disabled:opacity-50 cursor-pointer`}
              title={provider.is_active ? 'Click to deactivate' : 'Click to activate'}
            >
              <span className={`w-2 h-2 rounded-full ${provider.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {isToggling ? '...' : provider.is_active ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>
        
        {provider.description && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-2">Description</span>
            <p className="text-sm text-gray-900 leading-relaxed">{provider.description}</p>
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            variant="secondary" 
            fullWidth
            className="flex items-center justify-center gap-2 py-3 font-semibold shadow-sm hover:shadow-md transition-all"
            onClick={() => router.push('/providers/edit')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

