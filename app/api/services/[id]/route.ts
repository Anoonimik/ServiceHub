import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { validateString, validateNumber } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { ServiceResponseDTO } from '@/application/dtos/ServiceDTO';
import { executeQuery } from '@/shared/lib/api/db-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleApiRoute(async () => {
    const resolvedParams = await Promise.resolve(params);
    const serviceId = parseInt(resolvedParams.id);
    if (isNaN(serviceId)) {
      throw new ApiError(400, 'Invalid service ID');
    }

    const service = await executeQuery(`
      SELECT 
        s.id,
        s.provider_id,
        s.name,
        s.description,
        s.duration,
        s.price,
        s.is_active,
        s.allow_custom_time,
        s.created_at,
        s.updated_at,
        sp.business_name as provider_business_name,
        u.first_name as provider_first_name,
        u.last_name as provider_last_name,
        u.email as provider_email
      FROM services s
      LEFT JOIN service_providers sp ON s.provider_id = sp.id
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE s.id = ?
    `, [serviceId]);

    if (!service || service.length === 0) {
      throw new ApiError(404, 'Service not found');
    }

    return service[0];
  });
}

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
    const { name, description, duration, price, is_active, allow_custom_time } = body;

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
    if (allow_custom_time !== undefined) {
      updateData.allowCustomTime = allow_custom_time;
    }

    const updatedService = await container.serviceRepository.update(serviceId, updateData);

    return {
      id: updatedService.id,
      provider_id: updatedService.providerId,
      name: updatedService.name,
      description: updatedService.description,
      duration: updatedService.duration,
      price: updatedService.price,
      is_active: updatedService.isActive,
      allow_custom_time: updatedService.allowCustomTime,
      created_at: updatedService.createdAt.toISOString(),
      updated_at: updatedService.updatedAt.toISOString(),
    };
  });
}

export async function DELETE(
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
      throw new ApiError(403, 'You do not have permission to delete this service');
    }

    const reservations = await container.reservationRepository.findByProviderId(provider.id);
    const serviceReservations = reservations.filter(r => r.serviceId === serviceId);
    const activeReservations = serviceReservations.filter(
      r => r.status === 'pending' || r.status === 'confirmed'
    );

    if (activeReservations.length > 0) {
      throw new ApiError(400, 'Cannot delete service with active reservations. Please cancel or complete them first.');
    }

    await container.serviceRepository.delete(serviceId);

    return { message: 'Service deleted successfully' };
  });
}

