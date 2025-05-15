"use client";

import React from "react";
import Sidebar from "@/app/components/sidebar";
import { Bell, ChevronDown, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  revenue: number;
  newJoined: number;
}

const revenueData = [
  { name: 'Jan', revenue: 35000 },
  { name: 'Feb', revenue: 42000 },
  { name: 'Mar', revenue: 38000 },
  { name: 'Apr', revenue: 45000 },
  { name: 'May', revenue: 52000 },
];

const activityData = [
  { name: 'Mon', visits: 120 },
  { name: 'Tue', visits: 150 },
  { name: 'Wed', visits: 180 },
  { name: 'Thu', visits: 140 },
  { name: 'Fri', visits: 200 },
  { name: 'Sat', visits: 220 },
  { name: 'Sun', visits: 160 },
];

const recentActivities = [
  {
    id: 1,
    type: 'new_member',
    name: 'John Doe',
    action: 'joined as a new member',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'payment',
    name: 'Sarah Smith',
    action: 'made a payment of $150',
    time: '3 hours ago',
  },
  {
    id: 3,
    type: 'session',
    name: 'Mike Johnson',
    action: 'completed a training session',
    time: '5 hours ago',
  },
];

export default function GymOwnerDashboard() {
  const stats: DashboardStats = {
    totalMembers: 650,
    activeMembers: 420,
    revenue: 52000,
    newJoined: 35,
  };

  return (
    <div className="min-h-screen bg-[#0B101B] text-white">
      <div className="flex">
        {/* Sidebar component will be rendered separately */}
        <main className="flex-1">
          {/* Header/Navigation */}
          <nav className="h-16 border-b border-gray-800 px-8 flex items-center justify-between bg-[#151C2C]">
            <h1 className="text-xl font-semibold">Gym Owner Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#1A2234] rounded-full relative">
                <Bell className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#151C2C]"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  M
                </div>
                <span className="text-sm text-gray-200">Welcome, Mock gymOwner</span>
                <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="p-8 bg-[#0B101B]">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Members"
                value={stats.totalMembers}
                trend="+2.5%"
                trendUp={true}
                color="text-gray-400"
              />
              <StatCard
                title="Active Members"
                value={stats.activeMembers}
                trend="+3.2%"
                trendUp={true}
                color="text-gray-400"
              />
              <StatCard
                title="Revenue"
                value={stats.revenue}
                trend="+5.1%"
                trendUp={true}
                isCurrency={true}
                color="text-gray-400"
              />
              <StatCard
                title="New Joined"
                value={stats.newJoined}
                trend="+1.2%"
                trendUp={true}
                color="text-gray-400"
              />
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-[#151C2C] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                  <select className="bg-[#1A2234] text-gray-400 text-sm rounded-lg px-3 py-1.5 border border-gray-800">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A2234',
                          border: 'none',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#151C2C] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <button className="text-blue-500 text-sm hover:text-blue-400 flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full mt-0.5
                        ${activity.type === 'new_member' ? 'bg-green-500/10 text-green-500' :
                          activity.type === 'payment' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-purple-500/10 text-purple-500'}`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.name}</span>
                          {' '}{activity.action}
                        </p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Chart */}
              <div className="lg:col-span-3 bg-[#151C2C] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Gym Activity</h3>
                  <select className="bg-[#1A2234] text-gray-400 text-sm rounded-lg px-3 py-1.5 border border-gray-800">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#1A2234',
                          border: 'none',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  trend: string;
  trendUp: boolean;
  isCurrency?: boolean;
  color?: string;
}

function StatCard({ title, value, trend, trendUp, isCurrency = false, color }: StatCardProps) {
  return (
    <div className="bg-[#151C2C] p-5 rounded-xl">
      <h3 className={`${color} text-sm font-medium`}>{title}</h3>
      <div className="flex items-center justify-between mt-3">
        <p className="text-2xl font-semibold text-white">
          {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </p>
        <div className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </div>
      </div>
    </div>
  );
}
