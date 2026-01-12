import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ServiceDetailsHeaderProps {
  serviceName: string;
  providerName?: string | null;
  providerId?: number;
}

/**
 * Header component for service details page
 * Displays service name, provider link, and back button
 */
export const ServiceDetailsHeader = ({
  serviceName,
  providerName,
  providerId,
}: ServiceDetailsHeaderProps) => {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            {providerName && providerId && (
              <Link 
                href={`/providers/${providerId}`}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {providerName}
              </Link>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{serviceName}</h1>
          <p className="text-lg text-gray-600">Service Details</p>
        </div>
      </div>
    </div>
  );
};

