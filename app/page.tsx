'use client'

import Link from 'next/link'
import { useReservations } from '@/shared/lib/hooks/useReservations'
import { ReservationsTable } from '@/widgets/ReservationsTable/ReservationsTable'
import { LoadingSpinner, EmptyState } from '@/shared/ui'

export default function Home() {
  const { reservations, loading } = useReservations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="section-header">
            <h1>Service Booking Platform</h1>
            <p className="text-lg text-gray-600">Book services from providers or offer your own services</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Link href="/services" className="btn btn-primary">
              Browse Services
            </Link>
            <Link href="/reservations/new" className="btn btn-secondary">
              Book Appointment
            </Link>
            <Link href="/providers" className="btn btn-secondary">
              Find Providers
            </Link>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Appointments</h2>
            {loading ? (
              <LoadingSpinner size="md" className="py-12" />
            ) : reservations.length === 0 ? (
              <EmptyState description="No appointments yet. Create your first appointment!" />
            ) : (
              <ReservationsTable reservations={reservations} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
