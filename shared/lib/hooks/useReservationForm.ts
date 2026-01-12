import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/authStore';

interface ReservationFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_id: string;
  reservation_date: string;
  notes: string;
  time_slot_id?: number;
}

export function useReservationForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ReservationFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    service_id: '',
    reservation_date: '',
    notes: '',
    time_slot_id: undefined,
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        service_id: formData.service_id,
        reservation_date: formData.reservation_date,
        notes: formData.notes,
      };

      if (formData.time_slot_id) {
        payload.time_slot_id = formData.time_slot_id;
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create appointment');
      }

      setSuccess('Appointment created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slotId: number, startTime: string) => {
    setSelectedSlotId(slotId);
    setFormData({
      ...formData,
      reservation_date: new Date(startTime).toISOString().slice(0, 16),
      time_slot_id: slotId,
    });
  };

  return {
    formData,
    loading,
    error,
    success,
    selectedSlotId,
    handleChange,
    handleSubmit,
    handleSlotSelect,
  };
}

