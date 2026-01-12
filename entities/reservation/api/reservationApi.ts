import { apiRequest } from '@/shared/lib/api-client';
import { Reservation, UpdateReservationDto } from '../model/types';

export const reservationApi = {
  getById: async (id: number): Promise<Reservation> => {
    return apiRequest(`/api/reservations/${id}`);
  },

  update: async (id: number, data: UpdateReservationDto): Promise<Reservation> => {
    return apiRequest(`/api/reservations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getProviderReservations: async (): Promise<Reservation[]> => {
    return apiRequest('/api/providers/reservations');
  },
};

