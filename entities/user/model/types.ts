export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: 'user' | 'admin' | 'provider';
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

