import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';

interface ServiceActionsCardProps {
  serviceId: number;
  isServiceOwner: boolean;
}

/**
 * Card component displaying quick actions for a service
 * Shows booking button for clients or management buttons for owners
 */
export const ServiceActionsCard = ({ serviceId, isServiceOwner }: ServiceActionsCardProps) => {
  return (
    <div className="card sticky top-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2.5 bg-primary-600 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </div>
      
      <div className="space-y-3">
        {!isServiceOwner && (
          <Link href={`/reservations/new?service_id=${serviceId}`} className="block">
            <Button 
              variant="primary" 
              fullWidth 
              className="flex items-center justify-center gap-2.5 py-3.5 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book This Service
            </Button>
          </Link>
        )}
        
        {isServiceOwner && (
          <>
            <Link href={`/providers/services/${serviceId}/edit`} className="block">
              <Button 
                variant="primary" 
                fullWidth 
                className="flex items-center justify-center gap-2.5 py-3.5 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Service
              </Button>
            </Link>
            <Link href={`/providers/services/${serviceId}/time-slots`} className="block">
              <Button 
                variant="secondary" 
                fullWidth 
                className="flex items-center justify-center gap-2.5 py-3.5 text-base font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Manage Time Slots
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

