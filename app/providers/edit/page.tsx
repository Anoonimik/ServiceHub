'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, LoadingSpinner } from '@/shared/ui';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';
import { useMyProvider } from '@/shared/lib/hooks/useProviders';
import { useEditProvider } from '@/shared/lib/hooks/useEditProvider';

export default function EditProviderPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth('provider');
  const { provider, loading: providerLoading, refetch } = useMyProvider();
  const { formData, loading, error, handleChange, handleSubmit } = useEditProvider({
    provider,
    onSuccess: refetch,
  });

  const loadingState = authLoading || providerLoading;

  if (loadingState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'provider' || !provider) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          <div className="section-header">
            <h1>Edit Provider Profile</h1>
            <p className="text-lg text-gray-600">Update your provider information</p>
          </div>

          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Business Name (Optional)"
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Your business or personal name"
              />

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input resize-none"
                  placeholder="Tell customers about your services..."
                />
              </div>

              <div className="flex items-center space-x-3 py-4 border-t border-gray-200">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active Provider Status
                </label>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/providers/dashboard')}
                  className="flex-1 md:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

