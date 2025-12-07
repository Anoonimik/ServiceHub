export interface Service {
  id: number;
  provider_id: number;
  name: string;
  description?: string;
  duration: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  provider?: {
    id: number;
    business_name?: string;
    user?: {
      first_name: string;
      last_name: string;
    };
  };
}

export interface ServiceCreateDto {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface ServiceUpdateDto {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  is_active?: boolean;
}

