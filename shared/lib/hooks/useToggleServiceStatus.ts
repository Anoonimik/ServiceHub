import { useState } from 'react';
import { serviceApi } from '@/entities/service/api/serviceApi';

interface UseToggleServiceStatusProps {
  serviceId: number;
  currentStatus: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useToggleServiceStatus({ serviceId, currentStatus, onSuccess, onError }: UseToggleServiceStatusProps) {
  const [isToggling, setIsToggling] = useState(false);

  const toggleStatus = async () => {
    setIsToggling(true);
    try {
      await serviceApi.update(serviceId, { is_active: !currentStatus });
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to toggle service status';
      console.error('Failed to toggle service status:', error);
      onError?.(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  return {
    isToggling,
    toggleStatus,
  };
}

