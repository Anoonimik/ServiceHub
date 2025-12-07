import { useMemo } from 'react';
import { Service } from '@/entities/service/model/types';

interface ProviderStats {
  totalServices: number;
  activeServices: number;
  totalRevenue: number;
}

export function useProviderStats(services: Service[]): ProviderStats {
  return useMemo(() => {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.is_active).length;
    const totalRevenue = services.reduce(
      (sum, s) => sum + (s.is_active ? parseFloat(s.price.toString()) : 0),
      0
    );

    return {
      totalServices,
      activeServices,
      totalRevenue,
    };
  }, [services]);
}

