"use client";

import React, { useState } from "react";
import { Activity, Calendar, Clock, Dumbbell, Users, Wallet } from "lucide-react";
import { formatDate } from "@/app/utils/date-utils";
import { useAuth } from "@/app/hooks/useAuth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Client {
  id: string;
  name: string;
  progress: number;
  nextSession: string;
  plan: string;
}

interface Session {
  id: string;
  clientName: string;
  time: string;
  duration: string;
  type: string;
}

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [clients] = useState<Client[]>([
    {
      id: "1",
      name: "John Doe",
      progress: 75,
      nextSession: "2025-05-16",
      plan: "Weight Training"
    },
    {
      id: "2",
      name: "Sarah Smith",
      progress: 60,
      nextSession: "2025-05-17",
      plan: "HIIT"
    },
    {
      id: "3",
      name: "Mike Johnson",
      progress: 85,
      nextSession: "2025-05-15",
      plan: "Strength Training"
    }
  ]);

  const [sessions] = useState<Session[]>([
    {
      id: "1",
      clientName: "John Doe",
      time: "09:00 AM",
      duration: "1 hour",
      type: "Weight Training"
    },
    {
      id: "2",
      clientName: "Sarah Smith",
      time: "11:00 AM",
      duration: "45 min",
      type: "HIIT"
    },
    {
      id: "3",
      clientName: "Mike Johnson",
      time: "02:00 PM",
      duration: "1 hour",
      type: "Strength Training"
    }
  ]);

  const performanceData = [
    { month: "Jan", sessions: 45, earnings: 2200 },
    { month: "Feb", sessions: 52, earnings: 2600 },
    { month: "Mar", sessions: 48, earnings: 2400 },
    { month: "Apr", sessions: 58, earnings: 2900 },
    { month: "May", sessions: 50, earnings: 2500 },
  ];

  const clientProgressData = [
    { name: "Week 1", average: 65 },
    { name: "Week 2", average: 68 },
    { name: "Week 3", average: 72 },
    { name: "Week 4", average: 75 },
  ];

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Trainer Dashboard</h1>
          <p className="text-gray-400 text-sm md:text-base">Welcome back, {user?.name || "Trainer"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-[#151C2C] rounded-lg text-gray-200">
            <p className="text-sm text-gray-400">Gym</p>
            <p className="font-medium">{user?.gymName || "Loading..."}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Total Clients</div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{clients.length}</div>
          <div className="text-sm text-green-500 mt-2">+2 this month</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Sessions Today</div>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{sessions.length}</div>
          <div className="text-sm text-blue-500 mt-2">Next: {sessions[0]?.time}</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Hours This Week</div>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">24</div>
          <div className="text-sm text-yellow-500 mt-2">80% of target</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Monthly Earnings</div>
            <Wallet className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">₹2,500</div>
          <div className="text-sm text-green-500 mt-2">+12% from last month</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-4">Performance Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                <XAxis dataKey="month" stroke="#4B5563" />
                <YAxis stroke="#4B5563" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-4">Client Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                <XAxis dataKey="name" stroke="#4B5563" />
                <YAxis stroke="#4B5563" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar dataKey="average" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Today's Sessions */}
      <div className="bg-[#151C2C] rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Today's Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-gray-400 text-sm">
              <tr className="border-b border-gray-800">
                <th className="text-left pb-3">Client</th>
                <th className="text-left pb-3">Time</th>
                <th className="text-left pb-3">Duration</th>
                <th className="text-left pb-3">Type</th>
                <th className="text-left pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sessions.map((session) => (
                <tr key={session.id} className="text-gray-200">
                  <td className="py-4">{session.clientName}</td>
                  <td className="py-4">{session.time}</td>
                  <td className="py-4">{session.duration}</td>
                  <td className="py-4">{session.type}</td>
                  <td className="py-4">
                    <button className="px-3 py-1 text-sm text-blue-500 hover:text-blue-400 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Clients */}
      <div className="bg-[#151C2C] rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Active Clients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {client.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-white font-medium">{client.name}</p>
                  <p className="text-sm text-gray-400">{client.plan}</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-200">{client.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Next Session: {formatDate(client.nextSession)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
