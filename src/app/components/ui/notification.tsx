"use client";

import React, { useState, useEffect } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number; // in milliseconds
  onClose?: () => void;
  show: boolean;
}

export default function Notification({
  type,
  message,
  duration = 5000,
  onClose,
  show
}: NotificationProps) {
  const [visible, setVisible] = useState(show);

  // Control visibility based on the show prop
  useEffect(() => {
    setVisible(show);
  }, [show]);

  // Auto-hide after duration
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  // If not visible, don't render
  if (!visible) return null;

  // Define styles based on notification type
  const styles = {
    success: {
      bg: 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800',
      text: 'text-green-800 dark:text-green-300',
      icon: (
        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      progressBar: 'bg-green-500',
      closeButton: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
    },
    error: {
      bg: 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800',
      text: 'text-red-800 dark:text-red-300',
      icon: (
        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      progressBar: 'bg-red-500',
      closeButton: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
    },
    warning: {
      bg: 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-300',
      icon: (
        <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      ),
      progressBar: 'bg-amber-500',
      closeButton: 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300'
    },
    info: {
      bg: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-300',
      icon: (
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      progressBar: 'bg-blue-500',
      closeButton: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`mb-5 p-4 ${currentStyle.bg} border rounded-lg animate-fade-in-up flex items-start relative overflow-hidden`}>
      {/* Countdown progress bar */}
      <div 
        className={`absolute bottom-0 left-0 h-1 w-full origin-left ${currentStyle.progressBar}`} 
        style={{
          animation: `countdown-animation ${duration}ms linear forwards`
        }}
      ></div>
      
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 animate-fade-in-down">
        {currentStyle.icon}
      </div>
      
      {/* Message content */}
      <div className={`flex-1 ${currentStyle.text}`}>
        {message}
      </div>
      
      {/* Close button */}
      <button 
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className={`ml-2 ${currentStyle.closeButton} transition-colors`}
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
}
