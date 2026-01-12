'use client'

import { useState, useEffect } from 'react';
import { useServices } from '@/shared/lib/hooks/useServices';
import { ServiceCard } from '@/widgets/ServiceCard/ServiceCard';
import { ServicesFilter } from '@/widgets/ServicesFilter/ServicesFilter';
import { LoadingSpinner, EmptyState } from '@/shared/ui';
import { Service } from '@/entities/service/model/types';

export default function Services() {
  const { services, loading } = useServices();
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!loading && services.length > 0) {
      setFilteredServices(services);
    }
  }, [services, loading]);

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
            <>
              <ServicesFilter services={services} onFiltered={setFilteredServices} />
              
              {filteredServices.length === 0 ? (
                <EmptyState description="No services match your filters. Try adjusting your search criteria." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
