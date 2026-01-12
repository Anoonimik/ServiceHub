'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { reservationApi } from '@/entities/reservation/api/reservationApi';
import { Reservation } from '@/entities/reservation/model/types';
import { useReservationManagement } from '@/features/reservation-management';
import { LoadingSpinner, ErrorMessage, SuccessMessage, Button, EmptyState } from '@/shared/ui';

export default function ReservationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useRequireAuth();
  const { updateReservation, cancelReservation, loading: actionLoading } = useReservationManagement();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchReservation();
    }
  }, [params.id]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = parseInt(params.id as string, 10);
      if (isNaN(id)) {
        throw new Error('Invalid reservation ID');
      }
      const data = await reservationApi.getById(id);
      setReservation(data);
    } catch (err: any) {
      console.error('Error fetching reservation:', err);
      setError(err.message || 'Failed to fetch reservation');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: Reservation['status']) => {
    if (!reservation) return;

    try {
      setError(null);
      await updateReservation(reservation.id, { status });
      setSuccessMessage(`Reservation ${status} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchReservation();
    } catch (err: any) {
      setError(err.message || 'Failed to update reservation');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;

    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      setError(null);
      await cancelReservation(reservation.id);
      setSuccessMessage('Reservation cancelled successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchReservation();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel reservation');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isProvider = user?.role === 'provider';
  const isOwner = reservation?.user_id === user?.id;
  const canEdit = isProvider || isOwner;
  const canCancel = (reservation?.status === 'pending' || reservation?.status === 'confirmed') && (isProvider || isOwner);
  const canConfirm = reservation?.status === 'pending' && isProvider;
  const canComplete = reservation?.status === 'confirmed' && isProvider;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <LoadingSpinner size="md" className="py-12" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <ErrorMessage message={error} />
            <Button variant="secondary" onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <EmptyState description="Reservation not found" />
            <Button variant="secondary" onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          <div className="section-header">
            <div className="flex items-center justify-between">
              <div>
                <h1>Reservation Details</h1>
                <p className="text-lg text-gray-600 mt-1">Reservation #{reservation.id}</p>
              </div>
              <Button variant="secondary" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}
          {successMessage && <SuccessMessage message={successMessage} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Service Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Service Name</p>
                    <p className="text-lg font-semibold text-gray-900">{reservation.service_name}</p>
                  </div>
                  {reservation.service_description && (
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-700">{reservation.service_description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {reservation.service_price && (
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-lg font-semibold text-gray-900">${reservation.service_price}</p>
                      </div>
                    )}
                    {reservation.service_duration && (
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-lg font-semibold text-gray-900">{reservation.service_duration} minutes</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {isProvider ? 'Customer Information' : 'Provider Information'}
                </h2>
                <div className="space-y-3">
                  {isProvider ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {reservation.customer_first_name} {reservation.customer_last_name}
                        </p>
                      </div>
                      {reservation.customer_email && (
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-700">{reservation.customer_email}</p>
                        </div>
                      )}
                      {reservation.customer_phone && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-gray-700">{reservation.customer_phone}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {reservation.provider_business_name && (
                        <div>
                          <p className="text-sm text-gray-600">Business Name</p>
                          <p className="text-lg font-semibold text-gray-900">{reservation.provider_business_name}</p>
                        </div>
                      )}
                      {(reservation.provider_first_name || reservation.provider_last_name) && (
                        <div>
                          <p className="text-sm text-gray-600">Provider</p>
                          <p className="text-gray-700">
                            {reservation.provider_first_name} {reservation.provider_last_name}
                          </p>
                        </div>
                      )}
                      {reservation.provider_email && (
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-700">{reservation.provider_email}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {reservation.notes && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
                  <p className="text-gray-700">{reservation.notes}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reservation Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(reservation.reservation_date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                  {reservation.created_at && (
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-gray-700">
                        {new Date(reservation.created_at).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  )}
                </div>

                {canEdit && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    {canConfirm && (
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleStatusChange('confirmed')}
                        disabled={actionLoading}
                      >
                        Confirm Reservation
                      </Button>
                    )}
                    {canComplete && (
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleStatusChange('completed')}
                        disabled={actionLoading}
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={handleCancel}
                        disabled={actionLoading}
                      >
                        Cancel Reservation
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

