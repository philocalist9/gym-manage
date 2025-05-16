'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./providers/theme-toggle";
import { useState } from "react";

export default function Home(): React.JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                GymSync
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/login"
                className="group relative inline-flex items-center px-4 py-2 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <span className="relative z-10">Login</span>
              </Link>
              <Link
                href="/register"
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Sign Up</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <div
            className={`sm:hidden ${
              isMobileMenuOpen ? "block" : "hidden"
            } border-t border-gray-200 dark:border-gray-700`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/login"
                className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 hover:from-blue-500 hover:to-blue-400 dark:hover:from-blue-400 dark:hover:to-blue-300 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),rgba(59,130,246,0)_70%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 mb-8">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">No credit card required</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                Elevate Your 
                <br className="hidden lg:block" />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
                    Fitness Empire
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 dark:text-blue-900" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path fill="currentColor" d="M0 5 Q 25 0, 50 5 Q 75 10, 100 5 L 100 10 L 0 10 Z"></path>
                  </svg>
                </span>
              </h1>
              
              <p className="mt-8 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                The ultimate all-in-one platform that transforms how you manage your gym. 
                Experience seamless operations, boost member engagement, and unlock growth potential.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="#features"
                  className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
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

              <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br ${
                      ['from-blue-400 to-blue-500', 'from-green-400 to-green-500', 'from-purple-400 to-purple-500', 'from-red-400 to-red-500'][i]
                    }`}></div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">500+</span> gyms trust us
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
              <div className="relative w-full aspect-square">
                {/* Mock Dashboard Preview */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-2xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-4">
                  {/* Dashboard Content */}
                  <div className="flex h-full">
                    <div className="w-1/4 border-r border-gray-200 dark:border-gray-700">
                      <div className="space-y-4 p-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="h-24 bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="w-1/2 h-3 bg-blue-200 dark:bg-gray-600 rounded mb-2"></div>
                          <div className="w-3/4 h-6 bg-blue-300 dark:bg-gray-500 rounded"></div>
                        </div>
                        <div className="h-24 bg-purple-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="w-1/2 h-3 bg-purple-200 dark:bg-gray-600 rounded mb-2"></div>
                          <div className="w-3/4 h-6 bg-purple-300 dark:bg-gray-500 rounded"></div>
                        </div>
                      </div>
                      <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.1),rgba(59,130,246,0)_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-4">
              BENEFITS
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Leading Gyms Choose GymSync
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience a comprehensive suite of tools designed to streamline your operations and boost growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Management",
                description: "Automate repetitive tasks, manage memberships, and handle payments effortlessly. Save 10+ hours every week.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                stat: "10h saved/week",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Member Engagement",
                description: "Build stronger relationships with automated check-ins, progress tracking, and personalized communications.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                stat: "89% retention",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Business Insights",
                description: "Make data-driven decisions with real-time analytics, revenue forecasting, and member behavior insights.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                stat: "32% growth",
                gradient: "from-green-500 to-green-600"
              }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="group relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-white mb-6`}>
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {benefit.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {benefit.stat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.1),rgba(59,130,246,0)_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-4">
              FEATURES
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Succeed
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful tools and features designed to help you manage and grow your fitness business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Member Management",
                description: "Track memberships, attendance, and payments with ease. Set up automated billing and renewal notifications.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                color: "blue"
              },
              {
                title: "Class Scheduling",
                description: "Create and manage class schedules, handle bookings, and send automatic reminders to members.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                color: "purple"
              },
              {
                title: "Performance Analytics",
                description: "Track key metrics, analyze trends, and make data-driven decisions to optimize your business.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                color: "green"
              },
              {
                title: "Online Payments",
                description: "Accept payments online, set up recurring billing, and manage multiple payment methods securely.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                color: "indigo"
              },
              {
                title: "Trainer Portal",
                description: "Empower trainers with tools to manage clients, track progress, and schedule sessions efficiently.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                color: "pink"
              },
              {
                title: "Mobile App",
                description: "Give members access to their fitness journey on the go with our powerful mobile application.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                color: "orange"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/20 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>

                <div className="mt-6">
                  <Link
                    href="#"
                    className={`inline-flex items-center text-${feature.color}-600 dark:text-${feature.color}-400 font-medium`}
                  >
                    Learn more
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Start Your Free Trial</span>
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Role Highlights Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-4">
              TAILORED FOR YOU
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Perfect for Every Role
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Whether you're a gym owner, trainer, or member, GymSync adapts to your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                role: "Gym Owners",
                description: "Get a complete overview of your business and make data-driven decisions.",
                icon: "👑",
                features: ["Business Analytics", "Member Management", "Revenue Tracking", "Staff Management"],
                gradient: "from-blue-500 to-blue-600"
              },
              {
                role: "Trainers",
                description: "Manage your clients, track their progress, and schedule sessions efficiently.",
                icon: "💪",
                features: ["Client Management", "Workout Planning", "Session Scheduling", "Progress Tracking"],
                gradient: "from-purple-500 to-purple-600"
              },
              {
                role: "Members",
                description: "Track your workouts, book classes, and monitor your fitness journey.",
                icon: "🏃",
                features: ["Workout Tracking", "Class Booking", "Progress Monitoring", "Personal Goals"],
                gradient: "from-green-500 to-green-600"
              }
            ].map((role, index) => (
              <div 
                key={index} 
                className="group relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.gradient} rounded-full opacity-10 -mr-16 -mt-16 transition-all duration-300 group-hover:opacity-20`}></div>
                
                <div className="relative">
                  <div className="text-4xl mb-6">{role.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {role.role}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {role.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <Link
                      href={`/register?role=${role.role.toLowerCase().replace(' ', '-')}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Learn more
                      <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),rgba(59,130,246,0)_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-4">
              TESTIMONIALS
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Trusted by Industry Leaders
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "GymSync has transformed how we operate. The automation features alone save us countless hours every week.",
                author: "Sarah Johnson",
                role: "Fitness Club Owner",
                image: "/testimonial1.jpg",
                rating: 5
              },
              {
                quote: "The member engagement features have helped us improve retention rates significantly. Our members love the mobile app.",
                author: "Michael Chen",
                role: "Gym Chain Director",
                image: "/testimonial2.jpg",
                rating: 5
              },
              {
                quote: "The analytics and reporting features give us invaluable insights into our business performance.",
                author: "Emma Williams",
                role: "Studio Manager",
                image: "/testimonial3.jpg",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full opacity-10"></div>
                
                <div className="relative">
                  <svg className="w-12 h-12 text-blue-500/20 mb-6" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>

                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.author}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),rgba(59,130,246,0)_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-l-full transform translate-x-1/3"></div>
            
            <div className="relative p-12 sm:p-16 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Ready to Transform Your Gym?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Join thousands of successful gym owners who trust GymSync to manage and grow their business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 hover:scale-105"
                  >
                    Start Free Trial
                    <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    Schedule Demo
                    <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </Link>
                </div>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 max-w-md">
                {[
                  { number: "500+", label: "Gyms Using GymSync" },
                  { number: "50k+", label: "Active Members" },
                  { number: "98%", label: "Customer Satisfaction" },
                  { number: "24/7", label: "Customer Support" }
                ].map((stat, index) => (
                  <div key={index} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">GymSync</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Transforming the way fitness facilities operate with smart, integrated management solutions.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', href: '#', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
                  { name: 'Facebook', href: '#', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                  { name: 'Instagram', href: '#', icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z' },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={item.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {['About Us', 'Features', 'Pricing', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and features.
              </p>
              <form className="space-y-3">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} GymSync. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
