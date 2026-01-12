import React from 'react';
import Link from 'next/link';
import { Reservation } from '@/entities/reservation/model/types';
import { Button } from '@/shared/ui';

interface AppointmentsListProps {
  reservations: Reservation[];
  emptyMessage?: string;
  onCancel?: (id: number) => Promise<void>;
  showCancelButton?: boolean;
}

export const AppointmentsList = ({
  reservations,
  emptyMessage = "You don't have any appointments yet",
  onCancel,
  showCancelButton = false,
}: AppointmentsListProps) => {
  const getProviderName = (reservation: Reservation) => {
    return reservation.provider_business_name || 
           (reservation.provider_first_name && reservation.provider_last_name
             ? `${reservation.provider_first_name} ${reservation.provider_last_name}`
             : null);
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-4 text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  const canCancel = (status: string) => status === 'pending' || status === 'confirmed';

  return (
    <div className="space-y-3">
      {reservations.map((reservation) => {
        const providerName = getProviderName(reservation);
        return (
          <div key={reservation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link href={`/reservations/${reservation.id}`}>
                  <h4 className="font-semibold text-gray-900 mb-1 hover:text-primary-600 cursor-pointer">
                    {reservation.service_name}
                  </h4>
                </Link>
                {providerName && (
                  <p className="text-sm text-gray-600 mb-2">{providerName}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(reservation.reservation_date).toLocaleString('en-US')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`badge badge-${reservation.status}`}>
                  {reservation.status}
                </span>
                {showCancelButton && onCancel && canCancel(reservation.status) && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onCancel(reservation.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

