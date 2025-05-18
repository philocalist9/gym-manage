'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    // Main section - full width with no margin or padding on the container
    <section className="relative w-full overflow-hidden py-32 sm:py-36 bg-gray-900">
      {/* Background gradient - covers the entire width */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2),rgba(59,130,246,0)_70%)]"></div>
      </div>
      
      {/* Content container - centered with padding */}
      <div className="relative w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left text content */}
          <div className="flex-1 text-center lg:text-left z-10">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/10 border border-blue-300/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
              <span className="text-blue-400 text-sm font-medium">No credit card required</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
              Elevate Your 
              <br className="hidden lg:block" />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Fitness Empire
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-900" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0 5 Q 25 0, 50 5 Q 75 10, 100 5 L 100 10 L 0 10 Z"></path>
                </svg>
              </span>
            </h1>
            
            {/* Description */}
            <p className="mt-8 text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
              The ultimate all-in-one platform that transforms how you manage your gym. 
              Experience seamless operations, boost member engagement, and unlock growth potential.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white overflow-hidden transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="#features"
                className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <span className="flex items-center">
                  Watch Demo
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-gray-800 bg-gradient-to-br ${
                    ['from-blue-400 to-blue-500', 'from-green-400 to-green-500', 'from-purple-400 to-purple-500', 'from-red-400 to-red-500'][i]
                  }`}></div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-white">500+</span> gyms trust us
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="flex-1 relative w-full max-w-full sm:max-w-xl lg:max-w-none">
            <div className="relative w-full aspect-square">
              {/* Mock Dashboard Preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700 p-4">
                {/* Dashboard Content */}
                <div className="flex h-full">
                  <div className="w-1/4 border-r border-gray-700">
                    <div className="space-y-4 p-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-700 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-700 rounded-lg w-1/2"></div>
                      <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
