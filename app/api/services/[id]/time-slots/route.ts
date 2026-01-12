import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole, optionalAuth } from '@/shared/lib/api/middleware';
import { validateRequired, validateDate } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { TimeSlotResponseDTO, CreateTimeSlotDTO } from '@/application/dtos/TimeSlotDTO';
import { executeQuery } from '@/shared/lib/api/db-helpers';

/**
 * Get available time slots for a service (public or authenticated)
 * @param request - Next.js request object
 * @param params - Route parameters containing service ID
 * @returns Array of time slots with booking status
 */
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

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const timeSlots = await container.timeSlotRepository.findAvailableByServiceId(
      serviceId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    const slotIds = timeSlots.map(slot => slot.id);
    let bookedSlotIds: number[] = [];

    if (slotIds.length > 0) {
      const placeholders = slotIds.map(() => '?').join(',');
      const reservations = await executeQuery(`
        SELECT DISTINCT ts.id as slot_id
        FROM time_slots ts
        INNER JOIN reservations r ON 
          r.reservation_date >= ts.start_time 
          AND r.reservation_date < ts.end_time
          AND r.service_id = ts.service_id
        WHERE ts.id IN (${placeholders})
          AND r.status IN ('pending', 'confirmed')
      `, [...slotIds]);

      bookedSlotIds = reservations.map((r: any) => r.slot_id);
    }

    const slotsWithBookingStatus: TimeSlotResponseDTO[] = timeSlots.map(slot => ({
      id: slot.id,
      serviceId: slot.serviceId,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString(),
      isAvailable: slot.isAvailable,
      createdAt: slot.createdAt.toISOString(),
      updatedAt: slot.updatedAt.toISOString(),
      isBooked: bookedSlotIds.includes(slot.id),
    }));

    return slotsWithBookingStatus;
  });
}

/**
 * Create time slot (provider only)
 * @param request - Next.js request object
 * @param params - Route parameters containing service ID
 * @returns Created time slot DTO
 */
export async function POST(
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
      throw new ApiError(403, 'You do not have permission to create time slots for this service');
    }

    const body: CreateTimeSlotDTO = await request.json();
    const { startTime, endTime, isAvailable } = body;

    validateRequired(startTime, 'startTime');
    validateRequired(endTime, 'endTime');
    validateDate(startTime, 'startTime');
    validateDate(endTime, 'endTime');

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new ApiError(400, 'Start time must be before end time');
    }

    if (start < new Date()) {
      throw new ApiError(400, 'Cannot create time slots in the past');
    }

    const timeSlot = await container.timeSlotRepository.create({
      serviceId,
      startTime: start,
      endTime: end,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    const timeSlotDTO: TimeSlotResponseDTO = {
      id: timeSlot.id,
      serviceId: timeSlot.serviceId,
      startTime: timeSlot.startTime.toISOString(),
      endTime: timeSlot.endTime.toISOString(),
      isAvailable: timeSlot.isAvailable,
      createdAt: timeSlot.createdAt.toISOString(),
      updatedAt: timeSlot.updatedAt.toISOString(),
    };

    return timeSlotDTO;
  });
}

