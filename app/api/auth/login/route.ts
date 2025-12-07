import { NextRequest } from 'next/server';
import { handleApiRoute, ApiError } from '@/shared/lib/api/response';
import { validateRequired, validateEmail, validatePassword } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { UserResponseDTO } from '@/application/dtos/UserDTO';

export async function POST(request: NextRequest) {
  return handleApiRoute(async () => {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    validateRequired(email, 'email');
    validateRequired(password, 'password');
    validateEmail(email);
    validatePassword(password);

    const user = await container.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const passwordHash = await (container.userRepository as UserRepository).getPasswordHash(user.id);
    if (!passwordHash) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isValid = await container.passwordVerifier.verify(password, passwordHash);
    if (!isValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = container.tokenGenerator.generate(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      rememberMe === true
    );

    const userDTO: UserResponseDTO = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      user: userDTO,
      token,
    };
  });
}
