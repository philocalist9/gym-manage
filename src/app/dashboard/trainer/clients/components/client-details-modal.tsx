"use client";

import React, { useState, useCallback } from "react";
import { X, FileText } from "lucide-react";
import GenerateReportModal from "./generate-report-modal";

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
  sessionsCompleted?: number;
  sessionsUpcoming?: number;
  isAssigned?: boolean;
  originalData?: Record<string, unknown>;
}

// Move formatDate outside the component to prevent it from being recreated on every render
// Memoize the function to avoid repeated calculations
const formatDate = (dateString: string) => {
  // Check if the string is a special status message
  if (dateString === "No upcoming sessions" || dateString === "Not available" || !dateString) {
    return dateString;
  }
  
  // Try parsing the date string
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return the original string if parsing failed
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export default function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  // Use state for modals
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  
  // Using useCallback with empty deps array to ensure these functions are stable 
  // across renders and don't cause infinite loops
  const handleOpenGenerateReport = useCallback(() => {
    setIsGenerateReportOpen(true);
  }, []);
  
  const handleCloseGenerateReport = useCallback(() => {
    setIsGenerateReportOpen(false);
  }, []);
  
  // Cancel any state changes if the modal is not open
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
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              {client.name}
              {client.isAssigned && (
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-xs font-medium rounded-full">
                  Assigned
                </span>
              )}
            </h2>
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
            <p className="text-gray-200">
              {client.nextSession === "No upcoming sessions" || client.nextSession === "Not available"
                ? client.nextSession
                : formatDate(client.nextSession)}
            </p>
          </div>
          
          {/* Additional session statistics */}
          {(client.sessionsCompleted !== undefined || client.sessionsUpcoming !== undefined) && (
            <>
              <div className="bg-[#1A2234] p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Completed Sessions</p>
                <p className="text-gray-200">
                  <span className="text-green-500 font-medium">{client.sessionsCompleted || 0}</span>
                </p>
              </div>

              <div className="bg-[#1A2234] p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Upcoming Sessions</p>
                <p className="text-gray-200">
                  <span className="text-blue-500 font-medium">{client.sessionsUpcoming || 0}</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Goals Section */}
        <div className="bg-[#1A2234] p-4 rounded-lg mb-6">
          <h3 className="text-white font-medium mb-3">Training Goals</h3>
          {client.goals && client.goals.length > 0 ? (
            <ul className="space-y-2">
              {client.goals.map((goal, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {goal}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No goals specified yet</p>
          )}
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
            onClick={handleOpenGenerateReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Only render modals when they're needed to avoid unnecessary renders */}
      {isGenerateReportOpen && (
        <GenerateReportModal
          isOpen={true}
          onClose={handleCloseGenerateReport}
          clientId={client.id}
          clientName={client.name}
        />
      )}
    </div>
  );
}
