'use client';

import React from 'react';
import Link from 'next/link';
import { Reservation } from '@/entities/reservation/model/types';
import { Button } from '@/shared/ui';

interface PendingReservationsPanelProps {
  reservations: Reservation[];
  onConfirm: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  loading?: boolean;
}

/**
 * Panel component for displaying and managing pending reservations
 * Provides quick actions to confirm or cancel reservations
 */
export const PendingReservationsPanel = ({
  reservations,
  onConfirm,
  onCancel,
  loading = false,
}: PendingReservationsPanelProps) => {
  const pendingReservations = reservations.filter(r => r.status === 'pending');

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (pendingReservations.length === 0) {
    return (
      <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">All Clear!</h3>
            <p className="text-sm text-green-700">No pending reservations at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-yellow-200">
        <div className="p-3 bg-yellow-500 rounded-lg shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">Pending Reservations</h3>
          <p className="text-sm text-gray-600 mt-1">
            {pendingReservations.length} {pendingReservations.length === 1 ? 'reservation' : 'reservations'} awaiting your confirmation
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {pendingReservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white rounded-lg border-2 border-yellow-200 p-5 hover:border-yellow-300 hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/reservations/${reservation.id}`}
                        className="text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Reservation #{reservation.id}
                      </Link>
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-300">
                        PENDING
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</p>
                          <p className="text-sm font-medium text-gray-900">
                            {reservation.customer_first_name} {reservation.customer_last_name}
                          </p>
                          {reservation.customer_phone && (
                            <p className="text-xs text-gray-600 mt-1">{reservation.customer_phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</p>
                          <p className="text-sm font-medium text-gray-900">{reservation.service_name}</p>
                          {reservation.service_price && (
                            <p className="text-xs text-primary-600 font-semibold mt-1">${reservation.service_price}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</p>
                          <p className="text-sm font-medium text-gray-900">{formatDateTime(reservation.reservation_date)}</p>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</p>
                            <p className="text-sm text-gray-700">{reservation.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => onConfirm(reservation.id)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => onCancel(reservation.id)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 text-base font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

