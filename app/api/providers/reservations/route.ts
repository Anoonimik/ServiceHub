import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { container } from '@/infrastructure/di/container';
import { executeQuery } from '@/shared/lib/api/db-helpers';

export async function GET(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const provider = await container.providerRepository.findByUserId(user.id);
    if (!provider) {
      throw new ApiError(404, 'Provider profile not found');
    }

    const reservations = await executeQuery(`
      SELECT 
        r.id,
        r.reservation_date,
        r.status,
        r.notes,
        r.created_at,
        r.updated_at,
        c.id as customer_id,
        c.first_name as customer_first_name,
        c.last_name as customer_last_name,
        c.email as customer_email,
        c.phone as customer_phone,
        s.id as service_id,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        s.description as service_description
      FROM reservations r
      INNER JOIN customers c ON r.customer_id = c.id
      INNER JOIN services s ON r.service_id = s.id
      WHERE s.provider_id = ?
      ORDER BY r.reservation_date DESC
    `, [provider.id]);

    return reservations;
  });
}

