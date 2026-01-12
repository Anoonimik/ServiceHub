import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { validateDate } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { TimeSlotResponseDTO } from '@/application/dtos/TimeSlotDTO';

/**
 * Update time slot (provider only)
 * @param request - Next.js request object
 * @param params - Route parameters containing time slot ID
 * @returns Updated time slot DTO
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const resolvedParams = await Promise.resolve(params);
    const slotId = parseInt(resolvedParams.id);
    if (isNaN(slotId)) {
      throw new ApiError(400, 'Invalid time slot ID');
    }

    const timeSlot = await container.timeSlotRepository.findById(slotId);
    if (!timeSlot) {
      throw new ApiError(404, 'Time slot not found');
    }

    const service = await container.serviceRepository.findById(timeSlot.serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    const provider = await container.providerRepository.findByUserId(user.id);
    if (!provider || service.providerId !== provider.id) {
      throw new ApiError(403, 'You do not have permission to update this time slot');
    }

    const body = await request.json();
    const { startTime, endTime, isAvailable } = body;

    const updateData: any = {};
    if (startTime !== undefined) {
      validateDate(startTime, 'startTime');
      updateData.startTime = new Date(startTime);
    }
    if (endTime !== undefined) {
      validateDate(endTime, 'endTime');
      updateData.endTime = new Date(endTime);
    }
    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable;
    }

    if (updateData.startTime && updateData.endTime) {
      if (updateData.startTime >= updateData.endTime) {
        throw new ApiError(400, 'Start time must be before end time');
      }
    }

    const updatedSlot = await container.timeSlotRepository.update(slotId, updateData);

    const timeSlotDTO: TimeSlotResponseDTO = {
      id: updatedSlot.id,
      serviceId: updatedSlot.serviceId,
      startTime: updatedSlot.startTime.toISOString(),
      endTime: updatedSlot.endTime.toISOString(),
      isAvailable: updatedSlot.isAvailable,
      createdAt: updatedSlot.createdAt.toISOString(),
      updatedAt: updatedSlot.updatedAt.toISOString(),
    };

    return timeSlotDTO;
  });
}

/**
 * Delete time slot (provider only)
 * @param request - Next.js request object
 * @param params - Route parameters containing time slot ID
 * @returns Success message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const resolvedParams = await Promise.resolve(params);
    const slotId = parseInt(resolvedParams.id);
    if (isNaN(slotId)) {
      throw new ApiError(400, 'Invalid time slot ID');
    }

    const timeSlot = await container.timeSlotRepository.findById(slotId);
    if (!timeSlot) {
      throw new ApiError(404, 'Time slot not found');
    }

    const service = await container.serviceRepository.findById(timeSlot.serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    const provider = await container.providerRepository.findByUserId(user.id);
    if (!provider || service.providerId !== provider.id) {
      throw new ApiError(403, 'You do not have permission to delete this time slot');
    }

    await container.timeSlotRepository.delete(slotId);

    return { message: 'Time slot deleted successfully' };
  });
}

