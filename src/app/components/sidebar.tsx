"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  LayoutDashboard,
  Users,
  UserCircle,
  BarChart2,
  Building2,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/gym-owner', isActive: true },
    { icon: Users, label: 'Trainers', href: '/dashboard/gym-owner/trainers' },
    { icon: UserCircle, label: 'Members', href: '/dashboard/members' },
    { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Building2, label: 'Facilities', href: '/dashboard/facilities' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#151C2C] border-r border-gray-800">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex flex-col">
          <h1 className="text-xl font-bold text-white">GymSync</h1>
          <p className="text-xs text-gray-500">Fitness Management System</p>
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

      {/* Logout Button */}
      <div className="absolute bottom-8 px-4 w-full">
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
