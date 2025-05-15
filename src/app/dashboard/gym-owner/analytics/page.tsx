"use client";

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Clock,
  Dumbbell,
  Target,
  Activity
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function GymOwnerAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  // Mock data for metrics
  const metrics = {
    totalMembers: 450,
    activeMembers: 380,
    monthlyRevenue: 850000,
    yearlyRevenue: 9500000,
    membershipGrowth: 15,
    trainerUtilization: 85,
    equipmentUtilization: 75,
    customerSatisfaction: 92
  };

  // Revenue data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: [720000, 780000, 800000, 820000, 850000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
    ]
  };

  // Membership growth data
  const membershipData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'New Members',
        data: [45, 52, 48, 55, 50],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
      },
      {
        label: 'Cancellations',
        data: [10, 8, 12, 7, 9],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
      }
    ]
  };

  // Peak hours data
  const peakHoursData = {
    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
    datasets: [
      {
        label: 'Average Members',
        data: [25, 85, 45, 35, 30, 45, 90, 75, 20],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
      }
    ]
  };

  // Equipment utilization data
  const equipmentData = {
    labels: ['Cardio Area', 'Weight Area', 'Functional Zone', 'Studios', 'Pool'],
    datasets: [{
      data: [30, 35, 15, 10, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(249, 115, 22, 0.5)',
        'rgba(99, 102, 241, 0.5)',
        'rgba(236, 72, 153, 0.5)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(249, 115, 22)',
        'rgb(99, 102, 241)',
        'rgb(236, 72, 153)'
      ]
    }]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your gym&apos;s performance metrics</p>
        </div>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Members */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.totalMembers}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +{metrics.membershipGrowth}% growth
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(metrics.monthlyRevenue / 1000).toFixed(0)}K
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +8% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Trainer Utilization */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trainer Utilization</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.trainerUtilization}%
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                +5% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Equipment Utilization */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Equipment Utilization</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.equipmentUtilization}%
              </h3>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                High efficiency
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Dumbbell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <Line
            data={revenueData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `₹${value/1000}K`
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'top' as const,
                }
              }
            }}
          />
        </div>

        {/* Membership Growth */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Membership Growth</h3>
          <Bar
            data={membershipData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                }
              }
            }}
          />
        </div>

        {/* Peak Hours Analysis */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peak Hours Analysis</h3>
          <Bar
            data={peakHoursData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                }
              }
            }}
          />
        </div>

        {/* Equipment Utilization */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Equipment Utilization</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={equipmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
