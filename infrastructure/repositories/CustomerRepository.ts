import { ICustomerRepository, CreateCustomerData, UpdateCustomerData } from '@/domain/repositories/ICustomerRepository';
import { Customer } from '@/domain/entities/Customer';
import { executeQueryOne, executeInsert} from '@/shared/lib/api/db-helpers';

export class CustomerRepository implements ICustomerRepository {
  async findById(id: number): Promise<Customer | null> {
    const result = await executeQueryOne<{
      id: number;
      user_id: number | null;
      first_name: string;
      last_name: string;
      email: string | null;
      phone: string;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return new Customer(
      result.id,
      result.user_id,
      result.first_name,
      result.last_name,
      result.email,
      result.phone,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const result = await executeQueryOne<{
      id: number;
      user_id: number | null;
      first_name: string;
      last_name: string;
      email: string | null;
      phone: string;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM customers WHERE phone = ?',
      [phone]
    );

    if (!result) return null;

    return new Customer(
      result.id,
      result.user_id,
      result.first_name,
      result.last_name,
      result.email,
      result.phone,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async findByUserId(userId: number): Promise<Customer | null> {
    const result = await executeQueryOne<{
      id: number;
      user_id: number | null;
      first_name: string;
      last_name: string;
      email: string | null;
      phone: string;
      created_at: Date;
      updated_at: Date;
    }>(
      'SELECT * FROM customers WHERE user_id = ?',
      [userId]
    );

    if (!result) return null;

    return new Customer(
      result.id,
      result.user_id,
      result.first_name,
      result.last_name,
      result.email,
      result.phone,
      new Date(result.created_at),
      new Date(result.updated_at)
    );
  }

  async create(customerData: CreateCustomerData): Promise<Customer> {
    const insertId = await executeInsert(
      'INSERT INTO customers (user_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)',
      [customerData.userId || null, customerData.firstName, customerData.lastName, customerData.email || null, customerData.phone]
    );

    const customer = await this.findById(insertId);
    if (!customer) {
      throw new Error('Customer created but could not be retrieved');
    }

    return customer;
  }

  async update(id: number, customerData: Partial<UpdateCustomerData>): Promise<Customer> {
    const updates: string[] = [];
    const values: any[] = [];

    if (customerData.firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(customerData.firstName);
    }
    if (customerData.lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(customerData.lastName);
    }
    if (customerData.email !== undefined) {
      updates.push('email = ?');
      values.push(customerData.email);
    }
    if (customerData.phone !== undefined) {
      updates.push('phone = ?');
      values.push(customerData.phone);
    }
    if (customerData.userId !== undefined) {
      updates.push('user_id = ?');
      values.push(customerData.userId);
    }

    if (updates.length === 0) {
      return await this.findById(id) as Customer;
    }

    values.push(id);
    await executeInsert(
      `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const customer = await this.findById(id);
    if (!customer) {
      throw new Error('Customer not found after update');
    }

    return customer;
  }
}

