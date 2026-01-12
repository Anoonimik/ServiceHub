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

  /**
   * Execute provider creation use case
   * @param userId - User ID to create provider for
   * @param dto - Provider creation data
   * @returns Created provider entity
   */
  async execute(userId: number, dto: CreateProviderDTO): Promise<Provider> {
    const exists = await this.providerRepository.existsByUserId(userId);
    if (exists) {
      throw new ApiError(400, 'User is already a service provider');
    }

    const providerData: CreateProviderData = {
      userId,
      businessName: dto.businessName || null,
      description: dto.description || null,
    };

    const provider = await this.providerRepository.create(providerData);

    await this.userRepository.update(userId, { role: 'provider' });

    return provider;
  }
}

