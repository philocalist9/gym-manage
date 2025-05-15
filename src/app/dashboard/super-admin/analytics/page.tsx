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
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Users,
  Activity,
  Dumbbell,
  Calendar,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
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

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  userGrowth: number;
  avgSessionsPerDay: number;
  systemUptime: number;
  errorRate: number;
}

interface UserActivityData {
  logins: number[];
  sessions: number[];
  labels: string[];
}

interface UserDistribution {
  labels: string[];
  data: number[];
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 5234,
    activeUsers: 3845,
    userGrowth: 12.5,
    avgSessionsPerDay: 1250,
    systemUptime: 99.98,
    errorRate: 0.02,
  });

  // Mock data for user activity trends
  const userActivityData: UserActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    logins: [1200, 1350, 1250, 1400, 1300, 900, 800],
    sessions: [2400, 2600, 2500, 2800, 2700, 1800, 1600],
  };

  // Mock data for user type distribution
  const userDistribution: UserDistribution = {
    labels: ['Members', 'Trainers', 'Gym Owners', 'Admins'],
    data: [3500, 850, 150, 20],
  };

  // Peak usage hours data
  const peakHoursData = {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [
      {
        label: 'Active Users',
        data: [250, 480, 320, 390, 520, 280],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor system performance and user engagement metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.activeUsers.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{metrics.userGrowth}% increase</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Sessions</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.avgSessionsPerDay.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">System Uptime</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.systemUptime}%
              </h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Error Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.errorRate}%
              </h3>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* User Activity Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Activity</h3>
          <Line
            data={{
              labels: userActivityData.labels,
              datasets: [
                {
                  label: 'Logins',
                  data: userActivityData.logins,
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                  label: 'Sessions',
                  data: userActivityData.sessions,
                  borderColor: 'rgb(53, 162, 235)',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
              },
            }}
          />
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={{
                labels: userDistribution.labels,
                datasets: [
                  {
                    data: userDistribution.data,
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(153, 102, 255, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                    ],
                    borderColor: [
                      'rgb(54, 162, 235)',
                      'rgb(75, 192, 192)',
                      'rgb(153, 102, 255)',
                      'rgb(255, 99, 132)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'right' as const },
                },
              }}
            />
          </div>
        </div>

        {/* Peak Usage Hours */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peak Usage Hours</h3>
          <Bar
            data={peakHoursData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      {/* System Health Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">API Response Time</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">245ms</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Database Load</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">42%</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">68%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
