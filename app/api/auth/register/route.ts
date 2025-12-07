import { NextRequest } from 'next/server';
import { handleApiRoute } from '@/shared/lib/api/response';
import { validateRequired, validateEmail, validatePassword, validateString, validatePhone } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { UserResponseDTO } from '@/application/dtos/UserDTO';

export async function POST(request: NextRequest) {
  return handleApiRoute(async () => {
    const body = await request.json();
    const { email, password, first_name, last_name, phone } = body;

    validateRequired(email, 'email');
    validateRequired(password, 'password');
    validateRequired(first_name, 'first_name');
    validateRequired(last_name, 'last_name');
    validateEmail(email);
    validatePassword(password);
    validateString(first_name, 'first_name', 1, 100);
    validateString(last_name, 'last_name', 1, 100);
    if (phone) validatePhone(phone);

    const { user, token } = await container.registerUserUseCase.execute({
      email,
      password,
      firstName: first_name,
      lastName: last_name,
      phone,
    });

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
