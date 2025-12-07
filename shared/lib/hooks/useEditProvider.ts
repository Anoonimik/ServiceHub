import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProvider } from '@/entities/provider/model/types';
import { providerApi } from '@/entities/provider/api/providerApi';

interface UseEditProviderProps {
  provider: ServiceProvider | null;
  onSuccess?: () => void;
}

export function useEditProvider({ provider, onSuccess }: UseEditProviderProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (provider) {
      setFormData({
        business_name: provider.business_name || '',
        description: provider.description || '',
        is_active: provider.is_active,
      });
    }
  }, [provider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await providerApi.updateProvider({
        business_name: formData.business_name || undefined,
        description: formData.description || undefined,
        is_active: formData.is_active,
      });
      onSuccess?.();
      router.push('/providers/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
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

