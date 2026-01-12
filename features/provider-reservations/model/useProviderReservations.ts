import { useState, useEffect } from 'react';
import { reservationApi } from '@/entities/reservation/api/reservationApi';
import { Reservation } from '@/entities/reservation/model/types';

export function useProviderReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationApi.getProviderReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching provider reservations:', err);
      setError(err.message || 'Failed to fetch reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: number, status: Reservation['status'], notes?: string | null) => {
    try {
      await reservationApi.update(id, { status, notes });
      await fetchReservations();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update reservation');
    }
  };

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
    updateStatus: updateReservationStatus,
  };
}

