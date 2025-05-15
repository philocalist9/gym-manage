"use client";

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar, Activity, Scale, Ruler, ChevronDown, Camera, Upload, ArrowUp, ArrowDown } from 'lucide-react';

interface ProgressData {
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    biceps: number;
    thighs: number;
  };
}

interface Milestone {
  metric: string;
  target: number;
  current: number;
  unit: string;
  date: string;
}

export default function ProgressTracker() {
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const progressData: ProgressData[] = [
    {
      date: '2025-01-15',
      weight: 85,
      bodyFat: 25,
      muscle: 32,
      measurements: { chest: 100, waist: 90, hips: 100, biceps: 35, thighs: 60 }
    },
    {
      date: '2025-02-15',
      weight: 83,
      bodyFat: 24,
      muscle: 33,
      measurements: { chest: 99, waist: 88, hips: 99, biceps: 36, thighs: 61 }
    },
    {
      date: '2025-03-15',
      weight: 81,
      bodyFat: 22,
      muscle: 34,
      measurements: { chest: 98, waist: 86, hips: 98, biceps: 37, thighs: 62 }
    },
    {
      date: '2025-04-15',
      weight: 79,
      bodyFat: 20,
      muscle: 35,
      measurements: { chest: 97, waist: 84, hips: 97, biceps: 38, thighs: 63 }
    },
    {
      date: '2025-05-15',
      weight: 78,
      bodyFat: 19,
      muscle: 36,
      measurements: { chest: 96, waist: 82, hips: 96, biceps: 39, thighs: 64 }
    }
  ];

  const milestones: Milestone[] = [
    { metric: 'Weight', target: 75, current: 78, unit: 'kg', date: '2025-07-15' },
    { metric: 'Body Fat', target: 15, current: 19, unit: '%', date: '2025-07-15' },
    { metric: 'Muscle Mass', target: 40, current: 36, unit: '%', date: '2025-07-15' }
  ];

  const latestProgress = {
    weight: {
      current: progressData[progressData.length - 1].weight,
      previous: progressData[progressData.length - 2].weight
    },
    bodyFat: {
      current: progressData[progressData.length - 1].bodyFat,
      previous: progressData[progressData.length - 2].bodyFat
    },
    muscle: {
      current: progressData[progressData.length - 1].muscle,
      previous: progressData[progressData.length - 2].muscle
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Progress Tracker</h1>
          <p className="text-gray-400">Track your fitness journey progress</p>
        </div>
        <button
          onClick={() => setShowPhotoUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Camera className="w-5 h-5" />
          Progress Photo
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Current Weight</div>
            <Scale className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{latestProgress.weight.current} kg</div>
          <div className={`text-sm flex items-center gap-1 mt-2 
            ${latestProgress.weight.current < latestProgress.weight.previous ? 'text-green-500' : 'text-red-500'}`}
          >
            {latestProgress.weight.current < latestProgress.weight.previous ? (
              <ArrowDown className="w-4 h-4" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
            {Math.abs(latestProgress.weight.current - latestProgress.weight.previous).toFixed(1)} kg
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Body Fat %</div>
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{latestProgress.bodyFat.current}%</div>
          <div className={`text-sm flex items-center gap-1 mt-2 
            ${latestProgress.bodyFat.current < latestProgress.bodyFat.previous ? 'text-green-500' : 'text-red-500'}`}
          >
            {latestProgress.bodyFat.current < latestProgress.bodyFat.previous ? (
              <ArrowDown className="w-4 h-4" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
            {Math.abs(latestProgress.bodyFat.current - latestProgress.bodyFat.previous).toFixed(1)}%
          </div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Muscle Mass</div>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{latestProgress.muscle.current}%</div>
          <div className={`text-sm flex items-center gap-1 mt-2 
            ${latestProgress.muscle.current > latestProgress.muscle.previous ? 'text-green-500' : 'text-red-500'}`}
          >
            {latestProgress.muscle.current > latestProgress.muscle.previous ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {Math.abs(latestProgress.muscle.current - latestProgress.muscle.previous).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Progress Overview</h2>
            <div className="flex gap-2">
              {['1M', '3M', '6M', '1Y'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1A2234] text-gray-400 hover:text-white'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                <XAxis
                  dataKey="date"
                  stroke="#4B5563"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#4B5563" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  formatter={(value: number) => [`${value}`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} name="Weight (kg)" />
                <Line type="monotone" dataKey="bodyFat" stroke="#EF4444" strokeWidth={2} name="Body Fat %" />
                <Line type="monotone" dataKey="muscle" stroke="#10B981" strokeWidth={2} name="Muscle Mass %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <h2 className="text-lg font-medium text-white mb-4">Goal Progress</h2>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white">{milestone.metric}</div>
                <div className="text-gray-400">
                  Target: {milestone.target}{milestone.unit} by {new Date(milestone.date).toLocaleDateString()}
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Current: {milestone.current}{milestone.unit}
                  </div>
                  <div className="text-xs text-gray-400">
                    {((milestone.current / milestone.target) * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-[#151C2C]">
                  <div
                    style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body Measurements */}
      <div className="bg-[#151C2C] p-6 rounded-xl">
        <button
          onClick={() => setShowMeasurements(!showMeasurements)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium text-white">Body Measurements</h2>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform 
            ${showMeasurements ? 'rotate-180' : ''}`}
          />
        </button>

        {showMeasurements && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                    <XAxis
                      dataKey="date"
                      stroke="#4B5563"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { month: 'short' })}
                    />
                    <YAxis stroke="#4B5563" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Bar dataKey="measurements.chest" name="Chest" fill="#3B82F6" />
                    <Bar dataKey="measurements.waist" name="Waist" fill="#EF4444" />
                    <Bar dataKey="measurements.hips" name="Hips" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {Object.entries(progressData[progressData.length - 1].measurements).map(([key, value]) => (
                  <div key={key} className="bg-[#1A2234] p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-400 capitalize">{key}</div>
                      <div className="text-white">{value} cm</div>
                    </div>
                    <div className="text-sm text-blue-500 mt-1">
                      {(value - progressData[progressData.length - 2].measurements[key as keyof typeof progressData[0]['measurements']]).toFixed(1)} cm change
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Upload Progress Photo</h2>
              <button
                onClick={() => setShowPhotoUpload(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Drag and drop your photo here, or click to select</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upload Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
