"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/app/hooks/useAuth';

// Create the context
export const AuthContext = createContext<ReturnType<typeof useAuthHook> | undefined>(undefined);

// Export a hook that consumes the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
