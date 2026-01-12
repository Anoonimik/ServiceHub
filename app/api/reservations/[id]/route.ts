import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { validateString } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { executeQuery } from '@/shared/lib/api/db-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleApiRoute(async () => {
    const { id } = await Promise.resolve(params);
    const reservationId = parseInt(id, 10);

    if (isNaN(reservationId)) {
      throw new ApiError(400, 'Invalid reservation ID');
    }

    const reservation = await executeQuery(`
      SELECT 
        r.id,
        r.reservation_date,
        r.status,
        r.notes,
        r.created_at,
        r.updated_at,
        r.user_id,
        c.id as customer_id,
        c.first_name as customer_first_name,
        c.last_name as customer_last_name,
        c.email as customer_email,
        c.phone as customer_phone,
        s.id as service_id,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        s.description as service_description,
        sp.id as provider_id,
        sp.business_name as provider_business_name,
        u.first_name as provider_first_name,
        u.last_name as provider_last_name,
        u.email as provider_email
      FROM reservations r
      INNER JOIN customers c ON r.customer_id = c.id
      INNER JOIN services s ON r.service_id = s.id
      LEFT JOIN service_providers sp ON s.provider_id = sp.id
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE r.id = ?
    `, [reservationId]);

    if (!reservation || reservation.length === 0) {
      throw new ApiError(404, 'Reservation not found');
    }

    return reservation[0];
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    const { id } = await Promise.resolve(params);
    const reservationId = parseInt(id, 10);

    if (isNaN(reservationId)) {
      throw new ApiError(400, 'Invalid reservation ID');
    }

    const reservation = await container.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    let hasPermission = false;

    if (reservation.userId === user.id) {
      hasPermission = true;
    } else {
      const service = await container.serviceRepository.findById(reservation.serviceId);
      if (service) {
        const provider = await container.providerRepository.findById(service.providerId);
        if (provider && provider.userId === user.id) {
          hasPermission = true;
        }
      }
    }

    if (!hasPermission) {
      throw new ApiError(403, 'You do not have permission to update this reservation');
    }

    const body = await request.json();
    const { status, notes } = body;

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      if (reservation.userId === user.id && status !== 'cancelled') {
        throw new ApiError(403, 'Customers can only cancel reservations');
      }
    }

    if (notes !== undefined) {
      validateString(notes, 'notes', 0, 2000);
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes || null;

    const updatedReservation = await container.reservationRepository.update(reservationId, updateData);

    const fullReservation = await executeQuery(`
      SELECT 
        r.id,
        r.reservation_date,
        r.status,
        r.notes,
        r.created_at,
        r.updated_at,
        c.first_name as customer_first_name,
        c.last_name as customer_last_name,
        c.email as customer_email,
        c.phone as customer_phone,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        sp.business_name as provider_business_name
      FROM reservations r
      INNER JOIN customers c ON r.customer_id = c.id
      INNER JOIN services s ON r.service_id = s.id
      LEFT JOIN service_providers sp ON s.provider_id = sp.id
      WHERE r.id = ?
    `, [reservationId]);

    return fullReservation[0];
  });
}

