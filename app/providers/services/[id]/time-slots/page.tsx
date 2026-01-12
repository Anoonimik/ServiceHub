'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { timeSlotApi } from '@/entities/time-slot/api/timeSlotApi';
import { TimeSlot } from '@/entities/time-slot/model/types';
import { serviceApi } from '@/entities/service/api/serviceApi';
import { Service } from '@/entities/service/model/types';
import { LoadingSpinner, ErrorMessage, SuccessMessage, Button, EmptyState } from '@/shared/ui';

export default function TimeSlotsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth('provider');
  const [service, setService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const serviceId = parseInt(params.id as string, 10);
      if (isNaN(serviceId)) {
        throw new Error('Invalid service ID');
      }

      const [serviceData, slotsData] = await Promise.all([
        serviceApi.getService(serviceId),
        timeSlotApi.getByServiceId(serviceId),
      ]);

      setService(serviceData);
      setSlots(slotsData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    try {
      setError(null);
      await timeSlotApi.create(service.id, {
        serviceId: service.id,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setSuccessMessage('Time slot created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateForm(false);
      setFormData({ startTime: '', endTime: '' });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create time slot');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this time slot?')) {
      return;
    }

    try {
      setError(null);
      await timeSlotApi.delete(id);
      setSuccessMessage('Time slot deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete time slot');
    }
  };

  const handleToggleAvailability = async (slot: TimeSlot) => {
    try {
      setError(null);
      await timeSlotApi.update(slot.id, {
        isAvailable: !slot.isAvailable,
      });
      setSuccessMessage(`Time slot ${!slot.isAvailable ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update time slot');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-6xl mx-auto">
            <LoadingSpinner size="md" className="py-12" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'provider') {
    return null;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-6xl mx-auto">
            <EmptyState description="Service not found" />
            <Button variant="secondary" onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="section-header">
            <div className="flex items-center justify-between">
              <div>
                <h1>Time Slots for {service.name}</h1>
                <p className="text-lg text-gray-600 mt-1">Manage available booking times</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => router.back()}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  {showCreateForm ? 'Cancel' : 'Add Time Slot'}
                </Button>
              </div>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}
          {successMessage && <SuccessMessage message={successMessage} />}

          {showCreateForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Time Slot</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      className="input"
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary">
                  Create Time Slot
                </Button>
              </form>
            </div>
          )}

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Time Slots</h2>
            {slots.length === 0 ? (
              <EmptyState description="No time slots created yet. Add your first time slot to start accepting bookings." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">End Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Booked</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(slot.startTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(slot.endTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            slot.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slot.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {slot.isBooked ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Booked
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleToggleAvailability(slot)}
                              disabled={slot.isBooked}
                            >
                              {slot.isAvailable ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(slot.id)}
                              disabled={slot.isBooked}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

