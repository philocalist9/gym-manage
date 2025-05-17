"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';

interface StatusActionButtonsProps {
  gymId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

export default function StatusActionButtons({ 
  gymId, 
  currentStatus,
  onStatusChange 
}: StatusActionButtonsProps) {
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'pending') => {
    if (newStatus === currentStatus) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/gyms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gymId, status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update gym status');
      }
      
      onStatusChange();
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating status');
      console.error('Status update error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Status tooltips
  const statusTooltips = {
    active: 'Set as Active (Can login)',
    inactive: 'Set as Inactive (Cannot login)',
    pending: 'Set as Pending (Cannot login)'
  };

  return (
    <div className="flex items-center gap-2">
      {/* Status change actions with explanation tooltips */}
      {currentStatus !== 'active' && (
        <button
          onClick={() => handleStatusChange('active')}
          disabled={actionLoading}
          title={statusTooltips.active}
          className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 relative group"
        >
          {actionLoading ? 
            <Loader className="h-5 w-5 animate-spin" /> : 
            <CheckCircle className="h-5 w-5" />
          }
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Activate - Allow login
          </span>
        </button>
      )}
      
      {currentStatus !== 'inactive' && (
        <button
          onClick={() => handleStatusChange('inactive')}
          disabled={actionLoading}
          title={statusTooltips.inactive}
          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 relative group"
        >
          {actionLoading ? 
            <Loader className="h-5 w-5 animate-spin" /> : 
            <XCircle className="h-5 w-5" />
          }
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Deactivate - Block login
          </span>
        </button>
      )}
      
      {currentStatus !== 'pending' && (
        <button
          onClick={() => handleStatusChange('pending')}
          disabled={actionLoading}
          title={statusTooltips.pending}
          className="p-1 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 relative group"
        >
          {actionLoading ? 
            <Loader className="h-5 w-5 animate-spin" /> : 
            <AlertTriangle className="h-5 w-5" />
          }
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Set Pending - Block login
          </span>
        </button>
      )}
      
      {error && (
        <p className="text-xs text-red-500 ml-2">{error}</p>
      )}
    </div>
  );
}
