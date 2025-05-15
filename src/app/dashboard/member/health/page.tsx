"use client";

import React, { useState } from 'react';
import { 
  Heart, 
  Moon, 
  Droplets, 
  Scale, 
  Battery, 
  Apple, 
  Smile, 
  Check, 
  Calendar,
  Clock,
  Plus
} from 'lucide-react';

interface HealthMetrics {
  date: string;
  time: string;
  weight: number;
  sleep: number;
  water: number;
  energy: number;
  stress: number;
  mood: 'great' | 'good' | 'okay' | 'poor';
  nutrition: {
    meals: number;
    quality: number;
  };
}

export default function DailyHealthCheckIn() {
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const healthData: HealthMetrics[] = [
    {
      date: '2025-05-15',
      time: '08:00',
      weight: 78,
      sleep: 7.5,
      water: 2.5,
      energy: 8,
      stress: 3,
      mood: 'great',
      nutrition: {
        meals: 3,
        quality: 9
      }
    }
  ];

  const moodEmojis = {
    great: '😃',
    good: '🙂',
    okay: '😐',
    poor: '😕'
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Daily Health Check-In</h1>
          <p className="text-gray-400">Track your daily wellness metrics</p>
        </div>
        <button
          onClick={() => setShowCheckInModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Check-In
        </button>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Sleep Quality</div>
            <Moon className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{healthData[0].sleep} hrs</div>
          <div className="text-sm text-blue-500 mt-2">
            {healthData[0].sleep >= 7 ? 'Good sleep duration' : 'Below recommended'}
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Water Intake</div>
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{healthData[0].water}L</div>
          <div className="text-sm text-blue-500 mt-2">
            {healthData[0].water >= 2.5 ? 'Well hydrated' : 'Drink more water'}
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Energy Level</div>
            <Battery className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{healthData[0].energy}/10</div>
          <div className="text-sm text-green-500 mt-2">
            {healthData[0].energy >= 7 ? 'High energy' : 'Below average'}
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Stress Level</div>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{healthData[0].stress}/10</div>
          <div className="text-sm text-green-500 mt-2">
            {healthData[0].stress <= 4 ? 'Low stress' : 'High stress'}
          </div>
        </div>
      </div>

      {/* Detailed Health Card */}
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium text-white">Today's Health Summary</h2>
            <p className="text-gray-400 text-sm">Last check-in: {healthData[0].time}</p>
          </div>
          <div className="text-4xl">{moodEmojis[healthData[0].mood]}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metrics */}
          <div className="space-y-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-400">Mood</div>
                <div className="text-white capitalize">{healthData[0].mood}</div>
              </div>
              <div className="h-2 bg-[#151C2C] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${
                    (healthData[0].mood === 'great' ? 100 :
                     healthData[0].mood === 'good' ? 75 :
                     healthData[0].mood === 'okay' ? 50 : 25)}%`
                  }}
                />
              </div>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-400">Nutrition Quality</div>
                <div className="text-white">{healthData[0].nutrition.quality}/10</div>
              </div>
              <div className="h-2 bg-[#151C2C] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${(healthData[0].nutrition.quality / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-gray-400">Meals Tracked</div>
                <div className="text-white">{healthData[0].nutrition.meals} meals</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-4">Daily Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Get 7-9 hours of sleep tonight</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Increase water intake to 3L</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Take regular breaks to manage stress</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Include protein in your next meal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Health Check-In</h2>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Sleep Duration (hours)</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Water Intake (L)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Energy Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Stress Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Mood</label>
                <select className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500">
                  <option value="great">Great 😃</option>
                  <option value="good">Good 🙂</option>
                  <option value="okay">Okay 😐</option>
                  <option value="poor">Poor 😕</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Nutrition Quality (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Meals Today</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
