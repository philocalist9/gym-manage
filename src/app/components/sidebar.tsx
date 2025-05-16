"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Apple,
  CreditCard,
  Target,
  Building2,
  DollarSign,
  PieChart,
  Search,
  ShieldAlert
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

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
    icon: DollarSign, 
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

export default function Sidebar() {
  const pathname = usePathname();
  const isTrainerDashboard = pathname.includes('/dashboard/trainer');
  const isMemberDashboard = pathname.includes('/dashboard/member');
  const isSuperAdminDashboard = pathname.includes('/dashboard/super-admin');

  const gymOwnerMenu: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/gym-owner', isActive: true },
    { icon: Users, label: 'Trainers', href: '/dashboard/gym-owner/trainers' },
    { icon: UserCircle, label: 'Members', href: '/dashboard/gym-owner/members' },
    { icon: Weight, label: 'Equipment', href: '/dashboard/gym-owner/equipment' },
    { icon: Activity, label: 'Machines', href: '/dashboard/gym-owner/machines' },
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
    { icon: Apple, label: 'Diet / Nutrition Log', href: '/dashboard/member/diet' },
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
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#151C2C] border-r border-gray-800">
      <div className="p-6">
        <Link 
          href={
            isSuperAdminDashboard 
              ? "/dashboard/super-admin" 
              : isTrainerDashboard 
              ? "/dashboard/trainer" 
              : isMemberDashboard 
              ? "/dashboard/member" 
              : "/dashboard/gym-owner"
          } 
          className="flex flex-col"
        >
          <h1 className="text-xl font-bold text-white">GymSync</h1>
          <p className="text-xs text-gray-500">
            {isSuperAdminDashboard 
              ? "Super Admin Portal" 
              : isTrainerDashboard 
              ? "Trainer Portal" 
              : isMemberDashboard 
              ? "Member Portal" 
              : "Management System"}
          </p>
        </Link>
      </div>

      <nav className="px-4 mt-2">
        {menuItems.map((item) => (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors
                ${pathname === item.href 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1A2234]'
                }`}
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

      <div className="absolute bottom-8 px-4 w-full space-y-1">
        {isMemberDashboard && memberBottomMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${pathname === item.href 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#1A2234]'
              }`}
          >
            <item.icon className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
        
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-[#1A2234] mt-4"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </div>
  );
}
