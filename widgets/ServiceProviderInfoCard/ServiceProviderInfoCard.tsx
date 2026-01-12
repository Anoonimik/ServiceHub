import React from 'react';

interface ServiceProviderInfoCardProps {
  businessName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

/**
 * Card component displaying provider information
 * Shows business name, provider name, and contact email
 */
export const ServiceProviderInfoCard = ({
  businessName,
  firstName,
  lastName,
  email,
}: ServiceProviderInfoCardProps) => {
  if (!businessName && !firstName && !lastName && !email) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Provider Information</h2>
      </div>

      <div className="space-y-4">
        {businessName && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Business Name</p>
            <p className="text-lg font-bold text-gray-900">{businessName}</p>
          </div>
        )}
        
        {(firstName || lastName) && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Provider</p>
              <p className="text-gray-900 font-medium">
                {firstName} {lastName}
              </p>
            </div>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Email</p>
              <a 
                href={`mailto:${email}`}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

