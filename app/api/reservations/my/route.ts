import { NextRequest } from 'next/server';
import { handleApiRoute } from '@/shared/lib/api/response';
import { requireAuth } from '@/shared/lib/api/middleware';
import { executeQuery } from '@/shared/lib/api/db-helpers';

export async function GET(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);

    const reservationsWithDetails = await executeQuery(`
      SELECT 
        r.id,
        r.reservation_date,
        r.status,
        r.notes,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        sp.business_name as provider_business_name,
        u.first_name as provider_first_name,
        u.last_name as provider_last_name
      FROM reservations r
      INNER JOIN services s ON r.service_id = s.id
      LEFT JOIN service_providers sp ON s.provider_id = sp.id
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE r.user_id = ?
      ORDER BY r.reservation_date DESC
    `, [user.id]);

    return reservationsWithDetails;
  });
}
