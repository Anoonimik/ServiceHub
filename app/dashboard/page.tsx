'use client';

import React from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { useMyReservations } from '@/shared/lib/hooks/useReservations';
import { ProfileCard } from '@/widgets/ProfileCard/ProfileCard';
import { AppointmentsList } from '@/widgets/AppointmentsList/AppointmentsList';
import { Button } from '@/shared/ui';

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const { reservations, loading: reservationsLoading } = useMyReservations();
  
  const loading = authLoading || reservationsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="section-header">
            <h1>Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back, {user.firstName} {user.lastName}!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {user && <ProfileCard user={user} />}

            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">My Appointments</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <AppointmentsList reservations={reservations} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/reservations/new" passHref>
              <Button variant="primary">Book Appointment</Button>
            </Link>
            {user && user.role !== 'provider' && (
              <Link href="/providers/become" passHref>
                <Button variant="secondary">Become a Provider</Button>
              </Link>
            )}
            {user && user.role === 'provider' && (
              <Link href="/providers/dashboard" passHref>
                <Button variant="secondary">Provider Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
