import React from 'react';
import Link from 'next/link';
import { Service } from '@/entities/service/model/types';

interface ServiceCardProps {
  service: Service & {
    business_name?: string;
  };
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
          {service.name}
        </h3>
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      {service.business_name && (
        <p className="text-sm text-gray-500 mb-3 font-medium">
          by {service.business_name}
        </p>
      )}
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {service.description || 'No description available'}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {service.duration} min
          </span>
          <span className="flex items-center font-semibold text-primary-600">
            ${service.price}
          </span>
        </div>
        <Link 
          href={`/reservations/new?service_id=${service.id}`} 
          className="btn btn-primary text-xs px-4 py-2"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

