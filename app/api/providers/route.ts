import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { validateString } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { executeQuery } from '@/shared/lib/api/db-helpers';
import { ProviderResponseDTO } from '@/application/dtos/ProviderDTO';

export async function GET() {
  return handleApiRoute(async () => {
    const providers = await executeQuery(`
      SELECT 
        sp.*,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM service_providers sp
      INNER JOIN users u ON sp.user_id = u.id
      WHERE sp.is_active = TRUE
      ORDER BY sp.created_at DESC
    `);

    return providers.map((p: any) => ({
      id: p.id,
      userId: p.user_id,
      businessName: p.business_name,
      description: p.description,
      isActive: p.is_active,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      user: {
        id: p.user_id,
        firstName: p.first_name,
        lastName: p.last_name,
        email: p.email,
        phone: p.phone,
      },
    }));
  });
}

export async function POST(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['user', 'provider']);

    const body = await request.json();
    const { business_name, description } = body;

    if (business_name) {
      validateString(business_name, 'business_name', 1, 255);
    }
    if (description) {
      validateString(description, 'description', 1, 2000);
    }

    const provider = await container.createProviderUseCase.execute(user.id, {
      businessName: business_name,
      description,
    });

    const updatedUser = await container.userRepository.findById(user.id);
    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }

    const newToken = container.tokenGenerator.generate({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    const providerDTO: ProviderResponseDTO = {
      id: provider.id,
      userId: provider.userId,
      businessName: provider.businessName,
      description: provider.description,
      isActive: provider.isActive,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString(),
    };

    return {
      provider: providerDTO,
      token: newToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
    };
  });
}
