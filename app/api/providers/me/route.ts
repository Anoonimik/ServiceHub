import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth, requireRole } from '@/shared/lib/api/middleware';
import { validateString } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { ProviderResponseDTO } from '@/application/dtos/ProviderDTO';

export async function GET(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const provider = await container.providerRepository.findByUserId(user.id);
    if (!provider) {
      throw new ApiError(404, 'Provider profile not found');
    }

    const providerDTO: ProviderResponseDTO = {
      id: provider.id,
      userId: provider.userId,
      businessName: provider.businessName,
      description: provider.description,
      isActive: provider.isActive,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString(),
    };

    return providerDTO;
  });
}

export async function PATCH(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);
    requireRole(user, ['provider']);

    const provider = await container.providerRepository.findByUserId(user.id);
    if (!provider) {
      throw new ApiError(404, 'Provider profile not found');
    }

    const body = await request.json();
    const { business_name, description, is_active } = body;

    if (business_name !== undefined) {
      validateString(business_name, 'business_name', 0, 255);
    }
    if (description !== undefined) {
      validateString(description, 'description', 0, 2000);
    }

    const updatedProvider = await container.providerRepository.update(provider.id, {
      businessName: business_name || null,
      description: description || null,
      isActive: is_active !== undefined ? is_active : undefined,
    });

    const providerDTO: ProviderResponseDTO = {
      id: updatedProvider.id,
      userId: updatedProvider.userId,
      businessName: updatedProvider.businessName,
      description: updatedProvider.description,
      isActive: updatedProvider.isActive,
      createdAt: updatedProvider.createdAt.toISOString(),
      updatedAt: updatedProvider.updatedAt.toISOString(),
    };

    return providerDTO;
  });
}
