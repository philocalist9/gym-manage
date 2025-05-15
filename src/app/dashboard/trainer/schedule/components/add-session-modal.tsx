"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (session: Omit<Session, "id">) => void;
  selectedDate: Date;
}

interface Session {
  id: string;
  clientName: string;
  time: string;
  duration: string;
  type: string;
  notes?: string;
}

const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00"
];

const sessionTypes = [
  "Weight Training",
  "HIIT",
  "Strength Training",
  "Cardio",
  "Flexibility",
  "Recovery"
];

export default function AddSessionModal({ isOpen, onClose, onAdd, selectedDate }: AddSessionModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    time: timeSlots[0],
    duration: "1 hour",
    type: "Weight Training",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = selectedDate;
    const [hours, minutes] = formData.time.split(":");
    date.setHours(parseInt(hours), parseInt(minutes));

    onAdd({
      ...formData,
      time: date.toISOString()
    });

    setFormData({
      clientName: "",
      time: timeSlots[0],
      duration: "1 hour",
      type: "Weight Training",
      notes: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Session</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Time
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Session Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
              >
                {sessionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
