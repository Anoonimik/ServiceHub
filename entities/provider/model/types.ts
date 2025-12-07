export interface ServiceProvider {
  id: number;
  user_id: number;
  business_name?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface ServiceProviderCreateDto {
  business_name?: string;
  description?: string;
}

