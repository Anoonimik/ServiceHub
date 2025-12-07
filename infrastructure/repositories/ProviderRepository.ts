import { IProviderRepository, CreateProviderData, UpdateProviderData } from '@/domain/repositories/IProviderRepository';
import { Provider } from '@/domain/entities/Provider';
import { executeQuery, executeQueryOne, executeInsert } from '@/shared/lib/api/db-helpers';

export class ProviderRepository implements IProviderRepository {
  async findById(id: number): Promise<Provider | null> {
    const result = await executeQueryOne<{
      id: number;
      user_id: number;
      business_name: string | null;
      description: string | null;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM service_providers WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return new Provider(
      result.id,
      result.user_id,
      result.business_name,
      result.description,
      result.is_active,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findByUserId(userId: number): Promise<Provider | null> {
    const result = await executeQueryOne<{
      id: number;
      user_id: number;
      business_name: string | null;
      description: string | null;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM service_providers WHERE user_id = ?',
      [userId]
    );

    if (!result) return null;

    return new Provider(
      result.id,
      result.user_id,
      result.business_name,
      result.description,
      result.is_active,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findActive(): Promise<Provider[]> {
    const results = await executeQuery<{
      id: number;
      user_id: number;
      business_name: string | null;
      description: string | null;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM service_providers WHERE is_active = TRUE ORDER BY created_at DESC',
      []
    );

    return results.map(r => new Provider(
      r.id,
      r.user_id,
      r.business_name,
      r.description,
      r.is_active,
      new Date(r.created_at),
      new Date(r.updated_at)
    ));
  }

  async create(providerData: CreateProviderData): Promise<Provider> {
    const insertId = await executeInsert(
      'INSERT INTO service_providers (user_id, business_name, description) VALUES (?, ?, ?)',
      [providerData.userId, providerData.businessName || null, providerData.description || null]
    );

    const provider = await this.findById(insertId);
    if (!provider) {
      throw new Error('Provider created but could not be retrieved');
    }

    return provider;
  }

  async update(id: number, providerData: Partial<UpdateProviderData>): Promise<Provider> {
    const updates: string[] = [];
    const values: any[] = [];

    if (providerData.businessName !== undefined) {
      updates.push('business_name = ?');
      values.push(providerData.businessName);
    }
    if (providerData.description !== undefined) {
      updates.push('description = ?');
      values.push(providerData.description);
    }
    if (providerData.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(providerData.isActive);
    }

    if (updates.length === 0) {
      return await this.findById(id) as Provider;
    }

    values.push(id);
    await executeInsert(
      `UPDATE service_providers SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const provider = await this.findById(id);
    if (!provider) {
      throw new Error('Provider not found after update');
    }

    return provider;
  }

  async existsByUserId(userId: number): Promise<boolean> {
    const result = await executeQueryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM service_providers WHERE user_id = ?',
      [userId]
    );
    return result ? result.count > 0 : false;
  }
}

