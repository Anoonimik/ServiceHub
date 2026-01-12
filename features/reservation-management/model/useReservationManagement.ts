import { useState } from 'react';
import { reservationApi } from '@/entities/reservation/api/reservationApi';
import { Reservation, UpdateReservationDto } from '@/entities/reservation/model/types';

export function useReservationManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReservation = async (id: number, data: UpdateReservationDto): Promise<Reservation> => {
    try {
      setLoading(true);
      setError(null);
      const updated = await reservationApi.update(id, data);
      return updated;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update reservation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: number): Promise<Reservation> => {
    return updateReservation(id, { status: 'cancelled' });
  };

  const confirmReservation = async (id: number): Promise<Reservation> => {
    return updateReservation(id, { status: 'confirmed' });
  };

  const completeReservation = async (id: number): Promise<Reservation> => {
    return updateReservation(id, { status: 'completed' });
  };

  return {
    loading,
    error,
    updateReservation,
    cancelReservation,
    confirmReservation,
    completeReservation,
  };
}

