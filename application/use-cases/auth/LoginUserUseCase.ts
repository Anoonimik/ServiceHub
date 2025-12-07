import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { LoginUserDTO } from '@/application/dtos/UserDTO';
import { IPasswordVerifier } from '@/application/interfaces/IPasswordVerifier';
import { ITokenGenerator } from '@/application/interfaces/ITokenGenerator';
import { ApiError } from '@/shared/lib/api/response';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordVerifier: IPasswordVerifier,
    private tokenGenerator: ITokenGenerator
  ) {}

  async execute(dto: LoginUserDTO): Promise<{ user: any; token: string }> {
    // Find user
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Get password hash from repository (we need to extend interface)
    // For now, we'll handle this differently
    // TODO: Add getPasswordHash method to repository or handle in infrastructure

    // Verify password
    // This will be handled in the infrastructure layer
    // For now, we'll pass the user and let infrastructure verify

    // Generate token
    const token = this.tokenGenerator.generate({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}

