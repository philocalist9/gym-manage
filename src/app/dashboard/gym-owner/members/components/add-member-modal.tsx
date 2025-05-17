"use client";

import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Omit<Member, "_id">) => Promise<void>;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  password: string;
  memberNumber: string; // Add this field
  membershipType: "Basic" | "Premium" | "VIP";
  status: "Active" | "Inactive" | "Pending";
  joiningDate: string;
  nextPayment: string;
  trainer: string;
  attendance: number;
}

interface Trainer {
  _id: string;
  name: string;
}

export default function AddMemberModal({ isOpen, onClose, onAdd }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    membershipType: "Basic" as "Basic" | "Premium" | "VIP",
    trainer: "",
  });
  const [loading, setLoading] = useState(false);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch trainers for the dropdown
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('/api/trainers');
        if (!response.ok) throw new Error('Failed to fetch trainers');
        
        const data = await response.json();
        setTrainers(data.trainers || []);
      } catch (err) {
        console.error('Error fetching trainers:', err);
      }
    };
    
    if (isOpen) {
      fetchTrainers();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const currentDate = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    try {
      await onAdd({
        ...formData,
        status: "Active",
        joiningDate: currentDate.toISOString(),
        nextPayment: nextMonth.toISOString(),
        attendance: 100, // Initial attendance rate
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        membershipType: "Basic",
        trainer: "",
      });
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Member</h2>
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
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Member Number
              </label>
              <div className="w-full px-4 py-2 bg-[#131826] border border-gray-800 rounded-lg text-gray-400 flex items-center">
                <span>Auto-generated 6-digit number</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">A unique 6-digit number will be assigned automatically</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Membership Type
              </label>
              <select
                value={formData.membershipType}
                onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as "Basic" | "Premium" | "VIP" })}
                required
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Assigned Trainer
              </label>
              <select
                value={formData.trainer}
                onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">No Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>              <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  <span>Adding...</span>
                </>
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
