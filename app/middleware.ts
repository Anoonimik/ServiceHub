import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/shared/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPageRoutes = [
    '/dashboard',
    '/providers/become',
    '/providers/dashboard',
    '/providers/edit',
    '/providers/services',
    '/providers/reservations',
    '/reservations',
  ];

  const protectedApiRoutes = [
    '/api/auth/me',
    '/api/providers',
    '/api/services/my',
    '/api/reservations/my',
    '/api/reservations',
  ];

  const providerApiRoutes = [
    '/api/providers',
    '/api/services/my',
    '/api/providers/reservations',
  ];

  const isTimeSlotWriteRequest = pathname.startsWith('/api/services/') && pathname.includes('/time-slots') && request.method !== 'GET';
  const isTimeSlotDeleteRequest = pathname.startsWith('/api/time-slots/') && request.method === 'DELETE';
  const isTimeSlotUpdateRequest = pathname.startsWith('/api/time-slots/') && request.method === 'PATCH';

  const isProtectedPageRoute = protectedPageRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  const isProviderApiRoute = providerApiRoutes.some(route => pathname.startsWith(route));

  if (isTimeSlotWriteRequest || isTimeSlotDeleteRequest || isTimeSlotUpdateRequest) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (payload.role !== 'provider') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Provider access required' },
        { status: 403 }
      );
    }
  }

  if (isProtectedApiRoute) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (isProviderApiRoute && payload.role !== 'provider') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Provider access required' },
        { status: 403 }
      );
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/providers/:path*',
    '/reservations/:path*',
    '/api/auth/me',
    '/api/providers/:path*',
    '/api/services/:path*',
    '/api/reservations/:path*',
    '/api/time-slots/:path*',
  ],
};
