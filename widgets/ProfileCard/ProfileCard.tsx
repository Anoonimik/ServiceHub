import React from 'react';
import { User } from '@/entities/user/model/types';

interface ProfileCardProps {
  user: User;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'badge-confirmed';
      case 'provider':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'provider':
        return 'Provider';
      default:
        return 'User';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">My Profile</h3>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Name</span>
          <span className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Email</span>
          <span className="text-sm font-semibold text-gray-900">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Phone</span>
            <span className="text-sm font-semibold text-gray-900">{user.phone}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-600">Role</span>
          <span className={`badge ${getRoleBadgeClass(user.role)}`}>
            {getRoleLabel(user.role)}
          </span>
        </div>
      </div>
    </div>
  );
};

