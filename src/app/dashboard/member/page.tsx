"use client";

import React from 'react';
import { 
  Activity, 
  Calendar, 
  Weight, 
  User, 
  Droplets, 
  Moon, 
  DollarSign, 
  MessageSquare, 
  Target,
  Pizza
} from 'lucide-react';
import { formatDate } from '@/app/utils/date-utils';
import WorkoutSummaryWidget from './components/workout-summary-widget';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Member {
  name: string;
  plan: string;
  trainerName: string;
  nextSession: string;
  healthStats: {
    weight: number;
    waterIntake: number;
    sleep: number;
    mood: string;
  };
}

const progressData = [
  { month: 'Jan', weight: 80, bodyFat: 25, muscle: 32 },
  { month: 'Feb', weight: 78, bodyFat: 24, muscle: 33 },
  { month: 'Mar', weight: 77, bodyFat: 23, muscle: 34 },
  { month: 'Apr', weight: 76, bodyFat: 22, muscle: 35 },
  { month: 'May', weight: 75, bodyFat: 21, muscle: 36 },
];

export default function MemberDashboard() {
  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Member Dashboard</h1>
          <p className="text-gray-400">Welcome back, John</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-[#151C2C] rounded-lg text-gray-200">
            <p className="text-sm text-gray-400">Current Plan</p>
            <p className="font-medium">Premium Membership</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Today's Weight</div>
            <Weight className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">75 kg</div>
          <div className="text-sm text-green-500 mt-2">-0.5 kg this week</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Next Session</div>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-xl font-semibold text-white">3:00 PM</div>
          <div className="text-sm text-blue-500 mt-2">with Trainer Mike</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Daily Goals</div>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">3/5</div>
          <div className="text-sm text-yellow-500 mt-2">60% completed</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Calories Today</div>
            <Pizza className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">1,800</div>
          <div className="text-sm text-green-500 mt-2">Within target</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Workout Summary */}
        <WorkoutSummaryWidget />
        
        {/* Progress Chart */}
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-4">Progress Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                <XAxis dataKey="month" stroke="#4B5563" />
                <YAxis stroke="#4B5563" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="bodyFat" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="muscle" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-[#1A2234] rounded-lg hover:bg-[#1F2937] transition-colors">
              <Weight className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="text-white font-medium">Log Health</h4>
              <p className="text-sm text-gray-400">Track daily stats</p>
            </button>
            <button className="p-4 bg-[#1A2234] rounded-lg hover:bg-[#1F2937] transition-colors">
              <Calendar className="w-6 h-6 text-green-500 mb-2" />
              <h4 className="text-white font-medium">Book Session</h4>
              <p className="text-sm text-gray-400">Schedule training</p>
            </button>
            <button className="p-4 bg-[#1A2234] rounded-lg hover:bg-[#1F2937] transition-colors">
              <MessageSquare className="w-6 h-6 text-yellow-500 mb-2" />
              <h4 className="text-white font-medium">Message</h4>
              <p className="text-sm text-gray-400">Chat with trainer</p>
            </button>
            <button className="p-4 bg-[#1A2234] rounded-lg hover:bg-[#1F2937] transition-colors">
              <Target className="w-6 h-6 text-red-500 mb-2" />
              <h4 className="text-white font-medium">Set Goals</h4>
              <p className="text-sm text-gray-400">Update targets</p>
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button className="bg-[#151C2C] p-6 rounded-xl hover:bg-[#1A2234] transition-colors text-left">
          <User className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className="text-white font-medium">Profile</h3>
          <p className="text-sm text-gray-400">View and edit details</p>
        </button>
        <button className="bg-[#151C2C] p-6 rounded-xl hover:bg-[#1A2234] transition-colors text-left">
          <Activity className="w-6 h-6 text-yellow-500 mb-2" />
          <h3 className="text-white font-medium">Workouts</h3>
          <p className="text-sm text-gray-400">View schedule</p>
        </button>
        <button className="bg-[#151C2C] p-6 rounded-xl hover:bg-[#1A2234] transition-colors text-left">
          <DollarSign className="w-6 h-6 text-purple-500 mb-2" />
          <h3 className="text-white font-medium">Payments</h3>
          <p className="text-sm text-gray-400">Billing history</p>
        </button>
      </div>
    </div>
  );
}
