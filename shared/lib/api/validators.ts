import { ApiError } from './response';

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Invalid email format');
  }
}

export function validatePassword(password: string): void {
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long');
  }
}

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ApiError(400, `${fieldName} is required`);
  }
}

export function validateString(value: any, fieldName: string, minLength?: number, maxLength?: number): void {
  if (typeof value !== 'string') {
    throw new ApiError(400, `${fieldName} must be a string`);
  }
  if (minLength !== undefined && value.length < minLength) {
    throw new ApiError(400, `${fieldName} must be at least ${minLength} characters long`);
  }
  if (maxLength !== undefined && value.length > maxLength) {
    throw new ApiError(400, `${fieldName} must be at most ${maxLength} characters long`);
  }
}

export function validateNumber(value: any, fieldName: string, min?: number, max?: number): void {
  const num = Number(value);
  if (isNaN(num)) {
    throw new ApiError(400, `${fieldName} must be a number`);
  }
  if (min !== undefined && num < min) {
    throw new ApiError(400, `${fieldName} must be at least ${min}`);
  }
  if (max !== undefined && num > max) {
    throw new ApiError(400, `${fieldName} must be at most ${max}`);
  }
}

export function validateDate(value: any, fieldName: string): void {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new ApiError(400, `${fieldName} must be a valid date`);
  }
  if (date < new Date()) {
    throw new ApiError(400, `${fieldName} must be in the future`);
  }
}

export function validatePhone(phone: string): void {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    throw new ApiError(400, 'Invalid phone number format');
  }
}

