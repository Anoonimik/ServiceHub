import { IProviderRepository, CreateProviderData } from '@/domain/repositories/IProviderRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { CreateProviderDTO } from '@/application/dtos/ProviderDTO';
import { Provider } from '@/domain/entities/Provider';
import { ApiError } from '@/shared/lib/api/response';

export class CreateProviderUseCase {
  constructor(
    private providerRepository: IProviderRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(userId: number, dto: CreateProviderDTO): Promise<Provider> {
    // Check if user is already a provider
    const exists = await this.providerRepository.existsByUserId(userId);
    if (exists) {
      throw new ApiError(400, 'User is already a service provider');
    }

    // Create provider
    const providerData: CreateProviderData = {
      userId,
      businessName: dto.businessName || null,
      description: dto.description || null,
    };

    const provider = await this.providerRepository.create(providerData);

    // Update user role to provider
    await this.userRepository.update(userId, { role: 'provider' });

    return provider;
  }
}

