import { NextRequest } from 'next/server';
import { handleApiRoute } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { validateRequired, validateString, validateNumber } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { executeQuery } from '@/shared/lib/api/db-helpers';
import { ServiceResponseDTO } from '@/application/dtos/ServiceDTO';

export async function GET() {
  return handleApiRoute(async () => {
    const services = await executeQuery(`
      SELECT 
        s.*,
        sp.business_name,
        sp.user_id as provider_user_id,
        u.first_name as provider_first_name,
        u.last_name as provider_last_name
      FROM services s
      INNER JOIN service_providers sp ON s.provider_id = sp.id
      INNER JOIN users u ON sp.user_id = u.id
      WHERE s.is_active = TRUE AND sp.is_active = TRUE
      ORDER BY s.created_at DESC
    `);
    
    return services;
  });
}

export async function POST(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const body = await request.json();
    const { name, description, duration, price } = body;

    validateRequired(name, 'name');
    validateRequired(duration, 'duration');
    validateRequired(price, 'price');
    validateString(name, 'name', 1, 255);
    validateNumber(duration, 'duration', 1, 1440);
    validateNumber(price, 'price', 0, 999999.99);

    const service = await container.createServiceUseCase.execute(user.id, {
      name,
      description,
      duration,
      price,
      allowCustomTime: body.allow_custom_time !== undefined ? body.allow_custom_time : true,
    });

    return {
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
    };
  });
}
