import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { providerApi } from '@/entities/provider/api/providerApi';
import { useAuthStore } from '@/features/auth/model/authStore';
import { User } from '@/entities/user/model/types';

interface ProviderFormData {
  business_name: string;
  description: string;
}

export function useProviderForm() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ProviderFormData>({
    business_name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const { provider: providerData, token: newToken, user: updatedUser } = await providerApi.becomeProvider(formData);
      
      const setAuth = useAuthStore.getState().setAuth;
      setAuth(updatedUser as User, newToken);

      router.push('/providers/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to become a provider');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}

