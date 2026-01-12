import { apiRequest } from '@/shared/lib/api-client';
import { TimeSlotResponseDTO, CreateTimeSlotDTO } from '@/application/dtos/TimeSlotDTO';

export const timeSlotApi = {
  getByServiceId: async (serviceId: number, startDate?: string, endDate?: string): Promise<TimeSlotResponseDTO[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString();
    return apiRequest(`/api/services/${serviceId}/time-slots${query ? `?${query}` : ''}`);
  },

  create: async (serviceId: number, data: CreateTimeSlotDTO): Promise<TimeSlotResponseDTO> => {
    return apiRequest(`/api/services/${serviceId}/time-slots`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: Partial<CreateTimeSlotDTO>): Promise<TimeSlotResponseDTO> => {
    return apiRequest(`/api/time-slots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest(`/api/time-slots/${id}`, {
      method: 'DELETE',
    });
  },
};

