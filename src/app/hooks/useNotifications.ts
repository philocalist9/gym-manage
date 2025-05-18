"use client";

import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Add a notification
  const addNotification = useCallback((type: NotificationType, message: string, duration: number = 5000) => {
    const id = Date.now().toString();
    const newNotification = { id, type, message, duration };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Shorthand methods for different types
  const success = useCallback((message: string, duration?: number) => {
    return addNotification('success', message, duration);
  }, [addNotification]);
  
  const error = useCallback((message: string, duration?: number) => {
    return addNotification('error', message, duration);
  }, [addNotification]);
  
  const warning = useCallback((message: string, duration?: number) => {
    return addNotification('warning', message, duration);
  }, [addNotification]);
  
  const info = useCallback((message: string, duration?: number) => {
    return addNotification('info', message, duration);
  }, [addNotification]);
  
  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll
  };
}
