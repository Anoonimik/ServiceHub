import { IReservationRepository, CreateReservationData, UpdateReservationData } from '@/domain/repositories/IReservationRepository';
import { Reservation, ReservationStatus } from '@/domain/entities/Reservation';
import { executeQuery, executeQueryOne, executeInsert} from '@/shared/lib/api/db-helpers';

export class ReservationRepository implements IReservationRepository {
  async findById(id: number): Promise<Reservation | null> {
    const result = await executeQueryOne<{
      id: number;
      customer_id: number;
      service_id: number;
      user_id: number | null;
      reservation_date: Date;
      status: string;
      notes: string | null;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return new Reservation(
      result.id,
      result.customer_id,
      result.service_id,
      result.user_id,
      new Date(result.reservation_date),
      result.status as ReservationStatus,
      result.notes,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    const results = await executeQuery<{
      id: number;
      customer_id: number;
      service_id: number;
      user_id: number | null;
      reservation_date: Date;
      status: string;
      notes: string | null;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC',
      [userId]
    );

    return results.map(r => new Reservation(
      r.id,
      r.customer_id,
      r.service_id,
      r.user_id,
      new Date(r.reservation_date),
      r.status as ReservationStatus,
      r.notes,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async findByProviderId(providerId: number): Promise<Reservation[]> {
    const results = await executeQuery<{
      id: number;
      customer_id: number;
      service_id: number;
      user_id: number | null;
      reservation_date: Date;
      status: string;
      notes: string | null;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT r.* FROM reservations r
       INNER JOIN services s ON r.service_id = s.id
       WHERE s.provider_id = ?
       ORDER BY r.reservation_date DESC`,
      [providerId]
    );

    return results.map(r => new Reservation(
      r.id,
      r.customer_id,
      r.service_id,
      r.user_id,
      new Date(r.reservation_date),
      r.status as ReservationStatus,
      r.notes,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async findRecent(limit: number = 50): Promise<Reservation[]> {
    const results = await executeQuery<{
      id: number;
      customer_id: number;
      service_id: number;
      user_id: number | null;
      reservation_date: Date;
      status: string;
      notes: string | null;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM reservations ORDER BY reservation_date DESC LIMIT ?',
      [limit]
    );

    return results.map(r => new Reservation(
      r.id,
      r.customer_id,
      r.service_id,
      r.user_id,
      new Date(r.reservation_date),
      r.status as ReservationStatus,
      r.notes,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async create(reservationData: CreateReservationData): Promise<Reservation> {
    const insertId = await executeInsert(
      'INSERT INTO reservations (customer_id, service_id, user_id, reservation_date, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
      [
        reservationData.customerId,
        reservationData.serviceId,
        reservationData.userId || null,
        reservationData.reservationDate,
        reservationData.notes || null,
        reservationData.status || 'pending'
      ]
    );

    const reservation = await this.findById(insertId);
    if (!reservation) {
      throw new Error('Reservation created but could not be retrieved');
    }

    return reservation;
  }

  async update(id: number, reservationData: Partial<UpdateReservationData>): Promise<Reservation> {
    const updates: string[] = [];
    const values: any[] = [];

    if (reservationData.reservationDate !== undefined) {
      updates.push('reservation_date = ?');
      values.push(reservationData.reservationDate);
    }
    if (reservationData.status !== undefined) {
      updates.push('status = ?');
      values.push(reservationData.status);
    }
    if (reservationData.notes !== undefined) {
      updates.push('notes = ?');
      values.push(reservationData.notes);
    }

    if (updates.length === 0) {
      return await this.findById(id) as Reservation;
    }

    values.push(id);
    await executeInsert(
      `UPDATE reservations SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const reservation = await this.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found after update');
    }

    return reservation;
  }

  async delete(id: number): Promise<void> {
    await executeInsert('DELETE FROM reservations WHERE id = ?', [id]);
  }
}

