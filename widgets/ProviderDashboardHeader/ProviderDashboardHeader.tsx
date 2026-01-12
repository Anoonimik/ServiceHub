import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';

/**
 * Header component for provider dashboard
 * Displays title, subtitle, and action buttons
 */
export const ProviderDashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your services and appointments</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/providers/reservations">
            <Button 
              variant="secondary" 
              className="flex items-center gap-2 px-4 py-2.5 shadow-sm hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Reservations
            </Button>
          </Link>
          <Link href="/providers/services/new">
            <Button 
              variant="primary" 
              className="flex items-center gap-2 px-4 py-2.5 shadow-md hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

