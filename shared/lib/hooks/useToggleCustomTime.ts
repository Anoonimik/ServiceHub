import { useState } from 'react';
import { serviceApi } from '@/entities/service/api/serviceApi';

interface UseToggleCustomTimeProps {
  serviceId: number;
  currentStatus: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useToggleCustomTime({ 
  serviceId, 
  currentStatus, 
  onSuccess, 
  onError 
}: UseToggleCustomTimeProps) {
  const [isToggling, setIsToggling] = useState(false);

  const toggleCustomTime = async () => {
    setIsToggling(true);
    try {
      const newValue = !currentStatus;
      await serviceApi.update(serviceId, {
        allow_custom_time: newValue,
      });
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update custom time setting';
      onError?.(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  return { isToggling, toggleCustomTime };
}

