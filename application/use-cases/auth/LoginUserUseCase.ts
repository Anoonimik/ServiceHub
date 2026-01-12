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

  /**
   * Execute user login use case
   * @param dto - User login credentials
   * @returns Authenticated user and token
   */
  async execute(dto: LoginUserDTO): Promise<{ user: any; token: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = this.tokenGenerator.generate({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}

