import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { serviceApi } from '@/entities/service/api/serviceApi';
import { Service } from '@/entities/service/model/types';

interface ServiceFormData {
  name: string;
  description: string;
  duration: string;
  price: string;
  allow_custom_time: boolean;
}

interface UseEditServiceProps {
  service: Service | null;
  onSuccess?: () => void;
}

export function useEditService({ service, onSuccess }: UseEditServiceProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: '',
    price: '',
    allow_custom_time: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        duration: typeof service.duration === 'number' ? service.duration.toString() : '',
        price: typeof service.price === 'number' ? service.price.toString() : '',
        allow_custom_time: service.allow_custom_time !== false,
      });
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
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

      if (!service) {
        throw new Error('Service not found');
      }

      await serviceApi.update(service.id, {
        name: formData.name,
        description: formData.description || undefined,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        allow_custom_time: formData.allow_custom_time,
      });

      onSuccess?.();
      router.push('/providers/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update service');
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

