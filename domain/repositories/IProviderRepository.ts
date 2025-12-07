import { Provider } from '../entities/Provider';

export interface IProviderRepository {
  findById(id: number): Promise<Provider | null>;
  findByUserId(userId: number): Promise<Provider | null>;
  findActive(): Promise<Provider[]>;
  create(providerData: CreateProviderData): Promise<Provider>;
  update(id: number, providerData: Partial<UpdateProviderData>): Promise<Provider>;
  existsByUserId(userId: number): Promise<boolean>;
}

export interface CreateProviderData {
  userId: number;
  businessName?: string | null;
  description?: string | null;
}

export interface UpdateProviderData {
  businessName?: string | null;
  description?: string | null;
  isActive?: boolean;
}

