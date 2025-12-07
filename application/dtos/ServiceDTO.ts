export interface CreateServiceDTO {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface ServiceResponseDTO {
  id: number;
  providerId: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  businessName?: string;
  providerFirstName?: string;
  providerLastName?: string;
}

