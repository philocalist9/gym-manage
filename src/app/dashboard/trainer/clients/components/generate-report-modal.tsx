"use client";

import React, { useState } from 'react';
import { Download, Calendar, BarChart2, Target, Activity } from 'lucide-react';

interface ProgressReport {
  clientId: string;
  clientName: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalSessions: number;
    completionRate: number;
    avgRating: number;
  };
  goals: {
    description: string;
    progress: number;
    status: "Achieved" | "In Progress" | "Not Started";
  }[];
  measurements: {
    date: string;
    weight?: number;
    bodyFat?: number;
    measurements?: Record<string, number>;
  }[];
  workoutProgress: {
    exercise: string;
    progress: {
      date: string;
      weight: number;
      reps: number;
    }[];
  }[];
}

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export default function GenerateReportModal({
  isOpen,
  onClose,
  clientId,
  clientName
}: GenerateReportModalProps) {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [includeSections, setIncludeSections] = useState({
    summary: true,
    goals: true,
    measurements: true,
    workoutProgress: true,
    attendance: true,
  });

  const handleGenerateReport = async () => {
    // In a real application, this would call an API endpoint to generate the report
    const sampleReport: ProgressReport = {
      clientId,
      clientName,
      period: {
        start: dateRange === 'custom' ? customStartDate : new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
        end: dateRange === 'custom' ? customEndDate : new Date().toISOString()
      },
      summary: {
        totalSessions: 12,
        completionRate: 92,
        avgRating: 4.8
      },
      goals: [
        {
          description: "Lose 10kg",
          progress: 60,
          status: "In Progress"
        },
        {
          description: "Improve endurance",
          progress: 75,
          status: "In Progress"
        }
      ],
      measurements: [
        {
          date: "2025-04-15",
          weight: 75,
          bodyFat: 18,
          measurements: {
            chest: 95,
            waist: 80,
            hips: 95
          }
        },
        {
          date: "2025-05-15",
          weight: 73,
          bodyFat: 17,
          measurements: {
            chest: 94,
            waist: 78,
            hips: 94
          }
        }
      ],
      workoutProgress: [
        {
          exercise: "Bench Press",
          progress: [
            { date: "2025-04-15", weight: 60, reps: 8 },
            { date: "2025-05-15", weight: 70, reps: 8 }
          ]
        },
        {
          exercise: "Squats",
          progress: [
            { date: "2025-04-15", weight: 80, reps: 8 },
            { date: "2025-05-15", weight: 90, reps: 8 }
          ]
        }
      ]
    };

    // Generate PDF or downloadable format
    console.log("Generating report:", sampleReport);
    
    // Close modal after generation
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Generate Progress Report</h2>

        {/* Date Range Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Report Period
          </label>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1A2234] text-gray-400 hover:text-white'
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1A2234] text-gray-400 hover:text-white'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'quarter'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1A2234] text-gray-400 hover:text-white'
              }`}
            >
              Last Quarter
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1A2234] text-gray-400 hover:text-white'
              }`}
            >
              Custom
            </button>
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Report Sections */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Include Sections
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeSections.summary}
                onChange={(e) => setIncludeSections({
                  ...includeSections,
                  summary: e.target.checked
                })}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-[#1A2234] focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-200">Performance Summary</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeSections.goals}
                onChange={(e) => setIncludeSections({
                  ...includeSections,
                  goals: e.target.checked
                })}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-[#1A2234] focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-200">Goals Progress</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeSections.measurements}
                onChange={(e) => setIncludeSections({
                  ...includeSections,
                  measurements: e.target.checked
                })}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-[#1A2234] focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-200">Body Measurements</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeSections.workoutProgress}
                onChange={(e) => setIncludeSections({
                  ...includeSections,
                  workoutProgress: e.target.checked
                })}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-[#1A2234] focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-200">Workout Progress</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeSections.attendance}
                onChange={(e) => setIncludeSections({
                  ...includeSections,
                  attendance: e.target.checked
                })}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-[#1A2234] focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-200">Session Attendance</span>
            </label>
          </div>
        </div>

        {/* Preview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Period</span>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-white">
              {dateRange === 'custom'
                ? `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
                : `Last ${dateRange}`}
            </p>
          </div>
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Sections</span>
              <BarChart2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-white">
              {Object.values(includeSections).filter(Boolean).length} selected
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
