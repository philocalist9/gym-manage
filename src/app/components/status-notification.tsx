"use client";

import React from 'react';
import Notification from './ui/notification';

interface StatusNotificationProps {
  status: 'pending' | 'inactive' | 'active' | null;
  onClose?: () => void;
}

export default function StatusNotification({ status, onClose }: StatusNotificationProps) {
  // Return null if no status or active status
  if (!status || status === 'active') return null;
  
  const title = status === 'pending' ? 'Account Pending Approval' : 'Account Inactive';
  const description = status === 'pending' 
    ? 'Your gym account is waiting for administrator approval before you can access the system.'
    : 'Your gym account has been deactivated. Please contact the administrator for assistance.';
  
  const actionText = status === 'pending'
    ? 'Please check back later or contact support for expedited review.'
    : 'Contact the administrator to resolve any issues with your account.';
  
  const message = (
    <div>
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm">{description}</div>
      <div className="mt-2 text-xs">{actionText}</div>
    </div>
  );
  
  return (
    <Notification
      type={status === 'pending' ? 'warning' : 'error'}
      message={message as unknown as string} 
      show={true}
      onClose={onClose}
      duration={5000}
    />
  );
}
