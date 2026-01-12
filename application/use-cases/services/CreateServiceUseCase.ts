import { IServiceRepository, CreateServiceData } from '@/domain/repositories/IServiceRepository';
import { IProviderRepository } from '@/domain/repositories/IProviderRepository';
import { CreateServiceDTO } from '@/application/dtos/ServiceDTO';
import { Service } from '@/domain/entities/Service';
import { ApiError } from '@/shared/lib/api/response';

export class CreateServiceUseCase {
  constructor(
    private serviceRepository: IServiceRepository,
    private providerRepository: IProviderRepository
  ) {}

  /**
   * Execute service creation use case
   * @param userId - User ID creating the service
   * @param dto - Service creation data
   * @returns Created service entity
   */
  async execute(userId: number, dto: CreateServiceDTO): Promise<Service> {
    const provider = await this.providerRepository.findByUserId(userId);
    if (!provider) {
      throw new ApiError(403, 'User is not a service provider');
    }

    const serviceData: CreateServiceData = {
      providerId: provider.id,
      name: dto.name,
      description: dto.description || null,
      duration: dto.duration,
      price: dto.price,
      allowCustomTime: dto.allowCustomTime !== undefined ? dto.allowCustomTime : true,
    };

    return await this.serviceRepository.create(serviceData);
  }
}

