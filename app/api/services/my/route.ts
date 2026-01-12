import { NextRequest } from 'next/server';
import { handleApiRoute } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { container } from '@/infrastructure/di/container';

export async function GET(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const provider = await container.providerRepository.findByUserId(user.id);
    if (!provider) {
      return [];
    }

    const services = await container.serviceRepository.findByProviderId(provider.id);

    return services.map(service => ({
      id: service.id,
      provider_id: service.providerId,
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      is_active: service.isActive,
      allow_custom_time: service.allowCustomTime,
      created_at: service.createdAt.toISOString(),
      updated_at: service.updatedAt.toISOString(),
    }));
  });
}
