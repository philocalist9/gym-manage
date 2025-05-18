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
      className="min-h-screen bg-[#0B101B] text-gray-100"
      onClick={updateActivity}
      onKeyDown={updateActivity}
    >
      {/* Session status indicators - moved to navbar component */}
      <main className="w-full pt-16 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}