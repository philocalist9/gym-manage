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
  Target
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isTrainerDashboard = pathname.includes('/dashboard/trainer');
  const isMemberDashboard = pathname.includes('/dashboard/member');

  const gymOwnerMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/gym-owner', isActive: true },
    { icon: Users, label: 'Trainers', href: '/dashboard/gym-owner/trainers' },
    { icon: UserCircle, label: 'Members', href: '/dashboard/gym-owner/members' },
    { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const trainerMenu = [
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

  const memberMenu = [
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

  const memberBottomMenu = [
    { icon: UserCircle, label: 'Profile Page', href: '/dashboard/member/profile' },
  ];

  const menuItems = isMemberDashboard ? memberMenu : isTrainerDashboard ? trainerMenu : gymOwnerMenu;

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#151C2C] border-r border-gray-800">
      {/* Logo */}
      <div className="p-6">
        <Link href={isTrainerDashboard ? "/dashboard/trainer" : isMemberDashboard ? "/dashboard/member" : "/dashboard/gym-owner"} className="flex flex-col">
          <h1 className="text-xl font-bold text-white">GymSync</h1>
          <p className="text-xs text-gray-500">{isTrainerDashboard ? "Trainer Portal" : isMemberDashboard ? "Member Portal" : "Management System"}</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-4 mt-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
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
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 px-4 w-full space-y-1">
        {isMemberDashboard && memberBottomMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${pathname === item.href 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-gray-400 hover:text-white hover:bg-[#1A2234]'
              }`}
          >
            <item.icon className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}

        {/* Logout Button */}
        <button 
          className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 w-full rounded-lg hover:bg-[#1A2234] transition-colors"
          onClick={() => {/* TODO: Implement logout */}}
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
