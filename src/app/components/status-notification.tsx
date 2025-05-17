"use client";

import React from 'react';
import { AlertCircle, ShieldOff, Clock } from 'lucide-react';

interface StatusNotificationProps {
  status: 'pending' | 'inactive';
}

export default function StatusNotification({ status }: StatusNotificationProps) {
  const StatusIcon = status === 'pending' ? Clock : ShieldOff;
  const title = status === 'pending' ? 'Account Pending Approval' : 'Account Inactive';
  const description = status === 'pending' 
    ? 'Your gym account is waiting for administrator approval before you can access the system.'
    : 'Your gym account has been deactivated. Please contact the administrator for assistance.';
  
  const actionText = status === 'pending'
    ? 'Please check back later or contact support for expedited review.'
    : 'Contact the administrator to resolve any issues with your account.';

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6 dark:bg-amber-900/30 dark:border-amber-800">
      <div className="flex">
        <div className="flex-shrink-0">
          <StatusIcon 
            className={`h-5 w-5 ${status === 'pending' ? 'text-amber-500' : 'text-red-500'}`} 
            aria-hidden="true" 
          />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${status === 'pending' ? 'text-amber-800 dark:text-amber-300' : 'text-red-800 dark:text-red-300'}`}>
            {title}
          </h3>
          <div className={`mt-2 text-sm ${status === 'pending' ? 'text-amber-700 dark:text-amber-200' : 'text-red-700 dark:text-red-200'}`}>
            <p>{description}</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <p className="px-2 py-1.5 text-xs text-amber-800 dark:text-amber-300">
                {actionText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
