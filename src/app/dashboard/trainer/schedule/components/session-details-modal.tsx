"use client";

import React from "react";
import { X } from "lucide-react";

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

interface Session {
  id: string;
  clientName: string;
  time: string;
  duration: string;
  type: string;
  notes?: string;
}

export default function SessionDetailsModal({ isOpen, onClose, session }: SessionDetailsModalProps) {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Session Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Client</p>
              <p className="text-gray-200 font-medium">{session.clientName}</p>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Session Type</p>
              <span className={`px-2 py-1 rounded-lg text-sm font-medium
                ${session.type === "Weight Training"
                  ? "bg-blue-500/10 text-blue-500"
                  : session.type === "HIIT"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-purple-500/10 text-purple-500"
                }`}>
                {session.type}
              </span>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Time</p>
              <p className="text-gray-200 font-medium">
                {new Date(session.time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Duration</p>
              <p className="text-gray-200 font-medium">{session.duration}</p>
            </div>
          </div>

          {session.notes && (
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Session Notes</p>
              <p className="text-gray-200">{session.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Session
          </button>
        </div>
      </div>
    </div>
  );
}
