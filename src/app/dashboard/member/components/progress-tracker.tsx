"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Scale, Percent, Trophy } from 'lucide-react';

interface ProgressData {
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
}

interface ProgressTrackerProps {
  data: ProgressData[];
}

export default function ProgressTracker({ data }: ProgressTrackerProps) {
  const currentStats = data[data.length - 1];
  const previousStats = data[data.length - 2];

  const calculateChange = (current: number, previous: number) => {
    const change = current - previous;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  const stats = [
    {
      title: 'Current Weight',
      value: `${currentStats.weight} kg`,
      icon: <Scale className="w-5 h-5 text-blue-500" />,
      change: calculateChange(currentStats.weight, previousStats.weight),
      isGoodIfLower: true
    },
    {
      title: 'Body Fat',
      value: `${currentStats.bodyFat}%`,
      icon: <Percent className="w-5 h-5 text-red-500" />,
      change: calculateChange(currentStats.bodyFat, previousStats.bodyFat),
      isGoodIfLower: true
    },
    {
      title: 'Muscle Mass',
      value: `${currentStats.muscle}%`,
      icon: <Trophy className="w-5 h-5 text-green-500" />,
      change: calculateChange(currentStats.muscle, previousStats.muscle),
      isGoodIfLower: false
    }
  ];

  return (
    <div className="p-6 bg-[#151C2C] rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-6">Progress Tracker</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400">{stat.title}</div>
              {stat.icon}
            </div>
            <div className="text-2xl font-semibold text-white mb-1">{stat.value}</div>
            <div className={`text-sm ${
              (stat.isGoodIfLower && !stat.change.isPositive) || 
              (!stat.isGoodIfLower && stat.change.isPositive)
                ? 'text-green-500'
                : 'text-red-500'
            }`}>
              {stat.change.isPositive ? '+' : '-'}{stat.change.value}
            </div>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
            <XAxis 
              dataKey="date" 
              stroke="#4B5563"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-GB', { 
                month: 'short',
                day: 'numeric'
              })}
            />
            <YAxis stroke="#4B5563" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value: number) => [`${value}`, '']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Weight (kg)"
            />
            <Line 
              type="monotone" 
              dataKey="bodyFat" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Body Fat %"
            />
            <Line 
              type="monotone" 
              dataKey="muscle" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Muscle Mass %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
