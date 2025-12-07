import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { requireAuth } from '@/shared/lib/api/middleware';
import { container } from '@/infrastructure/di/container';
import { UserResponseDTO } from '@/application/dtos/UserDTO';

export async function GET(request: NextRequest) {
  return handleApiRoute(async () => {
    const user = await requireAuth(request);

    const dbUser = await container.userRepository.findById(user.id);
    if (!dbUser) {
      throw new ApiError(404, 'User not found');
    }

    const userDTO: UserResponseDTO = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      phone: dbUser.phone,
      role: dbUser.role,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString(),
    };

    return userDTO;
  });
}
