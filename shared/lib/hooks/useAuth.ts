import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/authStore';
import { userApi } from '@/entities/user/api/userApi';

export function useRequireAuth(requiredRole?: 'provider' | 'admin') {
  const router = useRouter();
  const { user, isAuthenticated, setUser, clearAuth, initialize, initialized } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!initialized) {
        await initialize();
      }

      if (!isAuthenticated || !user) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          router.push('/login');
          setLoading(false);
          return;
        }

        try {
          const currentUser = await userApi.getCurrentUser();
          setUser(currentUser);

          if (requiredRole && currentUser.role !== requiredRole) {
            clearAuth();
            router.push('/dashboard');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          clearAuth();
          router.push('/login');
          setLoading(false);
          return;
        }
      } else {
        if (requiredRole && user.role !== requiredRole) {
          router.push('/dashboard');
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, initialized, router, setUser, clearAuth, requiredRole, user, initialize]);

  return { user, loading, isAuthenticated };
}

export function useRequireProvider() {
  return useRequireAuth('provider');
}

