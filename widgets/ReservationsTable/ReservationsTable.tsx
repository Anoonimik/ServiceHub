import React from 'react';
import { Reservation } from '@/entities/reservation/model/types';

interface ReservationsTableProps {
  reservations: Reservation[];
}

export const ReservationsTable = ({ reservations }: ReservationsTableProps) => {
  const getProviderName = (reservation: Reservation) => {
    return reservation.provider_business_name || 
           (reservation.provider_first_name && reservation.provider_last_name
             ? `${reservation.provider_first_name} ${reservation.provider_last_name}`
             : 'N/A');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{reservation.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {reservation.customer_first_name} {reservation.customer_last_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reservation.service_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {getProviderName(reservation)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(reservation.reservation_date).toLocaleString('en-US')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`badge badge-${reservation.status}`}>
                  {reservation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

