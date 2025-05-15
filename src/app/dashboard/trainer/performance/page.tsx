"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Target, Activity } from "lucide-react";

interface Analytics {
  totalClients: number;
  activeClients: number;
  completedSessions: number;
  scheduledSessions: number;
  averageRating: number;
  sessionCompletionRate: number;
  goalAchievementRate: number;
  clientRetentionRate: number;
}

interface ChartData {
  labels: string[];
  data: number[];
}

export default function PerformancePage() {
  const [analytics] = useState<Analytics>({
    totalClients: 25,
    activeClients: 18,
    completedSessions: 156,
    scheduledSessions: 180,
    averageRating: 4.8,
    sessionCompletionRate: 87,
    goalAchievementRate: 75,
    clientRetentionRate: 92
  });

  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'quarter'>('month');

  const sessionTrends: ChartData = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12, 15, 10, 14, 16, 8, 6]
  }), []);

  const clientProgress: ChartData = useMemo(() => ({
    labels: ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Athletic'],
    data: [85, 78, 92, 88]
  }), []);

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Performance Analytics</h1>
        <p className="text-gray-400">Track your training impact and client progress</p>
      </div>

      {/* Time Filter */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTimeFilter('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFilter === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-[#151C2C] text-gray-400 hover:text-white'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeFilter('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFilter === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-[#151C2C] text-gray-400 hover:text-white'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeFilter('quarter')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFilter === 'quarter'
              ? 'bg-blue-600 text-white'
              : 'bg-[#151C2C] text-gray-400 hover:text-white'
          }`}
        >
          This Quarter
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#151C2C] rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm">+12%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Active Clients</p>
          <h3 className="text-2xl font-semibold text-white">{analytics.activeClients}</h3>
          <p className="text-sm text-gray-400 mt-1">out of {analytics.totalClients} total</p>
        </div>

        <div className="bg-[#151C2C] rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm">-3%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Session Completion</p>
          <h3 className="text-2xl font-semibold text-white">{analytics.sessionCompletionRate}%</h3>
          <p className="text-sm text-gray-400 mt-1">{analytics.completedSessions} of {analytics.scheduledSessions}</p>
        </div>

        <div className="bg-[#151C2C] rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm">+8%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Goal Achievement</p>
          <h3 className="text-2xl font-semibold text-white">{analytics.goalAchievementRate}%</h3>
          <p className="text-sm text-gray-400 mt-1">Client success rate</p>
        </div>

        <div className="bg-[#151C2C] rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm">+5%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Client Retention</p>
          <h3 className="text-2xl font-semibold text-white">{analytics.clientRetentionRate}%</h3>
          <p className="text-sm text-gray-400 mt-1">Monthly average</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Trends */}
        <div className="bg-[#151C2C] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Session Trends</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {sessionTrends.data.map((value, index) => (
              <div key={index} className="flex-1">
                <div 
                  className="bg-blue-500/20 hover:bg-blue-500/30 transition-colors rounded-t-lg"
                  style={{ height: `${(value / 20) * 100}%` }}
                />
                <p className="text-center text-sm text-gray-400 mt-2">
                  {sessionTrends.labels[index]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Client Progress */}
        <div className="bg-[#151C2C] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Client Progress</h3>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="space-y-4">
            {clientProgress.labels.map((label, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-200">{clientProgress.data[index]}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${clientProgress.data[index]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
