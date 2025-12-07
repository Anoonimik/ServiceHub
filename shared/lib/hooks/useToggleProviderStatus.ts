import { useState } from 'react';
import { providerApi } from '@/entities/provider/api/providerApi';

interface UseToggleProviderStatusProps {
  currentStatus: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useToggleProviderStatus({ currentStatus, onSuccess, onError }: UseToggleProviderStatusProps) {
  const [isToggling, setIsToggling] = useState(false);

  const toggleStatus = async () => {
    setIsToggling(true);
    try {
      await providerApi.updateProvider({ is_active: !currentStatus });
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to toggle provider status';
      console.error('Failed to toggle provider status:', error);
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

