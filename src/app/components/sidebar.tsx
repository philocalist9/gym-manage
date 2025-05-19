"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  Users,
  UserCircle,
  BarChart2,
  Calendar,
  ClipboardList,
  Settings,
  LogOut,
  MessageSquare,
  Activity,
  Weight,
  CalendarClock,
  CheckSquare,
  CreditCard,
  Target,
  Building2,
  IndianRupee,
  PieChart,
  Search,
  ShieldAlert
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  description?: string;
  isActive?: boolean;
}

const superAdminMenuItems: MenuItem[] = [
  { 
    icon: LayoutDashboard, 
    label: 'Overview', 
    href: '/dashboard/super-admin',
    description: 'System overview and metrics'
  },
  { 
    icon: Users, 
    label: 'Users', 
    href: '/dashboard/super-admin/users',
    description: 'Manage system users and permissions'
  },
  { 
    icon: Building2, 
    label: 'Gyms', 
    href: '/dashboard/super-admin/gyms',
    description: 'Manage registered gyms'
  },
  { 
    icon: IndianRupee, 
    label: 'Revenue', 
    href: '/dashboard/super-admin/revenue',
    description: 'Financial analytics and reports'
  },
  { 
    icon: PieChart, 
    label: 'Analytics', 
    href: '/dashboard/super-admin/analytics',
    description: 'System performance metrics'
  },
  { 
    icon: ShieldAlert, 
    label: 'Security', 
    href: '/dashboard/super-admin/security',
    description: 'Security settings and logs'
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    href: '/dashboard/super-admin/settings',
    description: 'Global system configuration'
  }
];

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

export default function Sidebar({ isOpen = false, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Handle touch swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    // Minimum swipe distance to be considered a gesture (pixels)
    const minSwipeDistance = 50;
    
    if (touchStart - touchEnd > minSwipeDistance && toggleSidebar) {
      // Swipe left - close sidebar
      toggleSidebar();
    } else if (touchEnd - touchStart > minSwipeDistance && toggleSidebar && !isOpen) {
      // Swipe right - open sidebar (when closed)
      toggleSidebar();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  // Determine which dashboard we're in
  const isGymOwnerDashboard = pathname?.startsWith('/dashboard/gym-owner');
  const isTrainerDashboard = pathname?.startsWith('/dashboard/trainer');
  const isMemberDashboard = pathname?.startsWith('/dashboard/member');
  const isSuperAdminDashboard = pathname?.startsWith('/dashboard/super-admin');
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // The redirect is handled in the useAuth hook
    } catch (error) {
      console.error('Failed to logout:', error);
      setIsLoggingOut(false);
    }
  };

  const gymOwnerMenu: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/gym-owner', isActive: true },
    { icon: Users, label: 'Trainers', href: '/dashboard/gym-owner/trainers' },
    { icon: UserCircle, label: 'Members', href: '/dashboard/gym-owner/members' },
    { icon: Weight, label: 'Equipment', href: '/dashboard/gym-owner/equipment' },
    { icon: BarChart2, label: 'Analytics', href: '/dashboard/gym-owner/analytics' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/gym-owner/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/gym-owner/settings' },
  ];

  const trainerMenu: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/trainer' },
    { icon: Users, label: 'My Clients', href: '/dashboard/trainer/clients' },
    { icon: Calendar, label: 'Schedule', href: '/dashboard/trainer/schedule' },
    { icon: ClipboardList, label: 'Workout Plans', href: '/dashboard/trainer/workouts' },
    { icon: BarChart2, label: 'Performance', href: '/dashboard/trainer/performance' },
    { icon: Calendar, label: 'Session History', href: '/dashboard/trainer/history' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/trainer/messages' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/trainer/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/trainer/settings' },
  ];

  const memberMenu: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard Home', href: '/dashboard/member' },
    { icon: Calendar, label: 'Workout Schedule', href: '/dashboard/member/schedule' },
    { icon: Activity, label: 'Progress Tracker', href: '/dashboard/member/progress' },
    { icon: CalendarClock, label: 'Appointments', href: '/dashboard/member/appointments' },
    { icon: CheckSquare, label: 'Daily Health Check-In', href: '/dashboard/member/health' },
    { icon: CreditCard, label: 'Payment History', href: '/dashboard/member/payments' },
    { icon: MessageSquare, label: 'Chat with Trainer', href: '/dashboard/member/chat' },
    { icon: Target, label: 'Goal Tracker', href: '/dashboard/member/goals' },
  ];

  const memberBottomMenu: MenuItem[] = [
    { icon: UserCircle, label: 'Profile Page', href: '/dashboard/member/profile' },
  ];

  const menuItems = isSuperAdminDashboard 
    ? superAdminMenuItems 
    : isMemberDashboard 
    ? memberMenu 
    : isTrainerDashboard 
    ? trainerMenu 
    : gymOwnerMenu;

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#151C2C] border-r border-gray-800 z-40 transition-all duration-300 
        overflow-y-auto md:w-64 w-72 md:translate-x-0 shadow-lg ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Removed unnecessary padding div */}

      <nav className="px-4 py-4 overflow-y-auto max-h-[calc(100vh-7rem)]">
        {menuItems.map((item) => (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors
                ${pathname === item.href 
                  ? 'bg-blue-600 text-white font-medium shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1A2234]'
                }`}
              onClick={() => {
                // Close sidebar on mobile when navigating
                if (toggleSidebar && window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
            >
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm">{item.label}</span>
            </Link>
            {isSuperAdminDashboard && item.description && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded w-48 z-50"
                aria-hidden="true"
              >
                {item.description}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sticky bottom-0 px-4 py-3 w-full space-y-1 mt-4 bg-[#151C2C] border-t border-gray-800">
        {isMemberDashboard && memberBottomMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${pathname === item.href 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#1A2234]'
              }`}
            onClick={() => {
              // Close sidebar on mobile when navigating
              if (toggleSidebar && window.innerWidth < 768) {
                toggleSidebar();
              }
            }}
          >
            <item.icon className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-[#1A2234] mt-2 w-full text-left"
          disabled={isLoggingOut}
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
