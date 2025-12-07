import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { validateString, validateNumber } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { ServiceResponseDTO } from '@/application/dtos/ServiceDTO';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const resolvedParams = await Promise.resolve(params);
    const serviceId = parseInt(resolvedParams.id);
    if (isNaN(serviceId)) {
      throw new ApiError(400, 'Invalid service ID');
    }

    const service = await container.serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    const provider = await container.providerRepository.findByUserId(user.id);
    if (!provider || service.providerId !== provider.id) {
      throw new ApiError(403, 'You do not have permission to update this service');
    }

    const body = await request.json();
    const { name, description, duration, price, is_active } = body;

    const updateData: any = {};
    if (name !== undefined) {
      validateString(name, 'name', 1, 255);
      updateData.name = name;
    }
    if (description !== undefined) {
      validateString(description, 'description', 0, 2000);
      updateData.description = description || null;
    }
    if (duration !== undefined) {
      validateNumber(duration, 'duration', 1, 1440);
      updateData.duration = duration;
    }
    if (price !== undefined) {
      validateNumber(price, 'price', 0, 999999.99);
      updateData.price = price;
    }
    if (is_active !== undefined) {
      updateData.isActive = is_active;
    }

    const updatedService = await container.serviceRepository.update(serviceId, updateData);

    const serviceDTO: ServiceResponseDTO = {
      id: updatedService.id,
      providerId: updatedService.providerId,
      name: updatedService.name,
      description: updatedService.description,
      duration: updatedService.duration,
      price: updatedService.price,
      isActive: updatedService.isActive,
      createdAt: updatedService.createdAt.toISOString(),
      updatedAt: updatedService.updatedAt.toISOString(),
    };

    return serviceDTO;
  });
}

