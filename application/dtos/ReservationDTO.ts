export interface CreateReservationDTO {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  serviceId: number;
  reservationDate: string;
  notes?: string;
}

export interface ReservationResponseDTO {
  id: number;
  reservationDate: string;
  status: string;
  notes: string | null;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string | null;
  customerPhone: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  providerBusinessName?: string;
  providerFirstName?: string;
  providerLastName?: string;
}

