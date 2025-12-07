'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/model/authStore';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              ServiceHub
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/services" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Services
                </Link>
                <Link 
                  href="/providers" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Providers
                </Link>
                {user?.role === 'provider' && (
                  <Link 
                    href="/providers/dashboard" 
                    className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Provider Panel
                  </Link>
                )}
                <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-3">
                  <span className="text-sm text-gray-600 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Button variant="secondary" onClick={handleLogout} className="text-xs px-3 py-1.5">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
