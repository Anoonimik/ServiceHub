import { useState } from 'react';
import { serviceApi } from '@/entities/service/api/serviceApi';

interface UseDeleteServiceOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteService({ onSuccess, onError }: UseDeleteServiceOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteService = async (serviceId: number) => {
    try {
      setIsDeleting(true);
      await serviceApi.delete(serviceId);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete service';
      onError?.(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteService,
  };
}

