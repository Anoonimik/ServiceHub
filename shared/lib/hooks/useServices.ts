import { useState, useEffect } from 'react';
import { Service } from '@/entities/service/model/types';
import { serviceApi } from '@/entities/service/api/serviceApi';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/services');
      const result = await response.json();
      const data = result.success !== undefined ? result.data : result;
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, refetch: fetchServices };
}

export function useMyServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const servicesData = await serviceApi.getMyServices();
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (err: any) {
      if (err?.statusCode === 403) {
        setServices([]);
        setError(null);
      } else {
        console.error('Error fetching services:', err);
        setError(err.message || 'Failed to fetch services');
        setServices([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, refetch: fetchMyServices };
}

