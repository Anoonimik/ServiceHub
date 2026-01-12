/**
 * Re-export auth store for widgets and pages
 * This allows widgets to access auth state without directly depending on features
 */
export { useAuthStore } from '@/features/auth/model/authStore';

