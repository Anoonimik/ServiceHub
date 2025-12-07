'use client'

import { useRouter } from 'next/navigation'
import { useReservationForm } from '@/shared/lib/hooks/useReservationForm'
import { useServices } from '@/shared/lib/hooks/useServices'
import { CustomerInfoForm } from '@/widgets/CustomerInfoForm/CustomerInfoForm'
import { AppointmentDetailsForm } from '@/widgets/AppointmentDetailsForm/AppointmentDetailsForm'
import { Button, ErrorMessage, SuccessMessage } from '@/shared/ui'

export default function NewReservation() {
  const router = useRouter()
  const { services } = useServices()
  const {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
  } = useReservationForm()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-3xl mx-auto">
          <div className="section-header">
            <h1>New Appointment</h1>
            <p className="text-lg text-gray-600">Book a service with one of our providers</p>
          </div>

          <div className="card">
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <CustomerInfoForm
                formData={{
                  first_name: formData.first_name,
                  last_name: formData.last_name,
                  email: formData.email,
                  phone: formData.phone,
                }}
                onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
              />

              <AppointmentDetailsForm
                formData={{
                  service_id: formData.service_id,
                  reservation_date: formData.reservation_date,
                  notes: formData.notes,
                }}
                services={services}
                onChange={handleChange}
              />

              <div className="flex flex-wrap gap-4 pt-4">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? 'Creating...' : 'Create Appointment'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/')}
                  className="flex-1 md:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
