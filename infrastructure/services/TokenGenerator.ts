import { ITokenGenerator, TokenPayload } from '@/application/interfaces/ITokenGenerator';
import { generateToken, verifyToken } from '@/shared/lib/auth';

export class TokenGenerator implements ITokenGenerator {
  generate(payload: TokenPayload, rememberMe: boolean = false): string {
    return generateToken(payload, rememberMe);
  }

  verify(token: string): TokenPayload | null {
    return verifyToken(token);
  }
}

