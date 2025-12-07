import { NextRequest } from 'next/server';
import { verifyToken, UserPayload } from '@/shared/lib/auth';
import { ApiError } from './response';

export interface AuthenticatedRequest extends NextRequest {
  user?: UserPayload;
}

export async function requireAuth(request: NextRequest): Promise<UserPayload> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized - Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    throw new ApiError(401, 'Unauthorized - Invalid or expired token');
  }

  return payload;
}

export async function optionalAuth(request: NextRequest): Promise<UserPayload | null> {
  try {
    return await requireAuth(request);
  } catch {
    return null;
  }
}

export function requireRole(user: UserPayload, allowedRoles: string[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ApiError(403, 'Forbidden - Insufficient permissions');
  }
}

