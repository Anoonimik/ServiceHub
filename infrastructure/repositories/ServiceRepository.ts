import { IServiceRepository, CreateServiceData, UpdateServiceData } from '@/domain/repositories/IServiceRepository';
import { Service } from '@/domain/entities/Service';
import { executeQuery, executeQueryOne, executeInsert } from '@/shared/lib/api/db-helpers';

export class ServiceRepository implements IServiceRepository {
  async findById(id: number): Promise<Service | null> {
    const result = await executeQueryOne<{
      id: number;
      provider_id: number;
      name: string;
      description: string | null;
      duration: number;
      price: number;
      is_active: boolean;
      allow_custom_time: boolean;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return new Service(
      result.id,
      result.provider_id,
      result.name,
      result.description,
      result.duration,
      result.price,
      result.is_active,
      result.allow_custom_time ?? true,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findByProviderId(providerId: number): Promise<Service[]> {
    const results = await executeQuery<{
      id: number;
      provider_id: number;
      name: string;
      description: string | null;
      duration: number;
      price: number;
      is_active: boolean;
      allow_custom_time: boolean;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM services WHERE provider_id = ? ORDER BY created_at DESC',
      [providerId]
    );

    return results.map(r => new Service(
      r.id,
      r.provider_id,
      r.name,
      r.description,
      r.duration,
      r.price,
      r.is_active,
      r.allow_custom_time ?? true,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async findActive(): Promise<Service[]> {
    const results = await executeQuery<{
      id: number;
      provider_id: number;
      name: string;
      description: string | null;
      duration: number;
      price: number;
      is_active: boolean;
      allow_custom_time: boolean;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM services WHERE is_active = TRUE ORDER BY created_at DESC',
      []
    );

    return results.map(r => new Service(
      r.id,
      r.provider_id,
      r.name,
      r.description,
      r.duration,
      r.price,
      r.is_active,
      r.allow_custom_time ?? true,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async create(serviceData: CreateServiceData): Promise<Service> {
    const allowCustomTime = serviceData.allowCustomTime !== undefined ? serviceData.allowCustomTime : true;
    const insertId = await executeInsert(
      'INSERT INTO services (provider_id, name, description, duration, price, allow_custom_time) VALUES (?, ?, ?, ?, ?, ?)',
      [serviceData.providerId, serviceData.name, serviceData.description || null, serviceData.duration, serviceData.price, allowCustomTime]
    );

    const service = await this.findById(insertId);
    if (!service) {
      throw new Error('Service created but could not be retrieved');
    }

    return service;
  }

  async update(id: number, serviceData: Partial<UpdateServiceData>): Promise<Service> {
    const updates: string[] = [];
    const values: any[] = [];

    if (serviceData.name !== undefined) {
      updates.push('name = ?');
      values.push(serviceData.name);
    }
    if (serviceData.description !== undefined) {
      updates.push('description = ?');
      values.push(serviceData.description);
    }
    if (serviceData.duration !== undefined) {
      updates.push('duration = ?');
      values.push(serviceData.duration);
    }
    if (serviceData.price !== undefined) {
      updates.push('price = ?');
      values.push(serviceData.price);
    }
    if (serviceData.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(serviceData.isActive);
    }
    if (serviceData.allowCustomTime !== undefined) {
      updates.push('allow_custom_time = ?');
      values.push(serviceData.allowCustomTime);
    }

    if (updates.length === 0) {
      return await this.findById(id) as Service;
    }

    values.push(id);
    await executeInsert(
      `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const service = await this.findById(id);
    if (!service) {
      throw new Error('Service not found after update');
    }

    return service;
  }

  async delete(id: number): Promise<void> {
    await executeInsert('DELETE FROM services WHERE id = ?', [id]);
  }
}

