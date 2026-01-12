import { useState, useEffect } from 'react';
import { serviceApi } from '@/entities/service/api/serviceApi';
import { ServiceWithProvider } from '@/entities/service/model/types';

/**
 * Hook for fetching service details
 * @param serviceId - ID of the service to fetch
 * @returns Service data, loading state, and error
 */
export function useServiceDetails(serviceId: number | null) {
  const [service, setService] = useState<ServiceWithProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchService = async () => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (isNaN(serviceId)) {
        throw new Error('Invalid service ID');
      }
      const data = await serviceApi.getService(serviceId);
      setService(data);
    } catch (err: any) {
      console.error('Error fetching service:', err);
      setError(err.message || 'Failed to fetch service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  return { service, loading, error, refetch: fetchService };
}

