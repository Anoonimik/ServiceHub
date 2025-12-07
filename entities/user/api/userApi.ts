import { apiRequest } from '@/shared/lib/api-client';
import { User, UserCreateDto, UserLoginDto } from '../model/types';

export const userApi = {
  register: async (data: UserCreateDto): Promise<{ user: User; token: string }> => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: UserLoginDto & { rememberMe?: boolean }): Promise<{ user: User; token: string }> => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest('/api/auth/me');
  },

  logout: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

