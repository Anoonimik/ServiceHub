export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reservation {
  id: number;
  reservation_date: string;
  status: ReservationStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  customer_id?: number;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service_id?: number;
  service_name?: string;
  service_price?: number;
  service_duration?: number;
  service_description?: string;
  provider_id?: number;
  provider_business_name?: string;
  provider_first_name?: string;
  provider_last_name?: string;
  provider_email?: string;
  user_id?: number | null;
}

export interface UpdateReservationDto {
  status?: ReservationStatus;
  notes?: string | null;
}

