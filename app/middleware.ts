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
  ];

  const protectedApiRoutes = [
    '/api/auth/me',
    '/api/providers',
    '/api/services/my',
    '/api/reservations/my',
  ];

  const providerApiRoutes = [
    '/api/providers',
    '/api/services/my',
  ];

  const isProtectedPageRoute = protectedPageRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  const isProviderApiRoute = providerApiRoutes.some(route => pathname.startsWith(route));

  // Handle API routes that require authentication
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

  // Page routes are protected by useRequireAuth hook on the client side
  // This provides better UX as the check happens after the page loads

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/providers/:path*',
    '/api/auth/me',
    '/api/providers/:path*',
    '/api/services/my',
    '/api/reservations/my',
  ],
};
