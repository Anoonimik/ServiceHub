import { Service } from '../entities/Service';

export interface IServiceRepository {
  findById(id: number): Promise<Service | null>;
  findByProviderId(providerId: number): Promise<Service[]>;
  findActive(): Promise<Service[]>;
  create(serviceData: CreateServiceData): Promise<Service>;
  update(id: number, serviceData: Partial<UpdateServiceData>): Promise<Service>;
  delete(id: number): Promise<void>;
}

export interface CreateServiceData {
  providerId: number;
  name: string;
  description?: string | null;
  duration: number;
  price: number;
  allowCustomTime?: boolean;
}

export interface UpdateServiceData {
  name?: string;
  description?: string | null;
  duration?: number;
  price?: number;
  isActive?: boolean;
  allowCustomTime?: boolean;
}

