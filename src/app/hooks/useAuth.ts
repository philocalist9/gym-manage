"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  gymName?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  
  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      setLastActivity(Date.now());
    };
    
    // Register event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);
  
  // Session refresh functionality
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            setAuthState({
              user: null,
              loading: false,
              error: null,
            });
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        });
        
        // For super admin, check session freshness periodically
        if (data.user?.role === 'super-admin') {
          // Set up polling for session freshness
          const checkInterval = setInterval(() => {
            // Check if user has been inactive for 30 minutes (for super admin)
            const inactivityThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds
            const currentTime = Date.now();
            
            if ((currentTime - lastActivity) > inactivityThreshold) {
              // Log out automatically due to inactivity
              clearInterval(checkInterval);
              logout();
            }
          }, 60000); // Check every minute
          
          return () => clearInterval(checkInterval);
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
      }
    };

    fetchUser();
    
    // Set up periodic checks to refresh session if needed
    const refreshInterval = setInterval(() => {
      fetchUser();
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (email: string, password: string, role: string = 'gym-owner') => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if this is an account status issue
        if (res.status === 403 && data.accountStatus) {
          // Include the status in the error message for better handling
          const statusMsg = data.accountStatus === 'pending' 
            ? 'Your account is pending approval by the administrator.'
            : 'Your account has been deactivated. Please contact the administrator.';
          throw new Error(statusMsg);
        }
        throw new Error(data.error || 'Login failed');
      }

      // Refresh user data
      const userRes = await fetch('/api/auth/user', {
        credentials: 'include',
      });
      
      if (!userRes.ok) {
        throw new Error('Failed to get user data after login');
      }

      const userData = await userRes.json();
      
      setAuthState({
        user: userData.user,
        loading: false,
        error: null
      });

      return { success: true, data };
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return { success: false, error };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // Call the logout API with cache-control headers
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Clear authentication state
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      
      // Create a timestamp for cache busting
      const timestamp = new Date().getTime();
      
      // Clear any cached data from storage
      if (typeof window !== 'undefined') {
        try {
          // Clear any localStorage/sessionStorage items
          localStorage.removeItem('lastActivityTimestamp');
          sessionStorage.removeItem('userPreferences');
          
          // Clear any application cache if available
          if ('caches' in window) {
            caches.keys().then(keyList => {
              return Promise.all(keyList.map(key => {
                return caches.delete(key);
              }));
            });
          }
          
          // Clear memory cache by setting dummy fetch headers
          const headers = new Headers();
          headers.append('pragma', 'no-cache');
          headers.append('cache-control', 'no-cache');
          
          // Apply no-cache directive to fetch requests
          const fetchOptions = {
            method: 'GET',
            headers: headers
          };
          
          // Make a cache-busting fetch to reload fresh data
          fetch('/api/auth/user', fetchOptions).catch(() => {
            // Ignore fetch errors during logout
          });
        } catch (e) {
          console.warn('Failed to clear storage during logout:', e);
        }
      }

      // Use history.pushState to modify history before redirect
      if (typeof window !== 'undefined' && window.history) {
        // Replace current history entry with logout entry to prevent back navigation
        window.history.replaceState(null, '', `/logout?t=${timestamp}`);
      }

      // Redirect with history replacement to prevent going back
      // Include from=logout parameter to show the correct message
      router.replace(`/login?from=logout&t=${timestamp}`);
      
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to logout'
      }));
      return { success: false, error };
    }
  };

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          // If unauthorized, clear the user state
          setAuthState({
            user: null,
            loading: false,
            error: null
          });
          return false;
        }
        throw new Error('Failed to refresh session');
      }

      const data = await res.json();
      
      // Update user state with refreshed data
      setAuthState({
        user: data.user,
        loading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    refreshSession, // Expose the refresh function
    isAuthenticated: !!authState.user,
    lastActivity,
    updateActivity: () => setLastActivity(Date.now())
  };
}
