"use client";

import React, { useState } from 'react';
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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  CreditCard,
  TrendingUp,
  BadgeIndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
} from 'lucide-react';

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

// Helper function to format numbers in Indian currency format
const formatIndianRupees = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState('month');
  const [revenueMetrics, setRevenueMetrics] = useState({
    totalRevenue: 15000000, // 15 Lakhs
    monthlyGrowth: 12.5,
    averageRevenue: 500000, // 5 Lakhs
    topGymRevenue: 200000, // 2 Lakhs
  });

  const mockMonthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200000, 1500000, 1300000, 1700000, 1600000, 1800000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const mockRevenueSourcesData = {
    labels: ['Memberships', 'Personal Training', 'Supplements', 'Equipment', 'Other'],
    datasets: [
      {
        label: 'Revenue by Source',
        data: [800000, 400000, 200000, 150000, 100000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topPerformingGyms = [
    { id: 1, name: "FitZone Plus", revenue: 1800000, growth: 15.2 },
    { id: 2, name: "PowerHouse Gym", revenue: 1500000, growth: 12.8 },
    { id: 3, name: "Elite Fitness", revenue: 1200000, growth: -2.5 },
    { id: 4, name: "FlexFit Studio", revenue: 1000000, growth: 8.7 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Revenue Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and analyze system-wide revenue metrics</p>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatIndianRupees(revenueMetrics.totalRevenue)}
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{revenueMetrics.monthlyGrowth}% increase</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Average</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatIndianRupees(revenueMetrics.averageRevenue)}
              </h3>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top Gym Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatIndianRupees(revenueMetrics.topGymRevenue)}
              </h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5,234</h3>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <Line
            data={mockMonthlyData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += formatIndianRupees(context.parsed.y);
                      }
                      return label;
                    }
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: function(value) {
                      return formatIndianRupees(value as number);
                    }
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Sources</h3>
          <Bar
            data={mockRevenueSourcesData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += formatIndianRupees(context.parsed.y);
                      }
                      return label;
                    }
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: function(value) {
                      return formatIndianRupees(value as number);
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Top Performing Gyms */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Gyms</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gym Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topPerformingGyms.map((gym) => (
                  <tr key={gym.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {gym.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatIndianRupees(gym.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${gym.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {gym.growth >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        <span className="text-sm font-medium">{Math.abs(gym.growth)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
