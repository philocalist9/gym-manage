"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../providers/navbar";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "../hooks/useAuth";
import StatusNotification from "../components/status-notification";
import { LoginDecorations, LoginFooter, BrandLogo } from "../components/login/decorative-elements";
import { LoadingButton } from "../components/ui/loading";
import Notification from "../components/ui/notification";

export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(searchParams.get('registered') === 'true');
  const [errorMessage, setErrorMessage] = useState('');
  const [accountStatus, setAccountStatus] = useState<'active' | 'pending' | 'inactive' | null>(null);
  const { login, loading, error, isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [selectedRole, setSelectedRole] = useState('gym-owner');
  
  // Get the callback URL if one was provided
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [systemInitialized, setSystemInitialized] = useState(false);

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

  // Check if session was expired or user was logged out
  useEffect(() => {
    const from = searchParams.get('from');
    if (from === 'session_expired') {
      setErrorMessage('Your session has expired. Please log in again.');
    } else if (from === 'logout') {
      setShowMessage(true);
    }
  }, [searchParams]);

  // We no longer need this effect as the Notification component handles auto-hiding
  // Each notification has its own timer and close handler

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPathForRole(user.role);
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setAccountStatus(null);
    
    try {
      const result = await login(formData.email, formData.password, selectedRole);
      
      if (!result.success) {
        throw new Error(result.error instanceof Error ? result.error.message : 'Login failed');
      }
      
      if (callbackUrl !== '/dashboard') {
        router.push(callbackUrl);
      } else if (user) {
        router.push(getDashboardPathForRole(user.role));
      }
      
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed. Please check your credentials.';
      
      if (errorMsg.includes('pending approval')) {
        setAccountStatus('pending');
      } else if (errorMsg.includes('deactivated') || errorMsg.includes('inactive')) {
        setAccountStatus('inactive');
      } else if (errorMsg.includes('Invalid credentials')) {
        setErrorMessage('Invalid email or password. Please try again.');
      } else {
        setErrorMessage(errorMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <Navbar />
      <LoginDecorations />
      
      <div className="pt-16 flex items-center justify-center min-h-screen responsive-container relative z-10">
        <div className="relative w-full max-w-md animate-fade-in-down responsive-form">
          {/* Card container */}
          <div className="relative w-full p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 responsive-card backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
            <BrandLogo />
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">Welcome Back</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Sign in to continue to your account</p>
          
          <Notification 
            type="success"
            message={searchParams.get('from') === 'logout' 
              ? "Logout successful! You have been securely signed out."
              : "Registration successful! Please log in to continue."
            }
            show={showMessage}
            onClose={() => setShowMessage(false)}
            duration={5000}
          />
          
          <Notification
            type="error"
            message={errorMessage}
            show={!!errorMessage}
            onClose={() => setErrorMessage('')}
            duration={5000}
          />
          
          {accountStatus && (
            <StatusNotification 
              status={accountStatus} 
              onClose={() => setAccountStatus(null)} 
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="your-email@example.com"
                  className="mt-1 block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white transition-all duration-200"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  className="mt-1 block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white transition-all duration-200"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">I am a</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white transition-all duration-200 appearance-none"
                >
                  <option value="gym-owner">Gym Owner</option>
                  <option value="trainer">Trainer</option>
                  <option value="member">Member</option>
                  {selectedRole === 'super-admin' && (
                    <option value="super-admin">Super Admin</option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded transition duration-150 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Remember me
                </label>
              </div>
              
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus:underline"
              >
                Forgot password?
              </Link>
            </div>
            
            <div className="pt-2 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <button
                type="submit"
                disabled={loading}
                className={`login-button font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 animate-subtle-shift ${loading ? 'login-button-loading' : ''}`}
              >
                <LoadingButton 
                  loading={loading} 
                  text="Sign in" 
                  loadingText="Signing in..." 
                />
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">OR</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              New to GymSync?{" "}
              <Link 
                href="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center group"
              >
                Create an account
                <svg className="ml-1 w-4 h-4 transform transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            
            <LoginFooter />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
