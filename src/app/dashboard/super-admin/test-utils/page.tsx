"use client";

import { useState } from 'react';

export default function SuperAdminTest() {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<'not-tried' | 'success' | 'failed'>('not-tried');

  const testSuperAdminSeed = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/seed');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to test seed endpoint');
    } finally {
      setLoading(false);
    }
  };

  const testSuperAdminLogin = async () => {
    setLoading(true);
    setError(null);
    setLoginStatus('not-tried');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'super@admin.com', 
          password: 'Admin@2025' 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLoginStatus('success');
      } else {
        setLoginStatus('failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to test login');
      setLoginStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const testAuthDebug = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/debug');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to test auth debug endpoint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Super Admin Test Utilities</h1>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg font-medium mb-3">Test Super Admin Seed</h2>
          <button
            onClick={testSuperAdminSeed}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Seed Endpoint'}
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg font-medium mb-3">Test Super Admin Login</h2>
          <button
            onClick={testSuperAdminLogin}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
          
          {loginStatus === 'success' && (
            <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              Login successful!
            </div>
          )}
          
          {loginStatus === 'failed' && (
            <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              Login failed!
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg font-medium mb-3">Test Auth Debug Info</h2>
          <button
            onClick={testAuthDebug}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Auth Debug'}
          </button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            <h3 className="font-medium">Error:</h3>
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
