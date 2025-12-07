import React from 'react';
import Link from 'next/link';
import { Service } from '@/entities/service/model/types';
import { EmptyState, Button } from '@/shared/ui';
import { ProviderServiceCard } from '../ProviderServiceCard/ProviderServiceCard';

interface ProviderServicesListProps {
  services: Service[];
  onServiceUpdate?: () => void;
}

export const ProviderServicesList = ({ services, onServiceUpdate }: ProviderServicesListProps) => {
  const totalServices = services.length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">My Services</h3>
          <p className="text-sm text-gray-500 mt-1">{totalServices} {totalServices === 1 ? 'service' : 'services'} total</p>
        </div>
      </div>
      {services.length === 0 ? (
        <EmptyState 
          description="No services yet. Create your first service to get started!"
          action={
            <Link href="/providers/services/new">
              <Button variant="primary">Create Service</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <ProviderServiceCard key={service.id} service={service} onUpdate={onServiceUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

