export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export class Reservation {
  constructor(
    public readonly id: number,
    public readonly customerId: number,
    public readonly serviceId: number,
    public readonly userId: number | null,
    public readonly reservationDate: Date,
    public readonly status: ReservationStatus,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  canBeCancelled(): boolean {
    return this.status === 'pending' || this.status === 'confirmed';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }
}

