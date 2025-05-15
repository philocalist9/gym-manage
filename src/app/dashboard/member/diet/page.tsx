"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Apple, Coffee, Pizza } from 'lucide-react';

interface MealEntry {
  id: string;
  meal: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  date: string;
}

export default function DietLog() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [entries, setEntries] = useState<MealEntry[]>([
    {
      id: '1',
      meal: 'Breakfast',
      food: 'Oatmeal with banana and honey',
      calories: 350,
      protein: 12,
      carbs: 65,
      fat: 6,
      time: '08:00',
      date: '2025-05-15'
    },
    {
      id: '2',
      meal: 'Lunch',
      food: 'Grilled chicken salad',
      calories: 450,
      protein: 40,
      carbs: 25,
      fat: 22,
      time: '13:00',
      date: '2025-05-15'
    }
  ]);

  const dailyTotals = entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    protein: acc.protein + entry.protein,
    carbs: acc.carbs + entry.carbs,
    fat: acc.fat + entry.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const goals = {
    calories: 2500,
    protein: 180,
    carbs: 300,
    fat: 70
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Diet & Nutrition Log</h1>
          <p className="text-gray-400">Track your daily nutrition intake</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Log Meal
        </button>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Calories</div>
            <Apple className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{dailyTotals.calories}</div>
          <div className="text-sm text-gray-400 mt-2">Goal: {goals.calories}</div>
          <div className="mt-2 h-2 bg-[#1A2234] rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${Math.min((dailyTotals.calories / goals.calories) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Protein</div>
            <Coffee className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{dailyTotals.protein}g</div>
          <div className="text-sm text-gray-400 mt-2">Goal: {goals.protein}g</div>
          <div className="mt-2 h-2 bg-[#1A2234] rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${Math.min((dailyTotals.protein / goals.protein) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Carbs</div>
            <Pizza className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{dailyTotals.carbs}g</div>
          <div className="text-sm text-gray-400 mt-2">Goal: {goals.carbs}g</div>
          <div className="mt-2 h-2 bg-[#1A2234] rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-600 rounded-full"
              style={{ width: `${Math.min((dailyTotals.carbs / goals.carbs) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Fat</div>
            <div className="w-5 h-5 text-red-500">🥑</div>
          </div>
          <div className="text-2xl font-semibold text-white">{dailyTotals.fat}g</div>
          <div className="text-sm text-gray-400 mt-2">Goal: {goals.fat}g</div>
          <div className="mt-2 h-2 bg-[#1A2234] rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 rounded-full"
              style={{ width: `${Math.min((dailyTotals.fat / goals.fat) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search meals..."
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] text-white rounded-lg border border-gray-800 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-400 rounded-lg hover:text-white transition-colors">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Meal Entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-[#151C2C] p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">{entry.meal}</h3>
                <p className="text-gray-400">{entry.food}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{entry.time}</div>
                <div className="text-gray-400 text-sm">{entry.calories} kcal</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-gray-400 text-sm">Protein</div>
                <div className="text-white">{entry.protein}g</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Carbs</div>
                <div className="text-white">{entry.carbs}g</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Fat</div>
                <div className="text-white">{entry.fat}g</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-6">Log a Meal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Meal Type</label>
                <select className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500">
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Food Items</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  placeholder="E.g., Grilled chicken with rice"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Calories</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Protein (g)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Fat (g)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
