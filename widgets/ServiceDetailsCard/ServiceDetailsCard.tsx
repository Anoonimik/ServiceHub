import React from 'react';

interface ServiceDetailsCardProps {
  serviceId: number;
  createdAt?: string;
}

/**
 * Card component displaying service metadata
 * Shows service ID and creation date
 */
export const ServiceDetailsCard = ({ serviceId, createdAt }: ServiceDetailsCardProps) => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Details
      </h2>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Service ID</p>
          <p className="text-lg font-bold text-gray-900">#{serviceId}</p>
        </div>
        {createdAt && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Created</p>
            <p className="text-gray-900 font-medium">
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

