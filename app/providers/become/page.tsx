'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, LoadingSpinner } from '@/shared/ui';
import { useProviderForm } from '@/shared/lib/hooks/useProviderForm';
import { useRequireAuth } from '@/shared/lib/hooks/useAuth';

export default function BecomeProviderPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();
  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  } = useProviderForm();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role === 'provider') {
    router.push('/providers/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          <div className="section-header">
            <h1>Become a Service Provider</h1>
            <p className="text-lg text-gray-600">Start offering your services to customers</p>
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

              <div className="flex flex-wrap gap-4 pt-4">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Become a Provider'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/dashboard')}
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
