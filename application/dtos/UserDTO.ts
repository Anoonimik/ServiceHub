export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'user' | 'admin' | 'provider';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}

