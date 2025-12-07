import { Customer } from '../entities/Customer';

export interface ICustomerRepository {
  findById(id: number): Promise<Customer | null>;
  findByPhone(phone: string): Promise<Customer | null>;
  findByUserId(userId: number): Promise<Customer | null>;
  create(customerData: CreateCustomerData): Promise<Customer>;
  update(id: number, customerData: Partial<UpdateCustomerData>): Promise<Customer>;
}

export interface CreateCustomerData {
  userId?: number | null;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
}

export interface UpdateCustomerData {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string;
  userId?: number | null;
}

