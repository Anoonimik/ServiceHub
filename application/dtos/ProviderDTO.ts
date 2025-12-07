export interface CreateProviderDTO {
  businessName?: string;
  description?: string;
}

export interface ProviderResponseDTO {
  id: number;
  userId: number;
  businessName: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}

