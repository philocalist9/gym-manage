"use client";

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ChartOptions,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Search, Building2 } from 'lucide-react';
import { useWindowSize } from '@/app/hooks/useWindowSize';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface GymStats {
  totalMembers: number;
  activeMembers: number;
  revenue: number;
  trainers: number;
}

interface OverviewStats {
  totalGyms: number;
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

export default function SuperAdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  // Use the windowSize hook for responsiveness
  const { width: windowWidth } = useWindowSize();

  // Determine if on mobile
  const isMobile = windowWidth < 768;
  
  // Responsive chart options
  const getChartOptions = (title: string): ChartOptions<'bar' | 'line'> => {
    return {
      responsive: true,
      maintainAspectRatio: !isMobile,
      aspectRatio: isMobile ? 1 : 2,
      plugins: {
        legend: {
          position: isMobile ? 'bottom' : 'top',
          labels: {
            boxWidth: isMobile ? 12 : 20,
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        title: {
          display: true,
          text: title,
          font: {
            size: isMobile ? 14 : 16
          }
        },
      },
      scales: {
        y: {
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        }
      }
    };
  };

  // Mock data for demonstration
  const overviewStats: OverviewStats = {
    totalGyms: 50,
    totalUsers: 5000,
    totalRevenue: 250000,
    activeSubscriptions: 45,
  };

  // Sample revenue data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [18500, 22000, 19500, 24000, 25500, 28000],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };
  
  // Sample user growth data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [120, 145, 132, 155, 180, 205],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3,
        fill: true
      },
    ],
  };

  // Mock data for gym list
  const mockGymList = [
    { id: '1', name: 'Fitness Plus', location: 'New York', members: 350, revenue: 42000, status: 'Active' },
    { id: '2', name: 'PowerLift Gym', location: 'Los Angeles', members: 280, revenue: 36000, status: 'Active' },
    { id: '3', name: 'Elite Fitness', location: 'Chicago', members: 210, revenue: 27500, status: 'Pending' },
    { id: '4', name: 'FlexFit Center', location: 'Miami', members: 180, revenue: 22000, status: 'Active' },
    { id: '5', name: 'Iron Works Gym', location: 'Seattle', members: 160, revenue: 19500, status: 'Suspended' }
  ];

  return (
    <div className="pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5">Super Admin Dashboard</h1>
      
      {/* Top stats cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-5">
        <div className="bg-[#151C2C] p-3 md:p-4 rounded-xl shadow">
          <h3 className="text-gray-400 text-sm mb-1">Total Gyms</h3>
          <p className="text-2xl md:text-3xl font-semibold">{overviewStats.totalGyms}</p>
          <div className="mt-1 md:mt-2 text-sm">
            <span className="text-green-500">+3</span> this month
          </div>
        </div>
        
        <div className="bg-[#151C2C] p-3 md:p-4 rounded-xl shadow">
          <h3 className="text-gray-400 text-sm mb-1">Total Users</h3>
          <p className="text-2xl md:text-3xl font-semibold">{overviewStats.totalUsers}</p>
          <div className="mt-1 md:mt-2 text-sm">
            <span className="text-green-500">+124</span> this month
          </div>
        </div>
        
        <div className="bg-[#151C2C] p-3 md:p-4 rounded-xl shadow">
          <h3 className="text-gray-400 text-sm mb-1">Revenue</h3>
          <p className="text-2xl md:text-3xl font-semibold">${overviewStats.totalRevenue.toLocaleString()}</p>
          <div className="mt-1 md:mt-2 text-sm">
            <span className="text-green-500">+8%</span> this month
          </div>
        </div>
        
        <div className="bg-[#151C2C] p-3 md:p-4 rounded-xl shadow">
          <h3 className="text-gray-400 text-sm mb-1">Active Subscriptions</h3>
          <p className="text-2xl md:text-3xl font-semibold">{overviewStats.activeSubscriptions}</p>
          <div className="mt-1 md:mt-2 text-sm">
            <span className="text-red-500">-12</span> this month
          </div>
        </div>
      </div>
      
      {/* Charts section - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-[#151C2C] p-3 md:p-4 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-2">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <div className="flex space-x-2 self-start">
              <button 
                onClick={() => setSelectedTimeRange('week')}
                className={`px-2 py-1 text-xs rounded-md ${selectedTimeRange === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setSelectedTimeRange('month')}
                className={`px-2 py-1 text-xs rounded-md ${selectedTimeRange === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
                }`}
              >
                Month
              </button>
              <button 
                onClick={() => setSelectedTimeRange('year')}
                className={`px-2 py-1 text-xs rounded-md ${selectedTimeRange === 'year' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
                }`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-[300px] md:h-[350px]">
            <Bar options={getChartOptions('Revenue Over Time')} data={revenueData} />
          </div>
        </div>
        
        <div className="bg-[#151C2C] p-3 md:p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3 md:mb-4">User Growth</h2>
          <div className="h-[300px] md:h-[350px]">
            <Line options={getChartOptions('User Growth Trend')} data={userGrowthData} />
          </div>
        </div>
      </div>
      
      {/* Gym listing section */}
      <div className="bg-[#151C2C] p-3 md:p-4 rounded-xl shadow mb-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold">Gym Overview</h2>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search gyms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A2234] text-gray-300 border border-gray-700 rounded-md p-2 pl-8 text-sm focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto -mx-3 md:-mx-4 px-3 md:px-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1A2234]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden sm:table-cell">Members</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {mockGymList.map((gym) => (
                <tr key={gym.id} className="hover:bg-[#1A2234]">
                  <td className="px-4 py-3 text-sm whitespace-nowrap">{gym.name}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">{gym.location}</td>
                  <td className="px-4 py-3 text-sm hidden sm:table-cell">{gym.members}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">${gym.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${gym.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        gym.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {gym.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-400 text-right">
          Showing 1 to {mockGymList.length} of {mockGymList.length} gyms
        </div>
      </div>
    </div>
  );
}
