import { IPasswordVerifier } from '@/application/interfaces/IPasswordVerifier';
import { comparePassword } from '@/shared/lib/auth';

export class PasswordVerifier implements IPasswordVerifier {
  async verify(password: string, hash: string): Promise<boolean> {
    return comparePassword(password, hash);
  }
}

