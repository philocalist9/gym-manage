"use client";

import React, { useState } from 'react';
import { X as XIcon, Save } from 'lucide-react';

interface HealthCheckInModalProps {
  onClose: () => void;
  onSave: (data: HealthCheckInData) => void;
}

interface HealthCheckInData {
  weight: number;
  waterIntake: number;
  mood: 'Great' | 'Good' | 'Okay' | 'Poor';
  sleepHours: number;
}

export default function HealthCheckInModal({ onClose, onSave }: HealthCheckInModalProps) {
  const [formData, setFormData] = useState<HealthCheckInData>({
    weight: 75,
    waterIntake: 2000,
    mood: 'Good',
    sleepHours: 7
  });

  const moodEmojis = {
    Great: '😄',
    Good: '🙂',
    Okay: '😐',
    Poor: '😞'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Daily Health Check-In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Water Intake (ml)</label>
            <input
              type="number"
              step="100"
              value={formData.waterIntake}
              onChange={(e) => setFormData({ ...formData, waterIntake: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Mood</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: mood as any })}
                  className={`p-3 rounded-lg ${
                    formData.mood === mood
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1A2234] text-gray-400 hover:bg-[#1F2937]'
                  }`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-xs">{mood}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Sleep Hours</label>
            <input
              type="number"
              step="0.5"
              value={formData.sleepHours}
              onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
