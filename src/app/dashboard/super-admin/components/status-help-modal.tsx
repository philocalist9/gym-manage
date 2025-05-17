"use client";

import React from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface StatusHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusHelpModal({ isOpen, onClose }: StatusHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gym Status Information</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border-b dark:border-gray-700">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 mr-2" />
              <h3 className="font-medium">Active Status</h3>
            </div>
            <div className="p-3 text-sm">
              <p>When a gym is set to <strong>Active</strong>:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gym owner <strong>can log in</strong> to the system</li>
                <li>All gym features are available</li>
                <li>Members can use all services</li>
                <li>Appears in active gym listings</li>
              </ul>
            </div>
          </div>

          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border-b dark:border-gray-700">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-2" />
              <h3 className="font-medium">Pending Status</h3>
            </div>
            <div className="p-3 text-sm">
              <p>When a gym is set to <strong>Pending</strong>:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gym owner <strong>cannot log in</strong> to the system</li>
                <li>Typically used for newly registered gyms awaiting approval</li>
                <li>No features are accessible</li>
                <li>Does not appear in active gym listings</li>
              </ul>
            </div>
          </div>

          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border-b dark:border-gray-700">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-500 mr-2" />
              <h3 className="font-medium">Inactive Status</h3>
            </div>
            <div className="p-3 text-sm">
              <p>When a gym is set to <strong>Inactive</strong>:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gym owner <strong>cannot log in</strong> to the system</li>
                <li>Used for gyms that have been suspended or deactivated</li>
                <li>All features are disabled</li>
                <li>Does not appear in active gym listings</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
