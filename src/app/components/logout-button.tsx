"use client";

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LogoutButtonProps {
  variant?: 'default' | 'minimal' | 'icon';
  className?: string;
}

export default function LogoutButton({ 
  variant = 'default',
  className = ''
}: LogoutButtonProps) {
  const { logout, loading, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // For super admin, confirm before logout
      if (user?.role === 'super-admin') {
        const confirmLogout = window.confirm(
          'You are logging out of a Super Admin session. Continue?'
        );
        
        if (!confirmLogout) {
          setIsLoggingOut(false);
          return;
        }
      }
      
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut || loading}
        className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut || loading}
        className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut || loading}
      className={`flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isLoggingOut ? 'opacity-75 cursor-not-allowed' : ''} ${className}`}
    >
      <LogOut className="h-5 w-5 mr-2" />
      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}
