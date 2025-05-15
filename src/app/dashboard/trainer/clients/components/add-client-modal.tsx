"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Omit<Client, "id">) => void;
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

export default function AddClientModal({ isOpen, onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plan: "Weight Loss" as const,
    goals: [""] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    onAdd({
      ...formData,
      status: "Active",
      startDate: now.toISOString(),
      nextSession: nextWeek.toISOString(),
      progress: 0,
      lastWorkout: now.toISOString(),
      goals: formData.goals.filter(goal => goal.trim() !== "")
    });

    setFormData({
      name: "",
      email: "",
      plan: "Weight Loss",
      goals: [""]
    });
    onClose();
  };

  const addGoalField = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, ""]
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Client</h2>
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
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Training Plan
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="General Fitness">General Fitness</option>
                <option value="Athletic Performance">Athletic Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Training Goals
              </label>
              <div className="space-y-2">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      placeholder="Enter a goal"
                      className="flex-1 px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    {formData.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="p-2 text-red-500 hover:bg-[#1A2234] rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGoalField}
                  className="w-full px-4 py-2 text-sm text-blue-500 hover:bg-[#1A2234] rounded-lg transition-colors"
                >
                  + Add Another Goal
                </button>
              </div>
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
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
