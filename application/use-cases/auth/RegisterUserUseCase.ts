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

  async execute(dto: RegisterUserDTO): Promise<{ user: User; token: string }> {
    // Check if user exists
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ApiError(400, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.passwordHasher.hash(dto.password);

    // Create user
    const userData: CreateUserData = {
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone || null,
    };

    const user = await this.userRepository.create(userData);

    // Generate token
    const token = this.tokenGenerator.generate({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}

