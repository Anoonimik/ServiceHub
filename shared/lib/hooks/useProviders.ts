import { useState, useEffect } from 'react';
import { ServiceProvider } from '@/entities/provider/model/types';
import { providerApi } from '@/entities/provider/api/providerApi';

export function useProviders() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await providerApi.getAllProviders();
      setProviders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching providers:', err);
      setError(err.message || 'Failed to fetch providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  return { providers, loading, error, refetch: fetchProviders };
}

export function useMyProvider() {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyProvider();
  }, []);

  const fetchMyProvider = async () => {
    try {
      setLoading(true);
      setError(null);
      const providerData = await providerApi.getMyProviderProfile();
      setProvider(providerData);
    } catch (err: any) {
      if (err?.statusCode === 403) {
        setProvider(null);
        setError(null);
      } else {
        console.error('Error fetching provider:', err);
        setError(err.message || 'Failed to fetch provider');
        setProvider(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return { provider, loading, error, refetch: fetchMyProvider };
}

