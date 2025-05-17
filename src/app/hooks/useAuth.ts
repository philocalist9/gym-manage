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
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      
      router.push('/login');
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

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    isAuthenticated: !!authState.user,
  };
}
