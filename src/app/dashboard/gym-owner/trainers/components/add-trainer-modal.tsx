"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trainer: Omit<Trainer, "_id">) => void;
}

interface Trainer {
  _id: string;
  name: string;
  email: string;
  password: string;
  specialization: string;
  phone?: string;
  bio: string;
  experience: number;
  salary?: number; // Salary in Indian Rupees (₹)
  totalClients: number;
  rating: number;
  joinDate: string;
}

export default function AddTrainerModal({ isOpen, onClose, onAdd }: AddTrainerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    bio: "",
    experience: 0,
    salary: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      experience: Number(formData.experience), // Ensure experience is a number
      salary: Number(formData.salary), // Ensure salary is a number
      totalClients: 0,
      rating: 5.0,
      joinDate: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">Add New Trainer</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-400 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-400 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  id="experience"
                  required
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-400 mb-1">
                  Salary (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="salary"
                    min="0"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter monthly salary"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio field takes full width */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              rows={3}
              placeholder="Brief professional description of the trainer"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Trainer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
