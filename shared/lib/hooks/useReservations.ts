import { useState, useEffect } from 'react';
import { Reservation } from '@/entities/reservation/model/types';

/**
 * Re-export Reservation type for backward compatibility
 * @deprecated Use Reservation from '@/entities/reservation/model/types' instead
 */
export type { Reservation };

export function useReservations() {
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
      const response = await fetch('/api/reservations');
      const result = await response.json();
      
      const data = result.success !== undefined ? result.data : result;
      
      if (Array.isArray(data)) {
        setReservations(data);
      } else {
        setError('Invalid data format');
        setReservations([]);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to fetch reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  return { reservations, loading, error, refetch: fetchReservations };
}

export function useMyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/reservations/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const result = await response.json();
      const data = result.success !== undefined ? result.data : result;
      setReservations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      setError(err.message || 'Failed to fetch reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  return { reservations, loading, error, refetch: fetchMyReservations };
}

