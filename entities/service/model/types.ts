export interface Service {
  id: number;
  provider_id: number;
  name: string;
  description?: string;
  duration: number;
  price: number;
  is_active: boolean;
  allow_custom_time?: boolean;
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
  allow_custom_time?: boolean;
}

export interface ServiceUpdateDto {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  is_active?: boolean;
  allow_custom_time?: boolean;
}

/**
 * Extended service type with provider information
 * Used when fetching service details with joined provider data
 */
export interface ServiceWithProvider extends Service {
  provider_business_name?: string;
  provider_first_name?: string;
  provider_last_name?: string;
  provider_email?: string;
}

