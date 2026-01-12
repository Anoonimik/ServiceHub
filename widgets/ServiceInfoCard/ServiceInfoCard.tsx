import React from 'react';
import { ServiceWithProvider } from '@/entities/service/model/types';

interface ServiceInfoCardProps {
  service: ServiceWithProvider;
}

/**
 * Card component displaying detailed service information
 * Shows description, price, duration, and status badges
 */
export const ServiceInfoCard = ({ service }: ServiceInfoCardProps) => {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 rounded-lg">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Service Information</h2>
      </div>

      <div className="space-y-6">
        {service.description && (
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{service.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Price</p>
            </div>
            <p className="text-3xl font-bold text-primary-700">${service.price}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Duration</p>
            </div>
            <p className="text-3xl font-bold text-blue-700">{service.duration} min</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full ${
              service.is_active 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-gray-100 text-gray-800 border border-gray-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {service.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          {service.allow_custom_time !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Custom Time:</span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full ${
                service.allow_custom_time === true
                  ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${service.allow_custom_time === true ? 'bg-purple-500' : 'bg-gray-400'}`}></span>
                {service.allow_custom_time === true ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

