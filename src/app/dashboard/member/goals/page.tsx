"use client";

import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  ChevronDown, 
  Trophy, 
  Calendar,
  Activity,
  Dumbbell,
  Scale,
  Clock,
  CheckCircle2,
  XCircle,
  Circle
} from 'lucide-react';
import { formatShortDate, formatChartDate } from '@/app/utils/date-formatting';

interface Goal {
  id: string;
  title: string;
  category: 'strength' | 'cardio' | 'weight' | 'measurement' | 'habit';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'missed';
  checkIns: {
    date: string;
    value: number;
  }[];
}

export default function GoalTracker() {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Bench Press Target',
      category: 'strength',
      target: 100,
      current: 80,
      unit: 'kg',
      deadline: '2025-08-15',
      progress: 80,
      status: 'in-progress',
      checkIns: [
        { date: '2025-05-01', value: 75 },
        { date: '2025-05-08', value: 77.5 },
        { date: '2025-05-15', value: 80 }
      ]
    },
    {
      id: '2',
      title: '5K Run Time',
      category: 'cardio',
      target: 25,
      current: 28,
      unit: 'minutes',
      deadline: '2025-07-01',
      progress: 70,
      status: 'in-progress',
      checkIns: [
        { date: '2025-05-01', value: 32 },
        { date: '2025-05-08', value: 30 },
        { date: '2025-05-15', value: 28 }
      ]
    },
    {
      id: '3',
      title: 'Weight Goal',
      category: 'weight',
      target: 75,
      current: 78,
      unit: 'kg',
      deadline: '2025-07-15',
      progress: 85,
      status: 'in-progress',
      checkIns: [
        { date: '2025-05-01', value: 80 },
        { date: '2025-05-08', value: 79 },
        { date: '2025-05-15', value: 78 }
      ]
    }
  ];

  const categoryIcons = {
    strength: <Dumbbell className="w-5 h-5 text-blue-500" />,
    cardio: <Activity className="w-5 h-5 text-red-500" />,
    weight: <Scale className="w-5 h-5 text-green-500" />,
    measurement: <Target className="w-5 h-5 text-purple-500" />,
    habit: <Clock className="w-5 h-5 text-yellow-500" />
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-blue-500" />;
    }
  };

  const categories = [
    { id: 'strength', label: 'Strength Goals', color: 'blue' },
    { id: 'cardio', label: 'Cardio Goals', color: 'red' },
    { id: 'weight', label: 'Weight Goals', color: 'green' },
    { id: 'measurement', label: 'Body Measurements', color: 'purple' },
    { id: 'habit', label: 'Workout Habits', color: 'yellow' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Goal Tracker</h1>
          <p className="text-gray-400">Set, track, and achieve your fitness goals</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Goal
        </button>
      </div>

      {/* Goal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}
            className={`bg-[#151C2C] p-6 rounded-xl transition-colors ${
              selectedCategory === category.id ? `border-2 border-${category.color}-500` : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400">{category.label}</div>
              {categoryIcons[category.id as keyof typeof categoryIcons]}
            </div>
            <div className="text-2xl font-semibold text-white">
              {goals.filter(g => g.category === category.id).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Active Goals</div>
          </button>
        ))}
      </div>

      {/* Active Goals */}
      <div className="space-y-6">
        {goals
          .filter(goal => !selectedCategory || goal.category === selectedCategory)
          .map(goal => (
            <div key={goal.id} className="bg-[#151C2C] p-6 rounded-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1A2234] p-3 rounded-lg">
                    {categoryIcons[goal.category]}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{goal.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Due {formatShortDate(goal.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Trophy className="w-4 h-4" />
                        <span>Target: {goal.target} {goal.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {getStatusIcon(goal.status)}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400">Progress</div>
                  <div className="text-white">{goal.current} / {goal.target} {goal.unit}</div>
                </div>
                <div className="h-2 bg-[#1A2234] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              </div>

              {/* Check-ins Graph */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-400">Recent Check-ins</div>
                  <button className="text-blue-500 hover:text-blue-400 text-sm">View All</button>
                </div>
                <div className="flex justify-between items-end h-24">
                  {goal.checkIns.map((checkIn, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-gray-400 mb-1">
                        {formatChartDate(checkIn.date)}
                      </div>
                      <div
                        className="w-8 bg-blue-600 rounded-t"
                        style={{
                          height: `${(checkIn.value / goal.target) * 100}%`,
                          minHeight: '10px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Goal</h2>
              <button
                onClick={() => setShowAddGoal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Goal Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  placeholder="E.g., Bench Press Target"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Category</label>
                <select className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500">
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Target Value</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Unit</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                    placeholder="kg, min, km, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Target Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Starting Value</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  placeholder="Your current level"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
