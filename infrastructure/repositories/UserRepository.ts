import { IUserRepository, CreateUserData, UpdateUserData } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import {executeQueryOne, executeInsert } from '@/shared/lib/api/db-helpers';

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const result = await executeQueryOne<{
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone: string | null;
      role: string;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT id, email, first_name, last_name, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return new User(
      result.id,
      result.email,
      result.first_name,
      result.last_name,
      result.phone,
      result.role as 'user' | 'admin' | 'provider',
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await executeQueryOne<{
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone: string | null;
      role: string;
      created_at: Date;
      updated_at: Date;
      password_hash: string;
    }>(
      'SELECT id, email, first_name, last_name, phone, role, created_at, updated_at, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (!result) return null;

    const user = new User(
      result.id,
      result.email,
      result.first_name,
      result.last_name,
      result.phone,
      result.role as 'user' | 'admin' | 'provider',
      new Date(result.created_at),
      new Date(result.updated_at)
    );

    return user;
  }

  async getPasswordHash(userId: number): Promise<string | null> {
    const result = await executeQueryOne<{ password_hash: string }>(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );
    return result?.password_hash || null;
  }

  async create(userData: CreateUserData): Promise<User> {
    const insertId = await executeInsert(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
      [userData.email, userData.passwordHash, userData.firstName, userData.lastName, userData.phone || null]
    );

    const user = await this.findById(insertId);
    if (!user) {
      throw new Error('User created but could not be retrieved');
    }

    return user;
  }

  async update(id: number, userData: Partial<UpdateUserData>): Promise<User> {
    const updates: string[] = [];
    const values: any[] = [];

    if (userData.email !== undefined) {
      updates.push('email = ?');
      values.push(userData.email);
    }
    if (userData.firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(userData.firstName);
    }
    if (userData.lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(userData.lastName);
    }
    if (userData.phone !== undefined) {
      updates.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.role !== undefined) {
      updates.push('role = ?');
      values.push(userData.role);
    }

    if (updates.length === 0) {
      return await this.findById(id) as User;
    }

    values.push(id);
    await executeInsert(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found after update');
    }

    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await executeQueryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email]
    );
    return result ? result.count > 0 : false;
  }
}

