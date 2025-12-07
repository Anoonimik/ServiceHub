export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export interface ITokenGenerator {
  generate(payload: TokenPayload, rememberMe?: boolean): string;
  verify(token: string): TokenPayload | null;
}

