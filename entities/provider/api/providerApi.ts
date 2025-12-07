import { apiRequest } from '@/shared/lib/api-client';
import { ServiceProvider, ServiceProviderCreateDto } from '../model/types';
import { ProviderResponseDTO } from '@/application/dtos/ProviderDTO';

export const providerApi = {
  becomeProvider: async (data: ServiceProviderCreateDto): Promise<ServiceProvider> => {
    const result = await apiRequest<ProviderResponseDTO>('/api/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Map DTO to entity
    return {
      id: result.id,
      user_id: result.userId,
      business_name: result.businessName || undefined,
      description: result.description || undefined,
      is_active: result.isActive,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
      user: result.user,
    };
  },

  getMyProviderProfile: async (): Promise<ServiceProvider | null> => {
    try {
      const result = await apiRequest<ProviderResponseDTO>('/api/providers/me');
      // Map DTO to entity
      return {
        id: result.id,
        user_id: result.userId,
        business_name: result.businessName || undefined,
        description: result.description || undefined,
        is_active: result.isActive,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
        user: result.user,
      };
    } catch {
      return null;
    }
  },

  getProvider: async (id: number): Promise<ServiceProvider> => {
    const result = await apiRequest<ProviderResponseDTO>(`/api/providers/${id}`);
    // Map DTO to entity
    return {
      id: result.id,
      user_id: result.userId,
      business_name: result.businessName || undefined,
      description: result.description || undefined,
      is_active: result.isActive,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
      user: result.user,
    };
  },

  getAllProviders: async (): Promise<ServiceProvider[]> => {
    const results = await apiRequest<ProviderResponseDTO[]>('/api/providers');
    // Map DTOs to entities
    return results.map(result => ({
      id: result.id,
      user_id: result.userId,
      business_name: result.businessName || undefined,
      description: result.description || undefined,
      is_active: result.isActive,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
      user: result.user,
    }));
  },

  updateProvider: async (data: Partial<{ business_name?: string; description?: string; is_active?: boolean }>): Promise<ServiceProvider> => {
    const result = await apiRequest<ProviderResponseDTO>('/api/providers/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    // Map DTO to entity
    return {
      id: result.id,
      user_id: result.userId,
      business_name: result.businessName || undefined,
      description: result.description || undefined,
      is_active: result.isActive,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
      user: result.user,
    };
  },
};

