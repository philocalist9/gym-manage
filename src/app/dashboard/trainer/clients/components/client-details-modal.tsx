"use client";

import React, { useState } from "react";
import { X, FileText, BarChart2, Calendar, Target, Users, ClipboardList } from "lucide-react";
import GenerateReportModal from "./generate-report-modal";
import AssignWorkoutModal from "./assign-workout-modal";

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

interface Client {
  id: string;
  name: string;
  email: string;
  plan: "Weight Loss" | "Muscle Gain" | "General Fitness" | "Athletic Performance";
  status: "Active" | "On Hold" | "Completed";
  startDate: string;
  nextSession: string;
  progress: number;
  goals: string[];
  lastWorkout: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export default function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false);

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-medium">
            {client.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{client.name}</h2>
            <p className="text-gray-400">{client.email}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">Overall Progress</h3>
            <span className="text-gray-200">{client.progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${client.progress}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Training Plan</p>
            <span className={`px-2 py-1 rounded-lg text-sm font-medium
              ${client.plan === "Weight Loss" 
                ? "bg-green-500/10 text-green-500"
                : client.plan === "Muscle Gain"
                ? "bg-blue-500/10 text-blue-500"
                : client.plan === "Athletic Performance"
                ? "bg-purple-500/10 text-purple-500"
                : "bg-gray-500/10 text-gray-300"
              }`}>
              {client.plan}
            </span>
          </div>

          <div className="bg-[#1A2234] p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <span className={`px-2 py-1 rounded-lg text-sm font-medium
              ${client.status === "Active" 
                ? "bg-green-500/10 text-green-500"
                : client.status === "On Hold"
                ? "bg-yellow-500/10 text-yellow-500"
                : "bg-blue-500/10 text-blue-500"
              }`}>
              {client.status}
            </span>
          </div>

          <div className="bg-[#1A2234] p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Start Date</p>
            <p className="text-gray-200">{formatDate(client.startDate)}</p>
          </div>

          <div className="bg-[#1A2234] p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Next Session</p>
            <p className="text-gray-200">{formatDate(client.nextSession)}</p>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-[#1A2234] p-4 rounded-lg mb-6">
          <h3 className="text-white font-medium mb-3">Training Goals</h3>
          <ul className="space-y-2">
            {client.goals.map((goal, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-200">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => setIsAssignWorkoutOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors"
          >
            <ClipboardList className="w-5 h-5" />
            <span>Assign Workout</span>
          </button>
          <button
            onClick={() => setIsGenerateReportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <GenerateReportModal
        isOpen={isGenerateReportOpen}
        onClose={() => setIsGenerateReportOpen(false)}
        clientId={client.id}
        clientName={client.name}
      />
      
      <AssignWorkoutModal
        isOpen={isAssignWorkoutOpen}
        onClose={() => setIsAssignWorkoutOpen(false)}
        clientId={client.id}
        onAssign={(workoutIds) => {
          console.log("Assigning workouts:", workoutIds);
          setIsAssignWorkoutOpen(false);
        }}
      />
    </div>
  );
}
