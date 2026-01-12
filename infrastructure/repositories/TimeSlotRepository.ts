import { ITimeSlotRepository, CreateTimeSlotData, UpdateTimeSlotData } from '@/domain/repositories/ITimeSlotRepository';
import { TimeSlot } from '@/domain/entities/TimeSlot';
import { executeQuery, executeQueryOne, executeInsert } from '@/shared/lib/api/db-helpers';

export class TimeSlotRepository implements ITimeSlotRepository {
  async findById(id: number): Promise<TimeSlot | null> {
    const result = await executeQueryOne<{
      id: number;
      service_id: number;
      start_time: Date;
      end_time: Date;
      is_available: boolean;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM time_slots WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return new TimeSlot(
      result.id,
      result.service_id,
      new Date(result.start_time),
      new Date(result.end_time),
      result.is_available,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findByServiceId(serviceId: number, startDate?: Date, endDate?: Date): Promise<TimeSlot[]> {
    let query = 'SELECT * FROM time_slots WHERE service_id = ?';
    const params: any[] = [serviceId];

    if (startDate) {
      query += ' AND start_time >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND end_time <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY start_time ASC';

    const results = await executeQuery<{
      id: number;
      service_id: number;
      start_time: Date;
      end_time: Date;
      is_available: boolean;
      created_at: Date;
      updated_at: Date;
    }>(query, params);

    return results.map(r => new TimeSlot(
      r.id,
      r.service_id,
      new Date(r.start_time),
      new Date(r.end_time),
      r.is_available,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async findAvailableByServiceId(serviceId: number, startDate?: Date, endDate?: Date): Promise<TimeSlot[]> {
    let query = 'SELECT * FROM time_slots WHERE service_id = ? AND is_available = TRUE';
    const params: any[] = [serviceId];

    const now = new Date();
    query += ' AND start_time >= ?';
    params.push(startDate || now);

    if (endDate) {
      query += ' AND end_time <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY start_time ASC';

    const results = await executeQuery<{
      id: number;
      service_id: number;
      start_time: Date;
      end_time: Date;
      is_available: boolean;
      created_at: Date;
      updated_at: Date;
    }>(query, params);

    return results.map(r => new TimeSlot(
      r.id,
      r.service_id,
      new Date(r.start_time),
      new Date(r.end_time),
      r.is_available,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async create(timeSlotData: CreateTimeSlotData): Promise<TimeSlot> {
    const insertId = await executeInsert(
      'INSERT INTO time_slots (service_id, start_time, end_time, is_available) VALUES (?, ?, ?, ?)',
      [
        timeSlotData.serviceId,
        timeSlotData.startTime,
        timeSlotData.endTime,
        timeSlotData.isAvailable !== undefined ? timeSlotData.isAvailable : true
      ]
    );

    const timeSlot = await this.findById(insertId);
    if (!timeSlot) {
      throw new Error('Time slot created but could not be retrieved');
    }

    return timeSlot;
  }

  async update(id: number, timeSlotData: Partial<UpdateTimeSlotData>): Promise<TimeSlot> {
    const updates: string[] = [];
    const values: any[] = [];

    if (timeSlotData.startTime !== undefined) {
      updates.push('start_time = ?');
      values.push(timeSlotData.startTime);
    }
    if (timeSlotData.endTime !== undefined) {
      updates.push('end_time = ?');
      values.push(timeSlotData.endTime);
    }
    if (timeSlotData.isAvailable !== undefined) {
      updates.push('is_available = ?');
      values.push(timeSlotData.isAvailable);
    }

    if (updates.length === 0) {
      return await this.findById(id) as TimeSlot;
    }

    values.push(id);
    await executeInsert(
      `UPDATE time_slots SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const timeSlot = await this.findById(id);
    if (!timeSlot) {
      throw new Error('Time slot not found after update');
    }

    return timeSlot;
  }

  async delete(id: number): Promise<void> {
    await executeInsert('DELETE FROM time_slots WHERE id = ?', [id]);
  }

  async markAsUnavailable(id: number): Promise<void> {
    await executeInsert('UPDATE time_slots SET is_available = FALSE WHERE id = ?', [id]);
  }

  async markAsAvailable(id: number): Promise<void> {
    await executeInsert('UPDATE time_slots SET is_available = TRUE WHERE id = ?', [id]);
  }
}

