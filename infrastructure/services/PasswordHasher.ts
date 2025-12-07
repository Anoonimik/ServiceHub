import { IPasswordHasher } from '@/application/interfaces/IPasswordHasher';
import { hashPassword } from '@/shared/lib/auth';

export class PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return hashPassword(password);
  }
}

