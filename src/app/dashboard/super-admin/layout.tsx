'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { user, loading, isAuthenticated, refreshSession, lastActivity, updateActivity } = useAuth();
  const router = useRouter();
  const [sessionWarningShown, setSessionWarningShown] = useState(false);
  
  // Check if user is super admin and redirect if not
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!loading && user?.role !== 'super-admin') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);
  
  // Monitor session for expiration
  useEffect(() => {
    if (!user || user.role !== 'super-admin') return;
    
    // Check session status every minute
    const sessionMonitor = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      const warningThreshold = 3.5 * 60 * 60 * 1000; // 3.5 hours in ms
      
      // Show warning when session is about to expire (30 minutes before)
      if (inactiveTime > warningThreshold && !sessionWarningShown) {
        setSessionWarningShown(true);
        
        // Ask user if they want to extend session
        const wantToExtend = window.confirm(
          'Your session will expire soon. Would you like to extend it?'
        );
        
        if (wantToExtend) {
          refreshSession();
          updateActivity();
          setSessionWarningShown(false);
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(sessionMonitor);
  }, [user, lastActivity, sessionWarningShown, refreshSession, updateActivity]);
  
  if (loading || !user || user.role !== 'super-admin') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      onClick={updateActivity}
      onKeyDown={updateActivity}
    >
      {/* Session status indicator */}
      <div className="fixed top-4 right-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
        Session active
      </div>
      
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}