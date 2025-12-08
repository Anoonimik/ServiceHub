import { apiRequest } from '@/shared/lib/api-client';
import { ServiceProvider, ServiceProviderCreateDto } from '../model/types';
import { ProviderResponseDTO } from '@/application/dtos/ProviderDTO';
import { UserResponseDTO } from '@/application/dtos/UserDTO';

export const providerApi = {
  becomeProvider: async (data: ServiceProviderCreateDto): Promise<{ provider: ServiceProvider; token: string; user: UserResponseDTO }> => {
    const result = await apiRequest<{ provider: ProviderResponseDTO; token: string; user: UserResponseDTO }>('/api/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      provider: {
        id: result.provider.id,
        user_id: result.provider.userId,
        business_name: result.provider.businessName || undefined,
        description: result.provider.description || undefined,
        is_active: result.provider.isActive,
        created_at: result.provider.createdAt,
        updated_at: result.provider.updatedAt,
        user: result.user ? {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone || undefined,
        } : undefined,
      },
      token: result.token,
      user: result.user,
    };
  },

  getMyProviderProfile: async (): Promise<ServiceProvider | null> => {
    try {
      const result = await apiRequest<ProviderResponseDTO>('/api/providers/me');
      return {
        id: result.id,
        user_id: result.userId,
        business_name: result.businessName || undefined,
        description: result.description || undefined,
        is_active: result.isActive,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
        user: result.user ? {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone || undefined,
        } : undefined,
      };
    } catch {
      return null;
    }
  },

  getProvider: async (id: number): Promise<ServiceProvider> => {
    const result = await apiRequest<ProviderResponseDTO>(`/api/providers/${id}`);
      return {
        id: result.id,
        user_id: result.userId,
        business_name: result.businessName || undefined,
        description: result.description || undefined,
        is_active: result.isActive,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
        user: result.user ? {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone || undefined,
        } : undefined,
      };
  },

  getAllProviders: async (): Promise<ServiceProvider[]> => {
    const results = await apiRequest<ProviderResponseDTO[]>('/api/providers');
    return results.map(result => ({
      id: result.id,
      user_id: result.userId,
      business_name: result.businessName || undefined,
      description: result.description || undefined,
      is_active: result.isActive,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
      user: result.user ? {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        phone: result.user.phone || undefined,
      } : undefined,
    }));
  },

  updateProvider: async (data: Partial<{ business_name?: string; description?: string; is_active?: boolean }>): Promise<ServiceProvider> => {
    const result = await apiRequest<ProviderResponseDTO>('/api/providers/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
      return {
        id: result.id,
        user_id: result.userId,
        business_name: result.businessName || undefined,
        description: result.description || undefined,
        is_active: result.isActive,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
        user: result.user ? {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone || undefined,
        } : undefined,
      };
  },
};

