"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  toggleSidebar?: () => void;
  isOpen?: boolean;
}

export default function Navbar({ toggleSidebar, isOpen = false }: NavbarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  // Determine which dashboard we're in
  const isGymOwnerDashboard = pathname?.startsWith('/dashboard/gym-owner');
  const isTrainerDashboard = pathname?.startsWith('/dashboard/trainer');
  const isMemberDashboard = pathname?.startsWith('/dashboard/member');
  const isSuperAdminDashboard = pathname?.startsWith('/dashboard/super-admin');
  
  const getDashboardName = () => {
    if (isSuperAdminDashboard) return "Super Admin Portal";
    if (isTrainerDashboard) return "Trainer Portal";
    if (isMemberDashboard) return "Member Portal";
    return "GymSync Management";
  }
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const dashboardLink = isSuperAdminDashboard
    ? "/dashboard/super-admin"
    : isTrainerDashboard
    ? "/dashboard/trainer"
    : isMemberDashboard
    ? "/dashboard/member"
    : "/dashboard/gym-owner";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#151C2C] border-b border-gray-800 z-50 flex items-center justify-between px-4 md:px-6 shadow-md">
      {/* Left section with hamburger and logo */}
      <div className="flex items-center space-x-3">
        {/* Mobile hamburger button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-white hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        
        {/* Logo */}
        <Link href={dashboardLink} className="flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded mr-2">
            <span className="font-bold text-xl">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GymSync</h1>
            <p className="text-xs text-gray-400">{getDashboardName()}</p>
          </div>
        </Link>
      </div>
      
      {/* Right section with notifications and user actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications - hidden on mobile */}
        <button className="p-2 text-gray-400 hover:text-white rounded-full hidden md:block">
          <Bell size={20} />
        </button>
        
        {/* User profile - hidden on mobile */}
        <Link href={`${dashboardLink}/profile`} className="p-2 text-gray-400 hover:text-white rounded-full hidden md:block">
          <User size={20} />
        </Link>
        
        {/* Session status indicator */}
        <div className="hidden md:block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          Session active
        </div>
        
        {/* Mobile session indicator */}
        <div className="md:hidden px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          Active
        </div>
        
        {/* Logout Button - Only shown for non-super-admin */}
        {!isSuperAdminDashboard && (
          <button
            onClick={handleLogout}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-full"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </header>
  );
}
