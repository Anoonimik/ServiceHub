import { IUserRepository, CreateUserData } from '@/domain/repositories/IUserRepository';
import { RegisterUserDTO } from '@/application/dtos/UserDTO';
import { User } from '@/domain/entities/User';
import { IPasswordHasher } from '@/application/interfaces/IPasswordHasher';
import { ITokenGenerator } from '@/application/interfaces/ITokenGenerator';
import { ApiError } from '@/shared/lib/api/response';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenGenerator: ITokenGenerator
  ) {}

  /**
   * Execute user registration use case
   * @param dto - User registration data
   * @returns Created user and authentication token
   */
  async execute(dto: RegisterUserDTO): Promise<{ user: User; token: string }> {
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ApiError(400, 'User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const userData: CreateUserData = {
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone || null,
    };

    const user = await this.userRepository.create(userData);

    const token = this.tokenGenerator.generate({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}

