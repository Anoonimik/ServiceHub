import { Reservation } from '../entities/Reservation';

export interface IReservationRepository {
  findById(id: number): Promise<Reservation | null>;
  findByUserId(userId: number): Promise<Reservation[]>;
  findByProviderId(providerId: number): Promise<Reservation[]>;
  findRecent(limit?: number): Promise<Reservation[]>;
  create(reservationData: CreateReservationData): Promise<Reservation>;
  update(id: number, reservationData: Partial<UpdateReservationData>): Promise<Reservation>;
  delete(id: number): Promise<void>;
}

export interface CreateReservationData {
  customerId: number;
  serviceId: number;
  userId?: number | null;
  reservationDate: Date;
  notes?: string | null;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface UpdateReservationData {
  reservationDate?: Date;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string | null;
}

