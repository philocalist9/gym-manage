"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../providers/navbar";
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "../hooks/useAuth"; // Import the auth hook

export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(searchParams.get('registered') === 'true');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading, error, isAuthenticated, user } = useAuth(); // Use the auth hook
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  // Get the callback URL if one was provided
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPathForRole(user.role);
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (showMessage) {
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  // Helper function to determine dashboard path based on role
  const getDashboardPathForRole = (role: string): string => {
    switch (role) {
      case 'gym-owner':
        return '/dashboard/gym-owner';
      case 'trainer':
        return '/dashboard/trainer';
      case 'member':
        return '/dashboard/member';
      case 'super-admin':
        return '/dashboard/super-admin';
      default:
        return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        throw new Error(result.error instanceof Error ? result.error.message : 'Login failed');
      }
      
      // If we have a callback URL, use it, otherwise use the role-specific dashboard
      if (callbackUrl !== '/dashboard') {
        router.push(callbackUrl);
      } else if (user) {
        router.push(getDashboardPathForRole(user.role));
      }
      
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="pt-16 flex items-center justify-center min-h-screen p-4">
        {showMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md">
            <div className="m-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 flex items-center justify-center space-x-2">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-600 dark:text-green-400">Registration successful! Please log in to continue.</p>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md">
            <div className="m-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 flex items-center justify-center space-x-2">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            </div>
          </div>
        )}
        
        <div className="flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden">
          {/* Left side - Login Form */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back!
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                New to GymSync?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-8">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.84 9.49.5.09.68-.22.68-.485 0-.236-.008-.866-.013-1.7-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.377.203 2.394.1 2.647.64.699 1.028 1.593 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0l-3 3m3-3l3 3m-3-6v-2m0 0l-3-3m3 3l3-3M4 21h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* Right side - Image */}
          <div className="hidden md:block w-1/2 relative bg-blue-600">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="text-white text-center">
                <h3 className="text-3xl font-bold mb-4">Welcome to GymSync</h3>
                <p className="text-lg text-blue-100">
                  Your all-in-one fitness management solution. Track your progress, connect with trainers, and achieve your fitness goals.
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
