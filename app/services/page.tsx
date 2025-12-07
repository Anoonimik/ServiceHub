'use client'

import { useServices } from '@/shared/lib/hooks/useServices'
import { ServiceCard } from '@/widgets/ServiceCard/ServiceCard'
import { LoadingSpinner, EmptyState } from '@/shared/ui'

export default function Services() {
  const { services, loading } = useServices()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="section-header">
            <h1>Services</h1>
            <p className="text-lg text-gray-600">Browse all available services from our providers</p>
          </div>

          {loading ? (
            <LoadingSpinner size="md" className="py-12" />
          ) : services.length === 0 ? (
            <EmptyState description="No services available yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
