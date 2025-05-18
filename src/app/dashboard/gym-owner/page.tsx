"use client";

import React, { useState, useEffect } from "react";
import { Bell, ChevronDown, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  revenue: number;
  newJoined: number;
}

interface GymData {
  _id: string;
  gymName: string;
  ownerName: string;
  address: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
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
  const router = useRouter();
  const [gymData, setGymData] = useState<GymData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const stats: DashboardStats = {
    totalMembers: 650,
    activeMembers: 420,
    revenue: 52000,
    newJoined: 35,
  };
  
  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const response = await fetch('/api/gym');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, redirect to login
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch gym data');
        }
        
        const data = await response.json();
        setGymData(data.gym);
        
      } catch (err: any) {
        console.error('Error fetching gym data:', err);
        setError(err.message || 'An error occurred while fetching gym data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGymData();
  }, [router]);

  return (
    <div className="pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Gym Owner Dashboard</h1>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 md:h-64 bg-[#151C2C] rounded-lg p-4 md:p-6">
          <Loader2 className="h-8 w-8 md:h-10 md:w-10 text-blue-600 animate-spin mb-3" />
          <p className="text-gray-400 text-sm md:text-base">Loading dashboard data...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-[#151C2C] rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center p-3 md:p-4 bg-red-900/20 rounded-lg border border-red-800/30">
            <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-red-500 mr-2 md:mr-3" />
            <p className="text-red-400 text-sm md:text-base">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 mx-auto block px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
            
      {!loading && !error && (
        <>
          {/* Gym Information Banner - improved mobile responsiveness */}
          <div className="bg-[#151C2C] rounded-lg p-4 md:p-5 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3">{gymData?.gymName || 'Your Gym'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-center">
                <div className="min-w-8 h-8 md:min-w-9 md:h-9 bg-blue-600/20 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                </div>
                      <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-medium">
                    <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs ${
                      gymData?.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {gymData?.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="min-w-8 h-8 md:min-w-9 md:h-9 bg-purple-600/20 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-xs md:text-sm font-medium truncate max-w-[200px]">{gymData?.email || 'No email available'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="min-w-8 h-8 md:min-w-9 md:h-9 bg-teal-600/20 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-xs md:text-sm font-medium">{gymData?.phone || 'No phone available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - improved mobile spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
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

          {/* Content Sections - improved responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-[#151C2C] rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h3 className="text-base md:text-lg font-semibold">Revenue Overview</h3>
                <select className="bg-[#1A2234] text-gray-400 text-xs sm:text-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-800 w-full sm:w-auto">
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
            <div className="bg-[#151C2C] rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base md:text-lg font-semibold">Recent Activity</h3>
                <button className="text-blue-500 text-xs sm:text-sm hover:text-blue-400 flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-full mt-0.5
                      ${activity.type === 'new_member' ? 'bg-green-500/10 text-green-500' :
                        activity.type === 'payment' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-purple-500/10 text-purple-500'}`}
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">{activity.name}</span>
                        {' '}{activity.action}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Chart */}
            <div className="lg:col-span-3 bg-[#151C2C] rounded-lg p-3 sm:p-4 mt-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h3 className="text-base md:text-lg font-semibold">Gym Activity</h3>
                <select className="bg-[#1A2234] text-gray-400 text-xs sm:text-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-800 w-full sm:w-auto">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>
              <div className="h-[250px] sm:h-[280px] md:h-[300px] w-full">
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
              </>
            )}
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
    <div className="bg-[#151C2C] p-3 sm:p-4 md:p-5 rounded-lg">
      <h3 className={`${color} text-xs sm:text-sm font-medium`}>{title}</h3>
      <div className="flex items-center justify-between mt-2 md:mt-3">
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
          {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </p>
        <div className={`text-xs sm:text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </div>
      </div>
    </div>
  );
}

interface ActivityProps {
  activity: {
    id: number;
    type: string;
    name: string;
    action: string;
    time: string;
  };
}

function Activity({ activity }: ActivityProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-full mt-0.5 ${
        activity.type === 'new_member' ? 'bg-green-500/10 text-green-500' :
        activity.type === 'payment' ? 'bg-blue-500/10 text-blue-500' :
        'bg-purple-500/10 text-purple-500'
      }`}>
        <div className="w-2 h-2 rounded-full bg-current" />
      </div>
      <div>
        <p className="text-sm">
          <span className="font-medium">{activity.name}</span>
          {' '}{activity.action}
        </p>
        <p className="text-xs text-gray-400">{activity.time}</p>
      </div>
    </div>
  );
}
