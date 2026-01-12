import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { executeQuery } from '@/shared/lib/api/db-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleApiRoute(async () => {
    const resolvedParams = await Promise.resolve(params);
    const providerId = parseInt(resolvedParams.id);
    
    if (isNaN(providerId)) {
      throw new ApiError(400, 'Invalid provider ID');
    }

    const services = await executeQuery(`
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
        u.last_name as provider_last_name
      FROM services s
      INNER JOIN service_providers sp ON s.provider_id = sp.id
      INNER JOIN users u ON sp.user_id = u.id
      WHERE s.provider_id = ? AND s.is_active = TRUE
      ORDER BY s.created_at DESC
    `, [providerId]);

    return services;
  });
}

