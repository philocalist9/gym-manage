"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

// Dynamically import the security headers component
const SecurityHeaders = dynamic(() => import('./security-headers'), { ssr: false });

/**
 * ClientSecurityWrapper handles authentication checks and security headers
 * This component must be a Client Component since it uses browser-specific APIs
 * and dynamic imports with { ssr: false }
 */
export default function ClientSecurityWrapper() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // AuthGuard functionality
  useEffect(() => {
    // Only check after loading is complete
    if (!loading) {
      // If there's no user and we're not loading, redirect to login
      if (!user) {
        // Add timestamp for cache busting
        const timestamp = new Date().getTime();
        // Use replace to prevent back button from working
        router.replace(`/login?from=guard&t=${timestamp}`);
      }
    }
  }, [user, loading, router]);

  // Add a listener for page visibility changes
  useEffect(() => {
    // Function to check auth status when the page becomes visible again
    // This catches cases where user logs out in another tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Re-validate auth status when the page becomes visible again
        fetch('/api/auth/user', { 
          method: 'GET',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
          .then(res => {
            if (!res.ok) {
              // If not authenticated, redirect to login with session expired message
              const timestamp = new Date().getTime();
              router.replace(`/login?from=session_expired&t=${timestamp}`);
            }
          })
          .catch(() => {
            // On error, assume authentication is failed
            const timestamp = new Date().getTime();
            router.replace(`/login?from=error&t=${timestamp}`);
          });
      }
    };

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  // Function to detect bfCache usage and prevent accessing protected pages after logout
  useEffect(() => {
    // Function to check if the page is being loaded from the back-forward cache
    const detectBfCache = () => {
      // If this is true, we're coming from the bfcache (back/forward navigation)
      if (performance.getEntriesByType('navigation').length > 0) {
        const navEntry = performance.getEntriesByType('navigation')[0] as any;
        if (navEntry.type === 'back_forward') {
          // Verify authentication again when coming from back/forward cache
          fetch('/api/auth/user', {
            headers: { 'Cache-Control': 'no-cache' },
            cache: 'no-store'
          })
            .then(res => {
              if (!res.ok) {
                // Force a reload if not authenticated
                window.location.reload();
              }
            })
            .catch(() => {
              // Force a reload on error
              window.location.reload();
            });
        }
      }
    };

    // Detect bfcache usage
    detectBfCache();

    // Add event listener for page show events (which happen when using back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      // If persisted is true, the page is being restored from the bfcache
      if (event.persisted) {
        // Check authentication when restored from bfcache
        fetch('/api/auth/user', {
          headers: { 'Cache-Control': 'no-cache' },
          cache: 'no-store'
        })
          .then(res => {
            if (!res.ok) {
              // Redirect to login if not authenticated
              const timestamp = new Date().getTime();
              window.location.href = `/login?from=pageshow&t=${timestamp}`;
            }
          })
          .catch(() => {
            // Force a reload on error
            window.location.reload();
          });
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    // Add cache control meta tags
    const meta1 = document.createElement('meta');
    meta1.httpEquiv = 'Cache-Control';
    meta1.content = 'no-cache, no-store, must-revalidate';
    
    const meta2 = document.createElement('meta');
    meta2.httpEquiv = 'Pragma';
    meta2.content = 'no-cache';
    
    const meta3 = document.createElement('meta');
    meta3.httpEquiv = 'Expires';
    meta3.content = '0';
    
    document.head.appendChild(meta1);
    document.head.appendChild(meta2);
    document.head.appendChild(meta3);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.head.removeChild(meta1);
      document.head.removeChild(meta2);
      document.head.removeChild(meta3);
    };
  }, [router]);

  // This component doesn't render anything visible
  return null;
}
