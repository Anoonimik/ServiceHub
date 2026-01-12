'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/lib/authStore';
import { useServiceDetails } from '@/shared/lib/hooks/useServiceDetails';
import { useMyProvider } from '@/shared/lib/hooks/useProviders';
import { LoadingSpinner, ErrorMessage, Button, EmptyState } from '@/shared/ui';
import { ServiceDetailsHeader } from '@/widgets/ServiceDetailsHeader/ServiceDetailsHeader';
import { ServiceInfoCard } from '@/widgets/ServiceInfoCard/ServiceInfoCard';
import { ServiceProviderInfoCard } from '@/widgets/ServiceProviderInfoCard/ServiceProviderInfoCard';
import { ServiceActionsCard } from '@/widgets/ServiceActionsCard/ServiceActionsCard';
import { ServiceDetailsCard } from '@/widgets/ServiceDetailsCard/ServiceDetailsCard';

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { provider } = useMyProvider();
  const serviceId = params.id ? parseInt(params.id as string, 10) : null;
  const { service, loading, error } = useServiceDetails(serviceId);

  const isServiceOwner = service?.provider_id && provider?.id && service.provider_id === provider.id;
  
  const providerName = service?.provider_business_name || 
    (service?.provider_first_name && service?.provider_last_name 
      ? `${service.provider_first_name} ${service.provider_last_name}` 
      : null);
  
  const isServiceOwnerBoolean = Boolean(isServiceOwner);

  if (loading) {
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

  if (error && !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="page-container">
          <div className="max-w-6xl mx-auto">
            <ErrorMessage message={error} />
            <Button variant="secondary" onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <ServiceDetailsHeader
            serviceName={service.name}
            providerName={providerName}
            providerId={service.provider_id}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ServiceInfoCard service={service} />
              <ServiceProviderInfoCard
                businessName={service.provider_business_name}
                firstName={service.provider_first_name}
                lastName={service.provider_last_name}
                email={service.provider_email}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <ServiceActionsCard
                serviceId={service.id}
                isServiceOwner={isServiceOwnerBoolean}
              />
              <ServiceDetailsCard
                serviceId={service.id}
                createdAt={service.created_at}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
