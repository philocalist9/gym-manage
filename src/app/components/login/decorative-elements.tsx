"use client";

import React from 'react';

export function LoginDecorations() {
  return (
    <>
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow" aria-hidden="true"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-float-delay-slow" aria-hidden="true"></div>
      
      {/* Floating shapes - visible only on larger screens */}
      <div className="hidden lg:block">
        <div className="absolute top-1/4 -left-6 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg rotate-12 animate-float" aria-hidden="true"></div>
        <div className="absolute bottom-1/3 -right-6 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg -rotate-12 animate-float-delay" aria-hidden="true"></div>
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full animate-float-delay-slow" aria-hidden="true"></div>
      </div>
      
      {/* Animated gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -inset-[100%] opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.8),transparent_80%)] animate-subtle-shift"></div>
      </div>
    </>
  );
}

export function LoginFooter() {
  return (
    <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} GymSync. All rights reserved.
      </p>
    </div>
  );
}

export function BrandLogo() {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12H18M4 15H6M18 15H20M6 15C6 16.6569 4.65685 18 3 18C1.34315 18 0 16.6569 0 15C0 13.3431 1.34315 12 3 12C4.65685 12 6 13.3431 6 15ZM18 15C18 16.6569 19.3431 18 21 18C22.6569 18 24 16.6569 24 15C24 13.3431 22.6569 12 21 12C19.3431 12 18 13.3431 18 15ZM6 15V9C6 7.89543 6.89543 7 8 7H16C17.1046 7 18 7.89543 18 9V15M4 9H8M16 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-xl font-bold text-gray-800 dark:text-white ml-2">GymSync</span>
    </div>
  );
}
