'use client';

import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { useProviderReservations } from '@/features/provider-reservations';
import { ProviderReservationsTable } from '@/widgets/ProviderReservationsTable/ProviderReservationsTable';
import { PendingReservationsPanel } from '@/widgets/PendingReservationsPanel/PendingReservationsPanel';
import { LoadingSpinner, ErrorMessage, SuccessMessage } from '@/shared/ui';
import { useState } from 'react';
import { Reservation } from '@/entities/reservation/model/types';

/**
 * Provider Reservations Management Page
 * Allows providers to view and manage all reservations for their services
 */
export default function ProviderReservationsPage() {
  const { user, loading: authLoading } = useRequireAuth('provider');
  const { reservations, loading, error, refetch, updateStatus } = useProviderReservations();
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStatusChange = async (id: number, status: Reservation['status']) => {
    try {
      setActionLoading(true);
      setSuccessMessage(null);
      await updateStatus(id, status);
      setSuccessMessage(`Reservation #${id} ${status} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      refetch();
    } catch (err: any) {
      console.error('Error updating reservation:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
    await handleStatusChange(id, 'confirmed');
  };

  const handleCancel = async (id: number) => {
    await handleStatusChange(id, 'cancelled');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-7xl mx-auto">
            <LoadingSpinner size="md" className="py-12" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'provider') {
    return null;
  }

  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Reservations Management</h1>
            <p className="text-lg text-gray-600">
              Manage all reservations for your services. Confirm pending bookings and track completed appointments.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}
          {successMessage && <SuccessMessage message={successMessage} />}

          {pendingCount > 0 && (
            <div className="mb-8">
              <PendingReservationsPanel
                reservations={reservations}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={actionLoading}
              />
            </div>
          )}

          <div className="card shadow-md">
            <ProviderReservationsTable
              reservations={reservations}
              onStatusChange={handleStatusChange}
              loading={actionLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

