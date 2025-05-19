"use client";

import React from 'react';
import { X, User, Mail, Building2, Calendar, Clock } from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'gym_owner' | 'trainer' | 'member' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  joinDate: string;
  associatedGym?: string;
  lastActive?: string;
}

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'gym_owner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'trainer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'member':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{user.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeStyle(user.role)}`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Email</span>
              </div>
              <p className="text-white">{user.email}</p>
            </div>

            {user.associatedGym && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Associated Gym</span>
                </div>
                <p className="text-white">{user.associatedGym}</p>
              </div>
            )}

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Join Date</span>
              </div>
              <p className="text-white">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Last Active</span>
              </div>
              <p className="text-white">{new Date(user.lastActive).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
