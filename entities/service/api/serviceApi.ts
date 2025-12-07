import { apiRequest } from '@/shared/lib/api-client';
import { Service, ServiceCreateDto, ServiceUpdateDto } from '../model/types';

export const serviceApi = {
  create: async (data: ServiceCreateDto): Promise<Service> => {
    return apiRequest('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: ServiceUpdateDto): Promise<Service> => {
    return apiRequest(`/api/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest(`/api/services/${id}`, {
      method: 'DELETE',
    });
  },

  getMyServices: async (): Promise<Service[]> => {
    return apiRequest('/api/services/my');
  },

  getAllServices: async (): Promise<Service[]> => {
    return apiRequest('/api/services');
  },

  getService: async (id: number): Promise<Service> => {
    return apiRequest(`/api/services/${id}`);
  },
};

